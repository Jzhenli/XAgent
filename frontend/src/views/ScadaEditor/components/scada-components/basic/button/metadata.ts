import type { ScadaComponentMeta, ButtonComponentConfig } from '../../../../types'
import ScadaButton from './index.vue'
import ButtonConfigPanel from './ConfigPanel.vue'

const defaultConfig: ButtonComponentConfig = {
  width: 100,
  height: 40,
  text: 'Button',
  type: 'primary',
  writeValue: 1,
  fontColor: '#ffffff',
  fontSize: 14,
  backgroundColor: '#409eff',
  borderWidth: 0,
  borderColor: '#409eff',
  borderStyle: 'solid'
}

export const buttonMeta: ScadaComponentMeta = {
  type: 'button',
  component: ScadaButton,
  configPanel: ButtonConfigPanel,
  template: {
    name: 'scadaComponentNames.button',
    icon: '🔲',
    category: 'scadaComponentCategories.basic',
    defaultConfig
  },
  configTypes: {
    ButtonComponentConfig: null as unknown as ButtonComponentConfig
  }
}
