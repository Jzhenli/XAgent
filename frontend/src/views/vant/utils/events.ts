/**
 * 事件监听工具函数
 * 统一管理事件的添加和移除，避免内存泄漏
 */

type EventHandler<T extends Event = Event> = (event: T) => void

/**
 * 注册事件监听器，返回清理函数
 * @param target 事件目标（window, document, HTMLElement 等）
 * @param eventName 事件名称
 * @param handler 事件处理函数
 * @param options 事件监听选项
 * @returns 清理函数，调用后移除事件监听
 */
export function listenTo<T extends Event = Event>(
  target: EventTarget,
  eventName: string,
  handler: EventHandler<T>,
  options?: boolean | AddEventListenerOptions
): () => void {
  target.addEventListener(eventName, handler as EventHandler, options)
  return () => target.removeEventListener(eventName, handler as EventHandler, options)
}

/**
 * 批量注册事件监听器，返回统一清理函数
 * @param listeners 事件监听配置数组
 * @returns 清理函数，调用后移除所有事件监听
 */
export function listenToAll(
  listeners: Array<{
    target: EventTarget
    event: string
    handler: EventHandler
    options?: boolean | AddEventListenerOptions
  }>
): () => void {
  const cleanups = listeners.map(({ target, event, handler, options }) =>
    listenTo(target, event, handler, options)
  )

  return () => cleanups.forEach(cleanup => cleanup())
}
