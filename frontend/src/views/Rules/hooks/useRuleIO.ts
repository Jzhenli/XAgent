import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useRuleStore } from '@/stores/rules'
import type { Rule } from '@/types/rule'

export function useRuleIO() {
  const { t } = useI18n()
  const ruleStore = useRuleStore()
  const importing = ref(false)
  const exporting = ref(false)

  // ==================== 导出 ====================

  /** 导出选中的规则为 JSON 文件 */
  const handleExportRules = async (selectedRules: Rule[]) => {
    if (selectedRules.length === 0) {
      ElMessage.warning(t('rules.noRulesToExport'))
      return
    }

    exporting.value = true
    try {
      // 获取完整规则数据
      const exportedRules: any[] = []
      const failedIds: string[] = []

      for (const rule of selectedRules) {
        try {
          const fullRule = await ruleStore.getRule(rule.id)
          if (fullRule) {
            exportedRules.push(fullRule)
          } else {
            failedIds.push(rule.name || rule.id)
          }
        } catch {
          failedIds.push(rule.name || rule.id)
        }
      }

      if (exportedRules.length === 0) {
        ElMessage.error(t('rules.exportAllFailed'))
        return
      }

      if (failedIds.length > 0) {
        ElMessage.warning(
          t('rules.exportPartialFailed', { count: failedIds.length, items: failedIds.join(', ') })
        )
      }

      const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        rules: exportedRules
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `rules_export_${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(link)
      link.click()

      // 延迟释放：确保浏览器下载已启动
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, 1000)

      ElMessage.success(t('rules.exportSuccess', { count: exportedRules.length }))
    } catch (e: any) {
      const detail = e.response?.data?.detail
      const msg = detail
        ? (Array.isArray(detail) ? detail.map((d: any) => d.msg || d).join('; ') : String(detail))
        : (e.message || t('rules.exportFailed'))
      ElMessage.error(msg)
    } finally {
      exporting.value = false
    }
  }

  // ==================== 导入 ====================

  /** 触发文件选择并导入 JSON 规则文件 */
  const handleImportRules = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.style.display = 'none'

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) {
        cleanupInput(input)
        return
      }

      importing.value = true
      try {
        const text = await file.text()
        const importData = JSON.parse(text)

        if (!importData.rules || !Array.isArray(importData.rules)) {
          ElMessage.error(t('rules.invalidImportFile'))
          return
        }

        // 构建请求体（使用 crypto.randomUUID() 替代 Date.now() 避免碰撞）
        const createRequests = importData.rules.map((rule: any) => {
          const requestId = crypto.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
          return {
            id: requestId,
            name: rule.name || t('ruleEditor.defaultRuleName'),
            description: rule.description || '',
            graph: rule.graph || null,
            enabled: rule.enabled ?? false
          }
        })

        let successCount = 0
        let failCount = 0

        for (const request of createRequests) {
          try {
            await ruleStore.createRule(request)
            successCount++
          } catch {
            failCount++
          }
        }

        if (successCount > 0) {
          ElMessage.success(
            t('rules.importSuccess', { success: successCount, total: createRequests.length })
          )
        }
        if (failCount > 0) {
          ElMessage.warning(
            t('rules.importPartialFailed', { fail: failCount })
          )
        }

        // 刷新规则列表
        await ruleStore.fetchRules()
      } catch (e: any) {
        if (e instanceof SyntaxError) {
          ElMessage.error(t('rules.invalidJsonFile'))
        } else {
          const detail = e.response?.data?.detail
          const msg = detail
            ? (Array.isArray(detail) ? detail.map((d: any) => d.msg || d).join('; ') : String(detail))
            : (e.message || t('rules.importFailed'))
          ElMessage.error(msg)
        }
      } finally {
        importing.value = false
        cleanupInput(input)
      }
    }

    document.body.appendChild(input)
    input.click()
  }

  /** 清理文件输入 DOM 元素 */
  const cleanupInput = (input: HTMLInputElement) => {
    input.onchange = null
    if (input.parentNode) {
      input.parentNode.removeChild(input)
    }
  }

  return {
    importing,
    exporting,
    handleExportRules,
    handleImportRules
  }
}