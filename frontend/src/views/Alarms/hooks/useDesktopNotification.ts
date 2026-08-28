import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { useAlertStore, type Alert, type SystemNotificationConfig } from '@/stores/alerts'

const NOTIFIED_KEY = 'xagent-alerts-notified-ids'
const MAX_NOTIFIED_IDS = 500

/** 每个级别只保留 1 条聚合通知, 最多 3 条 (critical/warning/info) */
const LEVEL_TAG_MAP: Record<string, string> = {
  critical: 'alert-level-critical',
  warning: 'alert-level-warning',
  info: 'alert-level-info',
}

/** 各级别自动消失时长 (毫秒) */
const AUTO_DISMISS_MS: Record<string, number> = {
  critical: 6000,
  warning: 6000,
  info: 6000,
}

/** 已发送但未处理的告警 (按级别聚合) */
interface LevelAggregate {
  count: number
  lastAlert: Alert | null
  firstTime: number
}

/**
 * 判断当前时间是否在免打扰时段内
 */
function isInQuietHours(start: string, end: string): boolean {
  if (!start || !end) return false
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  const [startH, startM] = start.split(':').map(Number)
  const [endH, endM] = end.split(':').map(Number)
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM

  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes
  } else {
    return currentMinutes >= startMinutes || currentMinutes < endMinutes
  }
}

function loadNotifiedIds(): Set<string> {
  try {
    const raw = sessionStorage.getItem(NOTIFIED_KEY)
    if (raw) return new Set(JSON.parse(raw))
  } catch {
    // ignore
  }
  return new Set()
}

function saveNotifiedIds(ids: Set<string>) {
  try {
    sessionStorage.setItem(NOTIFIED_KEY, JSON.stringify([...ids]))
  } catch {
    // ignore
  }
}

/**
 * 桌面通知 Hook
 *
 * 通知策略:
 *  - 按级别聚合, 每个级别只显示 1 条通知 (critical / warning / info)
 *  - 同一级别多条告警合并计数, 点击可跳转告警列表
 *  - 所有级别均自动消失 (critical 30s / warning 15s / info 10s)
 *  - 鼠标悬浮时暂停倒计时, 离开后重新计时
 *  - 支持桌面通知 + 站内通知双通道
 */
export function useDesktopNotification() {
  const { t } = useI18n()
  const alertStore = useAlertStore()
  const router = useRouter()

  const notifiedIds = ref<Set<string>>(loadNotifiedIds())
  const initialized = ref(false)
  let unwatchAlerts: (() => void) | null = null

  /** 按级别聚合的站内通知实例 */
  const levelAggregates: Record<string, LevelAggregate> = {
    critical: { count: 0, lastAlert: null, firstTime: 0 },
    warning: { count: 0, lastAlert: null, firstTime: 0 },
    info: { count: 0, lastAlert: null, firstTime: 0 },
  }

  /** 记录已创建的 Notification 实例 (用于关闭) */
  const notificationInstances: Record<string, { close: () => void } | null> = {
    critical: null,
    warning: null,
    info: null,
  }

  /** 各级别自动消失定时器 */
  const dismissTimers: Record<string, ReturnType<typeof setTimeout> | null> = {
    critical: null,
    warning: null,
    info: null,
  }

  /** 各级别鼠标悬浮状态 (悬浮时暂停倒计时) */
  const hoverState: Record<string, boolean> = {
    critical: false,
    warning: false,
    info: false,
  }

  /**
   * 启动某级别的自动消失倒计时
   */
  function startDismissTimer(level: string) {
    stopDismissTimer(level)
    const duration = AUTO_DISMISS_MS[level]
    dismissTimers[level] = setTimeout(() => {
      dismissTimers[level] = null
      if (!hoverState[level] && notificationInstances[level]) {
        notificationInstances[level]!.close()
      }
    }, duration)
  }

  /**
   * 停止某级别的自动消失倒计时
   */
  function stopDismissTimer(level: string) {
    if (dismissTimers[level]) {
      clearTimeout(dismissTimers[level]!)
      dismissTimers[level] = null
    }
  }

  /**
   * 绑定悬浮暂停逻辑到通知 DOM
   */
  function bindHoverPause(level: string) {
    // ElNotification 创建后, 等下一帧获取 DOM 绑定事件
    setTimeout(() => {
      const el = notificationInstances[level] as unknown as { $el?: HTMLElement }
      if (!el || !el.$el) return

      const element = el.$el
      element.addEventListener('mouseenter', () => {
        hoverState[level] = true
        stopDismissTimer(level)
      })
      element.addEventListener('mouseleave', () => {
        hoverState[level] = false
        startDismissTimer(level)
      })
    }, 50)
  }

  // ==================== 通知聚合与发送 ====================

  /**
   * 创建/重建站内通知 (内部方法)
   */
  function createNotification(
    level: string,
    title: string,
    body: string,
    type: 'error' | 'warning' | 'info',
  ) {
    const instance = ElNotification({
      title,
      message: body,
      type,
      duration: 0, // 由我们自己的定时器控制消失
      showClose: true,
      dangerouslyUseHTMLString: true,
      onClick: () => navigateToAlerts(),
      onClose: () => {
        levelAggregates[level] = { count: 0, lastAlert: null, firstTime: 0 }
        notificationInstances[level] = null
        hoverState[level] = false
        stopDismissTimer(level)
      },
    })
    notificationInstances[level] = instance as { close: () => void }

    // 绑定悬浮暂停
    bindHoverPause(level)

    // 启动自动消失倒计时
    startDismissTimer(level)
  }

  /**
   * 发送/更新站内聚合通知
   * 同一级别只保留 1 条通知, 后续同级别告警合并计数
   */
  function sendOrUpdateInAppNotification(alert: Alert) {
    const level = alert.level
    const agg = levelAggregates[level]
    const isNew = agg.count === 0

    // 更新聚合数据
    agg.count++
    agg.lastAlert = alert
    if (isNew) {
      agg.firstTime = Date.now()
    }

    const typeMap: Record<string, 'error' | 'warning' | 'info'> = {
      critical: 'error',
      warning: 'warning',
      info: 'info',
    }

    const levelLabels: Record<string, string> = {
      critical: t('alerts.levelCritical'),
      warning: t('alerts.levelWarning'),
      info: t('alerts.levelInfo'),
    }

    const title = isNew
      ? `[${levelLabels[level]}] ${alert.ruleName}`
      : `[${levelLabels[level]}] ${alert.ruleName} (+${agg.count - 1})`

    const body = buildNotificationBody(alert, agg)

    if (isNew) {
      createNotification(level, title, body, typeMap[level])
    } else {
      // 更新: 关闭旧通知, 重建新通知 (重置倒计时)
      if (notificationInstances[level]) {
        notificationInstances[level]!.close()
        notificationInstances[level] = null
      }
      setTimeout(() => {
        createNotification(level, title, body, typeMap[level])
      }, 100)
    }
  }

  /**
   * 构建通知消息体 (支持 HTML 以显示操作按钮)
   */
  function buildNotificationBody(alert: Alert, agg: LevelAggregate): string {
    const detail = alert.message || alert.ruleName
    const count = agg.count
    const timeStr = new Date(alert.triggeredAt).toLocaleTimeString()

    let html = `<div style="font-size:13px;line-height:1.5">`
    html += `<div style="margin-bottom:4px">${detail}</div>`
    if (count > 1) {
      html += `<div style="font-size:12px;opacity:0.75">`
      html += t('alerts.notificationMore', { count })
      html += `</div>`
    }
    html += `<div style="display:flex;gap:8px;margin-top:8px">`
    html += `<button class="alert-notification-action" data-action="navigate" style="background:none;border:0;color:var(--el-color-primary);cursor:pointer;padding:0;font-size:13px">`
    html += t('alerts.viewInAlerts')
    html += `</button>`
    html += `</div>`
    html += `<div style="font-size:11px;opacity:0.5;margin-top:4px">${timeStr}</div>`
    html += `</div>`
    return html
  }

  /**
   * 跳转到告警列表页
   */
  function navigateToAlerts() {
    router.push('/alerts')
  }

  // ==================== 权限与配置 ====================

  async function requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    if (Notification.permission === 'denied') return false

    try {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    } catch {
      return false
    }
  }

  function getSystemConfig(): SystemNotificationConfig | null {
    const systemChannel = alertStore.channels.find((c) => c.type === 'system')
    if (!systemChannel) return null
    return systemChannel.config as SystemNotificationConfig
  }

  function shouldNotify(alert: Alert): boolean {
    const config = getSystemConfig()
    if (!config) return false
    if (!config.desktopEnabled) return false
    if (!config.notifyLevels.includes(alert.level)) return false

    if (
      config.quietHoursEnabled &&
      isInQuietHours(config.quietHoursStart, config.quietHoursEnd)
    ) {
      return false
    }

    return true
  }

  // ==================== 通知发送 (双通道) ====================

  /**
   * 发送双通道告警通知
   */
  function sendAlertNotification(alert: Alert) {
    // 1. 桌面通知 (仅首次弹出, 后续同级别由站内通知聚合)
    const agg = levelAggregates[alert.level]
    const isFirstOfLevel = agg.count === 0

    if (isFirstOfLevel && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const levelLabels: Record<string, string> = {
          critical: t('alerts.levelCritical'),
          warning: t('alerts.levelWarning'),
          info: t('alerts.levelInfo'),
        }
        const title = `[${levelLabels[alert.level]}] ${alert.ruleName}`
        const body = alert.message || alert.ruleName
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          tag: `xagent-alert-${alert.level}-${alert.id}`,
          requireInteraction: alert.level === 'critical',
        })
      } catch {
        // ignore
      }
    }

    // 2. 站内聚合通知
    sendOrUpdateInAppNotification(alert)
  }

  // ==================== 告警处理 ====================

  function processNewAlerts(alerts: Alert[]) {
    let changed = false
    const newIds: string[] = []

    for (const alert of alerts) {
      if (notifiedIds.value.has(alert.id)) continue
      if (alert.status !== 'new') continue

      if (shouldNotify(alert)) {
        sendAlertNotification(alert)
      }

      newIds.push(alert.id)
    }

    if (newIds.length) {
      if (notifiedIds.value.size + newIds.length > MAX_NOTIFIED_IDS) {
        const toRemove = Math.floor(MAX_NOTIFIED_IDS / 2)
        let count = 0
        for (const id of notifiedIds.value) {
          if (count >= toRemove) break
          notifiedIds.value.delete(id)
          count++
        }
      }
      for (const id of newIds) {
        notifiedIds.value.add(id)
      }
      changed = true
    }

    if (changed) {
      saveNotifiedIds(notifiedIds.value)
    }
  }

  // ==================== 生命周期 ====================

  function startWatching() {
    if (unwatchAlerts) return

    unwatchAlerts = watch(
      () => alertStore.alerts,
      (newAlerts) => {
        if (!initialized.value) {
          initialized.value = true
          return
        }
        processNewAlerts(newAlerts)
      },
      { deep: false },
    )
  }

  function stopWatching() {
    if (unwatchAlerts) {
      unwatchAlerts()
      unwatchAlerts = null
    }
  }

  async function init() {
    startWatching()
  }

  onMounted(() => {
    init()
  })

  onUnmounted(() => {
    stopWatching()
    // 清理所有定时器和未关闭的通知
    for (const level of Object.keys(notificationInstances)) {
      stopDismissTimer(level)
      if (notificationInstances[level]) {
        notificationInstances[level]!.close()
        notificationInstances[level] = null
      }
    }
  })

  return {
    requestNotificationPermission,
    startWatching,
    stopWatching,
  }
}