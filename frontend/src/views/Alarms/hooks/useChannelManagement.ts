import { ref, reactive, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  useAlertStore,
  type SystemNotificationConfig,
} from '@/stores/alerts'
import { ElMessage } from 'element-plus'
import {
  createInitialSystemConfig,
  createInitialEmailConfig,
  createInitialWebhookConfig,
  type EmailConfigForm,
  type WebhookConfigForm,
  type ChannelType,
} from '../types'

/**
 * 通知渠道管理 Hook
 *
 * 统一管理系统/邮件/Webhook 三类通知渠道:
 * - 各渠道配置表单的响应式状态
 * - 渠道启用状态切换
 * - 打开配置对话框 (按渠道类型填充表单)
 * - 保存渠道配置 (校验由对话框内部完成, 通过后触发持久化)
 * - 渠道连接测试与系统桌面通知测试
 */
export function useChannelManagement() {
  const { t } = useI18n()
  const alertStore = useAlertStore()

  // ==================== 系统通知配置表单 ====================
  const systemConfigDialogVisible = ref(false)
  const systemConfigForm = reactive<SystemNotificationConfig>(
    createInitialSystemConfig(),
  )

  // ==================== 邮件配置表单 ====================
  const emailConfigDialogVisible = ref(false)
  const emailConfigForm = reactive<EmailConfigForm>(createInitialEmailConfig())

  // ==================== Webhook 配置表单 ====================
  const webhookConfigDialogVisible = ref(false)
  const webhookConfigForm = reactive<WebhookConfigForm>(
    createInitialWebhookConfig(),
  )

  // ==================== 渠道启用切换 ====================
  /** 切换通道启用状态（异步，等待 store 完成后提示正确结果） */
  const handleToggleChannel = async (id: string) => {
    try {
      await alertStore.toggleChannel(id)
      const channel = alertStore.channels.find((c) => c.id === id)
      if (channel) {
        ElMessage.success(
          channel.enabled
            ? t('alerts.channelEnabled')
            : t('alerts.channelDisabled'),
        )
      }
    } catch {
      ElMessage.error(t('common.operationFailed'))
    }
  }

  // ==================== 打开配置对话框 ====================
  /**
   * 根据渠道类型填充对应表单并打开配置对话框
   */
  const handleConfigureChannel = (channelId: string) => {
    const channel = alertStore.channels.find((c) => c.id === channelId)
    if (!channel) return

    if (channel.type === 'system') {
      Object.assign(systemConfigForm, {
        retentionDays: channel.config.retentionDays ?? 30,
        maxNotifications: channel.config.maxNotifications ?? 1000,
        soundEnabled: channel.config.soundEnabled ?? true,
        desktopEnabled: channel.config.desktopEnabled ?? true,
        autoReadMinutes: channel.config.autoReadMinutes ?? 0,
        quietHoursEnabled: channel.config.quietHoursEnabled ?? false,
        quietHoursStart: channel.config.quietHoursStart ?? '22:00',
        quietHoursEnd: channel.config.quietHoursEnd ?? '08:00',
        notifyLevels: [
          ...(channel.config.notifyLevels ?? [
            'critical',
            'warning',
            'info',
          ]),
        ],
      })
      systemConfigDialogVisible.value = true
    } else if (channel.type === 'email') {
      Object.assign(emailConfigForm, {
        smtpHost: channel.config.smtpHost ?? '',
        smtpPort: channel.config.smtpPort ?? 587,
        username: channel.config.username ?? '',
        password: channel.config.password ?? '',
        fromAddress: channel.config.fromAddress ?? '',
        useTls: channel.config.useTls ?? true,
        useSsl: channel.config.useSsl ?? false,
        recipients: channel.config.recipients ?? [],
      })
      emailConfigDialogVisible.value = true
    } else if (channel.type === 'webhook') {
      Object.assign(webhookConfigForm, {
        url: channel.config.url ?? '',
        method: channel.config.method ?? 'POST',
        headers: channel.config.headers ?? '',
        secret: channel.config.secret ?? '',
      })
      webhookConfigDialogVisible.value = true
    }
  }

  // ==================== 保存配置 (通用流程) ====================
  /**
   * 持久化渠道配置: 按渠道类型找到通道 -> 调用 store 更新 -> 提示并关闭对话框
   * 表单校验已由对话框内部完成, 通过 @save 事件触发本方法。
   */
  const persistChannelConfig = async (params: {
    form: Record<string, any>
    channelType: ChannelType
    successKey: string
    dialogVisible: Ref<boolean>
  }) => {
    const { form, channelType, successKey, dialogVisible } = params
    const channel = alertStore.channels.find((c) => c.type === channelType)
    if (!channel) return

    try {
      await alertStore.updateChannelConfig(channel.id, { ...form })
      ElMessage.success(t(successKey))
      dialogVisible.value = false
    } catch {
      // 错误已在 Store 中处理
    }
  }

  /** 保存系统通知配置 */
  const handleSaveSystemConfig = () =>
    persistChannelConfig({
      form: systemConfigForm,
      channelType: 'system',
      successKey: 'alerts.systemConfigSaved',
      dialogVisible: systemConfigDialogVisible,
    })

  /** 保存邮件配置 */
  const handleSaveEmailConfig = () =>
    persistChannelConfig({
      form: emailConfigForm,
      channelType: 'email',
      successKey: 'alerts.emailConfigSaved',
      dialogVisible: emailConfigDialogVisible,
    })

  /** 保存 Webhook 配置 */
  const handleSaveWebhookConfig = () =>
    persistChannelConfig({
      form: webhookConfigForm,
      channelType: 'webhook',
      successKey: 'alerts.webhookConfigSaved',
      dialogVisible: webhookConfigDialogVisible,
    })

  // ==================== 通道测试 ====================
  /** 测试通道连接 */
  const handleTestChannel = async (channelId: string) => {
    const channel = alertStore.channels.find((c) => c.id === channelId)
    if (!channel) return

    if (!channel.enabled) {
      ElMessage.warning(t('alerts.enableChannelFirst'))
      return
    }

    try {
      const success = await alertStore.testChannel(channelId)
      if (success) {
        if (channel.type === 'system') {
          testSystemNotification()
        } else {
          ElMessage.success(t('alerts.channel.testSuccess'))
        }
      } else {
        ElMessage.error(t('alerts.channel.testFailed'))
      }
    } catch {
      ElMessage.error(t('alerts.channel.testFailed'))
    }
  }

  // ==================== 系统桌面通知测试 ====================
  /** 触发系统通知测试 (根据权限与配置选择桌面/站内通知) */
  const testSystemNotification = () => {
    if (Notification.permission === 'denied') {
      ElMessage.warning(t('alerts.notificationDenied'))
      return
    }

    if (systemConfigForm.desktopEnabled && Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          sendTestDesktopNotification()
        } else {
          ElMessage.warning(t('alerts.desktopNotificationDenied'))
          sendTestInAppNotification()
        }
      })
    } else if (
      systemConfigForm.desktopEnabled &&
      Notification.permission === 'granted'
    ) {
      sendTestDesktopNotification()
    } else {
      sendTestInAppNotification()
    }
  }

  /** 发送测试桌面通知并附带站内通知 */
  const sendTestDesktopNotification = () => {
    new Notification(t('alerts.testNotificationTitle'), {
      body: t('alerts.testNotificationBody'),
      icon: '/favicon.ico',
      tag: 'xagent-test-notification',
    })
    sendTestInAppNotification()
  }

  /** 发送站内测试通知 */
  const sendTestInAppNotification = () => {
    ElMessage.success({
      message: t('alerts.testNotificationSuccess'),
      duration: 5000,
    })
  }

  return {
    // 系统通知配置
    systemConfigDialogVisible,
    systemConfigForm,
    // 邮件配置
    emailConfigDialogVisible,
    emailConfigForm,
    // Webhook 配置
    webhookConfigDialogVisible,
    webhookConfigForm,
    // 渠道操作
    handleToggleChannel,
    handleConfigureChannel,
    handleSaveSystemConfig,
    handleSaveEmailConfig,
    handleSaveWebhookConfig,
    handleTestChannel,
  }
}
