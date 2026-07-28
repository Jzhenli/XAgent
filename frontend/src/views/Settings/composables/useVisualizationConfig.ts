import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useSystemStore } from '@/stores/system'

export function useVisualizationConfig() {
  const { t } = useI18n()
  const systemStore = useSystemStore()

  function handleSaveVisualization() {
    ElMessage.success(t('settings.config_saved'))
  }

  return {
    systemStore,
    handleSaveVisualization,
  }
}