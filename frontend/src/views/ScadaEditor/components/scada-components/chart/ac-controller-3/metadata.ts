import type { ScadaComponentMeta, AcController3ComponentConfig } from '../../../../types'
import AcController3 from './index.vue'
import AcController3ConfigPanel from './ConfigPanel.vue'

/**
 * 空调面板3（按钮触发弹框版）
 * 画布上为按钮，预览时点击弹出控制面板弹框
 */
const defaultConfig: AcController3ComponentConfig = {
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
  dialogTitle: 'componentConfig.acCardTitle',
  dialogSubtitle: 'componentConfig.acDialogSubtitle',
  dialogWidth: 420,
  dialogBackgroundColor: '#1a1a2e',
  dialogBorderRadius: 16,
  // 弹框标题栏字体
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
  modeAutoVisible: true,
  modeAutoLabel: 'scadaComponents.acModeAuto',
  modeAutoValue: 0,
  modeCoolVisible: true,
  modeCoolLabel: 'scadaComponents.acModeCool',
  modeCoolValue: 1,
  modeHeatVisible: true,
  modeHeatLabel: 'scadaComponents.acModeHeat',
  modeHeatValue: 2,
  modeFanVisible: true,
  modeFanLabel: 'scadaComponents.acModeFan',
  modeFanValue: 3,

  // 风速
  fanSectionTitle: 'componentConfig.acFanSectionTitle',
  fanIconSize: 22,
  fanFontSize: 12,
  fanBackgroundColor: 'rgba(255,255,255,0.08)',
  fanActiveBackgroundColor: '#667eea',
  fanIconColor: 'rgba(255,255,255,0.6)',
  fanActiveIconColor: '#ffffff',
  fanFontColor: 'rgba(255,255,255,0.8)',
  fanActiveFontColor: '#ffffff',
  fanAutoVisible: true,
  fanAutoLabel: 'componentConfig.acFanSpeedAuto',
  fanAutoValue: 0,
  fanLowVisible: true,
  fanLowLabel: 'componentConfig.acFanSpeedLow',
  fanLowValue: 1,
  fanMediumVisible: true,
  fanMediumLabel: 'componentConfig.acFanSpeedMedium',
  fanMediumValue: 2,
  fanHighVisible: true,
  fanHighLabel: 'componentConfig.acFanSpeedHigh',
  fanHighValue: 3,
}

export const acController3Meta: ScadaComponentMeta = {
  type: 'ac-controller-3',
  component: AcController3,
  configPanel: AcController3ConfigPanel,
  template: {
    name: 'scadaComponentNames.acController3',
    icon: '❄️',
    category: 'scadaComponentCategories.chart',
    defaultConfig,
  },
}
