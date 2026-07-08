/**
 * 数学/数值工具
 * 提供画布编辑中常用的 clamp 等纯函数
 */

/** 将数值限制在 [min, max] 区间内 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}
