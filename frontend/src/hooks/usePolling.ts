import { ref, onMounted, onUnmounted, type Ref } from 'vue'

/**
 * 轮询任务执行函数签名
 */
export type PollingTask = () => Promise<void> | void

/**
 * usePolling 配置选项
 */
export interface UsePollingOptions {
  /** 轮询间隔（毫秒），默认 5000 */
  interval?: number
  /** 启动时是否立即执行一次任务，默认 true */
  immediate?: boolean
  /** 初始是否处于暂停状态，默认 false */
  paused?: boolean
  /** 任务执行失败时的回调 */
  onError?: (error: unknown) => void
}

/**
 * usePolling 返回值
 */
export interface UsePollingReturn {
  /** 是否正在运行（已启动且未停止） */
  isRunning: Ref<boolean>
  /** 是否处于暂停状态 */
  isPaused: Ref<boolean>
  /** 启动轮询 */
  start: () => void
  /** 停止轮询 */
  stop: () => void
  /** 暂停轮询（不重置计时器，仅跳过任务执行） */
  pause: () => void
  /** 恢复轮询 */
  resume: () => void
  /** 立即执行一次任务 */
  runOnce: () => Promise<void>
}

/**
 * 通用轮询 Hook
 *
 * 封装 setInterval 的启动、停止、暂停、恢复逻辑，并在组件卸载时自动清理。
 * 当浏览器标签页不可见时自动暂停，重新可见时恢复，避免后台无效请求。
 *
 * @param task 要周期性执行的任务
 * @param options 轮询配置
 */
export function usePolling(task: PollingTask, options: UsePollingOptions = {}): UsePollingReturn {
  const { interval = 5000, immediate = true, paused = false, onError } = options

  const isRunning = ref(false)
  const isPaused = ref(paused)

  let timer: ReturnType<typeof setInterval> | null = null

  /**
   * 执行一次任务，并捕获异常交给 onError
   */
  const runOnce = async (): Promise<void> => {
    try {
      await task()
    } catch (error) {
      onError?.(error)
    }
  }

  /**
   * 单次 tick：仅在未暂停时执行任务
   */
  const tick = async (): Promise<void> => {
    if (isPaused.value) return
    await runOnce()
  }

  /**
   * 启动轮询
   * 若当前页面处于隐藏状态，则先保持暂停，避免后台无效请求
   */
  const start = (): void => {
    if (timer) return

    isRunning.value = true
    isPaused.value = document.hidden

    if (immediate && !isPaused.value) {
      void tick()
    }

    timer = setInterval(() => {
      void tick()
    }, interval)
  }

  /**
   * 停止轮询并清理计时器
   */
  const stop = (): void => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    isRunning.value = false
  }

  /**
   * 暂停轮询（仅在运行状态下生效）
   */
  const pause = (): void => {
    if (isRunning.value) {
      isPaused.value = true
    }
  }

  /**
   * 恢复轮询
   */
  const resume = (): void => {
    isPaused.value = false
  }

  /**
   * 根据页面可见性自动暂停/恢复
   * 仅在轮询已启动时生效，避免在停止状态下误启动
   */
  const handleVisibilityChange = (): void => {
    if (!isRunning.value) return
    if (document.hidden) {
      pause()
    } else {
      resume()
    }
  }

  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })

  onUnmounted(() => {
    stop()
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })

  return {
    isRunning,
    isPaused,
    start,
    stop,
    pause,
    resume,
    runOnce
  }
}
