import type { ScadaComponentMeta, NumberComponentConfig } from '../../../../types'
import ScadaNumber from './index.vue'
import NumberConfigPanel from './ConfigPanel.vue'

const defaultConfig: NumberComponentConfig = {
  width: 120,
  height: 40,
  value: 0,
  showTitle: false,
  title: '',
  titleFontSize: 24,
  titleFontColor: '#000000',
  decimalPlaces: 0,
  unit: '',
  unitFontSize: 12,
  unitFontColor: '#000000',
  fontSize: 24,
  fontColor: '#000000',
  textAlign: 'center',
}

export const numberMeta: ScadaComponentMeta = {
  type: 'number',
  component: ScadaNumber,
  configPanel: NumberConfigPanel,
  template: {
    name: 'scadaComponentNames.number',
    icon: '123',
    category: 'scadaComponentCategories.basic',
    defaultConfig,
  },
  configTypes: {
    NumberComponentConfig: null as unknown as NumberComponentConfig,
  },
}
