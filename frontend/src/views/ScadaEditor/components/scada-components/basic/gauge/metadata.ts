import type { ScadaComponentMeta, GaugeComponentConfig } from '../../../../types'
import ScadaGauge from './index.vue'
import GaugeConfigPanel from './ConfigPanel.vue'

/**
 * 仪表盘组件默认配置
 * 按“尺寸 → 数据 → 轨道/填充 → 文本 → 步进按钮”分组，便于维护
 */
const defaultConfig: GaugeComponentConfig = {
  // 尺寸
  width: 150,
  height: 150,
  borderRadius: 12,

  // 数据
  min: 0,
  max: 100,
  value: 48,
  targetValue: 48,
  step: 1,
  unit: '',
  thresholds: [],

  // 轨道与填充
  trackWidth: 16,
  trackColor: '#4a4a6a',
  strokeLinecap: 'round',
  fillColor: '#4a90e2',
  fillGradient: ['#4a90e2', '#50e3c2', '#f5a623'],

  // 中心数值文本
  fontSize: 32,
  fontColor: '#000000',
  fontWeight: 'bold',
  unitFontSize: 16,
  unitFontColor: '#000000',
  unitFontWeight: 'normal',
  showValue: true,

  // 步进按钮
  showButtons: true,
  stepFontSize: 24,
  stepFontColor: '#000000',
}

export const gaugeMeta: ScadaComponentMeta = {
  type: 'gauge',
  component: ScadaGauge,
  configPanel: GaugeConfigPanel,
  template: {
    name: 'scadaComponentNames.gauge',
    icon: '🎯',
    category: 'scadaComponentCategories.basic',
    defaultConfig,
  },
}
