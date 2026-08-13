<template>
  <div class="chart-container" :style="containerStyle">
    <div ref="containerRef" class="chart" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ScadaComponent } from '../../../../types'
import { useScadaBarChart } from '../../../../hooks/useScadaBarChart'

export interface BarChartProps {
  /** 组件完整配置对象 */
  component: ScadaComponent
  /** 是否处于编辑模式 */
  editing?: boolean
}

const props = defineProps<BarChartProps>()

const configRef = computed(() => props.component)
const { containerRef, containerStyle } = useScadaBarChart(configRef)
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-container);
  border-radius: 8px;
  overflow: hidden;
}

.chart {
  flex: 1;
  min-height: 0;
  width: 100%;
  height: 100%;
}
</style>