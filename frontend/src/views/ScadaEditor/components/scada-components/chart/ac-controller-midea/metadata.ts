import type { ScadaComponentMeta, AcControllerMideaComponentConfig } from '../../../../types'
import AcControllerMidea from './index.vue'
import AcControllerMideaConfigPanel from './ConfigPanel.vue'

/**
 * 美的空调面板（弹框版）
 * 画布上为 info-card 风格卡片，点击弹出控制面板弹框
 * 5 按钮单按单选模式 + 7档滑块风速 + 设定/显示点位分离
 */
const defaultConfig: AcControllerMideaComponentConfig = {
  width: 100,
  height: 100,

  // 点位绑定（美的专用：设定/显示分离，7 个点位）
  bindings: {
    power: null,
    modeSetpoint: null,
    modeDisplay: null,
    fanSpeedSetpoint: null,
    fanSpeedDisplay: null,
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

  // 开/关机值配置
  powerOnValue: 1,
  powerOffValue: 0,

  // 模式设定值（5 个按钮，单按单选）
  modeSectionTitle: 'componentConfig.mode',
  modeIconSize: 22,
  modeFontSize: 12,
  modeBackgroundColor: 'rgba(255, 255, 255, 0.08)',
  modeActiveBackgroundColor: '#667eea',
  modeIconColor: 'rgba(255,255,255,0.6)',
  modeActiveIconColor: '#ffffff',
  modeFontColor: 'rgba(255,255,255,0.6)',
  modeActiveFontColor: '#ffffff',
  modeAutoValue: 6,
  modeCoolValue: 2,
  modeHeatValue: 3,
  modeDehumidifyValue: 4,
  modeFanValue: 5,

  // 模式显示映射（9 个值，主区域状态文字匹配）
  modeDisplayAutoCoolValue: 10,
  modeDisplayAutoHeatValue: 11,
  modeDisplayAutoDehumidifyValue: 12,
  modeDisplayAutoFanValue: 13,
  modeDisplayCoolValue: 2,
  modeDisplayHeatValue: 3,
  modeDisplayDehumidifyValue: 4,
  modeDisplayFanValue: 5,
  modeDisplayOffValue: 0,

  // 风速（自动 + 7 档独立 value）
  fanSectionTitle: 'componentConfig.acFanSectionTitle',
  fanIconSize: 22,
  fanFontSize: 12,
  fanAutoValue: 0,
  fanLevelsTrackBackgroundColor: 'rgba(255,255,255,0.13)',
  fanLevelsActiveBackgroundColor: '#667eea',
  fanLevelsTextColor: 'rgba(255,255,255,0.85)',
  // 风速自动按钮独立颜色
  fanBackgroundColor: 'rgba(255, 255, 255, 0.08)',
  fanActiveBackgroundColor: '#667eea',
  fanTextColor: 'rgba(255,255,255,0.6)',
  fanActiveTextColor: '#ffffff',
  // 7 档
  fanLevel1Value: 1,
  fanLevel2Value: 2,
  fanLevel3Value: 3,
  fanLevel4Value: 4,
  fanLevel5Value: 5,
  fanLevel6Value: 6,
  fanLevel7Value: 7,

  // 风速显示映射（16 个值，主区域状态文字匹配）
  fanDisplayAutoValue: 0,
  fanDisplayStopValue: 0,
  fanDisplayLevel1Value: 1,
  fanDisplayLevel2Value: 2,
  fanDisplayLevel3Value: 3,
  fanDisplayLevel4Value: 4,
  fanDisplayLevel5Value: 5,
  fanDisplayLevel6Value: 6,
  fanDisplayLevel7Value: 7,
  fanDisplayAutoLevel1Value: 11,
  fanDisplayAutoLevel2Value: 12,
  fanDisplayAutoLevel3Value: 13,
  fanDisplayAutoLevel4Value: 14,
  fanDisplayAutoLevel5Value: 15,
  fanDisplayAutoLevel6Value: 16,
  fanDisplayAutoLevel7Value: 17,
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
