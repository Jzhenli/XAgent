<template>
  <el-card class="channel-card" shadow="hover">
    <!-- 头部: 图标 + 名称 + 类型标签 + 启用开关 -->
    <div class="channel-header">
      <div class="channel-icon">{{ channelIcon }}</div>
      <div class="channel-info">
        <div class="channel-name">{{ channel.name }}</div>
        <el-tag size="small">{{ channelTypeLabel }}</el-tag>
      </div>
      <el-switch
        v-if="canUpdate"
        :model-value="channel.enabled"
        @change="emit('toggle', channel.id)"
      />
    </div>

    <!-- 配置摘要 -->
    <div class="channel-config">
      <!-- 邮件 -->
      <div v-if="channel.type === 'email'" class="config-item">
        <span class="label">SMTP:</span>
        <span class="value">{{ channel.config.smtpHost }}:{{ channel.config.smtpPort }}</span>
      </div>

      <!-- Webhook -->
      <div v-if="channel.type === 'webhook'" class="config-item">
        <span class="label">URL:</span>
        <span class="value">{{ channel.config.url }}</span>
      </div>

      <!-- 系统通知 -->
      <template v-if="channel.type === 'system'">
        <div class="config-item">
          <span class="label">{{ t('alerts.retentionDays') }}:</span>
          <span class="value">{{ channel.config.retentionDays }} {{ t('alerts.days') }}</span>
        </div>
        <div class="config-item">
          <span class="label">{{ t('alerts.notificationLimit') }}:</span>
          <span class="value">{{ channel.config.maxNotifications }} {{ t('alerts.items') }}</span>
        </div>
        <div class="config-item">
          <span class="label">{{ t('alerts.notificationLevels') }}:</span>
          <span class="value">{{ systemNotifyLevelLabels }}</span>
        </div>
        <div class="config-item">
          <span class="label">{{ t('alerts.desktopNotification') }}:</span>
          <span class="value">{{ channel.config.desktopEnabled ? t('alerts.enabled') : t('alerts.disabled') }}</span>
        </div>
        <div class="config-item">
          <span class="label">{{ t('alerts.sound') }}:</span>
          <span class="value">{{ channel.config.soundEnabled ? t('alerts.enabled') : t('alerts.disabled') }}</span>
        </div>
        <div v-if="channel.config.quietHoursEnabled" class="config-item">
          <span class="label">{{ t('alerts.doNotDisturb') }}:</span>
          <span class="value">{{ channel.config.quietHoursStart }} - {{ channel.config.quietHoursEnd }}</span>
        </div>
      </template>
    </div>

    <!-- 操作按钮 -->
    <div class="channel-footer">
      <el-button
        v-if="canUpdate"
        type="primary"
        link
        size="small"
        @click="emit('configure', channel.id)"
      >
        {{ t('alerts.configure') }}
      </el-button>
      <el-button
        v-if="canUpdate"
        type="primary"
        link
        size="small"
        @click="emit('test', channel.id)"
      >
        {{ t('common.test') }}
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { NotificationChannel } from '@/stores/alerts'
import {
  CHANNEL_TYPE_ICONS,
  CHANNEL_TYPE_LABEL_KEYS,
  ALERT_LEVEL_LABEL_KEYS,
  type ChannelType,
  type AlertLevel,
} from '../types'

const props = defineProps<{
  /** 通知渠道数据 */
  channel: NotificationChannel
  /** 是否具备更新权限 */
  canUpdate: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'configure', id: string): void
  (e: 'test', id: string): void
}>()

const { t } = useI18n()

/** 渠道类型图标 */
const channelIcon = computed(
  () => CHANNEL_TYPE_ICONS[props.channel.type as ChannelType] ?? '🔔',
)

/** 渠道类型文案 */
const channelTypeLabel = computed(() => {
  const key = CHANNEL_TYPE_LABEL_KEYS[props.channel.type as ChannelType]
  return key ? t(key) : props.channel.type
})

/** 系统通知级别文案列表 (顿号分隔) */
const systemNotifyLevelLabels = computed(() => {
  const levels: AlertLevel[] = props.channel.config.notifyLevels ?? []
  return levels.map((l) => t(ALERT_LEVEL_LABEL_KEYS[l] ?? '') || l).join('、')
})
</script>

<style scoped>
.channel-card {
  margin-bottom: 16px;
  height: 100%;
}

.channel-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.channel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.channel-icon {
  width: 40px;
  height: 40px;
  background: var(--bg-hover);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.channel-info {
  flex: 1;
}

.channel-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.channel-config {
  padding: 12px;
  background: var(--bg-hover);
  border-radius: 6px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.config-item {
  display: flex;
  gap: 8px;
  font-size: 13px;
}

.config-item .label {
  color: var(--text-secondary);
  min-width: 70px;
}

.config-item .value {
  color: var(--text-primary);
}

.channel-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--border-base);
}
</style>
