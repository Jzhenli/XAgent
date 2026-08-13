<template>
  <div class="toolbar">
    <!-- 左侧: 搜索框 + 级别/状态筛选 -->
    <div class="toolbar-left">
      <el-input
        :model-value="searchQuery"
        :placeholder="t('alerts.searchPlaceholder')"
        :prefix-icon="Search"
        clearable
        class="toolbar-search"
        @update:model-value="emit('update:searchQuery', $event ?? '')"
      />
      <el-select
        :model-value="levelFilter"
        :placeholder="t('alerts.levelFilter')"
        clearable
        class="toolbar-filter"
        @update:model-value="emit('update:levelFilter', ($event ?? '') as string)"
      >
        <el-option
          v-for="opt in ALERT_LEVEL_FILTER_OPTIONS"
          :key="opt.value"
          :label="t(opt.labelKey)"
          :value="opt.value"
        />
      </el-select>
      <el-select
        :model-value="statusFilter"
        :placeholder="t('alerts.statusFilter')"
        clearable
        class="toolbar-filter"
        @update:model-value="emit('update:statusFilter', ($event ?? '') as string)"
      >
        <el-option
          v-for="opt in ALERT_STATUS_FILTER_OPTIONS"
          :key="opt.value"
          :label="t(opt.labelKey)"
          :value="opt.value"
        />
      </el-select>
    </div>

    <!-- 右侧: 刷新 / 清除已解决 -->
    <div class="toolbar-right">
      <el-button :loading="loading" @click="emit('refresh')">
        <el-icon class="refresh-icon"><Refresh /></el-icon>
        {{ t('common.refresh') }}
      </el-button>
      <el-button
        v-if="canDelete"
        type="danger"
        plain
        @click="emit('clearAll')"
      >
        <el-icon><Delete /></el-icon>
        {{ t('alerts.clearResolved') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Search, Refresh, Delete } from '@element-plus/icons-vue'
import {
  ALERT_LEVEL_FILTER_OPTIONS,
  ALERT_STATUS_FILTER_OPTIONS,
} from '../types'

defineProps<{
  /** 搜索关键字 */
  searchQuery: string
  /** 级别筛选值 */
  levelFilter: string
  /** 状态筛选值 */
  statusFilter: string
  /** 列表加载中 */
  loading: boolean
  /** 是否具备删除权限 */
  canDelete: boolean
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void
  (e: 'update:levelFilter', value: string): void
  (e: 'update:statusFilter', value: string): void
  (e: 'refresh'): void
  (e: 'clearAll'): void
}>()

const { t } = useI18n()
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
  background: var(--el-bg-color);
  border-radius: 12px;
  border: 1px solid var(--el-border-color-light);
}

.toolbar-left {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.toolbar-search {
  width: 280px;
}

.toolbar-search :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border-bottom: 1px solid var(--el-border-color) !important;
  border-radius: 0 !important;
}

.toolbar-search :deep(.el-input__wrapper:hover),
.toolbar-search :deep(.el-input__wrapper.is-focus) {
  box-shadow: none !important;
  border-bottom: 1px solid var(--el-color-primary) !important;
}

.toolbar-filter {
  width: 140px;
}

.toolbar-filter :deep(.el-select__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border-bottom: 1px solid var(--el-border-color) !important;
  border-radius: 0 !important;
}

.toolbar-filter :deep(.el-select__wrapper:hover),
.toolbar-filter :deep(.el-select__wrapper.is-focused) {
  box-shadow: none !important;
  border-bottom: 1px solid var(--el-color-primary) !important;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.refresh-icon {
  margin-right: 4px;
}

.toolbar-right .el-button:hover {
  background-color: var(--el-button-bg-color) !important;
  border-color: var(--el-button-border-color) !important;
  color: var(--el-text-color-regular) !important;
}

.toolbar-right .el-button--danger:hover {
  background-color: rgba(245, 108, 108, 0.25) !important;
  border-color: rgba(245, 108, 108, 0.6) !important;
  color: var(--el-color-danger) !important;
}

.toolbar-right .el-button--danger.is-plain {
  background-color: rgba(245, 108, 108, 0.15) !important;
  border-color: rgba(245, 108, 108, 0.4) !important;
  color: var(--el-color-danger) !important;
}

.toolbar-right .el-button--danger.is-plain:hover {
  background-color: rgba(245, 108, 108, 0.25) !important;
  border-color: rgba(245, 108, 108, 0.6) !important;
  color: var(--el-color-danger) !important;
}

/* ========== 响应式 ========== */
@media (max-width: 1200px) {
  .toolbar-search {
    width: 220px;
  }
}

@media (max-width: 1024px) {
  .toolbar-search {
    width: 180px;
  }

  .toolbar-filter {
    width: 120px;
  }
}

@media (max-width: 768px) {
  .toolbar {
    padding: 10px 12px;
  }

  .toolbar-search {
    width: 100%;
    order: 1;
  }

  .toolbar-filter {
    width: 100%;
    order: 2;
  }

  .toolbar-right {
    order: 3;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
