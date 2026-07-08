import { ref } from 'vue'

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
  const touchStartX = ref(0)
  const touchDeltaX = ref(0)

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.value = e.touches[0].clientX
    touchDeltaX.value = 0
  }

  const onTouchMove = (e: TouchEvent) => {
    touchDeltaX.value = e.touches[0].clientX - touchStartX.value
  }

  const onTouchEnd = () => {
    const delta = touchDeltaX.value
    if (Math.abs(delta) > threshold) {
      if (delta > 0) {
        onSwipeRight?.()
      } else {
        onSwipeLeft?.()
      }
    }
    touchDeltaX.value = 0
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}
