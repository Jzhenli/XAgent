<template>
  <div class="switch-container" :style="containerStyle" @click="handleToggle">
    <div class="switch-track" :class="{ on: currentValue, writing }" :style="trackStyle">
      <div class="switch-thumb" :class="{ on: currentValue }" :style="thumbStyle"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ScadaComponent, SwitchComponentConfig } from '@/types/scada'
import { useScadaBinding } from '@/views/ScadaEditor/hooks'
import { ElMessageBox, ElMessage } from 'element-plus'

const { t } = useI18n()
const props = defineProps<{
  config: ScadaComponent
  editing?: boolean
}>()

const switchConfig = computed(() => props.config.config as SwitchComponentConfig)
const binding = computed(() => props.config.binding)
const fallbackValue = computed(() => props.config.config.value)

const onValue = computed(() => switchConfig.value?.onValue ?? 1)
const offValue = computed(() => switchConfig.value?.offValue ?? 0)

const isOn = (value: unknown): boolean => {
  if (value === undefined || value === null) return false
  // eslint-disable-next-line eqeqeq
  return value == onValue.value
}

const { currentValue, writeValue } = useScadaBinding(binding, {
  transform: (value) => isOn(value)
}, fallbackValue)

const writing = ref(false)

const containerStyle = computed(() => ({
  '--thumb-color': switchConfig.value?.thumbColor || '#ffffff',
  '--track-off-color': switchConfig.value?.offColor || '#95a5a6',
  '--track-on-color': switchConfig.value?.onColor || '#27ae60'
}))

const trackStyle = computed(() => {
  const config = switchConfig.value
  const width = config?.width ?? 60
  const height = config?.height ?? 30
  const padding = Math.min(width, height) * 0.08
  const borderRadius = height / 2
  return {
    padding: `${padding}px`,
    borderRadius: `${borderRadius}px`
  }
})

const thumbStyle = computed(() => {
  const config = switchConfig.value
  const width = config?.width ?? 60
  const height = config?.height ?? 30
  const padding = Math.min(width, height) * 0.08
  const thumbSize = height - 2 * padding
  const translateX = width - thumbSize - 2 * padding
  return {
    width: `${thumbSize}px`,
    height: `${thumbSize}px`,
    marginTop: `${-thumbSize / 2}px`,
    transform: currentValue.value ? `translateX(${translateX}px)` : 'translateX(0)'
  }
})

const handleToggle = async () => {
  if (props.editing) return

  const targetValue = currentValue.value ? offValue.value : onValue.value
  const writeTarget = switchConfig.value?.writePoint || binding.value

  if (writeTarget) {
    writing.value = true
    const originalValue = currentValue.value

    currentValue.value = !originalValue

    try {
      const res = await writeValue(targetValue)
      if (res.success) {
        ElMessage.success(t('scadaComponents.commandSent'))
      } else {
        currentValue.value = originalValue
        ElMessage.error(res.message)
      }
    } catch (e: unknown) {
      currentValue.value = originalValue
      const detail = (e as any)?.response?.data?.detail || (e instanceof Error ? e.message : t('scadaComponents.operationFailed'))
      ElMessage.error(detail)
    } finally {
      writing.value = false
    }
  } else {
    currentValue.value = !currentValue.value
  }
}
</script>

<style scoped>
.switch-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
}

.switch-track {
  width: 100%;
  height: 100%;
  background: var(--track-off-color);
  position: relative;
  transition: background 0.3s;
  box-sizing: border-box;
}

.switch-track.on {
  background: var(--track-on-color);
}

.switch-track.writing {
  opacity: 0.7;
}

.switch-thumb {
  position: absolute;
  background: var(--thumb-color);
  border-radius: 50%;
  top: 50%;
  left: 0;
  transition: transform 0.3s;
  box-shadow: var(--shadow-light);
}
</style>
