<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, RefreshRight, Plus, Edit, CircleCheck } from '@element-plus/icons-vue'
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

// 当前步骤 (0: 配置, 1: 搜索中, 2: 搜索结果)
const currentStep = ref(0)

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
  // 切换到搜索中步骤
  currentStep.value = 1
  searching.value = true
  discoveredDevices.value = []
  selectedDevices.value = []

  // 记录开始时间，确保用户能看到搜索动画
  const startTime = Date.now()
  const minDisplayTime = 1500 // 最少显示1.5秒的搜索动画

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

    // 计算已经过去的时间
    const elapsedTime = Date.now() - startTime
    // 如果搜索太快，等待剩余时间，确保用户能看到搜索动画
    if (elapsedTime < minDisplayTime) {
      await new Promise(resolve => setTimeout(resolve, minDisplayTime - elapsedTime))
    }

    if (response.success) {
      discoveredDevices.value = response.devices
      // 切换到结果步骤（即使发现0个设备也显示结果页面）
      currentStep.value = 2

      if (response.total === 0) {
        ElMessage.warning('未发现任何BACnet设备，请检查网络连接或调整搜索参数')
      } else {
        ElMessage.success(`发现 ${response.total} 个BACnet设备`)
      }
    } else {
      ElMessage.error('设备发现失败')
      // 返回配置步骤
      currentStep.value = 0
    }
  } catch (error: any) {
    // 计算已经过去的时间
    const elapsedTime = Date.now() - startTime
    // 如果搜索太快，等待剩余时间
    if (elapsedTime < minDisplayTime) {
      await new Promise(resolve => setTimeout(resolve, minDisplayTime - elapsedTime))
    }

    const detail = error?.response?.data?.detail || error?.message || '未知错误'
    ElMessage.error(`设备发现失败: ${detail}`)
    // 返回配置步骤
    currentStep.value = 0
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
  // 重置步骤状态
  currentStep.value = 0
  emit('close')
}

// 重新搜索（返回配置步骤）
const handleResearch = () => {
  currentStep.value = 0
  discoveredDevices.value = []
  selectedDevices.value = []
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
    title="BACnet 设备发现"
    width="900px"
    @close="handleClose"
  >
    <!-- 步骤条 -->
    <el-steps :active="currentStep" align-center class="mb-6">
      <el-step title="配置参数" description="设置搜索参数" />
      <el-step title="搜索设备" description="发送广播搜索" />
      <el-step title="查看结果" description="选择并添加设备" />
    </el-steps>

    <!-- 步骤 0: 配置参数 -->
    <div v-show="currentStep === 0" class="step-content">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>搜索配置</span>
          </div>
        </template>

        <el-form label-width="120px">
          <el-form-item label="选择网卡">
            <el-select
              v-model="selectedInterfaceIp"
              placeholder="请选择网卡或自动选择最优网卡"
              clearable
              class="w-full"
            >
              <el-option
                v-for="nic in networkInterfaces"
                :key="nic.ip_address"
                :label="`${nic.name} (${nic.ip_address})`"
                :value="nic.ip_address"
              />
            </el-select>
            <el-text type="info" size="small" class="mt-1">
              多网卡环境下建议指定网卡，默认自动选择有线网卡
            </el-text>
          </el-form-item>

          <el-form-item label="网络范围">
            <el-input
              v-model="networkRange"
              placeholder="192.168.1.0/24 (可选，不填则全网广播)"
              clearable
            />
          </el-form-item>

          <el-form-item label="设备ID范围">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-input-number
                  v-model="deviceIdRangeMin"
                  placeholder="最小值"
                  :min="0"
                  clearable
                  class="w-full"
                  controls-position="right"
                />
                <el-text type="info" size="small" class="mt-1">最小ID</el-text>
              </el-col>
              <el-col :span="12">
                <el-input-number
                  v-model="deviceIdRangeMax"
                  placeholder="最大值"
                  :min="0"
                  clearable
                  class="w-full"
                  controls-position="right"
                />
                <el-text type="info" size="small" class="mt-1">最大ID</el-text>
              </el-col>
            </el-row>
            <el-text type="info" size="small" class="mt-1 block">
              不填写则搜索所有设备ID (范围: 0-4194303)
            </el-text>
          </el-form-item>

          <el-form-item label="超时时间">
            <el-input-number
              v-model="timeout"
              :min="0.1"
              :max="30"
              :step="0.5"
              :precision="1"
              controls-position="right"
            />
            <span class="unit-text">秒</span>
            <el-text type="info" size="small" class="ml-2">
              推荐: 5-10秒
            </el-text>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 步骤 1: 搜索中 -->
    <div v-show="currentStep === 1" class="step-content">
      <el-card shadow="never" class="searching-card">
        <div class="searching-animation">
          <el-icon class="searching-icon" :size="80">
            <Search />
          </el-icon>
          <div class="searching-text">
            <h3>正在搜索 BACnet 设备...</h3>
            <p class="sub-text">系统正在发送 Who-Is 广播，等待设备响应</p>
            <p class="timeout-text">预计等待时间: {{ timeout }} 秒</p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 步骤 2: 搜索结果 -->
    <div v-show="currentStep === 2" class="step-content">
      <!-- 结果统计卡片 -->
      <el-card shadow="never" class="mb-4 result-summary-card">
        <div class="result-summary">
          <div class="summary-item">
            <el-icon :size="32" color="#67C23A"><Search /></el-icon>
            <div class="summary-text">
              <div class="summary-number">{{ discoveredDevices.length }}</div>
              <div class="summary-label">发现设备</div>
            </div>
          </div>
          <el-divider direction="vertical" />
          <div class="summary-item">
            <el-icon :size="32" color="#409EFF"><CircleCheck /></el-icon>
            <div class="summary-text">
              <div class="summary-number">{{ selectedCount }}</div>
              <div class="summary-label">已选择</div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 设备列表 -->
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>设备列表</span>
            <el-button
              type="primary"
              :icon="RefreshRight"
              size="small"
              @click="handleResearch"
            >
              重新搜索
            </el-button>
          </div>
        </template>

        <!-- 空状态 -->
        <el-empty
          v-if="discoveredDevices.length === 0"
          description="未发现任何BACnet设备"
          :image-size="120"
        >
          <el-button type="primary" @click="handleResearch">调整参数重新搜索</el-button>
        </el-empty>

        <!-- 设备表格 -->
        <el-table
          v-else
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

          <!-- 操作列 -->
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ row }">
              <div class="operation-buttons">
                <el-tooltip content="快速添加" placement="top">
                  <el-button
                    type="primary"
                    :icon="Plus"
                    size="small"
                    circle
                    @click="handleQuickAddDevice(row)"
                  />
                </el-tooltip>
                <el-tooltip content="自定义添加" placement="top">
                  <el-button
                    type="warning"
                    :icon="Edit"
                    size="small"
                    circle
                    @click="handleCustomizeDevice(row)"
                    class="ml-4"
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="discoveredDevices.length > 0" class="mt-4">
          <el-checkbox
            v-model="selectAll"
            @change="handleSelectAll"
            :indeterminate="selectedCount > 0 && selectedCount < discoveredDevices.length"
          >
            全选
          </el-checkbox>
        </div>
      </el-card>
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <!-- 步骤 0: 配置 -->
        <template v-if="currentStep === 0">
          <el-button @click="handleClose">取消</el-button>
          <el-button
            type="primary"
            :icon="Search"
            :loading="searching"
            @click="handleDiscoverDevices"
          >
            开始发现设备
          </el-button>
        </template>

        <!-- 步骤 1: 搜索中 -->
        <template v-else-if="currentStep === 1">
          <el-button @click="handleClose" :disabled="searching">取消</el-button>
          <el-button type="primary" :loading="true">搜索中...</el-button>
        </template>

        <!-- 步骤 2: 结果 -->
        <template v-else-if="currentStep === 2">
          <el-button @click="handleClose">关闭</el-button>
          <el-button
            type="primary"
            :icon="CircleCheck"
            @click="handleBatchAdd"
            :disabled="selectedCount === 0"
          >
            批量添加所选 ({{ selectedCount }})
          </el-button>
        </template>
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
  gap: 12px;
}

.w-full {
  width: 100%;
}

.mb-4 {
  margin-bottom: 16px;
}

.mb-6 {
  margin-bottom: 24px;
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

.ml-4 {
  margin-left: 16px;
}

/* 操作按钮向右对齐 */
.operation-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* 单位文本 */
.unit-text {
  margin-left: 8px;
  color: #606266;
  font-size: 14px;
}

/* 块级元素 */
.block {
  display: block;
  width: 100%;
}

/* 步骤内容 */
.step-content {
  min-height: 400px;
}

/* 搜索中动画 */
.searching-card {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.searching-animation {
  text-align: center;
  padding: 60px 0;
}

.searching-icon {
  animation: pulse 2s ease-in-out infinite;
  color: #409EFF;
  margin-bottom: 30px;
}

.searching-text h3 {
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 500;
  color: #303133;
}

.searching-text .sub-text {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #606266;
}

.searching-text .timeout-text {
  margin: 0;
  font-size: 13px;
  color: #909399;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

/* 结果统计卡片 */
.result-summary-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
}

.result-summary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px;
  padding: 20px 0;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.summary-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-number {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  line-height: 1;
}

.summary-label {
  font-size: 13px;
  color: #909399;
}

.el-divider--vertical {
  height: 40px;
}
</style>