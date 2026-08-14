import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDeviceStore } from '@/stores/devices'
import { usePointStore } from '@/stores/points'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { DeviceListItem } from '@/stores/devices'
import type { DeviceConfig } from '@/api/types'
import type { DeviceFormData } from '../types'
import { populateDeviceForm, PLUGIN_DEFAULTS } from '../types'

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
    { label: t('devices.protocol.modbus_tcp'), value: 'modbus_tcp', defaultConfig: PLUGIN_DEFAULTS.modbus_tcp },
    { label: t('devices.protocol.modbus_rtu'), value: 'modbus_rtu', defaultConfig: PLUGIN_DEFAULTS.modbus_rtu },
    { label: t('devices.protocol.knx'), value: 'knx', defaultConfig: PLUGIN_DEFAULTS.knx },
    { label: t('devices.protocol.bacnet'), value: 'bacnet', defaultConfig: PLUGIN_DEFAULTS.bacnet }
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
    if (deviceStore.error) {
      ElMessage.error(t('devices.refreshFailed'))
    } else {
      await deviceStore.fetchConnectionStatus()
      await pointStore.fetchDevicesWithPoints()
      ElMessage.success(t('devices.refreshSuccess'))
    }
  }

  const handleEditDevice = (device: DeviceListItem, form: DeviceFormData) => {
    isEditing.value = true
    editingAsset.value = device.asset
    populateDeviceForm(form, {
      asset: device.asset,
      name: device.name,
      description: device.description,
      enabled: device.enabled,
      pluginName: device.pluginName,
      connection: device.connection,
      config: device.pluginConfig,
      tags: device.tags
    })
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
          type: 'warning',
          customClass: 'x-message-box'
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
