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
import { LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { usePointStore } from '@/stores/points'
import { ScadaPointReaderKey } from '@/utils/scadaPointReader'
import { usePolling } from '@/hooks/usePolling'
import type {
  ScadaComponent,
  LineChartComponentConfig,
  LineChartDataPoint,
  LineChartSeriesItem,
  PointBinding,
} from '../types'
import { useScadaEditor } from './useScadaEditor'

use([CanvasRenderer, LineChart, GridComponent, LegendComponent, TooltipComponent])

const hoursMap: Record<string, number> = {
  '1h': 1,
  '6h': 6,
  '24h': 24,
  '7d': 168,
}

const DEFAULT_COLORS = [
  '#3498db',
  '#e74c3c',
  '#2ecc71',
  '#f39c12',
  '#9b59b6',
  '#1abc9c',
  '#e67e22',
  '#34495e',
  '#16a085',
  '#c0392b',
]

export interface UseScadaLineChartReturn {
  containerRef: Ref<HTMLDivElement | null>
  containerStyle: Ref<Record<string, any>>
}

interface ResolvedSeries {
  item: LineChartSeriesItem
  binding: PointBinding | null
  boundPoint: any | null
  data: LineChartDataPoint[]
}

const ensureSeriesItems = (cfg: LineChartComponentConfig): LineChartSeriesItem[] => {
  if (cfg.seriesItems && cfg.seriesItems.length > 0) return cfg.seriesItems
  return [
    {
      name: '序列 1',
      binding: null,
      lineColor: cfg.lineColor || DEFAULT_COLORS[0],
      nodeFillColor: cfg.nodeFillColor || cfg.lineColor || DEFAULT_COLORS[0],
    },
  ]
}

/**
 * Scada 折线图组件 Hook
 *
 * 统一使用 seriesItems 模式，每个序列项独立绑定点位和颜色
 */
export function useScadaLineChart(
  configRef: MaybeRef<ScadaComponent>,
): UseScadaLineChartReturn {
  const pointStore = usePointStore()
  const injectedReader = inject(ScadaPointReaderKey, null)
  const scada = useScadaEditor()

  const config = computed(() => unref(configRef))
  const chartConfig = computed(() => config.value.config as LineChartComponentConfig)

  const containerRef = ref<HTMLDivElement | null>(null)
  let chartInstance: EChartsType | null = null
  let resizeObserver: ResizeObserver | null = null
  /** 是否已完成首次完整 option 渲染：true 后数据刷新用 merge 模式仅更新 series */
  let hasInitialized = false

  // ═══════════════════════════════════════════════════════════════════════════════
  // 数据加载工具
  // ═══════════════════════════════════════════════════════════════════════════════

  const fetchHistoryReadings = async (asset: string, hours: number = 24) => {
    if (injectedReader) {
      return injectedReader.fetchHistoryReadings(asset, hours)
    }
    return pointStore.fetchHistoryReadings(asset, hours)
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

  /** 统一的设备数据源：优先使用注入的 reader，否则回退到全局 store */
  const devicesSource = computed(() =>
    injectedReader ? injectedReader.devices.value : pointStore.devices,
  )

  const resolveBoundPoint = (bind: PointBinding | null): any | null => {
    if (!bind) return null
    const device = devicesSource.value.find(
      (d: any) => d.asset === bind.deviceId || d.name === bind.deviceId,
    )
    if (!device) return null
    return device.points.find((p: any) => p.name === bind.pointName) || null
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 序列解析
  // ═══════════════════════════════════════════════════════════════════════════════

  const resolveAllSeries = (): ResolvedSeries[] => {
    const cfg = chartConfig.value
    const hours = hoursMap[cfg?.timeRange || '24h'] || 24
    const items = ensureSeriesItems(cfg)

    return items.map((item) => {
      const bound = resolveBoundPoint(item.binding)
      let data: LineChartDataPoint[] = []

      if (scada.isEditing.value) {
        data = generateTrendData(
          { name: '', currentValue: 50, type: 'analog', standard_data_type: 'float' },
          hours,
        )
      } else if (bound) {
        const realData = getPointTrendData(bound.name, item.binding?.deviceId)
        if (realData.length > 0) {
          data = realData
        } else {
          data = generateTrendData(bound, hours)
        }
      }

      return { item, binding: item.binding, boundPoint: bound, data }
    })
  }

  const collectDeviceIds = (): string[] => {
    const ids = new Set<string>()
    const items = ensureSeriesItems(chartConfig.value)
    items.forEach((item) => {
      if (item.binding?.deviceId) {
        ids.add(item.binding.deviceId)
      }
    })
    return Array.from(ids)
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 历史数据加载
  // ═══════════════════════════════════════════════════════════════════════════════

  const loadHistoryData = async () => {
    if (scada.isEditing.value) return

    const deviceIds = collectDeviceIds()
    if (deviceIds.length === 0) return

    try {
      const hours = hoursMap[chartConfig.value?.timeRange || '24h'] || 24
      await Promise.allSettled(deviceIds.map((id) => fetchHistoryReadings(id, hours)))
      updateChartOption()
    } catch (e) {
      console.error('[useScadaLineChart] Failed to load history data:', e)
    }
  }

  /**
   * 增量追加最新 Reading 到历史缓存（复用 fetchDevicePoints 已拿到的数据）
   * 用于 30 秒轮询，避免每轮拉 1000 条全量历史
   */
  const appendHistoryData = async () => {
    if (scada.isEditing.value) return

    const deviceIds = collectDeviceIds()
    if (deviceIds.length === 0) return

    // 无注入 reader（如编辑器内预览）时回退全量加载，保持原有行为
    if (!injectedReader) {
      await loadHistoryData()
      return
    }

    // 存在无历史基线的设备（首次加载失败等）时回退全量加载，兼作失败重试
    if (deviceIds.some((id) => !injectedReader.hasHistoryReadings(id))) {
      await loadHistoryData()
      return
    }

    for (const id of deviceIds) {
      injectedReader.appendLatestReadingToHistory(id)
    }
    // 无条件刷新：同面板多图表共享同一设备的历史缓存，
    // 先执行的去重追加会使后续图表的追加返回 false，若按返回值判断会漏刷新
    updateChartOption()
  }

  const { start: startHistoryPolling, stop: stopHistoryPolling } = usePolling(appendHistoryData, {
    interval: 30000,
    immediate: false,
    paused: scada.isEditing.value,
  })

  /** 是否存在已解析的绑定点位（设备数据就绪信号） */
  const hasResolvedBound = computed(() =>
    ensureSeriesItems(chartConfig.value).some(
      (item) => !!item.binding && resolveBoundPoint(item.binding) !== null,
    ),
  )

  /** 监听绑定点位解析状态从无到有：设备数据就绪时触发一次全量加载
   * （不能用 deep watch 监听 devices：轮询每 5 秒替换设备数据会反复触发全量拉取） */
  watch(hasResolvedBound, (has, had) => {
    if (!scada.isEditing.value && has && !had) {
      void loadHistoryData()
    }
  })

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
    () => chartConfig.value?.seriesItems,
    () => {
      if (!scada.isEditing.value) {
        void loadHistoryData()
      } else {
        updateChartOption(true)
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

    if (!scada.isEditing.value) {
      void loadHistoryData()
      startHistoryPolling()
    }
  })

  onUnmounted(disposeChart)

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
      const fullHex = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex
      const bigint = parseInt(fullHex.slice(0, 6), 16)
      const r = (bigint >> 16) & 255
      const g = (bigint >> 8) & 255
      const b = bigint & 255
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
    return color
  }

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

  const buildGrid = (hasLegend: boolean): EChartsOption['grid'] => ({
    left: '5%',
    right: '5%',
    top: hasLegend ? '15%' : '5%',
    bottom: '5%',
    containLabel: true,
  })

  const buildXAxisData = (allSeries: ResolvedSeries[], cfg: LineChartComponentConfig): string[] => {
    const hours = hoursMap[cfg.timeRange || '24h'] || 24
    const firstData = allSeries.find((s) => s.data.length > 0)
    if (!firstData) return []
    return firstData.data.map((item) =>
      typeof item.timestamp === 'number' ? formatTimestamp(item.timestamp, hours) : item.time,
    )
  }

  const buildXAxisOption = (
    cfg: LineChartComponentConfig,
    data: string[],
  ): EChartsOption['xAxis'] => ({
    type: 'category',
    data,
    boundaryGap: false,
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

  const buildYAxisOption = (cfg: LineChartComponentConfig): EChartsOption['yAxis'] => ({
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

  const buildLegendOption = (
    cfg: LineChartComponentConfig,
    series: ResolvedSeries[],
  ): EChartsOption['legend'] => {
    const showLegend = !!cfg.showLegend
    return {
      show: !!showLegend,
      top: 4,
      left: 'center',
      orient: 'horizontal',
      textStyle: {
        color: cfg.xAxisLabelColor || 'var(--text-secondary)',
        fontSize: cfg.xAxisLabelFontSize ?? 12,
      },
      itemGap: 12,
      itemWidth: 16,
      itemHeight: 8,
    }
  }

  const buildSeriesOption = (
    cfg: LineChartComponentConfig,
    allSeries: ResolvedSeries[],
  ): EChartsOption['series'] => {
    return allSeries.map((s) => {
      const lineColor = s.item.lineColor || DEFAULT_COLORS[0]
      const nodeSize = cfg.nodeSize ?? 0
      const showSymbol = nodeSize > 0
      const values = s.data.map((d) => d.value)
      const hasOnlyOne = allSeries.length === 1

      return {
        name: s.item.name || `Series ${allSeries.indexOf(s) + 1}`,
        type: 'line',
        data: values,
        smooth: cfg.smooth ?? true,
        symbol: showSymbol ? 'circle' : 'none',
        symbolSize: showSymbol ? nodeSize : 0,
        lineStyle: {
          color: lineColor,
          width: cfg.lineWidth ?? 2,
        },
        itemStyle: {
          color: s.item.nodeFillColor || lineColor,
        },
        areaStyle:
          cfg.areaFill && hasOnlyOne
            ? {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: colorWithAlpha(lineColor, 0.25) },
                    { offset: 1, color: colorWithAlpha(lineColor, 0.02) },
                  ],
                },
              }
            : undefined,
      }
    })
  }

  /**
   * 更新图表 option
   * @param full true=完整重建（配置变更/首次渲染）；false=仅增量更新 xAxis + series 数据
   */
  const updateChartOption = (full = false) => {
    if (!chartInstance) return

    const cfg = chartConfig.value
    const allSeries = resolveAllSeries()
    const hasData = allSeries.some((s) => s.data.length > 0)

    if (!hasData) {
      chartInstance.clear()
      hasInitialized = false
      return
    }

    const xAxisData = buildXAxisData(allSeries, cfg)

    if (full || !hasInitialized) {
      // 首次渲染 / 配置变更：完整 option + notMerge，确保 grid/yAxis/legend 等静态配置正确
      const showLegend = !!cfg.showLegend
      const option: EChartsOption = {
        grid: buildGrid(showLegend),
        xAxis: buildXAxisOption(cfg, xAxisData),
        yAxis: buildYAxisOption(cfg),
        legend: buildLegendOption(cfg, allSeries),
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
          },
        },
        series: buildSeriesOption(cfg, allSeries),
      }
      chartInstance.setOption(option, true)
      hasInitialized = true
    } else {
      // 数据刷新：merge 模式仅更新 xAxis.data + series，避免重复重建静态配置
      chartInstance.setOption({
        xAxis: { data: xAxisData },
        series: buildSeriesOption(cfg, allSeries),
      })
    }
  }

  return {
    containerRef,
    containerStyle,
  }
}