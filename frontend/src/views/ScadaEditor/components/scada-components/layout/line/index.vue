<template>
  <svg
    class="line-container"
    :width="config.width"
    :height="config.height"
    :viewBox="`0 0 ${config.width} ${config.height}`"
  >
    <defs v-if="showArrowEnd || showArrowStart">
      <marker
        v-if="showArrowEnd"
        id="arrow-end"
        :refX="arrowSize"
        :refY="arrowSize / 2"
        markerUnits="userSpaceOnUse"
        :markerWidth="arrowSize"
        :markerHeight="arrowSize"
        orient="auto"
      >
        <polygon
          :points="`0 0, ${arrowSize} ${arrowSize / 2}, 0 ${arrowSize}`"
          :fill="config.strokeColor"
        />
      </marker>
      <marker
        v-if="showArrowStart"
        id="arrow-start"
        :refX="arrowSize"
        :refY="arrowSize / 2"
        markerUnits="userSpaceOnUse"
        :markerWidth="arrowSize"
        :markerHeight="arrowSize"
        orient="auto-start-reverse"
      >
        <polygon
          :points="`0 0, ${arrowSize} ${arrowSize / 2}, 0 ${arrowSize}`"
          :fill="config.strokeColor"
        />
      </marker>
    </defs>
    <line
      x1="0"
      :y1="lineCenterY"
      :x2="config.width"
      :y2="lineCenterY"
      :stroke="config.strokeColor"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      :marker-start="showArrowStart ? 'url(#arrow-start)' : undefined"
      :marker-end="showArrowEnd ? 'url(#arrow-end)' : undefined"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ScadaComponent } from '@/types/scada'

const props = defineProps<{
  component: ScadaComponent
  editing?: boolean
}>()

const config = computed(() => (props.component as ScadaComponent<'line'>).config)

const strokeWidth = computed(() => config.value.strokeWidth ?? 2)
const arrowSize = computed(() => Math.max(strokeWidth.value * 3, 6))

const lineCenterY = computed(() => config.value.height / 2)

const showArrowEnd = computed(() => {
  const a = config.value.arrow
  return a === 'end' || a === 'both'
})

const showArrowStart = computed(() => {
  const a = config.value.arrow
  return a === 'start' || a === 'both'
})
</script>

<style scoped>
.line-container {
  display: block;
  overflow: visible;
}
</style>
