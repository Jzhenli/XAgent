import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { useAlertStore, type Alert, type SystemNotificationConfig } from '@/stores/alerts'

const NOTIFIED_KEY = 'xagent-alerts-notified-ids'
const MAX_NOTIFIED_IDS = 500

/** 各级别自动消失时长 (毫秒) */
const AUTO_DISMISS_MS: Record<string, number> = {
  critical: 6000,
  warning: 6000,
  info: 6000,
}

/** 告警级别 -> ElNotification 类型 */
const LEVEL_TYPE_MAP: Record<string, 'error' | 'warning' | 'info'> = {
  critical: 'error',
  warning: 'warning',
  info: 'info',
}

/**
 * 转义 HTML 特殊字符
 * 通知消息体以 dangerouslyUseHTMLString 渲染, 告警内容必须转义防止注入
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
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
 *  - 按级别排队, 同一级别同一时刻只显示 1 条通知 (critical / warning / info)
 *  - 显示期间新到的同级别告警进入排队, 前一条消失后才显示下一条
 *  - 排队积压的多条告警聚合为一条 (取最后一条标题, 带 +N 计数)
 *  - 所有级别均自动消失 (6s), 鼠标悬浮时暂停倒计时, 离开后重新计时
 *  - 首次拉取的存量告警视为历史数据, 仅登记不通知
 *  - 支持桌面通知 + 站内通知双通道
 */
export function useDesktopNotification() {
  const { t } = useI18n()
  const alertStore = useAlertStore()
  const router = useRouter()

  const notifiedIds = ref<Set<string>>(loadNotifiedIds())
  const initialized = ref(false)
  let unwatchAlerts: (() => void) | null = null

  /** 各级别排队等待显示的告警 (前一条通知消失后才显示下一条) */
  const levelQueues: Record<string, Alert[]> = {
    critical: [],
    warning: [],
    info: [],
  }

  /** 各级别当前显示通知的聚合计数 (用于 +N 显示) */
  const levelCounts: Record<string, number> = {
    critical: 0,
    warning: 0,
    info: 0,
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
   * 获取级别显示名称 (跟随当前语言)
   */
  function levelLabel(level: string): string {
    const labels: Record<string, string> = {
      critical: t('alerts.levelCritical'),
      warning: t('alerts.levelWarning'),
      info: t('alerts.levelInfo'),
    }
    return labels[level] || level
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
    // 捕获创建时的目标实例, 延迟后若实例已被替换/关闭则不再绑定
    const target = notificationInstances[level]
    // ElNotification 创建后, 等待 DOM 渲染完成再绑定事件
    setTimeout(() => {
      if (!target || notificationInstances[level] !== target) return
      const el = (target as unknown as { $el?: HTMLElement }).$el
      if (!el) return

      el.addEventListener('mouseenter', () => {
        hoverState[level] = true
        stopDismissTimer(level)
      })
      el.addEventListener('mouseleave', () => {
        hoverState[level] = false
        startDismissTimer(level)
      })
    }, 50)
  }

  // ==================== 通知聚合与发送 ====================

  /**
   * 静默关闭某级别当前通知 (用于重建前的清理)
   * 先置空引用再 close, 使 onClose 回调中的实例比对失效, 从而不重置聚合计数
   */
  function closeNotificationSilently(level: string) {
    const instance = notificationInstances[level]
    if (!instance) return
    notificationInstances[level] = null
    stopDismissTimer(level)
    instance.close()
  }

  /**
   * 创建/重建站内通知 (内部方法)
   */
  function createNotification(
    level: string,
    title: string,
    body: string,
    type: 'error' | 'warning' | 'info',
  ) {
    // 防御: 若存在遗留的旧通知实例, 先静默关闭, 避免孤儿通知永不消失
    closeNotificationSilently(level)
    hoverState[level] = false

    const instance = ElNotification({
      title,
      message: body,
      type,
      duration: 0, // 由我们自己的定时器控制消失
      showClose: true,
      dangerouslyUseHTMLString: true,
      onClick: () => navigateToAlerts(),
      onClose: () => {
        // 仅当关闭的是当前跟踪的实例时才处理 (排除重建时被替换的旧实例)
        if (notificationInstances[level] !== instance) return
        levelCounts[level] = 0
        notificationInstances[level] = null
        hoverState[level] = false
        stopDismissTimer(level)
        // 前一条通知已消失, 显示排队的下一条
        flushLevelQueue(level)
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
   * 同一级别同一时刻只显示 1 条通知; 显示期间新到的告警进入排队,
   * 当前通知消失后才显示下一条 (积压的多条聚合为一条, 带 +N 计数)
   */
  function sendOrUpdateInAppNotification(alert: Alert) {
    levelQueues[alert.level].push(alert)
    // 若该级别有显示中的通知, 新告警仅排队等待, 不打断当前通知
    flushLevelQueue(alert.level)
  }

  /**
   * 冲洗某级别的排队告警
   * 仅当该级别无显示中的通知时, 将积压告警聚合为一条通知显示;
   * 显示中的通知关闭后会再次调用本方法, 取出下一条排队告警
   */
  function flushLevelQueue(level: string) {
    if (notificationInstances[level]) return
    const pending = levelQueues[level]
    if (!pending.length) return

    // 取出全部积压告警, 聚合为一条 (取最后一条作为标题, 数量用于 +N 显示)
    const alerts = pending.splice(0, pending.length)
    const lastAlert = alerts[alerts.length - 1]
    levelCounts[level] = alerts.length

    const title =
      alerts.length === 1
        ? `[${levelLabel(level)}] ${lastAlert.ruleName}`
        : `[${levelLabel(level)}] ${lastAlert.ruleName} (+${alerts.length - 1})`

    createNotification(
      level,
      title,
      buildNotificationBody(lastAlert, alerts.length),
      LEVEL_TYPE_MAP[level],
    )
  }

  /**
   * 构建通知消息体 (支持 HTML 以显示操作按钮, 内容已转义)
   */
  function buildNotificationBody(alert: Alert, count: number): string {
    const detail = escapeHtml(alert.message || alert.ruleName)
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
    html += t('alerts.channel.viewInAlerts')
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
    const level = alert.level
    // 1. 桌面通知 (仅该级别无显示中通知且无积压时弹出, 即每批第一条)
    const isFirstOfLevel = !notificationInstances[level] && levelQueues[level].length === 0

    if (isFirstOfLevel && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const title = `[${levelLabel(alert.level)}] ${alert.ruleName}`
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

    // 监听 fetchVersion (每次成功拉取自增) 而非 alerts 数组引用:
    // store 在数据不变时会跳过赋值, 数组引用可能不更新;
    // version 每次拉取必自增, 可靠地感知"一次拉取完成"
    unwatchAlerts = watch(
      () => alertStore.fetchVersion,
      () => {
        if (!initialized.value) {
          initialized.value = true
          // 首次拉取完成: 存量 new 告警视为历史数据, 仅登记不通知, 避免打开页面集中弹出
          let changed = false
          for (const alert of alertStore.alerts) {
            if (alert.status === 'new' && !notifiedIds.value.has(alert.id)) {
              notifiedIds.value.add(alert.id)
              changed = true
            }
          }
          if (changed) {
            saveNotifiedIds(notifiedIds.value)
          }
          return
        }
        processNewAlerts(alertStore.alerts)
      },
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
    // 清理所有定时器、排队告警和未关闭的通知
    for (const level of Object.keys(notificationInstances)) {
      levelQueues[level].length = 0
      closeNotificationSilently(level)
    }
  })

  return {
    requestNotificationPermission,
    startWatching,
    stopWatching,
  }
}
