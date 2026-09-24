import type { ScadaComponentMeta, AcController2ComponentConfig } from '../../../../types'
import AcController2 from './index.vue'
import AcController2ConfigPanel from './ConfigPanel.vue'

/**
 * 空调面板2（紧凑型单图标版）
 * 相比 ac-controller：模式和风速改为单图标循环切换，面板更小
 */
const defaultConfig: AcController2ComponentConfig = {
  // 尺寸
  width: 160,
  height: 180,

  // 点位绑定（5 个专用点位，默认空绑定）
  bindings: {
    power: null,
    mode: null,
    fanSpeed: null,
    setpoint: null,
    currentValue: null,
  },

  // 面板
  backgroundColor: 'rgba(10, 15, 30, 0.85)',
  borderRadius: 12,

  // 标题
  title: '空调',
  titleFontSize: 14,
  titleFontColor: '#ffffff',

  // 电源开关
  powerIconSize: 18,
  powerIconColor: 'rgba(255, 255, 255, 0.5)',
  powerActiveColor: '#00d4ff',

  // 仪表盘（el-progress dashboard，更紧凑）
  gaugeSize: 110,
  gaugeMin: 16,
  gaugeMax: 30,
  gaugeUnit: '',
  gaugeTrackWidth: 12,
  gaugeTrackColor: '#4a4a6a',
  gaugeFillColor: '#00d4ff',
  gaugeFillGradient: ['#00d4ff', '#00ff88', '#f5a623'],
  gaugeFontSize: 20,
  gaugeFontColor: '#ffffff',
  gaugeStep: 1,

  // 当前值显示
  currentValueLabel: '当前:',
  currentValueFontSize: 11,
  currentValueFontColor: 'rgba(255, 255, 255, 0.8)',
  currentValueUnit: '',

  // 模式（单图标循环切换）
  modeIconSize: 22,
  modeIconColor: 'rgba(255, 255, 255, 1)',
  modeActiveIconColor: '#00d4ff',
  modeAutoValue: 0,
  modeCoolValue: 1,
  modeHeatValue: 2,
  modeFanValue: 3,
  modeCycleModes: ['auto', 'cool', 'heat', 'fan'],

  // 风速（单图标循环切换）
  fanIconSize: 22,
  fanIconColor: 'rgba(255, 255, 255, 1)',
  fanActiveIconColor: '#00d4ff',
  fanAutoValue: 0,
  fanLowValue: 1,
  fanMediumValue: 2,
  fanHighValue: 3,
  fanCycleModes: ['auto', 'low', 'medium', 'high'],

  // 分区默认位置（适配 160×180 紧凑布局）
  titlePosition: { x: 10, y: 8 },
  powerPosition: { x: 138, y: 6 },
  modePosition: { x: 14, y: 34 },
  fanSpeedPosition: { x: 128, y: 34 },
  gaugePosition: { x: 25, y: 52 },
  currentValuePosition: { x: 0, y: 155 },
}

export const acController2Meta: ScadaComponentMeta = {
  type: 'ac-controller-2',
  component: AcController2,
  configPanel: AcController2ConfigPanel,
  template: {
    name: 'scadaComponentNames.acController2',
    icon: '❄️',
    category: 'scadaComponentCategories.chart',
    defaultConfig,
  },
}
