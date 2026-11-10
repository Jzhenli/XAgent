import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useSystemStore } from '@/stores/system'
import { settingsApi } from '@/api/settings'

const SETTINGS_KEY = 'visualization.polling_interval'
const DEFAULT_POLLING_INTERVAL = 3000

export function useVisualizationConfig() {
  const { t } = useI18n()
  const systemStore = useSystemStore()
  const configLoading = ref(false)

  /** 从后端加载可视化配置，读不到则使用默认值 */
  async function loadVisualizationConfig() {
    try {
      const value = await settingsApi.get<number>(SETTINGS_KEY)
      if (value !== null && typeof value === 'number') {
        systemStore.visualizationConfig.pollingInterval = value
      } else {
        systemStore.visualizationConfig.pollingInterval = DEFAULT_POLLING_INTERVAL
      }
    } catch (err) {
      console.warn('Failed to load visualization config from backend:', err)
      systemStore.visualizationConfig.pollingInterval = DEFAULT_POLLING_INTERVAL
    }
  }

  /** 保存可视化配置到后端 */
  async function handleSaveVisualization() {
    configLoading.value = true
    try {
      await settingsApi.set(
        SETTINGS_KEY,
        systemStore.visualizationConfig.pollingInterval
      )
      ElMessage.success(t('settings.config_saved'))
    } catch (err) {
      ElMessage.error(t('settings.config_save_failed'))
    } finally {
      configLoading.value = false
    }
  }

  return {
    systemStore,
    configLoading,
    handleSaveVisualization,
    loadVisualizationConfig,
  }
}
