import type { Component } from 'vue'

export type PanelType = 'Dashboard' | 'Graphic'

export interface PointBinding {
  deviceId: string
  pointName: string
  pointDescription?: string
  unit?: string
}

/** @deprecated 样式已合并到 ComponentConfig，保留用于旧数据迁移 */
export interface StyleConfig {
  width: number
  height: number
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  fontSize?: number
  fontColor?: string
  opacity?: number
}

/** 组件统一配置基类：包含样式、当前值等通用字段 */
export interface BaseComponentConfig {
  width: number
  height: number
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  fontSize?: number
  fontColor?: string
  opacity?: number
  /** 编辑模式/未绑定点位时的当前值（模拟值） */
  value?: number | boolean | string | null
}

/** 文本组件配置 */
export interface TextComponentConfig extends BaseComponentConfig {
  content: string
  fontWeight: 'normal' | 'bold'
  textAlign: 'left' | 'center' | 'right'
}

/** 数值组件配置 */
export interface NumberComponentConfig extends BaseComponentConfig {
  showTitle: boolean
  title: string
  titleFontSize: number
  titleFontColor: string
  decimalPlaces: number
  unit: string
  unitFontSize: number
  unitFontColor: string
  fontSize: number
  fontColor: string
  textAlign: 'left' | 'center' | 'right'
}

/** 枚举项 */
export interface EnumValueItem {
  text: string
  value: number | string
}

/** 枚举值组件配置 */
export interface EnumValueComponentConfig extends BaseComponentConfig {
  value: number | string
  enumItems: EnumValueItem[]
  fontSize: number
  fontColor: string
}

/** 矩形组件配置 */
export interface RectangleComponentConfig extends BaseComponentConfig {
  /** 背景模糊半径（px） */
  blur?: number
}

/** 圆形组件配置 */
export interface CircleComponentConfig extends Omit<BaseComponentConfig, 'borderRadius'> {
  /** 背景模糊半径（px） */
  blur?: number
}

/** 图标组件配置 */
export interface IconComponentConfig extends Omit<BaseComponentConfig, 'borderRadius' | 'backgroundColor' | 'borderColor' | 'borderWidth' | 'fontSize' | 'fontColor' | 'opacity'> {
  /** 图标名称（对应 xicon_<name> 的基名） */
  iconName: string
  /** 图标颜色 */
  iconColor: string
}

/** 仪表盘组件配置 */
export interface GaugeComponentConfig extends BaseComponentConfig {
  min: number
  max: number
  unit: string
  thresholds: { value: number; color: string }[]
  showValue: boolean
  /** 中心显示的目标/设定值 */
  targetValue?: number
  /** 轨道基础色 */
  trackColor?: string
  /** 数据填充轨道色 */
  fillColor?: string
  /** 数据填充轨道渐变色（3 色），配置后优先于 fillColor */
  fillGradient?: string[]
  /** 轨道宽度 */
  trackWidth?: number
  /** 进度条端点形状 */
  strokeLinecap?: 'butt' | 'round' | 'square'
  /** 中心文本字体粗细 */
  fontWeight?: 'normal' | 'bold'
  /** 按钮调节步进值 */
  step?: number
  /** 是否显示加减按钮 */
  showButtons?: boolean
  /** 步进按钮字体大小 */
  stepFontSize?: number
  /** 步进按钮字体颜色 */
  stepFontColor?: string
  /** 单位字体大小 */
  unitFontSize?: number
  /** 单位字体颜色 */
  unitFontColor?: string
  /** 单位字体粗细 */
  unitFontWeight?: 'normal' | 'bold'
}

/** 图表组件配置 */
export interface ChartComponentConfig extends BaseComponentConfig {
  timeRange: '1h' | '6h' | '24h' | '7d'
  lineColor: string
  areaFill: boolean
  showLegend: boolean
}

/** 折线图组件配置 */
export interface LineChartComponentConfig
  extends Omit<ChartComponentConfig, 'showLegend' | 'borderRadius'> {
  /** 是否显示 X 轴标签 */
  showXAxisLabel?: boolean
  /** 是否显示 Y 轴标签 */
  showYAxisLabel?: boolean
  /** 是否显示 Y 轴线 */
  showYAxisLine?: boolean
  /** X 轴标签颜色 */
  xAxisLabelColor?: string
  /** X 轴标签字号 */
  xAxisLabelFontSize?: number
  /** Y 轴标签颜色 */
  yAxisLabelColor?: string
  /** Y 轴标签字号 */
  yAxisLabelFontSize?: number
  /** 线条粗细 */
  lineWidth?: number
  /** 节点大小；0 或 null 表示不显示节点 */
  nodeSize?: number
  /** 节点填充色 */
  nodeFillColor?: string
  /** 是否平滑折线 */
  smooth?: boolean
}

/** 柱状图组件配置 */
export interface BarChartComponentConfig extends BaseComponentConfig {
  /** 时间范围 */
  timeRange: '1h' | '6h' | '24h' | '7d'
  /** 是否显示 X 轴标签 */
  showXAxisLabel?: boolean
  /** 是否显示 Y 轴标签 */
  showYAxisLabel?: boolean
  /** 是否显示 Y 轴线 */
  showYAxisLine?: boolean
  /** X 轴标签颜色 */
  xAxisLabelColor?: string
  /** X 轴标签字号 */
  xAxisLabelFontSize?: number
  /** Y 轴标签颜色 */
  yAxisLabelColor?: string
  /** Y 轴标签字号 */
  yAxisLabelFontSize?: number
  /** 柱体颜色 */
  barColor?: string
  /** 柱体宽度（像素） */
  barWidth?: number
  /** 柱体圆角 */
  barBorderRadius?: number | number[]
}

/** 折线图数据点 */
export interface LineChartDataPoint {
  time: string
  timestamp: number
  value: number
  quality: string
}

/** 指示灯组件配置 */
export interface IndicatorComponentConfig
  extends Omit<BaseComponentConfig, 'backgroundColor' | 'borderRadius'> {
  onColor: string
  offColor: string
  onValue: number
  offValue: number
  blinkOnAlarm: boolean
}

/** 开关组件配置 */
export interface SwitchComponentConfig extends BaseComponentConfig {
  thumbColor: string
  onColor: string
  offColor: string
  onValue: number
  offValue: number
  confirmRequired: boolean
  writePoint: PointBinding | null
}

/** 亮度调节器组件配置 */
export interface SliderComponentConfig extends BaseComponentConfig {
  min: number
  max: number
  step: number
  /** 滑块颜色 */
  thumbColor?: string
}

/** 图片组件配置 */
export interface ImageComponentConfig extends BaseComponentConfig {
  url?: string
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
}

/** 按钮组件配置 */
export interface ButtonComponentConfig extends BaseComponentConfig {
  text: string
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  writeValue: number | boolean | string
  /** @deprecated 旧版写入点位，现优先使用组件 binding */
  writePoint?: PointBinding | null
  fontColor?: string
  fontSize?: number
  backgroundColor?: string
  borderWidth?: number
  borderColor?: string
  borderStyle?: string
}

/** 空调模式组件配置 */
export interface AcModeComponentConfig extends BaseComponentConfig {
  iconSize: number
  iconColor: string
  activeIconColor: string
  fontColor: string
  activeFontColor: string
  /** 当前值：编辑态/未绑定点位时的模拟值，预览时优先使用后端实际值 */
  currentValue: number | string
  coolValue: number | string
  heatValue: number | string
  autoValue: number | string
  fanValue: number | string
}

/** 空调风速组件配置 */
export interface AcFanSpeedComponentConfig extends BaseComponentConfig {
  fontSize: number
  activeBackgroundColor: string
  fontColor: string
  activeFontColor: string
  borderRadius: number
  /** 当前值：编辑态/未绑定点位时的模拟值，预览时优先使用后端实际值 */
  currentValue: number | string
  autoValue: number | string
  highValue: number | string
  mediumValue: number | string
  lowValue: number | string
}

import type { ComponentType } from '../registry'

/** 组件类型到统一配置的映射 */
export interface ComponentConfigMap {
  text: TextComponentConfig
  number: NumberComponentConfig
  'enum-value': EnumValueComponentConfig
  rectangle: RectangleComponentConfig
  circle: CircleComponentConfig
  icon: IconComponentConfig
  gauge: GaugeComponentConfig
  'chart-line': LineChartComponentConfig
  'chart-bar': BarChartComponentConfig
  indicator: IndicatorComponentConfig
  switch: SwitchComponentConfig
  slider: SliderComponentConfig
  image: ImageComponentConfig
  button: ButtonComponentConfig
  acMode: AcModeComponentConfig
  acFanSpeed: AcFanSpeedComponentConfig
}

/** 组件统一配置类型 */
export type ComponentConfig<T extends ComponentType = ComponentType> = ComponentConfigMap[T]

/** @deprecated 已合并到 TextComponentConfig，保留用于旧数据迁移 */
export interface TextConfig {
  content: string
  fontSize: number
  fontColor: string
  fontWeight: 'normal' | 'bold'
  textAlign: 'left' | 'center' | 'right'
}

/** @deprecated 已合并到 GaugeComponentConfig，保留用于旧数据迁移 */
export interface GaugeConfig {
  min: number
  max: number
  unit: string
  thresholds: { value: number; color: string }[]
  showValue: boolean
}

/** @deprecated 已合并到 ChartComponentConfig，保留用于旧数据迁移 */
export interface ChartConfig {
  timeRange: '1h' | '6h' | '24h' | '7d'
  lineColor: string
  areaFill: boolean
  showLegend: boolean
}

/** @deprecated 已合并到 IndicatorComponentConfig，保留用于旧数据迁移 */
export interface IndicatorConfig {
  onColor: string
  offColor: string
  blinkOnAlarm: boolean
}

/** @deprecated 已合并到 SwitchComponentConfig，保留用于旧数据迁移 */
export interface SwitchConfig {
  thumbColor?: string
  onColor?: string
  offColor?: string
  onValue?: number | boolean | string
  offValue?: number | boolean | string
  confirmRequired?: boolean
  writePoint?: PointBinding | null
}

/** @deprecated 已合并到 SliderComponentConfig，保留用于旧数据迁移 */
export interface SliderConfig {
  min: number
  max: number
  step: number
}

/** @deprecated 已合并到 ButtonComponentConfig，保留用于旧数据迁移 */
export interface ButtonConfig {
  text: string
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  writeValue: number | boolean | string
  writePoint?: PointBinding | null
}

/** @deprecated 已合并到 ImageComponentConfig，保留用于旧数据迁移 */
export interface ImageConfig {
  url?: string
  fit?: string
}

export interface ComponentTemplate {
  type: string
  name: string
  icon: string
  category: string
  defaultConfig: ComponentConfig
}

export interface ScadaComponentMeta {
  type: string
  component: Component
  configPanel?: Component | null
  template: {
    name: string
    icon: string
    category: string
    defaultConfig: ComponentConfig
  }
  configTypes?: Record<string, any>
}

export interface ScadaComponent<T extends ComponentType = ComponentType> {
  id: string
  type: T
  name: string
  x: number
  y: number
  config: ComponentConfig<T>
  binding: PointBinding | null
  locked: boolean
  visible: boolean
}

export interface ScadaPanel {
  id: string
  name: string
  type: PanelType
  description?: string
  width: number
  height: number
  grid: number
  backgroundColor: string
  backgroundImage?: string
  components: ScadaComponent[]
  createdAt: number
  updatedAt: number
}

export interface GuideLine {
  type: 'x' | 'y'
  pos: number
}

export interface CanvasPosition {
  x: number
  y: number
}

export interface ContextMenuState {
  visible: boolean
  position: CanvasPosition
  targetId: string | null
  type: 'node' | 'canvas'
}

export type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

export interface ResizeState {
  active: boolean
  handle: ResizeHandle | null
  componentId: string | null
  startSize: { width: number; height: number }
  startPos: CanvasPosition
  componentStartPos: CanvasPosition
}

export interface DragState {
  active: boolean
  startPos: CanvasPosition
  componentStartPos: CanvasPosition
  multiStartPositions: Map<string, CanvasPosition>
  multiStartBBox: {
    minX: number
    centerX: number
    maxX: number
    minY: number
    middleY: number
    maxY: number
  } | null
}

export interface BoxSelectState {
  active: boolean
  start: CanvasPosition
  end: CanvasPosition
}

export interface CanvasState {
  zoom: number
  showGrid: boolean
  isEditing: boolean
  mousePosition: CanvasPosition
  isMouseOnCanvas: boolean
}

export type ContextAction =
  | 'copy'
  | 'paste'
  | 'lock'
  | 'unlock'
  | 'delete'
  | 'bringToFront'
  | 'sendToBack'

export interface PanelPreset {
  key: string
  name: string
  width: number
  height: number
}

export interface ComponentPositionDelta {
  dx: number
  dy: number
}
