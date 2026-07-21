import type { ScadaComponentMeta, AcFanSpeedComponentConfig } from '../../../../types'
import ScadaAcFanSpeed from './index.vue'
import AcFanSpeedConfigPanel from './ConfigPanel.vue'

const defaultConfig: AcFanSpeedComponentConfig = {
  width: 220,
  height: 56,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: 8,
  iconSize: 20,
  iconColor: 'rgba(255, 255, 255, 0.7)',
  activeIconColor: 'rgba(255, 255, 255, 1)',
  activeBackgroundColor: 'rgba(64, 158, 255, 1)',
  fontColor: 'rgba(255, 255, 255, 0.7)',
  activeFontColor: 'rgba(255, 255, 255, 1)',
  autoValue: 0,
  highValue: 3,
  mediumValue: 2,
  lowValue: 1
}

export const acFanSpeedMeta: ScadaComponentMeta = {
  type: 'acFanSpeed',
  component: ScadaAcFanSpeed,
  configPanel: AcFanSpeedConfigPanel,
  template: {
    name: 'scadaComponentNames.acFanSpeed',
    icon: '💨',
    category: 'scadaComponentCategories.basic',
    defaultConfig
  },
  configTypes: {
    AcFanSpeedComponentConfig: null as unknown as AcFanSpeedComponentConfig
  }
}
