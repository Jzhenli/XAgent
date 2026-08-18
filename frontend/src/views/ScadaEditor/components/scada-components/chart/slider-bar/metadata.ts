import type { ScadaComponentMeta, SliderBarComponentConfig } from '../../../../types'
import ScadaSliderBar from './index.vue'
import SliderBarConfigPanel from './ConfigPanel.vue'

const defaultConfig: SliderBarComponentConfig = {
  width: 300,
  height: 220,
  min: 0,
  max: 100,
  barColor: '#22D3EE',
  barWidth: 36,
  valueFontSize: 12,
  valueColor: '#8A93A6',
  axisFontSize: 11,
  axisColor: '#8A93A6',
  showYAxisLabel: true,
  showXAxis: true,
  barRadius: 0,
  showCurrentValue: true,
  items: [
    { label: '1#', value: 40, binding: null },
    { label: '2#', value: 65, binding: null },
    { label: '3#', value: 20, binding: null },
  ],
}

export const sliderBarMeta: ScadaComponentMeta = {
  type: 'slider-bar',
  component: ScadaSliderBar,
  configPanel: SliderBarConfigPanel,
  template: {
    name: 'scadaComponentNames.sliderBar',
    icon: '🎛️',
    category: 'scadaComponentCategories.chart',
    defaultConfig,
  },
  configTypes: {
    SliderBarComponentConfig: null as unknown as SliderBarComponentConfig,
  },
}
