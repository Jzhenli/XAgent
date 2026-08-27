import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDeviceStore } from '@/stores/devices'
import { usePointStore } from '@/stores/points'
import { ElMessage } from 'element-plus'
import type { Ref } from 'vue'
import type { DiscoveredDeviceResponse } from '@/api/types'
import type { DeviceFormData } from '../types'
import { populateDeviceForm, PLUGIN_DEFAULTS } from '../types'

export function useDeviceDiscoveryFlow(showDeviceDialog: Ref<boolean>, isEditing: Ref<boolean>) {
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
      populateDeviceForm(form, {
        pluginName: protocol,
        asset: '',
        name: '',
        description: '',
        enabled: true,
        connection: {
          host: PLUGIN_DEFAULTS[protocol]?.host ?? '',
          port: PLUGIN_DEFAULTS[protocol]?.port ?? 502
        }
      })
      // 重置编辑状态，确保设备标识可输入
      isEditing.value = false
      showProtocolDialog.value = false
      showDeviceDialog.value = true
    }
  }

  const handleSelectBACnetMode = (mode: 'manual' | 'discover', form: DeviceFormData) => {
    if (mode === 'discover') {
      showDiscoveryDialog.value = true
    } else {
      // 手动配置，打开设备配置对话框
      populateDeviceForm(form, {
        pluginName: 'bacnet',
        asset: '',
        name: '',
        description: '',
        enabled: true,
        connection: { host: '', port: 47808 }
      })
      // 重置编辑状态，确保设备标识可输入
      isEditing.value = false
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
