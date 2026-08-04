import { useI18n } from 'vue-i18n'
import { useAlertStore } from '@/stores/alerts'
import { ElMessage, ElMessageBox } from 'element-plus'

/**
 * 告警管理 Hook
 *
 * 封装告警记录的确认、解决、忽略以及批量清除已解决告警等操作。
 * 所有操作均带结果提示, 错误向上冒泡由各 handler 统一捕获。
 */
export function useAlertManagement() {
  const { t } = useI18n()
  const alertStore = useAlertStore()

  /** 确认告警 */
  const handleAcknowledge = async (id: string) => {
    try {
      await alertStore.acknowledgeAlert(id)
      ElMessage.success(t('alerts.acknowledgeSuccess'))
    } catch {
      ElMessage.error(t('common.operationFailed'))
    }
  }

  /** 解决告警 */
  const handleResolve = async (id: string) => {
    try {
      await alertStore.resolveAlert(id)
      ElMessage.success(t('alerts.resolveSuccess'))
    } catch {
      ElMessage.error(t('common.operationFailed'))
    }
  }

  /** 忽略告警 */
  const handleIgnore = async (id: string) => {
    try {
      await alertStore.ignoreAlert(id)
      ElMessage.success(t('alerts.ignoreSuccess'))
    } catch {
      ElMessage.error(t('common.operationFailed'))
    }
  }

  /** 清除所有已解决的告警 (带二次确认) */
  const handleClearAll = () => {
    ElMessageBox.confirm(
      t('alerts.clearAllConfirm'),
      t('alerts.clearConfirmTitle'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      },
    )
      .then(async () => {
        try {
          await alertStore.clearResolvedAlerts()
          ElMessage.success(t('alerts.clearSuccess'))
        } catch {
          ElMessage.error(t('alerts.clearFailed'))
        }
      })
      .catch(() => {})
  }

  return {
    handleAcknowledge,
    handleResolve,
    handleIgnore,
    handleClearAll,
  }
}
