<template>
  <el-card class="info-card" shadow="hover">
    <template #header>
      <div class="panel-title">
        <span>{{ t('dashboard.channelUploadStats') }}</span>
        <div class="status-indicator" :class="isTransmissionGood ? 'status-success' : 'status-warning'">
          <el-icon :size="14">
            <component :is="isTransmissionGood ? CircleCheck : Warning" />
          </el-icon>
          <span class="status-text">{{ isTransmissionGood ? t('dashboard.transmissionGood') : t('dashboard.needsAttention') }}</span>
        </div>
      </div>
    </template>
    <div class="channel-stats">
      <div class="channel-stat-item">
        <span class="stat-label">{{ t('dashboard.totalUploadRate') }}</span>
        <span class="stat-value">{{ channelStore.totalUploadRate }} {{ t('dashboard.itemsPerSecond') }}</span>
      </div>
      <div class="channel-stat-item">
        <span class="stat-label">{{ t('dashboard.averageSuccessRate') }}</span>
        <span class="stat-value">{{ channelStore.averageSuccessRate }}%</span>
      </div>
      <div class="channel-stat-item">
        <span class="stat-label">{{ t('dashboard.dataBacklog') }}</span>
        <span class="stat-value" :class="{ 'text-danger': channelStore.totalBacklog > 100 }">
          {{ channelStore.totalBacklog }} {{ t('dashboard.items') }}
        </span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChannelStore } from '@/stores/channels'
import { useI18n } from 'vue-i18n'
import { Warning, CircleCheck } from '@element-plus/icons-vue'

const channelStore = useChannelStore()
const { t } = useI18n()

const isTransmissionGood = computed(() => channelStore.averageSuccessRate > 95)
</script>

<style scoped>
.info-card {
  border-radius: 16px;
  height: 100%;
}

.info-card :deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 0 !important;
  position: relative;
}

.info-card :deep(.el-card__body) {
  padding: 0 20px;
}

.panel-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.channel-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.channel-stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
}


.channel-stat-item .stat-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.channel-stat-item .stat-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.text-danger {
  color: var(--color-danger) !important;
}

.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.25s ease;
}

.status-indicator.status-success {
  color: var(--color-success, rgba(59, 214, 149, 1));
}

.status-indicator.status-warning {
  color: var(--color-warning, #e6a23c);
}
</style>