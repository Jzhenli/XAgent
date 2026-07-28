<template>
  <div
    class="circle-container"
    :style="containerStyle"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ScadaComponent } from '@/types/scada'

const props = defineProps<{
  component: ScadaComponent
  editing?: boolean
}>()

const circleConfig = computed(() => (props.component as ScadaComponent<'circle'>).config)

const containerStyle = computed(() => ({
  backgroundColor: circleConfig.value?.backgroundColor || 'rgba(200, 200, 200, 0.3)',
  borderRadius: '50%',
  borderWidth: `${circleConfig.value?.borderWidth ?? 1}px`,
  borderColor: circleConfig.value?.borderColor || 'rgba(150, 150, 150, 0.5)',
  borderStyle: 'solid',
  backdropFilter: circleConfig.value?.blur ? `blur(${circleConfig.value.blur}px)` : undefined
}))
</script>

<style scoped>
.circle-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
