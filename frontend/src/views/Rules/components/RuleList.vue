<template>
  <div class="rule-list-wrapper">
    <!-- 加载中 (首次加载且无数据) -->
    <div v-if="loading && rules.length === 0" class="state-block">
      <el-icon class="is-loading" :size="24"><Loading /></el-icon>
      <span>{{ t("rules.loadingMessage") }}</span>
    </div>

    <!-- 规则列表（含刷新指示器和错误横幅） -->
    <template v-else>
      <!-- 错误横幅（不覆盖已有数据） -->
      <div v-if="error" class="status-banner error-banner">
        <span>{{ error }}</span>
        <el-button size="small" text @click="emit('retry')">
          {{ t("common.retry") }}
        </el-button>
      </div>

      <!-- 空状态 (区分有筛选条件) -->
      <div v-if="rules.length === 0 && !loading" class="state-block">
        <span>
          {{ hasFilter ? t("rules.noMatchingRules") : t("rules.emptyMessage") }}
        </span>
      </div>

      <!-- 规则卡片列表 -->
      <div v-if="rules.length > 0" class="rules-list">
        <RuleCard
          v-for="rule in rules"
          :key="rule.id"
          :rule="rule"
          :can-create="canCreate"
          :can-update="canUpdate"
          :can-delete="canDelete"
          @toggle="emit('toggle', $event)"
          @edit="emit('edit', $event)"
          @copy="emit('copy', $event)"
          @delete="(id: string, name: string) => emit('delete', id, name)"
        />
      </div>

      <!-- 刷新中遮罩（居中显示在 wrapper 中心） -->
      <div v-if="loading" class="loading-overlay">
        <el-icon class="is-loading" :size="28"><Loading /></el-icon>
        <span>{{ t("rules.refreshing") }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { Loading } from "@element-plus/icons-vue";
import type { RuleViewItem } from "@/stores/rules";
import RuleCard from "./RuleCard.vue";

defineProps<{
  /** 过滤后的规则列表 */
  rules: RuleViewItem[];
  /** 列表加载中 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 是否存在筛选条件 (用于区分空状态文案) */
  hasFilter: boolean;
  /** 是否具备创建权限 */
  canCreate: boolean;
  /** 是否具备更新权限 */
  canUpdate: boolean;
  /** 是否具备删除权限 */
  canDelete: boolean;
}>();

const emit = defineEmits<{
  (e: "retry"): void;
  (e: "toggle", id: string): void;
  (e: "edit", id: string): void;
  (e: "copy", id: string): void;
  (e: "delete", id: string, name: string): void;
}>();

const { t } = useI18n();
</script>

<style scoped>
.rule-list-wrapper {
  position: relative;
  flex: 1;
  min-height: 0;
  background: var(--bg-card);
  border-radius: 16px;
  padding: 16px;
  overflow-y: auto;
}

.state-block {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px;
  color: var(--rule-loading-color);
  font-size: 14px;
}

.status-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  margin-bottom: 12px;
  border-radius: 6px;
  font-size: 13px;
}

.error-banner {
  background: var(--color-danger-light, #fef2f2);
  color: var(--color-danger, #dc2626);
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: var(--bg-card);
  opacity: 0.85;
  border-radius: 16px;
  color: var(--color-info);
  font-size: 14px;
  z-index: 1;
}
</style>
