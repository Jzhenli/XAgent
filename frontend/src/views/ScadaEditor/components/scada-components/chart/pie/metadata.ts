import type { ScadaComponentMeta, PieChartComponentConfig } from '../../../../types'
import ScadaPieChart from './index.vue'
import PieChartConfigPanel from './ConfigPanel.vue'

/** 默认配色方案：6 色循环 */
const PIE_COLORS = [
  '#22D3EE', // cyan
  '#86EFAC', // green
  '#FACC15', // yellow
  '#F87171', // red
  '#60A5FA', // blue
  '#A78BFA', // purple
]

const defaultConfig: PieChartComponentConfig = {
  width: 300,
  height: 200,
  backgroundColor: '#ffffff00',
  items: [
    { name: '用电', value: 30, color: PIE_COLORS[0] },
    { name: '可回收物', value: 20, color: PIE_COLORS[1] },
    { name: '固体废弃物', value: 15, color: PIE_COLORS[2] },
    { name: '污水', value: 12, color: PIE_COLORS[3] },
    { name: '饮用水', value: 13, color: PIE_COLORS[4] },
    { name: '燃气', value: 10, color: PIE_COLORS[5] },
  ],
  showLegend: true,
  legendColor: '#94A3B8',
  legendFontSize: 12,
  showDonut: true,
  innerRadius: '60%',
  showLabel: false,
  pieGap: 2,
  pieBorderRadius: 6,
}

export const chartPieMeta: ScadaComponentMeta = {
  type: 'chart-pie',
  component: ScadaPieChart,
  configPanel: PieChartConfigPanel,
  template: {
    name: 'scadaComponentNames.chartPie',
    icon: '🥧',
    category: 'scadaComponentCategories.chart',
    defaultConfig,
  },
  configTypes: {
    PieChartComponentConfig: null as unknown as PieChartComponentConfig,
  },
}
