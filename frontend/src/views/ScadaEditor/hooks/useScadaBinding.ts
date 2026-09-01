import { ref, computed, watch, inject, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PointBinding } from '@/types/scada'
import { usePointStore } from '@/stores/points'
import { useScadaEditor } from './useScadaEditor'
import { ScadaPointReaderKey, type ScadaPointReader } from '@/utils/scadaPointReader'
import { usePolling } from '@/hooks/usePolling'
import type { PointDisplay } from '@/stores/points'
import type { ScadaComponent } from '../types'

// ═══════════════════════════════════════════════════════════════════════════════
// 点位绑定
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 点位值转换函数签名
 */
export type PointValueTransform = (
  value: any,
  point: PointDisplay | null
) => any

/**
 * useScadaBinding 配置选项
 */
export interface UseScadaBindingOptions {
  /** 点位值转换函数 */
  transform?: PointValueTransform
}

/**
 * useScadaBinding 返回值
 */
export interface UseScadaBindingReturn {
  /** 当前绑定点位的值（已转换） */
  currentValue: Ref<any>
  /** 当前绑定的点位信息 */
  boundPoint: Ref<PointDisplay | null>
  /** 绑定是否有效 */
  isValid: Ref<boolean>
  /** 手动触发一次点位刷新 */
  refresh: () => Promise<void>
  /** 向点位写入值 */
  writeValue: (value: any) => Promise<{ success: boolean; message: string }>
}

/**
 * Scada 点位绑定 Hook
 *
 * 负责组件与设备点位的数据响应：
 * - 监听点位数据变化，自动更新当前显示值
 * - 编辑模式下使用模拟值（fallback）
 * - 不包含主动轮询逻辑，轮询统一由 useScadaPolling 管理
 *
 * @param binding 点位绑定引用
 * @param options 配置选项
 * @param fallbackValue 编辑模式/未绑定点位时的模拟值
 */
export function useScadaBinding(
  binding: Ref<PointBinding | null>,
  options: UseScadaBindingOptions = {},
  fallbackValue?: Ref<number | boolean | string | null | undefined>
): UseScadaBindingReturn {
  const { transform } = options
  const { t } = useI18n()
  const pointStore = usePointStore()
  const injectedReader = inject(ScadaPointReaderKey, null)
  const scada = useScadaEditor()

  /** 统一的数据源：优先使用注入的 reader，否则回退到全局 store */
  const devices = computed(() => injectedReader ? injectedReader.devices.value : pointStore.devices)

  /** 根据绑定信息查找对应的点位 */
  const boundPoint = computed((): PointDisplay | null => {
    if (!binding.value) return null

    const device = devices.value.find(
      d => d.asset === binding.value!.deviceId || d.name === binding.value!.deviceId
    )
    if (!device) return null

    return device.points.find(p => p.name === binding.value!.pointName) || null
  })

  /** 当前组件应显示的值 */
  const currentValue = ref<any>(null)

  /** 更新当前显示值 */
  const updateCurrentValue = () => {
    if (scada.isEditing.value) {
      const fallback = fallbackValue?.value
      currentValue.value = transform ? transform(fallback, null) : fallback
      return
    }

    if (boundPoint.value) {
      currentValue.value = transform
        ? transform(boundPoint.value.currentValue, boundPoint.value)
        : boundPoint.value.currentValue
      return
    }

    const fallback = fallbackValue?.value
    if (fallback !== undefined && fallback !== null) {
      currentValue.value = transform ? transform(fallback, null) : fallback
    } else {
      currentValue.value = null
    }
  }

  // 监听绑定点位引用变化（组件绑定的设备/点位变了）
  watch(boundPoint, updateCurrentValue)
  // 监听点位当前值变化（原始值比较，只有值真正变了才触发；
  //   devices 整体替换时 boundPoint computed 返回的 currentValue 若未变化则不触发）
  watch(
    () => boundPoint.value?.currentValue,
    updateCurrentValue
  )
  watch(() => scada.isEditing.value, updateCurrentValue)
  if (fallbackValue) {
    watch(fallbackValue, updateCurrentValue)
  }

  // 初始化一次显示值
  updateCurrentValue()

  /** 刷新绑定设备点位数据 */
  const refreshDevicePoints = async (asset: string) => {
    if (injectedReader) {
      await injectedReader.fetchDevicePoints(asset)
    } else {
      await pointStore.fetchDevicePoints(asset)
    }
  }

  /** 手动触发一次绑定设备的刷新 */
  const refresh = async () => {
    if (scada.isEditing.value || !binding.value) return
    try {
      await refreshDevicePoints(binding.value.deviceId)
    } catch (e) {
      console.error('[useScadaBinding] Failed to refresh device points:', e)
    }
  }

  /** 向点位写入值 */
  const writeValue = async (value: any): Promise<{ success: boolean; message: string }> => {
    if (!binding.value || !boundPoint.value) {
      return { success: false, message: t('scadaBinding.noBoundPoint') }
    }

    if (!boundPoint.value.writable) {
      return { success: false, message: t('scadaBinding.pointNotWritable', { name: binding.value.pointName }) }
    }

    try {
      if (injectedReader) {
        return injectedReader.writePoint(binding.value.deviceId, binding.value.pointName, value)
      }
      return pointStore.writePoint(binding.value.deviceId, binding.value.pointName, value)
    } catch (e) {
      console.error('[useScadaBinding] Failed to write point value:', e)
      return { success: false, message: t('common.operationFailed') }
    }
  }

  const isValid = computed(() => boundPoint.value !== null)

  return {
    currentValue,
    boundPoint,
    isValid,
    refresh,
    writeValue
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 统一轮询
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 从组件列表中提取已绑定的设备 asset 集合
 * @param components 面板组件列表
 */
function extractBoundAssets(components: ScadaComponent[]): string[] {
  const assets = new Set<string>()
  for (const component of components) {
    if (component.binding?.deviceId) {
      assets.add(component.binding.deviceId)
    }
  }
  return Array.from(assets)
}

/**
 * useScadaPolling 配置选项
 */
export interface UseScadaPollingOptions {
  /** 轮询间隔（毫秒），默认 5000 */
  interval?: number
  /** 启动时是否立即执行一次，默认 true */
  immediate?: boolean
  /** 自定义要轮询的设备 asset 列表；默认从当前面板组件绑定中提取 */
  assets?: () => string[]
  /** 显式传入的点位读取器，用于在同一组件中使用 provide/inject 的场景 */
  reader?: ScadaPointReader | null
}

/**
 * Scada 统一数据轮询 Hook
 *
 * 根据当前面板中已绑定点位的组件，自动收集涉及的设备 asset，
 * 并周期性地刷新这些设备的最新点位数据。
 *
 * 适用场景：ScadaPreview 页面、vant 轮播页面等纯预览场景。
 * 编辑场景无需调用，避免无效请求。
 *
 * @param options 轮询配置
 */
export function useScadaPolling(options: UseScadaPollingOptions = {}) {
  const { interval = 5000, immediate = true, assets, reader } = options

  const scada = useScadaEditor()
  const pointStore = usePointStore()
  const injectedReader = inject(ScadaPointReaderKey, null)
  const effectiveReader = reader ?? injectedReader

  /** 当前需要轮询的设备 asset 列表 */
  const boundAssets = computed(() => {
    if (assets) return assets()
    const components = scada.currentPanel.value?.components || []
    return extractBoundAssets(components)
  })

  /** 刷新指定设备列表的最新点位数据 */
  const refreshBoundDevices = async (): Promise<void> => {
    if (scada.isEditing.value) return

    const targets = boundAssets.value
    if (targets.length === 0) return

    const fetcher = (asset: string) =>
      effectiveReader ? effectiveReader.fetchDevicePoints(asset) : pointStore.fetchDevicePoints(asset)

    await Promise.allSettled(targets.map(fetcher))

    // 追加最新读数到历史缓存（appendLatestReadingToHistory 内部有去重+基线检查，
    // 无历史基线时自动跳过，成功追加后 historyVersion 自动递增触发图表增量刷新）
    if (effectiveReader) {
      for (const asset of targets) {
        effectiveReader.appendLatestReadingToHistory(asset)
      }
    }
  }

  const { start, stop, isRunning, pause, resume } = usePolling(refreshBoundDevices, {
    interval,
    immediate
  })

  // 编辑模式切换时自动暂停/恢复，并在退出编辑模式时立即刷新一次数据
  watch(
    () => scada.isEditing.value,
    (editing, wasEditing) => {
      if (editing) {
        stop()
      } else {
        start()
        if (wasEditing) {
          void refreshBoundDevices()
        }
      }
    }
  )

  // 绑定设备变化时立即刷新一次（computed 返回新数组，引用比较即可，无需 deep）
  watch(
    boundAssets,
    () => {
      if (!scada.isEditing.value) {
        void refreshBoundDevices()
      }
    }
  )

  return {
    boundAssets,
    isRunning,
    start,
    stop,
    /** 暂停轮询（不重置计时器，仅跳过任务执行）：手势/面板切换期间避免数据回包触发重渲染 */
    pause,
    /** 恢复轮询 */
    resume,
    refreshBoundDevices
  }
}
