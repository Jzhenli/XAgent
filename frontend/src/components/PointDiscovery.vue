<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, RefreshRight, Upload, Edit, CircleCheck } from '@element-plus/icons-vue'
import { deviceApi } from '@/api/devices'
import type { DiscoveredPoint, PointConfig } from '@/api/types'

interface Props {
  deviceAsset: string
  visible: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
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

// 对象类型选择
const objectTypes = ref<string[]>([
  'analogInput',
  'analogOutput',
  'analogValue',
  'binaryInput',
  'binaryOutput',
  'binaryValue',
  'multiStateInput',
  'multiStateOutput',
  'multiStateValue'
])

const selectedObjectTypes = ref<string[]>([
  'analogInput',
  'analogOutput',
  'analogValue'
])

// 搜索状态
const searching = ref(false)
const searchProgress = ref(0)
const discoveredPoints = ref<DiscoveredPoint[]>([])

// 点位选择
const selectedPoints = ref<DiscoveredPoint[]>([])
const selectAll = ref(false)

// 搜索过滤
const filterText = ref('')
const filteredPoints = computed(() => {
  if (!filterText.value) {
    return discoveredPoints.value
  }
  const searchText = filterText.value.toLowerCase()
  return discoveredPoints.value.filter(point =>
    point.object_name?.toLowerCase().includes(searchText) ||
    point.description?.toLowerCase().includes(searchText) ||
    point.object_type?.toLowerCase().includes(searchText) ||
    point.object_instance?.toString().includes(searchText)
  )
})

// 批量编辑对话框
const showBatchEditDialog = ref(false)
const batchEditForm = ref({
  unit: '',
  scale: null as number | null,
  offset: null as number | null,
  alarm_high: null as number | null,
  alarm_low: null as number | null
})

// 计算属性
const selectedCount = computed(() => selectedPoints.value.length)

const handleSelectAll = (val: boolean) => {
  if (val) {
    selectedPoints.value = [...filteredPoints.value]
  } else {
    selectedPoints.value = []
  }
}

const handleSelectionChange = (selection: DiscoveredPoint[]) => {
  selectedPoints.value = selection
  selectAll.value = selection.length === filteredPoints.value.length && filteredPoints.value.length > 0
}

// 清空搜索
const handleClearFilter = () => {
  filterText.value = ''
}

// 搜索点位
const handleDiscoverPoints = async () => {
  if (!props.deviceAsset) {
    ElMessage.warning('请先选择设备')
    return
  }

  // 切换到搜索中步骤
  currentStep.value = 1
  searching.value = true
  searchProgress.value = 0
  discoveredPoints.value = []
  selectedPoints.value = []

  // 记录开始时间
  const startTime = Date.now()
  const minDisplayTime = 1500

  try {
    // 模拟进度更新（实际进度由后端控制）
    const progressInterval = setInterval(() => {
      if (searchProgress.value < 90) {
        searchProgress.value += 10
      }
    }, 500)

    const response = await deviceApi.discoverPoints(props.deviceAsset, {
      object_types: selectedObjectTypes.value
    })

    clearInterval(progressInterval)
    searchProgress.value = 100

    // 确保最少显示时间
    const elapsedTime = Date.now() - startTime
    if (elapsedTime < minDisplayTime) {
      await new Promise(resolve => setTimeout(resolve, minDisplayTime - elapsedTime))
    }

    if (response.success) {
      discoveredPoints.value = response.points
      currentStep.value = 2

      if (response.total === 0) {
        ElMessage.warning('未发现任何点位，请检查对象类型选择')
      } else {
        ElMessage.success(`发现 ${response.total} 个点位`)
      }
    } else {
      ElMessage.error('点位发现失败')
      currentStep.value = 0
    }
  } catch (error: any) {
    const elapsedTime = Date.now() - startTime
    if (elapsedTime < minDisplayTime) {
      await new Promise(resolve => setTimeout(resolve, minDisplayTime - elapsedTime))
    }

    const detail = error?.response?.data?.detail || error?.message || '未知错误'
    ElMessage.error(`点位发现失败: ${detail}`)
    currentStep.value = 0
  } finally {
    searching.value = false
    setTimeout(() => {
      searchProgress.value = 0
    }, 1000)
  }
}

// 重新搜索
const handleResearch = () => {
  currentStep.value = 0
  discoveredPoints.value = []
  selectedPoints.value = []
  filterText.value = ''
}

// 批量编辑
const handleBatchEdit = () => {
  if (selectedPoints.value.length === 0) {
    ElMessage.warning('请先选择要编辑的点位')
    return
  }
  showBatchEditDialog.value = true
}

const handleBatchEditConfirm = () => {
  showBatchEditDialog.value = false
  ElMessage.success(`已对 ${selectedPoints.value.length} 个点位应用批量编辑`)
}

// 批量添加点位
const handleBatchAdd = async () => {
  if (selectedPoints.value.length === 0) {
    ElMessage.warning('请先选择要添加的点位')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要批量添加 ${selectedPoints.value.length} 个点位吗？`,
      '批量添加确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )

    // 将发现的点位转换为PointConfig格式
    const pointsToAdd: PointConfig[] = selectedPoints.value.map(point => {
      const config: Record<string, unknown> = {
        object_type: point.object_type,
        object_instance: point.object_instance,
        writable: point.writable
      }
      if (batchEditForm.value.scale !== null) config.scale = batchEditForm.value.scale
      if (batchEditForm.value.offset !== null) config.offset = batchEditForm.value.offset

      const metadata: Record<string, unknown> = {}
      if (batchEditForm.value.unit) metadata.unit = batchEditForm.value.unit
      if (batchEditForm.value.alarm_high !== null) metadata.alarm_high = batchEditForm.value.alarm_high
      if (batchEditForm.value.alarm_low !== null) metadata.alarm_low = batchEditForm.value.alarm_low

      return {
        name: point.object_name,
        description: point.description || `${point.object_type}:${point.object_instance}`,
        data_type: point.data_type,
        enabled: true,
        config,
        metadata,
        tags: []
      }
    })

    const response = await deviceApi.batchAddPoints(props.deviceAsset, {
      points: pointsToAdd
    })

    if (response.success) {
      ElMessage.success(response.message)
      emit('success')
      handleClose()
    } else {
      ElMessage.error('批量添加失败')
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

const resetForm = () => {
  discoveredPoints.value = []
  selectedPoints.value = []
  selectAll.value = false
  searchProgress.value = 0
  batchEditForm.value = {
    unit: '',
    scale: null,
    offset: null,
    alarm_high: null,
    alarm_low: null
  }
}
</script>

<template>
  <el-dialog
    v-model="props.visible"
    title="BACnet 点位发现"
    :width="dialogWidth"
    @close="handleClose"
  >
    <!-- 步骤条 -->
    <div class="steps-compact mb-3">
      <div class="step-item" :class="{ active: currentStep === 0, completed: currentStep > 0 }">
        <div class="step-circle">1</div>
        <div class="step-text">配置参数</div>
      </div>
      <div class="step-line" :class="{ active: currentStep >= 1 }"></div>
      <div class="step-item" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
        <div class="step-circle">2</div>
        <div class="step-text">搜索点位</div>
      </div>
      <div class="step-line" :class="{ active: currentStep >= 2 }"></div>
      <div class="step-item" :class="{ active: currentStep === 2 }">
        <div class="step-circle">3</div>
        <div class="step-text">查看结果</div>
      </div>
    </div>

    <!-- 步骤 0: 配置参数 -->
    <div v-show="currentStep === 0" class="step-content">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>对象类型选择</span>
          </div>
        </template>

        <el-form label-width="80px">
          <el-form-item label="对象类型">
            <el-checkbox-group v-model="selectedObjectTypes" class="compact-checkbox-group">
              <el-checkbox label="analogInput">AI</el-checkbox>
              <el-checkbox label="analogOutput">AO</el-checkbox>
              <el-checkbox label="analogValue">AV</el-checkbox>
              <el-checkbox label="binaryInput">BI</el-checkbox>
              <el-checkbox label="binaryOutput">BO</el-checkbox>
              <el-checkbox label="binaryValue">BV</el-checkbox>
              <el-checkbox label="multiStateInput">MI</el-checkbox>
              <el-checkbox label="multiStateOutput">MO</el-checkbox>
              <el-checkbox label="multiStateValue">MV</el-checkbox>
            </el-checkbox-group>
            <el-text type="info" size="small" class="mt-1">
              AI/AO/AV: 模拟量 | BI/BO/BV: 二进制 | MI/MO/MV: 多状态
            </el-text>
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
            <h3>正在搜索点位...</h3>
            <p class="sub-text">系统正在读取设备对象列表</p>
            <el-progress
              :percentage="searchProgress"
              :status="searchProgress === 100 ? 'success' : undefined"
              class="progress-bar"
            />
          </div>
        </div>
      </el-card>
    </div>

    <!-- 步骤 2: 搜索结果 -->
    <div v-show="currentStep === 2" class="step-content">
      <!-- 点位列表 -->
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <div class="header-left">
              <span class="header-title">点位列表</span>
              <el-tag type="success" size="small" effect="plain">
                发现 {{ discoveredPoints.length }}
              </el-tag>
              <el-tag type="primary" size="small" effect="plain">
                已选 {{ selectedCount }}
              </el-tag>
            </div>
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

        <!-- 搜索过滤 -->
        <div v-if="discoveredPoints.length > 0" class="filter-section mb-2">
          <el-input
            v-model="filterText"
            placeholder="搜索点位名称、描述、类型或ID..."
            clearable
            :prefix-icon="Search"
            size="small"
            class="filter-input"
          >
            <template #suffix>
              <el-text type="info" size="small">
                {{ filteredPoints.length }}/{{ discoveredPoints.length }}
              </el-text>
            </template>
          </el-input>
        </div>

        <!-- 空状态 -->
        <el-empty
          v-if="discoveredPoints.length === 0"
          description="未发现任何点位"
          :image-size="60"
        >
          <el-button type="primary" size="small" @click="handleResearch">调整参数重新搜索</el-button>
        </el-empty>

        <!-- 搜索无结果 -->
        <el-empty
          v-else-if="filteredPoints.length === 0 && filterText"
          description="未找到匹配的点位"
          :image-size="50"
        >
          <el-button type="primary" size="small" @click="handleClearFilter">清空搜索</el-button>
        </el-empty>

        <!-- 点位表格 -->
        <el-table
          v-else
          :data="filteredPoints"
          @selection-change="handleSelectionChange"
          max-height="160"
          stripe
          size="small"
        >
          <el-table-column type="selection" width="40" />
          <el-table-column prop="object_type" label="类型" width="80">
            <template #default="{ row }">
              <el-tag size="small" effect="plain">{{ row.object_type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="object_instance" label="ID" width="50" align="center" />
          <el-table-column prop="object_name" label="名称" min-width="100" show-overflow-tooltip />
          <el-table-column prop="description" label="描述" min-width="80" show-overflow-tooltip />
          <el-table-column prop="writable" label="属性" width="45" align="center">
            <template #default="{ row }">
              <el-tag :type="row.writable ? 'success' : 'info'" size="small" effect="plain">
                {{ row.writable ? '写' : '读' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="filteredPoints.length > 0" class="table-footer">
          <el-checkbox
            v-model="selectAll"
            @change="handleSelectAll"
            :indeterminate="selectedCount > 0 && selectedCount < filteredPoints.length"
            size="small"
          >
            全选当前结果
          </el-checkbox>
          <el-text type="info" size="small">
            {{ selectedCount }}/{{ filteredPoints.length }} 已选
          </el-text>
        </div>
      </el-card>
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <!-- 步骤 0: 配置 -->
        <template v-if="currentStep === 0">
          <el-button size="small" @click="handleClose">取消</el-button>
          <el-button
            size="small"
            type="primary"
            :icon="Search"
            :loading="searching"
            :disabled="selectedObjectTypes.length === 0"
            @click="handleDiscoverPoints"
          >
            开始发现点位
          </el-button>
        </template>

        <!-- 步骤 1: 搜索中 -->
        <template v-else-if="currentStep === 1">
          <el-button size="small" @click="handleClose" :disabled="searching">取消</el-button>
          <el-button size="small" type="primary" :loading="true">搜索中...</el-button>
        </template>

        <!-- 步骤 2: 结果 -->
        <template v-else-if="currentStep === 2">
          <el-button size="small" @click="handleClose">关闭</el-button>
          <el-button
            size="small"
            :icon="Edit"
            @click="handleBatchEdit"
            :disabled="selectedCount === 0"
          >
            批量编辑 ({{ selectedCount }})
          </el-button>
          <el-button
            size="small"
            type="primary"
            :icon="CircleCheck"
            @click="handleBatchAdd"
            :disabled="selectedCount === 0"
          >
            批量添加已选 ({{ selectedCount }})
          </el-button>
        </template>
      </div>
    </template>
  </el-dialog>

  <!-- 批量编辑对话框 -->
  <el-dialog
    v-model="showBatchEditDialog"
    title="批量编辑"
    width="380px"
  >
    <el-form :model="batchEditForm" label-width="80px">
      <el-form-item label="单位">
        <el-input v-model="batchEditForm.unit" placeholder="如: °C, %" clearable />
      </el-form-item>
      <el-form-item label="缩放因子">
        <el-input-number v-model="batchEditForm.scale" :precision="2" :step="0.1" clearable />
      </el-form-item>
      <el-form-item label="偏移量">
        <el-input-number v-model="batchEditForm.offset" :precision="2" :step="0.1" clearable />
      </el-form-item>
      <el-form-item label="报警上限">
        <el-input-number v-model="batchEditForm.alarm_high" clearable />
      </el-form-item>
      <el-form-item label="报警下限">
        <el-input-number v-model="batchEditForm.alarm_low" clearable />
      </el-form-item>
    </el-form>

    <el-alert
      type="info"
      :closable="false"
      class="mb-4"
    >
      <template #title>
        将对 {{ selectedCount }} 个点位应用以上设置
      </template>
    </el-alert>

    <template #footer>
      <el-button @click="showBatchEditDialog = false">取消</el-button>
      <el-button type="primary" @click="handleBatchEditConfirm">应用修改</el-button>
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
  margin-bottom: 10px;
}

.mb-3 {
  margin-bottom: 8px;
}

.mb-2 {
  margin-bottom: 4px;
}

.mt-1 {
  margin-top: 4px;
}

.mt-3 {
  margin-top: 12px;
}

.mt-4 {
  margin-top: 16px;
}

.ml-2 {
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
  background: #e4e7ed;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.3s;
}

.step-item.active .step-circle {
  background: #409EFF;
  color: white;
}

.step-item.completed .step-circle {
  background: #67C23A;
  color: white;
}

.step-text {
  font-size: 11px;
  color: #909399;
  font-weight: 500;
  transition: all 0.3s;
}

.step-item.active .step-text {
  color: #409EFF;
  font-weight: 600;
}

.step-item.completed .step-text {
  color: #67C23A;
}

.step-line {
  width: 25px;
  height: 2px;
  background: #e4e7ed;
  margin: 0 5px;
  transition: all 0.3s;
}

.step-line.active {
  background: #409EFF;
}

/* 步骤内容 */
.step-content {
  min-height: 200px;
}

/* 卡片header优化 */
.header-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.header-title {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}

.header-left .el-tag {
  font-size: 11px;
}

/* 表格底部 */
.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-top: 1px solid #ebeef5;
  margin-top: 4px;
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
  color: #409EFF;
  margin-bottom: 10px;
}

.searching-text h3 {
  margin: 0 0 6px 0;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.searching-text .sub-text {
  margin: 0 0 10px 0;
  font-size: 11px;
  color: #606266;
}

.progress-bar {
  width: 180px;
  margin: 0 auto;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

/* 紧凑的checkbox组 */
.compact-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
}

.compact-checkbox-group .el-checkbox {
  margin-right: 0;
}

/* 搜索过滤样式 */
.filter-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-input {
  width: 100%;
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

  .compact-checkbox-group {
    gap: 8px 12px;
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

  .compact-checkbox-group {
    gap: 14px 18px;
  }
}
</style>