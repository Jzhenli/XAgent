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
  /** 启动时是否立即执行一次任务，默认 false（等一个周期后首次刷新） */
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
 * 封装"上一轮完成后再安排下一轮"的递归 setTimeout 轮询逻辑，
 * 避免 setInterval 在任务耗时 > interval 时产生事件循环堆积，
 * 防止密集 watcher 触发与用户交互竞争主线程。
 *
 * 当浏览器标签页不可见时自动暂停，重新可见时恢复，避免后台无效请求。
 *
 * @param task 要周期性执行的任务
 * @param options 轮询配置
 */
export function usePolling(task: PollingTask, options: UsePollingOptions = {}): UsePollingReturn {
  const { interval = 5000, immediate = false, paused = false, onError } = options

  const isRunning = ref(false)
  const isPaused = ref(paused)
  const isExecuting = ref(false)

  // 使用 setTimeout（而非 setInterval），防止任务耗时 > interval 时堆积
  let timer: ReturnType<typeof setTimeout> | null = null

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
   * 单次 tick：暂停中或执行中直接跳过，否则执行任务；
   * 任务结束后在 finally 里递归安排下一轮（上一轮完了才排下一轮，永不堆积）
   */
  const tick = async (): Promise<void> => {
    if (isPaused.value) return
    if (isExecuting.value) return  // 并发守卫（理论上 finally 串行但双保险）
    isExecuting.value = true
    try {
      await runOnce()
    } finally {
      isExecuting.value = false
      // stop() 时 timer 已被置 null，这里判断后不会排新任务
      if (isRunning.value && timer !== null) {
        timer = setTimeout(tick, interval)
      }
    }
  }

  /**
   * 启动轮询
   * 若当前页面处于隐藏状态，则先保持暂停，避免后台无效请求
   */
  const start = (): void => {
    if (timer) return  // 已在运行或已排好下一轮，跳过

    isRunning.value = true
    isPaused.value = document.hidden

    if (immediate && !isPaused.value) {
      void tick()  // 第一帧执行，后续由 tick 的 finally 递归安排
    } else if (!isPaused.value) {
      timer = setTimeout(tick, interval)
    }
  }

  /**
   * 停止轮询并清理计时器
   */
  const stop = (): void => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    isRunning.value = false
    isExecuting.value = false
  }

  /**
   * 暂停轮询（清除排队的 setTimeout，避免恢复后堆积）
   */
  const pause = (): void => {
    if (isRunning.value) {
      isPaused.value = true
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }
  }

  /**
   * 恢复轮询（安排下一轮在 interval 后执行，避免堆积）
   */
  const resume = (): void => {
    isPaused.value = false
    if (isRunning.value && !timer) {
      timer = setTimeout(tick, interval)
    }
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
