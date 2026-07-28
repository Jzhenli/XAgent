import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { configApi, type SystemConfig } from '@/api/config'

const BYTES_PER_MB = 1024 * 1024
const MAX_LOG_SIZE_MB = 100
const MIN_LOG_SIZE_MB = 1

export function useGeneralConfig() {
  const { t } = useI18n()

  const systemConfig = ref<SystemConfig>({
    logging: {
      level: 'INFO',
      max_bytes: 10,
      backup_count: 5
    },
    storage: {
      retention_days: 30,
      cleanup_interval: 3600
    }
  })

  const configLoading = ref(false)

  function safeBytesToMB(bytes: number): number {
    const mb = Math.round(bytes / BYTES_PER_MB)
    return Math.max(MIN_LOG_SIZE_MB, Math.min(MAX_LOG_SIZE_MB, mb))
  }

  function safeMBToBytes(mb: number): number {
    const safeMB = Math.max(MIN_LOG_SIZE_MB, Math.min(MAX_LOG_SIZE_MB, mb))
    return safeMB * BYTES_PER_MB
  }

  async function loadSystemConfig() {
    try {
      configLoading.value = true
      const config = await configApi.getSystemConfig()
      systemConfig.value = {
        ...config,
        logging: {
          ...config.logging,
          max_bytes: safeBytesToMB(config.logging.max_bytes)
        }
      }
    } catch (e: any) {
      ElMessage.error(e.response?.data?.detail || t('settings.config_load_failed'))
    } finally {
      configLoading.value = false
    }
  }

  async function handleSave() {
    try {
      configLoading.value = true
      const configToSave = {
        ...systemConfig.value,
        logging: {
          ...systemConfig.value.logging,
          max_bytes: safeMBToBytes(systemConfig.value.logging.max_bytes)
        }
      }
      const result = await configApi.updateSystemConfig(configToSave)
      ElMessage.success(result.message)
      if (result.warnings && result.warnings.length > 0) {
        ElMessage.warning(result.warnings.join('\n'))
      }
    } catch (e: any) {
      const detail = e.response?.data?.detail
      if (detail?.errors && Array.isArray(detail.errors)) {
        const firstError = detail.errors[0]
        ElMessage.error({
          message: firstError,
          duration: 5000
        })
        if (detail.errors.length > 1) {
          console.error('配置验证失败:', detail.errors)
          ElMessage.warning({
            message: `共${detail.errors.length}个错误,请查看控制台`,
            duration: 3000
          })
        }
      } else if (detail?.message && detail.message.includes('重载失败')) {
        ElMessage.warning({
          message: t('settings.general.reload_failed_hint'),
          duration: 5000
        })
      } else if (detail?.message) {
        ElMessage.error({
          message: detail.message,
          duration: 5000
        })
      } else {
        ElMessage.error({
          message: t('settings.config_save_failed'),
          duration: 5000
        })
      }
    } finally {
      configLoading.value = false
    }
  }

  return {
    systemConfig,
    configLoading,
    loadSystemConfig,
    handleSave,
  }
}