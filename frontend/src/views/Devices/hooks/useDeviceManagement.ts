import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDeviceStore } from '@/stores/devices'
import { usePointStore } from '@/stores/points'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { DeviceListItem } from '@/stores/devices'
import type { DeviceConfig } from '@/api/types'
import type { DeviceFormData } from '../types'

export function useDeviceManagement() {
  const { t } = useI18n()
  const deviceStore = useDeviceStore()
  const pointStore = usePointStore()

  const showDeviceDialog = ref(false)
  const deviceFormRef = ref()
  const isEditing = ref(false)
  const editingAsset = ref('')
  const saving = ref(false)

  const pluginOptions = [
    {
      label: t('devices.protocol.modbus_tcp'),
      value: 'modbus_tcp',
      defaultConfig: { slave_id: 1, timeout: 5, interval: 1, host: '', port: 502 }
    },
    {
      label: t('devices.protocol.modbus_rtu'),
      value: 'modbus_rtu',
      defaultConfig: {
        slave_id: 1, timeout: 5, interval: 1,
        serial_port: '/dev/ttyUSB0', baudrate: 9600, parity: 'N', stopbits: 1, bytesize: 8
      }
    },
    {
      label: t('devices.protocol.knx'),
      value: 'knx',
      defaultConfig: {
        local_ip: '',
        timeout: 5,
        connection_type: 'automatic',
        interval: 1,
        sync_mode: 'smart',
        sync_interval: 60
      }
    },
    {
      label: t('devices.protocol.bacnet'),
      value: 'bacnet',
      defaultConfig: { device_id: 1234, timeout: 5, interval: 1 }
    }
  ]

  const handleToggleDevice = async (asset: string) => {
    try {
      await deviceStore.toggleDevice(asset)
      ElMessage.success(t('devices.deviceStatusToggled'))
    } catch (e: unknown) {
      ElMessage.error(t('common.operationFailed') + ': ' + (e instanceof Error ? e.message : t('common.unknownError')))
    }
  }

  const handleRefresh = async () => {
    await deviceStore.fetchDevices()
    await deviceStore.fetchConnectionStatus()
    await pointStore.fetchDevicesWithPoints()
  }

  const handleEditDevice = (device: DeviceListItem, form: DeviceFormData) => {
    isEditing.value = true
    editingAsset.value = device.asset
    form.asset = device.asset
    form.name = device.name
    form.description = device.description || ''
    form.enabled = device.enabled
    form.pluginName = device.pluginName
    form.host = device.connection.host
    form.port = device.connection.port
    form.slave_id = (device.pluginConfig.slave_id as number) || 1
    form.timeout = (device.pluginConfig.timeout as number) || 5
    form.interval = (device.pluginConfig.interval as number) || 1
    form.serial_port = (device.pluginConfig.serial_port as string) || '/dev/ttyUSB0'
    form.baudrate = (device.pluginConfig.baudrate as number) || 9600
    form.parity = (device.pluginConfig.parity as string) || 'N'
    form.stopbits = (device.pluginConfig.stopbits as number) || 1
    form.bytesize = (device.pluginConfig.bytesize as number) || 8
    form.gateway_ip = (device.pluginConfig.gateway_ip as string) || ''
    form.local_ip = (device.pluginConfig.local_ip as string) || ''
    form.connection_type = (device.pluginConfig.connection_type as string) || 'automatic'
    form.sync_mode = (device.pluginConfig.sync_mode as string) || 'smart'
    form.sync_interval = (device.pluginConfig.sync_interval as number) || 60
    form.device_id = (device.pluginConfig.device_id as number) || 1234
    form.tags = device.tags.join(', ')
    showDeviceDialog.value = true
  }

  const buildPluginConfig = (form: DeviceFormData): Record<string, unknown> => {
    const baseConfig: Record<string, unknown> = {}
    
    if (form.pluginName === 'modbus_tcp') {
      baseConfig.host = form.host
      baseConfig.port = form.port
      baseConfig.slave_id = form.slave_id
      baseConfig.timeout = form.timeout
      baseConfig.interval = form.interval
    } else if (form.pluginName === 'modbus_rtu') {
      baseConfig.serial_port = form.serial_port
      baseConfig.baudrate = form.baudrate
      baseConfig.parity = form.parity
      baseConfig.stopbits = form.stopbits
      baseConfig.bytesize = form.bytesize
      baseConfig.slave_id = form.slave_id
      baseConfig.timeout = form.timeout
      baseConfig.interval = form.interval
    } else if (form.pluginName === 'knx') {
      baseConfig.gateway_ip = form.gateway_ip || form.host
      baseConfig.gateway_port = form.port
      if (form.local_ip) {
        baseConfig.local_ip = form.local_ip
      }
      if (form.connection_type) {
        baseConfig.connection_type = form.connection_type
      }
      baseConfig.interval = form.interval
      baseConfig.sync_mode = form.sync_mode
      baseConfig.sync_interval = form.sync_interval
      baseConfig.timeout = form.timeout
    } else if (form.pluginName === 'bacnet') {
      baseConfig.host = form.host
      baseConfig.port = form.port
      baseConfig.device_id = form.device_id
      baseConfig.timeout = form.timeout
      baseConfig.interval = form.interval
    }
    
    return baseConfig
  }

  const handleSaveDevice = async (form: DeviceFormData) => {
    saving.value = true
    try {
      const config = buildPluginConfig(form)

      if (isEditing.value) {
        await deviceStore.updateDevice(editingAsset.value, {
          name: form.name || form.asset,
          description: form.description,
          enabled: form.enabled,
          plugin: {
            name: form.pluginName,
            config
          },
          tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
        })
        ElMessage.success(t('devices.deviceUpdated'))
      } else {
        const device: DeviceConfig = {
          asset: form.asset,
          name: form.name || form.asset,
          description: form.description || undefined,
          enabled: form.enabled,
          plugin: {
            name: form.pluginName,
            config
          },
          points: [],
          tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
        }
        await deviceStore.createDevice(device)
        ElMessage.success(t('devices.deviceCreated'))
      }
      showDeviceDialog.value = false
    } catch (e: unknown) {
      const detail = (e as any)?.response?.data?.detail || (e instanceof Error ? e.message : t('common.unknownError'))
      ElMessage.error(isEditing.value ? t('common.updateFailed') + ': ' + detail : t('common.createFailed') + ': ' + detail)
    } finally {
      saving.value = false
    }
  }

  const handleDeleteDevice = async (device: DeviceListItem, onSelectedClear: () => void) => {
    try {
      await ElMessageBox.confirm(
        t('devices.deleteConfirm', { name: device.name, asset: device.asset }),
        t('common.confirmDelete'),
        {
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
          type: 'warning'
        }
      )
      await deviceStore.deleteDevice(device.asset)
      onSelectedClear()
      ElMessage.success(t('devices.deviceDeleted'))
    } catch (e: unknown) {
      if (e !== 'cancel') {
        ElMessage.error(t('common.deleteFailed') + ': ' + (e instanceof Error ? e.message : t('common.unknownError')))
      }
    }
  }

  const handleReloadDevice = async (asset: string) => {
    try {
      await deviceStore.reloadDevice(asset)
      ElMessage.success(t('devices.deviceReloaded'))
    } catch (e: unknown) {
      ElMessage.error(t('devices.reloadFailed') + ': ' + (e instanceof Error ? e.message : t('common.unknownError')))
    }
  }

  return {
    showDeviceDialog,
    deviceFormRef,
    isEditing,
    editingAsset,
    saving,
    pluginOptions,
    handleToggleDevice,
    handleRefresh,
    handleEditDevice,
    handleSaveDevice,
    handleDeleteDevice,
    handleReloadDevice
  }
}
