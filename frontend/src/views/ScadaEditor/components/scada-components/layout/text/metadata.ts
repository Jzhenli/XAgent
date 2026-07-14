import type { ScadaComponentMeta, TextComponentConfig } from '../../../../types'
import ScadaText from './index.vue'
import TextConfigPanel from './ConfigPanel.vue'

const defaultConfig: TextComponentConfig = {
  width: 150,
  height: 40,
  backgroundColor: undefined,
  borderRadius: 4,
  fontSize: 14,
  fontColor: 'rgb(44, 62, 80)',
  content: 'Text',
  fontWeight: 'normal',
  textAlign: 'center'
}

export const textMeta: ScadaComponentMeta = {
  type: 'text',
  component: ScadaText,
  configPanel: TextConfigPanel,
  template: {
    name: 'scadaComponentNames.text',
    icon: '📝',
    category: 'scadaComponentCategories.layout',
    defaultConfig
  },
  configTypes: {
    TextComponentConfig: null as unknown as TextComponentConfig
  }
}
