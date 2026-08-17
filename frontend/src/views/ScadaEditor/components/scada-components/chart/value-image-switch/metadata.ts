import type { ScadaComponentMeta, ValueImageSwitchComponentConfig } from '../../../../types'
import ScadaValueImageSwitch from './index.vue'
import ValueImageSwitchConfigPanel from './ConfigPanel.vue'

const defaultConfig: ValueImageSwitchComponentConfig = {
  width: 160,
  height: 120,
  backgroundColor: '#f5f7fa',
  borderRadius: 4,
  opacity: 1,
  fit: 'contain',
  items: [],
  defaultUrl: '',
}

export const valueImageSwitchMeta: ScadaComponentMeta = {
  type: 'value-image-switch',
  component: ScadaValueImageSwitch,
  configPanel: ValueImageSwitchConfigPanel,
  template: {
    name: 'scadaComponentNames.valueImageSwitch',
    icon: '🔀',
    category: 'scadaComponentCategories.chart',
    defaultConfig,
  },
  configTypes: {
    ValueImageSwitchComponentConfig: null as unknown as ValueImageSwitchComponentConfig,
  },
}
