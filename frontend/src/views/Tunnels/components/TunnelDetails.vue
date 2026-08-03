<template>
  <div class="details-panel">
    <div v-if="!channel" class="empty-details">
      <el-icon :size="48"><Connection /></el-icon>
      <p>{{ isCompact ? t('channels.selectChannelFirst') : t('channels.selectChannelFromLeft') }}</p>
      <el-button v-if="isCompact" type="primary" @click="emit('back')">{{ t('channels.backToChannelList') }}</el-button>
    </div>

    <template v-else>
      <div class="panel-header">
        <div v-if="isCompact" class="panel-header-left">
          <el-button link @click="emit('back')">
            <el-icon><RefreshRight /></el-icon>
            {{ t('channels.backToChannels') }}
          </el-button>
        </div>
        <span class="panel-title">{{ channel.name }}</span>
        <div class="header-info">
          <span class="status-dot" :class="{ online: channel.status === 'online' }"></span>
          <span class="protocol-tag">{{ channel.protocol.toUpperCase() }}</span>
          <el-tag v-if="!isCompact" :type="channel.enabled ? 'success' : 'info'" size="small">
            {{ channel.enabled ? t('channels.enabled') : t('channels.disabled') }}
          </el-tag>
        </div>
        <div class="header-actions">
          <el-button v-if="canUpdate" type="primary" size="small" plain @click="emit('test', channel.id)">
            {{ t('channels.testConnection') }}
          </el-button>
          <el-button v-if="canUpdate" type="warning" size="small" plain @click="emit('restart', channel.id)">
            {{ t('channels.restart') }}
          </el-button>
        </div>
      </div>

      <div class="channel-details-content">
        <!-- 统计仪表盘 -->
        <div v-if="channel.statistics" class="stats-dashboard">
          <div class="stat-item">
            <div class="stat-icon upload-icon">↑</div>
            <div class="stat-content">
              <div class="stat-value">{{ channel.statistics.upload_rate }}</div>
              <div class="stat-label">{{ t('channels.itemsPerMin') }}</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon success-icon">✓</div>
            <div class="stat-content">
              <div class="stat-value">{{ channel.statistics.success_rate }}%</div>
              <div class="stat-label">{{ t('channels.successRate') }}</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon backlog-icon">⏳</div>
            <div class="stat-content">
              <div class="stat-value">{{ channel.statistics.backlog_count }}</div>
              <div class="stat-label">{{ t('channels.backlog') }}</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon total-icon">📊</div>
            <div class="stat-content">
              <div class="stat-value">{{ formatNumber(channel.statistics.total_uploaded) }}</div>
              <div class="stat-label">{{ t('channels.totalUploaded') }}</div>
            </div>
          </div>
        </div>

        <!-- 连接配置 -->
        <div class="config-section">
          <div class="section-title">{{ t('channels.connectionConfig') }}</div>
          <div class="config-grid">
            <div class="config-item">
              <span class="config-label">{{ t('channels.channelId') }}</span>
              <span class="config-value">{{ channel.id }}</span>
            </div>
            <div class="config-item">
              <span class="config-label">{{ t('channels.name') }}</span>
              <span class="config-value">{{ channel.name }}</span>
            </div>
            <template v-if="channel.protocol === 'mqtt'">
              <div class="config-item">
                <span class="config-label">Broker</span>
                <span class="config-value">{{ channel.connection.broker }}:{{ channel.connection.port }}</span>
              </div>
              <div class="config-item">
                <span class="config-label">{{ t('channels.clientId') }}</span>
                <span class="config-value code">{{ channel.connection.client_id }}</span>
              </div>
              <div class="config-item">
                <span class="config-label">{{ t('channels.topic') }}</span>
                <span class="config-value code">{{ channel.connection.topic }}</span>
              </div>
              <div class="config-item">
                <span class="config-label">QoS</span>
                <span class="config-value">{{ channel.connection.qos }}</span>
              </div>
              <div class="config-item">
                <span class="config-label">{{ t('channels.keepalive') }}</span>
                <span class="config-value">{{ channel.connection.keepalive }}{{ t('channels.seconds') }}</span>
              </div>
              <div class="config-item">
                <span class="config-label">{{ t('channels.adapter') }}</span>
                <span class="config-value">
                  <el-tag v-if="channel.adapter.adapter" size="small" type="primary">{{ channel.adapter.adapter }}</el-tag>
                  <span v-else class="muted">{{ t('channels.standard') }}</span>
                </span>
              </div>
              <div v-if="channel.connection.username" class="config-item">
                <span class="config-label">{{ t('channels.username') }}</span>
                <span class="config-value">{{ channel.connection.username }}</span>
              </div>
            </template>
            <template v-if="channel.protocol === 'xnc'">
              <div class="config-item">
                <span class="config-label">{{ t('channels.localPort') }}</span>
                <span class="config-value">{{ channel.connection.local_port }}</span>
              </div>
              <div class="config-item">
                <span class="config-label">{{ t('channels.remoteHost') }}</span>
                <span class="config-value">{{ channel.connection.remote_host || '--' }}</span>
              </div>
              <div class="config-item">
                <span class="config-label">{{ t('channels.remotePort') }}</span>
                <span class="config-value">{{ channel.connection.remote_port || '--' }}</span>
              </div>
              <div class="config-item">
                <span class="config-label">{{ t('channels.reconnectInterval') }}</span>
                <span class="config-value">{{ channel.connection.reconnect_interval || 5 }}{{ t('channels.seconds') }}</span>
              </div>
            </template>
            <template v-if="channel.protocol === 'http'">
              <div class="config-item full-width">
                <span class="config-label">{{ t('channels.endpoint') }}</span>
                <span class="config-value code">{{ channel.connection.endpoint }}</span>
              </div>
              <div class="config-item">
                <span class="config-label">{{ t('channels.method') }}</span>
                <span class="config-value">{{ channel.connection.method }}</span>
              </div>
              <div class="config-item">
                <span class="config-label">{{ t('channels.timeout') }}</span>
                <span class="config-value">{{ channel.connection.timeout }}{{ t('channels.seconds') }}</span>
              </div>
            </template>
          </div>
          <div v-if="channel.protocol === 'mqtt' && channel.adapter.config && Object.keys(channel.adapter.config).length > 0" class="adapter-config">
            <div class="adapter-config-title">{{ t('channels.adapterConfig') }}</div>
            <pre class="json-config">{{ JSON.stringify(channel.adapter.config, null, 2) }}</pre>
          </div>
        </div>

        <!-- 上传策略 -->
        <el-collapse class="detail-collapse">
          <el-collapse-item :title="t('channels.uploadStrategy')">
            <div class="config-grid">
              <div class="config-item">
                <span class="config-label">{{ t('channels.immediateUpload') }}</span>
                <span class="config-value">
                  <el-tag :type="channel.upload_strategy.immediate_upload ? 'success' : 'info'" size="small">
                    {{ channel.upload_strategy.immediate_upload ? t('common.yes') : t('common.no') }}
                  </el-tag>
                </span>
              </div>
              <div class="config-item">
                <span class="config-label">{{ t('channels.batchSize') }}</span>
                <span class="config-value">{{ channel.upload_strategy.batch_size }} {{ t('channels.items') }}</span>
              </div>
              <div class="config-item">
                <span class="config-label">{{ t('channels.uploadInterval') }}</span>
                <span class="config-value">{{ channel.upload_strategy.interval }} {{ t('channels.seconds') }}</span>
              </div>
              <div class="config-item">
                <span class="config-label">{{ t('channels.retryTimes') }}</span>
                <span class="config-value">{{ channel.upload_strategy.retry_times }} {{ t('channels.times') }}</span>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item v-if="channel.description" :title="t('channels.description')">
            <p class="description-text">{{ channel.description }}</p>
          </el-collapse-item>
        </el-collapse>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/users'
import type { NorthChannelConfig } from '@/api/types'
import { Connection, RefreshRight } from '@element-plus/icons-vue'

const props = defineProps<{
  channel: NorthChannelConfig | null
  isCompact: boolean
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'test', id: string): void
  (e: 'restart', id: string): void
}>()

const { t } = useI18n()
const userStore = useUserStore()

const canUpdate = computed(() => userStore.hasPermission('devices', 'update'))

/**
 * 格式化数字（添加千分位，大数转 k）
 */
const formatNumber = (num?: number): string => {
  if (num === undefined || num === null) return '0'
  if (num >= 10000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toLocaleString()
}
</script>

<style scoped>
.details-panel {
  flex: 1;
  background: var(--bg-card);
  border-radius: 16px;
  box-shadow: var(--el-box-shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color-light);
  flex-shrink: 0;
  gap: 8px;
}

.panel-header-left {
  display: flex;
  align-items: center;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.header-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 12px;
}

.header-info .status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--el-color-danger);
  flex-shrink: 0;
}

.header-info .status-dot.online {
  background: var(--el-color-success);
}

.protocol-tag {
  padding: 2px 8px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.empty-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-secondary);
}

.empty-details p {
  margin-top: 16px;
  font-size: 14px;
}

.channel-details-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stats-dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stats-dashboard .stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
}

.stat-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.upload-icon {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.success-icon {
  background: var(--el-color-success-light-9);
  color: var(--el-color-success);
}

.backlog-icon {
  background: var(--el-color-warning-light-9);
  color: var(--el-color-warning);
}

.total-icon {
  background: var(--el-fill-color);
  color: var(--el-text-color-secondary);
}

.stat-content {
  flex: 1;
}

.stat-content .stat-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1.2;
}

.stat-content .stat-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 2px;
}

.config-section {
  background: var(--el-bg-color);
  border-radius: 8px;
  border: 1px solid var(--el-border-color);
  overflow: hidden;
}

.section-title {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  background: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color);
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: var(--el-border-color-light);
}

.config-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: var(--el-bg-color);
  min-height: 40px;
}

.config-item.full-width {
  grid-column: span 2;
}

.config-label {
  width: 80px;
  flex-shrink: 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.config-value {
  flex: 1;
  font-size: 13px;
  color: var(--el-text-color-primary);
  word-break: break-all;
}

.config-value.code {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  background: var(--el-fill-color-light);
  padding: 2px 6px;
  border-radius: 4px;
}

.config-value .muted {
  color: var(--el-text-color-secondary);
}

.adapter-config {
  border-top: 1px solid var(--el-border-color);
  padding: 12px 16px;
}

.adapter-config-title {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.json-config {
  margin: 0;
  padding: 12px;
  background: var(--code-bg, #1e1e1e);
  color: var(--el-text-color-primary);
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  border: 1px solid var(--el-border-color);
}

.detail-collapse {
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  overflow: hidden;
}

.detail-collapse :deep(.el-collapse-item__header) {
  background: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color);
  padding: 0 16px;
  height: 42px;
  line-height: 42px;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.detail-collapse :deep(.el-collapse-item__wrap) {
  border-bottom: none;
}

.detail-collapse :deep(.el-collapse-item__content) {
  padding: 0;
}

.description-text {
  margin: 0;
  padding: 16px;
  color: var(--el-text-color-primary);
  font-size: 13px;
  line-height: 1.6;
}

@media (max-width: 900px) {
  .stats-dashboard {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-content .stat-value {
    font-size: 18px;
  }

  .config-grid {
    grid-template-columns: 1fr;
  }

  .config-item.full-width {
    grid-column: span 1;
  }

  .header-info {
    display: none;
  }
}
</style>
