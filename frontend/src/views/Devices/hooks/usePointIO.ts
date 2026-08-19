import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import * as XLSX from 'xlsx'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deviceApi } from '@/api/devices'
import { usePointStore } from '@/stores/points'
import type { PointConfig } from '@/api/types'
import type { PointDisplay } from '@/stores/points'

export function usePointIO() {
  const { t } = useI18n()
  const pointStore = usePointStore()

  const importFileRef = ref<HTMLInputElement | null>(null)

  const EXCEL_HEADERS = [
    t('devices.import.pointName'),
    t('devices.import.description'),
    t('devices.import.dataType'),
    t('devices.import.unit'),
    t('devices.import.enabled'),
    t('devices.import.writable'),
    t('devices.import.config'),
    t('devices.import.metadata'),
    t('devices.import.tags')
  ]

  const HEADER_KEYS = ['name', 'description', 'data_type', 'unit', 'enabled', 'writable', 'config', 'metadata', 'tags']

  const handleExportExcel = (deviceAsset: string, deviceName: string, points: PointDisplay[]) => {
    if (!points || points.length === 0) {
      ElMessage.warning(t('devices.import.noPointsToExport'))
      return
    }

    const rows = points.map(p => {
      const row: Record<string, unknown> = {
        [t('devices.import.pointName')]: p.name,
        [t('devices.import.description')]: p.description || '',
        [t('devices.import.dataType')]: p.data_type,
        [t('devices.import.unit')]: p.unit || '',
        [t('devices.import.enabled')]: p.enabled ? 'TRUE' : 'FALSE',
        [t('devices.import.writable')]: p.writable ? 'TRUE' : 'FALSE',
        [t('devices.import.config')]: p.config ? JSON.stringify(p.config) : '',
        [t('devices.import.metadata')]: p.metadata ? JSON.stringify(p.metadata) : '',
        [t('devices.import.tags')]: p.tags ? p.tags.join(', ') : ''
      }
      return row
    })

    const ws = XLSX.utils.json_to_sheet(rows, { header: EXCEL_HEADERS })
    ws['!cols'] = [
      { wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 10 },
      { wch: 10 }, { wch: 10 }, { wch: 40 }, { wch: 30 }, { wch: 20 }
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, t('devices.import.pointSheet'))

    const fileName = `xagent-points-${deviceName || deviceAsset}-${new Date().toISOString().slice(0, 10)}.xlsx`
    XLSX.writeFile(wb, fileName)
    ElMessage.success(t('devices.import.exportSuccess', { count: points.length }))
  }

  const handleImportExcel = () => {
    importFileRef.value?.click()
  }

  const parseExcelRow = (row: Record<string, unknown>): PointConfig | null => {
    const getVal = (key: string): unknown => {
      const header = EXCEL_HEADERS[HEADER_KEYS.indexOf(key as typeof HEADER_KEYS[number])]
      return row[header] ?? row[key]
    }

    const name = String(getVal('name') ?? '').trim()
    if (!name) return null

    const dataType = String(getVal('data_type') ?? '').trim()
    if (!dataType) return null

    const enabledRaw = String(getVal('enabled') ?? 'TRUE').trim().toUpperCase()
    const enabled = enabledRaw === 'TRUE' || enabledRaw === '1' || enabledRaw === 'YES'

    const configRaw = String(getVal('config') ?? '').trim()
    let config: Record<string, unknown> = {}
    if (configRaw) {
      try {
        config = JSON.parse(configRaw)
      } catch {
        config = {}
      }
    }

    const metadataRaw = String(getVal('metadata') ?? '').trim()
    let metadata: Record<string, unknown> | undefined
    if (metadataRaw) {
      try {
        metadata = JSON.parse(metadataRaw)
      } catch {
        metadata = undefined
      }
    }

    const tagsRaw = String(getVal('tags') ?? '').trim()
    const tags = tagsRaw ? tagsRaw.split(/[,，]/).map(t => t.trim()).filter(Boolean) : undefined

    const point: PointConfig = {
      name,
      description: String(getVal('description') ?? '').trim() || undefined,
      data_type: dataType,
      unit: String(getVal('unit') ?? '').trim() || undefined,
      enabled,
      config
    }

    if (metadata) point.metadata = metadata
    if (tags && tags.length > 0) point.tags = tags

    return point
  }

  const handleImportFileChange = async (e: Event, deviceAsset: string) => {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    input.value = ''

    try {
      const buffer = await file.arrayBuffer()
      const wb = XLSX.read(buffer, { type: 'array' })

      const sheetName = wb.SheetNames[0]
      if (!sheetName) {
        ElMessage.error(t('devices.import.invalidExcel'))
        return
      }

      const ws = wb.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { raw: false, defval: '' })

      if (jsonData.length === 0) {
        ElMessage.warning(t('devices.import.emptyFile'))
        return
      }

      const points: PointConfig[] = []
      const skipped: string[] = []

      for (const row of jsonData) {
        const point = parseExcelRow(row)
        if (point) {
          points.push(point)
        } else {
          const name = String(row[t('devices.import.pointName')] ?? row['name'] ?? '').trim()
          if (name) skipped.push(name)
        }
      }

      if (points.length === 0) {
        ElMessage.error(t('devices.import.noValidPoints'))
        return
      }

      // 检查与现有点位的冲突
      const existingPoints = pointStore.getDevicePoints(deviceAsset)
      const existingNames = new Set(existingPoints.map(p => p.name))
      const conflictNames = points.filter(p => existingNames.has(p.name)).map(p => p.name)

      // 存在冲突时询问用户是否覆盖
      if (conflictNames.length > 0) {
        try {
          await ElMessageBox.confirm(
            t('devices.import.overwriteConfirm', { count: conflictNames.length }),
            t('devices.import.importConfirmTitle'),
            {
              confirmButtonText: t('devices.import.overwrite'),
              cancelButtonText: t('common.cancel'),
              type: 'warning'
            }
          )
        } catch {
          return
        }

        // 先删除冲突的点位（与 PointDiscovery 组件保持一致的策略）
        const deletePromises = conflictNames.map(name => deviceApi.removePoint(deviceAsset, name))
        await Promise.all(deletePromises)
      }

      try {
        await ElMessageBox.confirm(
          t('devices.import.importConfirm', { count: points.length, skipped: skipped.length }),
          t('devices.import.importConfirmTitle'),
          {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
            type: 'info'
          }
        )
      } catch {
        return
      }

      const result = await deviceApi.batchAddPoints(deviceAsset, { points })

      if (result.failed > 0) {
        const errorDetails = (result.details || [])
          .filter((d) => d['status'] === 'failed')
          .map((d) => `${d['point_name']}: ${d['message']}`)
          .join('; ')
        ElMessage.warning(
          t('devices.import.importPartial', { success: result.succeeded, failed: result.failed }) +
          (errorDetails ? ` (${errorDetails})` : '')
        )
      } else {
        ElMessage.success(t('devices.import.importSuccess', { count: result.succeeded }))
      }

      await pointStore.fetchDevicePoints(deviceAsset)
    } catch (e: unknown) {
      const err = e as any
      const detail = err?.response?.data?.detail || err?.response?.data?.message || (e instanceof Error ? e.message : t('common.unknownError'))
      ElMessage.error(t('devices.import.importFailed') + ': ' + detail)
    }
  }

  return {
    importFileRef,
    handleExportExcel,
    handleImportExcel,
    handleImportFileChange
  }
}
