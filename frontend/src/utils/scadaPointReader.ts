import { ref, computed, type InjectionKey, type Ref, type ComputedRef } from 'vue'
import { deviceApi } from '@/api/devices'
import { dataApi } from '@/api/data'
import { controlApi } from '@/api/control'
import type { Reading, StandardPoint } from '@/api/data'
import type { DeviceConfig } from '@/api/types'
import type { PointDisplay, DeviceWithPoints } from '@/stores/points'
import { parseStandardPoints, mapPointToDisplay, mapDeviceWithPoints } from '@/utils/pointMapping'
import type { ReadingData } from '@/utils/pointMapping'
import i18n from '@/i18n'

export type ScadaPointDisplay = PointDisplay
export type ScadaDeviceWithPoints = DeviceWithPoints

export interface ScadaPointReader {
  devices: Ref<ScadaDeviceWithPoints[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  historyReadings: Ref<Reading[]>
  historyLoading: Ref<boolean>
  /** 历史缓存版本号：每次 appendLatestReadingToHistory 成功追加后递增 */
  historyVersion: Ref<number>
  allPoints: ComputedRef<(ScadaPointDisplay & { deviceAsset: string; deviceName: string })[]>
  fetchDevicesWithPoints: () => Promise<void>
  fetchDevicePoints: (asset: string) => Promise<void>
  refreshDevices: (assets: string[]) => Promise<void>
  fetchHistoryReadings: (asset: string, hours?: number, limit?: number) => Promise<Reading[]>
  /** 将 fetchDevicePoints 拿到的最新 Reading 追加到该 asset 的历史缓存，返回是否有新增 */
  appendLatestReadingToHistory: (asset: string) => boolean
  /** 该 asset 是否已有全量历史缓存（作为增量追加的前置条件） */
  hasHistoryReadings: (asset: string) => boolean
  getPointTrendData: (pointName: string, asset?: string) => { time: string; timestamp: number; value: number; quality: string }[]
  generateTrendData: (point: ScadaPointDisplay, hours?: number) => { time: string; timestamp: number; value: number; quality: string }[]
  writePoint: (deviceAsset: string, pointName: string, value: number | boolean | string) => Promise<{ success: boolean; message: string }>
  getDevicePoints: (deviceAsset: string) => ScadaPointDisplay[]
  findDevice: (deviceAsset: string) => ScadaDeviceWithPoints | undefined
  clearDevices: () => void
}

export const ScadaPointReaderKey: InjectionKey<ScadaPointReader> = Symbol('scadaPointReader')

const devices = ref<ScadaDeviceWithPoints[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const historyReadings = ref<Reading[]>([])
/** 按 asset 隔离的历史读数缓存：多设备同时查询时避免相互覆盖 */
const historyReadingsMap = new Map<string, Reading[]>()
/** 按 asset 缓存 fetchDevicePoints 拿到的最新 Reading：供增量追加历史数据使用 */
const latestReadingMap = new Map<string, Reading>()
const historyLoading = ref(false)
const trendTimeRange = ref<'1h' | '6h' | '24h' | '7d' | '30d'>('24h')
/** 历史缓存版本号：每次 appendLatestReadingToHistory 成功追加后递增，图表组件可监听此 ref 触发增量刷新 */
const historyVersion = ref(0)

const writeProtectionMap = new Map<string, { value: any; expiresAt: number }>()
const WRITE_PROTECTION_DURATION = 10000

/** 按 asset 去重的延迟回读定时器：连续写值时同一设备只保留最后一次回读，且多设备互不覆盖（clearDevices 时需要清除，避免离开页面后仍触发请求） */
const pendingFollowUpTimers = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * in-flight 请求去重：相同参数的并发调用共享同一个网络请求
 * - inflightDeviceFetches: fetchDevicePoints 正在进行中的 Promise，key = asset
 * - inflightHistoryFetches: fetchHistoryReadings 正在进行中的 Promise，key = asset:hours:limit
 * 请求完成后（无论成功/失败）自动从 Map 中移除，不阻塞后续请求
 */
const inflightDeviceFetches = new Map<string, Promise<void>>()
const inflightHistoryFetches = new Map<string, Promise<Reading[]>>()

/**
 * 将后端读数数据转换为以 asset 为 key 的 Map
 * @param readings 后端设备读数列表
 */
function buildReadingMap(readings: any[]): Map<string, ReadingData> {
  const readingMap = new Map<string, ReadingData>()

  for (const reading of readings) {
    const { standardPoints, timestamp } = parseStandardPoints(reading.standard_points)
    readingMap.set(reading.asset, {
      data: reading.data || {},
      standardPoints,
      timestamp
    })
  }

  return readingMap
}

export function useScadaPointReader(): ScadaPointReader {
  /** 当前所有设备下的所有点位（含设备信息） */
  const allPoints = computed(() => {
    const points: (ScadaPointDisplay & { deviceAsset: string; deviceName: string })[] = []

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
  async function fetchDevicesWithPoints(): Promise<void> {
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
      const now = Date.now()

      devices.value = deviceList.map(device => {
        const mappedDevice = mapDeviceWithPoints(device, readingMap.get(device.asset))
        mappedDevice.points = mappedDevice.points.map(point => {
          const protectionKey = `${device.asset}:${point.name}`
          const protection = writeProtectionMap.get(protectionKey)
          
          if (protection && now < protection.expiresAt) {
            return { ...point, currentValue: protection.value }
          } else if (protection) {
            writeProtectionMap.delete(protectionKey)
          }
          
          return point
        })
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
   * 同一 asset 的并发调用共享同一个网络请求（in-flight 去重）
   * @param asset 设备 asset
   */
  async function fetchDevicePoints(asset: string): Promise<void> {
    // 正在进行中的相同请求 → 直接复用
    const existing = inflightDeviceFetches.get(asset)
    if (existing) return existing

    const promise = doFetchDevicePoints(asset).finally(() => {
      inflightDeviceFetches.delete(asset)
    })
    inflightDeviceFetches.set(asset, promise)
    return promise
  }

  /** fetchDevicePoints 的实际实现（不含去重逻辑） */
  async function doFetchDevicePoints(asset: string): Promise<void> {
    try {
      const [pointsResult, readingsResult] = await Promise.allSettled([
        deviceApi.listPoints(asset),
        dataApi.getReadings({ asset, limit: 1, active_only: false })
      ])

      const points = pointsResult.status === 'fulfilled' ? pointsResult.value : []
      const readings = readingsResult.status === 'fulfilled' ? readingsResult.value.readings : []

      // 保存最新 Reading 到缓存，供增量追加历史数据使用
      if (readings.length > 0) {
        latestReadingMap.set(asset, readings[0])
      }

      let readingData: ReadingData | undefined
      if (readings.length > 0) {
        const reading = readings[0]
        const { standardPoints, timestamp } = parseStandardPoints(reading.standard_points)
        readingData = { data: reading.data || {}, standardPoints, timestamp }
      }

      const now = Date.now()
      const mappedPoints = points.map(point => {
        const result = mapPointToDisplay(point, readingData)
        const protectionKey = `${asset}:${point.name}`
        const protection = writeProtectionMap.get(protectionKey)
        
        if (protection && now < protection.expiresAt) {
          result.currentValue = protection.value
        } else if (protection) {
          writeProtectionMap.delete(protectionKey)
        }
        
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

  /**
   * 批量刷新多个设备的点位数据
   * @param assets 设备 asset 列表
   */
  async function refreshDevices(assets: string[]): Promise<void> {
    if (assets.length === 0) return
    await Promise.allSettled(assets.map(asset => fetchDevicePoints(asset)))
  }

  /**
   * 获取指定设备的历史读数
   * 同一 asset + hours + limit 的并发调用共享同一个网络请求（in-flight 去重）
   * @param asset 设备 asset
   * @param hours 查询小时数，默认 24
   * @param limit 返回条数上限，默认 1000
   */
  async function fetchHistoryReadings(asset: string, hours: number = 24, limit: number = 1000): Promise<Reading[]> {
    const key = `${asset}:${hours}:${limit}`
    // 正在进行中的相同请求 → 直接复用
    const existing = inflightHistoryFetches.get(key)
    if (existing) return existing

    const promise = doFetchHistoryReadings(asset, hours, limit).finally(() => {
      inflightHistoryFetches.delete(key)
    })
    inflightHistoryFetches.set(key, promise)
    return promise
  }

  /** fetchHistoryReadings 的实际实现（不含去重逻辑） */
  async function doFetchHistoryReadings(asset: string, hours: number, limit: number): Promise<Reading[]> {
    historyLoading.value = true

    try {
      const endTime = Date.now() / 1000
      const startTime = endTime - hours * 3600
      const response = await dataApi.getHistoryReadings(asset, startTime, endTime, limit)
      historyReadingsMap.set(asset, response.readings)
      historyReadings.value = response.readings
      return response.readings
    } catch (e: unknown) {
      console.error(`Failed to fetch history for ${asset}:`, e)
      return []
    } finally {
      historyLoading.value = false
    }
  }

  /** 历史缓存最大条数 */
  const MAX_HISTORY_SIZE = 1000

  /**
   * 将 fetchDevicePoints 拿到的最新 Reading 追加到指定 asset 的历史缓存
   * 自动按 timestamp 去重、排序、截断到 MAX_HISTORY_SIZE 条
   * @param asset 设备 asset
   * @returns 是否有新增数据被追加
   */
  function appendLatestReadingToHistory(asset: string): boolean {
    const latest = latestReadingMap.get(asset)
    if (!latest) return false

    const existing = historyReadingsMap.get(asset)
    // 无全量历史基线时跳过：避免空缓存时只追加单条数据，应等待全量加载成功
    if (!existing || existing.length === 0) return false

    // 去重：历史接口返回顺序不保证升序，需与缓存中的最大 timestamp 比较
    const lastTs = existing.reduce((max, r) => Math.max(max, r.timestamp), -1)
    if (latest.timestamp <= lastTs) return false

    const updated = [...existing, latest]
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-MAX_HISTORY_SIZE)

    historyReadingsMap.set(asset, updated)
    historyReadings.value = updated
    // 通知所有监听者历史缓存已更新
    historyVersion.value++
    return true
  }

  /**
   * 判断指定 asset 是否已有全量历史缓存
   * @param asset 设备 asset
   */
  function hasHistoryReadings(asset: string): boolean {
    return (historyReadingsMap.get(asset)?.length ?? 0) > 0
  }

  /**
   * 从历史读数中提取指定点位的趋势数据
   * @param pointName 点位名
   * @param asset 设备 asset；传入时从对应设备的缓存读取，否则合并所有设备缓存
   */
  function getPointTrendData(pointName: string, asset?: string): { time: string; timestamp: number; value: number; quality: string }[] {
    const data: { time: string; timestamp: number; value: number; quality: string }[] = []

    const readings = asset
      ? (historyReadingsMap.get(asset) ?? [])
      : Array.from(historyReadingsMap.values()).flat()

    for (const reading of readings) {
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
   * 生成模拟趋势数据（编辑模式或历史数据为空时使用）
   * @param point 点位展示对象
   * @param hours 小时数，默认 24
   */
  const generateTrendData = (point: ScadaPointDisplay, hours: number = 24) => {
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
  async function writePoint(
    deviceAsset: string,
    pointName: string,
    value: number | boolean | string
  ): Promise<{ success: boolean; message: string }> {
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

        // 复用同一 asset 的回读定时器：连续写值时只保留最后一次回读
        const existing = pendingFollowUpTimers.get(deviceAsset)
        if (existing) clearTimeout(existing)
        const timer = setTimeout(() => {
          pendingFollowUpTimers.delete(deviceAsset)
          void fetchDevicePoints(deviceAsset)
        }, 2000)
        pendingFollowUpTimers.set(deviceAsset, timer)
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

  /**
   * 获取指定设备下的所有点位
   * @param deviceAsset 设备 asset
   */
  function getDevicePoints(deviceAsset: string): ScadaPointDisplay[] {
    const device = devices.value.find(d => d.asset === deviceAsset)
    return device?.points || []
  }

  /**
   * 根据 asset 或名称查找设备
   * @param deviceAsset 设备 asset 或名称
   */
  function findDevice(deviceAsset: string): ScadaDeviceWithPoints | undefined {
    return devices.value.find(d => d.asset === deviceAsset || d.name === deviceAsset)
  }

  /**
   * 清空所有设备数据与状态
   */
  function clearDevices(): void {
    for (const timer of pendingFollowUpTimers.values()) {
      clearTimeout(timer)
    }
    pendingFollowUpTimers.clear()
    writeProtectionMap.clear()
    devices.value = []
    historyReadings.value = []
    historyReadingsMap.clear()
    latestReadingMap.clear()
    error.value = null
    inflightDeviceFetches.clear()
    inflightHistoryFetches.clear()
  }

  return {
    devices,
    loading,
    error,
    historyReadings,
    historyLoading,
    historyVersion,
    allPoints,
    fetchDevicesWithPoints,
    fetchDevicePoints,
    refreshDevices,
    fetchHistoryReadings,
    appendLatestReadingToHistory,
    hasHistoryReadings,
    getPointTrendData,
    generateTrendData,
    writePoint,
    getDevicePoints,
    findDevice,
    clearDevices
  }
}
