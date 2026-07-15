<template>
  <div ref="containerRef" class="brightness-adjuster">
    <div
      ref="trackRef"
      class="brightness-track"
      :class="{ vertical: isVertical }"
      :style="trackStyle"
      @pointerdown="handlePointerDown"
    >
      <div class="brightness-fill" :style="fillStyle" />
      <div class="brightness-thumb" :style="thumbStyle" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ScadaComponent, SliderComponentConfig } from '@/types/scada'
import { useScadaBinding } from '@/views/ScadaEditor/hooks'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  config: ScadaComponent
  editing?: boolean
}>()

const { t } = useI18n()

const sliderConfig = computed(() => props.config.config as SliderComponentConfig)
const binding = computed(() => props.config.binding)
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
const thumbColor = computed(() => sliderConfig.value.thumbColor ?? 'rgba(255, 204, 0, 1)')
const trackColor = computed(() => sliderConfig.value.backgroundColor ?? 'rgba(0, 0, 0, 0.2)')

const percentage = computed(() => {
  const raw = ((currentValue.value ?? min.value) - min.value) / (max.value - min.value)
  return Math.max(0, Math.min(1, raw))
})

const isVertical = computed(() => (props.config.config.height ?? 40) > (props.config.config.width ?? 200))

const trackStyle = computed(() => ({
  backgroundColor: trackColor.value,
}))

const fillStyle = computed(() => {
  if (isVertical.value) {
    return {
      backgroundColor: thumbColor.value,
      opacity: 0.6,
      bottom: '0',
      left: '0',
      width: '100%',
      height: `${percentage.value * 100}%`,
    }
  }
  return {
    backgroundColor: thumbColor.value,
    opacity: 0.6,
    top: '0',
    left: '0',
    height: '100%',
    width: `${percentage.value * 100}%`,
  }
})

const thumbStyle = computed(() => {
  const sizeVar = 'var(--thumb-size)'
  if (isVertical.value) {
    return {
      backgroundColor: thumbColor.value,
      left: '50%',
      bottom: `calc(${percentage.value * 100}% - ${sizeVar} / 2)`,
    }
  }
  return {
    backgroundColor: thumbColor.value,
    top: '50%',
    left: `calc(${percentage.value * 100}% - ${sizeVar} / 2)`,
  }
})

const containerRef = ref<HTMLDivElement | null>(null)
const trackRef = ref<HTMLDivElement | null>(null)
const isDragging = ref(false)

const handlePointerDown = (event: PointerEvent) => {
  if (props.editing) return
  event.preventDefault()
  event.stopPropagation()
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

const handlePointerUp = () => {
  isDragging.value = false
  window.removeEventListener('pointermove', handlePointerMove)
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
  const clamped = Math.max(min.value, Math.min(max.value, stepped))
  setValue(clamped)
}

const setValue = async (value: number) => {
  const previous = currentValue.value
  currentValue.value = value

  if (!binding.value || !boundPoint.value) {
    return
  }

  const result = await writeValue(value)
  if (result.success) {
    ElMessage.success(t('scadaComponents.sliderWriteSuccess'))
  } else {
    currentValue.value = previous
    ElMessage.error(result.message)
  }
}
</script>

<style scoped>
.brightness-adjuster {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(var(--thumb-size) / 2);
  --thumb-size: 16px;
}

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
  border-radius: inherit;
  pointer-events: none;
}

.brightness-thumb {
  position: absolute;
  width: var(--thumb-size);
  height: var(--thumb-size);
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  transform: translate(-50%, -50%);
}
</style>
