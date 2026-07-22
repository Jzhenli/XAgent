import type { ScadaComponentMeta, WriteValueComponentConfig } from '../../../../types'
import ScadaWriteValue from './index.vue'
import WriteValueConfigPanel from './ConfigPanel.vue'

const defaultConfig: WriteValueComponentConfig = {
  width: 120,
  height: 40,
  value: '28',
  fontSize: 24,
  fontColor: '#000000',
  confirmColor: '#67c23a',
  cancelColor: '#f56c6c',
}

export const writeValueMeta: ScadaComponentMeta = {
  type: 'write-value',
  component: ScadaWriteValue,
  configPanel: WriteValueConfigPanel,
  template: {
    name: 'scadaComponentNames.writeValue',
    icon: '✏️',
    category: 'scadaComponentCategories.basic',
    defaultConfig,
  },
  configTypes: {
    WriteValueComponentConfig: null as unknown as WriteValueComponentConfig,
  },
}
