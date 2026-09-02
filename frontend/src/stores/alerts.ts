import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ruleApi } from '@/api/rules'
import type { AlertResponse } from '@/api/types'

export interface Alert {
  id: string
  ruleId: string
  ruleName: string
  level: 'critical' | 'warning' | 'info'
  status: 'new' | 'acknowledged' | 'resolved' | 'ignored'
  asset?: string
  point?: string
  currentValue?: string
  threshold?: string
  triggeredAt: string
  message: string
}

export interface SystemNotificationConfig {
  retentionDays: number
  maxNotifications: number
  soundEnabled: boolean
  desktopEnabled: boolean
  autoReadMinutes: number
  quietHoursEnabled: boolean
  quietHoursStart: string
  quietHoursEnd: string
  notifyLevels: Array<'critical' | 'warning' | 'info'>
}

export interface NotificationChannel {
  id: string
  name: string
  type: 'email' | 'sms' | 'webhook' | 'system'
  enabled: boolean
  config: Record<string, any>
}

function mapAlertFromApi(a: AlertResponse): Alert {
  return {
    id: a.id,
    ruleId: a.rule_id,
    ruleName: a.rule_name || a.title,
    level: (['critical', 'warning', 'info'].includes(a.level) ? a.level : 'info') as Alert['level'],
    status: (['new', 'acknowledged', 'resolved', 'ignored'].includes(a.status) ? a.status : 'new') as Alert['status'],
    asset: a.asset || undefined,
    point: a.point_name || undefined,
    currentValue: a.current_value || undefined,
    threshold: a.threshold || undefined,
    triggeredAt: a.triggered_at_str || (a.triggered_at ? new Date(a.triggered_at * 1000).toLocaleString() : ''),
    message: a.message || a.title,
  }
}

/**
 * 判断两次拉取的告警列表是否一致
 * 告警记录除 status 外不可变, 仅比较 id + status 即可
 */
function isSameAlerts(next: Alert[], prev: Alert[]): boolean {
  if (next.length !== prev.length) return false
  for (let i = 0; i < next.length; i++) {
    if (next[i].id !== prev[i].id || next[i].status !== prev[i].status) return false
  }
  return true
}

export const useAlertStore = defineStore('alerts', () => {
  const alerts = ref<Alert[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 每次成功拉取自增
   * 供通知 hook 感知"一次拉取完成", 不依赖 alerts 数组引用变化
   * (配合 fetchAlerts 的数据比对跳过赋值, 引用可能在数据不变时不更新)
   */
  const fetchVersion = ref(0)
  let hasFetchedOnce = false

  // 动态获取通知渠道（从后端API）
  const channels = ref<NotificationChannel[]>([])

  // ==================== 告警轮询 ====================
  const pollingActive = ref(false)
  let pollingTimer: ReturnType<typeof setInterval> | null = null
  let fetchInFlight = false

  function startPolling(intervalMs: number = 5000) {
    if (pollingTimer) return
    pollingActive.value = true
    // 仅本会话首次拉取显示 loading 遮罩, 后续轮询/标签页恢复时静默刷新
    void fetchAlerts(!hasFetchedOnce)
    pollingTimer = setInterval(() => {
      if (!fetchInFlight) {
        void fetchAlerts()
      }
    }, intervalMs)
  }

  function stopPolling() {
    if (pollingTimer) {
      clearInterval(pollingTimer)
      pollingTimer = null
    }
    pollingActive.value = false
  }

  const pendingAlerts = computed(() =>
    alerts.value.filter(a => a.status === 'new').length
  )

  const criticalAlerts = computed(() =>
    alerts.value.filter(a => a.level === 'critical' && a.status === 'new').length
  )

  /**
   * 获取告警列表
   * @param showLoading 是否显示 loading 遮罩（首次加载或手动刷新时传 true，轮询时保持静默）
   */
  async function fetchAlerts(showLoading = false) {
    if (fetchInFlight) return
    fetchInFlight = true
    if (showLoading) loading.value = true
    error.value = null
    try {
      const res = await ruleApi.listAlerts()
      const mapped = res.alerts.map(mapAlertFromApi)
      // 数据无变化时跳过赋值, 避免每次轮询触发全量响应式更新导致订阅组件反复重渲染
      if (!isSameAlerts(mapped, alerts.value)) {
        alerts.value = mapped
      }
      hasFetchedOnce = true
      fetchVersion.value++
    } catch (e: any) {
      error.value = e.message || '获取告警记录失败'
      console.error('Failed to fetch alerts:', e)
    } finally {
      if (showLoading) loading.value = false
      fetchInFlight = false
    }
  }

  // ✨ 新增：获取通道列表
  async function fetchChannels() {
    loading.value = true
    error.value = null
    try {
      const res = await ruleApi.listChannels()
      channels.value = res.channels.map(mapChannelFromApi)
    } catch (e: any) {
      error.value = e.message || '获取通知通道失败'
      console.error('Failed to fetch channels:', e)
    } finally {
      loading.value = false
    }
  }

  // ✨ 新增：映射API响应到前端模型
  function mapChannelFromApi(channel: any): NotificationChannel {
    const config = channel.config || {}
    const pluginName = channel.plugin_name

    // 统一的字段映射函数
    const mapFields = (fieldMap: Record<string, { from: string[], default: any }>) => {
      const result: Record<string, any> = {}
      for (const [toField, { from, default: defaultValue }] of Object.entries(fieldMap)) {
        // 尝试所有可能的字段名
        for (const fromField of from) {
          if (config[fromField] !== undefined) {
            result[toField] = config[fromField]
            break
          }
        }
        // 如果没有找到，使用默认值
        if (result[toField] === undefined) {
          result[toField] = defaultValue
        }
      }
      return result
    }

    // System通知通道字段映射
    if (pluginName === 'system') {
      const fieldMap = {
        retentionDays: { from: ['retention_days', 'retentionDays'], default: 30 },
        maxNotifications: { from: ['max_notifications', 'maxNotifications'], default: 1000 },
        notifyLevels: { from: ['notify_levels', 'notifyLevels'], default: ['critical', 'warning', 'info'] },
        soundEnabled: { from: ['sound_enabled', 'soundEnabled'], default: true },
        desktopEnabled: { from: ['desktop_enabled', 'desktopEnabled'], default: true },
        autoReadMinutes: { from: ['auto_read_minutes', 'autoReadMinutes'], default: 0 },
        quietHoursEnabled: { from: ['quiet_hours_enabled', 'quietHoursEnabled'], default: false },
        quietHoursStart: { from: ['quiet_hours_start', 'quietHoursStart'], default: '22:00' },
        quietHoursEnd: { from: ['quiet_hours_end', 'quietHoursEnd'], default: '08:00' },
      }
      return {
        id: channel.channel_id,
        name: getChannelName(pluginName),
        type: pluginName,
        enabled: config.enabled ?? true,
        config: mapFields(fieldMap) as SystemNotificationConfig
      }
    }

    // Email通知通道字段映射
    if (pluginName === 'email') {
      const fieldMap = {
        smtpHost: { from: ['smtp_host', 'smtpHost'], default: '' },
        smtpPort: { from: ['smtp_port', 'smtpPort'], default: 587 },
        username: { from: ['smtp_user', 'username', 'smtp_username'], default: '' },
        password: { from: ['smtp_password', 'password', 'smtp_password'], default: '' },
        fromAddress: { from: ['from_address', 'fromAddress'], default: '' },
        useTls: { from: ['use_tls', 'useTls'], default: true },
        useSsl: { from: ['use_ssl', 'useSsl'], default: false },
        recipients: { from: ['recipients'], default: [] },
      }
      return {
        id: channel.channel_id,
        name: getChannelName(pluginName),
        type: pluginName,
        enabled: config.enabled ?? true,
        config: mapFields(fieldMap)
      }
    }

    // Webhook通知通道字段映射
    if (pluginName === 'webhook') {
      const fieldMap = {
        url: { from: ['url'], default: '' },
        method: { from: ['method'], default: 'POST' },
        headers: { from: ['headers'], default: '' },
        secret: { from: ['secret'], default: '' },
      }
      return {
        id: channel.channel_id,
        name: getChannelName(pluginName),
        type: pluginName,
        enabled: config.enabled ?? true,
        config: mapFields(fieldMap)
      }
    }

    // 其他类型保持原样
    return {
      id: channel.channel_id,
      name: getChannelName(pluginName),
      type: pluginName,
      enabled: config.enabled ?? true,
      config: config
    }
  }

  // ✨ 新增：获取通道显示名称
  function getChannelName(pluginName: string): string {
    const names: Record<string, string> = {
      'system': '系统通知',
      'email': '邮件通知',
      'webhook': 'Webhook通知'
    }
    return names[pluginName] || pluginName
  }

  // ✨ 新增：将前端驼峰配置转换为后端下划线格式
  function mapConfigToApi(pluginName: string, config: Record<string, any>, enabled: boolean = true): Record<string, any> {
    // 统一的字段反向映射函数（前端驼峰 -> 后端下划线）
    const mapFieldsToBackend = (fieldMap: Record<string, string>) => {
      const result: Record<string, any> = {}
      for (const [frontendField, backendField] of Object.entries(fieldMap)) {
        if (config[frontendField] !== undefined) {
          result[backendField] = config[frontendField]
        }
      }
      result.enabled = enabled
      return result
    }

    if (pluginName === 'email') {
      const fieldMap = {
        smtpHost: 'smtp_host',
        smtpPort: 'smtp_port',
        username: 'smtp_user',
        password: 'smtp_password',
        fromAddress: 'from_address',
        useTls: 'use_tls',
        useSsl: 'use_ssl',
        recipients: 'recipients',
      }
      return mapFieldsToBackend(fieldMap)
    }

    if (pluginName === 'webhook') {
      const fieldMap = {
        url: 'url',
        method: 'method',
        headers: 'headers',
        secret: 'secret',
      }
      return mapFieldsToBackend(fieldMap)
    }

    if (pluginName === 'system') {
      const fieldMap = {
        retentionDays: 'retention_days',
        maxNotifications: 'max_notifications',
        notifyLevels: 'notify_levels',
        soundEnabled: 'sound_enabled',
        desktopEnabled: 'desktop_enabled',
        autoReadMinutes: 'auto_read_minutes',
        quietHoursEnabled: 'quiet_hours_enabled',
        quietHoursStart: 'quiet_hours_start',
        quietHoursEnd: 'quiet_hours_end',
      }
      return mapFieldsToBackend(fieldMap)
    }

    return { ...config, enabled }
  }

  async function acknowledgeAlert(id: string) {
    try {
      await ruleApi.acknowledgeAlert(id)
      const alert = alerts.value.find(a => a.id === id)
      if (alert) {
        alert.status = 'acknowledged'
      }
    } catch (e: any) {
      console.error('Failed to acknowledge alert:', e)
      throw e
    }
  }

  async function resolveAlert(id: string) {
    try {
      await ruleApi.resolveAlert(id)
      const alert = alerts.value.find(a => a.id === id)
      if (alert) {
        alert.status = 'resolved'
      }
    } catch (e: any) {
      console.error('Failed to resolve alert:', e)
      throw e
    }
  }

  async function ignoreAlert(id: string) {
    try {
      await ruleApi.ignoreAlert(id)
      const alert = alerts.value.find(a => a.id === id)
      if (alert) {
        alert.status = 'ignored'
      }
    } catch (e: any) {
      console.error('Failed to ignore alert:', e)
      throw e
    }
  }

  async function clearResolvedAlerts() {
    try {
      await ruleApi.clearResolvedAlerts()
      alerts.value = alerts.value.filter(a => a.status !== 'resolved')
    } catch (e: any) {
      console.error('Failed to clear resolved alerts:', e)
      throw e
    }
  }

  // ✨ 改造：更新通道配置（调用后端API + 错误恢复）
  async function updateChannelConfig(channelId: string, config: Record<string, any>) {
    const channel = channels.value.find(c => c.id === channelId)
    if (!channel) return

    // 备份旧配置（用于失败时恢复）
    const oldConfig = { ...channel.config }
    const oldEnabled = channel.enabled

    loading.value = true
    error.value = null
    try {
      // 将前端驼峰配置转换为后端下划线格式
      const apiConfig = mapConfigToApi(channel.type, config, config.enabled ?? channel.enabled)

      await ruleApi.updateChannel(channelId, {
        plugin_name: channel.type,
        config: apiConfig
      })

      // 更新本地状态
      channel.config = { ...channel.config, ...config }
      // 如果config中有enabled，更新顶层的enabled
      if (config.enabled !== undefined) {
        channel.enabled = config.enabled
      }
    } catch (e: any) {
      error.value = e.message || '保存配置失败'

      // 恢复旧配置
      channel.config = oldConfig
      channel.enabled = oldEnabled

      throw e
    } finally {
      loading.value = false
    }
  }

  // ✨ 新增：测试通道连接
  async function testChannel(channelId: string): Promise<boolean> {
    try {
      const channel = channels.value.find(c => c.id === channelId)
      if (!channel) {
        console.error('Channel not found')
        return false
      }

      // 如果channel未启用，传入plugin_name参数测试
      const res = await ruleApi.testChannel(
        channelId,
        channel.enabled ? undefined : channel.type
      )
      return res.success
    } catch (e: any) {
      console.error('Test channel failed:', e)
      return false
    }
  }

  // ✨ 改造：切换通道启用状态（调用后端API）
  async function toggleChannel(channelId: string) {
    const channel = channels.value.find(c => c.id === channelId)
    if (!channel) return

    const oldEnabled = channel.enabled
    const newEnabled = !oldEnabled

    try {
      await updateChannelConfig(channelId, {
        ...channel.config,
        enabled: newEnabled
      })

      channel.enabled = newEnabled
    } catch (e: any) {
      // 失败时恢复原状态
      console.error('Toggle channel failed:', e)
      throw e
    }
  }

  return {
    alerts,
    loading,
    error,
    channels,
    pendingAlerts,
    criticalAlerts,
    pollingActive,
    fetchVersion,
    fetchAlerts,
    fetchChannels,
    startPolling,
    stopPolling,
    acknowledgeAlert,
    resolveAlert,
    ignoreAlert,
    clearResolvedAlerts,
    toggleChannel,
    updateChannelConfig,
    testChannel
  }
}, {
  persist: {
    key: 'xagent-alerts-v1',
    storage: sessionStorage,
    paths: ['alerts']
  }
})
