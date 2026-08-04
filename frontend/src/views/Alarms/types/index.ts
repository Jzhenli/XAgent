import type { SystemNotificationConfig } from '@/stores/alerts'

/**
 * 告警级别
 * - critical: 紧急
 * - warning:  警告
 * - info:     提示
 */
export type AlertLevel = 'critical' | 'warning' | 'info'

/**
 * 告警状态
 * - new:          未处理
 * - acknowledged: 已确认
 * - resolved:     已解决
 * - ignored:      已忽略
 */
export type AlertStatus = 'new' | 'acknowledged' | 'resolved' | 'ignored'

/**
 * 通知渠道类型
 * - email:   邮件
 * - sms:     短信
 * - webhook: Webhook
 * - system:  系统通知
 */
export type ChannelType = 'email' | 'sms' | 'webhook' | 'system'

/** 告警级别对应的国际化文案 key */
export const ALERT_LEVEL_LABEL_KEYS: Record<AlertLevel, string> = {
  critical: 'alerts.levelCritical',
  warning: 'alerts.levelWarning',
  info: 'alerts.levelInfo',
}

/** 告警级别对应的 el-tag 样式类型 */
export const ALERT_LEVEL_TAG_TYPES: Record<AlertLevel, string> = {
  critical: 'danger',
  warning: 'warning',
  info: 'info',
}

/** 级别筛选下拉选项 (value 为空字符串表示 "全部") */
export const ALERT_LEVEL_FILTER_OPTIONS: ReadonlyArray<{
  value: AlertLevel | ''
  labelKey: string
}> = [
  { value: '', labelKey: 'common.all' },
  { value: 'critical', labelKey: 'alerts.levelCritical' },
  { value: 'warning', labelKey: 'alerts.levelWarning' },
  { value: 'info', labelKey: 'alerts.levelInfo' },
]

/** 告警状态对应的国际化文案 key */
export const ALERT_STATUS_LABEL_KEYS: Record<AlertStatus, string> = {
  new: 'alerts.statusNew',
  acknowledged: 'alerts.statusAcknowledged',
  resolved: 'alerts.statusResolved',
  ignored: 'alerts.statusIgnored',
}

/** 告警状态对应的 el-tag 样式类型 */
export const ALERT_STATUS_TAG_TYPES: Record<AlertStatus, string> = {
  new: 'danger',
  acknowledged: 'warning',
  resolved: 'success',
  ignored: 'info',
}

/** 状态筛选下拉选项 (value 为空字符串表示 "全部") */
export const ALERT_STATUS_FILTER_OPTIONS: ReadonlyArray<{
  value: AlertStatus | ''
  labelKey: string
}> = [
  { value: '', labelKey: 'common.all' },
  { value: 'new', labelKey: 'alerts.statusNew' },
  { value: 'acknowledged', labelKey: 'alerts.statusAcknowledged' },
  { value: 'resolved', labelKey: 'alerts.statusResolved' },
  { value: 'ignored', labelKey: 'alerts.statusIgnored' },
]

/** 渠道类型对应的国际化文案 key (Webhook 无翻译, 显示原文) */
export const CHANNEL_TYPE_LABEL_KEYS: Record<ChannelType, string> = {
  email: 'alerts.channelEmail',
  sms: 'alerts.channelSms',
  webhook: '',
  system: 'alerts.channelSystem',
}

/** 渠道类型对应的图标 emoji */
export const CHANNEL_TYPE_ICONS: Record<ChannelType, string> = {
  email: '📧',
  sms: '📱',
  webhook: '🔗',
  system: '🔔',
}

/** 邮件渠道配置表单 */
export interface EmailConfigForm {
  smtpHost: string
  smtpPort: number
  username: string
  password: string
  fromAddress: string
  useTls: boolean
  useSsl: boolean
  recipients: string[]
}

/** Webhook 渠道配置表单 */
export interface WebhookConfigForm {
  url: string
  method: string
  headers: string
  secret: string
}

/** 创建系统通知配置表单初始值 */
export function createInitialSystemConfig(): SystemNotificationConfig {
  return {
    retentionDays: 30,
    maxNotifications: 1000,
    soundEnabled: true,
    desktopEnabled: true,
    autoReadMinutes: 0,
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    notifyLevels: ['critical', 'warning', 'info'],
  }
}

/** 创建邮件配置表单初始值 */
export function createInitialEmailConfig(): EmailConfigForm {
  return {
    smtpHost: '',
    smtpPort: 587,
    username: '',
    password: '',
    fromAddress: '',
    useTls: true,
    useSsl: false,
    recipients: [],
  }
}

/** 创建 Webhook 配置表单初始值 */
export function createInitialWebhookConfig(): WebhookConfigForm {
  return {
    url: '',
    method: 'POST',
    headers: '',
    secret: '',
  }
}
