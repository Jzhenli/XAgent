import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  inject,
  type Ref,
  type MaybeRef,
  unref,
} from 'vue'
import type { EChartsOption } from 'echarts'
import { use, init, type EChartsType } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'
import { usePointStore } from '@/stores/points'
import { ScadaPointReaderKey } from '@/utils/scadaPointReader'
import { usePolling } from '@/hooks/usePolling'
import type {
  ScadaComponent,
  BarChartComponentConfig,
  LineChartDataPoint,
} from '../types'
import { useScadaEditor } from './useScadaEditor'
import { useScadaBinding } from './useScadaBinding'

use([CanvasRenderer, BarChart, GridComponent])

/** 时间范围到小时数的映射 */
const hoursMap: Record<string, number> = {
  '1h': 1,
  '6h': 6,
  '24h': 24,
  '7d': 168,
}

export interface UseScadaBarChartReturn {
  /** 图表容器 DOM 引用 */
  containerRef: Ref<HTMLDivElement | null>
  /** 容器样式 */
  containerStyle: Ref<Record<string, any>>
}

/**
 * Scada 柱状图组件 Hook
 *
 * 负责柱状图组件的完整业务逻辑：
 * - ECharts 实例初始化、自适应 resize、局部刷新、销毁
 * - 点位绑定与历史数据加载/轮询
 * - 根据配置动态生成 ECharts option
 */
export function useScadaBarChart(
  configRef: MaybeRef<ScadaComponent>,
): UseScadaBarChartReturn {
  const pointStore = usePointStore()
  const injectedReader = inject(ScadaPointReaderKey, null)
  const scada = useScadaEditor()

  const config = computed(() => unref(configRef))
  const chartConfig = computed(() => config.value.config as BarChartComponentConfig)
  const binding = computed(() => config.value.binding)
  const fallbackValue = computed(() => chartConfig.value?.value)

  const { boundPoint } = useScadaBinding(binding, {}, fallbackValue)

  const containerRef = ref<HTMLDivElement | null>(null)
  let chartInstance: EChartsType | null = null
  let resizeObserver: ResizeObserver | null = null

  // ═══════════════════════════════════════════════════════════════════════════════
  // 历史数据加载
  // ═══════════════════════════════════════════════════════════════════════════════

  const fetchHistoryReadings = async (asset: string, hours: number = 24) => {
    if (injectedReader) {
      return injectedReader.fetchHistoryReadings(asset, hours)
    }
    return pointStore.fetchHistoryReadings(asset, hours)
  }

  const getPointTrendData = (pointName: string): LineChartDataPoint[] => {
    if (injectedReader) {
      return injectedReader.getPointTrendData(pointName)
    }
    return pointStore.getPointTrendData(pointName)
  }

  const generateTrendData = (point: any, hours: number): LineChartDataPoint[] => {
    if (injectedReader) {
      return injectedReader.generateTrendData(point, hours)
    }
    return pointStore.generateTrendData(point, hours)
  }

  const loadHistoryData = async () => {
    if (scada.isEditing.value || !binding.value) return

    const deviceId = binding.value.deviceId
    const hours = hoursMap[chartConfig.value?.timeRange || '24h'] || 24

    await fetchHistoryReadings(deviceId, hours)
    updateChartOption()
  }

  const { start: startHistoryPolling, stop: stopHistoryPolling } = usePolling(loadHistoryData, {
    interval: 30000,
    immediate: false,
    paused: scada.isEditing.value,
  })

  watch(
    () => scada.isEditing.value,
    (isEditing) => {
      if (isEditing) {
        stopHistoryPolling()
      } else {
        void loadHistoryData()
        startHistoryPolling()
      }
    },
  )

  watch(
    () => chartConfig.value?.timeRange,
    () => {
      if (!scada.isEditing.value) {
        void loadHistoryData()
      }
    },
  )

  watch(
    () => binding.value,
    () => {
      if (!scada.isEditing.value) {
        void loadHistoryData()
      }
    },
    { deep: true },
  )

  // ═══════════════════════════════════════════════════════════════════════════════
  // ECharts 生命周期
  // ═══════════════════════════════════════════════════════════════════════════════

  const initChart = () => {
    const el = containerRef.value
    if (!el || chartInstance) return

    chartInstance = init(el)
    updateChartOption()
  }

  const disposeChart = () => {
    stopHistoryPolling()

    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }

    if (chartInstance) {
      chartInstance.dispose()
      chartInstance = null
    }
  }

  onMounted(() => {
    initChart()

    if (containerRef.value && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        chartInstance?.resize()
      })
      resizeObserver.observe(containerRef.value)
    }

    if (!scada.isEditing.value && binding.value) {
      void loadHistoryData()
      startHistoryPolling()
    }
  })

  onUnmounted(disposeChart)

  // ═══════════════════════════════════════════════════════════════════════════════
  // 配置变更时局部刷新
  // ═══════════════════════════════════════════════════════════════════════════════

  watch(
    () => chartConfig.value,
    () => {
      updateChartOption()
    },
    { deep: true },
  )

  // ═══════════════════════════════════════════════════════════════════════════════
  // 图表 option 构建
  // ═══════════════════════════════════════════════════════════════════════════════

  const containerStyle = computed(() => ({
    backgroundColor: chartConfig.value?.backgroundColor || undefined,
  }))

  const resolveBarColor = (cfg: BarChartComponentConfig): string =>
    cfg.barColor || 'var(--color-primary)'

  const formatTimestamp = (timestamp: number, hours: number): string => {
    const date = new Date(timestamp)
    const hoursStr = date.getHours().toString().padStart(2, '0')
    const minutesStr = date.getMinutes().toString().padStart(2, '0')

    if (hours <= 24) {
      return `${hoursStr}:${minutesStr}`
    }

    const monthStr = (date.getMonth() + 1).toString().padStart(2, '0')
    const dayStr = date.getDate().toString().padStart(2, '0')
    return `${monthStr}-${dayStr} ${hoursStr}:${minutesStr}`
  }

  const buildData = (): LineChartDataPoint[] => {
    const cfg = chartConfig.value
    const hours = hoursMap[cfg?.timeRange || '24h'] || 24

    if (scada.isEditing.value && typeof fallbackValue.value === 'number') {
      return generateTrendData(
        {
          name: '',
          currentValue: fallbackValue.value,
          type: 'analog',
          standard_data_type: 'float',
        } as any,
        hours,
      )
    }

    if (boundPoint.value) {
      const realData = getPointTrendData(boundPoint.value.name)
      if (realData.length > 0) {
        return realData
      }
      return generateTrendData(boundPoint.value, hours)
    }

    return []
  }

  const buildXAxisData = (data: LineChartDataPoint[], cfg: BarChartComponentConfig): string[] => {
    const hours = hoursMap[cfg.timeRange || '24h'] || 24
    return data.map((item) =>
      typeof item.timestamp === 'number' ? formatTimestamp(item.timestamp, hours) : item.time,
    )
  }

  const buildGrid = (): EChartsOption['grid'] => ({
    left: '5%',
    right: '5%',
    top: '5%',
    bottom: '5%',
    containLabel: true,
  })

  const buildXAxisOption = (
    cfg: BarChartComponentConfig,
    data: string[],
  ): EChartsOption['xAxis'] => ({
    type: 'category',
    data,
    axisLabel: {
      show: cfg.showXAxisLabel !== false,
      color: cfg.xAxisLabelColor || 'var(--text-secondary)',
      fontSize: cfg.xAxisLabelFontSize ?? 12,
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      show: false,
    },
  })

  const buildYAxisOption = (cfg: BarChartComponentConfig): EChartsOption['yAxis'] => ({
    type: 'value',
    axisLabel: {
      show: cfg.showYAxisLabel !== false,
      color: cfg.yAxisLabelColor || 'var(--text-secondary)',
      fontSize: cfg.yAxisLabelFontSize ?? 12,
    },
    axisLine: {
      show: cfg.showYAxisLine !== false,
    },
    splitLine: {
      show: false,
    },
  })

  const buildSeriesOption = (
    cfg: BarChartComponentConfig,
    values: number[],
  ): EChartsOption['series'] => {
    const barColor = resolveBarColor(cfg)

    return [
      {
        type: 'bar',
        data: values,
        barWidth: cfg.barWidth ?? '50%',
        itemStyle: {
          color: barColor,
          borderRadius: cfg.barBorderRadius ?? 4,
        },
      },
    ]
  }

  const updateChartOption = () => {
    if (!chartInstance) return

    const cfg = chartConfig.value
    const data = buildData()
    const xAxisData = buildXAxisData(data, cfg)
    const values = data.map((d) => d.value)

    const option: EChartsOption = {
      grid: buildGrid(),
      xAxis: buildXAxisOption(cfg, xAxisData),
      yAxis: buildYAxisOption(cfg),
      series: buildSeriesOption(cfg, values),
    }

    chartInstance.setOption(option, true)
  }

  return {
    containerRef,
    containerStyle,
  }
}
