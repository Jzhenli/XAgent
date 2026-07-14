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

/** 仪表盘组件配置 */
export interface GaugeComponentConfig extends BaseComponentConfig {
  min: number
  max: number
  unit: string
  thresholds: { value: number; color: string }[]
  showValue: boolean
}

/** 图表组件配置 */
export interface ChartComponentConfig extends BaseComponentConfig {
  timeRange: '1h' | '6h' | '24h' | '7d'
  lineColor: string
  areaFill: boolean
  showLegend: boolean
}

/** 指示灯组件配置 */
export interface IndicatorComponentConfig extends BaseComponentConfig {
  onColor: string
  offColor: string
  blinkOnAlarm: boolean
}

/** 开关组件配置 */
export interface SwitchComponentConfig extends BaseComponentConfig {
  onText: string
  offText: string
  confirmRequired: boolean
  writePoint: PointBinding | null
}

/** 滑块组件配置 */
export interface SliderComponentConfig extends BaseComponentConfig {
  min: number
  max: number
  step: number
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
  writePoint: PointBinding | null
}

/** 容器组件配置 */
export interface ContainerComponentConfig extends BaseComponentConfig {
}

import type { ComponentType } from '../registry'

/** 组件类型到统一配置的映射 */
export interface ComponentConfigMap {
  text: TextComponentConfig
  gauge: GaugeComponentConfig
  'chart-line': ChartComponentConfig
  'chart-bar': ChartComponentConfig
  indicator: IndicatorComponentConfig
  switch: SwitchComponentConfig
  slider: SliderComponentConfig
  image: ImageComponentConfig
  button: ButtonComponentConfig
  container: ContainerComponentConfig
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
  onText: string
  offText: string
  confirmRequired: boolean
  writePoint: PointBinding | null
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
  writePoint: PointBinding | null
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
