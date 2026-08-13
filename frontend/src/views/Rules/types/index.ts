/**
 * 规则类型枚举
 * - scene:    场景规则 (数据触发)
 * - alert:    告警规则 (含通知)
 * - schedule: 定时规则
 */
export type RuleType = 'scene' | 'alert' | 'schedule'

/**
 * 规则类型对应的国际化文案 key
 */
export const RULE_TYPE_LABEL_KEYS: Record<RuleType, string> = {
  scene: 'rules.typeScene',
  alert: 'rules.typeAlert',
  schedule: 'rules.typeSchedule',
}

/**
 * 规则类型对应的 el-tag 样式类型
 */
export const RULE_TYPE_TAG_TYPES: Record<RuleType, string> = {
  scene: 'primary',
  alert: 'danger',
  schedule: 'warning',
}

/**
 * 类型过滤器下拉选项 (value 为空字符串表示"全部")
 */
export const RULE_TYPE_FILTER_OPTIONS: ReadonlyArray<{
  value: RuleType | ''
  labelKey: string
}> = [
  { value: '', labelKey: 'rules.allTypes' },
  { value: 'scene', labelKey: 'rules.typeScene' },
  { value: 'alert', labelKey: 'rules.typeAlert' },
  { value: 'schedule', labelKey: 'rules.typeSchedule' },
]
