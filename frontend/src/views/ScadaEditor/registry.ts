import type { Component } from 'vue'
import type { ScadaComponentMeta } from './types'

// ─── 导入所有组件元数据 ────────────────────────────────────────
import { gaugeMeta } from './components/scada-components/basic/gauge/metadata'
import { numberMeta } from './components/scada-components/basic/number/metadata'
import { enumValueMeta } from './components/scada-components/basic/enum-value/metadata'
import { writeValueMeta } from './components/scada-components/basic/write-value/metadata'
import { chartLineMeta } from './components/scada-components/chart/line/metadata'
import { chartBarMeta } from './components/scada-components/chart/bar/metadata'
import { indicatorMeta } from './components/scada-components/basic/indicator/metadata'
import { switchMeta } from './components/scada-components/basic/switch/metadata'
import { sliderMeta } from './components/scada-components/basic/slider/metadata'
import { textMeta } from './components/scada-components/layout/text/metadata'
import { rectangleMeta } from './components/scada-components/layout/rectangle/metadata'
import { circleMeta } from './components/scada-components/layout/circle/metadata'
import { iconMeta } from './components/scada-components/layout/icon/metadata'
import { imageMeta } from './components/scada-components/basic/image/metadata'
import { buttonMeta } from './components/scada-components/basic/button/metadata'
import { acModeMeta } from './components/scada-components/basic/ac-mode/metadata'
import { acFanSpeedMeta } from './components/scada-components/basic/ac-fan-speed/metadata'

// ─── 统一组件注册表：type -> 完整元数据 ─────────────────────────
// 新增组件只需在此添加映射，ComponentType 自动推导
export const componentMetaRegistry = {
  gauge: gaugeMeta,
  number: numberMeta,
  'enum-value': enumValueMeta,
  'write-value': writeValueMeta,
  'chart-line': chartLineMeta,
  'chart-bar': chartBarMeta,
  indicator: indicatorMeta,
  switch: switchMeta,
  slider: sliderMeta,
  text: textMeta,
  rectangle: rectangleMeta,
  circle: circleMeta,
  icon: iconMeta,
  image: imageMeta,
  button: buttonMeta,
  acMode: acModeMeta,
  acFanSpeed: acFanSpeedMeta,
} as const

/** 组件类型 —— 从注册表键名自动推导 */
export type ComponentType = keyof typeof componentMetaRegistry

/** 注册表记录类型，用于动态访问场景 */
type Registry = Record<string, ScadaComponentMeta>

// ─── 查询 API ──────────────────────────────────────────────────

/** 获取组件完整元数据 */
export const getComponentMeta = (type: ComponentType): ScadaComponentMeta | undefined =>
  componentMetaRegistry[type]

/** 获取组件视图 */
export const getComponent = (type: ComponentType): Component | undefined =>
  componentMetaRegistry[type]?.component

/** 获取组件配置面板（无则返回 null） */
export const getConfigPanel = (type: ComponentType): Component | null =>
  (componentMetaRegistry as Registry)[type]?.configPanel ?? null

/** 获取组件模板（用于拖拽创建），type 非法时返回 undefined */
export const getComponentTemplate = (type: ComponentType) => {
  const meta = componentMetaRegistry[type]
  return meta && { type: meta.type, ...meta.template }
}

/** 获取所有组件模板列表（用于组件库面板） */
export const getAllTemplates = () =>
  Object.values(componentMetaRegistry).map(({ type, template }) => ({ type, ...template }))

/** 组件模板列表（数组形式，向后兼容） */
export const COMPONENT_TEMPLATES = getAllTemplates()

// ─── 注册 API ──────────────────────────────────────────────────

/**
 * 注册新组件（支持运行时动态注册）
 * @throws 当 meta 缺少 type 或 component 时抛出异常
 */
export const registerComponent = (meta: ScadaComponentMeta): void => {
  if (!meta?.type) {
    throw new Error('[registerComponent] meta.type is required')
  }
  if (!meta.component) {
    throw new Error(`[registerComponent] meta.component is required for type "${meta.type}"`)
  }
  ;(componentMetaRegistry as Registry)[meta.type] = meta
}

/** 获取所有已注册的组件类型 */
export const getRegisteredTypes = (): ComponentType[] =>
  Object.keys(componentMetaRegistry) as ComponentType[]
