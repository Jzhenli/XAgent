import { ref, computed, watch } from 'vue'
import { useScadaStore } from '@/stores/scada'
import { usePointStore } from '@/stores/points'
import type { PointBinding, PanelPreset } from '../types'
import { readInputNumber, readFileAsDataURL } from '../utils/dom'

export function useScadaProps() {
  const scadaStore = useScadaStore()
  const pointStore = usePointStore()

  const selectedDevice = ref<string>('')
  const selectedPoint = ref<string>('')

  const component = computed(() => scadaStore.selectedComponent)
  const currentPanel = computed(() => scadaStore.currentPanel)
  const currentBinding = computed(() => component.value?.binding)

  const panelWidth = ref(1200)
  const panelHeight = ref(800)
  const panelBgColor = ref('#f0f2f5')
  const panelGrid = ref(20)
  const panelBgImage = ref<string | undefined>(undefined)
  const panelBgType = ref<'color' | 'image'>('color')

  watch(
    currentPanel,
    (panel) => {
      if (panel) {
        panelWidth.value = panel.width
        panelHeight.value = panel.height
        panelBgColor.value = panel.backgroundColor
        panelGrid.value = panel.grid
        panelBgImage.value = panel.backgroundImage
        panelBgType.value = panel.backgroundImage ? 'image' : 'color'
      }
    },
    { immediate: true }
  )

  watch(
    currentBinding,
    (binding) => {
      if (binding) {
        selectedDevice.value = binding.deviceId
        selectedPoint.value = binding.pointName
      } else {
        selectedDevice.value = ''
        selectedPoint.value = ''
      }
    },
    { immediate: true }
  )

  const availablePoints = computed(() => {
    if (!selectedDevice.value) return []
    const device = pointStore.devices.find(
      (d) => d.asset === selectedDevice.value || d.name === selectedDevice.value
    )
    return device?.points || []
  })

  const handleDeviceChange = () => {
    selectedPoint.value = ''
    if (!component.value) return
    if (!selectedDevice.value) {
      scadaStore.bindPoint(component.value.id, null)
    }
  }

  const handlePointChange = () => {
    if (!component.value) return

    if (!selectedDevice.value || !selectedPoint.value) {
      scadaStore.bindPoint(component.value.id, null)
      return
    }

    const point = availablePoints.value.find((p) => p.name === selectedPoint.value)
    if (!point) return

    const binding: PointBinding = {
      deviceId: selectedDevice.value,
      pointName: selectedPoint.value,
      pointDescription: point.description,
      unit: point.unit
    }

    scadaStore.bindPoint(component.value.id, binding)
  }

  const updateStyle = (key: string, value: any) => {
    if (!component.value) return
    scadaStore.updateComponent(component.value.id, {
      style: { ...component.value.style, [key]: value }
    })
  }

  const updateName = (event: Event) => {
    if (!component.value) return
    scadaStore.updateComponent(component.value.id, {
      name: (event.target as HTMLInputElement).value
    })
  }

  const updatePosition = (axis: 'x' | 'y', event: Event) => {
    const value = readInputNumber(event)
    if (value === null || !component.value) return
    const x = axis === 'x' ? value : component.value.x
    const y = axis === 'y' ? value : component.value.y
    scadaStore.moveComponent(component.value.id, x, y)
  }

  const updateDimension = (key: 'width' | 'height', event: Event) => {
    const value = readInputNumber(event)
    if (value === null || !component.value) return
    updateStyle(key, value)
  }

  const updatePanelSize = () => {
    if (!currentPanel.value) return
    scadaStore.updatePanel({
      width: panelWidth.value,
      height: panelHeight.value,
      backgroundColor: panelBgColor.value,
      grid: panelGrid.value,
      backgroundImage: panelBgType.value === 'image' ? panelBgImage.value : undefined
    })
  }

  const onBgTypeChange = (type: 'color' | 'image') => {
    if (type === 'color') {
      panelBgImage.value = undefined
    }
    updatePanelSize()
  }

  const handleBgImageUpload = async (e: Event) => {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    try {
      const result = await readFileAsDataURL(file)
      panelBgImage.value = result
      panelBgType.value = 'image'
      updatePanelSize()
    } catch {
      //
    }

    input.value = ''
  }

  const removeBgImage = () => {
    panelBgImage.value = undefined
    panelBgType.value = 'color'
    updatePanelSize()
  }

  const presetSizes: PanelPreset[] = [
    { key: 'small', name: 'componentConfig.small', width: 800, height: 600 },
    { key: 'medium', name: 'componentConfig.medium', width: 1200, height: 800 },
    { key: 'large', name: 'componentConfig.large', width: 1920, height: 1080 },
    { key: 'extraWide', name: 'componentConfig.extraWide', width: 2560, height: 1080 }
  ]

  const applyPreset = (preset: PanelPreset) => {
    panelWidth.value = preset.width
    panelHeight.value = preset.height
    updatePanelSize()
  }

  const validatePosition = (x: number, y: number): { valid: boolean; x: number; y: number } => {
    if (!currentPanel.value) return { valid: true, x, y }
    return {
      valid: x >= 0 && y >= 0,
      x: Math.max(0, x),
      y: Math.max(0, y)
    }
  }

  const validateDimension = (width: number, height: number): { valid: boolean; width: number; height: number } => {
    return {
      valid: width >= 50 && height >= 50,
      width: Math.max(50, width),
      height: Math.max(50, height)
    }
  }

  const validatePanelSize = (width: number, height: number): { valid: boolean; width: number; height: number } => {
    return {
      valid: width >= 400 && width <= 4096 && height >= 300 && height <= 4096,
      width: Math.max(400, Math.min(4096, width)),
      height: Math.max(300, Math.min(4096, height))
    }
  }

  const validateGridSize = (grid: number): { valid: boolean; grid: number } => {
    return {
      valid: grid >= 10 && grid <= 50,
      grid: Math.max(10, Math.min(50, grid))
    }
  }

  return {
    selectedDevice,
    selectedPoint,
    component,
    currentPanel,
    currentBinding,
    panelWidth,
    panelHeight,
    panelBgColor,
    panelGrid,
    panelBgImage,
    panelBgType,
    availablePoints,
    presetSizes,
    handleDeviceChange,
    handlePointChange,
    updateStyle,
    updateName,
    updatePosition,
    updateDimension,
    updatePanelSize,
    onBgTypeChange,
    handleBgImageUpload,
    removeBgImage,
    applyPreset,
    validatePosition,
    validateDimension,
    validatePanelSize,
    validateGridSize
  }
}