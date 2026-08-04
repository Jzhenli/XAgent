<template>
  <!-- 加载中 (首次加载且无数据) -->
  <div v-if="loading && rules.length === 0" class="state-block">
    <el-icon class="is-loading" :size="24"><Loading /></el-icon>
    <span>{{ t('rules.loadingMessage') }}</span>
  </div>

  <!-- 错误状态 -->
  <div v-else-if="error" class="state-block">
    <span>{{ error }}</span>
    <el-button size="small" @click="emit('retry')">
      {{ t('common.retry') }}
    </el-button>
  </div>

  <!-- 空状态 (区分有筛选条件) -->
  <div v-else-if="rules.length === 0" class="state-block">
    <span>{{
      hasFilter ? t('rules.noMatchingRules') : t('rules.emptyMessage')
    }}</span>
  </div>

  <!-- 规则卡片列表 -->
  <div v-else class="rules-list">
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
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Loading } from '@element-plus/icons-vue'
import type { RuleViewItem } from '@/stores/rules'
import RuleCard from './RuleCard.vue'

defineProps<{
  /** 过滤后的规则列表 */
  rules: RuleViewItem[]
  /** 列表加载中 */
  loading: boolean
  /** 错误信息 */
  error: string | null
  /** 是否存在筛选条件 (用于区分空状态文案) */
  hasFilter: boolean
  /** 是否具备创建权限 */
  canCreate: boolean
  /** 是否具备更新权限 */
  canUpdate: boolean
  /** 是否具备删除权限 */
  canDelete: boolean
}>()

const emit = defineEmits<{
  (e: 'retry'): void
  (e: 'toggle', id: string): void
  (e: 'edit', id: string): void
  (e: 'copy', id: string): void
  (e: 'delete', id: string, name: string): void
}>()

const { t } = useI18n()
</script>

<style scoped>
.state-block {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px;
  color: var(--rule-loading-color);
  font-size: 14px;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
