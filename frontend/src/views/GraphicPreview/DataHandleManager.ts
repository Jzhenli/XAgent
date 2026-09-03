import DataManager from './DataManager'
import { watch } from 'vue'
import type { ScadaPointReader } from '@/utils/scadaPointReader'

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

/** 按点位聚合的订阅：同一 deviceId + pointName 被多个图元绑定时共享一个 watch */
interface PointSubscription {
  deviceId: string
  pointName: string
  callbacks: PointCallbackInfo[]
}

/** 订阅者实例序号：作为读值中枢需求注册表的 ownerId，保证多实例并存时互不干扰 */
let subscriberSeq = 0

/**
 * Graphic 面板读值订阅者
 *
 * 统一读值架构下的角色：
 * - 不自发请求与轮询（原 getLatest 全量轮询已移除）
 * - setPointBindings 时向注入的 ScadaPointReader 注册设备需求（reader 对新资产立即拉取）
 * - 每点位 watch reader 的响应式值，值变化时推回调给 GraphicRender（GraphicRender 包契约不变）
 */
export default class DataHandleManager extends DataManager {
  private watchers: Array<() => void> = []
  private readonly ownerId = `graphic-subscriber-${++subscriberSeq}`

  constructor(private reader: ScadaPointReader) {
    super()
  }

  /**
   * GraphicRender 每轮 graphicData 变化时推送绑定对，本方法完成订阅重建：
   * 解析绑定 → 注册设备需求 → 逐点位建立响应式 watch
   */
  async setPointBindings(bindingPairs: BindingPair[]): Promise<any[]> {
    // 幂等重建：GraphicRender 每次 graphicData 变化都会先推空串再重新调用本方法
    this.release()

    const subscriptions = this.parseBindingPairs(bindingPairs)
    if (subscriptions.length === 0) {
      return []
    }

    // 注册设备需求：reader 对新资产立即拉取一次，回包后 watch 自然推送初值
    this.reader.registerAssets(this.ownerId, this.collectAssets(subscriptions))

    // 每点位 watch 响应式值：值变化（原始值 === 比较，天然去重）→ 归一化 → 推回调
    for (const subscription of subscriptions) {
      this.watchers.push(this.watchPointValue(subscription))
    }

    return []
  }

  /** 停止全部值订阅并注销设备需求 */
  private release(): void {
    this.watchers.forEach(stop => stop())
    this.watchers = []
    this.reader.unregisterAssets(this.ownerId)
  }

  dispose() {
    this.release()
  }

  /**
   * 解析 GraphicRender 推来的绑定对，按点位聚合成订阅列表
   * pointRef 格式："deviceId,pointName,..."（前两段有效，多余段忽略）
   */
  private parseBindingPairs(bindingPairs: BindingPair[]): PointSubscription[] {
    const subscriptionMap = new Map<string, PointSubscription>()

    for (const [binding, callback] of bindingPairs) {
      if (!binding || !callback) continue

      const [deviceId, pointName] = binding.pointRef.split(',')
      if (!deviceId || !pointName) continue

      // 复合键保留设备维度，修复同名点位跨设备串值
      const key = `${deviceId}::${pointName}`
      const subscription = subscriptionMap.get(key) ?? { deviceId, pointName, callbacks: [] }
      subscription.callbacks.push({ callback, pointType: binding.pointType })
      subscriptionMap.set(key, subscription)
    }

    return Array.from(subscriptionMap.values())
  }

  /** 提取订阅列表涉及的设备 asset（去重） */
  private collectAssets(subscriptions: PointSubscription[]): string[] {
    return Array.from(new Set(subscriptions.map(subscription => subscription.deviceId)))
  }

  /** 订阅单点位值变化：布尔归一化后逐回调推送给 GraphicRender */
  private watchPointValue(subscription: PointSubscription): () => void {
    const { deviceId, pointName, callbacks } = subscription

    return watch(
      () => this.reader.resolvePoint(deviceId, pointName)?.currentValue,
      (val) => {
        if (val === undefined || val === null) return

        const value = normalizeBooleanValue(val)
        // try-catch 隔离单个回调异常，避免影响同一点位其他图元的更新
        for (const { callback, pointType } of callbacks) {
          try {
            callback(value, pointType)
          } catch (err) {
            console.error(`Error executing callback for point ${pointName}`, err)
          }
        }
      }
    )
  }
}

/** 布尔值归一化：GraphicRender 仅接受数值，true/"true" → 1，false/"false" → 0 */
function normalizeBooleanValue(value: any): any {
  if (value === true || value === 'true') return 1
  if (value === false || value === 'false') return 0
  return value
}
