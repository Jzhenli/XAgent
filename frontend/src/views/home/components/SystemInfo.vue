<!-- 系统运行信息：运行时长、采集总量、今日采集、数据质量 -->

<template>
  <el-card class="info-card" shadow="hover">
    <template #header>
      <div class="panel-title">
        <span>{{ t('dashboard.systemInfo') }}</span>
        <el-tag size="small" type="info">{{ t('dashboard.details') }}</el-tag>
      </div>
    </template>
    <div class="system-info">
      <div class="info-item">
        <span class="info-label">{{ t('dashboard.uptime') }}</span>
        <span class="info-value">{{ Math.floor(systemStore.stats.uptime / 3600) }} {{ t('dashboard.hours') }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{ t('dashboard.totalCollection') }}</span>
        <span class="info-value">{{ systemStore.stats.totalReadings.toLocaleString() }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{ t('dashboard.todayCollection') }}</span>
        <span class="info-value">{{ systemStore.stats.todayReadings.toLocaleString() }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{ t('dashboard.dataQuality') }}</span>
        <span class="info-value" :class="{ 'text-success': systemStore.dataQuality.qualityRate > 95 }">
          {{ systemStore.dataQuality.qualityRate }}%
        </span>
      </div>
    </div>
  </el-card>
</template>


<script setup lang="ts">
import { useSystemStore } from '@/stores/system'
import { useI18n } from 'vue-i18n'

const systemStore = useSystemStore()
const { t } = useI18n()
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
  padding: 0 20px !important;
}

.panel-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.system-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
}

.info-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.text-success {
  color: var(--color-success) !important;
}

@media (max-width: 1365px) {
  .info-card :deep(.el-card__header) {
    padding: 12px 16px;
  }

  .info-card :deep(.el-card__body) {
    padding: 16px;
  }

  .system-info {
    gap: 10px;
  }

  .info-item {
    padding: 8px 12px;
  }
}
</style>