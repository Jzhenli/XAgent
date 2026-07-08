import type { Component } from 'vue'

export type PanelType = 'Dashboard' | 'Graphic'

export interface PointBinding {
  deviceId: string
  pointName: string
  pointDescription?: string
  unit?: string
}

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

export interface ComponentTemplate {
  type: string
  name: string
  icon: string
  category: string
  defaultStyle: StyleConfig
  defaultConfig: Record<string, any>
}

export interface ScadaComponentMeta {
  type: string
  component: Component
  configPanel?: Component | null
  template: {
    name: string
    icon: string
    category: string
    defaultStyle: StyleConfig
    defaultConfig: Record<string, any>
  }
  configTypes?: Record<string, any>
}

export interface GaugeConfig {
  min: number
  max: number
  unit: string
  thresholds: { value: number; color: string }[]
  showValue: boolean
}

export interface ChartConfig {
  timeRange: '1h' | '6h' | '24h' | '7d'
  lineColor: string
  areaFill: boolean
  showLegend: boolean
}

export interface IndicatorConfig {
  onColor: string
  offColor: string
  blinkOnAlarm: boolean
}

export interface SwitchConfig {
  onText: string
  offText: string
  confirmRequired: boolean
  writePoint: PointBinding | null
}

export interface SliderConfig {
  min: number
  max: number
  step: number
}

export interface TextConfig {
  content: string
  fontSize: number
  fontColor: string
  fontWeight: 'normal' | 'bold'
  textAlign: 'left' | 'center' | 'right'
}

export interface ButtonConfig {
  text: string
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  writeValue: number | boolean | string
  writePoint: PointBinding | null
}

export interface ImageConfig {
  url?: string
  fit?: string
}

import type { ComponentType } from '../registry'

export interface ScadaComponent {
  id: string
  type: ComponentType
  name: string
  x: number
  y: number
  style: StyleConfig
  binding: PointBinding | null
  gaugeConfig?: GaugeConfig
  chartConfig?: ChartConfig
  indicatorConfig?: IndicatorConfig
  switchConfig?: SwitchConfig
  sliderConfig?: SliderConfig
  textConfig?: TextConfig
  imageConfig?: ImageConfig
  buttonConfig?: ButtonConfig
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
  startSize: { width: number; height: number }
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