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
  /** 是否已完成首次完整 option 渲染：true 后数据刷新用 merge 模式仅更新 series */
  let hasInitialized = false

  // ═══════════════════════════════════════════════════════════════════════════════
  // 历史数据加载
  // ═══════════════════════════════════════════════════════════════════════════════

  /** 拉取点位历史：reader 模式写入点位自身的 historyCache；无 reader（编辑器内预览）回退 store 资产级加载 */
  const fetchPointHistory = async (asset: string, pointName: string, hours: number = 24) => {
    if (injectedReader) {
      return injectedReader.fetchPointHistory(asset, pointName, hours)
    }
    return pointStore.fetchHistoryReadings(asset, hours, 100)
  }

  const getPointTrendData = (pointName: string, asset?: string): LineChartDataPoint[] => {
    if (injectedReader) {
      return injectedReader.getPointTrendData(pointName, asset)
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

    try {
      const { deviceId, pointName } = binding.value
      const hours = hoursMap[chartConfig.value?.timeRange || '24h'] || 24

      await fetchPointHistory(deviceId, pointName, hours)
      updateChartOption()
    } catch (e) {
      console.error('[useScadaBarChart] Failed to load history data:', e)
    }
  }

  /**
   * 30 秒兜底轮询：reader 模式下增量追加由设备轮询在 fetchDevicePoints 内部完成
   * （historyVersion 递增触发刷新），此处仅负责失败重试与无 reader 的编辑器内预览回退
   */
  const appendHistoryData = async () => {
    if (scada.isEditing.value || !binding.value) return

    // 无注入 reader（如编辑器内预览）时回退全量加载，保持原有行为
    if (!injectedReader) {
      await loadHistoryData()
      return
    }

    // 绑定点位无历史基线（首次加载失败等）时回退全量加载，兼作失败重试
    const { deviceId, pointName } = binding.value
    if (!injectedReader.hasPointHistory(deviceId, pointName)) {
      await loadHistoryData()
    }
  }

  const { start: startHistoryPolling, stop: stopHistoryPolling } = usePolling(appendHistoryData, {
    interval: 30000,
    immediate: false,
    paused: scada.isEditing.value,
  })

  /** 监听 boundPoint 变化：子组件挂载时 devices 可能尚未就绪（父页面轮询晚于子组件 mount），
   * 绑定点位就绪后需重新触发数据加载，否则图表将保持空白 */
  watch(
    boundPoint,
    (newBound, oldBound) => {
      if (scada.isEditing.value) return
      if (newBound && !oldBound) {
        void loadHistoryData()
      }
    },
  )

  /** 监听历史缓存版本号：上层统一追加最新读数后递增，触发图表增量刷新
   * （vant 预览模式下由 5s 设备轮询驱动，编辑器内预览时仍靠组件自身 30s 轮询） */
  if (injectedReader) {
    watch(
      () => injectedReader!.historyVersion.value,
      () => {
        if (!scada.isEditing.value) {
          updateChartOption()
        }
      },
    )
  }

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
      updateChartOption(true)
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
        },
        hours,
      )
    }

    if (boundPoint.value) {
      const realData = getPointTrendData(boundPoint.value.name, binding.value?.deviceId)
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

  /**
   * 更新图表 option
   * @param full true=完整重建（配置变更/首次渲染）；false=仅增量更新 xAxis + series 数据
   */
  const updateChartOption = (full = false) => {
    if (!chartInstance) return

    const cfg = chartConfig.value
    const data = buildData()
    const xAxisData = buildXAxisData(data, cfg)
    const values = data.map((d) => d.value)

    // 首次渲染 / 配置变更：完整 option + notMerge；
    // 数据为空时仍渲染坐标轴骨架（series 传空数据），避免进入预览页面时一片空白
    if (full || !hasInitialized) {
      const option: EChartsOption = {
        grid: buildGrid(),
        xAxis: buildXAxisOption(cfg, xAxisData),
        yAxis: buildYAxisOption(cfg),
        series: buildSeriesOption(cfg, values),
      }
      chartInstance.setOption(option, true)
      hasInitialized = true
    } else {
      // 数据刷新：merge 模式仅更新 xAxis.data + series
      chartInstance.setOption({
        xAxis: { data: xAxisData },
        series: buildSeriesOption(cfg, values),
      })
    }
  }

  return {
    containerRef,
    containerStyle,
  }
}
