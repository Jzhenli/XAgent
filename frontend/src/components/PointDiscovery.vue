<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Upload, Edit } from '@element-plus/icons-vue'
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
    selectedPoints.value = [...discoveredPoints.value]
  } else {
    selectedPoints.value = []
  }
}

const handleSelectionChange = (selection: DiscoveredPoint[]) => {
  selectedPoints.value = selection
  selectAll.value = selection.length === discoveredPoints.value.length
}

// 搜索点位
const handleDiscoverPoints = async () => {
  if (!props.deviceAsset) {
    ElMessage.warning('请先选择设备')
    return
  }

  searching.value = true
  searchProgress.value = 0
  discoveredPoints.value = []
  selectedPoints.value = []

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

    if (response.success) {
      discoveredPoints.value = response.points
      ElMessage.success(`发现 ${response.total} 个点位`)
    } else {
      ElMessage.error('点位发现失败')
    }
  } catch (error: any) {
    const detail = error?.response?.data?.detail || error?.message || '未知错误'
    ElMessage.error(`点位发现失败: ${detail}`)
  } finally {
    searching.value = false
    setTimeout(() => {
      searchProgress.value = 0
    }, 1000)
  }
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
    const pointsToAdd: PointConfig[] = selectedPoints.value.map(point => ({
      name: point.object_name,
      description: point.description || `${point.object_type}:${point.object_instance}`,
      data_type: point.data_type,
      enabled: true,
      config: {
        object_type: point.object_type,
        object_instance: point.object_instance,
        writable: point.writable
      },
      metadata: batchEditForm.value.unit ? { unit: batchEditForm.value.unit } : {},
      tags: []
    }))

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
    title="点位发现"
    width="900px"
    @close="handleClose"
  >
    <!-- 对象类型选择 -->
    <el-card shadow="never" class="mb-4">
      <template #header>
        <div class="card-header">
          <span>对象类型选择</span>
        </div>
      </template>
      <el-checkbox-group v-model="selectedObjectTypes">
        <el-checkbox label="analogInput">模拟输入</el-checkbox>
        <el-checkbox label="analogOutput">模拟输出</el-checkbox>
        <el-checkbox label="analogValue">模拟值</el-checkbox>
        <el-checkbox label="binaryInput">二进制输入</el-checkbox>
        <el-checkbox label="binaryOutput">二进制输出</el-checkbox>
        <el-checkbox label="binaryValue">二进制值</el-checkbox>
        <el-checkbox label="multiStateInput">多状态输入</el-checkbox>
        <el-checkbox label="multiStateOutput">多状态输出</el-checkbox>
        <el-checkbox label="multiStateValue">多状态值</el-checkbox>
      </el-checkbox-group>
    </el-card>

    <!-- 搜索按钮和进度 -->
    <el-card shadow="never" class="mb-4">
      <el-button
        type="primary"
        :icon="Search"
        :loading="searching"
        @click="handleDiscoverPoints"
        size="large"
        class="w-full mb-4"
      >
        {{ searching ? '搜索中...' : '开始搜索点位' }}
      </el-button>

      <el-progress
        v-if="searching || searchProgress > 0"
        :percentage="searchProgress"
        :status="searchProgress === 100 ? 'success' : ''"
        class="mb-2"
      />
      <el-text v-if="searching" type="info">
        正在读取设备对象列表...
      </el-text>
    </el-card>

    <!-- 发现的点位列表 -->
    <el-card shadow="never" v-if="discoveredPoints.length > 0">
      <template #header>
        <div class="card-header">
          <span>发现点位列表 (共 {{ discoveredPoints.length }} 个)</span>
          <el-text type="info" size="small">已选择: {{ selectedCount }} 个</el-text>
        </div>
      </template>

      <el-table
        :data="discoveredPoints"
        @selection-change="handleSelectionChange"
        max-height="400"
        stripe
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="object_type" label="对象类型" width="120" />
        <el-table-column prop="object_instance" label="实例ID" width="80" />
        <el-table-column prop="object_name" label="对象名称" min-width="150" />
        <el-table-column prop="description" label="描述" min-width="120" show-overflow-tooltip />
        <el-table-column prop="writable" label="可写" width="60">
          <template #default="{ row }">
            <el-tag :type="row.writable ? 'success' : 'info'" size="small">
              {{ row.writable ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="data_type" label="数据类型" width="100" />
      </el-table>

      <div class="mt-4">
        <el-checkbox
          v-model="selectAll"
          @change="handleSelectAll"
          :indeterminate="selectedCount > 0 && selectedCount < discoveredPoints.length"
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
          :icon="Edit"
          @click="handleBatchEdit"
          :disabled="selectedCount === 0"
        >
          批量编辑 ({{ selectedCount }})
        </el-button>
        <el-button
          type="primary"
          :icon="Upload"
          @click="handleBatchAdd"
          :disabled="selectedCount === 0"
        >
          批量添加已选 ({{ selectedCount }})
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 批量编辑对话框 -->
  <el-dialog
    v-model="showBatchEditDialog"
    title="批量编辑"
    width="500px"
  >
    <el-form :model="batchEditForm" label-width="100px">
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

.mb-2 {
  margin-bottom: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mt-4 {
  margin-top: 16px;
}
</style>