import type { StandardPoint } from '@/api/data'
import type { DeviceConfig, PointConfig } from '@/api/types'
import type { PointDisplay, DeviceWithPoints } from '@/stores/points'

/**
 * 单条读数解析后的数据结构
 */
export interface ReadingData {
  /** 原始数据映射 */
  data: Record<string, unknown>
  /** 标准化点位映射，key 为点位名 */
  standardPoints: Map<string, StandardPoint>
  /** 读数时间戳（秒） */
  timestamp?: number
}

/**
 * 判断点位是否可写
 * @param point 点位配置
 */
export function isPointWritable(point: PointConfig): boolean {
  const config = point.config || {}

  if (config.writable === true) return true

  const registerType = config.register_type as string | undefined
  if (registerType === 'coil' || registerType === 'holding') return true

  const objectType = (config.object_type as string) || point.data_type
  if (objectType && (objectType.includes('Output') || objectType.includes('Value'))) return true

  if (config.control_address) return true

  return false
}

/**
 * 解析后端返回的标准化点位数组
 * @param rawSp 后端原始标准化点位列表
 */
export function parseStandardPoints(rawSp: any[]): { standardPoints: Map<string, StandardPoint>; timestamp?: number } {
  const standardPoints = new Map<string, StandardPoint>()
  let timestamp: number | undefined

  for (const point of rawSp || []) {
    const key = point.point_name || point.name || ''
    if (!key) continue

    standardPoints.set(key, {
      name: key,
      point_name: point.point_name,
      value: point.value,
      unit: point.unit,
      data_type: point.data_type,
      quality: point.quality,
      timestamp: point.timestamp
    })

    if (point.timestamp && !timestamp) {
      timestamp = point.timestamp
    }
  }

  return { standardPoints, timestamp }
}

/**
 * 将点位配置映射为展示对象
 * @param point 点位配置
 * @param readingData 可选的读数数据，用于填充当前值和质量
 */
export function mapPointToDisplay(point: PointConfig, readingData?: ReadingData): PointDisplay {
  const metadata = point.metadata || {}
  const isDigital = point.standard_data_type === 'bool'

  const standardPoint = readingData?.standardPoints?.get(point.name)
  const rawValue = readingData?.data?.[point.name]
  const currentValue = standardPoint?.value ?? (rawValue as number | boolean | string | undefined)

  const lastUpdate = readingData?.timestamp
    ? new Date(readingData.timestamp * 1000).toLocaleString('zh-CN')
    : undefined

  return {
    name: point.name,
    description: point.description || '',
    data_type: point.data_type,
    standard_data_type: point.standard_data_type,
    unit: point.unit || '',
    enabled: point.enabled,
    config: point.config || {},
    metadata: point.metadata || {},
    tags: point.tags || [],
    type: isDigital ? 'digital' : 'analog',
    writable: isPointWritable(point),
    currentValue,
    minValue: (metadata.minValue as number) ?? (metadata.range as number[])?.[0],
    maxValue: (metadata.maxValue as number) ?? (metadata.range as number[])?.[1],
    lastUpdate,
    quality: (standardPoint?.quality as 'good' | 'bad' | 'uncertain') ?? 'good',
    trend: {
      enabled: (metadata.trendEnabled as boolean) ?? false,
      interval: (metadata.trendInterval as number) ?? 60,
      retention: (metadata.trendRetention as number) ?? 7
    }
  }
}

/**
 * 将设备配置映射为带有点位展示信息的设备对象
 * @param device 设备配置
 * @param readingData 可选的读数数据
 */
export function mapDeviceWithPoints(device: DeviceConfig, readingData?: ReadingData): DeviceWithPoints {
  const pluginConfig = device.plugin?.config || {}

  return {
    asset: device.asset,
    name: device.name || device.asset,
    description: device.description,
    enabled: device.enabled,
    status: device.status || 'active',
    pluginName: device.plugin?.name || '',
    pointCount: device.points?.length || 0,
    connection: {
      host: (pluginConfig.host as string) || '',
      port: (pluginConfig.port as number) || 0
    },
    points: (device.points || []).map(point => mapPointToDisplay(point, readingData))
  }
}
