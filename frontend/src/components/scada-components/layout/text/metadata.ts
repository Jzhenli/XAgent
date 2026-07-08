import type { ScadaComponentMeta, TextConfig } from '../../types'
import ScadaText from './index.vue'

export const textMeta: ScadaComponentMeta = {
  type: 'text',
  component: ScadaText,
  template: {
    name: 'scadaComponentNames.text',
    icon: '📝',
    category: 'scadaComponentCategories.layout',
    defaultStyle: { width: 150, height: 40, fontSize: 14, fontColor: '#2c3e50' },
    defaultConfig: {
      textConfig: {
        content: '文本标签',
        fontSize: 14,
        fontColor: '#2c3e50',
        fontWeight: 'normal',
        textAlign: 'center'
      }
    }
  },
  configTypes: {
    TextConfig: null as unknown as TextConfig
  }
}
