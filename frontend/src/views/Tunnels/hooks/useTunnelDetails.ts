import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useChannelStore } from '@/stores/channels'

export function useTunnelDetails() {
  const { t } = useI18n()
  const channelStore = useChannelStore()

  const selectedChannelId = ref<string | null>(null)
  const activeTab = ref('channels')

  /**
   * 当前选中的通道完整配置
   */
  const selectedChannel = computed(() => {
    if (!selectedChannelId.value) return null
    return channelStore.getChannelById(selectedChannelId.value)
  })

  /**
   * 查看通道详情
   */
  const handleViewDetails = (id: string) => {
    selectedChannelId.value = id
    activeTab.value = 'details'
  }

  /**
   * 返回通道列表（紧凑模式）
   */
  const handleBackToList = () => {
    activeTab.value = 'channels'
  }

  /**
   * 测试通道连接
   */
  const handleTestConnection = async (id: string) => {
    try {
      ElMessage.info(t('channels.testingConnection'))
      const result = await channelStore.testConnection(id)
      if (result.success) {
        ElMessage.success(t('channels.connectionSuccess', { latency: result.latency }))
      } else {
        ElMessage.error(t('channels.connectionFailed', { message: result.message }))
      }
    } catch (e: unknown) {
      ElMessage.error(t('channels.testFailed', { message: e instanceof Error ? e.message : t('common.unknownError') }))
    }
  }

  /**
   * 重启通道
   */
  const handleRestartChannel = async (id: string) => {
    try {
      await channelStore.restartChannel(id)
      ElMessage.success(t('channels.channelRestarted'))
    } catch (e: unknown) {
      ElMessage.error(t('channels.restartFailed', { message: e instanceof Error ? e.message : t('common.unknownError') }))
    }
  }

  /**
   * 格式化数字（添加千分位，大数转 k）
   */
  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toLocaleString()
  }

  return {
    selectedChannelId,
    activeTab,
    selectedChannel,
    handleViewDetails,
    handleBackToList,
    handleTestConnection,
    handleRestartChannel,
    formatNumber
  }
}
