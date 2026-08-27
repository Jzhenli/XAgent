import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import yaml from 'js-yaml'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useChannelStore } from '@/stores/channels'
import { channelApi } from '@/api/channels'
import type { NorthChannelConfig } from '@/api/types'

/** ElMessageBox 取消操作的标记值 */
const EL_MESSAGEBOX_CANCEL = 'cancel'

export function useTunnelIO() {
  const { t } = useI18n()
  const channelStore = useChannelStore()

  const importFileRef = ref<HTMLInputElement | null>(null)

  /**
   * 导出通道为 YAML
   */
  const handleExportYaml = async () => {
    try {
      const result = await channelApi.exportChannels()
      const channels = result.channels || []

      if (channels.length === 0) {
        ElMessage.warning(t('channels.noExportableChannels'))
        return
      }

      const content = yaml.dump({ channels }, {
        indent: 2,
        lineWidth: 120,
        noRefs: true,
        sortKeys: false
      })
      const blob = new Blob([content], { type: 'text/yaml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `xplay-channels-${new Date().toISOString().slice(0, 10)}.yaml`
      a.click()
      URL.revokeObjectURL(url)
      ElMessage.success(t('channels.exportSuccess', { count: channels.length }))
    } catch (e: unknown) {
      console.error('Export channels failed:', e)
      const errorMsg = e instanceof Error ? e.message : t('common.unknownError')
      ElMessage.error(t('channels.exportFailed', { message: errorMsg }))
    }
  }

  /**
   * 触发文件选择导入
   */
  const handleImportYaml = () => {
    importFileRef.value?.click()
  }

  /**
   * 处理导入文件变更
   */
  const handleImportFileChange = async (e: Event) => {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    input.value = ''

    try {
      const text = await file.text()
      const parsed = yaml.load(text) as { channels?: NorthChannelConfig[] }
      if (!parsed.channels || !Array.isArray(parsed.channels)) {
        ElMessage.error(t('channels.invalidYaml'))
        return
      }

      const channels = parsed.channels
      await ElMessageBox.confirm(
        t('channels.importConfirmMessage', { count: channels.length }),
        t('channels.importConfirmTitle'),
        {
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
          type: 'info',
          customClass: 'x-message-box'
        }
      )

      const result = await channelApi.importChannels({ channels: parsed.channels }, false)
      if (result.failed > 0) {
        ElMessage.warning(t('channels.importPartialSuccess', { success: result.succeeded, fail: result.failed }))
      } else {
        ElMessage.success(t('channels.importSuccess', { count: result.succeeded }))
      }
      await channelStore.fetchChannels()
    } catch (e: unknown) {
      if (e !== EL_MESSAGEBOX_CANCEL) {
        const errorMsg = e instanceof Error ? e.message : t('common.unknownError')
        ElMessage.error(t('channels.importFailed', { message: errorMsg }))
      }
    }
  }

  return {
    importFileRef,
    handleExportYaml,
    handleImportYaml,
    handleImportFileChange
  }
}
