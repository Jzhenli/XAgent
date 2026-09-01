import type { ScadaComponentMeta, PopupComponentConfig } from '../../../../types'
import ScadaPopup from './index.vue'
import PopupConfigPanel from './ConfigPanel.vue'

const defaultConfig: PopupComponentConfig = {
  width: 120,
  height: 40,
  fontSize: 14,
  borderWidth: 1,
  triggerText: 'Open',
  triggerIcon: '',
  popupTitle: 'Title',
  popupContent: '<p> HTML </p>',
  useHtml: true,
  popupWidth: 400,
  maskColor: 'rgba(0, 0, 0, 0.5)',
  triggerFontColor: '#ffffff',
  triggerBackgroundColor: '#409eff',
  triggerBorderColor: '#409eff',
  triggerBorderRadius: 4
}

export const popupMeta: ScadaComponentMeta = {
  type: 'popup',
  component: ScadaPopup,
  configPanel: PopupConfigPanel,
  template: {
    name: 'scadaComponentNames.popup',
    icon: '🗨️',
    category: 'scadaComponentCategories.layout',
    defaultConfig
  },
  configTypes: {
    PopupComponentConfig: null as unknown as PopupComponentConfig
  }
}