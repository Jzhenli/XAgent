/**
 * DOM/浏览器工具
 * 集中处理 ScadaEditor 中与 DOM 交互的重复逻辑
 */

/** 从 MouseEvent 计算鼠标在画布（缩放后）中的坐标 */
export function getCanvasPositionFromEvent(
  canvas: HTMLElement,
  event: MouseEvent,
  zoom = 1
): { x: number; y: number } {
  return getCanvasPosition(canvas, event.clientX, event.clientY, zoom)
}

/** 根据 client 坐标计算鼠标在画布（缩放后）中的坐标 */
export function getCanvasPosition(
  canvas: HTMLElement,
  clientX: number,
  clientY: number,
  zoom = 1
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect()
  return {
    x: (clientX - rect.left) / zoom,
    y: (clientY - rect.top) / zoom
  }
}

/** 从 input/change 事件中读取数值，非法时返回 null */
export function readInputNumber(event: Event): number | null {
  const value = Number((event.target as HTMLInputElement).value)
  return Number.isNaN(value) ? null : value
}

/** 将文件读取为 DataURL */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/** 将对象作为 JSON 文件下载到本地 */
export function downloadJson(data: object, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
