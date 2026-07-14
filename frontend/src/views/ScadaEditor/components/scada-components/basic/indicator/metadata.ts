import type { ScadaComponentMeta, IndicatorComponentConfig } from '../../../../types'
import ScadaIndicator from './index.vue'
import IndicatorConfigPanel from './ConfigPanel.vue'

const defaultConfig: IndicatorComponentConfig = {
  width: 60,
  height: 60,
  backgroundColor: '#f5f7fa',
  borderRadius: 8,
  onColor: '#27ae60',
  offColor: '#95a5a6',
  blinkOnAlarm: true
}

export const indicatorMeta: ScadaComponentMeta = {
  type: 'indicator',
  component: ScadaIndicator,
  configPanel: IndicatorConfigPanel,
  template: {
    name: 'scadaComponentNames.indicator',
    icon: '💡',
    category: 'scadaComponentCategories.basic',
    defaultConfig
  },
  configTypes: {
    IndicatorComponentConfig: null as unknown as IndicatorComponentConfig
  }
}
