import type { ScadaComponentMeta, NavButtonComponentConfig } from '../../../../types'
import ScadaNavButton from './index.vue'
import NavButtonConfigPanel from './ConfigPanel.vue'

const defaultConfig: NavButtonComponentConfig = {
  width: 120,
  height: 40,
  text: '按钮',
  fontSize: 14,
  fontColor: '#ffffff',
  backgroundColor: '#409eff',
  borderWidth: 0,
  borderColor: '#409eff',
  borderRadius: 4,
  jumpMode: 'url',
  targetUrl: ''
}

export const navButtonMeta: ScadaComponentMeta = {
  type: 'nav-button',
  component: ScadaNavButton,
  configPanel: NavButtonConfigPanel,
  template: {
    name: 'scadaComponentNames.navButton',
    icon: '🔗',
    category: 'scadaComponentCategories.layout',
    defaultConfig
  },
  configTypes: {
    NavButtonComponentConfig: null as unknown as NavButtonComponentConfig
  }
}
