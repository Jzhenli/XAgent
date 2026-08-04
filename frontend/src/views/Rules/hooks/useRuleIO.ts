import { useI18n } from 'vue-i18n'
import { useRuleStore } from '@/stores/rules'
import { ElMessage } from 'element-plus'
import type { RuleCreateRequest } from '@/api/types'

/** 缺失 ID 时生成随机规则 ID 的长度 */
const RANDOM_ID_LENGTH = 6

/**
 * 规则导入/导出 Hook
 *
 * 负责规则的 JSON 文件导出与导入。
 */
export function useRuleIO() {
  const { t } = useI18n()
  const ruleStore = useRuleStore()

  /**
   * 导出全部规则为 JSON 文件并触发下载
   */
  const handleExportRules = () => {
    const rules = ruleStore.rules
    if (rules.length === 0) {
      ElMessage.warning(t('rules.noExportableRules'))
      return
    }

    const json = JSON.stringify(rules, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `rules-export-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    ElMessage.success(t('rules.exportSuccess', { count: rules.length }))
  }

  /**
   * 将单条导入的规则映射为创建请求
   */
  const buildCreateRequest = (rule: Record<string, any>): RuleCreateRequest => ({
    id:
      rule.id ||
      `rule-${Date.now()}-${Math.random().toString(36).slice(2, 2 + RANDOM_ID_LENGTH)}`,
    name: rule.name || t('rules.importedRule'),
    description: rule.description,
    enabled: rule.enabled ?? false,
    plugin: rule.plugin || { name: 'threshold_rule', config: {} },
    data_subscriptions: rule.data_subscriptions,
    notification: rule.notification,
    pipeline_id: rule.pipeline_id,
    channel_ids: rule.channel_ids,
  })

  /**
   * 弹出文件选择框导入规则 JSON
   */
  const handleImportRules = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const importedRules = JSON.parse(text)

        if (!Array.isArray(importedRules)) {
          throw new Error(t('rules.invalidFormat'))
        }

        let successCount = 0
        let failCount = 0

        for (const rule of importedRules) {
          try {
            await ruleStore.createRule(buildCreateRequest(rule))
            successCount++
          } catch {
            failCount++
          }
        }

        if (successCount > 0) {
          ElMessage.success(
            failCount > 0
              ? t('rules.importPartialSuccess', {
                  success: successCount,
                  fail: failCount,
                })
              : t('rules.importSuccess', { count: successCount }),
          )
        } else {
          ElMessage.error(t('rules.importFailed'))
        }
      } catch (error) {
        ElMessage.error(
          t('rules.importError', { message: (error as Error).message }),
        )
      }
    }

    input.click()
  }

  return {
    handleExportRules,
    handleImportRules,
  }
}
