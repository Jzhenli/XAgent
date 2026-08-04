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
        {{ t('common.refresh') }}
      </el-button>
      <el-button v-if="canDelete" type="danger" @click="emit('clearAll')">
        {{ t('alerts.clearResolved') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Search } from '@element-plus/icons-vue'
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
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar-search {
  width: 250px;
}

.toolbar-filter {
  width: 120px;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

@media (max-width: 1024px) {
  .toolbar-search {
    width: 200px;
  }

  .toolbar-filter {
    width: 110px;
  }
}

@media (max-width: 768px) {
  .toolbar-search {
    width: 100%;
  }

  .toolbar-filter {
    width: 100%;
  }
}
</style>
