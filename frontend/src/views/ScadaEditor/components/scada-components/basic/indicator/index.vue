<template>
  <div class="indicator-container">
    <div class="indicator-light" :style="indicatorStyle"></div>
    <!-- <div v-if="binding" class="indicator-label">
      {{ binding.pointDescription || binding.pointName }}
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ScadaComponent, IndicatorComponentConfig } from '@/types/scada'
import { useScadaBinding } from '@/views/ScadaEditor/hooks'

const props = defineProps<{
  component: ScadaComponent
  editing?: boolean
}>()

const indicatorConfig = computed(() => props.component.config as IndicatorComponentConfig)
const binding = computed(() => props.component.binding)
const fallbackValue = computed(() => props.component.config.value)

const onValue = computed(() => indicatorConfig.value?.onValue ?? 1)
const offValue = computed(() => indicatorConfig.value?.offValue ?? 0)

const isOn = (value: unknown): boolean => {
  if (value === undefined || value === null) return false
  // eslint-disable-next-line eqeqeq
  return value == onValue.value
}

const { currentValue } = useScadaBinding(binding, {
  transform: (value) => isOn(value)
}, fallbackValue)

const colorWithAlpha = (color: string | undefined, alpha: number): string => {
  if (!color) return `rgba(39, 174, 96, ${alpha})`
  if (color === 'transparent') return `rgba(0, 0, 0, 0)`
  if (color.startsWith('rgba')) {
    return color.replace(/,\s*[\d.]+\s*\)$/, `, ${alpha})`)
  }
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`)
  }
  if (color.startsWith('#')) {
    const hex = color.replace('#', '')
    const fullHex = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex
    const bigint = parseInt(fullHex.slice(0, 6), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  return color
}

const indicatorStyle = computed(() => ({
  backgroundColor: currentValue.value
    ? indicatorConfig.value?.onColor || '#27ae60'
    : indicatorConfig.value?.offColor || '#95a5a6',
  boxShadow: currentValue.value
    ? `0 0 20px ${colorWithAlpha(indicatorConfig.value?.onColor, 0.5)}`
    : 'none'
}))
</script>

<style scoped>
.indicator-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.indicator-light {
  width: 70%;
  height: 70%;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.indicator-label {
  font-size: 10px;
  color: var(--text-secondary);
  margin-top: 4px;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
