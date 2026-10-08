import type { ScadaComponentMeta, InfoCardComponentConfig } from '../../../../types'
import ScadaInfoCard from './index.vue'
import InfoCardConfigPanel from './ConfigPanel.vue'

const defaultConfig: InfoCardComponentConfig = {
  width: 108,
  height: 144,
  backgroundColor: 'rgba(245, 247, 250, 0.9)',
  borderRadius: 12,
  opacity: 1,
  borderWidth: 0,
  // 标题区
  title: '温度',
  titleFontSize: 14,
  titleFontColor: '#666666',
  // 图标区
  iconName: 'temperature',
  iconSize: 40,
  iconColor: '#333333',
  // 当前值区
  valueFontSize: 26,
  valueFontColor: '#222222',
  decimalPlaces: 0,
  // 单位区
  unit: '°C',
  unitFontSize: 14,
  unitFontColor: '#666666',
  // 编辑态模拟值
  value: 24,
}

export const infoCardMeta: ScadaComponentMeta = {
  type: 'info-card',
  component: ScadaInfoCard,
  configPanel: InfoCardConfigPanel,
  template: {
    name: 'scadaComponentNames.infoCard',
    icon: '🌡️',
    category: 'scadaComponentCategories.chart',
    defaultConfig,
  },
  configTypes: {
    InfoCardComponentConfig: null as unknown as InfoCardComponentConfig,
  },
}
