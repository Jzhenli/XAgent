import type { ScadaComponentMeta, ValueProgressCardComponentConfig } from '../../../../types'
import ScadaValueProgressCard from './index.vue'
import ValueProgressCardConfigPanel from './ConfigPanel.vue'

const defaultConfig: ValueProgressCardComponentConfig = {
  width: 168,
  height: 92,
  backgroundColor: 'rgba(245, 247, 250, 0.9)',
  borderRadius: 12,
  opacity: 1,
  borderWidth: 0,
  // 标题区
  title: '湿度',
  titleFontSize: 12,
  titleFontColor: '#888888',
  // 图标区
  iconName: 'temperature',
  iconSize: 24,
  iconColor: '#333333',
  // 当前值区
  valueFontSize: 20,
  valueFontColor: '#222222',
  decimalPlaces: 0,
  // 单位区
  unit: '%',
  unitFontSize: 10,
  unitFontColor: '#666666',
  // 进度条区
  min: 0,
  max: 100,
  barColor: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)',
  barTrackColor: 'rgba(0, 0, 0, 0.08)',
  barHeight: 6,
  barRadius: 3,
  // 动画效果
  animationEnabled: true,
  animationDuration: 1.5,
  // 编辑态模拟值
  value: 54,
}

export const valueProgressCardMeta: ScadaComponentMeta = {
  type: 'value-progress-card',
  component: ScadaValueProgressCard,
  configPanel: ValueProgressCardConfigPanel,
  template: {
    name: 'scadaComponentNames.valueProgressCard',
    icon: '📊',
    category: 'scadaComponentCategories.chart',
    defaultConfig,
  },
  configTypes: {
    ValueProgressCardComponentConfig: null as unknown as ValueProgressCardComponentConfig,
  },
}
