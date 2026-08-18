<template>
  <div class="slider-switch" :style="containerStyle">
    <!-- 轨道行：激活/未激活轨道 + 滑块 + 当前值（最右侧） -->
    <div class="ss-track-row">
      <div
        ref="trackRef"
        class="ss-track"
        @pointerdown="handlePointerDown"
      >
        <div class="ss-rail ss-rail-inactive" :style="inactiveRailStyle" />
        <div class="ss-rail ss-rail-active" :style="activeRailStyle" />
        <div class="ss-thumb" :style="thumbStyle" />
      </div>
      <span v-if="showValue" class="ss-value" :style="valueStyle">{{ displayValue }}</span>
    </div>

    <!-- 数字轴：按最小值到最大值均分刻度 -->
    <div v-if="showAxis" class="ss-axis" :style="axisStyle">
      <span v-for="tick in axisTicks" :key="tick" class="ss-axis-tick">{{ tick }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import type { ScadaComponent, SliderSwitchComponentConfig } from '@/types/scada'
import { useScadaBinding } from '@/views/ScadaEditor/hooks'

const props = defineProps<{
  component: ScadaComponent
  editing?: boolean
}>()

const { t } = useI18n()

const switchConfig = computed(() => props.component.config as SliderSwitchComponentConfig)
const binding = computed(() => props.component.binding)
const fallbackValue = computed(() =>
  typeof switchConfig.value.value === 'number' ? switchConfig.value.value : switchConfig.value.min ?? 0,
)

const { currentValue, boundPoint, writeValue } = useScadaBinding(
  binding,
  {
    transform: (value) => (typeof value === 'number' ? value : 0),
  },
  fallbackValue,
)

// ─── 配置项 ────────────────────────────────────────────────
const min = computed(() => switchConfig.value.min ?? 0)
const max = computed(() => switchConfig.value.max ?? 100)
const activeTrackColor = computed(() => switchConfig.value.activeTrackColor ?? '#22D3EE')
const inactiveTrackColor = computed(() => switchConfig.value.inactiveTrackColor ?? 'rgba(120, 130, 150, 0.35)')
const trackHeight = computed(() => switchConfig.value.trackHeight ?? 22)
const thumbColor = computed(() => switchConfig.value.thumbColor ?? '#FFFFFF')
const borderRadius = computed(() => switchConfig.value.borderRadius ?? 12)
const showAxis = computed(() => switchConfig.value.showAxis ?? true)
const showValue = computed(() => switchConfig.value.showValue ?? true)
const axisFontSize = computed(() => switchConfig.value.axisFontSize ?? 11)
const axisColor = computed(() => switchConfig.value.axisColor ?? '#8A93A6')

// ─── 数值 ↔ 位置换算 ───────────────────────────────────────
const percentage = computed(() => {
  const range = max.value - min.value
  if (range <= 0) return 0
  const raw = ((currentValue.value ?? min.value) - min.value) / range
  return Math.max(0, Math.min(1, raw))
})

// ─── 样式 ──────────────────────────────────────────────────
const containerStyle = computed(() => ({
  borderRadius: `${borderRadius.value}px`,
  backgroundColor: switchConfig.value.backgroundColor,
}))

const activeRailStyle = computed(() => ({
  width: `${percentage.value * 100}%`,
  height: `${trackHeight.value}px`,
  backgroundColor: activeTrackColor.value,
  borderRadius: `${borderRadius.value}px 0 0 ${borderRadius.value}px`,
}))

const inactiveRailStyle = computed(() => ({
  width: `${(1 - percentage.value) * 100}%`,
  height: `${trackHeight.value}px`,
  backgroundColor: inactiveTrackColor.value,
  borderRadius: `0 ${borderRadius.value}px ${borderRadius.value}px 0`,
}))

// 滑块高度随轨道高度联动：轨道高度 + 2px
const thumbStyle = computed(() => ({
  left: `${percentage.value * 100}%`,
  height: `${trackHeight.value + 2}px`,
  backgroundColor: thumbColor.value,
  borderRadius: `${borderRadius.value}px`,
}))

const axisStyle = computed(() => ({
  fontSize: `${axisFontSize.value}px`,
  color: axisColor.value,
}))

// ─── 数字轴刻度：min → max 均分 5 段 ───────────────────────
const formatTick = (value: number): string => {
  if (Number.isInteger(value)) return String(value)
  return String(Math.round(value * 100) / 100)
}

const axisTicks = computed(() => {
  const segments = 5
  return Array.from({ length: segments + 1 }, (_, i) =>
    formatTick(min.value + ((max.value - min.value) * i) / segments),
  )
})

// ─── 当前值显示：与数字轴共用字体大小/颜色 ──────────────────
const displayValue = computed(() =>
  formatTick(typeof currentValue.value === 'number' ? currentValue.value : min.value),
)

const valueStyle = computed(() => ({
  fontSize: `${axisFontSize.value}px`,
  color: axisColor.value,
}))

// ─── 拖拽交互：拖动滑块修改值，松开后写入点位 ────────────────
const trackRef = ref<HTMLDivElement | null>(null)
const isDragging = ref(false)
const dragStartValue = ref(0)

const handlePointerDown = (event: PointerEvent) => {
  if (props.editing) return
  event.preventDefault()
  event.stopPropagation()
  dragStartValue.value = currentValue.value ?? min.value
  isDragging.value = true
  updateFromEvent(event)
  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', handlePointerUp, { once: true })
}

const handlePointerMove = (event: PointerEvent) => {
  if (!isDragging.value) return
  event.preventDefault()
  updateFromEvent(event)
}

const handlePointerUp = async () => {
  isDragging.value = false
  window.removeEventListener('pointermove', handlePointerMove)

  if (!binding.value || !boundPoint.value) {
    return
  }

  const result = await writeValue(currentValue.value)
  if (result.success) {
    ElMessage.success(t('scadaComponents.sliderWriteSuccess'))
  } else {
    currentValue.value = dragStartValue.value
    ElMessage.error(result.message)
  }
}

const updateFromEvent = (event: PointerEvent) => {
  const track = trackRef.value
  if (!track) return
  const rect = track.getBoundingClientRect()
  let ratio = (event.clientX - rect.left) / rect.width
  ratio = Math.max(0, Math.min(1, ratio))
  const rawValue = min.value + ratio * (max.value - min.value)
  // 只取整数值，不写小数
  currentValue.value = Math.round(rawValue)
}
</script>

<style scoped>
.slider-switch {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 14px;
  box-sizing: border-box;
  overflow: hidden;
}

.ss-track-row {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ss-track {
  position: relative;
  flex: 1;
  align-self: stretch;
  cursor: pointer;
  touch-action: none;
}

.ss-value {
  flex-shrink: 0;
  white-space: nowrap;
  user-select: none;
  line-height: 1.2;
}

.ss-rail {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  overflow: hidden;
}

.ss-rail-active {
  left: 0;
}

.ss-rail-inactive {
  right: 0;
}

.ss-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
  pointer-events: none;
}

.ss-axis {
  display: flex;
  justify-content: space-between;
  line-height: 1.2;
  user-select: none;
  flex-shrink: 0;
}

.ss-axis-tick {
  white-space: nowrap;
}
</style>
