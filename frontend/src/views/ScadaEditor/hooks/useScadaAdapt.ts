import { computed, onUnmounted, ref, watch } from 'vue'
import type { CSSProperties, Ref } from 'vue'
import { useScadaEditor } from './useScadaEditor'
import { normalizeAdaptMode } from '../utils/adapt'
import type { PanelAdaptMode } from '../types'

/**
 * 面板预览适配 Hook
 * 依据面板配置的适配模式，计算滚动容器、外层布局框、内层缩放层的内联样式：
 * - fit: 等比缩放完整展示，保留留白
 * - fitWidth: X 轴铺满，Y 轴等比缩放并滚动
 * - fitHeight: Y 轴铺满，X 轴等比缩放并滚动
 * - stretch: 非等比拉伸铺满整个屏幕
 *
 * 用法：容器节点绑定 ref 并应用 containerStyle；内部再套两层 ——
 * 外层应用 frameStyle（负责布局尺寸与居中/滚动），内层应用 scaleStyle（负责 transform 缩放）。
 * @param containerRef 滚动容器元素引用
 */
export function useScadaAdapt(containerRef: Ref<HTMLElement | null>) {
  const scada = useScadaEditor()

  /** 容器内容区尺寸（ResizeObserver 实时监听） */
  const containerWidth = ref(0)
  const containerHeight = ref(0)

  let resizeObserver: ResizeObserver | null = null

  /** 容器挂载/切换时重新挂载尺寸监听 */
  watch(containerRef, (el) => {
    resizeObserver?.disconnect()
    if (!el) return
    resizeObserver = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      if (!rect) return
      containerWidth.value = rect.width
      containerHeight.value = rect.height
    })
    resizeObserver.observe(el)
  }, { immediate: true })

  onUnmounted(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
  })

  /** 当前生效的适配模式（缺失/非法回退 fit） */
  const adaptMode = computed<PanelAdaptMode>(() =>
    normalizeAdaptMode(scada.currentPanel.value?.adaptMode)
  )

  /** 画布渲染尺寸（画布逻辑尺寸 × 编辑器缩放） */
  const canvasSize = computed(() => {
    const panel = scada.currentPanel.value
    const zoom = scada.zoom.value || 1
    return {
      width: (panel?.width || 0) * zoom,
      height: (panel?.height || 0) * zoom
    }
  })

  /** 容器样式：按模式决定滚动方向，配合外层布局框 margin:auto 实现“安全居中” */
  const containerStyle = computed<CSSProperties>(() => {
    switch (adaptMode.value) {
      case 'fitWidth':
        return { display: 'flex', overflowX: 'hidden', overflowY: 'auto' }
      case 'fitHeight':
        return { display: 'flex', overflowX: 'auto', overflowY: 'hidden' }
      default:
        return { display: 'flex', overflow: 'hidden' }
    }
  })

  /** 各轴的缩放系数（fit/fitWidth/fitHeight 等比，stretch 非等比） */
  const scales = computed(() => {
    const { width, height } = canvasSize.value
    const vw = containerWidth.value
    const vh = containerHeight.value

    // 尺寸未知时先按 1:1 占位，待监听就绪后再缩放
    if (width <= 0 || height <= 0 || vw <= 0 || vh <= 0) {
      return { sx: 1, sy: 1 }
    }

    switch (adaptMode.value) {
      case 'fitWidth': {
        const s = vw / width
        return { sx: s, sy: s }
      }
      case 'fitHeight': {
        const s = vh / height
        return { sx: s, sy: s }
      }
      case 'stretch':
        return { sx: vw / width, sy: vh / height }
      default: {
        const s = Math.min(vw / width, vh / height)
        return { sx: s, sy: s }
      }
    }
  })

  /**
   * 外层布局框样式：显式设置缩放后的布局尺寸，保证滚动条与
   * margin:auto 居中基于正确的视觉尺寸计算（transform 不参与布局）。
   */
  const frameStyle = computed<CSSProperties>(() => {
    const { width, height } = canvasSize.value
    const { sx, sy } = scales.value
    return {
      width: `${width * sx}px`,
      height: `${height * sy}px`,
      margin: 'auto'
    }
  })

  /** 内层缩放层样式：保持原始画布尺寸，通过 transform 缩放绘制 */
  const scaleStyle = computed<CSSProperties>(() => {
    const { width, height } = canvasSize.value
    const { sx, sy } = scales.value
    return {
      width: `${width}px`,
      height: `${height}px`,
      transform: `scale(${sx}, ${sy})`,
      transformOrigin: 'top left'
    }
  })

  return { containerStyle, frameStyle, scaleStyle }
}