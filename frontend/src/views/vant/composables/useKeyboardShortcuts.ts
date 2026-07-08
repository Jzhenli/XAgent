import { onUnmounted } from 'vue'

/**
 * 键盘快捷键映射表
 * Key: 键盘按键名称 (e.g., 'Escape', 'ArrowLeft')
 * Value: 对应的回调函数
 */
export type KeyBindings = Record<string, (event: KeyboardEvent) => void>

/**
 * 键盘快捷键组合式函数
 * 注册全局键盘监听，组件卸载时自动清理
 * @param bindings 按键与回调的映射对象
 */
export function useKeyboardShortcuts(bindings: KeyBindings) {
  const handler = (e: KeyboardEvent) => {
    const callback = bindings[e.key]
    if (typeof callback === 'function') {
      callback(e)
    }
  }

  document.addEventListener('keydown', handler)

  onUnmounted(() => {
    document.removeEventListener('keydown', handler)
  })
}
