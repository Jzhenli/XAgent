import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useSystemStore } from '@/stores/system'

export function useVisualizationConfig() {
  const { t } = useI18n()
  const systemStore = useSystemStore()
  const configLoading = ref(false)

  async function handleSaveVisualization() {
    configLoading.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      ElMessage.success(t('settings.config_saved'))
    } finally {
      configLoading.value = false
    }
  }

  return {
    systemStore,
    configLoading,
    handleSaveVisualization,
  }
}