import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  type Ref,
  type MaybeRef,
  unref,
} from 'vue'
import type { EChartsOption } from 'echarts'
import { use, init, type EChartsType } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { LegendComponent, TooltipComponent } from 'echarts/components'
import type { ScadaComponent, PieChartComponentConfig, PieChartItemConfig } from '../types'
import { useScadaEditor } from './useScadaEditor'

use([CanvasRenderer, PieChart, LegendComponent, TooltipComponent])

/** mock 数据刷新间隔（ms） */
const MOCK_INTERVAL = 3000

export interface UseScadaPieChartReturn {
  /** 图表容器 DOM 引用 */
  containerRef: Ref<HTMLDivElement | null>
  /** 容器样式 */
  containerStyle: Ref<Record<string, any>>
}

/**
 * Scada 饼状图组件 Hook
 *
 * 负责饼状图组件的完整业务逻辑：
 * - ECharts 实例初始化、自适应 resize、局部刷新、销毁
 * - 周期性随机刷新 mock 数据值
 * - 根据配置动态生成 ECharts option
 *
 * 注意：暂不支持点位绑定，数据完全由 mock 随机生成
 */
export function useScadaPieChart(
  configRef: MaybeRef<ScadaComponent>,
): UseScadaPieChartReturn {
  const scada = useScadaEditor()

  const config = computed(() => unref(configRef))
  const chartConfig = computed(() => config.value.config as PieChartComponentConfig)

  const containerRef = ref<HTMLDivElement | null>(null)
  let chartInstance: EChartsType | null = null
  let resizeObserver: ResizeObserver | null = null
  /** 是否已完成首次完整 option 渲染 */
  let hasInitialized = false
  /** mock 数据刷新定时器 */
  let mockTimer: ReturnType<typeof setInterval> | null = null

  // ═══════════════════════════════════════════════════════════════════════════════
  // Mock 数据管理
  // ═══════════════════════════════════════════════════════════════════════════════

  /** 随机刷新 items 中的 value（10~90 之间） */
  const refreshMockData = () => {
    const cfg = chartConfig.value
    if (!cfg?.items?.length) return
    cfg.items.forEach((item: PieChartItemConfig) => {
      item.value = Math.round(Math.random() * 80 + 10)
    })
  }

  const startMockPolling = () => {
    stopMockPolling()
    refreshMockData()
    updateChartOption()
    mockTimer = setInterval(() => {
      refreshMockData()
      updateChartOption()
    }, MOCK_INTERVAL)
  }

  const stopMockPolling = () => {
    if (mockTimer) {
      clearInterval(mockTimer)
      mockTimer = null
    }
  }

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
    stopMockPolling()

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

    // 饼图无论编辑/运行模式都显示 mock 数据
    startMockPolling()
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

  const buildTooltip = (): EChartsOption['tooltip'] => ({
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)',
  })

  const buildLegend = (cfg: PieChartComponentConfig): EChartsOption['legend'] | undefined => {
    if (cfg.showLegend === false) return undefined
    return {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: {
        color: cfg.legendColor || '#94A3B8',
        fontSize: cfg.legendFontSize ?? 12,
      },
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 8,
    }
  }

  const buildSeries = (cfg: PieChartComponentConfig): EChartsOption['series'] => {
    const isDonut = cfg.showDonut !== false
    const innerRadius = cfg.innerRadius ?? '40%'
    const radius = isDonut ? [innerRadius, '70%'] : '70%'
    const center = isDonut && cfg.showLegend !== false ? ['35%', '50%'] : ['50%', '50%']

    const padAngle = cfg.pieGap ?? 0
    const itemBorderRadius = cfg.pieBorderRadius ?? 0

    return [
      {
        type: 'pie',
        radius,
        center,
        avoidLabelOverlap: true,
        padAngle,
        itemStyle: {
          borderRadius: itemBorderRadius,
        },
        label: {
          show: cfg.showLabel === true,
          position: 'outside',
          formatter: '{b}: {d}%',
        },
        labelLine: {
          show: cfg.showLabel === true,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
        data: (cfg.items || []).map((item: PieChartItemConfig) => ({
          name: item.name,
          value: item.value,
          itemStyle: { color: item.color },
        })),
      },
    ]
  }

  /**
   * 更新图表 option
   * @param full true=完整重建（配置变更/首次渲染）；false=仅增量更新数据
   */
  const updateChartOption = (full = false) => {
    if (!chartInstance) return

    const cfg = chartConfig.value
    if (!cfg) return

    // 首次渲染 / 配置变更：完整 option + notMerge
    if (full || !hasInitialized) {
      const option: EChartsOption = {
        tooltip: buildTooltip(),
        legend: buildLegend(cfg),
        series: buildSeries(cfg),
      }
      chartInstance.setOption(option, true)
      hasInitialized = true
    } else {
      // 数据刷新：merge 模式仅更新 series
      chartInstance.setOption({
        series: buildSeries(cfg),
      })
    }
  }

  return {
    containerRef,
    containerStyle,
  }
}
