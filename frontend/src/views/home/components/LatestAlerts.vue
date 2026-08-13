<template>
  <el-card class="info-card alert-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <span>{{ t('dashboard.latestAlerts') }}</span>
        <el-button type="primary" link size="small" @click="handleViewAll">
          {{ t('dashboard.viewAll') }}
        </el-button>
      </div>
    </template>
    <div class="alert-list">
      <div
        v-for="alert in alertStore.alerts.slice(0, 3)"
        :key="alert.id"
        class="alert-item"
        :class="alert.level"
      >
        <span class="alert-icon">
          {{ alert.level === 'critical' ? '🚨' : alert.level === 'warning' ? '⚠️' : '💡' }}
        </span>
        <div class="alert-content">
          <div class="alert-title">{{ alert.ruleName }}</div>
          <div class="alert-desc">{{ alert.message }}</div>
        </div>
        <span class="alert-time">{{ alert.triggeredAt.split(' ')[1] }}</span>
      </div>
      <el-empty v-if="alertStore.alerts.length === 0" :description="t('dashboard.noAlerts')" :image-size="60" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAlertStore } from '@/stores/alerts'
import { useI18n } from 'vue-i18n'

const alertStore = useAlertStore()
const router = useRouter()
const { t } = useI18n()

/** 跳转到告警列表页 */
function handleViewAll() {
  router.push('/alerts')
}
</script>

<style scoped>
.alert-card {
  display: flex;
  flex-direction: column;
}

.alert-card :deep(.el-card__header) {
  padding: 12px 20px;
  flex-shrink: 0;
  border-bottom: 0 !important;
}

.alert-card :deep(.el-card__body) {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.alert-list::-webkit-scrollbar {
  width: 6px;
}

.alert-list::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.alert-list::-webkit-scrollbar-track {
  background: transparent;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
  border-radius: 16px;
  background: var(--bg-card-s);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-light);
}

.alert-icon {
  font-size: 20px;
}

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.alert-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.alert-time {
  font-size: 12px;
  color: var(--text-tertiary, #94a3b8);
}
</style>