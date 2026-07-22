<template>
  <div class="number-container" :style="containerStyle">
    <div class="number-content">
      <span v-if="showTitle" class="number-title" :style="titleStyle">{{ title }}</span>
      <span class="number-value" :style="valueStyle">{{ displayValue }}</span>
      <span v-if="unit" class="number-unit" :style="unitStyle">{{ unit }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ScadaComponent, NumberComponentConfig } from '@/types/scada'
import { useScadaBinding } from '@/views/ScadaEditor/hooks'

const props = defineProps<{
  config: ScadaComponent
  editing?: boolean
}>()

const numberConfig = computed(() => props.config.config as NumberComponentConfig)
const binding = computed(() => props.config.binding)
const fallbackValue = computed(() => numberConfig.value?.value ?? 0)

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return Number.isNaN(parsed) ? 0 : parsed
  }
  return 0
}

const { currentValue } = useScadaBinding(binding, { transform: toNumber }, fallbackValue)

const showTitle = computed(() => numberConfig.value?.showTitle ?? true)
const title = computed(() => numberConfig.value?.title ?? '')
const titleFontSize = computed(() => numberConfig.value?.titleFontSize ?? 14)
const titleFontColor = computed(() => numberConfig.value?.titleFontColor ?? '#333333')
const decimalPlaces = computed(() => numberConfig.value?.decimalPlaces ?? 0)
const unit = computed(() => numberConfig.value?.unit ?? '')
const unitFontSize = computed(() => numberConfig.value?.unitFontSize ?? 12)
const unitFontColor = computed(() => numberConfig.value?.unitFontColor ?? '#000000')
const fontSize = computed(() => numberConfig.value?.fontSize ?? 24)
const fontColor = computed(() => numberConfig.value?.fontColor ?? '#000000')
const textAlign = computed(() => numberConfig.value?.textAlign ?? 'left')

const rawValue = computed(() => currentValue.value ?? fallbackValue.value ?? 0)

const displayValue = computed(() => {
  const value = Number(rawValue.value)
  if (Number.isNaN(value)) return rawValue.value
  return value.toFixed(Math.max(0, decimalPlaces.value))
})

const containerStyle = computed(() => ({
  justifyContent:
    textAlign.value === 'center' ? 'center' : textAlign.value === 'right' ? 'flex-end' : 'flex-start',
  alignItems: 'center',
}))

const titleStyle = computed(() => ({
  color: titleFontColor.value,
  fontSize: `${titleFontSize.value}px`,
}))

const valueStyle = computed(() => ({
  color: fontColor.value,
  fontSize: `${fontSize.value}px`,
}))

const unitStyle = computed(() => ({
  color: unitFontColor.value,
  fontSize: `${unitFontSize.value}px`,
}))
</script>

<style scoped>
.number-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
}

.number-content {
  display: flex;
  align-items: flex-end;
  gap: 4px;
}

.number-title,
.number-value,
.number-unit {
  line-height: 1;
}
</style>
