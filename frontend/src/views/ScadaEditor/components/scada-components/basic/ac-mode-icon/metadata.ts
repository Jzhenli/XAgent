import type { ScadaComponentMeta, AcModeIconComponentConfig } from '../../../../types'
import ScadaAcModeIcon from './index.vue'
import AcModeIconConfigPanel from './ConfigPanel.vue'

const defaultConfig: AcModeIconComponentConfig = {
  width: 60,
  height: 60,
  backgroundColor: 'rgba(255, 255, 255, 0)',
  iconSize: 28,
  iconColor: 'rgb(0, 0, 0, 1)',
  activeIconColor: 'rgba(102, 102, 255, 1)',
  currentValue: 0,
  autoValue: 0,
  coolValue: 1,
  heatValue: 2,
  fanValue: 3,
  /** 默认四种模式都参与循环切换 */
  cycleModes: ['auto', 'cool', 'heat', 'fan']
}

export const acModeIconMeta: ScadaComponentMeta = {
  type: 'acModeIcon',
  component: ScadaAcModeIcon,
  configPanel: AcModeIconConfigPanel,
  template: {
    name: 'scadaComponentNames.acModeIcon',
    icon: '🔄',
    category: 'scadaComponentCategories.basic',
    defaultConfig
  },
  configTypes: {
    AcModeIconComponentConfig: null as unknown as AcModeIconComponentConfig
  }
}
