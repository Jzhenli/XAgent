import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useScadaStore } from '@/stores/scada'
import type { ScadaComponent, GuideLine, CanvasPosition, ResizeHandle } from '../types'
import { getCanvasPosition, getCanvasPositionFromEvent } from '../utils/dom'
import { clamp } from '../utils/math'

export function useScadaCanvas(canvasRef: { value: HTMLElement | null }) {
  const scadaStore = useScadaStore()

  const isDragging = ref(false)
  const isResizing = ref(false)
  const dragStartPos = ref<CanvasPosition>({ x: 0, y: 0 })
  const componentStartPos = ref<CanvasPosition>({ x: 0, y: 0 })
  const resizeStartSize = ref({ width: 0, height: 0 })
  const resizeHandle = ref<ResizeHandle | null>(null)

  const isBoxSelecting = ref(false)
  const boxSelectStart = ref<CanvasPosition>({ x: 0, y: 0 })
  const boxSelectEnd = ref<CanvasPosition>({ x: 0, y: 0 })
  const justFinishedBoxSelect = ref(false)

  let multiDragStartPositions: Map<string, CanvasPosition> = new Map()
  let multiDragStartBBox: {
    minX: number
    centerX: number
    maxX: number
    minY: number
    middleY: number
    maxY: number
  } | null = null

  const guideLines = ref<GuideLine[]>([])

  const mouseCanvasPos = ref<CanvasPosition>({ x: 0, y: 0 })
  const isMouseOnCanvas = ref(false)

  const contextMenuVisible = ref(false)
  const contextMenuPosition = ref<CanvasPosition>({ x: 0, y: 0 })
  const contextMenuTargetId = ref<string | null>(null)
  const contextMenuType = ref<'node' | 'canvas'>('canvas')

  const panel = computed(() => scadaStore.currentPanel)
  const components = computed(() => panel.value?.components || [])
  const selectedId = computed(() => scadaStore.selectedComponentId)
  const selectedIds = computed(() => scadaStore.selectedComponentIds)
  const isEditing = computed(() => scadaStore.isEditing)

  const targetComponent = computed(() => {
    if (!contextMenuTargetId.value || !panel.value) return null
    return panel.value.components.find(c => c.id === contextMenuTargetId.value) || null
  })

  const getComponentStyle = (comp: ScadaComponent) => ({
    left: `${comp.x}px`,
    top: `${comp.y}px`,
    width: `${comp.style.width}px`,
    height: `${comp.style.height}px`,
    opacity: comp.style.opacity || 1,
    zIndex: components.value.indexOf(comp)
  })

  const handleCanvasMouseMove = (e: MouseEvent) => {
    if (!canvasRef.value) return
    mouseCanvasPos.value = getCanvasPositionFromEvent(canvasRef.value, e, scadaStore.zoom)
  }

  const handleCanvasMouseEnter = () => {
    isMouseOnCanvas.value = true
  }

  const handleCanvasMouseLeave = () => {
    isMouseOnCanvas.value = false
  }

  const collectAlignmentTargets = (excludeIds: string[]) => {
    const targets: { x: number[]; y: number[] }[] = []
    components.value.forEach(c => {
      if (excludeIds.includes(c.id)) return
      targets.push({
        x: [c.x, c.x + c.style.width / 2, c.x + c.style.width],
        y: [c.y, c.y + c.style.height / 2, c.y + c.style.height]
      })
    })
    return targets
  }

  const snapOffset = (
    positions: number[],
    targets: number[],
    threshold: number
  ): { offset: number; linePos: number | null } => {
    let bestDelta = 0
    let bestDist = threshold + 1
    let bestTarget: number | null = null

    positions.forEach(pos => {
      targets.forEach(target => {
        const delta = pos - target
        const dist = Math.abs(delta)
        if (dist <= threshold && dist < bestDist) {
          bestDist = dist
          bestDelta = delta
          bestTarget = target
        }
      })
    })

    return { offset: -bestDelta, linePos: bestTarget }
  }

  const computeSingleSnap = (comp: ScadaComponent, rawX: number, rawY: number) => {
    const w = comp.style.width
    const h = comp.style.height
    const threshold = 5 / scadaStore.zoom
    const targets = collectAlignmentTargets([comp.id])
    const xTargets = targets.map(t => t.x).flat()
    const yTargets = targets.map(t => t.y).flat()

    if (panel.value) {
      xTargets.push(panel.value.width / 2)
      yTargets.push(panel.value.height / 2)
    }

    const snapX = snapOffset([rawX, rawX + w / 2, rawX + w], xTargets, threshold)
    const snapY = snapOffset([rawY, rawY + h / 2, rawY + h], yTargets, threshold)

    const lines: GuideLine[] = []
    if (snapX.linePos !== null) lines.push({ type: 'x', pos: snapX.linePos })
    if (snapY.linePos !== null) lines.push({ type: 'y', pos: snapY.linePos })

    return { x: rawX + snapX.offset, y: rawY + snapY.offset, lines }
  }

  const computeMultiSnap = (dx: number, dy: number) => {
    if (!multiDragStartBBox) return { snapDx: dx, snapDy: dy, lines: [] as GuideLine[] }

    const threshold = 5 / scadaStore.zoom
    const targets = collectAlignmentTargets(selectedIds.value)
    const xTargets = targets.map(t => t.x).flat()
    const yTargets = targets.map(t => t.y).flat()

    if (panel.value) {
      xTargets.push(panel.value.width / 2)
      yTargets.push(panel.value.height / 2)
    }

    const snapX = snapOffset(
      [
        multiDragStartBBox.minX + dx,
        multiDragStartBBox.centerX + dx,
        multiDragStartBBox.maxX + dx
      ],
      xTargets,
      threshold
    )
    const snapY = snapOffset(
      [
        multiDragStartBBox.minY + dy,
        multiDragStartBBox.middleY + dy,
        multiDragStartBBox.maxY + dy
      ],
      yTargets,
      threshold
    )

    const lines: GuideLine[] = []
    if (snapX.linePos !== null) lines.push({ type: 'x', pos: snapX.linePos })
    if (snapY.linePos !== null) lines.push({ type: 'y', pos: snapY.linePos })

    return { snapDx: dx + snapX.offset, snapDy: dy + snapY.offset, lines }
  }

  const handleDragMove = (dx: number, dy: number) => {
    guideLines.value = []

    if (selectedIds.value.length > 1 && multiDragStartPositions.size > 0) {
      const { snapDx, snapDy, lines } = computeMultiSnap(dx, dy)
      guideLines.value = lines
      selectedIds.value.forEach(id => {
        const startPos = multiDragStartPositions.get(id)
        if (startPos) {
          scadaStore.moveComponent(id, Math.max(0, startPos.x + snapDx), Math.max(0, startPos.y + snapDy))
        }
      })
      return
    }

    const comp = scadaStore.selectedComponent
    if (!selectedId.value || !comp) return

    const rawX = componentStartPos.value.x + dx
    const rawY = componentStartPos.value.y + dy
    const { x: snapX, y: snapY, lines } = computeSingleSnap(comp, rawX, rawY)
    guideLines.value = lines

    const newX = clamp(snapX, 0, panel.value!.width - comp.style.width)
    const newY = clamp(snapY, 0, panel.value!.height - comp.style.height)
    scadaStore.moveComponent(selectedId.value, newX, newY)
  }

  const handleResizeMove = (dx: number, dy: number) => {
    const comp = scadaStore.selectedComponent
    if (!comp || !resizeHandle.value || !selectedId.value) return

    let newWidth = resizeStartSize.value.width
    let newHeight = resizeStartSize.value.height

    if (resizeHandle.value.includes('e')) {
      newWidth = Math.max(50, resizeStartSize.value.width + dx)
    }
    if (resizeHandle.value.includes('s')) {
      newHeight = Math.max(50, resizeStartSize.value.height + dy)
    }
    if (resizeHandle.value.includes('w')) {
      newWidth = Math.max(50, resizeStartSize.value.width - dx)
    }
    if (resizeHandle.value.includes('n')) {
      newHeight = Math.max(50, resizeStartSize.value.height - dy)
    }

    scadaStore.resizeComponent(selectedId.value, newWidth, newHeight)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!selectedId.value || !panel.value) return

    const dx = (e.clientX - dragStartPos.value.x) / scadaStore.zoom
    const dy = (e.clientY - dragStartPos.value.y) / scadaStore.zoom

    if (isDragging.value) {
      handleDragMove(dx, dy)
    } else if (isResizing.value && resizeHandle.value) {
      handleResizeMove(dx, dy)
    }
  }

  const handleMouseUp = () => {
    isDragging.value = false
    isResizing.value = false
    resizeHandle.value = null
    multiDragStartPositions = new Map()
    multiDragStartBBox = null
    guideLines.value = []
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const handleComponentMouseDown = (e: MouseEvent, comp: ScadaComponent) => {
    if (!isEditing.value || comp.locked) return
    e.stopPropagation()

    if (selectedIds.value.length > 1 && selectedIds.value.includes(comp.id)) {
      isDragging.value = true
      dragStartPos.value = { x: e.clientX, y: e.clientY }

      multiDragStartPositions = new Map()
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity
      selectedIds.value.forEach(id => {
        const c = components.value.find(c => c.id === id)
        if (c) {
          multiDragStartPositions.set(id, { x: c.x, y: c.y })
          minX = Math.min(minX, c.x)
          minY = Math.min(minY, c.y)
          maxX = Math.max(maxX, c.x + c.style.width)
          maxY = Math.max(maxY, c.y + c.style.height)
        }
      })
      multiDragStartBBox = { minX, centerX: (minX + maxX) / 2, maxX, minY, middleY: (minY + maxY) / 2, maxY }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return
    }

    scadaStore.selectComponent(comp.id)
    isDragging.value = true
    dragStartPos.value = { x: e.clientX, y: e.clientY }
    componentStartPos.value = { x: comp.x, y: comp.y }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleResizeStart = (e: MouseEvent, handle: ResizeHandle) => {
    if (!isEditing.value || !scadaStore.selectedComponent) return
    e.stopPropagation()

    isResizing.value = true
    resizeHandle.value = handle
    dragStartPos.value = { x: e.clientX, y: e.clientY }
    resizeStartSize.value = {
      width: scadaStore.selectedComponent.style.width,
      height: scadaStore.selectedComponent.style.height
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleCanvasClick = (e: MouseEvent) => {
    if (justFinishedBoxSelect.value) {
      justFinishedBoxSelect.value = false
      return
    }

    if (e.target === canvasRef.value) {
      scadaStore.selectComponent(null)
    }
    hideContextMenu()
  }

  const handleCanvasMouseDown = (e: MouseEvent) => {
    if (!isEditing.value || e.target !== canvasRef.value) return
    if (e.button === 0 && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
      e.preventDefault()
      isBoxSelecting.value = true
      boxSelectStart.value = getCanvasPositionFromEvent(canvasRef.value, e, scadaStore.zoom)
      boxSelectEnd.value = { ...boxSelectStart.value }

      scadaStore.clearSelection()

      document.addEventListener('mousemove', handleBoxSelectMove)
      document.addEventListener('mouseup', handleBoxSelectUp)
    }
  }

  const handleBoxSelectMove = (e: MouseEvent) => {
    if (!isBoxSelecting.value || !canvasRef.value) return

    boxSelectEnd.value = getCanvasPositionFromEvent(canvasRef.value, e, scadaStore.zoom)

    const x1 = Math.min(boxSelectStart.value.x, boxSelectEnd.value.x)
    const y1 = Math.min(boxSelectStart.value.y, boxSelectEnd.value.y)
    const x2 = Math.max(boxSelectStart.value.x, boxSelectEnd.value.x)
    const y2 = Math.max(boxSelectStart.value.y, boxSelectEnd.value.y)

    const selectedIds: string[] = []
    components.value.forEach(comp => {
      const compX2 = comp.x + comp.style.width
      const compY2 = comp.y + comp.style.height

      if (compX2 > x1 && comp.x < x2 && compY2 > y1 && comp.y < y2) {
        selectedIds.push(comp.id)
      }
    })

    if (selectedIds.length > 0) {
      scadaStore.selectComponent(selectedIds[0])
      scadaStore.selectedComponentIds = selectedIds
    } else {
      scadaStore.clearSelection()
    }
  }

  const handleBoxSelectUp = () => {
    isBoxSelecting.value = false
    justFinishedBoxSelect.value = true
    document.removeEventListener('mousemove', handleBoxSelectMove)
    document.removeEventListener('mouseup', handleBoxSelectUp)
  }

  const handleComponentClick = (e: MouseEvent, comp: ScadaComponent) => {
    if (!isEditing.value || comp.locked) return

    if (e.ctrlKey || e.metaKey) {
      e.stopPropagation()
      const idx = selectedIds.value.indexOf(comp.id)
      if (idx >= 0) {
        const newIds = selectedIds.value.filter(id => id !== comp.id)
        if (newIds.length > 0) {
          scadaStore.selectComponent(newIds[0])
          scadaStore.selectedComponentIds = newIds
        } else {
          scadaStore.clearSelection()
        }
      } else {
        scadaStore.selectComponent(comp.id)
        scadaStore.selectedComponentIds = [...selectedIds.value, comp.id]
      }
      return
    }

    if (e.shiftKey && selectedId.value) {
      e.stopPropagation()
      const allIds = components.value.map(c => c.id)
      const startIdx = allIds.indexOf(selectedId.value)
      const endIdx = allIds.indexOf(comp.id)
      if (startIdx >= 0 && endIdx >= 0) {
        const minIdx = Math.min(startIdx, endIdx)
        const maxIdx = Math.max(startIdx, endIdx)
        const rangeIds = allIds.slice(minIdx, maxIdx + 1)
        scadaStore.selectComponent(comp.id)
        scadaStore.selectedComponentIds = rangeIds
      }
      return
    }
  }

  const handleContextMenu = (e: MouseEvent, comp: ScadaComponent) => {
    if (!isEditing.value) return
    e.preventDefault()
    e.stopPropagation()

    scadaStore.selectComponent(comp.id)
    contextMenuTargetId.value = comp.id
    contextMenuPosition.value = { x: e.clientX, y: e.clientY }
    contextMenuType.value = 'node'
    contextMenuVisible.value = true
  }

  const handleCanvasContextMenu = (e: MouseEvent) => {
    if (!isEditing.value) return
    e.preventDefault()

    contextMenuTargetId.value = null
    contextMenuPosition.value = { x: e.clientX, y: e.clientY }
    contextMenuType.value = 'canvas'
    contextMenuVisible.value = true
  }

  const hideContextMenu = () => {
    contextMenuVisible.value = false
    contextMenuTargetId.value = null
  }

  const handleContextAction = (action: string) => {
    switch (action) {
      case 'copy':
        if (contextMenuTargetId.value) {
          scadaStore.copyComponent(contextMenuTargetId.value)
        }
        break
      case 'paste': {
        if (!canvasRef.value) break
        const pos = getCanvasPosition(
          canvasRef.value,
          contextMenuPosition.value.x,
          contextMenuPosition.value.y,
          scadaStore.zoom
        )
        scadaStore.pasteComponent(pos.x, pos.y)
        break
      }
      case 'lock':
      case 'unlock':
        if (contextMenuTargetId.value) {
          scadaStore.toggleLock(contextMenuTargetId.value)
        }
        break
      case 'delete':
        if (contextMenuTargetId.value) {
          scadaStore.deleteComponent(contextMenuTargetId.value)
        }
        break
      case 'bringToFront':
        if (contextMenuTargetId.value) {
          scadaStore.bringToFront(contextMenuTargetId.value)
        }
        break
      case 'sendToBack':
        if (contextMenuTargetId.value) {
          scadaStore.sendToBack(contextMenuTargetId.value)
        }
        break
    }

    hideContextMenu()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && contextMenuVisible.value) {
      hideContextMenu()
      return
    }

    if (!isEditing.value || !isMouseOnCanvas.value) return

    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault()
      scadaStore.selectAllComponents()
      return
    }

    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault()
      return
    }

    if (e.ctrlKey && e.key === 'y') {
      e.preventDefault()
      return
    }

    if (e.ctrlKey && e.key === 'c' && selectedId.value && !contextMenuVisible.value) {
      e.preventDefault()
      if (selectedIds.value.length > 1) {
        scadaStore.copySelectedComponents()
      } else {
        scadaStore.copyComponent(selectedId.value)
      }
      return
    }

    if (e.ctrlKey && e.key === 'v' && !contextMenuVisible.value) {
      e.preventDefault()
      scadaStore.pasteComponent(mouseCanvasPos.value.x, mouseCanvasPos.value.y)
      return
    }

    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId.value) {
      e.preventDefault()
      if (selectedIds.value.length > 1) {
        scadaStore.deleteSelectedComponents()
      } else {
        scadaStore.deleteComponent(selectedId.value)
      }
      return
    }

    if (e.ctrlKey && e.key === 'd' && selectedId.value) {
      e.preventDefault()
      scadaStore.duplicateComponent(selectedId.value)
      return
    }

    if (!selectedId.value) return

    const comp = scadaStore.selectedComponent
    if (!comp || comp.locked) return

    const step = panel.value?.grid || 20

    const moveSelectedBy = (dx: number, dy: number) => {
      if (selectedIds.value.length > 1) {
        selectedIds.value.forEach(id => {
          const c = components.value.find(comp => comp.id === id)
          if (c && !c.locked) {
            scadaStore.moveComponent(id, c.x + dx, c.y + dy)
          }
        })
      } else if (selectedId.value) {
        scadaStore.moveComponent(selectedId.value, comp.x + dx, comp.y + dy)
      }
    }

    switch (e.key) {
      case 'ArrowLeft':
        moveSelectedBy(-step, 0)
        e.preventDefault()
        break
      case 'ArrowRight':
        moveSelectedBy(step, 0)
        e.preventDefault()
        break
      case 'ArrowUp':
        moveSelectedBy(0, -step)
        e.preventDefault()
        break
      case 'ArrowDown':
        moveSelectedBy(0, step)
        e.preventDefault()
        break
    }
  }

  const handleScrollToComponent = async () => {
    const targetId = scadaStore.scrollToComponentId ?? null
    if (!targetId || !canvasRef.value) return

    const component = components.value.find(c => c.id === targetId)
    if (!component) return

    await nextTick()

    const canvasContainer = canvasRef.value.closest('.canvas-wrapper')
    if (!canvasContainer) return

    const containerRect = canvasContainer.getBoundingClientRect()

    const scaledX = component.x * scadaStore.zoom
    const scaledY = component.y * scadaStore.zoom
    const scaledWidth = component.style.width * scadaStore.zoom
    const scaledHeight = component.style.height * scadaStore.zoom

    const componentCenterX = scaledX + scaledWidth / 2
    const componentCenterY = scaledY + scaledHeight / 2

    const containerCenterX = containerRect.width / 2
    const containerCenterY = containerRect.height / 2

    const scrollLeft = componentCenterX - containerCenterX
    const scrollTop = componentCenterY - containerCenterY

    canvasContainer.scrollTo({
      left: scrollLeft,
      top: scrollTop,
      behavior: 'smooth'
    })

    scadaStore.clearScrollTarget()
  }

  watch(() => scadaStore.scrollToComponentId, handleScrollToComponent)

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })

  return {
    isDragging,
    isResizing,
    isBoxSelecting,
    boxSelectStart,
    boxSelectEnd,
    guideLines,
    mouseCanvasPos,
    isMouseOnCanvas,
    contextMenuVisible,
    contextMenuPosition,
    contextMenuType,
    targetComponent,
    panel,
    components,
    selectedId,
    selectedIds,
    isEditing,
    getComponentStyle,
    handleCanvasMouseMove,
    handleCanvasMouseEnter,
    handleCanvasMouseLeave,
    handleComponentMouseDown,
    handleResizeStart,
    handleCanvasClick,
    handleCanvasMouseDown,
    handleComponentClick,
    handleContextMenu,
    handleCanvasContextMenu,
    hideContextMenu,
    handleContextAction
  }
}