import type { ScadaComponentMeta, SwitchComponentConfig } from '../../../../types'
import ScadaSwitch from './index.vue'

const defaultConfig: SwitchComponentConfig = {
  width: 100,
  height: 50,
  onText: 'scadaComponents.switchOn',
  offText: 'scadaComponents.switchOff',
  confirmRequired: true,
  writePoint: null
}

export const switchMeta: ScadaComponentMeta = {
  type: 'switch',
  component: ScadaSwitch,
  template: {
    name: 'scadaComponentNames.switch',
    icon: '🔘',
    category: 'scadaComponentCategories.basic',
    defaultConfig
  },
  configTypes: {
    SwitchComponentConfig: null as unknown as SwitchComponentConfig
  }
}
