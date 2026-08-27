import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import yaml from 'js-yaml'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useDeviceStore } from '@/stores/devices'
import { usePointStore } from '@/stores/points'
import type { DeviceConfig } from '@/api/types'

export function useDeviceIO() {
  const { t } = useI18n()
  const deviceStore = useDeviceStore()
  const pointStore = usePointStore()

  const importFileRef = ref<HTMLInputElement | null>(null)

  const handleExportYaml = () => {
    const devices = deviceStore.devices.map(d => {
      const clean: Record<string, unknown> = {
        asset: d.asset,
        name: d.name,
        enabled: d.enabled
      }
      if (d.description) clean.description = d.description
      clean.plugin = d.plugin
      if (d.points && d.points.length > 0) {
        clean.points = d.points.map(p => {
          const pt: Record<string, unknown> = {
            name: p.name,
            data_type: p.data_type,
            enabled: p.enabled,
            config: p.config
          }
          if (p.description) pt.description = p.description
          if (p.unit) pt.unit = p.unit
          if (p.metadata && Object.keys(p.metadata).length > 0) pt.metadata = p.metadata
          if (p.tags && p.tags.length > 0) pt.tags = p.tags
          return pt
        })
      }
      if (d.tags && d.tags.length > 0) clean.tags = d.tags
      if (d.metadata && Object.keys(d.metadata).length > 0) clean.metadata = d.metadata
      return clean
    })

    const content = yaml.dump({ devices }, { 
      indent: 2, 
      lineWidth: 120,
      noRefs: true,
      sortKeys: false
    })
    const blob = new Blob([content], { type: 'text/yaml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `xplay-devices-${new Date().toISOString().slice(0, 10)}.yaml`
    a.click()
    URL.revokeObjectURL(url)
    ElMessage.success(t('devices.export.success', { count: devices.length }))
  }

  const handleImportYaml = () => {
    importFileRef.value?.click()
  }

  const handleImportFileChange = async (e: Event) => {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    input.value = ''

    try {
      const text = await file.text()
      const parsed = yaml.load(text) as { devices?: DeviceConfig[] }
      if (!parsed.devices || !Array.isArray(parsed.devices)) {
        ElMessage.error(t('devices.export.invalidYaml'))
        return
      }

      const devices = parsed.devices as DeviceConfig[]
      try {
        await ElMessageBox.confirm(
          t('devices.export.importConfirm', { count: devices.length }),
          t('devices.export.importConfirmTitle'),
          { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'info', customClass: 'x-message-box' }
        )
      } catch {
        return
      }

      const result = await deviceStore.batchCreate(devices)
      if (result.failed > 0) {
        ElMessage.warning(t('devices.export.importPartial', { success: result.succeeded, failed: result.failed }))
      } else {
        ElMessage.success(t('devices.export.importSuccess', { count: result.succeeded }))
      }
      await pointStore.fetchDevicesWithPoints()
    } catch (e: unknown) {
      ElMessage.error(t('devices.export.importFailed') + ': ' + (e instanceof Error ? e.message : t('common.unknownError')))
    }
  }

  return {
    importFileRef,
    handleExportYaml,
    handleImportYaml,
    handleImportFileChange
  }
}
