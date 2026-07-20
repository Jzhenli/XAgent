<template>
  <div class="chart-container" :style="containerStyle">
    <div ref="containerRef" class="chart" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ScadaComponent } from '../../../../types'
import { useScadaLineChart } from '../../../../hooks/useScadaLineChart'

export interface LineChartProps {
  /** 组件完整配置对象 */
  config: ScadaComponent
  /** 是否处于编辑模式 */
  editing?: boolean
}

const props = defineProps<LineChartProps>()

const configRef = computed(() => props.config)
const { containerRef, containerStyle } = useScadaLineChart(configRef)
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
