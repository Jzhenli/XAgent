import { ref, computed, type InjectionKey, type Ref } from 'vue'
import { deviceApi } from '@/api/devices'
import { dataApi } from '@/api/data'
import { controlApi } from '@/api/control'
import type { Reading } from '@/api/data'
import type { PointConfig } from '@/api/types'
import { parseStandardPoints, isPointWritable } from '@/utils/pointMapping'
import type { ReadingData } from '@/utils/pointMapping'
import i18n from '@/i18n'

// ════════════════════════════ 类型定义 ════════════════════════════

/** 趋势数据点：图表组件消费的最小时间序列单元 */
export interface ScadaTrendPoint {
  time: string
  timestamp: number
  value: number
  quality: string
}

/** 点位历史缓存条目：折线图/柱状图绑定点位的时间序列（timestamp 为秒，布尔已归一为 0/1） */
export interface ScadaPointHistoryEntry {
  timestamp: number
  value: number
}

/** 预览链路点位值结构：仅保留读值渲染与写值校验所需的最小字段集 */
export interface ScadaPointValue {
  /** 点位名（绑定键） */
  name: string
  /** 点位类型：bool 点位标记为 digital，用于开关渲染与趋势模拟 */
  type: 'analog' | 'digital'
  /** 标准数据类型（如 'float' / 'bool'） */
  standard_data_type?: string
  /** 是否可写（写值操作的前置校验） */
  writable: boolean
  /** 当前值（写保护期内为保护值） */
  currentValue?: number | boolean | string
  /** 历史趋势缓存：仅图表组件绑定的点位存在此属性，随 devices 缓存统一管理 */
  historyCache?: ScadaPointHistoryEntry[]
}

/** 预览链路设备结构：仅保留索引查找、写值接口与点位列表所需字段 */
export interface ScadaDeviceValue {
  asset: string
  name: string
  /** 写值接口所需的插件名 */
  pluginName: string
  points: ScadaPointValue[]
}

/** 内部历史解析条目：单条后端读数的解析结果（点位名 → 数值），作为点位历史缓存的提取源 */
interface ParsedHistoryEntry {
  /** 读数时间戳（秒） */
  timestamp: number
  /** 点位名 → 数值（布尔已归一为 0/1，不可图表化的值解析时丢弃） */
  points: Map<string, number>
}

/** 历史请求缓存条目：进行中共享 Promise，完成后保留结果与 TTL 过期时间 */
interface HistoryRequestEntry {
  promise?: Promise<ParsedHistoryEntry[]>
  entries?: ParsedHistoryEntry[]
  expiresAt?: number
}

export interface ScadaPointReader {
  /** 历史缓存版本号：每次成功追加增量读数后递增，图表组件监听此 ref 触发增量刷新 */
  historyVersion: Ref<number>
  fetchDevicePoints: (asset: string) => Promise<void>
  /** 拉取点位历史并写入该点位的 historyCache（仅图表绑定的点位持有历史缓存），返回时间序列 */
  fetchPointHistory: (asset: string, pointName: string, hours?: number, limit?: number) => Promise<ScadaPointHistoryEntry[]>
  /** 该点位是否已有非空历史缓存（图表 hook 用作增量追加的前置条件与失败重试判断） */
  hasPointHistory: (asset: string, pointName: string) => boolean
  getPointTrendData: (pointName: string, asset?: string) => ScadaTrendPoint[]
  /** 生成模拟趋势数据（编辑模式或历史数据为空时使用） */
  generateTrendData: (point: ScadaPointValue, hours?: number) => ScadaTrendPoint[]
  writePoint: (deviceAsset: string, pointName: string, value: number | boolean | string) => Promise<{ success: boolean; message: string }>
  /** O(1) 解析点位：按 deviceId（asset 或设备名）+ pointName 查找 */
  resolvePoint: (deviceId: string, pointName: string) => ScadaPointValue | null
  /** 注册设备需求（replace 语义）：订阅者声明所需资产，全新资产立即拉取一次 */
  registerAssets: (ownerId: string, assets: string[]) => void
  /** 注销订阅者的全部设备需求 */
  unregisterAssets: (ownerId: string) => void
  /** 当前所有订阅者需求的设备 asset 去重列表 */
  getDemandedAssets: () => string[]
  /** 调试用：导出读值中枢保存在内存中的全部缓存结构（原始引用，devtools 可展开查看） */
  getCacheSnapshot: () => Record<string, unknown>
  clearDevices: () => void
}

export const ScadaPointReaderKey: InjectionKey<ScadaPointReader> = Symbol('scadaPointReader')

// ════════════════════════════ 缓存结构 ════════════════════════════

/** 实时点位值缓存：每台设备仅保留最小点位值结构（含当前值；图表绑定点位额外携带 historyCache） */
const devices = ref<ScadaDeviceValue[]>([])

/**
 * 历史请求缓存：key = asset:hours:limit
 * - 请求进行中：并发调用共享同一 Promise（in-flight 去重）
 * - 请求成功后：保留结果 5s 复用（TTL 缓存），消除图表挂载加载与设备就绪重载的时序性重复请求
 * - 请求失败：条目删除，保证重试不被 TTL 挡住
 */
const HISTORY_CACHE_TTL = 5000
const historyRequestCache = new Map<string, HistoryRequestEntry>()

/** 历史缓存最大条数 */
const MAX_HISTORY_SIZE = 500

/** 历史缓存版本号：成功追加增量读数后递增 */
const historyVersion = ref(0)

/** 写值保护表：pointKey → { value, expiresAt }（写后 10s 内优先使用保护值） */
const writeProtectionMap = new Map<string, { value: any; expiresAt: number }>()
const WRITE_PROTECTION_DURATION = 10000

/** 按 asset 去重的延迟回读定时器：连续写值时同一设备只保留最后一次回读，且多设备互不覆盖（clearDevices 时需要清除，避免离开页面后仍触发请求） */
const pendingFollowUpTimers = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * 设备/点位索引：devices 变化时重建一次（O(设备数×点位数)），
 * 供所有取值方 O(1) 解析，替代每个绑定组件每轮询周期的 devices.find 线性扫描
 */
const deviceIndex = computed(() => {
  const byId = new Map<string, ScadaDeviceValue>()
  const pointsById = new Map<string, Map<string, ScadaPointValue>>()
  for (const device of devices.value) {
    const pointMap = new Map<string, ScadaPointValue>()
    for (const point of device.points) {
      pointMap.set(point.name, point)
    }
    pointsById.set(device.asset, pointMap)
    byId.set(device.asset, device)
    // 兼容 deviceId 存设备名的历史数据：name 与 asset 等价可查
    if (device.name && device.name !== device.asset) {
      if (!byId.has(device.name)) byId.set(device.name, device)
      if (!pointsById.has(device.name)) pointsById.set(device.name, pointMap)
    }
  }
  return { byId, pointsById }
})

/** 状态代际号：clearDevices 时递增，在途请求回包后据此丢弃写入，避免离开页面后污染单例状态 */
let devicesEpoch = 0

/**
 * 设备点位请求共享缓存：key = asset
 * - 请求进行中：并发调用共享同一 Promise（in-flight 去重）
 * - 请求完成后：保留 1s 复用窗口，合并进入预览时 immediate tick 与 boundAssets watch 的双刷新
 */
const DEVICE_FETCH_REUSE_MS = 1000
const inflightDeviceFetches = new Map<string, { promise: Promise<void>; expiresAt: number }>()

/** 设备需求注册表：asset → 需要该资产的 ownerId 集合（引用计数），供订阅者（graphic 面板等）声明轮询需求 */
const assetDemand = new Map<string, Set<string>>()

/** 点位骨架缓存：asset → 点位定义（准静态数据，会话级缓存，clearDevices 清空），避免每轮重拉 listPoints */
const skeletonCache = new Map<string, PointConfig[]>()

// ════════════════════════════ 转换工具 ════════════════════════════

/** 将读数值归一为可图表化的数值：布尔 → 0/1，数值原样，其余（字符串/null/undefined）不可图表化返回 undefined */
function normalizeChartValue(value: unknown): number | undefined {
  if (typeof value === 'boolean') return value ? 1 : 0
  if (typeof value === 'number') return value
  return undefined
}

/**
 * 将单条后端读数解析为内部历史条目：
 * 标准点值优先、data 原始值兜底（与趋势提取的取值优先级一致），
 * 不可图表化的值（字符串等）在解析时直接丢弃
 */
function toParsedEntry(timestamp: number, readingData: ReadingData): ParsedHistoryEntry {
  const points = new Map<string, number>()

  const addPoint = (name: string, value: unknown): void => {
    const normalized = normalizeChartValue(value)
    if (normalized !== undefined) {
      points.set(name, normalized)
    }
  }

  for (const [name, standardPoint] of readingData.standardPoints) {
    addPoint(name, standardPoint.value ?? readingData.data[name])
  }
  for (const [name, rawValue] of Object.entries(readingData.data)) {
    // 仅补充无标准点的点位：有标准点时其取值优先级已由上方循环处理
    if (!readingData.standardPoints.has(name)) {
      addPoint(name, rawValue)
    }
  }

  return { timestamp, points }
}

/** 批量解析历史读数为内部条目，并按 timestamp 升序排序（历史接口返回顺序不保证升序） */
function toParsedEntries(readings: Reading[]): ParsedHistoryEntry[] {
  return readings
    .map((reading) => {
      const { standardPoints } = parseStandardPoints(reading.standard_points)
      return toParsedEntry(reading.timestamp, {
        data: reading.data || {},
        standardPoints,
        timestamp: reading.timestamp
      })
    })
    .sort((a, b) => a.timestamp - b.timestamp)
}

/** 从内部历史条目中提取单个点位的时间序列，截断至 MAX_HISTORY_SIZE */
function extractPointSeries(entries: ParsedHistoryEntry[], pointName: string): ScadaPointHistoryEntry[] {
  const series: ScadaPointHistoryEntry[] = []
  for (const entry of entries) {
    const value = entry.points.get(pointName)
    if (value !== undefined) {
      series.push({ timestamp: entry.timestamp, value })
    }
  }
  return series.slice(-MAX_HISTORY_SIZE)
}

/** 将提取的时间序列写入 devices 中对应点位的 historyCache（设备/点位不存在时静默跳过，待就绪后重载） */
function applyPointHistory(asset: string, pointName: string, series: ScadaPointHistoryEntry[]): void {
  const device = devices.value.find(d => d.asset === asset || d.name === asset)
  if (!device) return
  const pointIndex = device.points.findIndex(p => p.name === pointName)
  if (pointIndex === -1) return
  device.points[pointIndex] = { ...device.points[pointIndex], historyCache: series }
}

/**
 * 将本轮最新读数追加到该设备所有已持有历史缓存的点位（即图表绑定的点位）
 * 按 timestamp 去重（仅追加更新时间）、截断至 MAX_HISTORY_SIZE；有新增时递增 historyVersion
 */
function appendLatestToBoundPoints(asset: string, timestamp: number, readingData: ReadingData): void {
  const device = devices.value.find(d => d.asset === asset)
  if (!device) return

  let appended = false
  for (const point of device.points) {
    const series = point.historyCache
    // 空缓存（未加载或加载为空）不追加：与原「无全量基线跳过」语义一致
    if (!series || series.length === 0) continue
    if (timestamp <= series[series.length - 1].timestamp) continue

    const value = normalizeChartValue(
      readingData.standardPoints.get(point.name)?.value ?? readingData.data[point.name]
    )
    if (value === undefined) continue

    series.push({ timestamp, value })
    if (series.length > MAX_HISTORY_SIZE) {
      series.splice(0, series.length - MAX_HISTORY_SIZE)
    }
    appended = true
  }
  if (appended) historyVersion.value++
}

/** 将点位配置映射为预览最小点位值结构，并应用写保护值覆盖 */
function toPointValue(asset: string, point: PointConfig, readingData: ReadingData | undefined): ScadaPointValue {
  const standardPoint = readingData?.standardPoints.get(point.name)
  const rawValue = readingData?.data[point.name]
  const result: ScadaPointValue = {
    name: point.name,
    type: point.standard_data_type === 'bool' ? 'digital' : 'analog',
    standard_data_type: point.standard_data_type,
    writable: isPointWritable(point),
    currentValue: standardPoint?.value ?? (rawValue as number | boolean | string | undefined)
  }

  // 写保护期内优先使用保护值，过期则清除保护
  const protectionKey = `${asset}:${point.name}`
  const protection = writeProtectionMap.get(protectionKey)
  if (protection) {
    if (Date.now() < protection.expiresAt) {
      result.currentValue = protection.value
    } else {
      writeProtectionMap.delete(protectionKey)
    }
  }

  return result
}

export function useScadaPointReader(): ScadaPointReader {
  /**
   * 获取指定设备的点位并合并最新读数
   * 同一 asset 的并发调用共享同一个网络请求（in-flight 去重）
   * @param asset 设备 asset
   */
  async function fetchDevicePoints(asset: string): Promise<void> {
    // 进行中或 1s 复用窗口内的相同请求 → 直接共享，不发新请求
    const existing = inflightDeviceFetches.get(asset)
    if (existing && Date.now() < existing.expiresAt) return existing.promise

    const promise = doFetchDevicePoints(asset).finally(() => {
      // 完成后不立即删除：保留 1s 复用窗口，过期条目由下次调用或 clearDevices 清理
      const entry = inflightDeviceFetches.get(asset)
      if (entry && entry.promise === promise) {
        entry.expiresAt = Date.now() + DEVICE_FETCH_REUSE_MS
      }
    })
    inflightDeviceFetches.set(asset, { promise, expiresAt: Number.MAX_SAFE_INTEGER })
    return promise
  }

  /** fetchDevicePoints 的实际实现（不含去重逻辑） */
  async function doFetchDevicePoints(asset: string): Promise<void> {
    const epoch = devicesEpoch
    try {
      // 骨架命中缓存：只拉读数；未命中：并行拉骨架 + 读数
      const cachedSkeleton = skeletonCache.get(asset)
      const tasks: Promise<any>[] = [
        dataApi.getReadings({ asset, limit: 1, active_only: false })
      ]
      if (!cachedSkeleton) {
        tasks.push(deviceApi.listPoints(asset))
      }

      const [readingsResult, pointsResult] = await Promise.allSettled(tasks)

      // clearDevices 已发生：丢弃在途回包，避免离开页面后污染单例状态
      if (epoch !== devicesEpoch) return

      const readings = readingsResult.status === 'fulfilled' ? readingsResult.value.readings : []
      const reading = readings[0]

      // 解析最新读数：点位值映射与历史增量追加共用一份解析结果
      let readingData: ReadingData | undefined
      if (reading) {
        const { standardPoints } = parseStandardPoints(reading.standard_points)
        readingData = { data: reading.data || {}, standardPoints, timestamp: reading.timestamp }
      }

      // 骨架来源：缓存 > 本次拉取成功 > 已有设备旧点位（保留不清空，网络抖动防护）> 空（下轮重试）
      let points: PointConfig[]
      if (cachedSkeleton) {
        points = cachedSkeleton
      } else if (pointsResult?.status === 'fulfilled') {
        points = pointsResult.value
        skeletonCache.set(asset, points)
      } else {
        const existing = devices.value.find(d => d.asset === asset)
        if (existing) {
          // listPoints 失败但有旧点位：仅用新读数刷新当前值，其余字段全部保留（含 historyCache）
          devices.value = devices.value.map(d => {
            if (d.asset !== asset) return d
            return {
              ...d,
              points: d.points.map(p => ({
                ...p,
                currentValue: readingData?.standardPoints.get(p.name)?.value ?? p.currentValue
              }))
            }
          })
          if (readingData) appendLatestToBoundPoints(asset, readingData.timestamp, readingData)
          return
        }
        // 设备首次出现且 listPoints 失败：本轮放弃，不缓存空骨架，下轮重试
        points = []
      }

      const existingIndex = devices.value.findIndex(d => d.asset === asset)
      // 保留图表点位已加载的历史缓存：点位对象每轮重建，历史缓存需跨轮携带
      const oldPoints = existingIndex !== -1 ? devices.value[existingIndex].points : undefined
      const mappedPoints = points.map(point => {
        const pointValue = toPointValue(asset, point, readingData)
        const historyCache = oldPoints?.find(p => p.name === point.name)?.historyCache
        if (historyCache) pointValue.historyCache = historyCache
        return pointValue
      })

      if (existingIndex !== -1) {
        devices.value[existingIndex] = { ...devices.value[existingIndex], points: mappedPoints }
      } else {
        const device = await deviceApi.get(asset)
        // 二次守卫：deviceApi.get 期间可能已发生 clearDevices
        if (epoch !== devicesEpoch) return
        devices.value.push({
          asset: device.asset,
          name: device.name || device.asset,
          pluginName: device.plugin?.name || '',
          points: (device.points || []).map(point => toPointValue(asset, point, readingData))
        })
      }

      // 将本轮最新读数追加到图表绑定点位的历史缓存（内部含基线检查与 timestamp 去重）
      if (readingData) {
        appendLatestToBoundPoints(asset, readingData.timestamp, readingData)
      }
    } catch (e: unknown) {
      console.error(`Failed to fetch points for device ${asset}:`, e)
    }
  }

  /**
   * 拉取指定点位的历史趋势并写入该点位的 historyCache
   * 底层按 asset 整体拉取（并发去重 + 5s TTL 复用），再提取出该点位的时间序列
   * @param asset 设备 asset
   * @param pointName 点位名
   * @param hours 查询小时数，默认 24
   * @param limit 返回条数上限，默认 100
   */
  async function fetchPointHistory(
    asset: string,
    pointName: string,
    hours: number = 24,
    limit: number = 100
  ): Promise<ScadaPointHistoryEntry[]> {
    const entries = await fetchAssetHistory(asset, hours, limit)
    const series = extractPointSeries(entries, pointName)
    applyPointHistory(asset, pointName, series)
    return series
  }

  /**
   * 拉取指定设备的全量历史读数（内部解析条目）
   * 同一 asset + hours + limit 的并发调用共享同一个网络请求，成功结果保留 5s 复用
   */
  async function fetchAssetHistory(asset: string, hours: number, limit: number): Promise<ParsedHistoryEntry[]> {
    const key = `${asset}:${hours}:${limit}`
    const cached = historyRequestCache.get(key)
    // TTL 内的相同查询直接复用上一次结果（不发网络请求）
    if (cached?.entries && Date.now() < (cached.expiresAt ?? 0)) {
      return cached.entries
    }
    // 正在进行中的相同请求 → 直接共享
    if (cached?.promise) return cached.promise

    const promise = doFetchAssetHistory(asset, hours, limit, key).finally(() => {
      // 成功时 doFetchAssetHistory 已用「结果条目」整体覆盖本条目（promise 字段消失）；
      // 仍残留 promise 的条目对应失败请求，删除以保证可重试
      const entry = historyRequestCache.get(key)
      if (entry?.promise === promise) historyRequestCache.delete(key)
    })
    historyRequestCache.set(key, { promise })
    return promise
  }

  /** fetchAssetHistory 的实际实现（不含去重逻辑） */
  async function doFetchAssetHistory(asset: string, hours: number, limit: number, key: string): Promise<ParsedHistoryEntry[]> {
    const epoch = devicesEpoch
    try {
      const endTime = Date.now() / 1000
      const startTime = endTime - hours * 3600
      const response = await dataApi.getHistoryReadings(asset, startTime, endTime, limit)
      // clearDevices 已发生：丢弃在途回包，避免离开页面后污染单例状态
      if (epoch !== devicesEpoch) return []

      const entries = toParsedEntries(response.readings)
      historyRequestCache.set(key, { entries, expiresAt: Date.now() + HISTORY_CACHE_TTL })
      return entries
    } catch (e: unknown) {
      console.error(`Failed to fetch history for ${asset}:`, e)
      return []
    }
  }

  /**
   * 判断指定点位是否已有非空历史缓存
   * @param asset 设备 asset
   * @param pointName 点位名
   */
  function hasPointHistory(asset: string, pointName: string): boolean {
    return (deviceIndex.value.pointsById.get(asset)?.get(pointName)?.historyCache?.length ?? 0) > 0
  }

  /**
   * 从点位历史缓存中提取趋势数据
   * @param pointName 点位名
   * @param asset 设备 asset；传入时从对应设备读取，否则合并所有设备
   */
  function getPointTrendData(pointName: string, asset?: string): ScadaTrendPoint[] {
    const scanDevices = asset
      ? [deviceIndex.value.byId.get(asset)].filter((d): d is ScadaDeviceValue => !!d)
      : devices.value

    const series: ScadaPointHistoryEntry[] = []
    for (const device of scanDevices) {
      for (const point of device.points) {
        if (point.name === pointName && point.historyCache) {
          series.push(...point.historyCache)
        }
      }
    }

    return series
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(({ timestamp, value }) => ({
        time: new Date(timestamp * 1000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        timestamp: timestamp * 1000,
        value,
        quality: 'good'
      }))
  }

  /**
   * 生成模拟趋势数据（编辑模式或历史数据为空时使用）
   * @param point 点位值对象
   * @param hours 小时数，默认 24
   */
  function generateTrendData(point: ScadaPointValue, hours: number = 24): ScadaTrendPoint[] {
    const now = Date.now()
    const data: ScadaTrendPoint[] = []

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
    const device = deviceIndex.value.byId.get(deviceAsset)
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

        // 立即将保护值写入实时缓存，避免回读延迟期间显示旧值
        const existingIndex = devices.value.findIndex(d => d.asset === deviceAsset)
        if (existingIndex !== -1) {
          const device = devices.value[existingIndex]
          devices.value[existingIndex] = {
            ...device,
            points: device.points.map(p => (p.name === pointName ? { ...p, currentValue: value } : p))
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

  /** O(1) 解析点位：按 deviceId（asset 或设备名）+ pointName 查找 */
  function resolvePoint(deviceId: string, pointName: string): ScadaPointValue | null {
    return deviceIndex.value.pointsById.get(deviceId)?.get(pointName) ?? null
  }

  /**
   * 注册设备需求（replace 语义）：以 ownerId 为单位设置其完整需求集合
   * 全新资产立即拉取一次（fire-and-forget，复用 in-flight 去重）
   */
  function registerAssets(ownerId: string, assets: string[]): void {
    for (const [asset, owners] of assetDemand) {
      if (owners.has(ownerId) && !assets.includes(asset)) {
        owners.delete(ownerId)
        if (owners.size === 0) assetDemand.delete(asset)
      }
    }
    for (const asset of assets) {
      if (!asset) continue
      const owners = assetDemand.get(asset)
      if (owners) {
        owners.add(ownerId)
      } else {
        assetDemand.set(asset, new Set([ownerId]))
        void fetchDevicePoints(asset).catch(() => {})
      }
    }
  }

  /** 注销订阅者的全部设备需求（引用计数减一，归零资产从需求表移除） */
  function unregisterAssets(ownerId: string): void {
    for (const [asset, owners] of assetDemand) {
      owners.delete(ownerId)
      if (owners.size === 0) assetDemand.delete(asset)
    }
  }

  /** 当前所有订阅者需求的设备 asset 去重列表 */
  function getDemandedAssets(): string[] {
    return Array.from(assetDemand.keys())
  }

  /**
   * 清空所有设备数据与状态
   */
  function clearDevices(): void {
    devicesEpoch++
    for (const timer of pendingFollowUpTimers.values()) {
      clearTimeout(timer)
    }
    pendingFollowUpTimers.clear()
    writeProtectionMap.clear()
    devices.value = []
    historyRequestCache.clear()
    inflightDeviceFetches.clear()
    assetDemand.clear()
    skeletonCache.clear()
  }

  /**
   * 调试用：导出读值中枢保存在内存中的全部缓存结构（返回原始引用，devtools 中可逐层展开）
   */
  function getCacheSnapshot(): Record<string, unknown> {
    return {
      // 实时点位值缓存（最小点位值结构，含当前值；图表绑定点位额外携带 historyCache 历史序列）
      devices: devices.value,
      // O(1) 设备/点位索引：byId（asset/设备名 → 设备）、pointsById（deviceId → 点位名 → 点位值）
      deviceIndex: deviceIndex.value,
      // 历史请求缓存：asset:hours:limit → { promise?（进行中）, entries? + expiresAt（TTL 结果） }
      historyRequestCache,
      // 点位骨架缓存：asset → 点位定义列表（会话级，避免每轮重拉 listPoints）
      skeletonCache,
      // 设备请求 in-flight 去重表：asset → { promise, expiresAt }（完成后保留 1s 复用窗口）
      inflightDeviceFetches,
      // 设备需求注册表：asset → ownerId 集合（引用计数语义）
      assetDemand,
      // 写值保护表：pointKey → { value, expiresAt }（写后 10s 内优先使用保护值）
      writeProtectionMap,
      // 延迟回读定时器表：asset → setTimeout 句柄（连续写值仅保留最后一次回读）
      pendingFollowUpTimers,
      // 状态代际号：clearDevices 时递增，在途回包据此丢弃
      devicesEpoch
    }
  }

  return {
    historyVersion,
    fetchDevicePoints,
    fetchPointHistory,
    hasPointHistory,
    getPointTrendData,
    generateTrendData,
    writePoint,
    resolvePoint,
    registerAssets,
    unregisterAssets,
    getDemandedAssets,
    getCacheSnapshot,
    clearDevices
  }
}
