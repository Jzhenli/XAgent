/** 统计卡片趋势信息 */
export interface TrendInfo {
  text: string
  type: 'success' | 'warning' | 'danger' | 'info'
}

/** 图表数据摘要 */
export interface ChartSummary {
  peak: number
  average: number
}