<template>
  <div class="config-section">
    <div class="section-title">{{ t('componentConfig.pieChartConfig') }}</div>

    <!-- 基础样式 -->
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
        <label>{{ t('componentConfig.pieShowDonut') }}</label>
        <el-switch
          :model-value="config.showDonut"
          @change="updateConfig('showDonut', $event as boolean)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.pieInnerRadius') }}</label>
        <input
          type="number"
          min="0"
          max="90"
          :value="localInnerRadius"
          :disabled="config.showDonut === false"
          @input="(e) => localInnerRadius = +(e.target as HTMLInputElement).value"
          @change="commitInnerRadius"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group form-group--switch">
        <label>{{ t('componentConfig.pieShowLabel') }}</label>
        <el-switch
          :model-value="config.showLabel"
          @change="updateConfig('showLabel', $event as boolean)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.pieGap') }}</label>
        <input
          type="number"
          min="0"
          max="20"
          :value="localPieGap"
          @input="(e) => localPieGap = +(e.target as HTMLInputElement).value"
          @change="commitPieGap"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.pieBorderRadius') }}</label>
        <input
          type="number"
          min="0"
          max="50"
          :value="localPieBorderRadius"
          @input="(e) => localPieBorderRadius = +(e.target as HTMLInputElement).value"
          @change="commitPieBorderRadius"
        />
      </div>
    </div>

    <!-- 图例配置 -->
    <div class="subsection-title">{{ t('componentConfig.pieLegendConfig') }}</div>
    <div class="form-row">
      <div class="form-group form-group--switch">
        <label>{{ t('componentConfig.showLegend') }}</label>
        <el-switch
          :model-value="config.showLegend"
          @change="updateConfig('showLegend', $event as boolean)"
        />
      </div>
    </div>
    <template v-if="config.showLegend !== false">
      <div class="form-row">
        <div class="form-group">
          <label>{{ t('componentConfig.pieLegendColor') }}</label>
          <el-color-picker
            :model-value="config.legendColor"
            show-alpha
            @active-change="handleColorActiveChange('legendColor', $event)"
            @change="handleColorChange('legendColor', $event)"
          />
        </div>
        <div class="form-group">
          <label>{{ t('componentConfig.pieLegendFontSize') }}</label>
          <input
            type="number"
            min="8"
            max="32"
            :value="localLegendFontSize"
            @input="(e) => localLegendFontSize = +(e.target as HTMLInputElement).value"
            @change="commitLegendFontSize"
          />
        </div>
      </div>
    </template>

    <!-- 数据项列表 -->
    <div class="subsection-title">{{ t('componentConfig.pieItems') }}</div>
    <div class="items-list">
      <div
        v-for="(item, index) in config.items"
        :key="index"
        class="item-row"
      >
        <el-color-picker
          :model-value="item.color"
          @active-change="(val) => handleItemColorActiveChange(index, val)"
          @change="(val) => handleItemColorChange(index, val)"
          class="item-color"
        />
        <input
          type="text"
          class="item-name"
          :value="item.name"
          @input="(e) => updateItemName(index, (e.target as HTMLInputElement).value)"
        />
        <input
          type="number"
          class="item-value"
          min="0"
          :value="item.value"
          @input="(e) => updateItemValue(index, +(e.target as HTMLInputElement).value)"
        />
        <div class="item-delete" @click="removeItem(index)">
          ✕
        </div>
      </div>
      <div class="item-add" @click="addItem">
        + {{ t('componentConfig.pieAddItem') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScadaConfig } from '../../../../hooks/useScadaEditor'
import type { ScadaComponent, PieChartComponentConfig, PieChartItemConfig } from '../../../../types'

const { t } = useI18n()

const props = defineProps<{
  component: ScadaComponent
}>()

const { config, updateConfig } = useScadaConfig(props.component as ScadaComponent<'chart-pie'>)

// ═══════════════════════════════════════════════════════════════════════════════
// 本地 ref buffer：隔离 config 重渲染（如 mock 数据刷新 mutate items）对输入框的回写干扰
// ═══════════════════════════════════════════════════════════════════════════════

/** innerRadius 兼容 number | string，input 只认数字 */
const localInnerRadius = ref(40)
const localLegendFontSize = ref(12)
const localPieGap = ref(2)
const localPieBorderRadius = ref(6)

/** 从 config.innerRadius 提取数值 */
const parseInnerRadius = (v: unknown): number => {
  if (typeof v === 'number') return v
  if (typeof v === 'string') {
    const n = Number.parseFloat(v.replace('%', ''))
    return Number.isFinite(n) ? n : 40
  }
  return 40
}

/** 初始化 & 外部变更同步：仅在未聚焦时更新（避免覆盖用户正在输入的内容） */
watch(
  () => config.value.innerRadius,
  (v) => { localInnerRadius.value = parseInnerRadius(v) },
  { immediate: true },
)

watch(
  () => config.value.legendFontSize,
  (v) => { localLegendFontSize.value = v ?? 12 },
  { immediate: true },
)

const commitInnerRadius = () => {
  updateConfig('innerRadius', localInnerRadius.value + '%')
}

const commitLegendFontSize = () => {
  updateConfig('legendFontSize', localLegendFontSize.value)
}

watch(
  () => config.value.pieGap,
  (v) => { localPieGap.value = v ?? 2 },
  { immediate: true },
)

watch(
  () => config.value.pieBorderRadius,
  (v) => { localPieBorderRadius.value = v ?? 6 },
  { immediate: true },
)

const commitPieGap = () => {
  updateConfig('pieGap', localPieGap.value)
}

const commitPieBorderRadius = () => {
  updateConfig('pieBorderRadius', localPieBorderRadius.value)
}

// ═══════════════════════════════════════════════════════════════════════════════
// 颜色选择器字段
// ═══════════════════════════════════════════════════════════════════════════════

type ColorField = keyof Pick<PieChartComponentConfig, 'backgroundColor' | 'legendColor'>

const colorFields: ColorField[] = ['backgroundColor', 'legendColor']

const latestColor = ref<Record<ColorField, string>>({
  backgroundColor: '',
  legendColor: '',
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

// ═══════════════════════════════════════════════════════════════════════════════
// items 列表操作
// ═══════════════════════════════════════════════════════════════════════════════

/** 记录每个 item 颜色选择器的最新值 */
const latestItemColors = ref<Record<number, string>>({})

watch(
  () => config.value.items?.map((i) => i.color),
  (colors) => {
    if (!colors) return
    colors.forEach((c, idx) => {
      latestItemColors.value[idx] = c
    })
  },
  { immediate: true },
)

const handleItemColorActiveChange = (index: number, val: string | null) => {
  latestItemColors.value[index] = val || ''
}

const handleItemColorChange = (index: number, val: string | null) => {
  const items = [...(config.value.items || [])]
  if (items[index]) {
    const isCleared = val === null || val === undefined || val === ''
    items[index] = { ...items[index], color: isCleared ? '' : latestItemColors.value[index] }
    updateConfig('items', items)
  }
}

const updateItemName = (index: number, name: string) => {
  const items = [...(config.value.items || [])]
  if (items[index]) {
    items[index] = { ...items[index], name }
    updateConfig('items', items)
  }
}

const updateItemValue = (index: number, value: number) => {
  const items = [...(config.value.items || [])]
  if (items[index]) {
    items[index] = { ...items[index], value }
    updateConfig('items', items)
  }
}

/** 默认配色循环，用于新增 item 时的颜色 */
const PIE_COLORS = ['#22D3EE', '#86EFAC', '#FACC15', '#F87171', '#60A5FA', '#A78BFA']

const addItem = () => {
  const items = [...(config.value.items || [])]
  const newItem: PieChartItemConfig = {
    name: `${t('componentConfig.pieDefaultItem')} ${items.length + 1}`,
    value: Math.round(Math.random() * 80 + 10),
    color: PIE_COLORS[items.length % PIE_COLORS.length],
  }
  items.push(newItem)
  updateConfig('items', items)
}

const removeItem = (index: number) => {
  const items = [...(config.value.items || [])]
  if (items.length > 1) {
    items.splice(index, 1)
    updateConfig('items', items)
  }
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

.form-group input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

/* items 列表 */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.item-color {
  flex-shrink: 0;
}

.item-color :deep(.el-color-picker__trigger) {
  width: 28px;
  height: 28px;
  padding: 2px;
}

.item-name {
  flex: 1;
  min-width: 0;
  padding: 6px 8px;
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 6px;
  font-size: 13px;
  background-color: var(--scada-bg-elevated);
  color: var(--text-primary);
}

.item-value {
  width: 60px;
  flex-shrink: 0;
  padding: 6px 8px;
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 6px;
  font-size: 13px;
  text-align: center;
  background-color: var(--scada-bg-elevated);
  color: var(--text-primary);
}

.item-delete {
  width: 24px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: var(--text-placeholder);
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
  user-select: none;
}

.item-delete:hover {
  background-color: rgba(248, 113, 113, 0.15);
  color: #f87171;
}

.item-add {
  padding: 8px;
  text-align: center;
  border: 1px dashed rgba(34, 211, 238, 0.3);
  border-radius: 6px;
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}

.item-add:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background-color: rgba(34, 211, 238, 0.08);
}
</style>
