<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { deviceApi } from '@/api/devices'
import type { DiscoveredDeviceResponse, DeviceConfig } from '@/api/types'

const { t } = useI18n()

interface Props {
  visible: boolean
  device: DiscoveredDeviceResponse | null
}

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
  (e: 'back'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 设备配置表单（自动填充）
const asset = ref('')
const name = ref('')
const enabled = ref(true)

// 监听设备变化，自动填充表单
const autoFillForm = () => {
  if (props.device) {
    // 自动生成资产标识
    asset.value = `bacnet_${props.device.device_id}`
    // 自动读取设备名称
    name.value = props.device.device_name || `BACnet Device ${props.device.device_id}`
  }
  // 重置启用状态，避免保留上次用户的修改
  enabled.value = true
}

// 监听visible变化，触发自动填充（immediate: 处理以 visible=true 挂载的场景）
watch(() => props.visible, (val) => {
  if (val) {
    autoFillForm()
  }
}, { immediate: true })

// 监听 device 变化，对话框保持打开时切换设备也能刷新表单
watch(() => props.device, () => {
  if (props.visible) {
    autoFillForm()
  }
})

// 保存设备
const handleSave = async () => {
  if (!props.device) {
    ElMessage.error(t('devices.noDeviceSelected'))
    return
  }

  // 验证必填字段
  if (!asset.value.trim()) {
    ElMessage.error(t('devices.assetRequired'))
    return
  }

  if (!name.value.trim()) {
    ElMessage.error(t('devices.deviceNameRequired'))
    return
  }

  try {
    // 构建设备配置
    const deviceConfig: DeviceConfig = {
      asset: asset.value.trim(),
      name: name.value.trim(),
      plugin: {
        name: 'bacnet',
        config: {
          host: props.device.address,
          port: props.device.port,
          device_id: props.device.device_id,
          timeout: 5,
          interval: 1
        }
      },
      points: [],
      enabled: enabled.value,
      description: `${props.device.vendor_name || 'Unknown'} - ${props.device.model_name || 'Unknown'}`
    }

    // 创建设备
    await deviceApi.create(deviceConfig)

    ElMessage.success(t('devices.deviceSaved'))
    emit('success')
    emit('close')
  } catch (error: any) {
    const detail = error?.response?.data?.detail || error?.message || t('common.unknownError')
    ElMessage.error(t('devices.saveDeviceFailed', { detail }))
  }
}

const handleBack = () => {
  emit('back')
  emit('close')
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <el-dialog
    :model-value="props.visible"
    :title="t('devices.confirmDeviceTitle')"
    width="600px"
    class="x-dialog"
    @close="handleClose"
  >
    <!-- 信息提示区 -->
    <el-alert
      type="info"
      :closable="false"
      class="mb-4"
    >
      <template #title>
        <el-icon><i class="el-icon-info"></i></el-icon>
        {{ t('devices.confirmDeviceHint') }}
      </template>
    </el-alert>

    <!-- 基础信息区（可修改） -->
    <el-card shadow="never" class="mb-4">
      <template #header>
        <div class="card-header">
          <span>{{ t('devices.confirmBasicInfo') }}</span>
        </div>
      </template>

      <el-form label-width="100px">
        <el-form-item :label="t('devices.asset')">
          <el-input
            v-model="asset"
            :placeholder="t('devices.confirmAssetPlaceholder')"
          />
          <el-text type="info" size="small" class="mt-1">
            {{ t('devices.confirmAssetTip') }}
          </el-text>
        </el-form-item>

        <el-form-item :label="t('devices.deviceName')">
          <el-input
            v-model="name"
            :placeholder="t('devices.confirmNamePlaceholder')"
          />
          <el-text type="info" size="small" class="mt-1">
            {{ t('devices.confirmNameTip') }}
          </el-text>
        </el-form-item>

        <el-form-item :label="t('devices.enabled')">
          <el-switch v-model="enabled" />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- BACnet 参数区（不可修改） -->
    <el-card shadow="never" class="mb-4" v-if="device">
      <template #header>
        <div class="card-header">
          <span>{{ t('devices.confirmBacnetParams') }}</span>
        </div>
      </template>

      <el-form label-width="100px">
        <el-form-item :label="t('devices.deviceId')">
          <el-input
            :value="device.device_id"
            disabled
            class="disabled-input"
          />
          <el-text type="info" size="small" class="mt-1">
            {{ t('devices.confirmReadonlyTip') }}
          </el-text>
        </el-form-item>

        <el-form-item :label="t('devices.host')">
          <el-input
            :value="device.address"
            disabled
            class="disabled-input"
          />
          <el-text type="info" size="small" class="mt-1">
            {{ t('devices.confirmReadonlyTip') }}
          </el-text>
        </el-form-item>

        <el-form-item :label="t('devices.port')">
          <el-input
            :value="device.port"
            disabled
            class="disabled-input"
          />
          <el-text type="info" size="small" class="mt-1">
            {{ t('devices.confirmReadonlyTip') }}
          </el-text>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 底部按钮 -->
    <template #footer>
      <el-button @click="handleBack">{{ t('devices.confirmBack') }}</el-button>
      <el-button @click="handleClose">{{ t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleSave">{{ t('devices.confirmSave') }}</el-button>
    </template>
  </el-dialog>
</template>

<style>
/* 引入 Devices 模块通用弹框样式（需 unscoped，弹框内容 teleport 到 body） */
@import './DialogCommon.css';
</style>

<style scoped>
/* 卡片标题 */
.card-header {
  font-weight: bold;
  color: var(--text-primary);
}

/* 只读/禁用输入框：保持灰色背景以区分可编辑字段 */
.disabled-input :deep(.el-input__wrapper) {
  background-color: var(--el-disabled-bg-color) !important;
}

.disabled-input :deep(.el-input__inner) {
  color: var(--el-disabled-text-color) !important;
}

.mb-4 {
  margin-bottom: 16px;
}

.mt-1 {
  margin-top: 4px;
}
</style>
