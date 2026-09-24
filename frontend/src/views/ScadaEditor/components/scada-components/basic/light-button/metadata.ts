import type { ScadaComponentMeta, LightButtonComponentConfig } from '../../../../types'
import LightButton from './index.vue'
import LightButtonConfigPanel from './ConfigPanel.vue'

const defaultConfig: LightButtonComponentConfig = {
  width: 147,
  height: 40,
  backgroundColor: 'rgba(0, 0, 0, 0.53)',
  borderRadius: 10,
  text: '灯',
  iconName: 'light',
  iconSize: 28,
  iconColor: 'rgba(255, 255, 255, 0.60)',
  activeIconColor: 'rgba(255, 255, 255, 1)',
  fontColor: 'rgba(255, 255, 255, 0.60)',
  activeFontColor: 'rgba(255, 255, 255, 1)',
  activeBackgroundColor: 'rgba(102, 102, 255, 1)',
  fontSize: 12,
  onValue: 1,
  offValue: 0,
  confirmRequired: false,
  writePoint: null,
  value: 0
}

export const lightButtonMeta: ScadaComponentMeta = {
  type: 'light-button',
  component: LightButton,
  configPanel: LightButtonConfigPanel,
  template: {
    name: 'scadaComponentNames.lightButton',
    icon: '💡',
    category: 'scadaComponentCategories.basic',
    defaultConfig
  },
  configTypes: {
    LightButtonComponentConfig: null as unknown as LightButtonComponentConfig
  }
}
