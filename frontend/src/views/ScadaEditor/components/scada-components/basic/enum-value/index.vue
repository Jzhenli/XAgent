<template>
  <div class="enum-value-container" :style="containerStyle">
    <span class="enum-value-text" :style="textStyle">{{ displayText }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ScadaComponent, EnumValueComponentConfig } from '@/types/scada'
import { useScadaBinding } from '@/views/ScadaEditor/hooks'

const props = defineProps<{
  config: ScadaComponent
  editing?: boolean
}>()

const enumConfig = computed(() => props.config.config as EnumValueComponentConfig)
const binding = computed(() => props.config.binding)
const fallbackValue = computed(() => enumConfig.value?.value ?? 1)

const { currentValue } = useScadaBinding(binding, {}, fallbackValue)

const enumItems = computed(() => enumConfig.value?.enumItems ?? [])
const fontSize = computed(() => enumConfig.value?.fontSize ?? 24)
const fontColor = computed(() => enumConfig.value?.fontColor ?? '#000000')

const rawValue = computed(() => currentValue.value ?? fallbackValue.value ?? 1)

const displayText = computed(() => {
  const value = rawValue.value
  const item = enumItems.value.find((entry) => entry.value === value)
  return item?.text ?? String(value)
})

const containerStyle = computed(() => ({
  justifyContent: 'center',
  alignItems: 'center',
}))

const textStyle = computed(() => ({
  color: fontColor.value,
  fontSize: `${fontSize.value}px`,
}))
</script>

<style scoped>
.enum-value-container {
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
}

.enum-value-text {
  line-height: 1;
}
</style>
