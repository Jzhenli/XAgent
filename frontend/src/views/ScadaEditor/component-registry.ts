export type {
  StyleConfig,
  ScadaComponentMeta,
  GaugeConfig,
  ChartConfig,
  IndicatorConfig,
  SwitchConfig,
  SliderConfig,
  TextConfig,
  ButtonConfig,
  ImageConfig,
  PointBinding,
  ComponentTemplate,
  ScadaComponent,
  ScadaPanel
} from './types'
export type { ComponentType } from './registry'

export {
  componentMetaRegistry,
  getComponentMeta,
  getComponent,
  getConfigPanel,
  getComponentTemplate,
  getAllTemplates,
  COMPONENT_TEMPLATES,
  registerComponent,
  getRegisteredTypes
} from './registry'