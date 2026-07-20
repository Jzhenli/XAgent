import { computed, watch, onMounted, inject, type Ref, type MaybeRef, unref } from 'vue'
import type { EChartsOption } from 'echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { usePointStore } from '@/stores/points'
import { ScadaPointReaderKey } from '@/utils/scadaPointReader'
import { usePolling } from '@/hooks/usePolling'
import type { ScadaComponent, ChartComponentConfig, PointBinding } from '../types'
import { useScadaEditor } from './useScadaEditor'
import { useScadaBinding } from './useScadaBinding'

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent])

/** 时间范围到小时数的映射 */
const hoursMap: Record<string, number> = {
  '1h': 1,
  '6h': 6,
  '24h': 24,
  '7d': 168
}

export interface UseScadaChartOptions {
  /** 图表类型：折线图或柱状图 */
  type: 'line' | 'bar'
}

export interface UseScadaChartReturn {
  /** ECharts 配置对象 */
  chartOption: Ref<EChartsOption>
  /** 容器样式 */
  containerStyle: Ref<Record<string, any>>
  /** 当前点位绑定 */
  binding: Ref<PointBinding | null>
}

/**
 * Scada 图表组件公共 Hook
 *
 * 负责图表组件的业务逻辑：
 * - 点位绑定与当前值获取
 * - 历史数据加载与轮询
 * - ECharts option 生成
 *
 * 视图组件只需调用此 Hook 并渲染 v-chart。
 */
export function useScadaChart(
  configRef: MaybeRef<ScadaComponent>,
  options: UseScadaChartOptions
): UseScadaChartReturn {
  const pointStore = usePointStore()
  const injectedReader = inject(ScadaPointReaderKey, null)
  const scada = useScadaEditor()

  const config = computed(() => unref(configRef))
  const chartConfig = computed(() => config.value.config as ChartComponentConfig)
  const binding = computed(() => config.value.binding)
  const fallbackValue = computed(() => chartConfig.value?.value)

  const { boundPoint } = useScadaBinding(binding, {}, fallbackValue)

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

  const chartOption = computed<EChartsOption>(() => {
    const isLine = options.type === 'line'

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

  return {
    chartOption,
    containerStyle,
    binding
  }
}
