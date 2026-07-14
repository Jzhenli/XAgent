import type { ScadaComponentMeta, ChartComponentConfig } from '../../../../types'
import ScadaChart from './index.vue'
import ChartConfigPanel from './ConfigPanel.vue'

const defaultConfig: ChartComponentConfig = {
  width: 300,
  height: 200,
  backgroundColor: '#ffffff',
  borderRadius: 8,
  timeRange: '24h',
  lineColor: '#3498db',
  areaFill: true,
  showLegend: true
}

export const chartLineMeta: ScadaComponentMeta = {
  type: 'chart-line',
  component: ScadaChart,
  configPanel: ChartConfigPanel,
  template: {
    name: 'scadaComponentNames.chartLine',
    icon: '📈',
    category: 'scadaComponentCategories.chart',
    defaultConfig
  },
  configTypes: {
    ChartComponentConfig: null as unknown as ChartComponentConfig
  }
}

export const chartBarMeta: ScadaComponentMeta = {
  type: 'chart-bar',
  component: ScadaChart,
  configPanel: ChartConfigPanel,
  template: {
    name: 'scadaComponentNames.chartBar',
    icon: '📊',
    category: 'scadaComponentCategories.chart',
    defaultConfig: {
      ...defaultConfig,
      lineColor: '#27ae60',
      areaFill: false
    }
  },
  configTypes: {
    ChartComponentConfig: null as unknown as ChartComponentConfig
  }
}
