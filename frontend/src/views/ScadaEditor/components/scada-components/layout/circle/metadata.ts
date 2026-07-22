import type { ScadaComponentMeta, CircleComponentConfig } from '../../../../types'
import ScadaCircle from './index.vue'
import CircleConfigPanel from './ConfigPanel.vue'

const defaultConfig: CircleComponentConfig = {
  width: 120,
  height: 120,
  backgroundColor: 'rgba(200, 200, 200, 0.3)',
  borderWidth: 1,
  borderColor: 'rgba(150, 150, 150, 0.5)',
  blur: 0
}

export const circleMeta: ScadaComponentMeta = {
  type: 'circle',
  component: ScadaCircle,
  configPanel: CircleConfigPanel,
  template: {
    name: 'scadaComponentNames.circle',
    icon: '●',
    category: 'scadaComponentCategories.layout',
    defaultConfig
  },
  configTypes: {
    CircleComponentConfig: null as unknown as CircleComponentConfig
  }
}
