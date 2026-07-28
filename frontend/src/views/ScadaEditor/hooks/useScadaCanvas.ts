import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScadaEditor } from './useScadaEditor'
import type { ScadaComponent, CanvasPosition, DragState, BoxSelectState, ResizeState, ResizeHandle, GuideLine, ContextMenuState, ContextAction } from '../types'
import type { ComponentType } from '../registry'

/**
 * Scada画布交互Hook
 * 负责画布上的拖拽、框选、缩放、辅助线、键盘快捷键等交互逻辑
 */
export function useScadaCanvas() {
  const { t } = useI18n()
  const scada = useScadaEditor()

  /** 画布DOM引用 */
  const canvasRef = ref<HTMLDivElement | null>(null)
  
  /** 鼠标在画布内的坐标 */
  const mousePosition = ref<CanvasPosition>({ x: 0, y: 0 })
  
  /** 鼠标是否在画布上 */
  const isMouseOnCanvas = ref(false)
  
  /** 拖拽状态 */
  const dragState = ref<DragState>({
    active: false,
    startPos: { x: 0, y: 0 },
    componentStartPos: { x: 0, y: 0 },
    multiStartPositions: new Map(),
    multiStartBBox: null
  })
  
  /** 框选状态 */
  const boxSelectState = ref<BoxSelectState>({
    active: false,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 }
  })
  
  /** 调整尺寸状态 */
  const resizeState = ref<ResizeState>({
    active: false,
    handle: null,
    componentId: null,
    startSize: { width: 0, height: 0 },
    startPos: { x: 0, y: 0 },
    componentStartPos: { x: 0, y: 0 }
  })
  
  /** 对齐辅助线 */
  const guideLines = ref<GuideLine[]>([])
  
  /** 右键菜单状态 */
  const contextMenu = ref<ContextMenuState>({
    visible: false,
    position: { x: 0, y: 0 },
    targetId: null,
    type: 'canvas'
  })

  // ─── 计算属性 ──────────────────────────────────────────────────────

  /** 当前面板数据 */
  const currentPanel = computed(() => scada.currentPanel.value)
  
  /** 当前选中组件 */
  const selectedComponent = computed(() => scada.selectedComponent.value)
  
  /** 当前选中组件ID列表 */
  const selectedComponentIds = computed(() => scada.selectedComponentIds.value)

  /** 画布宽度 */
  const canvasWidth = computed(() => currentPanel.value?.width || 1200)
  
  /** 画布高度 */
  const canvasHeight = computed(() => currentPanel.value?.height || 800)

  /** 网格大小 */
  const gridSize = computed(() => {
    if (!currentPanel.value) return 20
    return currentPanel.value.grid
  })

  /** 是否处于编辑模式 */
  const isEditing = computed(() => scada.isEditing.value)
  
  /** 缩放比例 */
  const zoom = computed(() => scada.zoom.value)
  
  /** 是否显示网格 */
  const showGrid = computed(() => scada.showGrid.value)

  // ─── 画布坐标计算 ──────────────────────────────────────────────────

  /**
   * 获取画布DOM的边界矩形
   */
  const getCanvasRect = () => {
    if (!canvasRef.value) return null
    return canvasRef.value.getBoundingClientRect()
  }

  /**
   * 将屏幕坐标转换为画布坐标（考虑缩放）
   * @param screenX - 屏幕X坐标
   * @param screenY - 屏幕Y坐标
   */
  const screenToCanvas = (screenX: number, screenY: number): CanvasPosition => {
    const rect = getCanvasRect()
    if (!rect) return { x: 0, y: 0 }
    return {
      x: (screenX - rect.left) / zoom.value,
      y: (screenY - rect.top) / zoom.value
    }
  }

  // ─── 鼠标事件处理 ──────────────────────────────────────────────────

  /**
   * 处理鼠标按下事件
   * @param e - 鼠标事件
   */
  const handleMouseDown = (e: MouseEvent) => {
    if (!isEditing.value) return

    const pos = screenToCanvas(e.clientX, e.clientY)

    if (e.button === 0) {
      const target = e.target as HTMLElement
      const componentEl = target.closest('[data-component-id]') as HTMLElement
      
      if (componentEl) {
        const componentId = componentEl.dataset.componentId!
        
        if (selectedComponentIds.value.includes(componentId)) {
          startDrag(componentId, pos)
        } else {
          scada.selectComponent(componentId)
          startDrag(componentId, pos)
        }
      } else {
        scada.clearSelection()
        startBoxSelect(pos)
      }
    }
  }

  /**
   * 开始拖拽
   * @param componentId - 被拖拽的组件ID
   * @param startPos - 拖拽起始位置
   */
  const startDrag = (componentId: string, startPos: CanvasPosition) => {
    dragState.value.active = true
    dragState.value.startPos = startPos
    
    const panel = currentPanel.value
    const component = panel?.components.find(c => c.id === componentId)
    
    if (component) {
      dragState.value.componentStartPos = { x: component.x, y: component.y }
    }

    // 多选拖拽时记录所有选中组件的起始位置
    if (selectedComponentIds.value.length > 1) {
      const bbox = getSelectionBBox()
      dragState.value.multiStartBBox = bbox
      dragState.value.multiStartPositions.clear()
      selectedComponentIds.value.forEach(id => {
        const comp = panel?.components.find(c => c.id === id)
        if (comp) {
          dragState.value.multiStartPositions.set(id, { x: comp.x, y: comp.y })
        }
      })
    }

    scada.pushUndoOperation('move', t('scada.undoOperations.move'), [...selectedComponentIds.value])
  }

  /**
   * 开始框选
   * @param startPos - 框选起始位置
   */
  const startBoxSelect = (startPos: CanvasPosition) => {
    boxSelectState.value.active = true
    boxSelectState.value.start = startPos
    boxSelectState.value.end = startPos
  }

  /**
   * 处理鼠标移动事件
   * @param e - 鼠标事件
   */
  const handleMouseMove = (e: MouseEvent) => {
    const pos = screenToCanvas(e.clientX, e.clientY)
    mousePosition.value = pos
    isMouseOnCanvas.value = true

    if (resizeState.value.active) {
      handleResize(pos)
    } else if (dragState.value.active) {
      handleDrag(pos)
    } else if (boxSelectState.value.active) {
      boxSelectState.value.end = pos
    }
  }

  /**
   * 处理拖拽移动
   * @param currentPos - 当前鼠标位置
   */
  const handleDrag = (currentPos: CanvasPosition) => {
    const dx = currentPos.x - dragState.value.startPos.x
    const dy = currentPos.y - dragState.value.startPos.y

    // 多选拖拽
    if (selectedComponentIds.value.length > 1 && dragState.value.multiStartBBox) {
      const bbox = dragState.value.multiStartBBox
      const rawMinX = bbox.minX + dx
      const rawCenterX = bbox.centerX + dx
      const rawMaxX = bbox.maxX + dx
      const rawMinY = bbox.minY + dy
      const rawMiddleY = bbox.middleY + dy
      const rawMaxY = bbox.maxY + dy
      const snapX = computeSnapOffset([rawMinX, rawCenterX, rawMaxX], 'x')
      const snapY = computeSnapOffset([rawMinY, rawMiddleY, rawMaxY], 'y')

      selectedComponentIds.value.forEach(id => {
        const startPos = dragState.value.multiStartPositions.get(id)
        if (startPos) {
          scada.updateComponent(id, {
            x: startPos.x + dx + snapX,
            y: startPos.y + dy + snapY
          }, true)
        }
      })
    }
    // 单选拖拽
    else if (selectedComponent.value) {
      const comp = selectedComponent.value
      const rawX = dragState.value.componentStartPos.x + dx
      const rawY = dragState.value.componentStartPos.y + dy
      const snapX = computeSnapOffset([rawX, rawX + comp.config.width / 2, rawX + comp.config.width], 'x')
      const snapY = computeSnapOffset([rawY, rawY + comp.config.height / 2, rawY + comp.config.height], 'y')

      scada.updateComponent(comp.id, {
        x: rawX + snapX,
        y: rawY + snapY
      }, true)
    }

    showGuideLines()
  }

  /**
   * 计算对齐吸附偏移量
   * @param refPositions - 参考边/中心位置
   * @param axis - 坐标轴
   */
  const computeSnapOffset = (refPositions: number[], axis: 'x' | 'y'): number => {
    if (!currentPanel.value) return 0
    const threshold = 3
    let bestOffset = 0
    let bestDist = threshold

    // 与其他组件的边线及中心线对齐
    currentPanel.value.components.forEach(comp => {
      if (selectedComponentIds.value.includes(comp.id)) return
      const targets = axis === 'x'
        ? [comp.x, comp.x + comp.config.width / 2, comp.x + comp.config.width]
        : [comp.y, comp.y + comp.config.height / 2, comp.y + comp.config.height]

      targets.forEach(target => {
        refPositions.forEach(ref => {
          const offset = target - ref
          const dist = Math.abs(offset)
          if (dist < bestDist) {
            bestDist = dist
            bestOffset = offset
          }
        })
      })
    })

    // 与网格对齐
    const grid = gridSize.value
    refPositions.forEach(ref => {
      const target = Math.round(ref / grid) * grid
      const offset = target - ref
      const dist = Math.abs(offset)
      if (dist < bestDist) {
        bestDist = dist
        bestOffset = offset
      }
    })

    return bestOffset
  }

  /**
   * 开始调整尺寸
   * @param handle - 调整手柄
   * @param componentId - 被调整组件ID
   * @param e - 鼠标事件
   */
  const startResize = (handle: ResizeHandle, componentId: string, e: MouseEvent) => {
    if (!isEditing.value) return

    const panel = currentPanel.value
    const comp = panel?.components.find(c => c.id === componentId)
    if (!comp || comp.locked) return

    e.stopPropagation()
    scada.selectComponent(componentId)

    scada.pushUndoOperation('resize', t('scada.undoOperations.resize'), [componentId])

    resizeState.value = {
      active: true,
      handle,
      componentId,
      startSize: { width: comp.config.width, height: comp.config.height },
      startPos: screenToCanvas(e.clientX, e.clientY),
      componentStartPos: { x: comp.x, y: comp.y }
    }
  }

  /**
   * 处理调整尺寸移动
   * @param currentPos - 当前鼠标位置
   */
  const handleResize = (currentPos: CanvasPosition) => {
    if (!resizeState.value.active || !resizeState.value.handle || !resizeState.value.componentId || !currentPanel.value) return

    const handle = resizeState.value.handle
    const componentId = resizeState.value.componentId
    const comp = currentPanel.value.components.find(c => c.id === componentId)
    if (!comp) return

    const dx = currentPos.x - resizeState.value.startPos.x
    const dy = currentPos.y - resizeState.value.startPos.y
    const startW = resizeState.value.startSize.width
    const startH = resizeState.value.startSize.height
    const startX = resizeState.value.componentStartPos.x
    const startY = resizeState.value.componentStartPos.y
    const grid = gridSize.value

    let newX = startX
    let newY = startY
    let newW = startW
    let newH = startH

    if (handle.includes('e')) newW = startW + dx
    if (handle.includes('s')) newH = startH + dy
    if (handle.includes('w')) {
      newW = startW - dx
      newX = startX + dx
    }
    if (handle.includes('n')) {
      newH = startH - dy
      newY = startY + dy
    }

    newW = Math.max(grid, Math.round(newW / grid) * grid)
    newH = Math.max(grid, Math.round(newH / grid) * grid)

    if (handle.includes('w')) newX = startX + startW - newW
    if (handle.includes('n')) newY = startY + startH - newH

    scada.updateComponent(componentId, {
      x: newX,
      y: newY,
      config: { ...comp.config, width: newW, height: newH }
    }, true)

    showGuideLines()
  }

  /**
   * 显示对齐辅助线
   */
  const showGuideLines = () => {
    guideLines.value = []
    if (!currentPanel.value || selectedComponentIds.value.length === 0) return

    const panel = currentPanel.value

    // 单选时使用组件本身，多选时使用选中包围盒作为对齐基准
    let refX = 0
    let refY = 0
    let refRight = 0
    let refBottom = 0
    let refCenterX = 0
    let refCenterY = 0

    if (selectedComponentIds.value.length > 1) {
      const bbox = getSelectionBBox()
      if (!bbox) return
      refX = bbox.minX
      refY = bbox.minY
      refRight = bbox.maxX
      refBottom = bbox.maxY
      refCenterX = bbox.centerX
      refCenterY = bbox.middleY
    } else if (selectedComponent.value) {
      const comp = selectedComponent.value
      refX = comp.x
      refY = comp.y
      refRight = comp.x + comp.config.width
      refBottom = comp.y + comp.config.height
      refCenterX = comp.x + comp.config.width / 2
      refCenterY = comp.y + comp.config.height / 2
    } else {
      return
    }

    // 与其他组件的边线及中心线对齐
    panel.components.forEach(comp => {
      if (selectedComponentIds.value.includes(comp.id)) return

      const compRight = comp.x + comp.config.width
      const compBottom = comp.y + comp.config.height
      const compCenterX = comp.x + comp.config.width / 2
      const compCenterY = comp.y + comp.config.height / 2

      if (Math.abs(comp.x - refX) < 3) {
        guideLines.value.push({ type: 'x', pos: comp.x })
      }
      if (Math.abs(compCenterX - refCenterX) < 3) {
        guideLines.value.push({ type: 'x', pos: compCenterX })
      }
      if (Math.abs(compRight - refRight) < 3) {
        guideLines.value.push({ type: 'x', pos: compRight })
      }

      if (Math.abs(comp.y - refY) < 3) {
        guideLines.value.push({ type: 'y', pos: comp.y })
      }
      if (Math.abs(compCenterY - refCenterY) < 3) {
        guideLines.value.push({ type: 'y', pos: compCenterY })
      }
      if (Math.abs(compBottom - refBottom) < 3) {
        guideLines.value.push({ type: 'y', pos: compBottom })
      }
    })

    // 与网格对齐（边线及中心线）
    if (Math.abs(refX % gridSize.value) < 3) {
      guideLines.value.push({ type: 'x', pos: Math.round(refX / gridSize.value) * gridSize.value })
    }
    if (Math.abs(refCenterX % gridSize.value) < 3) {
      guideLines.value.push({ type: 'x', pos: Math.round(refCenterX / gridSize.value) * gridSize.value })
    }
    if (Math.abs(refY % gridSize.value) < 3) {
      guideLines.value.push({ type: 'y', pos: Math.round(refY / gridSize.value) * gridSize.value })
    }
    if (Math.abs(refCenterY % gridSize.value) < 3) {
      guideLines.value.push({ type: 'y', pos: Math.round(refCenterY / gridSize.value) * gridSize.value })
    }
  }

  /**
   * 完成框选并选中框内的组件
   */
  const finishBoxSelect = () => {
    if (!boxSelectState.value.active || !currentPanel.value) return

    const start = boxSelectState.value.start
    const end = boxSelectState.value.end
    const minX = Math.min(start.x, end.x)
    const maxX = Math.max(start.x, end.x)
    const minY = Math.min(start.y, end.y)
    const maxY = Math.max(start.y, end.y)

    // 框选区域过小时视为点击空白，清空选择
    if (maxX - minX < 2 && maxY - minY < 2) {
      scada.clearSelection()
      return
    }

    const selectedIds = currentPanel.value.components
      .filter(comp => {
        const compRight = comp.x + comp.config.width
        const compBottom = comp.y + comp.config.height
        return comp.x < maxX && compRight > minX && comp.y < maxY && compBottom > minY
      })
      .map(comp => comp.id)

    scada.selectComponents(selectedIds)
  }

  /**
   * 处理鼠标松开事件
   */
  const handleMouseUp = () => {
    if (boxSelectState.value.active) {
      finishBoxSelect()
    }

    if (dragState.value.active) {
      const hasMoved = selectedComponentIds.value.length > 1
        ? Array.from(dragState.value.multiStartPositions.entries()).some(([id, startPos]) => {
            const comp = currentPanel.value?.components.find(c => c.id === id)
            return comp && (comp.x !== startPos.x || comp.y !== startPos.y)
          })
        : selectedComponent.value && (
            selectedComponent.value.x !== dragState.value.componentStartPos.x ||
            selectedComponent.value.y !== dragState.value.componentStartPos.y
          )

      if (!hasMoved) {
        scada.popLastUndoOperation()
      }
    }

    if (resizeState.value.active && resizeState.value.componentId) {
      const comp = currentPanel.value?.components.find(c => c.id === resizeState.value.componentId)
      const startSize = resizeState.value.startSize
      const startPos = resizeState.value.componentStartPos
      const hasResized = comp && (
        comp.config.width !== startSize.width ||
        comp.config.height !== startSize.height ||
        comp.x !== startPos.x ||
        comp.y !== startPos.y
      )

      if (!hasResized) {
        scada.popLastUndoOperation()
      }
    }

    dragState.value.active = false
    boxSelectState.value.active = false
    resizeState.value.active = false
    guideLines.value = []
  }

  /**
   * 处理鼠标离开画布事件
   */
  const handleMouseLeave = () => {
    isMouseOnCanvas.value = false
    if (!dragState.value.active) {
      contextMenu.value.visible = false
    }
  }

  /**
   * 处理双击事件
   * @param e - 鼠标事件
   */
  const handleDoubleClick = (e: MouseEvent) => {
    if (!isEditing.value) return
    const target = e.target as HTMLElement
    const componentEl = target.closest('[data-component-id]') as HTMLElement
    
    if (componentEl) {
      const componentId = componentEl.dataset.componentId!
      scada.selectComponent(componentId)
    }
  }

  /**
   * 处理右键菜单事件
   * @param e - 鼠标事件
   */
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    if (!isEditing.value) return

    const target = e.target as HTMLElement
    const componentEl = target.closest('[data-component-id]') as HTMLElement
    
    contextMenu.value.position = { x: e.clientX, y: e.clientY }
    
    if (componentEl) {
      const componentId = componentEl.dataset.componentId!
      contextMenu.value.targetId = componentId
      contextMenu.value.type = 'node'
      if (!selectedComponentIds.value.includes(componentId)) {
        scada.selectComponent(componentId)
      }
    } else {
      contextMenu.value.targetId = null
      contextMenu.value.type = 'canvas'
    }
  }

  /**
   * 关闭右键菜单
   */
  const closeContextMenu = () => {
    contextMenu.value.visible = false
  }

  /**
   * 处理右键菜单项点击
   * @param action - 操作类型
   */
  const handleContextAction = (action: ContextAction) => {
    if (!contextMenu.value.targetId && action !== 'paste') {
      return
    }

    switch (action) {
      case 'copy':
        if (contextMenu.value.targetId) {
          scada.copyComponent(contextMenu.value.targetId)
        }
        break
      case 'paste':
        scada.pasteComponent(mousePosition.value.x, mousePosition.value.y)
        break
      case 'lock':
        if (contextMenu.value.targetId) {
          scada.toggleLock(contextMenu.value.targetId)
        }
        break
      case 'unlock':
        if (contextMenu.value.targetId) {
          scada.toggleLock(contextMenu.value.targetId)
        }
        break
      case 'delete':
        if (contextMenu.value.type === 'node' && contextMenu.value.targetId) {
          scada.deleteComponent(contextMenu.value.targetId)
        } else if (contextMenu.value.type === 'canvas') {
          scada.deleteSelectedComponents()
        }
        break
      case 'bringToFront':
        if (contextMenu.value.targetId) {
          scada.bringToFront(contextMenu.value.targetId)
        }
        break
      case 'sendToBack':
        if (contextMenu.value.targetId) {
          scada.sendToBack(contextMenu.value.targetId)
        }
        break
    }

    closeContextMenu()
  }

  // ─── 选择区域计算 ──────────────────────────────────────────────────

  /**
   * 获取选中组件的边界框
   */
  const getSelectionBBox = () => {
    if (!currentPanel.value || selectedComponentIds.value.length === 0) return null

    const components = currentPanel.value.components.filter(c => 
      selectedComponentIds.value.includes(c.id)
    )

    if (components.length === 0) return null

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity

    components.forEach(comp => {
      minX = Math.min(minX, comp.x)
      maxX = Math.max(maxX, comp.x + comp.config.width)
      minY = Math.min(minY, comp.y)
      maxY = Math.max(maxY, comp.y + comp.config.height)
    })

    return {
      minX,
      centerX: (minX + maxX) / 2,
      maxX,
      minY,
      middleY: (minY + maxY) / 2,
      maxY
    }
  }

  // ─── 键盘事件处理 ──────────────────────────────────────────────────

  /**
   * 处理键盘按键事件
   * @param e - 键盘事件
   */
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isEditing.value) return

    const target = e.target as HTMLElement | null
    const isFormElementFocused = target && (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.isContentEditable ||
      target.closest('input, textarea, select, [contenteditable]') !== null
    )
    if (isFormElementFocused) return

    // Ctrl+C 复制
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      e.preventDefault()
      scada.copySelectedComponents()
    }

    // Ctrl+V 粘贴
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      e.preventDefault()
      scada.pasteComponent(mousePosition.value.x, mousePosition.value.y)
    }

    // Ctrl+D 复制
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault()
      if (selectedComponent.value) {
        scada.duplicateComponent(selectedComponent.value.id)
      }
    }

    // Delete/Backspace 删除
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      scada.deleteSelectedComponents()
    }

    // Escape 取消选择/关闭菜单
    if (e.key === 'Escape') {
      scada.clearSelection()
      closeContextMenu()
    }

    // Ctrl+A 全选
    if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      scada.selectAllComponents()
    }

    // Ctrl+Z 撤销
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault()
      scada.undo()
    }

    // Ctrl+Y 重做
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault()
      scada.redo()
    }

    // 方向键移动选中组件
    if (selectedComponent.value && !selectedComponent.value.locked) {
      const step = gridSize.value
      const keyMap: Record<string, { dx: number; dy: number }> = {
        ArrowUp: { dx: 0, dy: -step },
        ArrowDown: { dx: 0, dy: step },
        ArrowLeft: { dx: -step, dy: 0 },
        ArrowRight: { dx: step, dy: 0 }
      }

      const delta = keyMap[e.key]
      if (delta) {
        e.preventDefault()
        scada.moveComponent(selectedComponent.value.id, selectedComponent.value.x + delta.dx, selectedComponent.value.y + delta.dy)
      }
    }
  }

  // ─── 拖拽组件到画布 ──────────────────────────────────────────────────

  /**
   * 处理拖拽进入画布事件
   * @param e - 拖拽事件
   */
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy'
    }
  }

  /**
   * 处理拖拽离开画布事件
   * @param e - 拖拽事件
   */
  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
  }

  /**
   * 处理放置组件到画布事件
   * @param e - 拖拽事件
   */
  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    if (!isEditing.value) return

    const componentType = e.dataTransfer?.getData('component-type') as ComponentType
    if (!componentType) return

    const pos = screenToCanvas(e.clientX, e.clientY)
    scada.addComponent(componentType, pos.x, pos.y)
  }

  // ─── 生命周期 ──────────────────────────────────────────────────────

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })

  return {
    // 状态引用
    canvasRef,
    mousePosition,
    isMouseOnCanvas,
    dragState,
    boxSelectState,
    resizeState,
    guideLines,
    contextMenu,
    // 计算属性
    currentPanel,
    selectedComponent,
    selectedComponentIds,
    canvasWidth,
    canvasHeight,
    gridSize,
    isEditing,
    zoom,
    showGrid,
    // 事件处理函数
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleDoubleClick,
    handleContextMenu,
    closeContextMenu,
    handleContextAction,
    handleKeyDown,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    startResize,
    // 工具函数
    screenToCanvas
  }
}