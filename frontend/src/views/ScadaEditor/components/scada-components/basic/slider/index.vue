<template>
  <div
    ref="trackRef"
    class="brightness-track"
    :class="{ vertical: isVertical }"
    :style="trackStyle"
    @pointerdown="handlePointerDown"
  >
    <div class="brightness-fill" :style="fillStyle" />
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ScadaComponent, SliderComponentConfig } from '@/types/scada'
import { useScadaBinding } from '@/views/ScadaEditor/hooks'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  component: ScadaComponent
  editing?: boolean
}>()

const { t } = useI18n()

const sliderConfig = computed(() => props.component.config as SliderComponentConfig)
const binding = computed(() => props.component.binding)
const fallbackValue = computed(() =>
  typeof sliderConfig.value.value === 'number' ? sliderConfig.value.value : sliderConfig.value.min ?? 0,
)

const { currentValue, boundPoint, writeValue } = useScadaBinding(
  binding,
  {
    transform: (value) => (typeof value === 'number' ? value : 0),
  },
  fallbackValue,
)

const min = computed(() => sliderConfig.value.min ?? 0)
const max = computed(() => sliderConfig.value.max ?? 100)
const step = computed(() => sliderConfig.value.step ?? 1)
const fillColor = computed(() => sliderConfig.value.thumbColor ?? '#007BFF')
const trackColor = computed(() => sliderConfig.value.backgroundColor ?? '#B0C4DE')
const borderRadius = computed(() => sliderConfig.value.borderRadius ?? 999)

const percentage = computed(() => {
  const raw = ((currentValue.value ?? min.value) - min.value) / (max.value - min.value)
  return Math.max(0, Math.min(1, raw))
})

const isVertical = computed(() => (props.component.config.height ?? 40) > (props.component.config.width ?? 200))

const trackStyle = computed(() => ({
  backgroundColor: trackColor.value,
  borderRadius: `${borderRadius.value}px`,
}))

const fillStyle = computed(() => {
  const base = {
    backgroundColor: fillColor.value,
    borderRadius: `${borderRadius.value}px`,
  }
  if (isVertical.value) {
    return {
      ...base,
      bottom: '0',
      left: '0',
      width: '100%',
      height: `${percentage.value * 100}%`,
    }
  }
  return {
    ...base,
    top: '0',
    left: '0',
    height: '100%',
    width: `${percentage.value * 100}%`,
  }
})

const trackRef = ref<HTMLDivElement | null>(null)
const isDragging = ref(false)
const dragStartValue = ref(0)
/** 写值请求进行中标志：防止写值未完成时新写值请求并发 */
const writing = ref(false)

/** 移除拖拽期间挂载的 window 监听（pointerup/pointercancel/卸载时统一调用） */
const stopDragListeners = () => {
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', handlePointerUp)
  window.removeEventListener('pointercancel', handlePointerCancel)
}

const handlePointerDown = (event: PointerEvent) => {
  if (props.editing) return
  event.preventDefault()
  event.stopPropagation()
  dragStartValue.value = currentValue.value ?? min.value
  isDragging.value = true
  updateFromEvent(event)
  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', handlePointerUp)
  // 触摸屏手势被系统打断时只会派发 pointercancel，必须一并监听否则监听器泄漏
  window.addEventListener('pointercancel', handlePointerCancel)
}

const handlePointerMove = (event: PointerEvent) => {
  if (!isDragging.value) return
  event.preventDefault()
  updateFromEvent(event)
}

/** 拖拽被系统取消：回退到拖动前数值，不执行写值 */
const handlePointerCancel = () => {
  isDragging.value = false
  stopDragListeners()
  currentValue.value = dragStartValue.value
}

const handlePointerUp = async () => {
  isDragging.value = false
  stopDragListeners()

  if (!binding.value || !boundPoint.value) {
    return
  }

  // 写值请求进行中时忽略本次提交，避免连续操作产生并发写请求
  if (writing.value) return

  writing.value = true
  try {
    const result = await writeValue(currentValue.value)
    if (result.success) {
      //ElMessage.success(t('scadaComponents.sliderWriteSuccess'))
    } else {
      currentValue.value = dragStartValue.value
      ElMessage.error(result.message)
    }
  } finally {
    writing.value = false
  }
}

const updateFromEvent = (event: PointerEvent) => {
  const track = trackRef.value
  if (!track) return
  const rect = track.getBoundingClientRect()
  let ratio = 0
  if (isVertical.value) {
    ratio = 1 - (event.clientY - rect.top) / rect.height
  } else {
    ratio = (event.clientX - rect.left) / rect.width
  }
  ratio = Math.max(0, Math.min(1, ratio))
  const rawValue = min.value + ratio * (max.value - min.value)
  const stepped = Math.round(rawValue / step.value) * step.value
  currentValue.value = Math.max(min.value, Math.min(max.value, stepped))
}

/** 兜底：拖拽中组件被卸载时移除 window 监听 */
onUnmounted(stopDragListeners)
</script>

<style scoped>
.brightness-track {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 999px;
  cursor: pointer;
  touch-action: none;
}

.brightness-track.vertical {
  border-radius: 999px;
}

.brightness-fill {
  position: absolute;
  pointer-events: none;
}
</style>
