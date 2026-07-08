import { ref, computed, watch, onMounted, onUnmounted, type Ref } from 'vue'
import type { PointBinding } from '@/types/scada'
import { usePointStore } from '@/stores/points'
import { useScadaStore } from '@/stores/scada'
import type { PointDisplay } from '@/stores/points'

export interface UseScadaBindingOptions {
  autoRefresh?: boolean
  refreshInterval?: number
  transform?: (value: any, point: PointDisplay | null) => any
}

export interface UseScadaBindingReturn {
  currentValue: Ref<any>
  boundPoint: Ref<PointDisplay | null>
  isValid: Ref<boolean>
  refresh: () => void
  writeValue: (value: any) => Promise<{ success: boolean; message: string }>
}

export function useScadaBinding(
  binding: Ref<PointBinding | null>,
  options: UseScadaBindingOptions = {}
): UseScadaBindingReturn {
  const {
    autoRefresh = false,
    refreshInterval = 5000,
    transform
  } = options

  const pointStore = usePointStore()
  const scadaStore = useScadaStore()

  const currentValue = ref<any>(null)
  const boundPoint = ref<PointDisplay | null>(null)
  let refreshTimer: ReturnType<typeof setInterval> | null = null

  const findBoundPoint = (): PointDisplay | null => {
    if (!binding.value) return null

    const device = pointStore.devices.find(
      d => d.asset === binding.value!.deviceId || d.name === binding.value!.deviceId
    )
    if (!device) return null

    return device.points.find(p => p.name === binding.value!.pointName) || null
  }

  const updateValue = () => {
    if (scadaStore.isEditing) {
      currentValue.value = transform ? transform(null, null) : null
      boundPoint.value = null
      return
    }

    const point = findBoundPoint()
    boundPoint.value = point

    if (point) {
      currentValue.value = transform
        ? transform(point.currentValue, point)
        : point.currentValue
    } else {
      currentValue.value = null
    }
  }

  watch(
    () => pointStore.devices,
    () => {
      updateValue()
    },
    { deep: true }
  )

  watch(binding, () => {
    updateValue()
  })

  watch(() => scadaStore.isEditing, () => {
    updateValue()
    if (scadaStore.isEditing) {
      stopAutoRefresh()
    } else {
      startAutoRefresh()
    }
  })

  const startAutoRefresh = () => {
    if (scadaStore.isEditing) return
    if (autoRefresh && binding.value) {
      refreshTimer = setInterval(() => {
        pointStore.fetchDevicePoints(binding.value!.deviceId)
      }, refreshInterval)
    }
  }

  const stopAutoRefresh = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }

  const refresh = async () => {
    if (scadaStore.isEditing) return
    if (binding.value) {
      await pointStore.fetchDevicePoints(binding.value.deviceId)
    }
  }

  const writeValue = async (value: any): Promise<{ success: boolean; message: string }> => {
    if (!binding.value || !boundPoint.value) {
      return { success: false, message: '未绑定有效点位' }
    }

    if (!boundPoint.value.writable) {
      return { success: false, message: `点位 ${binding.value.pointName} 不可写` }
    }

    return pointStore.writePoint(
      binding.value.deviceId,
      binding.value.pointName,
      value
    )
  }

  onMounted(() => {
    updateValue()
    startAutoRefresh()
  })

  onUnmounted(() => {
    stopAutoRefresh()
  })

  const isValid = computed(() => boundPoint.value !== null)

  return {
    currentValue,
    boundPoint,
    isValid,
    refresh,
    writeValue
  }
}