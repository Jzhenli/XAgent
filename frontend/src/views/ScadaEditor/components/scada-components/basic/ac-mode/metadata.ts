import type { ScadaComponentMeta, AcModeComponentConfig } from '../../../../types'
import ScadaAcMode from './index.vue'
import AcModeConfigPanel from './ConfigPanel.vue'

const defaultConfig: AcModeComponentConfig = {
  width: 260,
  height: 80,
  backgroundColor: 'rgba(255, 255, 255, 0)',
  iconSize: 20,
  fontSize: 11,
  iconColor: 'rgb(0, 0, 0, 1)',
  activeIconColor: 'rgba(102, 102, 255, 1)',
  fontColor: 'rgb(0, 0, 0, 1)',
  activeFontColor: 'rgb(0, 0, 0, 1)',
  currentValue: 0,
  coolValue: 1,
  heatValue: 2,
  autoValue: 0,
  fanValue: 3
}

export const acModeMeta: ScadaComponentMeta = {
  type: 'acMode',
  component: ScadaAcMode,
  configPanel: AcModeConfigPanel,
  template: {
    name: 'scadaComponentNames.acMode',
    icon: '❄️',
    category: 'scadaComponentCategories.basic',
    defaultConfig
  },
  configTypes: {
    AcModeComponentConfig: null as unknown as AcModeComponentConfig
  }
}
