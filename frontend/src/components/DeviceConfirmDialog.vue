<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { deviceApi } from '@/api/devices'
import type { DiscoveredDeviceResponse, DeviceConfig } from '@/api/types'

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
}

// 监听visible变化，触发自动填充
const stopWatch = computed(() => {
  if (props.visible) {
    autoFillForm()
  }
  return props.visible
})

// 保存设备
const handleSave = async () => {
  if (!props.device) {
    ElMessage.error('没有选择设备')
    return
  }

  // 验证必填字段
  if (!asset.value.trim()) {
    ElMessage.error('资产标识不能为空')
    return
  }

  if (!name.value.trim()) {
    ElMessage.error('设备名称不能为空')
    return
  }

  try {
    // 构建设备配置
    const deviceConfig: DeviceConfig = {
      asset: asset.value.trim(),
      name: name.value.trim(),
      plugin: {
        name: 'bacnet',
        type: 'south',
        version: '1.0.0'
      },
      plugin_config: {
        host: props.device.address,
        port: props.device.port,
        device_id: props.device.device_id
      },
      enabled: enabled.value,
      description: `${props.device.vendor_name || 'Unknown'} - ${props.device.model_name || 'Unknown'}`
    }

    // 创建设备
    await deviceApi.createDevice(deviceConfig)

    ElMessage.success('设备保存成功')
    emit('success')
    emit('close')
  } catch (error: any) {
    const detail = error?.response?.data?.detail || error?.message || '未知错误'
    ElMessage.error(`保存失败: ${detail}`)
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
    v-model="stopWatch"
    title="确认设备信息 - 步骤 3/3"
    width="600px"
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
        设备信息已自动填充，您可以修改基础信息
      </template>
    </el-alert>

    <!-- 基础信息区（可修改） -->
    <el-card shadow="never" class="mb-4">
      <template #header>
        <div class="card-header">
          <span>基础信息（可修改）</span>
        </div>
      </template>

      <el-form label-width="100px">
        <el-form-item label="资产标识">
          <el-input
            v-model="asset"
            placeholder="自动生成，可修改为自定义标识"
          />
          <el-text type="info" size="small" class="mt-1">
            自动生成：bacnet_{设备ID}，可修改为自定义标识
          </el-text>
        </el-form-item>

        <el-form-item label="设备名称">
          <el-input
            v-model="name"
            placeholder="从设备读取，可修改"
          />
          <el-text type="info" size="small" class="mt-1">
            从设备读取，可修改
          </el-text>
        </el-form-item>

        <el-form-item label="启用状态">
          <el-switch v-model="enabled" />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- BACnet 参数区（不可修改） -->
    <el-card shadow="never" class="mb-4" v-if="device">
      <template #header>
        <div class="card-header">
          <span>BACnet 参数（已确认）</span>
        </div>
      </template>

      <el-form label-width="100px">
        <el-form-item label="设备ID">
          <el-input
            :value="device.device_id"
            disabled
            class="disabled-input"
          />
          <el-text type="info" size="small" class="mt-1">
            从设备读取，不可修改（灰显）
          </el-text>
        </el-form-item>

        <el-form-item label="主机地址">
          <el-input
            :value="device.address"
            disabled
            class="disabled-input"
          />
          <el-text type="info" size="small" class="mt-1">
            从设备读取，不可修改（灰显）
          </el-text>
        </el-form-item>

        <el-form-item label="端口">
          <el-input
            :value="device.port"
            disabled
            class="disabled-input"
          />
          <el-text type="info" size="small" class="mt-1">
            从设备读取，不可修改（灰显）
          </el-text>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleBack">返回重新选择</el-button>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave">保存设备</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.card-header {
  font-weight: bold;
}

.disabled-input {
  background-color: #f5f5f5;
  color: #909399;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mt-1 {
  margin-top: 4px;
}
</style>