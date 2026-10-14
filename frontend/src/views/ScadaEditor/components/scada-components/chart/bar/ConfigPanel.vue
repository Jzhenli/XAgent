<template>
  <div class="config-section">
    <div class="section-title">{{ t('componentConfig.chartConfig') }}</div>

    <!-- 数据相关 -->
    <div class="subsection-title">{{ t('componentConfig.dataSection') }}</div>
    <div class="form-row">
      <div class="form-group form-group--switch">
        <label>{{ t('componentConfig.showLegend') }}</label>
        <el-switch
          :model-value="config.showLegend ?? false"
          @change="updateConfig('showLegend', $event as boolean)"
        />
      </div>
    </div>

    <!-- 序列与柱体 -->
    <div class="subsection-title">{{ t('componentConfig.seriesBarSection') }}</div>

    <div class="series-list">
      <div v-for="(item, index) in seriesItems" :key="index" class="series-item">
        <div class="series-item-header">
          <div class="series-item-header-left">
            <span class="series-item-dot" :style="{ backgroundColor: item.barColor }" />
            <span class="series-item-title">
              {{ getSeriesDisplayName(item, index) }}
            </span>
          </div>
          <span
            v-if="seriesItems.length > 1"
            class="series-item-remove"
            @click="removeSeriesItem(index)"
            >✕</span
          >
        </div>
        <div class="form-group">
          <label>{{ t('componentConfig.seriesName') }}</label>
          <input
            type="text"
            :value="getSeriesDisplayName(item, index)"
            :placeholder="`${t('componentConfig.seriesItem')} ${index + 1}`"
            @change="updateSeriesItem(index, { name: ($event.target as HTMLInputElement).value })"
          />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.device') }}</label>
            <el-select
              :model-value="item.binding?.deviceId ?? ''"
              class="scada-select"
              popper-class="scada-select-dropdown"
              clearable
              :placeholder="t('componentConfig.selectDevice')"
              @update:model-value="handleSeriesDeviceChange(index, $event as string)"
            >
              <el-option
                v-for="device in pointStore.devices"
                :key="device.asset"
                :value="device.asset"
                :label="device.name"
              />
            </el-select>
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.point') }}</label>
            <el-select
              :model-value="item.binding?.pointName ?? ''"
              class="scada-select"
              popper-class="scada-select-dropdown"
              clearable
              :placeholder="t('componentConfig.selectPoint')"
              :disabled="!item.binding?.deviceId"
              @update:model-value="handleSeriesPointChange(index, $event as string)"
            >
              <el-option
                v-for="point in getSeriesPoints(item)"
                :key="point.name"
                :value="point.name"
                :label="point.name + (point.description ? ` (${point.description})` : '')"
              />
            </el-select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.barColor') }}</label>
            <el-color-picker
              :model-value="item.barColor"
              show-alpha
              @active-change="(val) => handleSeriesColorActiveChange(index, val)"
              @change="(val) => handleSeriesColorChange(index, val)"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="add-item-btn" @click="addSeriesItem">
      + {{ t('componentConfig.addSeriesItem') }}
    </div>

    <!-- 全局柱体样式 -->
    <div class="subsection-title">{{ t('componentConfig.styleSection') }}</div>
    <div class="form-group">
      <label>{{ t('componentConfig.backgroundColor') }}</label>
      <el-color-picker
        :model-value="config.backgroundColor"
        show-alpha
        @active-change="handleColorActiveChange('backgroundColor', $event)"
        @change="handleColorChange('backgroundColor', $event)"
      />
    </div>
    <div class="form-row">
      <div class="form-group form-group--switch">
        <label>{{ t('componentConfig.showXAxisLabel') }}</label>
        <el-switch
          :model-value="config.showXAxisLabel"
          @change="updateConfig('showXAxisLabel', $event as boolean)"
        />
      </div>
      <div class="form-group form-group--switch">
        <label>{{ t('componentConfig.showYAxisLabel') }}</label>
        <el-switch
          :model-value="config.showYAxisLabel"
          @change="updateConfig('showYAxisLabel', $event as boolean)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group form-group--switch">
        <label>{{ t('componentConfig.showYAxisLine') }}</label>
        <el-switch
          :model-value="config.showYAxisLine"
          @change="updateConfig('showYAxisLine', $event as boolean)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.xAxisLabelColor') }}</label>
        <el-color-picker
          :model-value="config.xAxisLabelColor"
          show-alpha
          @active-change="handleColorActiveChange('xAxisLabelColor', $event)"
          @change="handleColorChange('xAxisLabelColor', $event)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.xAxisLabelFontSize') }}</label>
        <input
          type="number"
          min="1"
          :value="config.xAxisLabelFontSize"
          @change="updateConfig('xAxisLabelFontSize', +($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.yAxisLabelColor') }}</label>
        <el-color-picker
          :model-value="config.yAxisLabelColor"
          show-alpha
          @active-change="handleColorActiveChange('yAxisLabelColor', $event)"
          @change="handleColorChange('yAxisLabelColor', $event)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.yAxisLabelFontSize') }}</label>
        <input
          type="number"
          min="1"
          :value="config.yAxisLabelFontSize"
          @change="updateConfig('yAxisLabelFontSize', +($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <!-- 柱体形状 -->
    <div class="subsection-title">{{ t('componentConfig.barShapeSection') }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.barWidth') }}</label>
        <input
          type="number"
          min="1"
          :value="barWidthNumeric"
          @change="updateConfig('barWidth', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.barBorderRadius') }}</label>
        <input
          type="number"
          min="0"
          :value="barBorderRadiusNumeric"
          @change="updateConfig('barBorderRadius', +($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.barCount') }}</label>
        <input
          type="number"
          min="1"
          max="200"
          :value="config.barCount ?? 10"
          @change="updateConfig('barCount', +($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePointStore } from '@/stores/points'
import { useScadaConfig } from '../../../../hooks/useScadaEditor'
import type { ScadaComponent, BarChartComponentConfig, BarChartSeriesItem } from '../../../../types'

const { t } = useI18n()
const pointStore = usePointStore()

const props = defineProps<{
  component: ScadaComponent
}>()

const { config, updateConfig } = useScadaConfig(props.component as ScadaComponent<'chart-bar'>)

// ═══════════════════════════════════════════════════════════════════════════════
// 序列管理
// ═══════════════════════════════════════════════════════════════════════════════

const DEFAULT_SERIES_COLORS = [
  '#22D3EE',
  '#e74c3c',
  '#2ecc71',
  '#f39c12',
  '#9b59b6',
  '#1abc9c',
  '#e67e22',
  '#34495e',
  '#16a085',
  '#c0392b',
]

/** 保证 seriesItems 存在且至少有一项；兼容旧版无 seriesItems 数据 */
const seriesItems = computed<BarChartSeriesItem[]>({
  get: () => {
    if (config.value.seriesItems && config.value.seriesItems.length > 0) {
      return config.value.seriesItems
    }
    // 旧数据无 seriesItems：迁移为单序列，颜色沿用旧 barColor
    return [
      {
        name: '',
        binding: null,
        barColor: config.value.barColor || DEFAULT_SERIES_COLORS[0],
      },
    ]
  },
  set: (val) => updateConfig('seriesItems', val),
})

const getSeriesDisplayName = (item: BarChartSeriesItem, index: number) => {
  return item.name?.trim() || `${t('componentConfig.seriesItem')} ${index + 1}`
}

const updateSeriesItem = (index: number, patch: Partial<BarChartSeriesItem>) => {
  const items = [...seriesItems.value]
  items[index] = { ...items[index], ...patch }
  seriesItems.value = items
}

const addSeriesItem = () => {
  const items = [...seriesItems.value]
  const colorIndex = items.length % DEFAULT_SERIES_COLORS.length
  const newItem: BarChartSeriesItem = {
    name: '',
    binding: null,
    barColor: DEFAULT_SERIES_COLORS[colorIndex],
  }
  seriesItems.value = [...items, newItem]
}

const removeSeriesItem = (index: number) => {
  seriesItems.value = seriesItems.value.filter((_, i) => i !== index)
}

const getSeriesPoints = (item: BarChartSeriesItem) => {
  if (!item.binding?.deviceId) return []
  const device = pointStore.devices.find(
    (d) => d.asset === item.binding!.deviceId || d.name === item.binding!.deviceId,
  )
  return device?.points || []
}

const handleSeriesDeviceChange = (index: number, deviceId: string) => {
  updateSeriesItem(index, {
    binding: deviceId ? { deviceId, pointName: '' } : null,
  })
}

const handleSeriesPointChange = (index: number, pointName: string) => {
  const item = seriesItems.value[index]
  if (!item.binding || !pointName) {
    updateSeriesItem(index, { binding: null })
    return
  }
  const points = getSeriesPoints(item)
  const point = points.find((p) => p.name === pointName)
  updateSeriesItem(index, {
    binding: {
      ...item.binding,
      pointName,
      pointDescription: point?.description,
      unit: point?.unit,
    },
  })
}

// ═══════════════════════════════════════════════════════════════════════════════
// 序列颜色缓存
// ═══════════════════════════════════════════════════════════════════════════════

const latestSeriesColor = ref<Record<number, string>>({})

const handleSeriesColorActiveChange = (index: number, val: string | null) => {
  latestSeriesColor.value[index] = val || ''
}

const handleSeriesColorChange = (index: number, val: string | null) => {
  const items = seriesItems.value
  if (!items[index]) return
  const isCleared = val === null || val === undefined || val === ''
  const newColor = isCleared ? '' : latestSeriesColor.value[index] || val || ''
  updateSeriesItem(index, { barColor: newColor })
}

// ═══════════════════════════════════════════════════════════════════════════════
// 柱体形状 numeric 兼容
// ═══════════════════════════════════════════════════════════════════════════════

/** barWidth 兼容 number | string 类型与缺失情况，number input 只认数字 */
const barWidthNumeric = computed(() => {
  const v = config.value.barWidth
  if (typeof v === 'number') return v
  if (typeof v === 'string') {
    const n = Number.parseFloat(v)
    return Number.isFinite(n) ? n : 60
  }
  return 60
})

/** barBorderRadius 兼容 number | number[] 类型与缺失情况 */
const barBorderRadiusNumeric = computed(() => {
  const v = config.value.barBorderRadius
  if (typeof v === 'number') return v
  if (Array.isArray(v) && v.length > 0) return v[0]
  return 4
})

// ═══════════════════════════════════════════════════════════════════════════════
// 全局颜色选择器
// ═══════════════════════════════════════════════════════════════════════════════

type ColorField = keyof Pick<
  BarChartComponentConfig,
  'backgroundColor' | 'xAxisLabelColor' | 'yAxisLabelColor'
>

const colorFields: ColorField[] = ['backgroundColor', 'xAxisLabelColor', 'yAxisLabelColor']

const latestColor = ref<Record<ColorField, string>>({
  backgroundColor: '',
  xAxisLabelColor: '',
  yAxisLabelColor: '',
})

watch(
  () => colorFields.map((field) => config.value[field]),
  (values) => {
    colorFields.forEach((field, index) => {
      latestColor.value[field] = (values[index] as string) || ''
    })
  },
  { immediate: true },
)

const handleColorActiveChange = (field: ColorField, val: string | null) => {
  latestColor.value[field] = val || ''
}

const handleColorChange = (field: ColorField, val: string | null) => {
  const isCleared = val === null || val === undefined || val === ''
  updateConfig(field, isCleared ? '' : latestColor.value[field])
}
</script>

<style scoped>
.config-section {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-light);
}

.config-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-bottom: 10px;
}

.subsection-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 12px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px dashed var(--border-light);
  display: flex;
  align-items: center;
  gap: 6px;
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  font-size: 12px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.form-group input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 6px;
  font-size: 13px;
  background-color: var(--scada-bg-elevated);
  color: var(--text-primary);
}

.form-group input::placeholder {
  color: var(--text-placeholder);
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-group :deep(.el-color-picker__trigger) {
  width: 100%;
}

.form-row {
  display: flex;
  gap: 8px;
}

.form-row .form-group {
  flex: 1;
}

.form-group--switch {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.form-group--switch :deep(.el-switch) {
  margin-top: 6px;
}

/* 序列列表 */
.series-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
}

.series-item {
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 8px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.02);
}

.series-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.series-item-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.series-item-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.series-item-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.series-item-remove {
  font-size: 12px;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.series-item-remove:hover {
  color: #f56c6c;
  background: rgba(245, 108, 108, 0.1);
}

.add-item-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border: 1px dashed rgba(34, 211, 238, 0.3);
  border-radius: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 10px;
}

.add-item-btn:hover {
  border-color: var(--scada-cyan);
  color: var(--scada-cyan);
  background: rgba(34, 211, 238, 0.05);
}
</style>
