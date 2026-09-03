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

  /** 统一的点位解析：优先走 reader 的 O(1) Map 索引，否则回退全局 store 线性查找 */
  const resolveBoundPoint = (bind: PointBinding | null): any | null => {
    if (!bind) return null
    if (injectedReader) {
      return injectedReader.resolvePoint(bind.deviceId, bind.pointName)
    }
    const device = pointStore.devices.find(
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

  /** 收集去重后的绑定对（deviceId + pointName）：历史缓存挂在点位上，需逐点位加载 */
  const collectBindings = (): PointBinding[] => {
    const seen = new Set<string>()
    const bindings: PointBinding[] = []
    for (const item of ensureSeriesItems(chartConfig.value)) {
      const bind = item.binding
      if (!bind?.deviceId || !bind.pointName) continue
      const key = `${bind.deviceId}:${bind.pointName}`
      if (seen.has(key)) continue
      seen.add(key)
      bindings.push(bind)
    }
    return bindings
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 历史数据加载
  // ═══════════════════════════════════════════════════════════════════════════════

  const loadHistoryData = async () => {
    if (scada.isEditing.value) return

    const bindings = collectBindings()
    if (bindings.length === 0) return

    try {
      const hours = hoursMap[chartConfig.value?.timeRange || '24h'] || 24
      await Promise.allSettled(
        bindings.map((b) => fetchPointHistory(b.deviceId, b.pointName, hours)),
      )
      updateChartOption()
    } catch (e) {
      console.error('[useScadaLineChart] Failed to load history data:', e)
    }
  }

  /**
   * 30 秒兜底轮询：reader 模式下增量追加由设备轮询在 fetchDevicePoints 内部完成
   * （historyVersion 递增触发刷新），此处仅负责失败重试与无 reader 的编辑器内预览回退
   */
  const appendHistoryData = async () => {
    if (scada.isEditing.value) return

    // 无注入 reader（如编辑器内预览）时回退全量加载，保持原有行为
    if (!injectedReader) {
      await loadHistoryData()
      return
    }

    // 存在未加载历史基线的绑定点位（首次加载失败等）时回退全量加载，兼作失败重试
    if (collectBindings().some((b) => !injectedReader!.hasPointHistory(b.deviceId, b.pointName))) {
      await loadHistoryData()
    }
  }

  const { start: startHistoryPolling, stop: stopHistoryPolling } = usePolling(appendHistoryData, {
    interval: 30000,
    immediate: false,
    paused: scada.isEditing.value,
  })

  /** 已就绪（设备数据已解析）但尚无历史缓存的绑定对 key 集合
   * 用逗号拼接字符串作 watch 源：轮询每轮重建设备对象但历史已跨轮携带，值不变则不触发，
   * 避免退化为"每轮轮询都全量拉取" */
  const pendingHistoryKey = computed(() => {
    if (!injectedReader || scada.isEditing.value) return ''
    return collectBindings()
      .filter(
        (b) => resolveBoundPoint(b) !== null && !injectedReader!.hasPointHistory(b.deviceId, b.pointName),
      )
      .map((b) => `${b.deviceId}:${b.pointName}`)
      .join(',')
  })

  /** 监听"就绪但无历史"的绑定对集合变化即补载历史
   * 覆盖跨设备盲区：历史回包早于设备就绪时写入被静默跳过，若只在"就绪信号从无到有"时
   * 触发重载，后续就绪的设备将无信号可用，对应序列会以模拟随机数兜底渲染直到 30s 兜底轮询 */
  watch(pendingHistoryKey, (key) => {
    if (key) {
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
    const xAxisData = buildXAxisData(allSeries, cfg)

    // 首次渲染 / 配置变更：完整 option + notMerge，确保 grid/yAxis/legend 等静态配置正确；
    // 数据为空时仍渲染坐标轴与图例骨架（series 传空数据），避免进入预览页面时一片空白
    if (full || !hasInitialized) {
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