<template>
  <el-table :data="alerts" style="width: 100%" stripe v-loading="loading">
    <template #empty>
      <div class="empty-alerts">
        <el-empty :description="t('alerts.noAlerts')" />
      </div>
    </template>

    <!-- 级别 -->
    <el-table-column :label="t('alerts.level')" width="100">
      <template #default="{ row }">
        <el-tag :type="getLevelTag(row.level)" size="small">
          {{ getLevelLabel(row.level) }}
        </el-tag>
      </template>
    </el-table-column>

    <!-- 规则名称 -->
    <el-table-column prop="ruleName" :label="t('alerts.alertRule')" width="150" />

    <!-- 告警消息 -->
    <el-table-column
      prop="message"
      :label="t('alerts.alertMessage')"
      show-overflow-tooltip
    />

    <!-- 状态 -->
    <el-table-column :label="t('alerts.status')" width="100">
      <template #default="{ row }">
        <el-tag :type="getStatusTag(row.status)" size="small">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
    </el-table-column>

    <!-- 触发时间 -->
    <el-table-column prop="triggeredAt" :label="t('alerts.triggeredAt')" width="160" />

    <!-- 操作 -->
    <el-table-column :label="t('common.actions')" width="200" fixed="right">
      <template #default="{ row }">
        <el-button
          v-if="row.status === 'new' && canUpdate"
          type="primary"
          size="small"
          link
          @click="emit('acknowledge', row.id)"
        >
          {{ t('alerts.acknowledge') }}
        </el-button>
        <el-button
          v-if="row.status !== 'resolved' && row.status !== 'ignored' && canUpdate"
          type="success"
          size="small"
          link
          @click="emit('resolve', row.id)"
        >
          {{ t('alerts.resolve') }}
        </el-button>
        <el-button
          v-if="row.status === 'new' && canUpdate"
          type="warning"
          size="small"
          link
          @click="emit('ignore', row.id)"
        >
          {{ t('alerts.ignore') }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
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
.empty-alerts {
  padding: 24px;
}
</style>
