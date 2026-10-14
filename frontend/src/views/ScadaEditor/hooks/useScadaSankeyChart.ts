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
import { SankeyChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import type {
  ScadaComponent,
  SankeyChartComponentConfig,
  SankeyLinkConfig,
} from '../types'

use([CanvasRenderer, SankeyChart, TooltipComponent])

/** mock 数据刷新间隔（ms） */
const DEFAULT_MOCK_INTERVAL = 3000

/** 赛博朋克节点配色 */
const NODE_PALETTE = [
  '#22D3EE', // cyan
  '#A78BFA', // purple
  '#34D399', // green
  '#FBBF24', // amber
  '#F472B6', // pink
  '#60A5FA', // blue
  '#FB7185', // rose
  '#2DD4BF', // teal
]

export interface UseScadaSankeyChartReturn {
  /** 图表容器 DOM 引用 */
  containerRef: Ref<HTMLDivElement | null>
  /** 容器样式 */
  containerStyle: Ref<Record<string, any>>
}

/**
 * Scada 桑基图组件 Hook
 *
 * 负责桑基图组件的完整业务逻辑：
 * - ECharts Sankey 实例初始化、自适应 resize、局部刷新、销毁
 * - 周期性随机刷新 mock 数据值
 * - 根据配置动态生成 ECharts option（渐变色连线、发光效果、悬停高亮）
 *
 * 注意：不支持点位绑定，数据完全由 mock 随机生成
 */
export function useScadaSankeyChart(
  configRef: MaybeRef<ScadaComponent>,
): UseScadaSankeyChartReturn {
  const config = computed(() => unref(configRef))
  const chartConfig = computed(() => config.value.config as SankeyChartComponentConfig)

  const containerRef = ref<HTMLDivElement | null>(null)
  let chartInstance: EChartsType | null = null
  let resizeObserver: ResizeObserver | null = null
  /** 是否已完成首次完整 option 渲染 */
  let hasInitialized = false
  /** mock 数据刷新定时器 */
  let mockTimer: ReturnType<typeof setInterval> | null = null
  /** 基础值快照（用于 refresh 时作为基准） */
  const baseValues = new Map<string, number>()

  // ═══════════════════════════════════════════════════════════════════════════════
  // Mock 数据管理
  // ═══════════════════════════════════════════════════════════════════════════════

  const initBaseValues = () => {
    baseValues.clear()
    const cfg = chartConfig.value
    if (!cfg?.links) return
    cfg.links.forEach((link: SankeyLinkConfig) => {
      const key = `${link.source}→${link.target}`
      if (!baseValues.has(key)) {
        baseValues.set(key, link.value)
      }
    })
  }

  /** 随机刷新 links 中的 value（在基准值 ±15% 范围内浮动） */
  const refreshMockData = () => {
    const cfg = chartConfig.value
    if (!cfg?.links?.length) return
    cfg.links.forEach((link: SankeyLinkConfig) => {
      const key = `${link.source}→${link.target}`
      const base = baseValues.get(key) ?? link.value
      const factor = 0.85 + Math.random() * 0.3
      link.value = Math.max(1, Math.round(base * factor))
    })
  }

  const startMockPolling = () => {
    stopMockPolling()
    const cfg = chartConfig.value
    if (cfg?.autoRefresh === false) return

    initBaseValues()
    refreshMockData()
    updateChartOption()

    const interval = cfg?.refreshInterval ?? DEFAULT_MOCK_INTERVAL
    mockTimer = setInterval(() => {
      refreshMockData()
      updateChartOption()
    }, interval)
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
    updateChartOption(true)
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

    startMockPolling()
  })

  onUnmounted(disposeChart)

  // ═══════════════════════════════════════════════════════════════════════════════
  // 配置变更时局部刷新
  // ═══════════════════════════════════════════════════════════════════════════════

  watch(
    () => [
      chartConfig.value?.nodes,
      chartConfig.value?.links,
      chartConfig.value?.nodeWidth,
      chartConfig.value?.nodeGap,
      chartConfig.value?.nodeBorderRadius,
      chartConfig.value?.linkColorMode,
      chartConfig.value?.linkOpacity,
      chartConfig.value?.hoverHighlight,
      chartConfig.value?.autoRefresh,
      chartConfig.value?.refreshInterval,
    ],
    () => {
      updateChartOption(true)
      // autoRefresh / refreshInterval 变更时重启轮询
      startMockPolling()
    },
    { deep: true },
  )

  // ═══════════════════════════════════════════════════════════════════════════════
  // 图表 option 构建
  // ═══════════════════════════════════════════════════════════════════════════════

  const containerStyle = computed(() => ({
    backgroundColor: chartConfig.value?.backgroundColor || undefined,
  }))

  /**
   * 构建酷炫的渐变连线颜色
   * 为每条 link 生成 source→target 的 linearGradient
   */
  const buildGradientLinks = (
    cfg: SankeyChartComponentConfig,
  ): EChartsOption['series'] => {
    const nodes = cfg.nodes ?? []
    const links = cfg.links ?? []
    const nodeColorMap = new Map<string, string>()

    // 构建节点颜色映射（用户自定义 or 自动分配）
    nodes.forEach((node, idx) => {
      nodeColorMap.set(
        node.name,
        node.color || NODE_PALETTE[idx % NODE_PALETTE.length],
      )
    })

    // 构建带颜色的节点
    const seriesData = nodes.map((node, idx) => ({
      name: node.name,
      itemStyle: {
        color: nodeColorMap.get(node.name)!,
        borderColor: nodeColorMap.get(node.name)!,
        borderWidth: 0,
      },
    }))

    // 构建带渐变的连线
    const linkOpacity = cfg.linkOpacity ?? 0.45
    const colorMode = cfg.linkColorMode ?? 'gradient'

    const seriesLinks = links.map((link) => {
      const sourceColor = nodeColorMap.get(link.source) || '#22D3EE'
      const targetColor = nodeColorMap.get(link.target) || '#A78BFA'

      let lineColor: unknown
      if (colorMode === 'source') {
        lineColor = sourceColor
      } else if (colorMode === 'target') {
        lineColor = targetColor
      } else {
        // gradient：水平渐变 source→target
        lineColor = {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: sourceColor },
            { offset: 1, color: targetColor },
          ],
        }
      }

      return {
        source: link.source,
        target: link.target,
        value: link.value,
        lineStyle: {
          color: lineColor,
          opacity: linkOpacity,
          curveness: 0.5,
        },
      }
    })

    return [
      {
        type: 'sankey',
        nodeWidth: cfg.nodeWidth ?? 20,
        nodeGap: cfg.nodeGap ?? 14,
        nodeAlign: 'justify',
        animationDuration: 800,
        animationDurationUpdate: 600,
        // 节点样式
        itemStyle: {
          borderWidth: 0,
          borderRadius: cfg.nodeBorderRadius ?? 4,
          shadowBlur: 8,
          shadowColor: 'rgba(34, 211, 238, 0.25)',
        },
        // 标签样式
        label: {
          show: true,
          color: '#E2E8F0',
          fontSize: 11,
          fontWeight: 500,
          textShadowColor: 'rgba(0, 0, 0, 0.5)',
          textShadowBlur: 4,
        },
        // 悬停效果
        emphasis: {
          focus: cfg.hoverHighlight === false ? 'none' : 'adjacency',
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(34, 211, 238, 0.7)',
            borderWidth: 2,
            borderColor: '#22D3EE',
          },
          lineStyle: {
            opacity: 0.9,
            width: 4,
            shadowBlur: 12,
            shadowColor: 'rgba(34, 211, 238, 0.6)',
          },
          label: {
            color: '#22D3EE',
            fontWeight: 700,
          },
        },
        lineStyle: {
          curveness: 0.5,
        },
        data: seriesData,
        links: seriesLinks,
      },
    ]
  }

  const buildTooltip = (): EChartsOption['tooltip'] => ({
    trigger: 'item',
    triggerOn: 'mousemove',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderColor: 'rgba(34, 211, 238, 0.4)',
    borderWidth: 1,
    textStyle: {
      color: '#E2E8F0',
      fontSize: 12,
    },
    formatter: (params: unknown) => {
      const p = params as {
        dataType?: string
        data?: { source?: string; target?: string; value?: number; name?: string }
        name?: string
      }
      if (p.dataType === 'edge' && p.data) {
        return `<span style="color:#22D3EE">${p.data.source}</span> → <span style="color:#A78BFA">${p.data.target}</span><br/><b style="color:#FBBF24">${p.data.value}</b>`
      }
      return `<b style="color:#22D3EE">${p.name || p.data?.name || ''}</b>`
    },
  })

  /**
   * 更新图表 option
   * @param full true=完整重建（配置变更/首次渲染）；false=仅增量更新数据
   */
  const updateChartOption = (full = false) => {
    if (!chartInstance) return

    const cfg = chartConfig.value
    if (!cfg) return

    if (full || !hasInitialized) {
      const option: EChartsOption = {
        tooltip: buildTooltip(),
        series: buildGradientLinks(cfg),
      }
      chartInstance.setOption(option, true)
      hasInitialized = true
    } else {
      // 数据刷新：merge 模式仅更新 series 的 links
      chartInstance.setOption({
        series: buildGradientLinks(cfg),
      })
    }
  }

  return {
    containerRef,
    containerStyle,
  }
}
