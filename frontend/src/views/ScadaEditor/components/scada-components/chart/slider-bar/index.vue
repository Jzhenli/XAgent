<template>
  <div class="slider-bar-chart" :style="containerStyle">
    <!-- 主体：y 轴刻度 + 绘图区（每根柱体为竖向滑块） -->
    <div class="sbc-main">
      <div v-if="showYAxisLabel" class="sbc-yaxis" :style="axisStyle">
        <span v-for="tick in yTicks" :key="tick" class="sbc-ytick">{{ tick }}</span>
      </div>
      <div class="sbc-plot" :class="{ 'sbc-plot--no-baseline': !showXAxis }">
        <div v-for="(item, index) in items" :key="index" class="sbc-col">
          <div
            class="sbc-track"
            :style="{ width: `${barWidth}px` }"
            @pointerdown="handlePointerDown(index, $event)"
          >
            <!-- 未激活轨道：透明 -->
            <div class="sbc-rail" />
            <!-- 激活轨道（柱体） -->
            <div class="sbc-fill" :style="fillStyle(item, index)" />
            <!-- 当前值：跟随柱体顶部 -->
            <span v-if="showCurrentValue" class="sbc-value" :style="valueLabelStyle(item, index)">
              {{ formatTick(displayValue(item, index)) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- x 轴标签：与柱体一一对应 -->
    <div v-if="showXAxis" class="sbc-xaxis-row">
      <div v-if="showYAxisLabel" class="sbc-yaxis-spacer" />
      <div class="sbc-xaxis" :style="axisStyle">
        <span v-for="(item, index) in items" :key="index" class="sbc-xtick">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onUnmounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import type { PointBinding, ScadaComponent, SliderBarComponentConfig, SliderBarItemConfig } from '@/types/scada'
import { useScadaEditor } from '@/views/ScadaEditor/hooks/useScadaEditor'
import { usePointStore, type PointDisplay } from '@/stores/points'
import { ScadaPointReaderKey, type ScadaPointReader } from '@/utils/scadaPointReader'

const props = defineProps<{
  component: ScadaComponent
  editing?: boolean
}>()

const { t } = useI18n()
const scada = useScadaEditor()
const pointStore = usePointStore()
const injectedReader = inject(ScadaPointReaderKey, null) as ScadaPointReader | null

// ─── 配置项 ────────────────────────────────────────────────
const barConfig = computed(() => props.component.config as SliderBarComponentConfig)
const items = computed(() => barConfig.value.items ?? [])
const min = computed(() => barConfig.value.min ?? 0)
const max = computed(() => barConfig.value.max ?? 100)
const barColor = computed(() => barConfig.value.barColor ?? '#22D3EE')
const barWidth = computed(() => barConfig.value.barWidth ?? 36)
const valueFontSize = computed(() => barConfig.value.valueFontSize ?? 12)
const valueColor = computed(() => barConfig.value.valueColor ?? '#E6F7FF')
const axisFontSize = computed(() => barConfig.value.axisFontSize ?? 11)
const axisColor = computed(() => barConfig.value.axisColor ?? '#8A93A6')
const showYAxisLabel = computed(() => barConfig.value.showYAxisLabel ?? true)
const showXAxis = computed(() => barConfig.value.showXAxis ?? true)
const barRadius = computed(() => barConfig.value.barRadius ?? 0)
const showCurrentValue = computed(() => barConfig.value.showCurrentValue ?? true)

const containerStyle = computed(() => ({
  backgroundColor: barConfig.value.backgroundColor,
}))

const axisStyle = computed(() => ({
  fontSize: `${axisFontSize.value}px`,
  color: axisColor.value,
}))

// ─── y 轴刻度：max → min 均分 5 段 ─────────────────────────
const formatTick = (value: number): string => {
  if (Number.isInteger(value)) return String(value)
  return String(Math.round(value * 100) / 100)
}

const yTicks = computed(() => {
  const segments = 5
  return Array.from({ length: segments + 1 }, (_, i) =>
    formatTick(max.value - ((max.value - min.value) * i) / segments),
  )
})

// ─── 每柱独立点位绑定：解析与写入 ───────────────────────────
const devices = computed(() => (injectedReader ? injectedReader.devices.value : pointStore.devices))

const resolvePoint = (binding: PointBinding | null): PointDisplay | null => {
  if (!binding) return null
  const device = devices.value.find(
    d => d.asset === binding.deviceId || d.name === binding.deviceId,
  )
  if (!device) return null
  return device.points.find(p => p.name === binding.pointName) || null
}

const writePointValue = async (
  binding: PointBinding,
  value: number,
): Promise<{ success: boolean; message: string }> => {
  try {
    if (injectedReader) {
      return injectedReader.writePoint(binding.deviceId, binding.pointName, value)
    }
    return pointStore.writePoint(binding.deviceId, binding.pointName, value)
  } catch (e) {
    console.error('[SliderBar] Failed to write point value:', e)
    return { success: false, message: t('common.operationFailed') }
  }
}

// ─── 显示值：拖拽中 > 拖拽结果 > 绑定点位 > 模拟值 ──────────
const draggingIndex = ref<number | null>(null)
const dragValues = reactive<Record<number, number>>({})
/** 写值请求进行中标志：防止写值未完成时新写值请求并发 */
const writing = ref(false)

const displayValue = (item: SliderBarItemConfig, index: number): number => {
  if (draggingIndex.value === index && dragValues[index] !== undefined) {
    return dragValues[index]
  }
  if (!scada.isEditing.value && item.binding && dragValues[index] === undefined) {
    const point = resolvePoint(item.binding)
    if (point && typeof point.currentValue === 'number') {
      return point.currentValue
    }
  }
  return dragValues[index] ?? item.value ?? min.value
}

const percentOf = (item: SliderBarItemConfig, index: number): number => {
  const range = max.value - min.value
  if (range <= 0) return 0
  const raw = (displayValue(item, index) - min.value) / range
  return Math.max(0, Math.min(1, raw)) * 100
}

const fillStyle = (item: SliderBarItemConfig, index: number) => ({
  height: `${percentOf(item, index)}%`,
  backgroundColor: barColor.value,
  borderTopLeftRadius: `${barRadius.value}px`,
  borderTopRightRadius: `${barRadius.value}px`,
})

const valueLabelStyle = (item: SliderBarItemConfig, index: number) => ({
  bottom: `calc(${percentOf(item, index)}% + 4px)`,
  fontSize: `${valueFontSize.value}px`,
  color: valueColor.value,
})

// ─── 拖拽交互：滑动/点击柱体取整写值 ────────────────────────
const activeTrackEl = ref<HTMLDivElement | null>(null)
const dragStartValues = reactive<Record<number, number>>({})

/** 移除拖拽期间挂载的 window 监听（pointerup/pointercancel/卸载时统一调用） */
const stopDragListeners = () => {
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', handlePointerUp)
  window.removeEventListener('pointercancel', handlePointerCancel)
}

const handlePointerDown = (index: number, event: PointerEvent) => {
  if (props.editing) return
  event.preventDefault()
  event.stopPropagation()
  const item = items.value[index]
  if (!item) return

  activeTrackEl.value = event.currentTarget as HTMLDivElement
  dragStartValues[index] = displayValue(item, index)
  draggingIndex.value = index
  updateFromEvent(index, event)
  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', handlePointerUp)
  // 触摸屏手势被系统打断时只会派发 pointercancel，必须一并监听否则监听器泄漏
  window.addEventListener('pointercancel', handlePointerCancel)
}

const handlePointerMove = (event: PointerEvent) => {
  if (draggingIndex.value === null) return
  event.preventDefault()
  updateFromEvent(draggingIndex.value, event)
}

/** 拖拽被系统取消：丢弃未写入的拖动值，不执行写值 */
const handlePointerCancel = () => {
  const index = draggingIndex.value
  draggingIndex.value = null
  activeTrackEl.value = null
  stopDragListeners()
  if (index !== null) {
    delete dragValues[index]
  }
}

const handlePointerUp = async () => {
  const index = draggingIndex.value
  draggingIndex.value = null
  activeTrackEl.value = null
  stopDragListeners()

  if (index === null) return
  const item = items.value[index]
  const binding = item?.binding
  if (!binding) return

  const point = resolvePoint(binding)
  if (point && !point.writable) {
    delete dragValues[index]
    ElMessage.error(t('scadaBinding.pointNotWritable', { name: binding.pointName }))
    return
  }

  // 写值请求进行中时忽略本次提交，避免连续操作产生并发写请求
  if (writing.value) return

  writing.value = true
  try {
    const result = await writePointValue(binding, dragValues[index])
    if (result.success) {
      ElMessage.success(t('scadaComponents.sliderWriteSuccess'))
    } else {
      delete dragValues[index]
      ElMessage.error(result.message)
    }
  } finally {
    writing.value = false
  }
}

const updateFromEvent = (index: number, event: PointerEvent) => {
  const track = activeTrackEl.value
  if (!track) return
  const rect = track.getBoundingClientRect()
  let ratio = 1 - (event.clientY - rect.top) / rect.height
  ratio = Math.max(0, Math.min(1, ratio))
  const rawValue = min.value + ratio * (max.value - min.value)
  // 只取整数值，不写小数
  dragValues[index] = Math.round(rawValue)
}

/** 兜底：拖拽中组件被卸载时移除 window 监听 */
onUnmounted(stopDragListeners)
</script>

<style scoped>
.slider-bar-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 12px 10px 12px;
  box-sizing: border-box;
  overflow: hidden;
}

.sbc-main {
  flex: 1;
  min-height: 0;
  display: flex;
}

/* y 轴刻度列 */
.sbc-yaxis {
  width: 34px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 6px 0 0;
  user-select: none;
}

.sbc-ytick {
  line-height: 1;
  transform: translateY(50%);
}

.sbc-ytick:first-child {
  transform: none;
}

/* 绘图区：底边线即 x 轴 */
.sbc-plot {
  flex: 1;
  min-width: 0;
  display: flex;
  border-bottom: 1px solid v-bind(axisColor);
}

.sbc-plot--no-baseline {
  border-bottom: none;
}

.sbc-col {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: center;
}

.sbc-track {
  position: relative;
  align-self: stretch;
  cursor: pointer;
  touch-action: none;
}

/* 未激活轨道：透明 */
.sbc-rail {
  position: absolute;
  inset: 0;
  background: transparent;
}

/* 激活轨道（柱体） */
.sbc-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
}

/* 当前值：跟随柱体顶部 */
.sbc-value {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
  line-height: 1.2;
}

/* x 轴标签行 */
.sbc-xaxis-row {
  flex-shrink: 0;
  display: flex;
  padding-top: 4px;
}

.sbc-yaxis-spacer {
  width: 34px;
  flex-shrink: 0;
}

.sbc-xaxis {
  flex: 1;
  min-width: 0;
  display: flex;
}

.sbc-xtick {
  flex: 1;
  min-width: 0;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
  line-height: 1.4;
}
</style>
