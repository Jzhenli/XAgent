import { ref, computed, watch } from 'vue'
import { useScadaEditor } from './useScadaEditor'
import { usePointStore } from '@/stores/points'
import type { PointBinding, PanelPreset } from '../types'

/**
 * 预设面板尺寸列表
 */
const presetSizes: PanelPreset[] = [
  { key: 'small', name: 'Small', width: 800, height: 600 },
  { key: 'medium', name: 'Medium', width: 1200, height: 800 },
  { key: 'large', name: 'Large', width: 1920, height: 1080 },
  { key: 'extraWide', name: 'Extra Wide', width: 2560, height: 1440 }
]

/**
 * Scada属性配置Hook
 * 负责组件属性编辑、面板配置、点位绑定等表单交互逻辑
 */
export function useScadaProps() {
  const scada = useScadaEditor()
  const pointStore = usePointStore()

  /** 当前选中的设备ID */
  const selectedDevice = ref<string>('')
  
  /** 当前选中的点位名称 */
  const selectedPoint = ref<string>('')

  /** 当前选中的组件 */
  const component = computed(() => scada.selectedComponent.value)
  
  /** 当前面板 */
  const currentPanel = computed(() => scada.currentPanel.value)

  /** 面板宽度 */
  const panelWidth = ref(1920)
  
  /** 面板高度 */
  const panelHeight = ref(1080)
  
  /** 面板背景颜色 */
  const panelBgColor = ref('#f0f2f5')
  
  /** 网格大小 */
  const panelGrid = ref(20)
  
  /** 背景图片URL */
  const panelBgImage = ref<string>('')
  
  /** 背景类型（颜色/图片） */
  const panelBgType = ref<'color' | 'image'>('color')

  /**
   * 监听面板变化，同步面板配置
   */
  watch(currentPanel, (panel) => {
    if (panel) {
      panelWidth.value = panel.width
      panelHeight.value = panel.height
      panelBgColor.value = panel.backgroundColor
      panelGrid.value = panel.grid
      panelBgImage.value = panel.backgroundImage || ''
      panelBgType.value = panel.backgroundImage ? 'image' : 'color'
    }
  }, { immediate: true })

  /**
   * 当前设备的可用点位列表
   */
  const availablePoints = computed(() => {
    if (!selectedDevice.value) return []
    const device = pointStore.devices.find(d => d.asset === selectedDevice.value || d.name === selectedDevice.value)
    return device?.points || []
  })

  /**
   * 监听组件变化，同步绑定信息
   */
  watch(component, (comp) => {
    if (comp?.binding) {
      selectedDevice.value = comp.binding.deviceId
      selectedPoint.value = comp.binding.pointName
    } else {
      selectedDevice.value = ''
      selectedPoint.value = ''
    }
  }, { immediate: true })

  /**
   * 处理设备选择变化
   * @param deviceId - 设备ID
   */
  const handleDeviceChange = (deviceId: string) => {
    selectedDevice.value = deviceId
    selectedPoint.value = ''
    if (component.value) {
      const binding = component.value.binding || { deviceId: '', pointName: '' }
      scada.updateComponent(component.value.id, {
        binding: { ...binding, deviceId }
      })
    }
  }

  /**
   * 处理点位选择变化
   * @param pointName - 点位名称
   */
  const handlePointChange = (pointName: string) => {
    selectedPoint.value = pointName
    if (component.value) {
      const binding = component.value.binding || { deviceId: selectedDevice.value, pointName: '' }
      const point = availablePoints.value.find(p => p.name === pointName)
      scada.updateComponent(component.value.id, {
        binding: {
          ...binding,
          pointName,
          pointDescription: point?.description,
          unit: point?.unit
        }
      })
    }
  }

  /**
   * 更新组件名称
   * @param e - 输入事件
   */
  const updateName = (e: Event) => {
    const value = (e.target as HTMLInputElement).value
    if (component.value) {
      scada.updateComponent(component.value.id, { name: value })
    }
  }

  /**
   * 更新组件位置
   * @param axis - 坐标轴（x/y）
   * @param e - 输入事件
   */
  const updatePosition = (axis: 'x' | 'y', e: Event) => {
    const value = parseFloat((e.target as HTMLInputElement).value)
    if (!isNaN(value) && component.value) {
      const currentX = component.value.x
      const currentY = component.value.y
      scada.updateComponent(component.value.id, {
        x: axis === 'x' ? value : currentX,
        y: axis === 'y' ? value : currentY
      })
    }
  }

  /**
   * 更新组件尺寸
   * @param dim - 尺寸类型（width/height）
   * @param e - 输入事件
   */
  const updateDimension = (dim: 'width' | 'height', e: Event) => {
    const value = parseFloat((e.target as HTMLInputElement).value)
    if (!isNaN(value) && component.value) {
      const currentWidth = component.value.config.width
      const currentHeight = component.value.config.height
      scada.updateComponent(component.value.id, {
        config: {
          ...component.value.config,
          width: dim === 'width' ? value : currentWidth,
          height: dim === 'height' ? value : currentHeight
        }
      })
    }
  }

  /**
   * 更新面板尺寸和样式
   */
  const updatePanelSize = () => {
    scada.updatePanel({
      width: panelWidth.value,
      height: panelHeight.value,
      backgroundColor: panelBgColor.value,
      grid: panelGrid.value,
      backgroundImage: panelBgType.value === 'image' ? panelBgImage.value : undefined
    })
  }

  /**
   * 切换背景类型
   * @param type - 背景类型（color/image）
   */
  const onBgTypeChange = (type: 'color' | 'image') => {
    panelBgType.value = type
    if (type === 'color') {
      panelBgImage.value = ''
      updatePanelSize()
    }
  }

  /**
   * 处理背景图片上传
   * @param e - 文件选择事件
   */
  const handleBgImageUpload = (e: Event) => {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        panelBgImage.value = event.target?.result as string
        panelBgType.value = 'image'
        updatePanelSize()
      }
      reader.readAsDataURL(file)
    }
  }

  /**
   * 移除背景图片
   */
  const removeBgImage = () => {
    panelBgImage.value = ''
    panelBgType.value = 'color'
    updatePanelSize()
  }

  /**
   * 应用预设尺寸
   * @param preset - 预设配置
   */
  const applyPreset = (preset: PanelPreset) => {
    panelWidth.value = preset.width
    panelHeight.value = preset.height
    updatePanelSize()
  }

  return {
    // 状态
    selectedDevice,
    selectedPoint,
    component,
    currentPanel,
    panelWidth,
    panelHeight,
    panelBgColor,
    panelGrid,
    panelBgImage,
    panelBgType,
    availablePoints,
    presetSizes,
    // 方法
    handleDeviceChange,
    handlePointChange,
    updateName,
    updatePosition,
    updateDimension,
    updatePanelSize,
    onBgTypeChange,
    handleBgImageUpload,
    removeBgImage,
    applyPreset
  }
}
