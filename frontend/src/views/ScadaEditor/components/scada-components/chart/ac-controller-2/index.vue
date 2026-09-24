<template>
  <div class="ac-controller-2" :style="containerStyle">
    <!-- 标题 -->
    <div
      class="zone zone-title"
      :style="titleZoneStyle"
    >
      {{ title }}
    </div>

    <!-- 电源开关（右上角） -->
    <div
      class="zone zone-power"
      :style="powerZoneStyle"
      @click.stop="handleTogglePower"
    >
      <el-icon
        class="power-icon"
        :class="{ active: isOn, disabled: !isOn }"
        :style="powerIconStyle"
      >
        <SwitchButton />
      </el-icon>
    </div>

    <!-- 模式（单图标循环切换） -->
    <div
      class="zone zone-icon-btn zone-mode-btn"
      :style="modeZoneStyle"
      :class="{ disabled: !isOn }"
      @click.stop="handleCycleMode"
    >
      <Icon
        v-if="currentMode"
        :name="currentMode.icon"
        :size="modeIconSize"
        type="dual-color"
        :color="{ normal: isOn ? modeIconColor : modeDisabledColor, active: isOn ? modeActiveIconColor : modeDisabledColor }"
      />
      <Icon
        v-else
        name="unknownCircle"
        :size="modeIconSize"
        type="mono-line"
        :color="{ normal: modeDisabledColor }"
      />
    </div>

    <!-- 风速（单图标循环切换） -->
    <div
      class="zone zone-icon-btn zone-fan-btn"
      :style="fanZoneStyle"
      :class="{ disabled: !isOn }"
      @click.stop="handleCycleFan"
    >
      <Icon
        v-if="currentFan"
        :name="currentFan.icon"
        :size="fanIconSize"
        type="dual-color"
        :color="{ normal: isOn ? fanIconColor : fanDisabledColor, active: isOn ? fanActiveIconColor : fanDisabledColor }"
      />
      <Icon
        v-else
        name="unknownCircle"
        :size="fanIconSize"
        type="mono-line"
        :color="{ normal: fanDisabledColor }"
      />
    </div>

    <!-- 仪表盘（el-progress dashboard + 加减按钮） -->
    <div
      class="zone zone-gauge"
      :style="gaugeZoneStyle"
    >
      <svg v-if="hasGradient" width="0" height="0" aria-hidden="true" class="gauge-gradient-defs">
        <defs>
          <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" :stop-color="gradientColors[0]" />
            <stop offset="50%" :stop-color="gradientColors[1]" />
            <stop offset="100%" :stop-color="gradientColors[2]" />
          </linearGradient>
        </defs>
      </svg>

      <el-progress
        type="dashboard"
        :percentage="gaugePercentage"
        :color="progressColor"
        :width="gaugeSize"
        :stroke-width="gaugeTrackWidth"
        :stroke-linecap="'round'"
      >
        <div class="gauge-center" :class="{ disabled: !isOn }">
          <el-icon
            class="gauge-btn gauge-btn-left"
            :class="{ disabled: !isOn || writing }"
            :style="gaugeBtnStyle"
            @click.stop="decrementSetpoint"
          >
            <ArrowLeft />
          </el-icon>

          <div class="gauge-value-wrap">
            <span class="gauge-value" :style="gaugeValueStyle">
              {{ formatNumber(setpointValue) }}
            </span>
            <span v-if="gaugeUnit" class="gauge-unit" :style="gaugeUnitStyle">{{ gaugeUnit }}</span>
          </div>

          <el-icon
            class="gauge-btn gauge-btn-right"
            :class="{ disabled: !isOn || writing }"
            :style="gaugeBtnStyle"
            @click.stop="incrementSetpoint"
          >
            <ArrowRight />
          </el-icon>
        </div>
      </el-progress>
    </div>

    <!-- 当前值 -->
    <div
      class="zone zone-current"
      :style="currentZoneStyle"
    >
      <span
        class="current-text"
        :style="currentTextStyle"
      >
        {{ currentValueLabel }}{{ formatNumber(currentValue) }}{{ currentValueUnit }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { SwitchButton, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { ScadaComponent, AcController2ComponentConfig, PointBinding, AcModeKey, AcFanSpeedKey } from '@/types/scada'
import { useScadaBinding } from '@/views/ScadaEditor/hooks'
import { Icon } from '@/icon/index'

const props = defineProps<{
  component: ScadaComponent
  editing?: boolean
}>()

const config = computed(() => props.component.config as AcController2ComponentConfig)
const bindings = computed(() => config.value.bindings)

// ═══════════════════════════════════════════════════════════════════════════════
// 5 个点位绑定 —— 每个独立 useScadaBinding
// ═══════════════════════════════════════════════════════════════════════════════

// 开关点位
const { currentValue: powerVal, writeValue: writePower } = useScadaBinding(
  computed<PointBinding | null>(() => bindings.value?.power ?? null),
  { transform: (v) => (typeof v === 'boolean' ? (v ? 1 : 0) : v) },
  computed(() => 1),
)
const isOn = computed(() => {
  const v = powerVal.value
  if (typeof v === 'boolean') return v
  if (typeof v === 'number') return v > 0
  if (typeof v === 'string') return v !== '0' && v !== 'false'
  return !!v
})

// 模式点位
const { currentValue: modeVal, writeValue: writeModeBinding } = useScadaBinding(
  computed<PointBinding | null>(() => bindings.value?.mode ?? null),
  {},
  computed(() => config.value.modeAutoValue),
)

// 风速点位
const { currentValue: fanVal, writeValue: writeFanBinding } = useScadaBinding(
  computed<PointBinding | null>(() => bindings.value?.fanSpeed ?? null),
  {},
  computed(() => config.value.fanAutoValue),
)

// 设定值点位
const { currentValue: setpointVal, writeValue: writeSetpoint } = useScadaBinding(
  computed<PointBinding | null>(() => bindings.value?.setpoint ?? null),
  { transform: (v) => (typeof v === 'number' ? v : Number(v) || config.value.gaugeMin) },
  computed(() => (config.value.gaugeMin + config.value.gaugeMax) / 2),
)

// 当前值点位（只读）
const { currentValue: currentVal } = useScadaBinding(
  computed<PointBinding | null>(() => bindings.value?.currentValue ?? null),
  { transform: (v) => (typeof v === 'number' ? v : Number(v) || 0) },
  computed(() => 25),
)

// ═══════════════════════════════════════════════════════════════════════════════
// 基础样式配置
// ═══════════════════════════════════════════════════════════════════════════════

const containerStyle = computed(() => ({
  backgroundColor: config.value.backgroundColor,
  borderRadius: `${config.value.borderRadius}px`,
}))

const title = computed(() => config.value.title)
const titleFontSize = computed(() => config.value.titleFontSize)
const titleFontColor = computed(() => config.value.titleFontColor)

const powerIconColor = computed(() => config.value.powerIconColor)
const powerActiveColor = computed(() => config.value.powerActiveColor)
const powerIconSize = computed(() => config.value.powerIconSize ?? 18)

const gaugeMin = computed(() => config.value.gaugeMin)
const gaugeMax = computed(() => config.value.gaugeMax)
const gaugeUnit = computed(() => config.value.gaugeUnit)
const gaugeTrackWidth = computed(() => config.value.gaugeTrackWidth)
const gaugeTrackColor = computed(() => config.value.gaugeTrackColor)
const gaugeFillColor = computed(() => config.value.gaugeFillColor)
const gaugeFontSize = computed(() => config.value.gaugeFontSize)
const gaugeFontColor = computed(() => config.value.gaugeFontColor)
const gaugeStep = computed(() => config.value.gaugeStep ?? 1)

const currentValueLabel = computed(() => config.value.currentValueLabel)
const currentValueFontSize = computed(() => config.value.currentValueFontSize)
const currentValueFontColor = computed(() => config.value.currentValueFontColor)
const currentValueUnit = computed(() => config.value.currentValueUnit)

const modeIconSize = computed(() => config.value.modeIconSize)
const modeIconColor = computed(() => config.value.modeIconColor)
const modeActiveIconColor = computed(() => config.value.modeActiveIconColor)
const modeDisabledColor = computed(() => 'rgba(255, 255, 255, 0.25)')

const fanIconSize = computed(() => config.value.fanIconSize)
const fanIconColor = computed(() => config.value.fanIconColor)
const fanActiveIconColor = computed(() => config.value.fanActiveIconColor)
const fanDisabledColor = computed(() => 'rgba(255, 255, 255, 0.25)')

// ═══════════════════════════════════════════════════════════════════════════════
// 模式单图标 —— 循环切换列表（支持自定义参与循环的模式组合）
// ═══════════════════════════════════════════════════════════════════════════════

interface ModeIconItem {
  key: AcModeKey
  icon: string
  value: number | string
}

/** 各模式对应的图标名 */
const modeIconMap: Record<AcModeKey, string> = {
  auto: 'auto',
  cool: 'snow',
  heat: 'sun',
  fan: 'fan2',
}

/** 各模式对应的数值映射 */
const modeValueMap = computed<Record<AcModeKey, number | string>>(() => ({
  auto: config.value.modeAutoValue,
  cool: config.value.modeCoolValue,
  heat: config.value.modeHeatValue,
  fan: config.value.modeFanValue,
}))

/** 参与循环切换的模式列表（根据用户自定义 modeCycleModes 过滤，fallback 全部 4 种） */
const modeCycleList = computed<ModeIconItem[]>(() => {
  const configured = config.value.modeCycleModes
  const keys: AcModeKey[] =
    configured && configured.length > 0
      ? configured
      : ['auto', 'cool', 'heat', 'fan']
  const values = modeValueMap.value
  return keys.map((key) => ({
    key,
    icon: modeIconMap[key],
    value: values[key],
  }))
})

const currentMode = computed<ModeIconItem | null>(() => {
  const v = modeVal.value
  if (v == null) return null
  return modeCycleList.value.find((m) => String(m.value) === String(v)) ?? null
})

const handleCycleMode = async () => {
  if (!isOn.value || props.editing || writing.value) return
  const list = modeCycleList.value
  const idx = currentMode.value ? list.findIndex((m) => m.key === currentMode.value!.key) : -1
  const next = list[(idx + 1) % list.length]
  await writeModeValue(next.value)
}

const writeModeValue = async (target: number | string) => {
  if (!bindings.value?.mode) {
    modeVal.value = target
    return
  }
  writing.value = true
  try {
    const res = await writeModeBinding(target)
    if (!res.success) ElMessage.error(res.message)
  } catch (e: unknown) {
    const detail =
      (e as any)?.response?.data?.detail ||
      (e instanceof Error ? e.message : '操作失败')
    ElMessage.error(detail)
  } finally {
    writing.value = false
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 风速单图标 —— 循环切换列表（支持自定义参与循环的档位组合）
// ═══════════════════════════════════════════════════════════════════════════════

interface FanIconItem {
  key: AcFanSpeedKey
  icon: string
  value: number | string
}

/** 各风速档位对应的图标名 */
const fanIconMap: Record<AcFanSpeedKey, string> = {
  auto: 'fanSpeedAuto',
  low: 'fanSpeed1',
  medium: 'fanSpeed2',
  high: 'fanSpeed3',
}

/** 各风速档位对应的数值映射 */
const fanValueMap = computed<Record<AcFanSpeedKey, number | string>>(() => ({
  auto: config.value.fanAutoValue,
  low: config.value.fanLowValue,
  medium: config.value.fanMediumValue,
  high: config.value.fanHighValue,
}))

/** 参与循环切换的风速档位列表（根据用户自定义 fanCycleModes 过滤，fallback 全部 4 种） */
const fanCycleList = computed<FanIconItem[]>(() => {
  const configured = config.value.fanCycleModes
  const keys: AcFanSpeedKey[] =
    configured && configured.length > 0
      ? configured
      : ['auto', 'low', 'medium', 'high']
  const values = fanValueMap.value
  return keys.map((key) => ({
    key,
    icon: fanIconMap[key],
    value: values[key],
  }))
})

const currentFan = computed<FanIconItem | null>(() => {
  const v = fanVal.value
  if (v == null) return null
  return fanCycleList.value.find((m) => String(m.value) === String(v)) ?? null
})

const handleCycleFan = async () => {
  if (!isOn.value || props.editing || writing.value) return
  const list = fanCycleList.value
  const idx = currentFan.value ? list.findIndex((m) => m.key === currentFan.value!.key) : -1
  const next = list[(idx + 1) % list.length]
  await writeFanValue(next.value)
}

const writeFanValue = async (target: number | string) => {
  if (!bindings.value?.fanSpeed) {
    fanVal.value = target
    return
  }
  writing.value = true
  try {
    const res = await writeFanBinding(target)
    if (!res.success) ElMessage.error(res.message)
  } catch (e: unknown) {
    const detail =
      (e as any)?.response?.data?.detail ||
      (e instanceof Error ? e.message : '操作失败')
    ElMessage.error(detail)
  } finally {
    writing.value = false
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 仪表盘
// ═══════════════════════════════════════════════════════════════════════════════

const setpointValue = computed(() => setpointVal.value ?? (gaugeMin.value + gaugeMax.value) / 2)

const normalizePercentage = (value: number, minVal: number, maxVal: number): number => {
  const range = maxVal - minVal
  if (range <= 0) return 0
  return Math.min(100, Math.max(0, ((value - minVal) / range) * 100))
}

const gaugePercentage = computed(() =>
  normalizePercentage(setpointValue.value, gaugeMin.value, gaugeMax.value),
)

const gaugeSize = computed(() => config.value.gaugeSize ?? 110)

const gaugeValueStyle = computed(() => ({
  color: gaugeFontColor.value,
  fontSize: `${gaugeFontSize.value}px`,
  fontWeight: 'bold' as const,
}))

const gaugeUnitStyle = computed(() => ({
  color: gaugeFontColor.value,
  fontSize: `${Math.max(9, gaugeFontSize.value * 0.5)}px`,
  opacity: 0.8,
}))

const gaugeBtnStyle = computed(() => ({
  fontSize: `${Math.max(8, gaugeFontSize.value - 4)}px`,
}))

const gradientId = computed(() => `ac-controller-2-gradient-${props.component.id}`)
const isValidGradient = (gradient?: string[] | null): gradient is [string, string, string] =>
  Array.isArray(gradient) && gradient.length === 3 && gradient.every((c) => !!c)
const gradientColors = computed(() => {
  const gradient = config.value.gaugeFillGradient
  if (isValidGradient(gradient)) return gradient
  const fallback = gaugeFillColor.value
  return [fallback, fallback, fallback] as [string, string, string]
})
const hasGradient = computed(() => isValidGradient(config.value.gaugeFillGradient))

const progressColor = computed(() => {
  if (hasGradient.value) {
    return `url(#${gradientId.value})`
  }
  return gaugeFillColor.value
})

const writing = ref(false)
const formatNumber = (val: number): string =>
  Number.isInteger(val) ? String(val) : val.toFixed(1)

// ═══════════════════════════════════════════════════════════════════════════════
// 当前值显示
// ═══════════════════════════════════════════════════════════════════════════════

const currentValue = computed(() => currentVal.value ?? 25)

const currentTextStyle = computed(() => ({
  fontSize: `${currentValueFontSize.value}px`,
  color: currentValueFontColor.value,
}))

// ═══════════════════════════════════════════════════════════════════════════════
// 操作方法
// ═══════════════════════════════════════════════════════════════════════════════

const handleTogglePower = async () => {
  if (props.editing || writing.value) return

  const target = isOn.value ? 0 : 1
  if (!bindings.value?.power) {
    powerVal.value = target
    return
  }

  writing.value = true
  try {
    const res = await writePower(target)
    if (!res.success) ElMessage.error(res.message)
  } catch (e: unknown) {
    const detail =
      (e as any)?.response?.data?.detail ||
      (e instanceof Error ? e.message : '操作失败')
    ElMessage.error(detail)
  } finally {
    writing.value = false
  }
}

const clampSetpoint = (raw: number): number =>
  Math.min(gaugeMax.value, Math.max(gaugeMin.value, raw))

const incrementSetpoint = async () => {
  if (!isOn.value || props.editing || writing.value) return
  const next = clampSetpoint(setpointValue.value + gaugeStep.value)
  await writeSetpointValue(next)
}

const decrementSetpoint = async () => {
  if (!isOn.value || props.editing || writing.value) return
  const next = clampSetpoint(setpointValue.value - gaugeStep.value)
  await writeSetpointValue(next)
}

const writeSetpointValue = async (target: number) => {
  if (!bindings.value?.setpoint) {
    setpointVal.value = target
    return
  }
  writing.value = true
  try {
    const res = await writeSetpoint(target)
    if (!res.success) ElMessage.error(res.message)
  } catch (e: unknown) {
    const detail =
      (e as any)?.response?.data?.detail ||
      (e instanceof Error ? e.message : '操作失败')
    ElMessage.error(detail)
  } finally {
    writing.value = false
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 区域样式（位置）
// ═══════════════════════════════════════════════════════════════════════════════

const titleZoneStyle = computed(() => ({
  left: `${config.value.titlePosition.x}px`,
  top: `${config.value.titlePosition.y}px`,
  fontSize: `${titleFontSize.value}px`,
  color: titleFontColor.value,
}))

const powerZoneStyle = computed(() => ({
  left: `${config.value.powerPosition.x}px`,
  top: `${config.value.powerPosition.y}px`,
}))

const powerIconStyle = computed(() => ({
  color: isOn.value ? powerActiveColor.value : powerIconColor.value,
  fontSize: `${powerIconSize.value}px`,
}))

const modeZoneStyle = computed(() => ({
  left: `${config.value.modePosition.x}px`,
  top: `${config.value.modePosition.y}px`,
}))

const fanZoneStyle = computed(() => ({
  left: `${config.value.fanSpeedPosition.x}px`,
  top: `${config.value.fanSpeedPosition.y}px`,
}))

const gaugeZoneStyle = computed(() => ({
  left: `${config.value.gaugePosition.x}px`,
  top: `${config.value.gaugePosition.y}px`,
  width: `${gaugeSize.value}px`,
  height: `${gaugeSize.value}px`,
  '--gauge-track-color': gaugeTrackColor.value,
  '--gauge-track-fill': hasGradient.value ? `url(#${gradientId.value})` : gaugeFillColor.value,
}))

const currentZoneStyle = computed(() => ({
  left: `${config.value.currentValuePosition.x}px`,
  top: `${config.value.currentValuePosition.y}px`,
}))
</script>

<style scoped>
.ac-controller-2 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

.zone {
  position: absolute;
  pointer-events: auto;
}

/* 标题 */
.zone-title {
  font-weight: bold;
  line-height: 1;
  white-space: nowrap;
}

/* 电源开关 */
.zone-power {
  cursor: pointer;
  transition: opacity 0.2s;
}

.power-icon {
  transition: color 0.2s;
}

.power-icon.disabled {
  opacity: 0.4;
}

/* 单图标（模式/风速）—— 直接显示图标，无外层圆边框 */
.zone-icon-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.zone-icon-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

/* 仪表盘 */
.zone-gauge {
  display: flex;
  align-items: center;
  justify-content: center;
}

.zone-gauge :deep(.el-progress-circle__track) {
  stroke: var(--gauge-track-color);
}

.zone-gauge :deep(.el-progress-circle__path) {
  stroke: var(--gauge-track-fill, #00d4ff) !important;
}

.gauge-center {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1px;
}

.gauge-center.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.gauge-value-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gauge-value {
  line-height: 1;
  text-align: center;
}

.gauge-unit {
  line-height: 1;
  margin-top: 1px;
}

.gauge-btn {
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.gauge-btn:hover:not(.disabled) {
  opacity: 1;
}

.gauge-btn.disabled {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}

/* 当前值 */
.zone-current {
  display: flex;
  justify-content: center;
  width: 100%;
  text-align: center;
}

/* 渐变定义占位 */
.gauge-gradient-defs {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}
</style>
