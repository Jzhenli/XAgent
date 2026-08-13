export interface ProgressColorStop {
  color: string;
  percentage: number;
}

/**
 * 根据使用率百分比返回对应的进度条渐变色数组
 * @param percentage 使用率（0-100）
 * @returns 渐变色停止点数组，用于 el-progress dashboard 类型
 */
export function getProgressColor(percentage: number): ProgressColorStop[] {
  return [
    { color: "#f56c6c", percentage: 20 },
    { color: "#e6a23c", percentage: 40 },
    { color: "#5cb87a", percentage: 60 },
    { color: "#1989fa", percentage: 80 },
    { color: "#6f7ad3", percentage: 100 },
  ];
}
