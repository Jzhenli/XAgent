import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDeviceStore } from '@/stores/devices'
import { usePointStore } from '@/stores/points'
import { ElMessage } from 'element-plus'
import type { Ref } from 'vue'
import type { DiscoveredDeviceResponse } from '@/api/types'
import type { DeviceFormData } from '../types'

export function useDeviceDiscoveryFlow(showDeviceDialog: Ref<boolean>) {
  const { t } = useI18n()
  const deviceStore = useDeviceStore()
  const pointStore = usePointStore()

  const showProtocolDialog = ref(false)
  const showBACnetModeDialog = ref(false)
  const showDiscoveryDialog = ref(false)
  const showConfirmDialog = ref(false)
  const selectedProtocol = ref('')
  const selectedDevice = ref<DiscoveredDeviceResponse | null>(null)

  const closeAllDialogs = () => {
    showProtocolDialog.value = false
    showBACnetModeDialog.value = false
    showDiscoveryDialog.value = false
    showConfirmDialog.value = false
  }

  const refreshDeviceLists = async () => {
    await deviceStore.fetchDevices()
    await deviceStore.fetchConnectionStatus()
    await pointStore.fetchDevicesWithPoints()
  }

  const handleAddDevice = () => {
    showProtocolDialog.value = true
  }

  const handleSelectProtocol = (protocol: string, form: DeviceFormData) => {
    selectedProtocol.value = protocol
    if (protocol === 'bacnet') {
      showBACnetModeDialog.value = true
    } else {
      // 其他协议，打开手动配置对话框
      form.asset = ''
      form.name = ''
      form.description = ''
      form.enabled = true
      form.pluginName = protocol
      form.host = ''
      form.port = protocol === 'knx' ? 3671 : 502
      form.slave_id = 1
      form.timeout = 5
      form.interval = 1
      form.serial_port = '/dev/ttyUSB0'
      form.baudrate = 9600
      form.parity = 'N'
      form.stopbits = 1
      form.bytesize = 8
      form.gateway_ip = ''
      form.local_ip = ''
      form.connection_type = 'automatic'
      form.sync_mode = 'smart'
      form.sync_interval = 60
      form.device_id = 1234
      form.tags = ''
      showProtocolDialog.value = false
      showDeviceDialog.value = true
    }
  }

  const handleSelectBACnetMode = (mode: 'manual' | 'discover', form: DeviceFormData) => {
    if (mode === 'discover') {
      showDiscoveryDialog.value = true
    } else {
      // 手动配置，打开设备配置对话框
      form.asset = ''
      form.name = ''
      form.description = ''
      form.enabled = true
      form.pluginName = 'bacnet'
      form.host = ''
      form.port = 47808
      form.slave_id = 1
      form.timeout = 5
      form.interval = 5
      form.serial_port = '/dev/ttyUSB0'
      form.baudrate = 9600
      form.parity = 'N'
      form.stopbits = 1
      form.bytesize = 8
      form.gateway_ip = ''
      form.local_ip = ''
      form.connection_type = 'automatic'
      form.sync_mode = 'smart'
      form.sync_interval = 60
      form.device_id = 1234
      form.tags = ''
      showBACnetModeDialog.value = false
      showDeviceDialog.value = true
    }
  }

  const handleCustomizeDevice = (device: DiscoveredDeviceResponse) => {
    selectedDevice.value = device
    showConfirmDialog.value = true
  }

  const handleQuickAddDevice = async (device: DiscoveredDeviceResponse) => {
    await refreshDeviceLists()
  }

  const handleDeviceDiscoverySuccess = async () => {
    showDiscoveryDialog.value = false
    await refreshDeviceLists()
    ElMessage.success(t('devices.discoveryCompleted'))
  }

  const handleDeviceConfirmSuccess = async () => {
    showConfirmDialog.value = false
    await refreshDeviceLists()
    ElMessage.success(t('devices.deviceAdded'))
  }

  const handleBackToDiscovery = () => {
    showConfirmDialog.value = false
    showDiscoveryDialog.value = true
  }

  return {
    showProtocolDialog,
    showBACnetModeDialog,
    showDiscoveryDialog,
    showConfirmDialog,
    selectedProtocol,
    selectedDevice,
    handleAddDevice,
    handleSelectProtocol,
    handleSelectBACnetMode,
    handleCustomizeDevice,
    handleQuickAddDevice,
    handleDeviceDiscoverySuccess,
    handleDeviceConfirmSuccess,
    handleBackToDiscovery,
    closeAllDialogs
  }
}
