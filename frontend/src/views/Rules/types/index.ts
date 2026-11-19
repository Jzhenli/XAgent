/**
 * 规则引擎插件名（唯一事实源，对齐后端 plugin.name）
 * - threshold_rule:  条件规则 - 单一条件比较，数据触发
 * - expression_rule: 组合规则 - 多条件/逻辑组合，数据触发
 * - schedule_rule:   定时规则 - 按时间周期触发
 */
export type RulePluginName = 'threshold_rule' | 'expression_rule' | 'schedule_rule'

/**
 * 规则引擎插件名常量（防拼写错误）
 */
export const RULE_PLUGIN_NAMES = {
  THRESHOLD: 'threshold_rule',
  EXPRESSION: 'expression_rule',
  SCHEDULE: 'schedule_rule',
} as const

/**
 * 插件名 → i18n labelKey（用于 t() 多语言切换）
 */
export const RULE_TYPE_LABEL_KEYS: Record<RulePluginName, string> = {
  threshold_rule: 'rules.typeCondition',
  expression_rule: 'rules.typeCombined',
  schedule_rule: 'rules.typeSchedule',
}

/**
 * 插件名 → el-tag 样式
 */
export const RULE_TYPE_TAG_TYPES: Record<RulePluginName, string> = {
  threshold_rule: 'primary',
  expression_rule: 'danger',
  schedule_rule: 'warning',
}

/**
 * 类型过滤器下拉选项（value='all' 表示"全部类型"，避免 Element Plus clearable + '' 的 hasValue 判定问题）
 */
export const RULE_TYPE_FILTER_OPTIONS: ReadonlyArray<{
  value: RulePluginName | 'all'
  labelKey: string
}> = [
  { value: 'all', labelKey: 'rules.allTypes' },
  { value: 'threshold_rule', labelKey: 'rules.typeCondition' },
  { value: 'expression_rule', labelKey: 'rules.typeCombined' },
  { value: 'schedule_rule', labelKey: 'rules.typeSchedule' },
]
