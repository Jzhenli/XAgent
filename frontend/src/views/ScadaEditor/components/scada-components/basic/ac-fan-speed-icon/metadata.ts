import type { ScadaComponentMeta, AcFanSpeedIconComponentConfig } from '../../../../types'
import ScadaAcFanSpeedIcon from './index.vue'
import AcFanSpeedIconConfigPanel from './ConfigPanel.vue'

const defaultConfig: AcFanSpeedIconComponentConfig = {
  width: 60,
  height: 60,
  backgroundColor: 'rgba(255, 255, 255, 0)',
  iconSize: 28,
  iconColor: 'rgb(0, 0, 0, 1)',
  activeIconColor: 'rgba(102, 102, 255, 1)',
  currentValue: 0,
  autoValue: 0,
  lowValue: 1,
  mediumValue: 2,
  highValue: 3,
  /** 默认四种档位都参与循环切换 */
  cycleModes: ['auto', 'low', 'medium', 'high']
}

export const acFanSpeedIconMeta: ScadaComponentMeta = {
  type: 'acFanSpeedIcon',
  component: ScadaAcFanSpeedIcon,
  configPanel: AcFanSpeedIconConfigPanel,
  template: {
    name: 'scadaComponentNames.acFanSpeedIcon',
    icon: '💨',
    category: 'scadaComponentCategories.basic',
    defaultConfig
  },
  configTypes: {
    AcFanSpeedIconComponentConfig: null as unknown as AcFanSpeedIconComponentConfig
  }
}
