<template>
  <div
    class="channel-card"
    :class="{ disabled: !channel.enabled }"
  >
    <!-- 头部: 图标 + 名称 + 类型标签 + 启用开关 -->
    <div class="channel-header">
      <div class="channel-icon" :class="channel.type">
        {{ channelIcon }}
      </div>
      <div class="channel-info">
        <div class="channel-name">{{ channel.name }}</div>
        <el-tag size="small" effect="plain" round>{{ channelTypeLabel }}</el-tag>
      </div>
      <el-switch
        v-if="canUpdate"
        :model-value="channel.enabled"
        :active-color="'rgba(102, 102, 255, 1)'"
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
        <span class="value">{{ truncateUrl(channel.config.url) }}</span>
      </div>

      <!-- 系统通知 -->
      <template v-if="channel.type === 'system'">
        <div class="config-item">
          <span class="label">{{ t('alerts.retentionDays') }}:</span>
          <span class="value">{{ channel.config.retentionDays }} {{ t('alerts.days') }}</span>
        </div>
        <div class="config-item">
          <span class="label">{{ t('alerts.notificationLevels') }}:</span>
          <span class="value">{{ systemNotifyLevelLabels }}</span>
        </div>
        <div class="config-item">
          <span class="label">{{ t('alerts.desktopNotification') }}:</span>
          <span class="value" :class="{ enabled: channel.config.desktopEnabled }">
            {{ channel.config.desktopEnabled ? t('alerts.enabled') : t('alerts.disabled') }}
          </span>
        </div>
        <div class="config-item">
          <span class="label">{{ t('alerts.sound') }}:</span>
          <span class="value" :class="{ enabled: channel.config.soundEnabled }">
            {{ channel.config.soundEnabled ? t('alerts.enabled') : t('alerts.disabled') }}
          </span>
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
        <el-icon class="btn-icon"><Setting /></el-icon>
        {{ t('alerts.configure') }}
      </el-button>
      <el-button
        v-if="canUpdate"
        type="success"
        link
        size="small"
        @click="emit('test', channel.id)"
      >
        <el-icon class="btn-icon"><Promotion /></el-icon>
        {{ t('common.test') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Setting, Promotion } from '@element-plus/icons-vue'
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

/** 截断长 URL */
const truncateUrl = (url: string) => {
  if (!url) return ''
  return url.length > 40 ? url.slice(0, 37) + '...' : url
}
</script>

<style scoped>
.channel-card {
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-base);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.2s ease;
}

.channel-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-hover);
}

.channel-card.disabled {
  opacity: 0.65;
}

/* ========== 头部 ========== */
.channel-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.channel-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.channel-icon.email {
  background: var(--color-primary-light);
}

.channel-icon.webhook {
  background: var(--color-success-light);
}

.channel-icon.system {
  background: var(--color-warning-light);
}

.channel-info {
  flex: 1;
  min-width: 0;
}

.channel-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

/* ========== 配置区 ========== */
.channel-config {
  background: var(--bg-card-s);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.config-item {
  display: flex;
  gap: 8px;
  font-size: 13px;
  line-height: 1.5;
}

.config-item .label {
  color: var(--text-secondary);
  min-width: 80px;
  flex-shrink: 0;
}

.config-item .value {
  color: var(--text-primary);
  word-break: break-all;
}

.config-item .value.enabled {
  color: var(--color-success);
}

/* ========== 底部操作 ========== */
.channel-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
}

.btn-icon {
  margin-right: 4px;
}

.channel-footer .el-button:hover {
  background-color: transparent !important;
  border-color: transparent !important;
  color: inherit !important;
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .channel-card {
    padding: 14px;
  }

  .channel-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .config-item {
    font-size: 12px;
  }

  .config-item .label {
    min-width: 70px;
  }
}
</style>
