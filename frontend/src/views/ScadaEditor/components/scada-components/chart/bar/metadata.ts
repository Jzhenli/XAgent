import type { ScadaComponentMeta, ChartComponentConfig } from '../../../../types'
import ScadaBarChart from './index.vue'
import BarChartConfigPanel from './ConfigPanel.vue'

const defaultConfig: ChartComponentConfig = {
  width: 300,
  height: 200,
  backgroundColor: '#ffffff',
  borderRadius: 8,
  timeRange: '24h',
  lineColor: '#27ae60',
  areaFill: false,
  showLegend: true
}

export const chartBarMeta: ScadaComponentMeta = {
  type: 'chart-bar',
  component: ScadaBarChart,
  configPanel: BarChartConfigPanel,
  template: {
    name: 'scadaComponentNames.chartBar',
    icon: '📊',
    category: 'scadaComponentCategories.chart',
    defaultConfig
  },
  configTypes: {
    ChartComponentConfig: null as unknown as ChartComponentConfig
  }
}
