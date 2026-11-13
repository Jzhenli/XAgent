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
  cardTitle: 'componentConfig.acCardTitle',
  cardTitleFontSize: 12,
  cardBackgroundColor: 'rgba(0, 0, 0, 0.53)',
  cardTitleColor: 'rgba(255,255,255,0.6)',
  activeAccentColor: 'rgba(255,255,255,1)',
  cardIconSize: 22,
  cardBorderRadius: 12,

  // 卡片数值区
  cardValueFontSize: 28,
  cardUnitFontSize: 11,
  cardValueDecimalPlaces: 0,

  // 弹框外观
  dialogTitle: 'componentConfig.acCardTitle',
  dialogSubtitle: 'componentConfig.acDialogSubtitle',
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
  currentValueLabel: 'componentConfig.acCurrentValueLabel',
  currentValueFontSize: 14,
  currentValueColor: 'rgba(255, 255, 255, 0.85)',
  gaugeUnit: '°C',
  gaugeUnitFontSize: 20,
  gaugeUnitColor: 'rgba(255, 255, 255, 0.85)',
  showMainAreaStatusText: true,
  mainAreaStatusTextColor: 'rgba(255,255,255,0.75)',
  mainAreaStatusTextFontSize: 13,

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
  modeSectionTitle: 'componentConfig.mode',
  modeIconSize: 22,
  modeFontSize: 12,
  modeBackgroundColor: 'rgba(255, 255, 255, 0.08)',
  modeActiveBackgroundColor: '#667eea',
  modeIconColor: 'rgba(255,255,255,0.6)',
  modeActiveIconColor: '#ffffff',
  modeFontColor: 'rgba(255,255,255,0.6)',
  modeActiveFontColor: '#ffffff',
  // 自动（4 个组合值）
  modeAutoVisible: true,
  modeAutoLabel: 'scadaComponents.acModeAuto',
  modeAutoCoolValue: 10,
  modeAutoHeatValue: 11,
  modeAutoDehumidifyValue: 12,
  modeAutoFanValue: 13,
  // 制冷
  modeCoolVisible: true,
  modeCoolLabel: 'scadaComponents.acModeCool',
  modeCoolValue: 1,
  // 制热
  modeHeatVisible: true,
  modeHeatLabel: 'scadaComponents.acModeHeat',
  modeHeatValue: 2,
  // 除湿
  modeDehumidifyVisible: true,
  modeDehumidifyLabel: 'componentConfig.acModeDehumidifyLabel',
  modeDehumidifyValue: 3,
  // 通风
  modeFanVisible: true,
  modeFanLabel: 'scadaComponents.acModeFan',
  modeFanValue: 4,

  // 风速（自动 + 7 档独立 value）
  fanSectionTitle: 'componentConfig.acFanSectionTitle',
  fanIconSize: 22,
  fanFontSize: 12,
  fanAutoVisible: true,
  fanAutoLabel: 'componentConfig.acFanSpeedAuto',
  fanAutoValue: 0,
  fanLevelsTrackBackgroundColor: 'rgba(255,255,255,0.12)',
  fanLevelsActiveBackgroundColor: '#667eea',
  fanLevelsTextColor: 'rgba(255,255,255,0.85)',
  // 7 档
  fanLevel1Visible: true,
  fanLevel1Label: '1',
  fanLevel1Value: 1,
  fanLevel2Visible: true,
  fanLevel2Label: '2',
  fanLevel2Value: 2,
  fanLevel3Visible: true,
  fanLevel3Label: '3',
  fanLevel3Value: 3,
  fanLevel4Visible: true,
  fanLevel4Label: '4',
  fanLevel4Value: 4,
  fanLevel5Visible: true,
  fanLevel5Label: '5',
  fanLevel5Value: 5,
  fanLevel6Visible: true,
  fanLevel6Label: '6',
  fanLevel6Value: 6,
  fanLevel7Visible: true,
  fanLevel7Label: '7',
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
