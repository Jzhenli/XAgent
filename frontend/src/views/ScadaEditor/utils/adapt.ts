import type { PanelAdaptMode } from '../types'

/** 默认适配模式：等比缩放完整展示 */
export const DEFAULT_ADAPT_MODE: PanelAdaptMode = 'fit'

/** 全部合法的适配模式 */
const ADAPT_MODES: PanelAdaptMode[] = ['fit', 'fitWidth', 'fitHeight', 'stretch']

/**
 * 归一化适配模式，非法或缺失值（旧数据）回退为默认 fit
 * @param mode 待校验的适配模式
 */
export function normalizeAdaptMode(mode: unknown): PanelAdaptMode {
  return ADAPT_MODES.includes(mode as PanelAdaptMode)
    ? (mode as PanelAdaptMode)
    : DEFAULT_ADAPT_MODE
}
