import type { ScadaComponentMeta, BarChartComponentConfig } from '../../../../types'
import ScadaBarChart from './index.vue'
import BarChartConfigPanel from './ConfigPanel.vue'

const defaultConfig: BarChartComponentConfig = {
  width: 300,
  height: 200,
  backgroundColor: '#ffffff00',
  value: 50,
  timeRange: '1h',
  showXAxisLabel: false,
  showYAxisLabel: false,
  showYAxisLine: true,
  xAxisLabelColor: '#666666',
  xAxisLabelFontSize: 12,
  yAxisLabelColor: '#666666',
  yAxisLabelFontSize: 12,
  barColor: '#27ae60',
  barWidth: 20,
  barBorderRadius: 4,
}

export const chartBarMeta: ScadaComponentMeta = {
  type: 'chart-bar',
  component: ScadaBarChart,
  configPanel: BarChartConfigPanel,
  template: {
    name: 'scadaComponentNames.chartBar',
    icon: '📊',
    category: 'scadaComponentCategories.chart',
    defaultConfig,
  },
  configTypes: {
    BarChartComponentConfig: null as unknown as BarChartComponentConfig,
  },
}
