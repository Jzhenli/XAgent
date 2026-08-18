import type { ScadaComponentMeta, SliderSwitchComponentConfig } from '../../../../types'
import ScadaSliderSwitch from './index.vue'
import SliderSwitchConfigPanel from './ConfigPanel.vue'

const defaultConfig: SliderSwitchComponentConfig = {
  width: 260,
  height: 64,
  value: 0,
  min: 0,
  max: 100,
  activeTrackColor: '#22D3EE',
  inactiveTrackColor: 'rgba(120, 130, 150, 0.35)',
  trackHeight: 22,
  thumbColor: '#FFFFFF',
  borderRadius: 12,
  showAxis: true,
  showValue: true,
  axisFontSize: 11,
  axisColor: '#8A93A6',
}

export const sliderSwitchMeta: ScadaComponentMeta = {
  type: 'slider-switch',
  component: ScadaSliderSwitch,
  configPanel: SliderSwitchConfigPanel,
  template: {
    name: 'scadaComponentNames.sliderSwitch',
    icon: '🎚️',
    category: 'scadaComponentCategories.chart',
    defaultConfig,
  },
  configTypes: {
    SliderSwitchComponentConfig: null as unknown as SliderSwitchComponentConfig,
  },
}
