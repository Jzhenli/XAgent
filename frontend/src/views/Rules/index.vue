<template>
  <div class="rules-page">
    <!-- 顶部工具栏：搜索、类型筛选、新建/导入/导出/刷新 -->
    <RuleToolbar
      :search-query="searchQuery"
      :type-filter="typeFilter"
      :loading="ruleStore.loading"
      :can-create="canCreate"
      @update:search-query="searchQuery = $event"
      @update:type-filter="typeFilter = $event"
      @create="openEditor()"
      @import="handleImportRules"
      @export="handleExportRules(filteredRules)"
      @refresh="handleRefresh"
    />

    <!-- 规则列表 (含加载/错误/空状态) -->
    <RuleList
      :rules="filteredRules"
      :loading="ruleStore.loading"
      :error="ruleStore.error"
      :has-filter="hasFilter"
      :can-create="canCreate"
      :can-update="canUpdate"
      :can-delete="canDelete"
      @retry="ruleStore.fetchRules()"
      @toggle="handleToggleRule"
      @edit="openEditor"
      @copy="handleCopyRule"
      @delete="handleDeleteRule"
    />

    <!-- 规则编辑器抽屉 -->
    <el-drawer
      v-model="showEditor"
      :title="currentRuleId ? t('rules.editRule') : t('rules.newRule')"
      direction="rtl"
      size="80%"
      :with-header="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="false"
      :teleported="false"
      class="rule-editor-drawer"
      @closed="handleDrawerClosed"
    >
      <RuleEditorCanvas
        :key="editorKey"
        :rule-id="currentRuleId"
        @close="closeEditor"
        @saved="handleEditorSaved"
      />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRuleStore } from '@/stores/rules'
import { useUserStore } from '@/stores/users'
import RuleEditorCanvas from './editor/RuleEditorCanvas.vue'
import RuleToolbar from './components/RuleToolbar.vue'
import RuleList from './components/RuleList.vue'
import { useRuleManagement } from './hooks/useRuleManagement'
import { useRuleIO } from './hooks/useRuleIO'

const { t } = useI18n()
const ruleStore = useRuleStore()
const userStore = useUserStore()

// ==================== 工具栏筛选状态 ====================
const searchQuery = ref('')
const typeFilter = ref('')

// ==================== 权限控制 ====================
const canCreate = computed(() => userStore.hasPermission('rules', 'create'))
const canUpdate = computed(() => userStore.hasPermission('rules', 'update'))
const canDelete = computed(() => userStore.hasPermission('rules', 'delete'))

/** 是否存在筛选条件 (用于区分空状态文案) */
const hasFilter = computed(() => !!(searchQuery.value || typeFilter.value))

/**
 * 过滤后的规则列表
 * 依次应用名称/描述搜索与类型筛选
 */
const filteredRules = computed(() => {
  let rules = [...ruleStore.rules]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    rules = rules.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query),
    )
  }

  if (typeFilter.value) {
    rules = rules.filter((r) => r.type === typeFilter.value)
  }

  return rules
})

// ==================== 业务逻辑 Hooks ====================
const {
  showEditor,
  currentRuleId,
  editorKey,
  openEditor,
  closeEditor,
  handleDrawerClosed,
  handleEditorSaved,
  handleToggleRule,
  handleCopyRule,
  handleDeleteRule,
  handleRefresh,
} = useRuleManagement()

const { handleExportRules, handleImportRules } = useRuleIO()

// ==================== 初始化 ====================
onMounted(() => {
  ruleStore.fetchRules().catch((e: any) => {
    console.error('Failed to fetch rules on mount:', e)
  })
})
</script>

<style>
@import './components/DialogCommon.css';
</style>

<style scoped>
.rules-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  gap: 12px;
}

:deep(.rule-editor-drawer .el-drawer) {
  background: var(--re-canvas-bg) !important;
  box-shadow: var(--re-shadow-glow) !important;
}

:deep(.rule-editor-drawer .el-drawer__header) {
  background: var(--re-toolbar-bg) !important;
  backdrop-filter: var(--re-panel-blur);
  -webkit-backdrop-filter: var(--re-panel-blur);
  border-bottom: 1px solid var(--re-panel-border) !important;
  color: var(--text-primary) !important;
  font-weight: 700 !important;
  font-size: 16px !important;
  letter-spacing: 0.3px !important;
  padding: 16px 20px !important;
  margin-bottom: 0 !important;
  position: relative;
}

:deep(.rule-editor-drawer .el-drawer__header::before) {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--re-accent), var(--re-accent-2), transparent);
  opacity: 0.5;
}

:deep(.rule-editor-drawer .el-drawer__body) {
  padding: 0 !important;
  overflow: hidden !important;
  background: var(--re-canvas-bg) !important;
}

:deep(.rule-editor-drawer .el-drawer__close-btn) {
  color: var(--text-primary) !important;
  background: transparent !important;
  border-radius: 8px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px !important;
  height: 32px !important;
}

:deep(.rule-editor-drawer .el-drawer__close-btn:hover) {
  color: var(--text-primary) !important;
  background: transparent !important;
}
</style>
