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
        refX="0"
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
        refX="0"
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
      :x1="lineX1"
      :y1="lineCenterY"
      :x2="lineX2"
      :y2="lineCenterY"
      :stroke="config.strokeColor"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      :marker-start="showArrowStart ? 'url(#arrow-start)' : undefined"
      :marker-end="showArrowEnd ? 'url(#arrow-end)' : undefined"
      :transform="lineTransform"
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

const angle = computed(() => {
  const raw = config.value.angle ?? 0
  const num = Number(raw)
  return isNaN(num) ? 0 : num
})

const lineX1 = computed(() => (showArrowStart.value ? arrowSize.value : 0))
const lineX2 = computed(() =>
  showArrowEnd.value ? config.value.width - arrowSize.value : config.value.width,
)

const lineCenterX = computed(() => (lineX1.value + lineX2.value) / 2)

const lineTransform = computed(() => {
  if (!angle.value) return undefined
  return `rotate(${angle.value} ${lineCenterX.value} ${lineCenterY.value})`
})
</script>

<style scoped>
.line-container {
  display: block;
  overflow: visible;
}
</style>
