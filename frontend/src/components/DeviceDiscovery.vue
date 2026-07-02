<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Upload } from '@element-plus/icons-vue'
import { deviceApi } from '@/api/devices'
import type { DiscoveredDeviceResponse, DeviceConfig, NetworkInterfaceResponse } from '@/api/types'

interface Props {
  visible: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
  (e: 'quickAdd', device: DiscoveredDeviceResponse): void
  (e: 'customize', device: DiscoveredDeviceResponse): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 网卡选择
const networkInterfaces = ref<NetworkInterfaceResponse[]>([])
const selectedInterfaceIp = ref<string>('')

// 搜索配置
const networkRange = ref('')
const deviceIdRangeMin = ref<number | null>(null)
const deviceIdRangeMax = ref<number | null>(null)
const timeout = ref(5.0)

// 搜索状态
const searching = ref(false)
const discoveredDevices = ref<DiscoveredDeviceResponse[]>([])

// 设备选择
const selectedDevices = ref<DiscoveredDeviceResponse[]>([])
const selectAll = ref(false)

// 计算属性
const selectedCount = computed(() => selectedDevices.value.length)

const handleSelectAll = (val: boolean) => {
  if (val) {
    selectedDevices.value = [...discoveredDevices.value]
  } else {
    selectedDevices.value = []
  }
}

const handleSelectionChange = (selection: DiscoveredDeviceResponse[]) => {
  selectedDevices.value = selection
  selectAll.value = selection.length === discoveredDevices.value.length
}

// 发现设备
const handleDiscoverDevices = async () => {
  searching.value = true
  discoveredDevices.value = []
  selectedDevices.value = []

  try {
    // 构建请求参数
    const request: any = {
      timeout: timeout.value
    }

    if (networkRange.value) {
      request.network_range = networkRange.value
    }

    if (deviceIdRangeMin.value !== null && deviceIdRangeMax.value !== null) {
      request.device_id_range = [deviceIdRangeMin.value, deviceIdRangeMax.value]
    }

    if (selectedInterfaceIp.value) {
      request.interface_ip = selectedInterfaceIp.value
    }

    const response = await deviceApi.discoverDevices(request)

    if (response.success) {
      discoveredDevices.value = response.devices
      ElMessage.success(`发现 ${response.total} 个BACnet设备`)
    } else {
      ElMessage.error('设备发现失败')
    }
  } catch (error: any) {
    const detail = error?.response?.data?.detail || error?.message || '未知错误'
    ElMessage.error(`设备发现失败: ${detail}`)
  } finally {
    searching.value = false
  }
}

// 快速添加单个设备（点击[添加]按钮）
const handleQuickAddDevice = async (device: DiscoveredDeviceResponse) => {
  try {
    // 自动生成配置（修正：plugin字段使用PluginReference结构）
    const deviceConfig: DeviceConfig = {
      asset: `bacnet_${device.device_id}`,
      name: device.device_name || `BACnet Device ${device.device_id}`,
      description: `${device.vendor_name || 'Unknown'} - ${device.model_name || 'Unknown'}`,
      enabled: true,
      plugin: {
        name: 'bacnet',
        config: {
          host: device.address,
          port: device.port,
          device_id: device.device_id,
          timeout: 5,
          interval: 1
        }
      },
      points: []  // 新设备初始没有点位，后续通过点位发现添加
    }

    // 创建设备（修正：方法名应该是create而不是createDevice）
    await deviceApi.create(deviceConfig)

    ElMessage.success(`设备 ${deviceConfig.name} 已成功添加`)
    emit('success')

    // 从列表中移除已添加的设备
    const index = discoveredDevices.value.findIndex(d => d.device_id === device.device_id)
    if (index !== -1) {
      discoveredDevices.value.splice(index, 1)
    }
  } catch (error: any) {
    const detail = error?.response?.data?.detail || error?.message || '未知错误'
    ElMessage.error(`添加失败: ${detail}`)
  }
}

// 自定义添加（点击[自定义]按钮）
const handleCustomizeDevice = (device: DiscoveredDeviceResponse) => {
  emit('customize', device)
}

// 批量添加设备
const handleBatchAdd = async () => {
  if (selectedDevices.value.length === 0) {
    ElMessage.warning('请先选择要添加的设备')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要批量添加 ${selectedDevices.value.length} 个设备吗？`,
      '批量添加确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )

    // 将发现的设备转换为DeviceConfig格式（修正：使用PluginReference结构）
    const devicesToAdd: DeviceConfig[] = selectedDevices.value.map(device => ({
      asset: `bacnet_${device.device_id}`,
      name: device.device_name || `BACnet Device ${device.device_id}`,
      description: `${device.vendor_name || 'Unknown'} - ${device.model_name || 'Unknown'}`,
      enabled: true,
      plugin: {
        name: 'bacnet',
        config: {
          host: device.address,
          port: device.port,
          device_id: device.device_id,
          timeout: 5,
          interval: 1
        }
      },
      points: []  // 新设备初始没有点位，后续通过点位发现添加
    }))

    const response = await deviceApi.batchCreate(devicesToAdd)  // 修正：方法名应该是batchCreate而不是batchCreateDevices

    if (response.succeeded > 0) {
      ElMessage.success(`成功添加 ${response.succeeded} 个设备`)
      emit('success')
      handleClose()
    } else {
      ElMessage.error('批量添加失败')
    }

    if (response.failed > 0) {
      ElMessage.warning(`${response.failed} 个设备添加失败`)
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      const detail = error?.response?.data?.detail || error?.message || '未知错误'
      ElMessage.error(`批量添加失败: ${detail}`)
    }
  }
}

const handleClose = () => {
  emit('close')
}

// 监听对话框打开，获取网卡列表
watch(() => props.visible, async (visible) => {
  if (visible) {
    try {
      networkInterfaces.value = await deviceApi.getNetworkInterfaces()
      // 默认选择最高优先级的网卡（第一个，已按有线>无线>其他排序）
      if (networkInterfaces.value.length > 0) {
        selectedInterfaceIp.value = networkInterfaces.value[0].ip_address
        console.log('自动选择最高优先级网卡:', networkInterfaces.value[0].name, networkInterfaces.value[0].ip_address)
      } else {
        selectedInterfaceIp.value = ''
        ElMessage.warning('未找到可用的IPv4网卡')
      }
    } catch (error: any) {
      console.error('获取网卡列表失败:', error)
      ElMessage.error('获取网卡列表失败')
    }
  }
})
</script>

<template>
  <el-dialog
    v-model="props.visible"
    title="设备发现 - 步骤 2/3"
    width="700px"
    @close="handleClose"
  >
    <!-- 搜索配置 -->
    <el-card shadow="never" class="mb-4">
      <template #header>
        <div class="card-header">
          <span>发现配置</span>
        </div>
      </template>

      <el-form label-width="120px">
        <el-form-item label="选择网卡">
          <el-select
            v-model="selectedInterfaceIp"
            placeholder="自动选择默认网卡"
            clearable
            class="w-full"
          >
            <el-option
              v-for="nic in networkInterfaces"
              :key="nic.ip_address"
              :label="`${nic.name} (${nic.ip_address}/${nic.network_prefix})`"
              :value="nic.ip_address"
            >
              <div style="display: flex; justify-content: space-between;">
                <span>{{ nic.name }}</span>
                <span style="color: #8492a6; font-size: 13px;">
                  {{ nic.ip_address }}/{{ nic.network_prefix }}
                  <el-tag v-if="nic.priority === 1" size="small" type="success">有线</el-tag>
                  <el-tag v-if="nic.priority === 2" size="small" type="warning">无线</el-tag>
                </span>
              </div>
            </el-option>
          </el-select>
          <el-text type="info" size="small" class="mt-1">
            多网卡环境下建议指定网卡
          </el-text>
        </el-form-item>

        <el-form-item label="网络范围">
          <el-input
            v-model="networkRange"
            placeholder="如: 192.168.1.0/24 (可选)"
            clearable
          />
          <el-text type="info" size="small" class="mt-1">
            不填写则广播到所有网段
          </el-text>
        </el-form-item>

        <el-form-item label="设备ID范围">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-input-number
                v-model="deviceIdRangeMin"
                placeholder="最小ID"
                :min="0"
                clearable
              />
            </el-col>
            <el-col :span="12">
              <el-input-number
                v-model="deviceIdRangeMax"
                placeholder="最大ID"
                :min="0"
                clearable
              />
            </el-col>
          </el-row>
          <el-text type="info" size="small" class="mt-1">
            不填写则发现所有设备ID
          </el-text>
        </el-form-item>

        <el-form-item label="超时时间">
          <el-input-number
            v-model="timeout"
            :min="0.1"
            :max="30"
            :step="0.5"
            :precision="1"
          />
          <el-text type="info" size="small" class="ml-2">
            秒 (推荐: 5-10秒)
          </el-text>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 搜索按钮和进度 -->
    <el-card shadow="never" class="mb-4">
      <el-button
        type="primary"
        :icon="Search"
        :loading="searching"
        @click="handleDiscoverDevices"
        size="large"
        class="w-full mb-4"
      >
        {{ searching ? '搜索中...' : '开始发现设备' }}
      </el-button>

      <!-- 实时显示发现数量 -->
      <el-text v-if="searching" type="info" size="large">
        正在发送Who-Is广播，等待设备响应...
      </el-text>
      <el-text v-else-if="discoveredDevices.length > 0" type="success" size="large">
        已发现 {{ discoveredDevices.length }} 个设备
      </el-text>
    </el-card>

    <!-- 发现的设备列表 -->
    <el-card shadow="never" v-if="discoveredDevices.length > 0">
      <template #header>
        <div class="card-header">
          <span>发现设备列表 (共 {{ discoveredDevices.length }} 个)</span>
          <el-text type="info" size="small">已选择: {{ selectedCount }} 个</el-text>
        </div>
      </template>

      <el-table
        :data="discoveredDevices"
        @selection-change="handleSelectionChange"
        max-height="400"
        stripe
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="device_id" label="设备ID" width="100" />
        <el-table-column label="地址" width="180">
          <template #default="{ row }">
            {{ row.address }}:{{ row.port }}
          </template>
        </el-table-column>
        <el-table-column prop="device_name" label="设备名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="vendor_name" label="厂商" min-width="120" show-overflow-tooltip />
        <el-table-column prop="model_name" label="型号" min-width="120" show-overflow-tooltip />
        <el-table-column prop="object_count" label="对象数" width="80" />

        <!-- 操作列 -->
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="handleQuickAddDevice(row)"
            >
              添加
            </el-button>
            <el-button
              type="warning"
              size="small"
              @click="handleCustomizeDevice(row)"
            >
              自定义
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4">
        <el-checkbox
          v-model="selectAll"
          @change="handleSelectAll"
          :indeterminate="selectedCount > 0 && selectedCount < discoveredDevices.length"
        >
          全选
        </el-checkbox>
      </div>
    </el-card>

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button
          type="primary"
          :icon="Upload"
          @click="handleBatchAdd"
          :disabled="selectedCount === 0"
        >
          批量添加全部 ({{ selectedCount }})
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.w-full {
  width: 100%;
}

.mb-4 {
  margin-bottom: 16px;
}

.mt-1 {
  margin-top: 4px;
}

.mt-4 {
  margin-top: 16px;
}

.ml-2 {
  margin-left: 8px;
}
</style>