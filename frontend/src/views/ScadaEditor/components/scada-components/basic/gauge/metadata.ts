import type { ScadaComponentMeta, GaugeComponentConfig } from '../../../../types'
import ScadaGauge from './index.vue'
import GaugeConfigPanel from './ConfigPanel.vue'

const defaultConfig: GaugeComponentConfig = {
  width: 150,
  height: 150,
  backgroundColor: '#f5f7fa',
  borderRadius: 8,
  fontSize: 24,
  fontColor: '#2c3e50',
  min: 0,
  max: 100,
  unit: '',
  thresholds: [
    { value: 30, color: '#27ae60' },
    { value: 70, color: '#f39c12' },
    { value: 100, color: '#e74c3c' }
  ],
  showValue: true
}

export const gaugeMeta: ScadaComponentMeta = {
  type: 'gauge',
  component: ScadaGauge,
  configPanel: GaugeConfigPanel,
  template: {
    name: 'scadaComponentNames.gauge',
    icon: '🎯',
    category: 'scadaComponentCategories.basic',
    defaultConfig
  },
  configTypes: {
    GaugeComponentConfig: null as unknown as GaugeComponentConfig
  }
}
