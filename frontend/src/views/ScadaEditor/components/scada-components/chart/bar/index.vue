<template>
  <div class="chart-container" :style="containerStyle">
    <div v-if="binding" class="chart-title">
      {{ binding.pointDescription || binding.pointName }}
    </div>
    <v-chart :option="chartOption" class="chart" autoresize />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { ScadaComponent } from '../../../../types'
import { useScadaChart } from '../../../../hooks/useScadaChart'

const props = defineProps<{
  config: ScadaComponent
  editing?: boolean
}>()

const configRef = computed(() => props.config)
const { chartOption, containerStyle, binding } = useScadaChart(configRef, { type: 'bar' })
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

.chart-title {
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-light);
}

.chart {
  flex: 1;
  min-height: 0;
}
</style>
