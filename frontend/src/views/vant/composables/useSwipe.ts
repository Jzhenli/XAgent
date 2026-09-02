/**
 * 滑动手势组合式函数
 * 监听触摸事件，检测水平滑动并触发回调
 * - 轴向锁定：首个显著位移确定手势方向，垂直滑动不误触发切换
 * - 甩动判定：短距离高速滑动（惯性甩动）同样视为有效切换
 * - 多指忽略：多指触摸（如捏合缩放）不参与滑动判定
 * @param threshold 滑动触发阈值（像素），默认 50
 * @param onSwipeLeft 向左滑动回调
 * @param onSwipeRight 向右滑动回调
 */
export function useSwipe(
  threshold: number = 50,
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void
) {
  /** 轴向锁定前的不确定距离：小于该位移不判定方向，避免手指微颤误锁 */
  const AXIS_LOCK_DISTANCE = 10
  /** 甩动速度阈值（px/ms）：超过该速度的短距离滑动也触发切换 */
  const FLICK_VELOCITY = 0.5
  /** 甩动判定的最小位移：避免原地轻点因速度噪声触发切换 */
  const FLICK_MIN_DISTANCE = 24

  type GestureState = 'pending' | 'horizontal' | 'vertical' | 'cancelled'

  // 纯内部临时数据，不参与视图渲染：用普通变量避免 touchmove
  // 高频赋值（60~120 次/秒）经过响应式代理造成无谓开销
  let touchStartX = 0
  let touchStartY = 0
  let touchDeltaX = 0
  let startTime = 0
  let state: GestureState = 'pending'

  const reset = () => {
    touchDeltaX = 0
    state = 'pending'
  }

  const onTouchStart = (e: TouchEvent) => {
    // 多指触摸（捏合缩放等）不参与滑动判定
    if (e.touches.length !== 1) {
      state = 'cancelled'
      return
    }
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
    startTime = e.timeStamp
    reset()
  }

  const onTouchMove = (e: TouchEvent) => {
    if (state === 'cancelled' || e.touches.length !== 1) {
      state = 'cancelled'
      return
    }
    const deltaX = e.touches[0].clientX - touchStartX
    const deltaY = e.touches[0].clientY - touchStartY

    // 轴向锁定：首个显著位移确定手势方向，之后不再变更
    if (state === 'pending') {
      if (Math.abs(deltaX) < AXIS_LOCK_DISTANCE && Math.abs(deltaY) < AXIS_LOCK_DISTANCE) return
      state = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical'
    }
    if (state === 'horizontal') {
      touchDeltaX = deltaX
    }
  }

  const onTouchEnd = (e: TouchEvent) => {
    if (state === 'horizontal') {
      const delta = touchDeltaX
      // 位移超过阈值，或短距离高速甩动，均判定为有效滑动
      const duration = Math.max(e.timeStamp - startTime, 1)
      const isFlick =
        Math.abs(delta) >= FLICK_MIN_DISTANCE &&
        Math.abs(delta) / duration >= FLICK_VELOCITY
      if (Math.abs(delta) > threshold || isFlick) {
        if (delta > 0) {
          onSwipeRight?.()
        } else {
          onSwipeLeft?.()
        }
      }
    }
    reset()
  }

  /** 手势被系统接管（滚动打断、来电、通知中心等）时重置手势状态 */
  const onTouchCancel = () => reset()

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
  }
}
