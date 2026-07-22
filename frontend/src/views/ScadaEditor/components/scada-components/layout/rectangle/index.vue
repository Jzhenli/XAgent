<template>
  <div
    class="rectangle-container"
    :style="containerStyle"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ScadaComponent } from '@/types/scada'

const props = defineProps<{
  config: ScadaComponent
  editing?: boolean
}>()

const rectangleConfig = computed(() => (props.config as ScadaComponent<'rectangle'>).config)

const containerStyle = computed(() => ({
  backgroundColor: rectangleConfig.value?.backgroundColor || 'rgba(200, 200, 200, 0.3)',
  borderRadius: `${rectangleConfig.value?.borderRadius ?? 0}px`,
  borderWidth: `${rectangleConfig.value?.borderWidth ?? 1}px`,
  borderColor: rectangleConfig.value?.borderColor || 'rgba(150, 150, 150, 0.5)',
  borderStyle: 'solid',
  backdropFilter: rectangleConfig.value?.blur ? `blur(${rectangleConfig.value.blur}px)` : undefined
}))
</script>

<style scoped>
.rectangle-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
