import type { ScadaComponentMeta, SwitchComponentConfig } from '../../../../types'
import ScadaSwitch from './index.vue'
import SwitchConfigPanel from './ConfigPanel.vue'

const defaultConfig: SwitchComponentConfig = {
  width: 60,
  height: 30,
  backgroundColor: 'rgba(0, 0, 0, 0)',
  thumbColor: 'rgba(255, 255, 255, 1)',
  onColor: 'rgba(39, 174, 96, 1)',
  offColor: 'rgba(149, 165, 166, 1)',
  onValue: 1,
  offValue: 0,
  confirmRequired: false,
  writePoint: null
}

export const switchMeta: ScadaComponentMeta = {
  type: 'switch',
  component: ScadaSwitch,
  configPanel: SwitchConfigPanel,
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
