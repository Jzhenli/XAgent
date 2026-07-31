<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, RefreshRight, Plus, Edit, CircleCheck } from '@element-plus/icons-vue'
import { deviceApi } from '@/api/devices'
import type { DiscoveredDeviceResponse, DeviceConfig, NetworkInterfaceResponse } from '@/api/types'

const { t } = useI18n()

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

// 对话框宽度自适应
const dialogWidth = computed(() => {
  const screenWidth = window.innerWidth
  if (screenWidth < 768) {
    return '550px' // 小屏幕：紧凑
  } else if (screenWidth < 1024) {
    return '600px' // 中屏幕：适中
  } else if (screenWidth < 1440) {
    return '650px' // 大屏幕：舒适
  } else {
    return '700px' // 超大屏幕：固定上限
  }
})

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
        ElMessage.warning(t('devices.discoveryNoDevicesFound'))
      } else {
        ElMessage.success(t('devices.discoveryFoundDevices', { count: response.total }))
      }
    } else {
      ElMessage.error(t('devices.discoveryFailed'))
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

    const detail = error?.response?.data?.detail || error?.message || t('common.unknownError')
    ElMessage.error(t('devices.discoveryFailedWithDetail', { detail }))
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

    ElMessage.success(t('devices.deviceAddedSuccess', { name: deviceConfig.name }))
    emit('success')

    // 从列表中移除已添加的设备
    const index = discoveredDevices.value.findIndex(d => d.device_id === device.device_id)
    if (index !== -1) {
      discoveredDevices.value.splice(index, 1)
    }
  } catch (error: any) {
    const detail = error?.response?.data?.detail || error?.message || t('common.unknownError')
    ElMessage.error(t('devices.addDeviceFailed', { detail }))
  }
}

// 自定义添加（点击[自定义]按钮）
const handleCustomizeDevice = (device: DiscoveredDeviceResponse) => {
  emit('customize', device)
}

// 批量添加设备
const handleBatchAdd = async () => {
  if (selectedDevices.value.length === 0) {
    ElMessage.warning(t('devices.pleaseSelectDevices'))
    return
  }

  try {
    await ElMessageBox.confirm(
      t('devices.batchAddConfirm', { count: selectedDevices.value.length }),
      t('devices.batchAddConfirmTitle'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
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
      ElMessage.success(t('devices.batchAddSuccess', { count: response.succeeded }))
      emit('success')
      handleClose()
    } else {
      ElMessage.error(t('devices.batchAddFailed'))
    }

    if (response.failed > 0) {
      ElMessage.warning(t('devices.batchAddPartialFailed', { count: response.failed }))
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      const detail = error?.response?.data?.detail || error?.message || t('common.unknownError')
      ElMessage.error(t('devices.batchAddFailedWithDetail', { detail }))
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
        ElMessage.warning(t('devices.noNetworkInterface'))
      }
    } catch (error: any) {
      console.error('获取网卡列表失败:', error)
      ElMessage.error(t('devices.getNetworkInterfacesFailed'))
    }
  }
})
</script>

<template>
  <el-dialog
    :model-value="props.visible"
    :title="t('devices.deviceDiscovery')"
    :width="dialogWidth"
    @close="handleClose"
  >
    <!-- 步骤条 -->
    <div class="steps-compact mb-3">
      <div class="step-item" :class="{ active: currentStep === 0, completed: currentStep > 0 }">
        <div class="step-circle">1</div>
        <div class="step-text">{{ t('devices.discoveryStep1') }}</div>
      </div>
      <div class="step-line" :class="{ active: currentStep >= 1 }"></div>
      <div class="step-item" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
        <div class="step-circle">2</div>
        <div class="step-text">{{ t('devices.discoveryStep2') }}</div>
      </div>
      <div class="step-line" :class="{ active: currentStep >= 2 }"></div>
      <div class="step-item" :class="{ active: currentStep === 2 }">
        <div class="step-circle">3</div>
        <div class="step-text">{{ t('devices.discoveryStep3') }}</div>
      </div>
    </div>

    <!-- 步骤 0: 配置参数 -->
    <div v-show="currentStep === 0" class="step-content">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span class="header-title">{{ t('devices.discoverySearchConfig') }}</span>
          </div>
        </template>

        <el-form label-width="80px" size="small">
          <el-form-item :label="t('devices.discoverySelectNic')">
            <el-select
              v-model="selectedInterfaceIp"
              :placeholder="t('devices.discoverySelectNicPlaceholder')"
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
            <div class="form-tip">{{ t('devices.discoveryNicTip') }}</div>
          </el-form-item>

          <el-form-item :label="t('devices.discoveryNetworkRange')">
            <el-input
              v-model="networkRange"
              :placeholder="t('devices.discoveryNetworkRangePlaceholder')"
              clearable
            />
          </el-form-item>

          <el-form-item :label="t('devices.discoveryDeviceIdRange')">
            <el-row :gutter="8">
              <el-col :span="12">
                <el-input-number
                  v-model="deviceIdRangeMin"
                  :placeholder="t('devices.discoveryMinValue')"
                  :min="0"
                  clearable
                  class="w-full"
                  controls-position="right"
                />
                <div class="form-tip">{{ t('devices.discoveryMinId') }}</div>
              </el-col>
              <el-col :span="12">
                <el-input-number
                  v-model="deviceIdRangeMax"
                  :placeholder="t('devices.discoveryMaxValue')"
                  :min="0"
                  clearable
                  class="w-full"
                  controls-position="right"
                />
                <div class="form-tip">{{ t('devices.discoveryMaxId') }}</div>
              </el-col>
            </el-row>
            <div class="form-tip">{{ t('devices.discoveryDeviceIdRangeTip') }}</div>
          </el-form-item>

          <el-form-item :label="t('devices.discoveryTimeout')">
            <el-input-number
              v-model="timeout"
              :min="0.1"
              :max="30"
              :step="0.5"
              :precision="1"
              controls-position="right"
            />
            <span class="unit-text">{{ t('devices.discoverySeconds') }}</span>
            <div class="form-tip inline">{{ t('devices.discoveryTimeoutTip') }}</div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 步骤 1: 搜索中 -->
    <div v-show="currentStep === 1" class="step-content">
      <el-card shadow="never" class="searching-card">
        <div class="searching-animation">
          <el-icon class="searching-icon" :size="35">
            <Search />
          </el-icon>
          <div class="searching-text">
            <h3>{{ t('devices.discoverySearching') }}</h3>
            <p class="sub-text">{{ t('devices.discoverySearchingTip') }}</p>
            <p class="timeout-text">{{ t('devices.discoveryExpectedTime', { timeout }) }}</p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 步骤 2: 搜索结果 -->
    <div v-show="currentStep === 2" class="step-content">
      <!-- 设备列表 -->
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <div class="header-left">
              <span class="header-title">{{ t('devices.discoveryDeviceList') }}</span>
              <el-tag size="small" type="success">{{ discoveredDevices.length }} {{ t('devices.discoveryFound') }}</el-tag>
              <el-tag size="small" type="primary">{{ selectedCount }} {{ t('devices.discoverySelected') }}</el-tag>
            </div>
            <el-button
              type="primary"
              :icon="RefreshRight"
              size="small"
              @click="handleResearch"
            >
              {{ t('devices.discoveryResearch') }}
            </el-button>
          </div>
        </template>

        <!-- 空状态 -->
        <el-empty
          v-if="discoveredDevices.length === 0"
          :description="t('devices.discoveryNoDevices')"
          :image-size="60"
        >
          <el-button type="primary" size="small" @click="handleResearch">{{ t('devices.discoveryAdjustAndRetry') }}</el-button>
        </el-empty>

        <!-- 设备表格 -->
        <el-table
          v-else
          :data="discoveredDevices"
          @selection-change="handleSelectionChange"
          max-height="160"
          stripe
          size="small"
        >
          <el-table-column type="selection" width="40" />
          <el-table-column prop="device_id" :label="t('devices.discoveryDeviceId')" width="70" />
          <el-table-column :label="t('devices.discoveryAddress')" width="130">
            <template #default="{ row }">
              {{ row.address }}:{{ row.port }}
            </template>
          </el-table-column>
          <el-table-column prop="device_name" :label="t('devices.discoveryDeviceName')" min-width="100" show-overflow-tooltip />
          <el-table-column prop="vendor_name" :label="t('devices.discoveryVendor')" min-width="80" show-overflow-tooltip />
          <el-table-column prop="model_name" :label="t('devices.discoveryModel')" min-width="80" show-overflow-tooltip />

          <!-- 操作列 -->
          <el-table-column :label="t('common.actions')" width="70" fixed="right">
            <template #default="{ row }">
              <div class="operation-buttons">
                <el-tooltip :content="t('devices.discoveryQuickAdd')" placement="top">
                  <el-button
                    type="primary"
                    :icon="Plus"
                    size="small"
                    circle
                    @click="handleQuickAddDevice(row)"
                  />
                </el-tooltip>
                <el-tooltip :content="t('devices.discoveryCustomizeAdd')" placement="top">
                  <el-button
                    type="warning"
                    :icon="Edit"
                    size="small"
                    circle
                    @click="handleCustomizeDevice(row)"
                    class="ml-2"
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="discoveredDevices.length > 0" class="table-footer">
          <el-checkbox
            v-model="selectAll"
            @change="handleSelectAll"
            size="small"
            :indeterminate="selectedCount > 0 && selectedCount < discoveredDevices.length"
          >
            {{ t('devices.discoverySelectAll') }}
          </el-checkbox>
          <span class="selection-count">{{ selectedCount }}/{{ discoveredDevices.length }} {{ t('devices.discoverySelected') }}</span>
        </div>
      </el-card>
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <!-- 步骤 0: 配置 -->
        <template v-if="currentStep === 0">
          <el-button size="small" @click="handleClose">{{ t('common.cancel') }}</el-button>
          <el-button
            size="small"
            type="primary"
            :icon="Search"
            :loading="searching"
            @click="handleDiscoverDevices"
          >
            {{ t('devices.discoveryStart') }}
          </el-button>
        </template>

        <!-- 步骤 1: 搜索中 -->
        <template v-else-if="currentStep === 1">
          <el-button size="small" @click="handleClose" :disabled="searching">{{ t('common.cancel') }}</el-button>
          <el-button size="small" type="primary" :loading="true">{{ t('devices.discoverySearching') }}...</el-button>
        </template>

        <!-- 步骤 2: 结果 -->
        <template v-else-if="currentStep === 2">
          <el-button size="small" @click="handleClose">{{ t('common.close') }}</el-button>
          <el-button
            size="small"
            type="primary"
            :icon="CircleCheck"
            @click="handleBatchAdd"
            :disabled="selectedCount === 0"
          >
            {{ t('devices.discoveryBatchAdd', { count: selectedCount }) }}
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

.header-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.header-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.header-left .el-tag {
  font-size: 11px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.w-full {
  width: 100%;
}

.mb-3 {
  margin-bottom: 8px;
}

.mb-4 {
  margin-bottom: 10px;
}

.mt-1 {
  margin-top: 4px;
}

.ml-2 {
  margin-left: 8px;
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
  color: var(--el-text-color-regular);
  font-size: 13px;
}

/* 块级元素 */
.block {
  display: block;
  width: 100%;
}

/* 表单提示文本 */
.form-tip {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  line-height: 1.4;
  margin-top: 2px;
}

.form-tip.inline {
  display: inline;
  margin-top: 0;
  margin-left: 8px;
}

/* 紧凑步骤条 */
.steps-compact {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 0;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.step-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--el-border-color);
  color: var(--el-text-color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.3s;
}

.step-item.active .step-circle {
  background: var(--el-color-primary);
  color: white;
}

.step-item.completed .step-circle {
  background: var(--el-color-success);
  color: white;
}

.step-text {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  font-weight: 500;
  transition: all 0.3s;
}

.step-item.active .step-text {
  color: var(--el-color-primary);
  font-weight: 600;
}

.step-item.completed .step-text {
  color: var(--el-color-success);
}

.step-line {
  width: 25px;
  height: 2px;
  background: var(--el-border-color);
  margin: 0 5px;
  transition: all 0.3s;
}

.step-line.active {
  background: var(--el-color-primary);
}

/* 步骤内容 */
.step-content {
  min-height: 200px;
}

/* 表单紧凑样式 */
.el-form-item {
  margin-bottom: 12px;
}

.el-form-item :deep(.el-form-item__label) {
  font-size: 12px;
  padding-right: 8px;
}

/* 搜索中动画 */
.searching-card {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.searching-animation {
  text-align: center;
  padding: 15px 0;
}

.searching-icon {
  animation: pulse 2s ease-in-out infinite;
  color: var(--el-color-primary);
  margin-bottom: 10px;
}

.searching-text h3 {
  margin: 0 0 6px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.searching-text .sub-text {
  margin: 0 0 6px 0;
  font-size: 11px;
  color: var(--el-text-color-regular);
}

.searching-text .timeout-text {
  margin: 0;
  font-size: 11px;
  color: var(--el-text-color-secondary);
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

/* 表格紧凑样式 */
.el-table {
  font-size: 11px;
}

.el-table :deep(.el-table__row) {
  height: 32px;
}

.el-table th {
  font-size: 11px;
  font-weight: 600;
}

.el-table td {
  padding: 4px 0;
}

/* 表格底部 */
.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-top: 1px solid var(--el-border-color-light);
  margin-top: 4px;
}

.selection-count {
  font-size: 11px;
  color: var(--el-text-color-secondary);
}

/* 空状态样式调整 */
.el-empty {
  padding: 8px 0;
}

/* 响应式设计 - 保持合理比例 */
/* 小屏幕适配（<768px） */
@media (max-width: 767px) {
  .el-table {
    max-height: 140px !important;
  }

  .step-content {
    min-height: 180px !important;
  }

  .el-form-item {
    margin-bottom: 10px;
  }

  .el-form-item :deep(.el-form-item__label) {
    font-size: 11px;
    padding-right: 6px;
  }
}

/* 中屏幕适配（768px-1023px） */
@media (min-width: 768px) and (max-width: 1023px) {
  .el-table {
    max-height: 180px !important;
  }

  .step-circle {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }

  .step-text {
    font-size: 12px;
  }

  .el-form-item :deep(.el-form-item__label) {
    font-size: 13px;
    padding-right: 10px;
  }
}

/* 大屏幕适配（1024px-1439px） */
@media (min-width: 1024px) and (max-width: 1439px) {
  .el-table {
    max-height: 200px !important;
    font-size: 12px;
  }

  .el-table :deep(.el-table__row) {
    height: 36px;
  }

  .step-circle {
    width: 26px;
    height: 26px;
    font-size: 13px;
  }

  .step-text {
    font-size: 13px;
  }

  .header-title {
    font-size: 14px;
  }

  .el-form-item {
    margin-bottom: 14px;
  }

  .el-form-item :deep(.el-form-item__label) {
    font-size: 13px;
    padding-right: 10px;
  }
}

/* 超大屏幕适配（≥1440px） */
@media (min-width: 1440px) {
  .el-table {
    max-height: 220px !important;
    font-size: 13px;
  }

  .el-table :deep(.el-table__row) {
    height: 40px;
  }

  .el-table th {
    font-size: 13px;
  }

  .step-circle {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }

  .step-text {
    font-size: 14px;
  }

  .header-title {
    font-size: 15px;
  }

  .el-form-item {
    margin-bottom: 16px;
  }

  .el-form-item :deep(.el-form-item__label) {
    font-size: 14px;
    padding-right: 12px;
  }

  .form-tip {
    font-size: 12px;
  }
}
</style>
