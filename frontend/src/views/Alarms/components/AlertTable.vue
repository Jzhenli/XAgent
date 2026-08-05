<template>
  <div class="alert-table-wrapper">
    <el-table
      :data="alerts"
      style="width: 100%"
      stripe
      v-loading="loading"
      class="alert-table"
    >
      <template #empty>
        <div class="empty-alerts">
          <el-empty :description="t('alerts.noAlerts')">
            <template #image>
              <div class="empty-icon">📋</div>
            </template>
          </el-empty>
        </div>
      </template>

      <!-- 级别 -->
      <el-table-column :label="t('alerts.level')" width="100" align="center">
        <template #default="{ row }">
          <el-tag
            :type="getLevelTag(row.level)"
            effect="light"
            round
            class="level-tag"
          >
            {{ getLevelLabel(row.level) }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 规则名称 -->
      <el-table-column prop="ruleName" :label="t('alerts.alertRule')" width="160" show-overflow-tooltip />

      <!-- 告警消息 -->
      <el-table-column
        prop="message"
        :label="t('alerts.alertMessage')"
        show-overflow-tooltip
        min-width="200"
      />

      <!-- 状态 -->
      <el-table-column :label="t('alerts.status')" width="110" align="center">
        <template #default="{ row }">
          <el-tag
            :type="getStatusTag(row.status)"
            effect="plain"
            round
            class="status-tag"
          >
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 触发时间 -->
      <el-table-column prop="triggeredAt" :label="t('alerts.triggeredAt')" width="170" />

      <!-- 操作 -->
      <el-table-column :label="t('common.actions')" width="220" fixed="right" align="center">
        <template #default="{ row }">
          <div class="action-buttons">
            <el-button
              v-if="row.status === 'new' && canUpdate"
              type="primary"
              link
              size="small"
              @click="emit('acknowledge', row.id)"
            >
              {{ t('alerts.acknowledge') }}
            </el-button>
            <el-button
              v-if="row.status !== 'resolved' && row.status !== 'ignored' && canUpdate"
              type="success"
              link
              size="small"
              @click="emit('resolve', row.id)"
            >
              {{ t('alerts.resolve') }}
            </el-button>
            <el-button
              v-if="row.status === 'new' && canUpdate"
              type="warning"
              link
              size="small"
              @click="emit('ignore', row.id)"
            >
              {{ t('alerts.ignore') }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Alert } from '@/stores/alerts'
import {
  ALERT_LEVEL_LABEL_KEYS,
  ALERT_LEVEL_TAG_TYPES,
  ALERT_STATUS_LABEL_KEYS,
  ALERT_STATUS_TAG_TYPES,
  type AlertLevel,
  type AlertStatus,
} from '../types'

defineProps<{
  /** 过滤后的告警列表 */
  alerts: Alert[]
  /** 列表加载中 */
  loading: boolean
  /** 是否具备更新权限 */
  canUpdate: boolean
}>()

const emit = defineEmits<{
  (e: 'acknowledge', id: string): void
  (e: 'resolve', id: string): void
  (e: 'ignore', id: string): void
}>()

const { t } = useI18n()

/** 获取告警级别文案 */
const getLevelLabel = (level: AlertLevel) =>
  t(ALERT_LEVEL_LABEL_KEYS[level] ?? '') || level

/** 获取告警级别 el-tag 样式 */
const getLevelTag = (level: AlertLevel) => ALERT_LEVEL_TAG_TYPES[level] ?? 'info'

/** 获取告警状态文案 */
const getStatusLabel = (status: AlertStatus) =>
  t(ALERT_STATUS_LABEL_KEYS[status] ?? '') || status

/** 获取告警状态 el-tag 样式 */
const getStatusTag = (status: AlertStatus) =>
  ALERT_STATUS_TAG_TYPES[status] ?? 'info'
</script>

<style scoped>
.alert-table-wrapper {
  flex: 1;
  overflow: auto;
  border-radius: 12px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
}

.alert-table {
  width: 100%;
}

/* ========== 表格样式 ========== */
.alert-table :deep(.el-table__header-wrapper th) {
  background: var(--el-fill-color-light) !important;
  color: var(--el-text-color-regular);
  font-weight: 600;
  font-size: 13px;
}

.alert-table :deep(.el-table__body-wrapper) {
  background: var(--el-bg-color);
}

.alert-table :deep(.el-table__body td) {
  background: var(--el-bg-color);
}

.alert-table :deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background: var(--el-fill-color-blank);
}

/* 行 hover 效果 */
.alert-table :deep(.el-table__body tr:hover > td) {
  background: var(--el-color-primary-light-9) !important;
}

/* ========== 标签样式 ========== */
.level-tag,
.status-tag {
  font-weight: 500;
}

/* ========== 操作按钮 ========== */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.action-buttons .el-button {
  padding: 4px 8px;
  font-size: 13px;
}

/* ========== 空状态 ========== */
.empty-alerts {
  padding: 40px 0;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

/* ========== 响应式 ========== */
@media (max-width: 1024px) {
  .alert-table :deep(.el-table) {
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .action-buttons {
    flex-wrap: wrap;
  }

  .action-buttons .el-button {
    padding: 2px 4px;
    font-size: 12px;
  }
}
</style>
