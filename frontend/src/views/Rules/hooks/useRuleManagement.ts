import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRuleStore } from '@/stores/rules'
import type { Rule } from '@/types/rule'

/**
 * 规则管理 Hook
 * 封装规则 CRUD、编辑器状态、刷新等业务逻辑
 */
export function useRuleManagement() {
  const { t } = useI18n()
  const ruleStore = useRuleStore()

  // ==================== 编辑器状态 ====================
  const showEditor = ref(false)
  const currentRuleId = ref<string | null>(null)

  /** 打开编辑器（新建或编辑） */
  const openEditor = (ruleId?: string) => {
    currentRuleId.value = ruleId ?? null
    showEditor.value = true
  }

  /** 关闭编辑器并重置状态 */
  const closeEditor = () => {
    showEditor.value = false
    currentRuleId.value = null
  }

  // ==================== 规则 CRUD ====================

  /** 启用/禁用规则切换 */
  const handleToggleRule = async (id: string) => {
    try {
      await ruleStore.toggleRule(id)

      const rule = ruleStore.rules.find((r) => r.id === id)
      if (rule) {
        ElMessage.success(
          rule.enabled ? t('rules.ruleEnabled') : t('rules.ruleDisabled')
        )
      } else {
        // 规则可能已被删除
        ElMessage.warning(t('rules.ruleNotFound'))
      }
    } catch (e: any) {
      const detail = e.response?.data?.detail
      const msg = detail
        ? (Array.isArray(detail) ? detail.map((d: any) => d.msg || d).join('; ') : String(detail))
        : (e.message || t('rules.operationFailed'))
      ElMessage.error(msg)
    }
  }

  /** 复制规则 */
  const handleCopyRule = async (ruleId: string) => {
    try {
      const response = await ruleStore.copyRule(ruleId)
      if (response?.success) {
        ElMessage.success(t('rules.ruleCopied'))
      }
    } catch (e: any) {
      const detail = e.response?.data?.detail
      const msg = detail
        ? (Array.isArray(detail) ? detail.map((d: any) => d.msg || d).join('; ') : String(detail))
        : (e.message || t('rules.copyFailed'))
      ElMessage.error(msg)
    }
  }

  /** 删除规则（含确认弹窗） */
  const handleDeleteRule = async (id: string, name?: string) => {
    try {
      await ElMessageBox.confirm(
        t('rules.deleteConfirm', { name: name || '' }),
        t('common.confirmDelete'),
        {
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
          type: 'warning',
          customClass: 'x-message-box'
        }
      )
    } catch {
      // 用户取消操作
      return
    }

    try {
      await ruleStore.deleteRule(id)
      ElMessage.success(t('rules.ruleDeleted'))
    } catch (e: any) {
      const detail = e.response?.data?.detail
      const msg = detail
        ? (Array.isArray(detail) ? detail.map((d: any) => d.msg || d).join('; ') : String(detail))
        : (e.message || t('rules.deleteFailed'))
      ElMessage.error(msg)
    }
  }

  // ==================== 数据刷新 ====================

  /** 刷新规则列表 */
  const handleRefresh = async () => {
    try {
      await ruleStore.fetchRules()
      ElMessage.success(t('rules.listRefreshed'))
    } catch (e: any) {
      const detail = e.response?.data?.detail
      const msg = detail
        ? (Array.isArray(detail) ? detail.map((d: any) => d.msg || d).join('; ') : String(detail))
        : (e.message || t('rules.refreshFailed'))
      ElMessage.error(msg)
    }
  }

  /** 编辑器保存成功后刷新列表并关闭编辑器 */
  const handleEditorSaved = () => {
    ruleStore.fetchRules().catch(() => {
      // 静默处理，刷新失败不影响编辑器关闭
    })
    closeEditor()
  }

  return {
    showEditor,
    currentRuleId,
    openEditor,
    closeEditor,
    handleToggleRule,
    handleCopyRule,
    handleDeleteRule,
    handleRefresh,
    handleEditorSaved
  }
}