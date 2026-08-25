
import DataManager from './DataManager'
import { deviceApi } from '@/api/devices'
import { parseStandardPoints } from '@/utils/pointMapping'
import { useSystemStore } from '@/stores/system'

export enum PointAttrValueType {
  Analog = 'Analog',
  State = 'State',
  String = 'String',
  Binary = 'Binary'
}

export enum BasicValueTypes {
  binary = 'binary',
  state = 'state',
  analog = 'analog',
  text = 'text',
  timestamp = 'timestamp'
}

export interface PointBinding {
  cpntId: number
  bindingType: 'point'
  pointRef: string
  pointName: string
  pointType: PointAttrValueType
  valueType: BasicValueTypes
  range: Record<string, unknown>
}

type PointCallback = (value: any, type?: any, translatedText?: string) => void
type BindingPair = [PointBinding | undefined, PointCallback | undefined]

interface PointCallbackInfo {
  callback: PointCallback
  pointType: PointAttrValueType
}

export default class DataHandleManager extends DataManager {
  private intervalId: number | null = null
  /** 请求防重叠标记：上一次轮询未返回时跳过本次，避免慢网络下请求堆积 */
  private isFetching = false
  /** 点位上次值缓存：值未变化时不触发回调，减少无效渲染 */
  private lastValues = new Map<string, any>()

  async setPointBindings(bindingPairs: BindingPair[]): Promise<any[]> {
    // 清理之前的定时器与值缓存（重新绑定时需重新推送初始值）
    this.clearInterval()
    this.lastValues.clear()

    // 创建点ID到回调信息的映射
    const callbackMap = new Map<string, PointCallbackInfo[]>()

    // 收集有效点ID
    const pointIds = new Set<string>()

    //console.log('setPointBindings', bindingPairs)
    bindingPairs.forEach(([binding, callback]) => {
      if (!binding || !callback) return

      const parts = binding.pointRef.split(',')
      if (parts.length < 2) return

      //pointRef 第一个参数是设备ID，第二个参数是点名称
      const pointId = parts[1]
      if (!pointId) return

      // 添加到点ID集合
      pointIds.add(pointId)

      // 添加到回调映射
      if (!callbackMap.has(pointId)) {
        callbackMap.set(pointId, [])
      }

      callbackMap.get(pointId)!.push({
        callback,
        pointType: binding.pointType
      })
    })

    const uniquePointIds = Array.from(pointIds)
    if (uniquePointIds.length === 0) {
      return []
    }

    // 立即获取初始数据
    try {
      await this.fetchAndUpdatePoints(uniquePointIds, callbackMap)
    } catch (error) {
      console.error('Initial points data fetch failed', error)
    }

    // 设置定时轮询
    const systemStore = useSystemStore()
    this.intervalId = window.setInterval(() => {
      this.fetchAndUpdatePoints(uniquePointIds, callbackMap)
    }, systemStore.visualizationConfig.pollingInterval)

    return []
  }

  /** 值未变化时跳过回调，避免每个轮询周期触发全量组件重渲染 */
  private shouldNotify(pointName: string, value: any): boolean {
    if (this.lastValues.has(pointName) && this.lastValues.get(pointName) === value) {
      return false
    }
    this.lastValues.set(pointName, value)
    return true
  }

  private async fetchAndUpdatePoints(
    pointIds: string[],
    callbackMap: Map<string, PointCallbackInfo[]>
  ) {
    // 上一次请求未返回时跳过，防止慢网络下请求堆积
    if (this.isFetching) return
    this.isFetching = true

    try {
      const res = await deviceApi.getLatest(false)
      if (!res.devices || !Array.isArray(res.devices)) {
        console.warn('Invalid points data response', res)
        return
      }

      //console.log('fetchAndUpdatePoints', res.devices, new Date().toISOString())

      for (const device of res.devices) {
        const { standardPoints } = parseStandardPoints(device.standard_points)

        for (const [pointName, standardPoint] of standardPoints) {
          const callbackInfos = callbackMap.get(pointName)
          if (!callbackInfos) continue

          let value = standardPoint.value
          if (value === true || value === 'true') {
            value = 1
          } else if (value === false || value === 'false') {
            value = 0
          }
          if (!this.shouldNotify(pointName, value)) continue

          callbackInfos.forEach(({ callback, pointType }) => {
            try {
              callback(value, pointType)
            } catch (err) {
              console.error(`Error executing callback for point ${pointName}`, err)
            }
          })
        }

        if (device.data) {
          for (const [pointName, rawValue] of Object.entries(device.data)) {
            if (standardPoints.has(pointName)) continue

            const callbackInfos = callbackMap.get(pointName)
            if (!callbackInfos) continue

            let value = rawValue
            if (value === true || value === 'true') {
              value = 1
            } else if (value === false || value === 'false') {
              value = 0
            }
            if (!this.shouldNotify(pointName, value)) continue

            callbackInfos.forEach(({ callback, pointType }) => {
              try {
                callback(value, pointType)
              } catch (err) {
                console.error(`Error executing callback for point ${pointName}`, err)
              }
            })
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch points data', err)
    } finally {
      this.isFetching = false
    }
  }

  private clearInterval() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  dispose() {
    this.clearInterval()
    this.lastValues.clear()
  }
}
