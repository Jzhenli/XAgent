import type { ScadaComponentMeta, AcControllerComponentConfig } from '../../../../types'
import AcController from './index.vue'
import AcControllerConfigPanel from './ConfigPanel.vue'

/**
 * 空调控制器组件默认配置
 * 参考截图深色主题布局
 */
const defaultConfig: AcControllerComponentConfig = {
  // 尺寸
  width: 260,
  height: 300,

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
  borderRadius: 16,

  // 标题
  title: '空调',
  titleFontSize: 16,
  titleFontColor: '#ffffff',

  // 电源开关
  powerIconColor: 'rgba(255, 255, 255, 0.5)',
  powerActiveColor: '#00d4ff',

  // 仪表盘（el-progress dashboard）
  gaugeSize: 130,
  gaugeMin: 16,
  gaugeMax: 30,
  gaugeUnit: '°C',
  gaugeTrackWidth: 12,
  gaugeTrackColor: '#4a4a6a',
  gaugeFillColor: '#00d4ff',
  gaugeFillGradient: ['#00d4ff', '#00ff88', '#f5a623'],
  gaugeFontSize: 22,
  gaugeFontColor: '#ffffff',
  gaugeStep: 1,

  // 当前值显示
  currentValueLabel: '当前温度:',
  currentValueFontSize: 12,
  currentValueFontColor: 'rgba(255, 255, 255, 0.8)',
  currentValueUnit: '°C',

  // 模式按钮
  modeIconSize: 16,
  modeIconColor: 'rgba(255, 255, 255, 0.5)',
  modeActiveIconColor: '#00d4ff',
  modeFontColor: 'rgba(255, 255, 255, 0.7)',
  modeActiveFontColor: '#ffffff',
  modeAutoValue: 0,
  modeCoolValue: 1,
  modeHeatValue: 2,
  modeFanValue: 3,

  // 风速按钮
  fanFontSize: 12,
  fanBackgroundColor: 'rgba(255, 255, 255, 0.1)',
  fanActiveBackgroundColor: '#00d4ff',
  fanFontColor: 'rgba(255, 255, 255, 0.7)',
  fanActiveFontColor: '#ffffff',
  fanAutoValue: 0,
  fanLowValue: 1,
  fanMediumValue: 2,
  fanHighValue: 3,

  // 分区默认位置（适配 260×320 紧凑布局）
  titlePosition: { x: 14, y: 12 },
  powerPosition: { x: 228, y: 10 },
  gaugePosition: { x: 65, y: 34 },
  currentValuePosition: { x: 0, y: 172 },
  modePosition: { x: 14, y: 200 },
  fanSpeedPosition: { x: 14, y: 264 },
}

export const acControllerMeta: ScadaComponentMeta = {
  type: 'ac-controller',
  component: AcController,
  configPanel: AcControllerConfigPanel,
  template: {
    name: 'scadaComponentNames.acController',
    icon: '❄️',
    category: 'scadaComponentCategories.chart',
    defaultConfig,
  },
}
