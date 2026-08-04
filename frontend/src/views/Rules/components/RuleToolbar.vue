<template>
  <div class="toolbar">
    <!-- 左侧：搜索框 + 类型过滤 -->
    <div class="toolbar-left">
      <el-input
        :model-value="searchQuery"
        :placeholder="t('rules.searchPlaceholder')"
        :prefix-icon="Search"
        clearable
        class="toolbar-search"
        @update:model-value="emit('update:searchQuery', $event ?? '')"
      />
      <el-select
        :model-value="typeFilter"
        :placeholder="t('rules.typeFilter')"
        clearable
        class="toolbar-filter"
        @update:model-value="emit('update:typeFilter', $event ?? '')"
      >
        <el-option
          v-for="opt in RULE_TYPE_FILTER_OPTIONS"
          :key="opt.value"
          :label="t(opt.labelKey)"
          :value="opt.value"
        />
      </el-select>
    </div>

    <!-- 右侧：操作按钮 -->
    <div class="toolbar-right">
      <el-button
        v-if="canCreate"
        type="primary"
        :icon="Plus"
        @click="emit('create')"
      >
        {{ t('rules.createNew') }}
      </el-button>
      <el-button
        v-if="canCreate"
        :icon="Upload"
        @click="emit('import')"
      >
        {{ t('common.import') }}
      </el-button>
      <el-button :icon="Download" @click="emit('export')">
        {{ t('common.export') }}
      </el-button>
      <el-button
        :icon="Refresh"
        circle
        :loading="loading"
        @click="emit('refresh')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Plus, Upload, Download, Refresh, Search } from '@element-plus/icons-vue'
import { RULE_TYPE_FILTER_OPTIONS } from '../types'

defineProps<{
  /** 搜索关键字 */
  searchQuery: string
  /** 类型筛选值 */
  typeFilter: string
  /** 列表加载中 */
  loading: boolean
  /** 是否具备创建权限 */
  canCreate: boolean
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void
  (e: 'update:typeFilter', value: string): void
  (e: 'create'): void
  (e: 'import'): void
  (e: 'export'): void
  (e: 'refresh'): void
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
  margin-bottom: 20px;
  padding: 16px;
  background: var(--settings-toolbar-bg);
  border-radius: 8px;
  box-shadow: var(--settings-toolbar-shadow);
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
  width: 140px;
}

.toolbar-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

@media (max-width: 1024px) {
  .toolbar-search {
    width: 200px;
  }

  .toolbar-filter {
    width: 120px;
  }
}

@media (max-width: 768px) {
  .toolbar {
    padding: 12px;
  }

  .toolbar-search {
    width: 100%;
  }

  .toolbar-filter {
    width: 100%;
  }
}
</style>
