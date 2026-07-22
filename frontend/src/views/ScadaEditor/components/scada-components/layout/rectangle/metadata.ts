import type { ScadaComponentMeta, RectangleComponentConfig } from '../../../../types'
import ScadaRectangle from './index.vue'
import RectangleConfigPanel from './ConfigPanel.vue'

const defaultConfig: RectangleComponentConfig = {
  width: 200,
  height: 120,
  backgroundColor: 'rgba(200, 200, 200, 1)',
  borderRadius: 4,
  borderWidth: 1,
  borderColor: 'rgba(150, 150, 150, 0.5)',
  blur: 0
}

export const rectangleMeta: ScadaComponentMeta = {
  type: 'rectangle',
  component: ScadaRectangle,
  configPanel: RectangleConfigPanel,
  template: {
    name: 'scadaComponentNames.rectangle',
    icon: '▭',
    category: 'scadaComponentCategories.layout',
    defaultConfig
  },
  configTypes: {
    RectangleComponentConfig: null as unknown as RectangleComponentConfig
  }
}
