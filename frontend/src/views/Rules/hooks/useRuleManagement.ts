import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRuleStore } from '@/stores/rules'
import { ElMessage, ElMessageBox } from 'element-plus'

/**
 * 规则管理 Hook
 *
 * 封装规则的启用/禁用、复制、删除、刷新等 CRUD 操作，
 * 以及规则编辑器抽屉的开关与当前编辑规则 ID 的状态管理。
 */
export function useRuleManagement() {
  const { t } = useI18n()
  const ruleStore = useRuleStore()

  /** 编辑器抽屉是否可见 */
  const showEditor = ref(false)
  /** 当前编辑的规则 ID (为 null 时表示新建) */
  const currentRuleId = ref<string | null>(null)

  /**
   * 打开规则编辑器
   * @param ruleId 传入则编辑已有规则，否则新建规则
   */
  const openEditor = (ruleId?: string) => {
    currentRuleId.value = ruleId || null
    showEditor.value = true
  }

  /** 关闭规则编辑器 */
  const closeEditor = () => {
    showEditor.value = false
  }

  /** 编辑器保存成功后刷新规则列表 */
  const handleEditorSaved = () => {
    ruleStore.fetchRules()
  }

  /**
   * 切换规则启用状态
   */
  const handleToggleRule = async (id: string) => {
    try {
      await ruleStore.toggleRule(id)
      const rule = ruleStore.rules.find((r) => r.id === id)
      if (rule) {
        ElMessage.success(
          rule.enabled ? t('rules.ruleEnabled') : t('rules.ruleDisabled'),
        )
      }
    } catch {
      ElMessage.error(t('common.operationFailed'))
    }
  }

  /**
   * 复制规则 (生成 "(副本)" 并默认禁用)
   */
  const handleCopyRule = async (id: string) => {
    try {
      await ruleStore.copyRule(id)
      ElMessage.success(t('rules.ruleCopied'))
    } catch {
      ElMessage.error(t('rules.copyFailed'))
    }
  }

  /**
   * 删除规则 (带二次确认弹窗)
   */
  const handleDeleteRule = (id: string, name: string) => {
    ElMessageBox.confirm(
      t('rules.deleteConfirmMessage', { name }),
      t('rules.deleteConfirmTitle'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      },
    )
      .then(async () => {
        try {
          await ruleStore.deleteRule(id)
          ElMessage.success(t('rules.ruleDeleted'))
        } catch {
          ElMessage.error(t('rules.deleteFailed'))
        }
      })
      .catch(() => {})
  }

  /** 刷新规则列表 */
  const handleRefresh = async () => {
    await ruleStore.fetchRules()
    ElMessage.success(t('rules.refreshSuccess'))
  }

  return {
    showEditor,
    currentRuleId,
    openEditor,
    closeEditor,
    handleEditorSaved,
    handleToggleRule,
    handleCopyRule,
    handleDeleteRule,
    handleRefresh,
  }
}
