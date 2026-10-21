import type { ScadaComponentMeta, SankeyChartComponentConfig } from '../../../../types'
import ScadaSankeyChart from './index.vue'
import SankeyChartConfigPanel from './ConfigPanel.vue'

/** 赛博朋克节点配色 */
const NODE_COLORS = [
  '#22D3EE', // cyan
  '#A78BFA', // purple
  '#34D399', // green
  '#FBBF24', // amber
  '#F472B6', // pink
  '#60A5FA', // blue
  '#FB7185', // rose
  '#2DD4BF', // teal
]

const defaultConfig: SankeyChartComponentConfig = {
  width: 400,
  height: 300,
  backgroundColor: '#ffffff00',
  // 默认数据中心能源流向场景
  nodes: [
    { name: '服务器集群', color: NODE_COLORS[0] },
    { name: '冷却系统', color: NODE_COLORS[1] },
    { name: '照明系统', color: NODE_COLORS[2] },
    { name: '电池储能', color: NODE_COLORS[3] },
    { name: '电网供电', color: NODE_COLORS[4] },
    { name: '数据中心', color: NODE_COLORS[5] },
  ],
  links: [
    { source: '服务器集群', target: '电池储能', value: 45 },
    { source: '服务器集群', target: '电网供电', value: 30 },
    { source: '冷却系统', target: '电池储能', value: 25 },
    { source: '冷却系统', target: '电网供电', value: 20 },
    { source: '照明系统', target: '电池储能', value: 15 },
    { source: '照明系统', target: '电网供电', value: 10 },
    { source: '电池储能', target: '数据中心', value: 60 },
    { source: '电网供电', target: '数据中心', value: 40 },
  ],
  nodeWidth: 20,
  nodeGap: 14,
  nodeBorderRadius: 4,
  linkColorMode: 'gradient',
  linkOpacity: 0.45,
  hoverHighlight: true,
  autoRefresh: true,
  refreshInterval: 3000,
}

export const chartSankeyMeta: ScadaComponentMeta = {
  type: 'chart-sankey',
  component: ScadaSankeyChart,
  configPanel: SankeyChartConfigPanel,
  template: {
    name: 'scadaComponentNames.chartSankey',
    icon: '🌊',
    category: 'scadaComponentCategories.chart',
    defaultConfig,
  },
  configTypes: {
    SankeyChartComponentConfig: null as unknown as SankeyChartComponentConfig,
  },
}
