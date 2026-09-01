import type { ScadaComponentMeta, EnumValueComponentConfig } from '../../../../types'
import ScadaEnumValue from './index.vue'
import EnumValueConfigPanel from './ConfigPanel.vue'

const defaultConfig: EnumValueComponentConfig = {
  width: 120,
  height: 40,
  value: 1,
  enumItems: [
    { text: '1', value: 1 },
    { text: '2', value: 2 },
  ],
  fontSize: 24,
  fontColor: '#000000',
}

export const enumValueMeta: ScadaComponentMeta = {
  type: 'enum-value',
  component: ScadaEnumValue,
  configPanel: EnumValueConfigPanel,
  template: {
    name: 'scadaComponentNames.enumValue',
    icon: '≡',
    category: 'scadaComponentCategories.basic',
    defaultConfig,
  },
  configTypes: {
    EnumValueComponentConfig: null as unknown as EnumValueComponentConfig,
  },
}
