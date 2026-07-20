import type { ScadaComponentMeta, LineChartComponentConfig } from '../../../../types'
import ScadaLineChart from './index.vue'
import LineChartConfigPanel from './ConfigPanel.vue'

const defaultConfig: LineChartComponentConfig = {
  width: 300,
  height: 200,
  backgroundColor: '#ffffff00',
  value: 50,
  timeRange: '1h',
  lineColor: '#3498db',
  areaFill: true,
  showXAxisLabel: false,
  showYAxisLabel: false,
  showYAxisLine: true,
  xAxisLabelColor: '#666666',
  xAxisLabelFontSize: 12,
  yAxisLabelColor: '#666666',
  yAxisLabelFontSize: 12,
  lineWidth: 2,
  nodeSize: 0,
  nodeFillColor: '#3498db',
  smooth: true,
}

export const chartLineMeta: ScadaComponentMeta = {
  type: 'chart-line',
  component: ScadaLineChart,
  configPanel: LineChartConfigPanel,
  template: {
    name: 'scadaComponentNames.chartLine',
    icon: '📈',
    category: 'scadaComponentCategories.chart',
    defaultConfig,
  },
  configTypes: {
    LineChartComponentConfig: null as unknown as LineChartComponentConfig,
  },
}
