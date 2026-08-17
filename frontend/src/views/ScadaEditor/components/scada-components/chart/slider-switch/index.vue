<template>
  <div class="slider-switch" :style="containerStyle">
    <!-- 轨道：激活（滑块左侧）+ 未激活（滑块右侧）+ 滑块 -->
    <div
      ref="trackRef"
      class="ss-track"
      @pointerdown="handlePointerDown"
    >
      <div class="ss-rail ss-rail-inactive" :style="inactiveRailStyle" />
      <div class="ss-rail ss-rail-active" :style="activeRailStyle" />
      <div class="ss-thumb" :style="thumbStyle" />
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
const thumbColor = computed(() => switchConfig.value.thumbColor ?? '#FFFFFF')
const borderRadius = computed(() => switchConfig.value.borderRadius ?? 12)
const showAxis = computed(() => switchConfig.value.showAxis ?? true)
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
  backgroundColor: activeTrackColor.value,
  borderRadius: `${borderRadius.value}px 0 0 ${borderRadius.value}px`,
}))

const inactiveRailStyle = computed(() => ({
  width: `${(1 - percentage.value) * 100}%`,
  backgroundColor: inactiveTrackColor.value,
  borderRadius: `0 ${borderRadius.value}px ${borderRadius.value}px 0`,
}))

const thumbStyle = computed(() => ({
  left: `${percentage.value * 100}%`,
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
  currentValue.value = Math.round(rawValue * 100) / 100
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

.ss-track {
  position: relative;
  flex: 1;
  min-height: 0;
  cursor: pointer;
  touch-action: none;
}

.ss-rail {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: min(22px, 60%);
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
  height: min(40px, 95%);
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
