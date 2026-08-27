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
        class="scada-select toolbar-filter"
        popper-class="scada-select-dropdown"
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
      <div v-if="canCreate" class="toolbar-btn btn-primary" @click="emit('create')">
        <el-icon><Plus /></el-icon>
        {{ t("rules.createNew") }}
      </div>
      <div v-if="canCreate" class="toolbar-btn" @click="emit('import')">
        <el-icon><Upload /></el-icon>
        {{ t("common.import") }}
      </div>
      <div class="toolbar-btn" @click="emit('export')">
        <el-icon><Download /></el-icon>
        {{ t("common.export") }}
      </div>

      <Icon
        name="refresh"
        type="mono-line"
        :size="24"
        :color="{ normal: 'var(--el-text-color-primary)' }"
        @click="emit('refresh')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import {
  Plus,
  Upload,
  Download,
  Loading,
  Search,
} from "@element-plus/icons-vue";
import { Icon } from "@/icon/index";
import { RULE_TYPE_FILTER_OPTIONS } from "../types";

defineProps<{
  /** 搜索关键字 */
  searchQuery: string;
  /** 类型筛选值 */
  typeFilter: string;
  /** 列表加载中 */
  loading: boolean;
  /** 是否具备创建权限 */
  canCreate: boolean;
}>();

const emit = defineEmits<{
  (e: "update:searchQuery", value: string): void;
  (e: "update:typeFilter", value: string): void;
  (e: "create"): void;
  (e: "import"): void;
  (e: "export"): void;
  (e: "refresh"): void;
}>();

const { t } = useI18n();
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px;
  background: var(--bg-card);
  border-radius: 16px;
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

.toolbar-search :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border-bottom: 1px solid var(--el-border-color-dark) !important;
  border-radius: 0 !important;
}

.toolbar-filter {
  width: 140px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 15px;
  font-size: 14px;
  line-height: 1;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  color: var(--el-text-color-regular);
  background-color: var(--el-fill-color);
  transition: none;
  border: 1px solid var(--el-border-color);
}

.toolbar-btn.btn-primary {
  color: #fff;
  background-color: rgba(102, 102, 255, 1);
  border-color: rgba(102, 102, 255, 1);
}

.toolbar-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  background-color: var(--el-fill-color);
  border: 1px solid var(--el-border-color);
}

.toolbar-icon-btn.is-loading {
  cursor: not-allowed;
  opacity: 0.6;
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
