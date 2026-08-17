import type { ScadaComponentMeta, ImageComponentConfig } from '../../../../types'
import ScadaImage from './index.vue'
import ImageConfigPanel from './ConfigPanel.vue'

const defaultConfig: ImageComponentConfig = {
  width: 200,
  height: 150,
  backgroundColor: '#f5f7fa',
  borderRadius: 4,
  opacity: 1,
  fit: 'contain'
}

export const imageMeta: ScadaComponentMeta = {
  type: 'image',
  component: ScadaImage,
  configPanel: ImageConfigPanel,
  template: {
    name: 'scadaComponentNames.image',
    icon: '🖼️',
    category: 'scadaComponentCategories.layout',
    defaultConfig
  },
  configTypes: {
    ImageComponentConfig: null as unknown as ImageComponentConfig
  }
}
