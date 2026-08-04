<template>
  <el-dialog
    :model-value="props.visible"
    :title="t('devices.pointDiscoveryTitle')"
    :width="dialogWidth"
    class="x-dialog"
    align-center
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 步骤条 -->
    <div class="steps-compact mb-3">
      <div class="step-item" :class="{ active: currentStep === STEP_CONFIG, completed: currentStep > STEP_CONFIG }">
        <div class="step-circle">1</div>
        <div class="step-text">{{ t('devices.discoveryStep1') }}</div>
      </div>
      <div class="step-line" :class="{ active: currentStep >= STEP_SEARCHING }"></div>
      <div class="step-item" :class="{ active: currentStep === STEP_SEARCHING, completed: currentStep > STEP_SEARCHING }">
        <div class="step-circle">2</div>
        <div class="step-text">{{ t('devices.pointDiscoveryStep2') }}</div>
      </div>
      <div class="step-line" :class="{ active: currentStep >= STEP_RESULT }"></div>
      <div class="step-item" :class="{ active: currentStep === STEP_RESULT }">
        <div class="step-circle">3</div>
        <div class="step-text">{{ t('devices.discoveryStep3') }}</div>
      </div>
    </div>

    <!-- 配置参数 -->
    <div v-show="currentStep === STEP_CONFIG" class="step-content">
      <el-card shadow="never" class="search-config-card">
        <template #header>
          <div class="card-header">
            <span class="header-title">{{ t('devices.objectTypeSelection') }}</span>
          </div>
        </template>

        <el-form label-width="80px">
          <el-form-item :label="t('devices.objectType')">
            <div class="object-type-wrapper">
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
              <span class="object-type-hint">
                {{ t('devices.objectTypeHint') }}
              </span>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 搜索中 -->
    <div v-show="currentStep === STEP_SEARCHING" class="step-content">
      <el-card shadow="never" class="searching-card">
        <div class="searching-animation">
          <el-icon class="searching-icon" :size="48">
            <Search />
          </el-icon>
          <div class="searching-text">
            <h3>{{ t('devices.discoveringPoints') }}</h3>
            <p class="sub-text">{{ t('devices.discoveringPointsTip') }}</p>
            <el-progress
              :percentage="searchProgress"
              :status="searchProgress === 100 ? 'success' : undefined"
              class="progress-bar"
            />
          </div>
        </div>
      </el-card>
    </div>

    <!-- 搜索结果 -->
    <div v-show="currentStep === STEP_RESULT" class="step-content">
      <!-- 点位列表 -->
      <el-card shadow="never" class="search-result-card">
        <template #header>
          <div class="card-header">
            <div class="header-left">
              <span class="header-title">{{ t('devices.pointList') }}</span>
              <el-tag type="success">
                {{ t('devices.foundCount', { count: discoveredPoints.length }) }}
              </el-tag>
              <el-tag type="primary">
                {{ t('devices.selectedCount', { count: selectedCount }) }}
              </el-tag>
            </div>
            <el-button
              type="primary"
              :icon="RefreshRight"
              @click="handleResearch"
            >
              {{ t('devices.research') }}
            </el-button>
          </div>
        </template>

        <!-- 搜索过滤 -->
        <div v-if="discoveredPoints.length > 0" class="filter-section mb-2">
          <el-input
            v-model="filterText"
            :placeholder="t('devices.pointFilterPlaceholder')"
            clearable
            :prefix-icon="Search"
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
          :description="t('devices.discoveryNoPoints')"
          :image-size="80"
        >
          <el-button type="primary" @click="handleResearch">{{ t('devices.adjustAndResearch') }}</el-button>
        </el-empty>

        <!-- 搜索无结果 -->
        <el-empty
          v-else-if="filteredPoints.length === 0 && filterText"
          :description="t('devices.noMatchingPoints')"
          :image-size="80"
        >
          <el-button type="primary" @click="handleClearFilter">{{ t('devices.clearSearch') }}</el-button>
        </el-empty>

        <!-- 点位表格 -->
        <el-table
          v-else
          :data="filteredPoints"
          @selection-change="handleSelectionChange"
          max-height="360"
        >
          <el-table-column type="selection" width="48" />
          <el-table-column prop="object_type" :label="t('devices.type')" width="80">
            <template #default="{ row }">
              <el-tag>{{ row.object_type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="object_instance" :label="t('devices.id')" width="80" align="center" />
          <el-table-column prop="object_name" :label="t('devices.name')" min-width="120" show-overflow-tooltip />
          <el-table-column prop="description" :label="t('devices.description')" min-width="100" show-overflow-tooltip />
          <el-table-column prop="writable" :label="t('devices.access')" width="60" align="center">
            <template #default="{ row }">
              <el-tag :type="row.writable ? 'success' : 'info'">
                {{ row.writable ? t('common.write') : t('common.read') }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="filteredPoints.length > 0" class="table-footer">
          <el-checkbox
            v-model="selectAll"
            @change="handleSelectAll"
            :indeterminate="selectedCount > 0 && selectedCount < filteredPoints.length"
          >
            {{ t('devices.selectAllCurrent') }}
          </el-checkbox>
          <span class="selection-count">
            {{ selectedCount }}/{{ filteredPoints.length }}
            {{ t('devices.selectedCount', { count: selectedCount }) }}
          </span>
        </div>
      </el-card>
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <!-- 配置步骤 -->
      <template v-if="currentStep === STEP_CONFIG">
        <el-button @click="handleClose">{{ t('common.cancel') }}</el-button>
        <el-button
          type="primary"
          :icon="Search"
          :loading="searching"
          :disabled="selectedObjectTypes.length === 0"
          @click="handleDiscoverPoints"
        >
          {{ t('devices.startPointDiscovery') }}
        </el-button>
      </template>

      <!-- 搜索中步骤 -->
      <template v-else-if="currentStep === STEP_SEARCHING">
        <el-button @click="handleClose" :disabled="searching">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="true">{{ t('devices.searching') }}</el-button>
      </template>

      <!-- 结果步骤 -->
      <template v-else-if="currentStep === STEP_RESULT">
        <el-button @click="handleClose">{{ t('common.close') }}</el-button>
        <el-button
          :icon="Edit"
          @click="handleBatchEdit"
          :disabled="selectedCount === 0"
        >
          {{ t('devices.batchEditWithCount', { count: selectedCount }) }}
        </el-button>
        <el-button
          type="primary"
          :icon="CircleCheck"
          @click="handleBatchAdd"
          :disabled="selectedCount === 0"
        >
          {{ t('devices.batchAddSelected', { count: selectedCount }) }}
        </el-button>
      </template>
    </template>
  </el-dialog>

  <!-- 批量编辑对话框 -->
  <el-dialog
    v-model="showBatchEditDialog"
    :title="t('devices.batchEdit')"
    width="380px"
    class="x-dialog"
    :close-on-click-modal="false"
  >
    <el-form :model="batchEditForm" label-width="80px">
      <el-form-item :label="t('devices.unit')">
        <el-input v-model="batchEditForm.unit" :placeholder="t('devices.pointDialog.unitPlaceholder')" clearable />
      </el-form-item>
      <el-form-item :label="t('devices.scaleFactor')">
        <el-input-number v-model="batchEditForm.scale" :precision="2" :step="0.1" clearable />
      </el-form-item>
      <el-form-item :label="t('devices.offset')">
        <el-input-number v-model="batchEditForm.offset" :precision="2" :step="0.1" clearable />
      </el-form-item>
      <el-form-item :label="t('devices.highAlarm')">
        <el-input-number v-model="batchEditForm.alarm_high" clearable />
      </el-form-item>
      <el-form-item :label="t('devices.lowAlarm')">
        <el-input-number v-model="batchEditForm.alarm_low" clearable />
      </el-form-item>
    </el-form>

    <el-alert
      type="info"
      :closable="false"
      class="mb-4"
    >
      <template #title>
        {{ t('devices.batchEditHint', { count: selectedCount }) }}
      </template>
    </el-alert>

    <template #footer>
      <el-button @click="showBatchEditDialog = false">{{ t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleBatchEditConfirm">{{ t('common.apply') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, RefreshRight, Edit, CircleCheck } from '@element-plus/icons-vue'
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
const { t } = useI18n()

// 步骤常量
const STEP_CONFIG = 0      // 配置参数
const STEP_SEARCHING = 1   // 搜索中
const STEP_RESULT = 2      // 搜索结果

// 当前步骤
const currentStep = ref(STEP_CONFIG)

// 响应式对话框宽度映射
const DIALOG_WIDTH_MAP = [
  { max: 768, width: '550px' },
  { max: 1024, width: '600px' },
  { max: 1440, width: '650px' },
  { max: Infinity, width: '900px' }
]

const dialogWidth = computed(() => {
  const screenWidth = window.innerWidth
  return DIALOG_WIDTH_MAP.find(item => screenWidth < item.max)?.width ?? '700px'
})

// 默选对象类型
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

/** 根据关键字过滤点位，匹配对象名称、描述、类型和实例编号 */
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

/** 批量编辑对话框显示状态 */
const showBatchEditDialog = ref(false)

/** 批量编辑表单数据，用于在添加点位时覆盖默认属性 */
const batchEditForm = ref({
  unit: '',
  scale: null as number | null,
  offset: null as number | null,
  alarm_high: null as number | null,
  alarm_low: null as number | null
})

/** 计算已选中的点位数量 */
const selectedCount = computed(() => selectedPoints.value.length)

/** 全选当前过滤结果中的点位 */
const handleSelectAll = (val: string | number | boolean) => {
  const checked = Boolean(val)
  if (checked) {
    selectedPoints.value = [...filteredPoints.value]
  } else {
    selectedPoints.value = []
  }
}

/** 处理表格选择变化，同步全选状态 */
const handleSelectionChange = (selection: DiscoveredPoint[]) => {
  selectedPoints.value = selection
  selectAll.value = selection.length === filteredPoints.value.length && filteredPoints.value.length > 0
}

/** 清空搜索过滤条件 */
const handleClearFilter = () => {
  filterText.value = ''
}

/**
 * 执行点位发现
 * 向后端发送发现请求，期间显示进度动画，完成后展示结果列表
 */
const handleDiscoverPoints = async () => {
  if (!props.deviceAsset) {
    ElMessage.warning(t('devices.pleaseSelectDevice'))
    return
  }

  // 切换到搜索中步骤
  currentStep.value = STEP_SEARCHING
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
    await ensureMinDisplayTime(startTime, minDisplayTime)

    if (response.success) {
      discoveredPoints.value = response.points
      currentStep.value = STEP_RESULT

      if (response.total === 0) {
        ElMessage.warning(t('devices.discoveryNoPointsFound'))
      } else {
        ElMessage.success(t('devices.discoveryFoundPoints', { count: response.total }))
      }
    } else {
      ElMessage.error(t('devices.pointDiscoveryFailed'))
      currentStep.value = STEP_CONFIG
    }
  } catch (error: any) {
    // 确保最少显示时间
    await ensureMinDisplayTime(startTime, minDisplayTime)

    const detail = error?.response?.data?.detail || error?.message || t('common.unknownError')
    ElMessage.error(t('devices.pointDiscoveryFailedWithDetail', { detail }))
    currentStep.value = STEP_CONFIG
  } finally {
    searching.value = false
    searchProgress.value = 0
  }
}

/** 重置到配置步骤，清空已发现点位和筛选条件 */
const handleResearch = () => {
  currentStep.value = STEP_CONFIG
  discoveredPoints.value = []
  selectedPoints.value = []
  filterText.value = ''
}

/** 打开批量编辑对话框，对已选点位的公共属性进行批量修改 */
const handleBatchEdit = () => {
  if (selectedPoints.value.length === 0) {
    ElMessage.warning(t('devices.pleaseSelectPointsToEdit'))
    return
  }
  showBatchEditDialog.value = true
}

/** 确认批量编辑（当前仅关闭对话框，实际属性在批量添加时应用） */
const handleBatchEditConfirm = () => {
  showBatchEditDialog.value = false
  ElMessage.success(t('devices.batchEditApplied', { count: selectedPoints.value.length }))
}

/**
 * 将已选点位批量添加到设备
 * 将选中的发现点位转换为 PointConfig 格式，并应用批量编辑中的属性覆盖
 */
const handleBatchAdd = async () => {
  if (selectedPoints.value.length === 0) {
    ElMessage.warning(t('devices.pleaseSelectPointsToAdd'))
    return
  }

  try {
    await ElMessageBox.confirm(
      t('devices.batchAddPointsConfirm', { count: selectedPoints.value.length }),
      t('devices.batchAddConfirmTitle'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
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
      ElMessage.error(t('devices.batchAddFailed'))
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      const detail = error?.response?.data?.detail || error?.message || t('common.unknownError')
      ElMessage.error(t('devices.batchAddFailedWithDetail', { detail }))
    }
  }
}

/**
 * 确保最少显示时间的通用工具
 * @param startTime 开始时间戳
 * @param minDuration 最少显示时长（毫秒）
 */
async function ensureMinDisplayTime(startTime: number, minDuration: number): Promise<void> {
  const elapsed = Date.now() - startTime
  if (elapsed < minDuration) {
    await new Promise(resolve => setTimeout(resolve, minDuration - elapsed))
  }
}

/** 重置批量编辑表单 */
function resetBatchEditForm(): void {
  batchEditForm.value = {
    unit: '',
    scale: null,
    offset: null,
    alarm_high: null,
    alarm_low: null
  }
}

/** 关闭弹窗，重置内部状态 */
const handleClose = () => {
  currentStep.value = STEP_CONFIG
  searching.value = false
  searchProgress.value = 0
  discoveredPoints.value = []
  selectedPoints.value = []
  selectAll.value = false
  filterText.value = ''
  showBatchEditDialog.value = false
  resetBatchEditForm()
  emit('close')
}
</script>

<style>
/* 引入 Devices 模块通用弹框样式（需 unscoped，弹框内容 teleport 到 body） */
@import './DialogCommon.css';
</style>

<style scoped>
/* ========== 通用间距工具类 ========== */
.w-full {
  width: 100%;
}

.mb-4 {
  margin-bottom: 16px;
}

.mb-3 {
  margin-bottom: 16px;
}

.mb-2 {
  margin-bottom: 8px;
}

.mt-1 {
  margin-top: 8px;
}

.mt-3 {
  margin-top: 12px;
}

.mt-4 {
  margin-top: 16px;
}

.ml-2 {
  margin-left: 12px;
}

/* ========== 卡片容器与头部 ========== */
:deep(.el-card) {
  border-radius: 12px;
}

.search-config-card {
  background-color: rgba(255, 255, 255, 0.07);
}

.search-result-card {
  background-color: rgba(255, 255, 255, 0.07);
  min-height: 460px;
}

.search-result-card :deep(.el-table),
.search-result-card :deep(.el-table__expanded-cell),
.search-result-card :deep(.el-table th),
.search-result-card :deep(.el-table tr),
.search-result-card :deep(.el-table td) {
  background-color: transparent;
}

.search-result-card :deep(.el-table__body tr:hover > td.el-table__cell) {
  background-color: rgba(255, 255, 255, 0.1);
}

.search-result-card :deep(.el-checkbox__inner) {
  background-color: var(--bg-card);
  border-color: var(--border-base);
}

.search-result-card :deep(.el-checkbox__inner:hover),
.search-result-card :deep(.el-checkbox:hover .el-checkbox__inner),
.search-result-card :deep(.el-table__body tr:hover .el-checkbox__inner) {
  border-color: var(--color-primary);
}

.search-result-card :deep(.el-checkbox__input.is-checked .el-checkbox__inner),
.search-result-card :deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.search-result-card :deep(.el-checkbox__input.is-focus .el-checkbox__inner) {
  border-color: var(--color-primary);
}

:deep(.el-card__header) {
  padding: 16px 20px;
}

:deep(.el-card__body) {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.header-left .el-tag {
  font-size: 13px;
}

/* ========== 步骤条 ========== */
.steps-compact {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0 16px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--border-base);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
}

.step-item.active .step-circle {
  background: var(--color-primary);
  color: white;
}

.step-item.completed .step-circle {
  background: var(--color-success);
  color: white;
}

.step-text {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
  transition: all 0.3s;
}

.step-item.active .step-text {
  color: var(--color-primary);
  font-weight: 600;
}

.step-item.completed .step-text {
  color: var(--color-success);
}

.step-line {
  width: 40px;
  height: 2px;
  background: var(--border-base);
  margin: 0 10px;
  transition: all 0.3s;
}

.step-line.active {
  background: var(--color-primary);
}

/* ========== 步骤内容与搜索动画 ========== */
.step-content {
  min-height: 240px;
}

.searching-card {
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.07);
}

.searching-animation {
  text-align: center;
  padding: 24px 0;
}

.searching-icon {
  animation: pulse 2s ease-in-out infinite;
  color: var(--color-primary);
  margin-bottom: 16px;
}

.searching-text h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
}

.searching-text .sub-text {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: var(--text-regular);
}

.progress-bar {
  width: 240px;
  margin: 0 auto;
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

/* ========== 表单样式 ========== */
.el-form-item {
  margin-bottom: 18px;
}

.el-form-item :deep(.el-form-item__label) {
  font-size: 14px;
  padding-right: 12px;
  line-height: 32px;
}

.el-form-item :deep(.el-form-item__content) {
  line-height: normal;
  overflow: visible;
}

.el-form-item :deep(.el-text) {
  font-size: 13px;
}

/* 多行内容的 form-item，label 顶部对齐 */
.el-form-item:has(.object-type-wrapper) :deep(.el-form-item__label) {
  line-height: 1.5;
  padding-top: 4px;
}

/* ========== 紧凑复选框组 ========== */
.object-type-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.object-type-hint {
  display: block;
  width: 100%;
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--el-text-color-secondary);
  white-space: normal;
  word-break: break-all;
  overflow: visible;
}

.compact-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
}

.compact-checkbox-group .el-checkbox {
  margin-right: 0;
}

/* ========== 搜索过滤 ========== */
.filter-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-input {
  width: 100%;
}

/* ========== 表格样式 ========== */
.el-table {
  font-size: 14px;
}

.el-table :deep(.el-table__row) {
  height: 44px;
}

.el-table th {
  font-size: 14px;
  font-weight: 600;
}

.el-table td {
  padding: 8px 0;
}

/* ========== 表格底部 ========== */
.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 4px;
  border-top: 1px solid var(--border-base);
  margin-top: 8px;
}

.selection-count {
  font-size: 13px;
  color: var(--text-secondary);
}

/* ========== 空状态样式 ========== */
.el-empty {
  padding: 20px 0;
}

:deep(.el-empty__description p) {
  font-size: 14px;
  color: var(--text-secondary);
}

/* ========== 响应式适配 ========== */
@media (max-width: 767px) {
  .search-result-card :deep(.el-table) {
    max-height: 260px !important;
  }

  .step-content {
    min-height: 200px !important;
  }

  .el-form-item {
    margin-bottom: 14px;
  }

  .step-circle {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }

  .step-text {
    font-size: 12px;
  }

  .step-line {
    width: 24px;
    margin: 0 6px;
  }

  .compact-checkbox-group {
    gap: 10px 14px;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .search-result-card :deep(.el-table) {
    max-height: 300px !important;
  }

  .step-circle {
    width: 26px;
    height: 26px;
    font-size: 13px;
  }

  .step-text {
    font-size: 13px;
  }

  .el-form-item :deep(.el-form-item__label) {
    font-size: 14px;
    padding-right: 10px;
  }
}

@media (min-width: 1024px) and (max-width: 1439px) {
  .search-result-card :deep(.el-table) {
    max-height: 340px !important;
    font-size: 14px;
  }

  .el-table :deep(.el-table__row) {
    height: 46px;
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
    margin-bottom: 18px;
  }
}

@media (min-width: 1440px) {
  .search-result-card :deep(.el-table) {
    max-height: 380px !important;
    font-size: 14px;
  }

  .el-table :deep(.el-table__row) {
    height: 48px;
  }

  .el-table th {
    font-size: 14px;
  }

  .step-circle {
    width: 30px;
    height: 30px;
    font-size: 15px;
  }

  .step-text {
    font-size: 15px;
  }

  .header-title {
    font-size: 16px;
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .el-form-item :deep(.el-form-item__label) {
    font-size: 15px;
    padding-right: 14px;
  }

  .compact-checkbox-group {
    gap: 14px 18px;
  }
}
</style>
