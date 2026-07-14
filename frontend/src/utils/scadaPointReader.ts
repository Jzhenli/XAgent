import { ref, computed, type InjectionKey, type Ref, type ComputedRef } from 'vue'
import { deviceApi } from '@/api/devices'
import { dataApi } from '@/api/data'
import { controlApi } from '@/api/control'
import type { Reading, StandardPoint } from '@/api/data'
import type { DeviceConfig } from '@/api/types'
import type { PointDisplay, DeviceWithPoints } from '@/stores/points'
import { parseStandardPoints, mapPointToDisplay, mapDeviceWithPoints } from '@/utils/pointMapping'
import type { ReadingData } from '@/utils/pointMapping'

export type ScadaPointDisplay = PointDisplay
export type ScadaDeviceWithPoints = DeviceWithPoints

export interface ScadaPointReader {
  devices: Ref<ScadaDeviceWithPoints[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  historyReadings: Ref<Reading[]>
  historyLoading: Ref<boolean>
  allPoints: ComputedRef<(ScadaPointDisplay & { deviceAsset: string; deviceName: string })[]>
  fetchDevicesWithPoints: () => Promise<void>
  fetchDevicePoints: (asset: string) => Promise<void>
  refreshDevices: (assets: string[]) => Promise<void>
  fetchHistoryReadings: (asset: string, hours?: number) => Promise<Reading[]>
  getPointTrendData: (pointName: string) => { time: string; timestamp: number; value: number; quality: string }[]
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
const historyLoading = ref(false)
const trendTimeRange = ref<'1h' | '6h' | '24h' | '7d' | '30d'>('24h')
const trendAggregation = ref<'none' | '1min' | '5min' | '15min' | '1h'>('5min')

const writeProtectionMap = new Map<string, { value: any; expiresAt: number }>()
const WRITE_PROTECTION_DURATION = 10000

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
   * @param asset 设备 asset
   */
  async function fetchDevicePoints(asset: string): Promise<void> {
    try {
      const [pointsResult, readingsResult] = await Promise.allSettled([
        deviceApi.listPoints(asset),
        dataApi.getReadings({ asset, limit: 1, active_only: false })
      ])

      const points = pointsResult.status === 'fulfilled' ? pointsResult.value : []
      const readings = readingsResult.status === 'fulfilled' ? readingsResult.value.readings : []

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
   * @param asset 设备 asset
   * @param hours 查询小时数，默认 24
   */
  async function fetchHistoryReadings(asset: string, hours: number = 24): Promise<Reading[]> {
    historyLoading.value = true

    try {
      const endTime = Date.now() / 1000
      const startTime = endTime - hours * 3600
      const response = await dataApi.getHistoryReadings(asset, startTime, endTime, 1000)
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
   * 生成模拟趋势数据（编辑模式或历史数据为空时使用）
   * @param point 点位展示对象
   * @param hours 小时数，默认 24
   */
  const generateTrendData = (point: ScadaPointDisplay, hours: number = 24) => {
    const now = Date.now()
    const data: { time: string; timestamp: number; value: number; quality: string }[] = []

    const interval = trendAggregation.value === 'none' ? 60000 :
                     trendAggregation.value === '1min' ? 60000 :
                     trendAggregation.value === '5min' ? 300000 :
                     trendAggregation.value === '15min' ? 900000 : 3600000

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
      return { success: false, message: `设备 ${deviceAsset} 不存在` }
    }

    const point = device.points.find(p => p.name === pointName)
    if (!point) {
      return { success: false, message: `点位 ${pointName} 不存在` }
    }

    if (!point.writable) {
      return { success: false, message: `点位 ${pointName} 不可写` }
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

        setTimeout(() => fetchDevicePoints(deviceAsset), 2000)
        return {
          success: true,
          message: `写值命令已下发 (命令ID: ${response.command_id.slice(0, 8)}...)`
        }
      }

      return { success: false, message: `命令状态异常: ${response.status}` }
    } catch (e: unknown) {
      const detail = (e as any)?.response?.data?.detail || (e instanceof Error ? e.message : '写值失败')
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
    devices.value = []
    historyReadings.value = []
    error.value = null
  }

  return {
    devices,
    loading,
    error,
    historyReadings,
    historyLoading,
    allPoints,
    fetchDevicesWithPoints,
    fetchDevicePoints,
    refreshDevices,
    fetchHistoryReadings,
    getPointTrendData,
    generateTrendData,
    writePoint,
    getDevicePoints,
    findDevice,
    clearDevices
  }
}
