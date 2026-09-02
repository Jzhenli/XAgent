import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { deviceApi } from '@/api/devices'
import { dataApi } from '@/api/data'
import { controlApi } from '@/api/control'
import type { Reading, StandardPoint } from '@/api/data'
import type { DeviceConfig, PointConfig } from '@/api/types'
import { parseStandardPoints, mapPointToDisplay, mapDeviceWithPoints } from '@/utils/pointMapping'
import type { ReadingData } from '@/utils/pointMapping'
import i18n from '@/i18n'

export interface PointDisplay {
  name: string
  description: string
  data_type: string
  standard_data_type?: string
  unit: string
  enabled: boolean
  config: Record<string, unknown>
  metadata: Record<string, unknown>
  tags: string[]
  type?: 'analog' | 'digital'
  writable: boolean
  currentValue?: number | boolean | string
  minValue?: number
  maxValue?: number
  lastUpdate?: string
  quality?: 'good' | 'bad' | 'uncertain'
  trend?: {
    enabled: boolean
    interval: number
    retention: number
  }
}

export interface DeviceWithPoints {
  asset: string
  name: string
  description?: string
  enabled: boolean
  status: string
  pluginName: string
  pointCount: number
  connection: {
    host: string
    port: number
  }
  points: PointDisplay[]
}

/**
 * 解析单条后端读数为统一数据结构
 * @param reading 后端读数
 */
function parseReading(reading: Reading): ReadingData {
  const { standardPoints, timestamp } = parseStandardPoints(reading.standard_points)
  return { data: reading.data || {}, standardPoints, timestamp }
}

/**
 * 将后端读数数据转换为以 asset 为 key 的 Map
 * @param readings 后端设备读数列表
 */
function buildReadingMap(readings: any[]): Map<string, ReadingData> {
  const readingMap = new Map<string, ReadingData>()

  for (const reading of readings) {
    readingMap.set(reading.asset, parseReading(reading))
  }

  return readingMap
}

const WRITE_PROTECTION_DURATION = 10000
const writeProtectionMap = new Map<string, { value: any; expiresAt: number }>()

/** 按 asset 去重的延迟回读定时器：连续写值时同一设备只保留最后一次回读 */
const pendingRefreshTimers = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * 应用写值保护：保护期内返回保护值，过期则清理保护记录并返回 fallback
 * @param asset 设备 asset
 * @param pointName 点位名
 * @param fallback 无保护或保护过期时使用的值
 */
function applyWriteProtection<T>(asset: string, pointName: string, fallback: T): T {
  const protectionKey = `${asset}:${pointName}`
  const protection = writeProtectionMap.get(protectionKey)

  if (protection && Date.now() < protection.expiresAt) {
    return protection.value
  }
  if (protection) {
    writeProtectionMap.delete(protectionKey)
  }
  return fallback
}

export const usePointStore = defineStore('points', () => {
  const devices = ref<DeviceWithPoints[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedPoint = ref<PointDisplay | null>(null)
  const selectedDeviceAsset = ref<string | null>(null)
  const trendTimeRange = ref<'1h' | '6h' | '24h' | '7d' | '30d'>('24h')

  const latestReadings = ref<Map<string, Reading>>(new Map())
  const historyReadings = ref<Reading[]>([])
  const historyLoading = ref(false)

  const allPoints = computed(() => {
    const points: (PointDisplay & { deviceAsset: string; deviceName: string })[] = []

    for (const device of devices.value) {
      for (const point of device.points) {
        points.push({
          ...point,
          deviceAsset: device.asset,
          deviceName: device.name
        })
      }
    }

    return points
  })

  /**
   * 获取所有设备及其点位，并合并最新读数
   */
  async function fetchDevicesWithPoints() {
    loading.value = true
    error.value = null

    try {
      const [deviceResult, readingResult] = await Promise.allSettled([
        deviceApi.list(),
        deviceApi.getLatest(false)
      ])

      const deviceList = deviceResult.status === 'fulfilled' ? deviceResult.value.devices : []
      const readingList = readingResult.status === 'fulfilled' ? readingResult.value.devices : []

      const readingMap = buildReadingMap(readingList)

      devices.value = deviceList.map(device => {
        const mappedDevice = mapDeviceWithPoints(device, readingMap.get(device.asset))
        mappedDevice.points = mappedDevice.points.map(point => ({
          ...point,
          currentValue: applyWriteProtection(device.asset, point.name, point.currentValue)
        }))
        return mappedDevice
      })
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : '获取设备点位失败'
      error.value = message
      console.error('Failed to fetch devices with points:', e)
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取指定设备的点位并合并最新读数
   * @param asset 设备 asset
   */
  async function fetchDevicePoints(asset: string) {
    try {
      const [pointsResult, readingsResult] = await Promise.allSettled([
        deviceApi.listPoints(asset),
        dataApi.getReadings({ asset, limit: 1, active_only: false })
      ])

      const points = pointsResult.status === 'fulfilled' ? pointsResult.value : []
      const readings = readingsResult.status === 'fulfilled' ? readingsResult.value.readings : []

      const readingData = readings.length > 0 ? parseReading(readings[0]) : undefined

      const mappedPoints = points.map(point => {
        const result = mapPointToDisplay(point, readingData)
        result.currentValue = applyWriteProtection(asset, point.name, result.currentValue)
        return result
      })
      const deviceIndex = devices.value.findIndex(d => d.asset === asset)

      if (deviceIndex !== -1) {
        const device = devices.value[deviceIndex]
        devices.value[deviceIndex] = {
          ...device,
          points: mappedPoints,
          pointCount: mappedPoints.length
        }
      } else {
        const device = await deviceApi.get(asset)
        devices.value.push(mapDeviceWithPoints(device, readingData))
      }
    } catch (e: unknown) {
      console.error(`Failed to fetch points for device ${asset}:`, e)
    }
  }

  async function fetchLatestReadings(_asset: string) {
    // No longer needed - data is merged in fetchDevicePoints/fetchDevicesWithPoints
  }

  /**
   * 调度延迟回读（按 asset 去重）：连续写值时同一设备只保留最后一次回读，
   * 避免多个定时器集中触发造成请求风暴
   * @param asset 设备 asset
   */
  function scheduleDelayedFetchDevicePoints(asset: string, delayMs = 2000) {
    const existing = pendingRefreshTimers.get(asset)
    if (existing) clearTimeout(existing)

    const timer = setTimeout(() => {
      pendingRefreshTimers.delete(asset)
      void fetchDevicePoints(asset)
    }, delayMs)

    pendingRefreshTimers.set(asset, timer)
  }

  async function fetchAllLatestReadings() {
    // No longer needed - data is merged in fetchDevicesWithPoints
  }

  /**
   * 轻量级刷新指定设备的读数（仅更新 currentValue / quality / lastUpdate）
   * 用于周期性轮询，避免重复拉取点位定义
   * @param asset 设备 asset
   */
  async function refreshDeviceReadings(asset: string) {
    try {
      const response = await dataApi.getReadings({ asset, limit: 1, active_only: false })
      const readings = response.readings

      if (readings.length === 0) return

      const { data: readingData, standardPoints, timestamp } = parseReading(readings[0])

      const deviceIndex = devices.value.findIndex(d => d.asset === asset)
      if (deviceIndex === -1) return

      const device = devices.value[deviceIndex]
      const updatedPoints = device.points.map(point => {
        const standardPoint = standardPoints.get(point.name)
        const rawValue = readingData[point.name]
        const currentValue = standardPoint?.value ?? rawValue

        return {
          ...point,
          currentValue: applyWriteProtection(
            asset,
            point.name,
            currentValue !== undefined && currentValue !== null
              ? (currentValue as number | boolean | string)
              : undefined
          ),
          quality: (standardPoint?.quality as 'good' | 'bad' | 'uncertain') ?? point.quality,
          lastUpdate: timestamp
            ? new Date(timestamp * 1000).toLocaleString('zh-CN')
            : point.lastUpdate
        }
      })

      devices.value[deviceIndex] = { ...device, points: updatedPoints }
    } catch (e: unknown) {
      console.error(`Failed to refresh readings for ${asset}:`, e)
    }
  }

  /**
   * 获取指定设备的历史读数
   * @param asset 设备 asset
   * @param hours 查询小时数，默认 24
   */
  async function fetchHistoryReadings(asset: string, hours: number = 24, limit: number = 1000) {
    historyLoading.value = true

    try {
      const endTime = Date.now() / 1000
      const startTime = endTime - hours * 3600
      const response = await dataApi.getHistoryReadings(asset, startTime, endTime, limit)
      historyReadings.value = response.readings
      return response.readings
    } catch (e: unknown) {
      console.error(`Failed to fetch history for ${asset}:`, e)
      return []
    } finally {
      historyLoading.value = false
    }
  }

  /**
   * 从历史读数中提取指定点位的趋势数据
   * @param pointName 点位名
   */
  function getPointTrendData(pointName: string): { time: string; timestamp: number; value: number; quality: string }[] {
    const data: { time: string; timestamp: number; value: number; quality: string }[] = []

    for (const reading of historyReadings.value) {
      const standardPoint = reading.standard_points?.find(
        (p: StandardPoint) => (p.name || p.point_name) === pointName
      )
      const rawValue = reading.data?.[pointName]
      const value = standardPoint?.value ?? rawValue

      if (value === undefined || value === null) continue

      let numericValue: number
      if (typeof value === 'boolean') {
        numericValue = value ? 1 : 0
      } else if (typeof value === 'number') {
        numericValue = value
      } else {
        continue
      }

      const date = new Date(reading.timestamp * 1000)
      data.push({
        time: date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        timestamp: reading.timestamp * 1000,
        value: numericValue,
        quality: standardPoint?.quality || 'good'
      })
    }

    return data.sort((a, b) => a.timestamp - b.timestamp)
  }

  /**
   * 新增点位
   * @param asset 设备 asset
   * @param point 点位配置
   */
  async function addPoint(asset: string, point: PointConfig) {
    const response = await deviceApi.addPoint(asset, point)
    if (response.success) {
      await fetchDevicePoints(asset)
    }
    return response
  }

  /**
   * 更新点位
   * @param asset 设备 asset
   * @param pointName 点位名
   * @param updates 更新字段
   */
  async function updatePoint(asset: string, pointName: string, updates: Record<string, unknown>) {
    const response = await deviceApi.updatePoint(asset, pointName, updates)
    if (response.success) {
      await fetchDevicePoints(asset)
    }
    return response
  }

  /**
   * 删除点位
   * @param asset 设备 asset
   * @param pointName 点位名
   */
  async function removePoint(asset: string, pointName: string) {
    await deviceApi.removePoint(asset, pointName)
    await fetchDevicePoints(asset)
  }

  function selectPoint(deviceAsset: string, pointName: string) {
    const device = devices.value.find(d => d.asset === deviceAsset)
    if (device) {
      const point = device.points.find(p => p.name === pointName)
      if (point) {
        selectedPoint.value = point
        selectedDeviceAsset.value = deviceAsset
      }
    }
  }

  function clearSelection() {
    selectedPoint.value = null
    selectedDeviceAsset.value = null
  }

  /**
   * 获取指定设备下的所有点位
   * @param deviceAsset 设备 asset
   */
  function getDevicePoints(deviceAsset: string): PointDisplay[] {
    const device = devices.value.find(d => d.asset === deviceAsset)
    return device?.points || []
  }

  /**
   * 生成模拟趋势数据（编辑模式或历史数据为空时使用）
   * @param point 点位展示对象
   * @param hours 小时数，默认 24
   */
  const generateTrendData = (point: PointDisplay, hours: number = 24) => {
    const now = Date.now()
    const data: { time: string; timestamp: number; value: number; quality: string }[] = []

    const interval = 60000

    const count = (hours * 3600000) / interval
    const isDigital = point.type === 'digital' || point.standard_data_type === 'bool'

    for (let i = count; i >= 0; i--) {
      const timestamp = now - i * interval
      const time = new Date(timestamp)
      const hour = time.getHours().toString().padStart(2, '0')
      const minute = time.getMinutes().toString().padStart(2, '0')

      let value: number
      if (isDigital) {
        value = Math.random() > 0.5 ? 1 : 0
      } else {
        value = 20 + (Math.random() - 0.5) * 10
      }

      data.push({
        time: `${hour}:${minute}`,
        timestamp,
        value: isDigital ? value : Math.round(value * 100) / 100,
        quality: Math.random() > 0.05 ? 'good' : 'uncertain'
      })
    }

    return data
  }

  /**
   * 向指定点位写入值
   * @param deviceAsset 设备 asset
   * @param pointName 点位名
   * @param value 要写入的值
   */
  async function writePoint(deviceAsset: string, pointName: string, value: number | boolean | string): Promise<{ success: boolean; message: string }> {
    const device = devices.value.find(d => d.asset === deviceAsset)
    if (!device) {
      return { success: false, message: i18n.global.t('writePoint.deviceNotFound', { asset: deviceAsset }) }
    }

    const point = device.points.find(p => p.name === pointName)
    if (!point) {
      return { success: false, message: i18n.global.t('writePoint.pointNotFound', { name: pointName }) }
    }

    if (!point.writable) {
      return { success: false, message: i18n.global.t('writePoint.pointNotWritable', { name: pointName }) }
    }

    try {
      const response = await controlApi.writeSetpoint(
        device.pluginName,
        deviceAsset,
        pointName,
        value
      )

      if (response.status === 'ACCEPTED') {
        const protectionKey = `${deviceAsset}:${pointName}`
        writeProtectionMap.set(protectionKey, {
          value,
          expiresAt: Date.now() + WRITE_PROTECTION_DURATION
        })

        const deviceIndex = devices.value.findIndex(d => d.asset === deviceAsset)
        if (deviceIndex !== -1) {
          const device = devices.value[deviceIndex]
          const pointIndex = device.points.findIndex(p => p.name === pointName)
          if (pointIndex !== -1) {
            const updatedPoints = [...device.points]
            updatedPoints[pointIndex] = {
              ...updatedPoints[pointIndex],
              currentValue: value
            }
            devices.value[deviceIndex] = {
              ...device,
              points: updatedPoints
            }
          }
        }

        scheduleDelayedFetchDevicePoints(deviceAsset)
        return {
          success: true,
          message: i18n.global.t('writePoint.cmdSent', { id: response.command_id.slice(0, 8) })
        }
      }

      return { success: false, message: i18n.global.t('writePoint.statusAbnormal', { status: response.status }) }
    } catch (e: unknown) {
      const detail = (e as any)?.response?.data?.detail || (e instanceof Error ? e.message : i18n.global.t('writePoint.failed'))
      return { success: false, message: detail }
    }
  }

  return {
    devices,
    loading,
    error,
    selectedPoint,
    selectedDeviceAsset,
    trendTimeRange,
    latestReadings,
    historyReadings,
    historyLoading,
    allPoints,
    fetchDevicesWithPoints,
    fetchDevicePoints,
    refreshDeviceReadings,
    fetchLatestReadings,
    fetchAllLatestReadings,
    fetchHistoryReadings,
    getPointTrendData,
    addPoint,
    updatePoint,
    removePoint,
    selectPoint,
    clearSelection,
    getDevicePoints,
    generateTrendData,
    writePoint
  }
})
