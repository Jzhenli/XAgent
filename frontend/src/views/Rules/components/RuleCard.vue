<template>
  <el-card
    class="rule-card"
    shadow="hover"
    :class="{ disabled: !rule.enabled }"
  >
    <!-- 头部：状态图标 + 名称 + 类型标签 + 启用开关 -->
    <div class="rule-header">
      <div class="rule-status" :class="{ active: rule.enabled }">
        <el-icon v-if="rule.enabled"><CircleCheck /></el-icon>
        <el-icon v-else><CircleClose /></el-icon>
      </div>
      <div class="rule-title">
        <span class="rule-name">{{ rule.name }}</span>
        <el-tag :type="typeTag" size="small">{{ typeLabel }}</el-tag>
      </div>
      <el-switch
        v-if="canUpdate"
        :model-value="rule.enabled"
        size="small"
        @change="emit('toggle', rule.id)"
      />
    </div>

    <!-- 规则表达式 -->
    <div class="rule-expression">
      <code>{{ rule.expression || t('rules.noExpression') }}</code>
    </div>

    <!-- 执行统计信息 -->
    <div class="rule-meta">
      <span class="meta-item">
        <span class="meta-label">{{ t('rules.executionCount') }}:</span>
        <span class="meta-value"
          >{{ rule.executionCount ?? 0 }} {{ t('rules.times') }}</span
        >
      </span>
      <span class="meta-item">
        <span class="meta-label">{{ t('rules.lastTriggered') }}:</span>
        <span class="meta-value">{{
          rule.lastTriggered || t('rules.neverTriggered')
        }}</span>
      </span>
    </div>

    <!-- 操作按钮 -->
    <div class="rule-actions">
      <el-button
        v-if="canUpdate"
        type="primary"
        :icon="Edit"
        size="small"
        @click="emit('edit', rule.id)"
      >
        {{ t('rules.edit') }}
      </el-button>
      <el-button
        v-if="canCreate"
        :icon="CopyDocument"
        size="small"
        @click="emit('copy', rule.id)"
      >
        {{ t('rules.copy') }}
      </el-button>
      <el-button
        v-if="canUpdate"
        :type="rule.enabled ? 'warning' : 'success'"
        size="small"
        @click="emit('toggle', rule.id)"
      >
        {{ rule.enabled ? t('rules.disable') : t('rules.enable') }}
      </el-button>
      <el-button
        v-if="canDelete"
        type="danger"
        :icon="Delete"
        size="small"
        @click="emit('delete', rule.id, rule.name)"
      >
        {{ t('rules.delete') }}
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  CircleCheck,
  CircleClose,
  Edit,
  CopyDocument,
  Delete,
} from '@element-plus/icons-vue'
import type { RuleViewItem } from '@/stores/rules'
import {
  RULE_TYPE_LABEL_KEYS,
  RULE_TYPE_TAG_TYPES,
  type RuleType,
} from '../types'

const props = defineProps<{
  /** 规则数据 */
  rule: RuleViewItem
  /** 是否具备创建权限 */
  canCreate: boolean
  /** 是否具备更新权限 */
  canUpdate: boolean
  /** 是否具备删除权限 */
  canDelete: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'edit', id: string): void
  (e: 'copy', id: string): void
  (e: 'delete', id: string, name: string): void
}>()

const { t } = useI18n()

/** 规则类型标签文案 */
const typeLabel = computed(
  () => t(RULE_TYPE_LABEL_KEYS[props.rule.type as RuleType] ?? '') ||
    props.rule.type,
)

/** 规则类型对应的 el-tag 样式 */
const typeTag = computed(
  () => RULE_TYPE_TAG_TYPES[props.rule.type as RuleType] ?? 'info',
)
</script>

<style scoped>
.rule-card {
  transition: all 0.3s ease;
}

.rule-card:hover {
  transform: translateX(4px);
}

.rule-card.disabled {
  opacity: 0.6;
}

.rule-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.rule-status {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--rule-status-inactive-bg);
  color: var(--rule-status-inactive-color);
}

.rule-status.active {
  background: var(--rule-status-active-bg);
  color: var(--rule-status-active-color);
}

.rule-title {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.rule-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--rule-name-color);
}

.rule-expression {
  background: var(--rule-expression-bg);
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 12px;
}

.rule-expression code {
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  color: var(--rule-expression-color);
}

.rule-meta {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--rule-meta-border);
}

.meta-item {
  display: flex;
  gap: 6px;
  font-size: 13px;
}

.meta-label {
  color: var(--rule-meta-label-color);
}

.meta-value {
  color: var(--rule-meta-value-color);
  font-weight: 500;
}

.rule-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .rule-meta {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
