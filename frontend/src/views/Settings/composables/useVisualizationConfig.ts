import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useSystemStore } from '@/stores/system'

export function useVisualizationConfig() {
  const { t } = useI18n()
  const systemStore = useSystemStore()
  const configLoading = ref(false)

  /**
   * 保存可视化配置
   * 配置通过 Pinia persist 插件自动持久化到 sessionStorage，
   * 此处仅提供用户反馈；若后端提供了可视化配置 API，可在此处对接。
   */
  async function handleSaveVisualization() {
    configLoading.value = true
    try {
      // TODO: 对接后端 API 持久化可视化配置
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