import type { ScadaComponentMeta, ArcComponentConfig } from '../../../../types'
import ScadaArc from './index.vue'
import ArcConfigPanel from './ConfigPanel.vue'

const defaultConfig: ArcComponentConfig = {
  width: 120,
  height: 120,
  strokeColor: '#3a8dde',
  strokeWidth: 2,
  startAngle: 0,
  endAngle: 180,
  arrow: 'none',
}

export const arcMeta: ScadaComponentMeta = {
  type: 'arc',
  component: ScadaArc,
  configPanel: ArcConfigPanel,
  template: {
    name: 'scadaComponentNames.arc',
    icon: '◠',
    category: 'scadaComponentCategories.layout',
    defaultConfig,
  },
  configTypes: {
    ArcComponentConfig: null as unknown as ArcComponentConfig,
  },
}
