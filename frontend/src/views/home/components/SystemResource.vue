<!-- 系统资源监控：展示 CPU、内存、磁盘使用率仪表盘 -->

<template>
  <el-card class="info-card resource-panel" shadow="hover">
    <template #header>
      <div class="panel-title">
        <span>{{ t('dashboard.systemResource') }}</span>
        <div class="status-indicator" :class="isHighLoad ? 'status-danger' : 'status-success'">
          <el-icon :size="14">
            <component :is="isHighLoad ? Warning : CircleCheck" />
          </el-icon>
          <span class="status-text">{{ isHighLoad ? t('dashboard.highLoad') : t('dashboard.runningNormal') }}</span>
        </div>
      </div>
    </template>
    <div class="resource-gauges">
      <div class="gauge-item">
        <div class="gauge-chart">
          <el-progress
            type="dashboard"
            :percentage="systemStore.stats.cpuUsage"
            :color="getProgressColor(systemStore.stats.cpuUsage)"
            :width="120"
            :stroke-width="12"
          />
        </div>
        <div class="gauge-label">{{ t('dashboard.cpu') }}</div>
      </div>
      <div class="gauge-item">
        <div class="gauge-chart">
          <el-progress
            type="dashboard"
            :percentage="systemStore.stats.memoryUsage"
            :color="getProgressColor(systemStore.stats.memoryUsage)"
            :width="120"
            :stroke-width="12"
          />
        </div>
        <div class="gauge-label">{{ t('dashboard.memory') }}</div>
      </div>
      <div class="gauge-item">
        <div class="gauge-chart">
          <el-progress
            type="dashboard"
            :percentage="systemStore.stats.diskUsage"
            :color="getProgressColor(systemStore.stats.diskUsage)"
            :width="120"
            :stroke-width="12"
          />
        </div>
        <div class="gauge-label">{{ t('dashboard.disk') }}</div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSystemStore } from '@/stores/system'
import { useI18n } from 'vue-i18n'
import { Warning, CircleCheck } from '@element-plus/icons-vue'
import { getProgressColor } from '../utils/dashboardUtils'

const systemStore = useSystemStore()
const { t } = useI18n()

const isHighLoad = computed(() => systemStore.stats.cpuUsage > 80)
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
  padding: 20px;
}

.panel-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.resource-panel {
  height: auto;
}

.resource-gauges {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  padding: 10px 0;
}

.gauge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.gauge-chart {
  display: flex;
  align-items: center;
  justify-content: center;
}

.gauge-chart :deep(.el-progress-circle__track) {
  stroke: var(--gauge-track-bg);
}

.gauge-chart :deep(.el-progress-circle__path) {
  transition: stroke 0.3s ease;
}

.gauge-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  line-height: 20px;
}

.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.25s ease;
  font-weight: bold;
}

.status-indicator.status-success {
  color: var(--color-success, rgba(59, 214, 149, 1));
}

.status-indicator.status-danger {
  color: var(--color-danger, #f56c6c);
}
</style>