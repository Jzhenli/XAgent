import type { Component } from 'vue'

export type PanelType = 'Dashboard' | 'Graphic'

/**
 * 面板预览适配模式
 * - fit: 等比缩放完整展示，保留留白
 * - fitWidth: X 轴铺满，Y 轴等比缩放并滚动
 * - fitHeight: Y 轴铺满，X 轴等比缩放并滚动
 * - stretch: 非等比拉伸铺满整个屏幕
 */
export type PanelAdaptMode = 'fit' | 'fitWidth' | 'fitHeight' | 'stretch'

export interface PointBinding {
  deviceId: string
  pointName: string
  pointDescription?: string
  unit?: string
}

/** @deprecated 样式已合并到 ComponentConfig，保留用于旧数据迁移 */
export interface StyleConfig {
  width: number
  height: number
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  fontSize?: number
  fontColor?: string
  opacity?: number
}

/** 组件统一配置基类：包含样式、当前值等通用字段 */
export interface BaseComponentConfig {
  width: number
  height: number
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  fontSize?: number
  fontColor?: string
  opacity?: number
  /** 编辑模式/未绑定点位时的当前值（模拟值） */
  value?: number | boolean | string | null
}

/** 文本组件配置 */
export interface TextComponentConfig extends BaseComponentConfig {
  content: string
  fontWeight: 'normal' | 'bold'
  /** 文字旋转角度（度），0 为默认，正数顺时针 */
  rotation?: number
  /** 水平倾斜角度（度）：0 正常，负值向左歪，正值向右歪 */
  skewX?: number
  textAlign: 'left' | 'center' | 'right'
}

/** 数值组件配置 */
export interface NumberComponentConfig extends BaseComponentConfig {
  showTitle: boolean
  title: string
  titleFontSize: number
  titleFontColor: string
  decimalPlaces: number
  unit: string
  unitFontSize: number
  unitFontColor: string
  fontSize: number
  fontColor: string
  textAlign: 'left' | 'center' | 'right'
}

/** 枚举项 */
export interface EnumValueItem {
  text: string
  value: number | string
}

/** 枚举值组件配置 */
export interface EnumValueComponentConfig extends BaseComponentConfig {
  value: number | string
  enumItems: EnumValueItem[]
  fontSize: number
  fontColor: string
}

/** 写值输入框组件配置 */
export interface WriteValueComponentConfig extends BaseComponentConfig {
  value: number | string
  confirmColor?: string
  cancelColor?: string
  /** 是否显示输入框模式 */
  showInput?: boolean
  /** 输入框边框颜色 */
  inputBorderColor?: string
}

/** 矩形组件配置 */
export interface RectangleComponentConfig extends BaseComponentConfig {
  /** 背景模糊半径（px） */
  blur?: number
}

/** 圆形组件配置 */
export interface CircleComponentConfig extends Omit<BaseComponentConfig, 'borderRadius'> {
  /** 背景模糊半径（px） */
  blur?: number
}

/** 直线组件配置 */
export interface LineComponentConfig extends Omit<BaseComponentConfig, 'backgroundColor' | 'borderColor' | 'borderWidth' | 'borderRadius' | 'fontSize' | 'fontColor' | 'opacity'> {
  /** 线条颜色 */
  strokeColor: string
  /** 线条宽度（px） */
  strokeWidth: number
  /** 线条角度（度），0=水平向右，90=垂直向下 */
  angle: number
  /** 箭头样式 */
  arrow?: 'none' | 'start' | 'end' | 'both'
}

/** 弧线组件配置 */
export interface ArcComponentConfig extends Omit<BaseComponentConfig, 'backgroundColor' | 'borderColor' | 'borderWidth' | 'borderRadius' | 'fontSize' | 'fontColor' | 'opacity'> {
  /** 线条颜色 */
  strokeColor: string
  /** 线条宽度（px） */
  strokeWidth: number
  /** 起始角度（度） */
  startAngle: number
  /** 结束角度（度） */
  endAngle: number
  /** 箭头样式 */
  arrow?: 'none' | 'start' | 'end' | 'both'
}

/** 图标组件配置 */
export interface IconComponentConfig extends Omit<BaseComponentConfig, 'borderRadius' | 'backgroundColor' | 'borderColor' | 'borderWidth' | 'fontSize' | 'fontColor' | 'opacity'> {
  /** 图标名称（对应 xicon_<name> 的基名） */
  iconName: string
  /** 图标颜色 */
  iconColor: string
}

/** 仪表盘组件配置 */
export interface GaugeComponentConfig extends BaseComponentConfig {
  min: number
  max: number
  unit: string
  thresholds: { value: number; color: string }[]
  showValue: boolean
  /** 中心显示的目标/设定值 */
  targetValue?: number
  /** 轨道基础色 */
  trackColor?: string
  /** 数据填充轨道色 */
  fillColor?: string
  /** 数据填充轨道渐变色（3 色），配置后优先于 fillColor */
  fillGradient?: string[]
  /** 轨道宽度 */
  trackWidth?: number
  /** 进度条端点形状 */
  strokeLinecap?: 'butt' | 'round' | 'square'
  /** 中心文本字体粗细 */
  fontWeight?: 'normal' | 'bold'
  /** 按钮调节步进值 */
  step?: number
  /** 小数位数，未设置时默认 1（保持旧版行为兼容） */
  decimalPlaces?: number
  /** 是否显示加减按钮 */
  showButtons?: boolean
  /** 步进按钮字体大小 */
  stepFontSize?: number
  /** 步进按钮字体颜色 */
  stepFontColor?: string
  /** 单位字体大小 */
  unitFontSize?: number
  /** 单位字体颜色 */
  unitFontColor?: string
  /** 单位字体粗细 */
  unitFontWeight?: 'normal' | 'bold'
  /** 是否显示量程范围（最小值/最大值标签） */
  showRange?: boolean
  /** 量程范围标签字体大小 */
  rangeLabelFontSize?: number
  /** 量程范围标签字体颜色 */
  rangeLabelFontColor?: string
  /** 量程范围标签水平偏移（像素，画布缩放时等比） */
  rangeLabelOffsetX?: number
  /** 量程范围标签垂直偏移（像素，画布缩放时等比） */
  rangeLabelOffsetY?: number
}

/** 图表组件配置 */
export interface ChartComponentConfig extends BaseComponentConfig {
  timeRange: '1h' | '6h' | '24h' | '7d'
  lineColor: string
  areaFill: boolean
  showLegend: boolean
}

/** 折线图组件配置 */
export interface LineChartComponentConfig
  extends Omit<ChartComponentConfig, 'showLegend' | 'borderRadius'> {
  /** 是否显示整个 X 轴（含轴线、刻度、标签） */
  showXAxis?: boolean
  /** 是否显示 X 轴标签 */
  showXAxisLabel?: boolean
  /** 是否显示 Y 轴标签 */
  showYAxisLabel?: boolean
  /** 是否显示 Y 轴线 */
  showYAxisLine?: boolean
  /** X 轴标签颜色 */
  xAxisLabelColor?: string
  /** X 轴标签字号 */
  xAxisLabelFontSize?: number
  /** Y 轴标签颜色 */
  yAxisLabelColor?: string
  /** Y 轴标签字号 */
  yAxisLabelFontSize?: number
  /** 线条粗细 */
  lineWidth?: number
  /** 节点大小；0 或 null 表示不显示节点 */
  nodeSize?: number
  /** 节点填充色 */
  nodeFillColor?: string
  /** 是否平滑折线 */
  smooth?: boolean
  /** 是否显示图例 */
  showLegend?: boolean
  /** 多序列配置（支持多条折线） */
  seriesItems?: LineChartSeriesItem[]
}

/** 柱状图序列项（每组柱子的配置） */
export interface BarChartSeriesItem {
  /** 序列名称（显示在图例中） */
  name: string
  /** 点位绑定 */
  binding: PointBinding | null
  /** 柱体颜色 */
  barColor: string
}

/** 柱状图组件配置 */
export interface BarChartComponentConfig extends BaseComponentConfig {
  /** 时间范围 */
  timeRange: '1h' | '6h' | '24h' | '7d'
  /** 是否显示图例 */
  showLegend?: boolean
  /** 是否显示 X 轴线 */
  showXAxisLine?: boolean
  /** 是否显示 X 轴标签 */
  showXAxisLabel?: boolean
  /** 是否显示 Y 轴标签 */
  showYAxisLabel?: boolean
  /** 是否显示 Y 轴线 */
  showYAxisLine?: boolean
  /** X 轴标签颜色 */
  xAxisLabelColor?: string
  /** X 轴标签字号 */
  xAxisLabelFontSize?: number
  /** Y 轴标签颜色 */
  yAxisLabelColor?: string
  /** Y 轴标签字号 */
  yAxisLabelFontSize?: number
  /** 柱体颜色（旧版单序列兼容，有 seriesItems 时优先） */
  barColor?: string
  /** 柱体宽度（像素 或 百分比，如 '60%'） */
  barWidth?: number | string
  /** 柱体圆角 */
  barBorderRadius?: number | number[]
  /** 柱状图显示的柱子个数（默认 20） */
  barCount?: number
  /** 多序列配置（支持多组柱子） */
  seriesItems?: BarChartSeriesItem[]
}

/** 饼状图单项配置 */
export interface PieChartItemConfig {
  /** 扇区名称（显示在图例上） */
  name: string
  /** 模拟值 */
  value: number
  /** 扇区颜色 */
  color: string
}

/** 饼状图组件配置 */
export interface PieChartComponentConfig extends BaseComponentConfig {
  /** 饼图数据项 */
  items: PieChartItemConfig[]
  /** 是否显示图例 */
  showLegend?: boolean
  /** 图例字体颜色 */
  legendColor?: string
  /** 图例字体大小 */
  legendFontSize?: number
  /** 是否显示为环形饼图（Donut） */
  showDonut?: boolean
  /** 环形内半径（百分比，如 '40%'），showDonut=true 时生效 */
  innerRadius?: number | string
  /** 扇区标签是否显示 */
  showLabel?: boolean
  /** 扇区之间的角度间隙（度），通过 ECharts padAngle 实现 */
  pieGap?: number
  /** 扇区圆角（px） */
  pieBorderRadius?: number
}

/** 桑基图节点配置 */
export interface SankeyNodeConfig {
  /** 节点名称（唯一标识） */
  name: string
  /** 节点颜色（可选，不填则自动分配渐变） */
  color?: string
}

/** 桑基图连线配置 */
export interface SankeyLinkConfig {
  /** 源节点名称 */
  source: string
  /** 目标节点名称 */
  target: string
  /** 流量值 */
  value: number
}

/** 桑基图组件配置 */
export interface SankeyChartComponentConfig extends BaseComponentConfig {
  /** 节点列表 */
  nodes: SankeyNodeConfig[]
  /** 连线列表 */
  links: SankeyLinkConfig[]
  /** 节点宽度 */
  nodeWidth?: number
  /** 节点垂直间距 */
  nodeGap?: number
  /** 节点圆角 */
  nodeBorderRadius?: number
  /** 连线颜色模式：gradient(渐变) / source(跟随源节点) / target(跟随目标节点) */
  linkColorMode?: 'gradient' | 'source' | 'target'
  /** 连线透明度 */
  linkOpacity?: number
  /** 是否悬停高亮关联流 */
  hoverHighlight?: boolean
  /** 是否启用 mock 数据自动刷新 */
  autoRefresh?: boolean
  /** mock 刷新间隔（毫秒） */
  refreshInterval?: number
}

/** 折线图数据点 */
export interface LineChartDataPoint {
  time: string
  timestamp: number
  value: number
  quality: string
}

/** 折线图序列项（每条线的配置） */
export interface LineChartSeriesItem {
  /** 序列名称（显示在图例中） */
  name: string
  /** 点位绑定 */
  binding: PointBinding | null
  /** 线条颜色 */
  lineColor: string
  /** 节点填充色（可选，默认继承 lineColor） */
  nodeFillColor?: string
}

/** 指示灯组件配置 */
export interface IndicatorComponentConfig
  extends Omit<BaseComponentConfig, 'backgroundColor' | 'borderRadius'> {
  onColor: string
  offColor: string
  onValue: number
  offValue: number
  blinkOnAlarm: boolean
}

/** 开关组件配置 */
export interface SwitchComponentConfig extends BaseComponentConfig {
  thumbColor: string
  onColor: string
  offColor: string
  onValue: number
  offValue: number
  confirmRequired: boolean
  writePoint: PointBinding | null
}

/** 灯控按钮组件配置 —— 两行布局（图标 + 文字），支持开启/关闭两套配色 */
export interface LightButtonComponentConfig extends BaseComponentConfig {
  /** 按钮文字 */
  text: string
  /** 图标名称（对应 icon 组件的 iconName） */
  iconName: string
  /** 图标大小（px） */
  iconSize: number
  /** 关闭态图标颜色 */
  iconColor: string
  /** 开启态图标颜色 */
  activeIconColor: string
  /** 关闭态文字颜色 */
  fontColor: string
  /** 开启态文字颜色 */
  activeFontColor: string
  /** 开启态背景色（关闭态使用 backgroundColor） */
  activeBackgroundColor: string
  /** 开启值 */
  onValue: number
  /** 关闭值 */
  offValue: number
  /** 操作前是否需要确认 */
  confirmRequired: boolean
  /** 独立写值点位（为空则使用组件 binding） */
  writePoint: PointBinding | null
}

/** 亮度调节器组件配置 */
export interface SliderComponentConfig extends BaseComponentConfig {
  min: number
  max: number
  step: number
  /** 滑块颜色 */
  thumbColor?: string
}

/** 滑块式开关组件配置 */
export interface SliderSwitchComponentConfig extends BaseComponentConfig {
  min: number
  max: number
  /** 激活轨道颜色（滑块左侧） */
  activeTrackColor: string
  /** 未激活轨道颜色（滑块右侧） */
  inactiveTrackColor: string
  /** 轨道高度（激活/未激活） */
  trackHeight: number
  /** 滑块颜色 */
  thumbColor: string
  /** 是否显示数字轴 */
  showAxis: boolean
  /** 是否显示当前值（轨道最右侧） */
  showValue: boolean
  /** 数字轴字体大小 */
  axisFontSize: number
  /** 数字轴字体颜色 */
  axisColor: string
}

/** 滑块式柱状图单项（柱体）配置 */
export interface SliderBarItemConfig {
  /** x 轴标签 */
  label: string
  /** 当前值：编辑态/未绑定点位时的模拟值 */
  value: number
  /** 点位绑定 */
  binding: PointBinding | null
}

/** 滑块式柱状图组件配置 */
export interface SliderBarComponentConfig extends BaseComponentConfig {
  min: number
  max: number
  /** 柱体颜色（激活轨道） */
  barColor: string
  /** 柱体宽度（px） */
  barWidth: number
  /** 顶部当前值字体大小 */
  valueFontSize: number
  /** 顶部当前值颜色 */
  valueColor: string
  /** x/y 轴标签字体大小 */
  axisFontSize: number
  /** x/y 轴标签颜色 */
  axisColor: string
  /** 是否显示 Y 轴标签（刻度） */
  showYAxisLabel?: boolean
  /** 是否显示 X 轴（底部标签与基线） */
  showXAxis?: boolean
  /** 柱体顶部圆角（px） */
  barRadius?: number
  /** 是否显示当前值 */
  showCurrentValue?: boolean
  /** 柱体列表 */
  items: SliderBarItemConfig[]
}

/** 图片组件配置 */
export interface ImageComponentConfig extends BaseComponentConfig {
  url?: string
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
}

/** 按钮组件配置 */
export interface ButtonComponentConfig extends BaseComponentConfig {
  text: string
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  writeValue: number | boolean | string
  /** @deprecated 旧版写入点位，现优先使用组件 binding */
  writePoint?: PointBinding | null
  fontColor?: string
  fontSize?: number
  backgroundColor?: string
  borderWidth?: number
  borderColor?: string
  borderStyle?: string
}

/** 空调模式组件配置 */
export interface AcModeComponentConfig extends BaseComponentConfig {
  iconSize: number
  iconColor: string
  activeIconColor: string
  fontColor: string
  activeFontColor: string
  /** 当前值：编辑态/未绑定点位时的模拟值，预览时优先使用后端实际值 */
  currentValue: number | string
  coolValue: number | string
  heatValue: number | string
  autoValue: number | string
  fanValue: number | string
}

/** 空调模式图标组件 —— 仅显示当前模式图标，点击循环切换，支持自定义模式组合 */
export interface AcModeIconComponentConfig extends BaseComponentConfig {
  iconSize: number
  iconColor: string
  activeIconColor: string
  /** 当前值：编辑态/未绑定点位时的模拟值 */
  currentValue: number | string
  /** 自动模式值 */
  autoValue: number | string
  /** 制冷模式值 */
  coolValue: number | string
  /** 制暖模式值 */
  heatValue: number | string
  /** 通风模式值 */
  fanValue: number | string
  /** 参与循环切换的模式列表（按数组顺序依次切换），为空则默认全部四种模式 */
  cycleModes: AcModeKey[]
}

/** 空调模式 key */
export type AcModeKey = 'auto' | 'cool' | 'heat' | 'fan'

/** 图片切换项（值对应图片） */
export interface ValueImageItem {
  /** 绑定的数值 */
  value: number | string
  /** 对应的图片地址（base64 或 URL） */
  url: string
}

/** 导航按钮组件配置 */
export interface NavButtonComponentConfig extends BaseComponentConfig {
  text: string
  fontSize: number
  fontColor: string
  backgroundColor: string
  borderWidth: number
  borderColor: string
  borderRadius: number
  /** 是否显示图标 */
  showIcon?: boolean
  /** 图标名称 */
  iconName?: string
  /** 图标大小（px） */
  iconSize?: number
  /** 图标颜色 */
  iconColor?: string
  /** 跳转模式：url=自定义网址，project=从项目列表选择 */
  jumpMode: 'url' | 'project'
  /** 自定义跳转网址 */
  targetUrl?: string
  /** 目标项目 ID */
  targetProjectId?: string
  /** 目标项目类型（Dashboard / Graphic） */
  targetProjectType?: PanelType
}

/** 图片切换组件配置 */
export interface ValueImageSwitchComponentConfig extends BaseComponentConfig {
  /** 值对应图片列表 */
  items: ValueImageItem[]
  /** 默认图片（无匹配值时显示） */
  defaultUrl?: string
  /** 图片填充方式 */
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  /** 是否启用点击写值（预览模式下点击图片切换并下发值） */
  enableWrite?: boolean
}

/** 信息卡片组件配置（分区样式：左上标题 + 右上图标 + 左下当前值 + 左下单位） */
export interface InfoCardComponentConfig extends BaseComponentConfig {
  // ── 左上标题区 ──
  title: string
  titleFontSize: number
  titleFontColor: string

  // ── 右上图标区 ──
  iconName: string
  iconSize: number
  iconColor: string

  // ── 当前值区 ──
  valueFontSize: number
  valueFontColor: string
  decimalPlaces: number

  // ── 单位区 ──
  unit: string
  unitFontSize: number
  unitFontColor: string
}

/** 值进度卡片组件配置（左上标题 + 右上图标 + 数值+单位 + 横向进度条） */
export interface ValueProgressCardComponentConfig extends BaseComponentConfig {
  // ── 左上标题区 ──
  title: string
  titleFontSize: number
  titleFontColor: string

  // ── 右上图标区 ──
  iconName: string
  iconSize: number
  iconColor: string

  // ── 当前值区（进度条上方） ──
  valueFontSize: number
  valueFontColor: string
  decimalPlaces: number

  // ── 单位区 ──
  unit: string
  unitFontSize: number
  unitFontColor: string

  // ── 进度条区 ──
  min: number
  max: number
  /** 进度条激活颜色（填充色） */
  barColor: string
  /** 进度条轨道底色 */
  barTrackColor: string
  /** 进度条高度（px） */
  barHeight: number
  /** 进度条圆角（px） */
  barRadius: number
  /** 是否启用层层递进动画 */
  animationEnabled: boolean
  /** 动画持续时长（秒） */
  animationDuration: number

  // ── 进度条刻度标签（min/max） ──
  /** 刻度标签字体大小 */
  scaleFontSize?: number
  /** 刻度标签字体颜色 */
  scaleFontColor?: string
}

/** 弹框组件配置 */
export interface PopupComponentConfig extends BaseComponentConfig {
  /** 触发按钮文字 */
  triggerText: string
  /** 触发按钮图标 */
  triggerIcon?: string
  /** 弹框标题 */
  popupTitle: string
  /** 弹框内容（支持纯文本或 HTML） */
  popupContent: string
  /** 是否使用 HTML 渲染内容 */
  useHtml: boolean
  /** 弹框宽度 */
  popupWidth: number
  /** 遮罩层颜色 */
  maskColor?: string
  /** 触发按钮文字颜色 */
  triggerFontColor: string
  /** 触发按钮背景颜色 */
  triggerBackgroundColor: string
  /** 触发按钮边框颜色 */
  triggerBorderColor: string
  /** 触发按钮圆角 */
  triggerBorderRadius: number
}

/** 空调风速组件配置 */
export interface AcFanSpeedComponentConfig extends BaseComponentConfig {
  fontSize: number
  activeBackgroundColor: string
  fontColor: string
  activeFontColor: string
  borderRadius: number
  /** 当前值：编辑态/未绑定点位时的模拟值，预览时优先使用后端实际值 */
  currentValue: number | string
  autoValue: number | string
  highValue: number | string
  mediumValue: number | string
  lowValue: number | string
}

/** 空调风速图标 key */
export type AcFanSpeedKey = 'auto' | 'low' | 'medium' | 'high'

/** 空调风速图标组件 —— 仅显示当前风速档位图标，点击循环切换，支持自定义档位组合 */
export interface AcFanSpeedIconComponentConfig extends BaseComponentConfig {
  iconSize: number
  iconColor: string
  activeIconColor: string
  /** 当前值：编辑态/未绑定点位时的模拟值 */
  currentValue: number | string
  /** 自动档位值 */
  autoValue: number | string
  /** 低档位值 */
  lowValue: number | string
  /** 中档位值 */
  mediumValue: number | string
  /** 高档位值 */
  highValue: number | string
  /** 参与循环切换的档位列表（按数组顺序依次切换），为空则默认全部四种档位 */
  cycleModes: AcFanSpeedKey[]
}

/** 空调控制器点位绑定集合（5 个专用点位） */
export interface AcControllerBindings {
  /** 开关点位（开/关状态） */
  power: PointBinding | null
  /** 模式点位（自动/制热/制冷/风机） */
  mode: PointBinding | null
  /** 风速点位（自动/低/中/高） */
  fanSpeed: PointBinding | null
  /** 设定值点位（可读写，支持小数） */
  setpoint: PointBinding | null
  /** 当前值点位（只读） */
  currentValue: PointBinding | null
}

/** 区域位置配置（绝对定位偏移，像素） */
export interface ZonePosition {
  x: number
  y: number
}

/** 空调控制器组件配置 */
export interface AcControllerComponentConfig extends BaseComponentConfig {
  // ── 点位绑定 ──
  bindings: AcControllerBindings

  // ── 面板 ──
  backgroundColor: string
  borderRadius: number

  // ── 标题 ──
  title: string
  titleFontSize: number
  titleFontColor: string

  // ── 电源开关 ──
  powerIconSize: number
  powerIconColor: string
  powerActiveColor: string

  // ── 仪表盘（el-progress dashboard） ──
  gaugeSize: number
  gaugeMin: number
  gaugeMax: number
  gaugeUnit: string
  gaugeTrackWidth: number
  gaugeTrackColor: string
  gaugeFillColor: string
  gaugeFillGradient?: string[]
  gaugeFontSize: number
  gaugeFontColor: string
  gaugeStep: number
  /** 仪表盘数值小数位数，未设置时默认 1 */
  gaugeDecimalPlaces?: number

  // ── 当前值显示 ──
  currentValueLabel: string
  currentValueFontSize: number
  currentValueFontColor: string
  currentValueUnit: string
  /** 当前值显示小数位数，未设置时默认 1 */
  currentValueDecimalPlaces?: number

  // ── 模式按钮 ──
  modeIconSize: number
  modeIconColor: string
  modeActiveIconColor: string
  modeFontColor: string
  modeActiveFontColor: string
  modeAutoValue: number | string
  modeCoolValue: number | string
  modeHeatValue: number | string
  modeFanValue: number | string

  // ── 风速按钮 ──
  fanFontSize: number
  fanBackgroundColor: string
  fanActiveBackgroundColor: string
  fanFontColor: string
  fanActiveFontColor: string
  fanAutoValue: number | string
  fanLowValue: number | string
  fanMediumValue: number | string
  fanHighValue: number | string

  // ── 分区自由定位 ──
  titlePosition: ZonePosition
  powerPosition: ZonePosition
  gaugePosition: ZonePosition
  currentValuePosition: ZonePosition
  modePosition: ZonePosition
  fanSpeedPosition: ZonePosition
}

/** 空调面板2组件配置（紧凑型单图标版） */
export interface AcController2ComponentConfig extends BaseComponentConfig {
  // ── 点位绑定 ──
  bindings: AcControllerBindings

  // ── 面板 ──
  backgroundColor: string
  borderRadius: number

  // ── 标题 ──
  title: string
  titleFontSize: number
  titleFontColor: string

  // ── 电源开关 ──
  powerIconSize: number
  powerIconColor: string
  powerActiveColor: string

  // ── 仪表盘 ──
  gaugeSize: number
  gaugeMin: number
  gaugeMax: number
  gaugeUnit: string
  gaugeTrackWidth: number
  gaugeTrackColor: string
  gaugeFillColor: string
  gaugeFillGradient?: string[]
  gaugeFontSize: number
  gaugeFontColor: string
  gaugeStep: number
  /** 仪表盘数值小数位数，未设置时默认 1 */
  gaugeDecimalPlaces?: number

  // ── 当前值 ──
  currentValueLabel: string
  currentValueFontSize: number
  currentValueFontColor: string
  currentValueUnit: string
  /** 当前值显示小数位数，未设置时默认 1 */
  currentValueDecimalPlaces?: number

  // ── 模式（单图标循环切换） ──
  modeIconSize: number
  modeIconColor: string
  modeActiveIconColor: string
  modeAutoValue: number | string
  modeCoolValue: number | string
  modeHeatValue: number | string
  modeFanValue: number | string
  modeCycleModes: AcModeKey[]

  // ── 风速（单图标循环切换） ──
  fanIconSize: number
  fanIconColor: string
  fanActiveIconColor: string
  fanAutoValue: number | string
  fanLowValue: number | string
  fanMediumValue: number | string
  fanHighValue: number | string
  fanCycleModes: AcFanSpeedKey[]

  // ── 分区定位 ──
  titlePosition: ZonePosition
  powerPosition: ZonePosition
  modePosition: ZonePosition
  fanSpeedPosition: ZonePosition
  gaugePosition: ZonePosition
  currentValuePosition: ZonePosition
}

import type { ComponentType } from '../registry'

/** 组件类型到统一配置的映射 */
export interface ComponentConfigMap {
  text: TextComponentConfig
  number: NumberComponentConfig
  'enum-value': EnumValueComponentConfig
  'write-value': WriteValueComponentConfig
  rectangle: RectangleComponentConfig
  circle: CircleComponentConfig
  line: LineComponentConfig
  arc: ArcComponentConfig
  icon: IconComponentConfig
  gauge: GaugeComponentConfig
  'chart-line': LineChartComponentConfig
  'chart-bar': BarChartComponentConfig
  'chart-pie': PieChartComponentConfig
  indicator: IndicatorComponentConfig
  switch: SwitchComponentConfig
  'light-button': LightButtonComponentConfig
  slider: SliderComponentConfig
  'slider-switch': SliderSwitchComponentConfig
  'slider-bar': SliderBarComponentConfig
  image: ImageComponentConfig
  button: ButtonComponentConfig
  acMode: AcModeComponentConfig
  acModeIcon: AcModeIconComponentConfig
  acFanSpeed: AcFanSpeedComponentConfig
  acFanSpeedIcon: AcFanSpeedIconComponentConfig
  'value-image-switch': ValueImageSwitchComponentConfig
  'nav-button': NavButtonComponentConfig
  popup: PopupComponentConfig
  'ac-controller': AcControllerComponentConfig
  'ac-controller-2': AcController2ComponentConfig
  'info-card': InfoCardComponentConfig
  'value-progress-card': ValueProgressCardComponentConfig
  'chart-sankey': SankeyChartComponentConfig
}

/** 组件统一配置类型 */
export type ComponentConfig<T extends ComponentType = ComponentType> = ComponentConfigMap[T]

/** @deprecated 已合并到 TextComponentConfig，保留用于旧数据迁移 */
export interface TextConfig {
  content: string
  fontSize: number
  fontColor: string
  fontWeight: 'normal' | 'bold'
  textAlign: 'left' | 'center' | 'right'
}

/** @deprecated 已合并到 GaugeComponentConfig，保留用于旧数据迁移 */
export interface GaugeConfig {
  min: number
  max: number
  unit: string
  thresholds: { value: number; color: string }[]
  showValue: boolean
}

/** @deprecated 已合并到 ChartComponentConfig，保留用于旧数据迁移 */
export interface ChartConfig {
  timeRange: '1h' | '6h' | '24h' | '7d'
  lineColor: string
  areaFill: boolean
  showLegend: boolean
}

/** @deprecated 已合并到 IndicatorComponentConfig，保留用于旧数据迁移 */
export interface IndicatorConfig {
  onColor: string
  offColor: string
  blinkOnAlarm: boolean
}

/** @deprecated 已合并到 SwitchComponentConfig，保留用于旧数据迁移 */
export interface SwitchConfig {
  thumbColor?: string
  onColor?: string
  offColor?: string
  onValue?: number | boolean | string
  offValue?: number | boolean | string
  confirmRequired?: boolean
  writePoint?: PointBinding | null
}

/** @deprecated 已合并到 SliderComponentConfig，保留用于旧数据迁移 */
export interface SliderConfig {
  min: number
  max: number
  step: number
}

/** @deprecated 已合并到 ButtonComponentConfig，保留用于旧数据迁移 */
export interface ButtonConfig {
  text: string
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  writeValue: number | boolean | string
  writePoint?: PointBinding | null
}

/** @deprecated 已合并到 ImageComponentConfig，保留用于旧数据迁移 */
export interface ImageConfig {
  url?: string
  fit?: string
}

export interface ComponentTemplate {
  type: string
  name: string
  icon: string
  category: string
  defaultConfig: ComponentConfig
}

export interface ScadaComponentMeta {
  type: string
  component: Component
  configPanel?: Component | null
  template: {
    name: string
    icon: string
    category: string
    defaultConfig: ComponentConfig
  }
  configTypes?: Record<string, any>
}

export interface ScadaComponent<T extends ComponentType = ComponentType> {
  id: string
  type: T
  name: string
  x: number
  y: number
  config: ComponentConfig<T>
  binding: PointBinding | null
  locked: boolean
  visible: boolean
  groupId?: string | null
}

export interface ScadaPanel {
  id: string
  name: string
  type: PanelType
  description?: string
  width: number
  height: number
  grid: number
  backgroundColor: string
  backgroundImage?: string
  /** 预览时的画布适配模式，缺省按 fit 处理 */
  adaptMode?: PanelAdaptMode
  /** 编辑时是否显示网格，默认 false */
  showGrid?: boolean
  components: ScadaComponent[]
  createdAt: number
  updatedAt: number
}

export interface GuideLine {
  type: 'x' | 'y'
  pos: number
}

export interface CanvasPosition {
  x: number
  y: number
}

export interface ContextMenuState {
  visible: boolean
  position: CanvasPosition
  targetId: string | null
  type: 'node' | 'canvas'
}

export type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

export interface ResizeState {
  active: boolean
  handle: ResizeHandle | null
  componentId: string | null
  startSize: { width: number; height: number }
  startPos: CanvasPosition
  componentStartPos: CanvasPosition
}

export interface DragState {
  active: boolean
  startPos: CanvasPosition
  componentStartPos: CanvasPosition
  multiStartPositions: Map<string, CanvasPosition>
  multiStartBBox: {
    minX: number
    centerX: number
    maxX: number
    minY: number
    middleY: number
    maxY: number
  } | null
}

export interface BoxSelectState {
  active: boolean
  start: CanvasPosition
  end: CanvasPosition
}

export interface CanvasState {
  zoom: number
  showGrid: boolean
  isEditing: boolean
  mousePosition: CanvasPosition
  isMouseOnCanvas: boolean
}

export type ContextAction =
  | 'copy'
  | 'paste'
  | 'lock'
  | 'unlock'
  | 'delete'
  | 'bringToFront'
  | 'sendToBack'
  | 'group'
  | 'ungroup'

export interface PanelPreset {
  key: string
  name: string
  width: number
  height: number
}

export interface ComponentPositionDelta {
  dx: number
  dy: number
}
