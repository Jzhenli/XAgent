<template>
  <div class="chart-container" :style="containerStyle">
    <div v-if="binding" class="chart-title">
      {{ binding.pointDescription || binding.pointName }}
    </div>
    <v-chart :option="chartOption" class="chart" autoresize />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, inject } from 'vue'
import type { ScadaComponent, ChartComponentConfig } from '../../../../types'
import { useScadaBinding } from '../../../../hooks'
import { usePointStore } from '@/stores/points'
import { ScadaPointReaderKey } from '@/utils/scadaPointReader'
import { useScadaEditor } from '../../../../hooks/useScadaEditor'
import { usePolling } from '@/hooks/usePolling'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent])

const props = defineProps<{
  config: ScadaComponent
  editing?: boolean
}>()

const pointStore = usePointStore()
const injectedReader = inject(ScadaPointReaderKey, null)
const scada = useScadaEditor()

const fetchHistoryReadings = async (asset: string, hours: number = 24) => {
  if (injectedReader) {
    return injectedReader.fetchHistoryReadings(asset, hours)
  }
  return pointStore.fetchHistoryReadings(asset, hours)
}

const getPointTrendData = (pointName: string) => {
  if (injectedReader) {
    return injectedReader.getPointTrendData(pointName)
  }
  return pointStore.getPointTrendData(pointName)
}

const generateTrendData = (point: any, hours: number) => {
  if (injectedReader) {
    return injectedReader.generateTrendData(point, hours)
  }
  return pointStore.generateTrendData(point, hours)
}
const chartConfig = computed(() => props.config.config as ChartComponentConfig)
const binding = computed(() => props.config.binding)
const fallbackValue = computed(() => props.config.config.value)

const { boundPoint } = useScadaBinding(binding, {}, fallbackValue)

const hoursMap: Record<string, number> = {
  '1h': 1,
  '6h': 6,
  '24h': 24,
  '7d': 168
}

/**
 * 加载图表绑定点位的历史数据
 */
const loadHistoryData = async () => {
  if (scada.isEditing.value || !binding.value) return

  const deviceId = binding.value.deviceId
  const hours = hoursMap[chartConfig.value?.timeRange || '24h'] || 24

  await fetchHistoryReadings(deviceId, hours)
}

/** 历史数据轮询：每 30 秒刷新一次 */
const { start: startHistoryPolling, stop: stopHistoryPolling } = usePolling(loadHistoryData, {
  interval: 30000,
  immediate: false,
  paused: scada.isEditing.value
})

watch(() => scada.isEditing.value, (isEditing) => {
  if (isEditing) {
    stopHistoryPolling()
  } else {
    void loadHistoryData()
    startHistoryPolling()
  }
})

watch(() => chartConfig.value?.timeRange, () => {
  if (!scada.isEditing.value) {
    void loadHistoryData()
  }
})

onMounted(() => {
  if (!scada.isEditing.value && binding.value) {
    void loadHistoryData()
    startHistoryPolling()
  }
})

const containerStyle = computed(() => ({
  backgroundColor: chartConfig.value?.backgroundColor || undefined,
  borderRadius: `${chartConfig.value?.borderRadius ?? 8}px`
}))

const colorWithAlpha = (color: string | undefined, alpha: number): string => {
  if (!color) return `rgba(52, 152, 219, ${alpha})`
  if (color === 'transparent') return `rgba(0, 0, 0, 0)`
  if (color.startsWith('rgba')) {
    return color.replace(/,\s*[\d.]+\s*\)$/, `, ${alpha})`)
  }
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`)
  }
  if (color.startsWith('#')) {
    const hex = color.replace('#', '')
    const fullHex = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex
    const bigint = parseInt(fullHex.slice(0, 6), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  return color
}

const chartOption = computed(() => {
  const isLine = props.config.type === 'chart-line'

  let data: number[] = []
  if (scada.isEditing.value && typeof fallbackValue.value === 'number') {
    const hours = hoursMap[chartConfig.value?.timeRange || '24h'] || 24
    const trendData = generateTrendData({
      name: '',
      currentValue: fallbackValue.value,
      type: 'analog',
      standard_data_type: 'float'
    } as any, hours)
    data = trendData.map(d => d.value)
  } else if (boundPoint.value) {
    const realData = getPointTrendData(boundPoint.value.name)
    if (realData.length > 0) {
      data = realData.map(d => d.value)
    } else {
      const hours = hoursMap[chartConfig.value?.timeRange || '24h'] || 24
      const trendData = generateTrendData(boundPoint.value, hours)
      data = trendData.map(d => d.value)
    }
  }
  
  return {
    grid: {
      left: '10%',
      right: '5%',
      top: '10%',
      bottom: '15%'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      show: false,
      data: data.map((_, i) => i)
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: { color: 'var(--border-light)' }
      },
      axisLabel: {
        fontSize: 10
      }
    },
    series: [{
      type: isLine ? 'line' : 'bar',
      data: data,
      smooth: true,
      symbol: 'none',
      lineStyle: {
        color: chartConfig.value?.lineColor || 'var(--color-primary)',
        width: 2
      },
      areaStyle: chartConfig.value?.areaFill ? {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: colorWithAlpha(chartConfig.value?.lineColor, 0.25) },
            { offset: 1, color: colorWithAlpha(chartConfig.value?.lineColor, 0.02) }
          ]
        }
      } : undefined,
      itemStyle: {
        color: chartConfig.value?.lineColor || 'var(--color-primary)'
      }
    }]
  }
})
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
