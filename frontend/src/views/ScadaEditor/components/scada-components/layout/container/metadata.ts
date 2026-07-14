import type { ScadaComponentMeta, ContainerComponentConfig } from '../../../../types'
import ScadaContainer from './index.vue'
import ContainerConfigPanel from './ConfigPanel.vue'

const defaultConfig: ContainerComponentConfig = {
  width: 300,
  height: 200,
  backgroundColor: '#f5f7fa',
  borderWidth: 1,
  borderColor: '#dce1e6',
  borderRadius: 4
}

export const containerMeta: ScadaComponentMeta = {
  type: 'container',
  component: ScadaContainer,
  configPanel: ContainerConfigPanel,
  template: {
    name: 'scadaComponentNames.container',
    icon: '📦',
    category: 'scadaComponentCategories.layout',
    defaultConfig
  },
  configTypes: {
    ContainerComponentConfig: null as unknown as ContainerComponentConfig
  }
}
