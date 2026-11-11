import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useSystemStore } from '@/stores/system'
import { settingsApi } from '@/api/settings'

const SETTINGS_KEY = 'visualization.polling_interval'
const AUTO_JUMP_PREVIEW_KEY = 'visualization.auto_jump_preview'
const LAST_PREVIEW_URL_KEY = 'visualization.last_preview_url'
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

      const autoJumpValue = await settingsApi.get<boolean>(AUTO_JUMP_PREVIEW_KEY)
      if (autoJumpValue !== null && typeof autoJumpValue === 'boolean') {
        systemStore.visualizationConfig.autoJumpPreview = autoJumpValue
      } else {
        systemStore.visualizationConfig.autoJumpPreview = false
      }

      const savedUrl = await settingsApi.get<string>(LAST_PREVIEW_URL_KEY)
      systemStore.visualizationConfig.lastPreviewUrl = savedUrl ?? ''
    } catch (err) {
      console.warn('Failed to load visualization config from backend:', err)
      systemStore.visualizationConfig.pollingInterval = DEFAULT_POLLING_INTERVAL
      systemStore.visualizationConfig.autoJumpPreview = false
      systemStore.visualizationConfig.lastPreviewUrl = ''
    }
  }

  /** 保存可视化配置到后端 */
  async function handleSaveVisualization() {
    configLoading.value = true
    try {
      await Promise.all([
        settingsApi.set(SETTINGS_KEY, systemStore.visualizationConfig.pollingInterval),
        settingsApi.set(AUTO_JUMP_PREVIEW_KEY, systemStore.visualizationConfig.autoJumpPreview),
        settingsApi.set(LAST_PREVIEW_URL_KEY, systemStore.visualizationConfig.lastPreviewUrl),
      ])
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
