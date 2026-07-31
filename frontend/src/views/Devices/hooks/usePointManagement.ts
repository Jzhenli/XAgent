import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePointStore } from '@/stores/points'
import { useDeviceStore } from '@/stores/devices'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { PointConfig } from '@/api/types'
import type { PointFormData, WriteFormData } from '../types'
import { createInitialPointForm } from '../types'

export function usePointManagement(
  selectedDeviceAsset: ReturnType<typeof ref<string | null>>
) {
  const { t } = useI18n()
  const pointStore = usePointStore()
  const deviceStore = useDeviceStore()

  const showPointDialog = ref(false)
  const pointFormRef = ref()
  const isEditingPoint = ref(false)
  const editingPointName = ref('')
  const savingPoint = ref(false)

  const showWriteDialog = ref(false)
  const writing = ref(false)

  const modbusDataTypes = [
    { label: t('devices.modbus.uint16'), value: 'uint16' },
    { label: t('devices.modbus.int16'), value: 'int16' },
    { label: t('devices.modbus.uint32'), value: 'uint32' },
    { label: t('devices.modbus.int32'), value: 'int32' },
    { label: t('devices.modbus.float32'), value: 'float32' },
    { label: t('devices.modbus.float32Swap'), value: 'float32_swap' },
    { label: t('devices.modbus.float64'), value: 'float64' },
    { label: t('devices.modbus.uint64'), value: 'uint64' },
    { label: t('devices.modbus.int64'), value: 'int64' },
    { label: t('devices.modbus.bool'), value: 'bool' },
    { label: t('devices.modbus.string'), value: 'string' }
  ]

  const knxDataTypes = [
    { label: t('devices.knx.switch'), value: 'switch' },
    { label: t('devices.knx.bool'), value: 'bool' },
    { label: t('devices.knx.binary'), value: 'binary' },
    { label: t('devices.knx.percent'), value: 'percent' },
    { label: t('devices.knx.brightness'), value: 'brightness' },
    { label: t('devices.knx.dimming'), value: 'dimming' },
    { label: t('devices.knx.blinds'), value: 'blinds' },
    { label: t('devices.knx.temperature'), value: 'temperature' },
    { label: t('devices.knx.humidity'), value: 'humidity' },
    { label: t('devices.knx.co2'), value: 'co2' },
    { label: t('devices.knx.voltage'), value: 'voltage' },
    { label: t('devices.knx.current'), value: 'current' },
    { label: t('devices.knx.power'), value: 'power' },
    { label: t('devices.knx.energy'), value: 'energy' },
    { label: t('devices.knx.colorRgb'), value: 'color_rgb' },
    { label: t('devices.knx.scene'), value: 'scene' },
    { label: t('devices.knx.float'), value: 'float' },
    { label: t('devices.knx.string'), value: 'string' }
  ]

  const bacnetDataTypes = [
    { label: t('devices.bacnet.analogInput'), value: 'analogInput' },
    { label: t('devices.bacnet.analogOutput'), value: 'analogOutput' },
    { label: t('devices.bacnet.analogValue'), value: 'analogValue' },
    { label: t('devices.bacnet.binaryInput'), value: 'binaryInput' },
    { label: t('devices.bacnet.binaryOutput'), value: 'binaryOutput' },
    { label: t('devices.bacnet.binaryValue'), value: 'binaryValue' },
    { label: t('devices.bacnet.multiStateInput'), value: 'multiStateInput' },
    { label: t('devices.bacnet.multiStateOutput'), value: 'multiStateOutput' },
    { label: t('devices.bacnet.multiStateValue'), value: 'multiStateValue' }
  ]

  const registerTypes = [
    { label: t('devices.registerType.holding'), value: 'holding' },
    { label: t('devices.registerType.input'), value: 'input' },
    { label: t('devices.registerType.coil'), value: 'coil' },
    { label: t('devices.registerType.discreteInput'), value: 'discrete_input' }
  ]

  const currentDevicePluginName = computed(() => {
    if (!selectedDeviceAsset.value) return ''
    const device = deviceStore.getDeviceByAsset(selectedDeviceAsset.value)
    return device?.plugin?.name || ''
  })

  const handleAddPoint = (form: PointFormData) => {
    if (!selectedDeviceAsset.value) return
    isEditingPoint.value = false
    editingPointName.value = ''
    Object.assign(form, createInitialPointForm(currentDevicePluginName.value))
    showPointDialog.value = true
  }

  const handleEditPoint = (point: any, form: PointFormData) => {
    isEditingPoint.value = true
    editingPointName.value = point.name
    const config = point.config || {}
    const metadata = point.metadata || {}
    Object.assign(form, {
      name: point.name,
      description: point.description || '',
      data_type: point.data_type,
      standard_data_type: point.standard_data_type || '',
      unit: point.unit || '',
      enabled: point.enabled,
      configJson: JSON.stringify(config, null, 2),
      metadataJson: JSON.stringify(metadata, null, 2),
      tags: (point.tags || []).join(', '),
      address: config.address ?? 0,
      register_type: config.register_type || 'holding',
      count: config.count ?? 1,
      scale: config.scale ?? null,
      offset: config.offset ?? null,
      byte_order: config.byte_order || 'big',
      word_order: config.word_order || 'big',
      group_address: config.group_address || '',
      status_address: config.status_address || '',
      control_address: config.control_address || '',
      writable: config.writable ?? false,
      object_type: config.object_type || point.data_type || 'analogInput',
      object_instance: config.object_instance ?? 0,
      property: config.property || 'presentValue',
      alarm_high: metadata.alarm_high ?? null,
      alarm_low: metadata.alarm_low ?? null,
      min: metadata.min ?? null,
      max: metadata.max ?? null
    })
    showPointDialog.value = true
  }

  const buildPointConfig = (form: PointFormData): Record<string, unknown> => {
    const pluginName = currentDevicePluginName.value
    const config: Record<string, unknown> = {}
    
    if (pluginName === 'modbus_tcp' || pluginName === 'modbus_rtu') {
      config.address = form.address
      config.register_type = form.register_type
      config.count = form.count
      config.scale = form.scale
      config.offset = form.offset
      config.byte_order = form.byte_order
      config.word_order = form.word_order
    } else if (pluginName === 'knx') {
      config.group_address = form.group_address
      config.status_address = form.status_address || null
      config.control_address = form.control_address || null
      config.writable = form.writable
      config.scale = form.scale
      config.offset = form.offset
    } else if (pluginName === 'bacnet') {
      config.object_type = form.object_type
      config.object_instance = form.object_instance
      config.property = form.property
      config.scale = form.scale
      config.offset = form.offset
    }
    
    return config
  }

  const buildPointMetadata = (form: PointFormData): Record<string, unknown> => {
    const metadata: Record<string, unknown> = {}
    
    if (form.alarm_high !== null) {
      metadata.alarm_high = form.alarm_high
    }
    if (form.alarm_low !== null) {
      metadata.alarm_low = form.alarm_low
    }
    if (form.min !== null) {
      metadata.min = form.min
    }
    if (form.max !== null) {
      metadata.max = form.max
    }
    
    return metadata
  }

  const handleSavePoint = async (form: PointFormData) => {
    const config = buildPointConfig(form)
    const metadata = buildPointMetadata(form)

    savingPoint.value = true
    try {
      const asset = selectedDeviceAsset.value!
      if (isEditingPoint.value) {
        const updates: Record<string, unknown> = {
          description: form.description,
          data_type: form.data_type,
          unit: form.unit,
          enabled: form.enabled,
          config,
          metadata,
          tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
        }
        await pointStore.updatePoint(asset, editingPointName.value, updates)
        ElMessage.success(t('devices.pointUpdated'))
      } else {
        const point: PointConfig = {
          name: form.name,
          description: form.description || undefined,
          data_type: form.data_type,
          unit: form.unit || undefined,
          enabled: form.enabled,
          config,
          metadata,
          tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
        }
        await pointStore.addPoint(asset, point)
        ElMessage.success(t('devices.pointAdded'))
      }
      showPointDialog.value = false
    } catch (e: unknown) {
      const detail = (e as any)?.response?.data?.detail || (e instanceof Error ? e.message : t('common.unknownError'))
      ElMessage.error(isEditingPoint.value ? t('devices.updatePointFailed') + ': ' + detail : t('devices.addPointFailed') + ': ' + detail)
    } finally {
      savingPoint.value = false
    }
  }

  const handleDeletePoint = async (pointName: string) => {
    if (!selectedDeviceAsset.value) return
    try {
      await ElMessageBox.confirm(
        t('devices.deletePointConfirm', { name: pointName }),
        t('common.confirmDelete'),
        {
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
          type: 'warning'
        }
      )
      await pointStore.removePoint(selectedDeviceAsset.value!, pointName)
      ElMessage.success(t('devices.pointDeleted'))
    } catch (e: unknown) {
      if (e !== 'cancel') {
        ElMessage.error(t('common.deleteFailed') + ': ' + (e instanceof Error ? e.message : t('common.unknownError')))
      }
    }
  }

  const handleWritePoint = (point: any, writeForm: WriteFormData) => {
    if (!selectedDeviceAsset.value) return
    const isDigital = point.type === 'digital' || point.standard_data_type === 'bool'
    writeForm.deviceAsset = selectedDeviceAsset.value
    writeForm.pointName = point.name
    writeForm.pointType = isDigital ? 'digital' : 'analog'
    writeForm.unit = point.unit || ''
    writeForm.currentValue = point.currentValue !== undefined && point.currentValue !== null
      ? String(point.currentValue)
      : '--'
    writeForm.value = ''
    writeForm.boolValue = point.currentValue === true || point.currentValue === 1
    showWriteDialog.value = true
  }

  const handleWriteSubmit = async (writeForm: WriteFormData) => {
    writing.value = true
    try {
      let value: number | boolean | string
      if (writeForm.pointType === 'digital') {
        value = writeForm.boolValue
      } else {
        const numVal = Number(writeForm.value)
        if (writeForm.value.trim() !== '' && !isNaN(numVal)) {
          value = numVal
        } else {
          value = writeForm.value
        }
      }

      const result = await pointStore.writePoint(
        writeForm.deviceAsset,
        writeForm.pointName,
        value
      )

      if (result.success) {
        ElMessage.success(result.message)
        showWriteDialog.value = false
      } else {
        ElMessage.error(result.message)
      }
    } catch (e: unknown) {
      ElMessage.error(t('devices.writeFailed') + ': ' + (e instanceof Error ? e.message : t('common.unknownError')))
    } finally {
      writing.value = false
    }
  }

  return {
    showPointDialog,
    pointFormRef,
    isEditingPoint,
    editingPointName,
    savingPoint,
    showWriteDialog,
    writing,
    modbusDataTypes,
    knxDataTypes,
    bacnetDataTypes,
    registerTypes,
    currentDevicePluginName,
    handleAddPoint,
    handleEditPoint,
    handleSavePoint,
    handleDeletePoint,
    handleWritePoint,
    handleWriteSubmit
  }
}
