import type { ScadaComponentMeta, LineComponentConfig } from '../../../../types'
import ScadaLine from './index.vue'
import LineConfigPanel from './ConfigPanel.vue'

const defaultConfig: LineComponentConfig = {
  width: 120,
  height: 8,
  strokeColor: '#3a8dde',
  strokeWidth: 2,
  angle: 0,
  arrow: 'none',
}

export const lineMeta: ScadaComponentMeta = {
  type: 'line',
  component: ScadaLine,
  configPanel: LineConfigPanel,
  template: {
    name: 'scadaComponentNames.line',
    icon: '━',
    category: 'scadaComponentCategories.layout',
    defaultConfig,
  },
  configTypes: {
    LineComponentConfig: null as unknown as LineComponentConfig,
  },
}
