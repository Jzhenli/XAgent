<template>
  <svg
    class="arc-container"
    :width="config.width"
    :height="config.height"
    :viewBox="`0 0 ${config.width} ${config.height}`"
  >
    <defs v-if="showArrowEnd || showArrowStart">
      <marker
        v-if="showArrowEnd"
        id="arc-arrow-end"
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
        id="arc-arrow-start"
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
    <path
      :d="arcPath"
      fill="none"
      :stroke="config.strokeColor"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      :marker-start="showArrowStart ? 'url(#arc-arrow-start)' : undefined"
      :marker-end="showArrowEnd ? 'url(#arc-arrow-end)' : undefined"
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

const config = computed(() => (props.component as ScadaComponent<'arc'>).config)

const strokeWidth = computed(() => config.value.strokeWidth ?? 2)
const arrowSize = computed(() => Math.max(strokeWidth.value * 3, 6))
const startAngle = computed(() => config.value.startAngle ?? 0)
const endAngle = computed(() => config.value.endAngle ?? 180)

const showArrowEnd = computed(() => {
  const a = config.value.arrow
  return a === 'end' || a === 'both'
})

const showArrowStart = computed(() => {
  const a = config.value.arrow
  return a === 'start' || a === 'both'
})

const cx = computed(() => config.value.width / 2)
const cy = computed(() => config.value.height / 2)

const radius = computed(() => {
  const r = Math.min(config.value.width, config.value.height) / 2 - strokeWidth.value
  return Math.max(r, strokeWidth.value)
})

const polarToCartesian = (angleDeg: number, r: number) => {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: cx.value + r * Math.cos(rad),
    y: cy.value + r * Math.sin(rad),
  }
}

const arcPath = computed(() => {
  const r = radius.value
  const start = polarToCartesian(startAngle.value, r)
  const end = polarToCartesian(endAngle.value, r)

  let delta = endAngle.value - startAngle.value
  if (delta <= 0) delta += 360

  const largeArcFlag = delta > 180 ? 1 : 0
  const sweepFlag = delta > 0 ? 1 : 0

  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`
})
</script>

<style scoped>
.arc-container {
  display: block;
  overflow: visible;
}
</style>
