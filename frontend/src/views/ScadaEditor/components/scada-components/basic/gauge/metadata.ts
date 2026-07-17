import type { ScadaComponentMeta, GaugeComponentConfig } from '../../../../types'
import ScadaGauge from './index.vue'
import GaugeConfigPanel from './ConfigPanel.vue'

const defaultConfig: GaugeComponentConfig = {
  width: 150,
  height: 150,
  borderRadius: 12,
  fontSize: 32,
  fontColor: '#000000',
  fontWeight: 'bold',
  min: 0,
  max: 100,
  unit: '',
  value: 48,
  targetValue: 48,
  trackColor: '#4a4a6a',
  fillColor: '#4a90e2',
  fillGradient: ['#4a90e2', '#50e3c2', '#f5a623'],
  trackWidth: 12,
  strokeLinecap: 'round',
  step: 1,
  showButtons: true,
  thresholds: [],
  showValue: true,
  stepFontSize: 12,
  stepFontColor: '#000000',
  unitFontSize: 16,
  unitFontColor: '#000000',
  unitFontWeight: 'normal',
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
