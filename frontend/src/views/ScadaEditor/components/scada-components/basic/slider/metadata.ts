import type { ScadaComponentMeta, SliderComponentConfig } from '../../../../types'
import ScadaSlider from './index.vue'
import SliderConfigPanel from './ConfigPanel.vue'

const defaultConfig: SliderComponentConfig = {
  width: 200,
  height: 40,
  min: 0,
  max: 100,
  step: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  thumbColor: 'rgba(255, 204, 0, 1)',
}

export const sliderMeta: ScadaComponentMeta = {
  type: 'slider',
  component: ScadaSlider,
  configPanel: SliderConfigPanel,
  template: {
    name: 'scadaComponentNames.slider',
    icon: '🔆',
    category: 'scadaComponentCategories.basic',
    defaultConfig
  },
  configTypes: {
    SliderComponentConfig: null as unknown as SliderComponentConfig
  }
}
