import type { ScadaComponentMeta, AcControllerMideaComponentConfig } from '../../../../types'
import AcControllerMidea from './index.vue'
import AcControllerMideaConfigPanel from './ConfigPanel.vue'

/**
 * 美的空调面板（弹框版）
 * 画布上为 info-card 风格卡片，点击弹出控制面板弹框
 * 支持自动模式与制冷/制热/除湿/通风组合双按钮同时高亮
 * 风速为 7 档滑块条
 */
const defaultConfig: AcControllerMideaComponentConfig = {
  width: 100,
  height: 100,

  // 点位绑定
  bindings: {
    power: null,
    mode: null,
    fanSpeed: null,
    setpoint: null,
    currentValue: null,
  },

  // 行为控制
  editModeOpenDialog: false,

  // 画布卡片外观
  cardTitle: '空调',
  cardTitleFontSize: 12,
  cardBackgroundColor: 'rgba(245, 247, 250, 0.9)',
  cardTitleColor: 'rgba(0,0,0,0.6)',
  activeAccentColor: '#667eea',
  cardIconSize: 22,
  cardBorderRadius: 12,

  // 卡片数值区
  cardValueFontSize: 28,
  cardUnitFontSize: 11,
  cardValueDecimalPlaces: 0,

  // 弹框外观
  dialogTitle: '空调',
  dialogSubtitle: '办公区',
  dialogWidth: 420,
  dialogBackgroundColor: '#1a1a2e',
  dialogBorderRadius: 16,
  // 弹框标题栏字体（默认值与现有静态 CSS 一致）
  dialogTitleFontSize: 18,
  dialogTitleColor: '#ffffff',
  dialogSubtitleFontSize: 14,
  dialogSubtitleColor: 'rgba(255, 255, 255, 0.6)',

  // 主区域
  mainAreaGradient: ['#667eea', '#764ba2'],
  mainAreaGradientAngle: 135,
  mainAreaBorderRadius: 12,
  mainAreaFontSize: 48,
  mainAreaTextColor: '#ffffff',
  currentValueLabel: '当前温度: ',
  currentValueFontSize: 14,
  currentValueColor: 'rgba(255, 255, 255, 0.85)',
  gaugeUnit: '°C',
  gaugeUnitFontSize: 20,
  gaugeUnitColor: 'rgba(255, 255, 255, 0.85)',
  showMainAreaStatusText: true,
  mainAreaStatusTextColor: 'rgba(255,255,255,0.75)',

  // 温度调节
  gaugeMin: 16,
  gaugeMax: 30,
  gaugeStep: 1,
  stepButtonBackgroundColor: 'rgba(255, 255, 255, 0.15)',
  stepButtonIconSize: 24,
  stepButtonColor: '#ffffff',

  // 电源按钮
  powerButtonSize: 40,
  powerButtonOnColor: 'rgba(255, 255, 255, 0.3)',
  powerButtonOffColor: 'rgba(255, 255, 255, 0.2)',
  powerButtonIconColor: '#ffffff',

  // 模式
  modeSectionTitle: '模式',
  modeBackgroundColor: 'rgba(255, 255, 255, 0.08)',
  modeActiveBackgroundColor: '#667eea',
  modeIconColor: 'rgba(255,255,255,0.6)',
  modeActiveIconColor: '#ffffff',
  modeFontColor: 'rgba(255,255,255,0.6)',
  modeActiveFontColor: '#ffffff',
  // 自动（4 个组合值）
  modeAutoVisible: true,
  modeAutoLabel: '自动',
  modeAutoCoolValue: 10,
  modeAutoHeatValue: 11,
  modeAutoDehumidifyValue: 12,
  modeAutoFanValue: 13,
  // 制冷
  modeCoolVisible: true,
  modeCoolLabel: '制冷',
  modeCoolValue: 1,
  // 制热
  modeHeatVisible: true,
  modeHeatLabel: '制热',
  modeHeatValue: 2,
  // 除湿
  modeDehumidifyVisible: true,
  modeDehumidifyLabel: '除湿',
  modeDehumidifyValue: 3,
  // 通风
  modeFanVisible: true,
  modeFanLabel: '通风',
  modeFanValue: 4,

  // 风速（自动 + 7 档独立 value）
  fanSectionTitle: '风速',
  fanAutoVisible: true,
  fanAutoLabel: '自动',
  fanAutoValue: 0,
  fanLevelsTrackBackgroundColor: 'rgba(255,255,255,0.12)',
  fanLevelsActiveBackgroundColor: '#667eea',
  fanLevelsTextColor: 'rgba(255,255,255,0.85)',
  // 7 档
  fanLevel1Visible: true,
  fanLevel1Label: '1档',
  fanLevel1Value: 1,
  fanLevel2Visible: true,
  fanLevel2Label: '2档',
  fanLevel2Value: 2,
  fanLevel3Visible: true,
  fanLevel3Label: '3档',
  fanLevel3Value: 3,
  fanLevel4Visible: true,
  fanLevel4Label: '4档',
  fanLevel4Value: 4,
  fanLevel5Visible: true,
  fanLevel5Label: '5档',
  fanLevel5Value: 5,
  fanLevel6Visible: true,
  fanLevel6Label: '6档',
  fanLevel6Value: 6,
  fanLevel7Visible: true,
  fanLevel7Label: '7档',
  fanLevel7Value: 7,
}

export const acControllerMideaMeta: ScadaComponentMeta = {
  type: 'ac-controller-midea',
  component: AcControllerMidea,
  configPanel: AcControllerMideaConfigPanel,
  template: {
    name: 'scadaComponentNames.acControllerMidea',
    icon: '❄️',
    category: 'scadaComponentCategories.chart',
    defaultConfig,
  },
}
