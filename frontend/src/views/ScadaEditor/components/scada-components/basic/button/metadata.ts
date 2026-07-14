import type { ScadaComponentMeta, ButtonComponentConfig } from '../../../../types'
import ScadaButton from './index.vue'

const defaultConfig: ButtonComponentConfig = {
  width: 100,
  height: 40,
  text: 'scadaComponents.buttonText',
  type: 'primary',
  writeValue: true,
  writePoint: null
}

export const buttonMeta: ScadaComponentMeta = {
  type: 'button',
  component: ScadaButton,
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
