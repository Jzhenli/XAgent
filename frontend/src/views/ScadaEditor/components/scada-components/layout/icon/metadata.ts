import type { ScadaComponentMeta, IconComponentConfig } from '../../../../types'
import ScadaIcon from './index.vue'
import IconConfigPanel from './ConfigPanel.vue'

const defaultConfig: IconComponentConfig = {
  width: 64,
  height: 64,
  iconName: 'home',
  iconColor: 'var(--color-primary)'
}

export const iconMeta: ScadaComponentMeta = {
  type: 'icon',
  component: ScadaIcon,
  configPanel: IconConfigPanel,
  template: {
    name: 'scadaComponentNames.icon',
    icon: '✦',
    category: 'scadaComponentCategories.layout',
    defaultConfig
  },
  configTypes: {
    IconComponentConfig: null as unknown as IconComponentConfig
  }
}
