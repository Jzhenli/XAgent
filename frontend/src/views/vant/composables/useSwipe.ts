/**
 * 滑动手势组合式函数
 * 监听触摸事件，检测水平滑动并触发回调
 * @param threshold 滑动触发阈值（像素），默认 50
 * @param onSwipeLeft 向左滑动回调
 * @param onSwipeRight 向右滑动回调
 */
export function useSwipe(
  threshold: number = 50,
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void
) {
  // 纯内部临时数据，不参与视图渲染：用普通变量避免 touchmove
  // 高频赋值（60~120 次/秒）经过响应式代理造成无谓开销
  let touchStartX = 0
  let touchDeltaX = 0

  const onTouchStart = (e: TouchEvent) => {
    touchStartX = e.touches[0].clientX
    touchDeltaX = 0
  }

  const onTouchMove = (e: TouchEvent) => {
    touchDeltaX = e.touches[0].clientX - touchStartX
  }

  const onTouchEnd = () => {
    const delta = touchDeltaX
    if (Math.abs(delta) > threshold) {
      if (delta > 0) {
        onSwipeRight?.()
      } else {
        onSwipeLeft?.()
      }
    }
    touchDeltaX = 0
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}
