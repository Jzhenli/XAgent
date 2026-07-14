import { ref, onMounted, onUnmounted, isRef } from 'vue'
import { useRouter } from 'vue-router'

import type { Ref } from 'vue'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export interface UseScadaNavigationGuardOptions {
  /** 当前页面是否存在未保存的修改（响应式引用或 getter 函数） */
  isDirty: Ref<boolean> | (() => boolean)
  /** 当前路由名称，用于识别从本页面发起的导航 */
  routeName?: string
  /** 用户确认保存后的回调 */
  onSave?: () => Promise<void> | void
  /** 用户确认放弃后的回调 */
  onDiscard?: () => void
  /** 用户取消确认后的回调 */
  onCancel?: () => void
}

/**
 * 封装 Scada 编辑器离开确认逻辑。
 *
 * 当用户在未保存修改的情况下离开当前路由时，通过 `router.beforeEach` 拦截导航
 * 并显示保存确认弹窗；同时提供手动触发离开确认的能力（如返回按钮）。
 */
export function useScadaNavigationGuard(options: UseScadaNavigationGuardOptions) {
  const router = useRouter()
  const showSaveConfirm = ref(false)

  const routeName = options.routeName ?? 'ScadaEditor'
  let isNavigating = false
  let removeGuard: (() => void) | null = null

  /** 获取当前脏状态 */
  const getIsDirty = (): boolean => {
    return isRef(options.isDirty) ? options.isDirty.value : options.isDirty()
  }

  /** 开始离开确认流程 */
  const startLeaveConfirmation = () => {
    showSaveConfirm.value = true
    isNavigating = true
  }

  /** 重置离开确认流程 */
  const resetLeaveConfirmation = () => {
    isNavigating = false
  }

  /** 路由守卫：拦截从当前页面离开且存在未保存修改的导航 */
  const guard = (
    _to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    if (from.name === routeName && getIsDirty() && !isNavigating) {
      startLeaveConfirmation()
      next(false)
    } else {
      next()
    }
  }

  /** 确认保存 */
  const confirmSave = async () => {
    showSaveConfirm.value = false
    await options.onSave?.()
    resetLeaveConfirmation()
  }

  /** 确认放弃 */
  const confirmDiscard = async () => {
    showSaveConfirm.value = false
    await options.onDiscard?.()
    resetLeaveConfirmation()
  }

  /** 取消确认 */
  const cancelConfirm = () => {
    showSaveConfirm.value = false
    resetLeaveConfirmation()
    options.onCancel?.()
  }

  onMounted(() => {
    removeGuard = router.beforeEach(guard)
  })

  onUnmounted(() => {
    removeGuard?.()
  })

  return {
    showSaveConfirm,
    startLeaveConfirmation,
    confirmSave,
    confirmDiscard,
    cancelConfirm
  }
}
