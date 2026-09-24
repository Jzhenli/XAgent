<template>
  <div class="ac-controller" :style="containerStyle">
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
            <span class="gauge-unit" :style="gaugeUnitStyle">{{ gaugeUnit }}</span>
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

    <!-- 当前值（仪表盘下方） -->
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

    <!-- 模式按钮（4 个图标按钮横排） -->
    <div
      class="zone zone-mode"
      :style="modeZoneStyle"
    >
      <div
        v-for="mode in modeList"
        :key="mode.key"
        class="mode-item"
        :class="{ active: mode.isActive, disabled: !isOn }"
        @click.stop="handleWriteMode(mode)"
      >
        <div
          class="mode-icon-wrapper"
          :style="mode.wrapperStyle"
        >
          <Icon
            :name="mode.icon"
            :size="modeIconSize"
            type="mono-line"
            :color="{ normal: mode.isActive ? mode.activeIconColor : mode.iconColor }"
          />
        </div>
        <span class="mode-label" :style="mode.labelStyle">{{ mode.label }}</span>
      </div>
    </div>

    <!-- 风速按钮（4 个文字按钮横排） -->
    <div
      class="zone zone-fan"
      :style="fanZoneStyle"
    >
      <div
        v-for="fan in fanList"
        :key="fan.key"
        class="fan-item"
        :class="{ active: fan.isActive, disabled: !isOn }"
        :style="fan.itemStyle"
        @click.stop="handleWriteFan(fan)"
      >
        <span class="fan-label" :style="fan.labelStyle">{{ fan.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ArrowRight, SwitchButton } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { ScadaComponent, AcControllerComponentConfig, PointBinding } from '@/types/scada'
import { useScadaBinding } from '@/views/ScadaEditor/hooks'
import { usePointStore } from '@/stores/points'
import { ScadaPointReaderKey, type ScadaPointReader } from '@/utils/scadaPointReader'
import { inject } from 'vue'
import { Icon } from '@/icon/index'

const props = defineProps<{
  component: ScadaComponent
  editing?: boolean
}>()

const { t } = useI18n()
const pointStore = usePointStore()
const injectedReader = inject(ScadaPointReaderKey, null) as ScadaPointReader | null

const config = computed(() => props.component.config as AcControllerComponentConfig)
const bindings = computed(() => config.value.bindings)

// ═══════════════════════════════════════════════════════════════════════════════
// 5 个点位绑定 —— 每个独立 useScadaBinding
// ═══════════════════════════════════════════════════════════════════════════════

// 开关点位
const { currentValue: powerVal, writeValue: writePower } = useScadaBinding(
  computed<PointBinding | null>(() => bindings.value?.power ?? null),
  { transform: (v) => (typeof v === 'boolean' ? (v ? 1 : 0) : v) },
  computed(() => 1), // 默认开启
)
/** 电源是否开启：统一转为 boolean */
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

// 设定值点位（仪表盘显示）
const { currentValue: setpointVal, writeValue: writeSetpoint } = useScadaBinding(
  computed<PointBinding | null>(() => bindings.value?.setpoint ?? null),
  { transform: (v) => (typeof v === 'number' ? v : Number(v) || config.value.gaugeMin) },
  computed(() => (config.value.gaugeMin + config.value.gaugeMax) / 2),
)

// 当前值点位（只读显示）
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
const powerIconSize = computed(() => config.value.powerIconSize ?? 20)

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
const modeFontColor = computed(() => config.value.modeFontColor)
const modeActiveFontColor = computed(() => config.value.modeActiveFontColor)

const fanFontSize = computed(() => config.value.fanFontSize)
const fanBackgroundColor = computed(() => config.value.fanBackgroundColor)
const fanActiveBackgroundColor = computed(() => config.value.fanActiveBackgroundColor)
const fanFontColor = computed(() => config.value.fanFontColor)
const fanActiveFontColor = computed(() => config.value.fanActiveFontColor)

// ═══════════════════════════════════════════════════════════════════════════════
// 仪表盘
// ═══════════════════════════════════════════════════════════════════════════════

const setpointValue = computed(() => setpointVal.value ?? (gaugeMin.value + gaugeMax.value) / 2)

/** 将数值归一化为 0-100 百分比 */
const normalizePercentage = (value: number, minVal: number, maxVal: number): number => {
  const range = maxVal - minVal
  if (range <= 0) return 0
  return Math.min(100, Math.max(0, ((value - minVal) / range) * 100))
}

const gaugePercentage = computed(() =>
  normalizePercentage(setpointValue.value, gaugeMin.value, gaugeMax.value),
)

const gaugeSize = computed(() => config.value.gaugeSize ?? 130)

const gaugeValueStyle = computed(() => ({
  color: gaugeFontColor.value,
  fontSize: `${gaugeFontSize.value}px`,
  fontWeight: 'bold' as const,
}))

const gaugeUnitStyle = computed(() => ({
  color: gaugeFontColor.value,
  fontSize: `${Math.max(10, gaugeFontSize.value * 0.5)}px`,
  opacity: 0.8,
}))

/** 加减按钮图标字号：比仪表盘数值字号小 2 */
const gaugeBtnStyle = computed(() => ({
  fontSize: `${Math.max(8, gaugeFontSize.value - 2)}px`,
}))

const gaugeValue = computed(() => gaugeFillColor.value)
const gradientId = computed(() => `ac-controller-gradient-${props.component.id}`)
const isValidGradient = (gradient?: string[] | null): gradient is [string, string, string] =>
  Array.isArray(gradient) && gradient.length === 3 && gradient.every((c) => !!c)
const gradientColors = computed(() => {
  const gradient = config.value.gaugeFillGradient
  if (isValidGradient(gradient)) return gradient
  const fallback = gaugeFillColor.value
  return [fallback, fallback, fallback] as [string, string, string]
})
const hasGradient = computed(() => isValidGradient(config.value.gaugeFillGradient))

/** el-progress 颜色：渐变则用 CSS var，否则单色 */
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
// 模式按钮列表
// ═══════════════════════════════════════════════════════════════════════════════

interface ModeItem {
  key: string
  label: string
  icon: string
  value: number | string
  isActive: boolean
  iconColor: string
  activeIconColor: string
  wrapperStyle: {
    width: string
    height: string
    backgroundColor: string
    borderColor: string
  }
  labelStyle: { color: string; fontSize: string }
}

const modeList = computed<ModeItem[]>(() => {
  const currVal = modeVal.value
  const size = modeIconSize.value

  const buildMode = (key: string, label: string, icon: string, value: number | string): ModeItem => {
    // eslint-disable-next-line eqeqeq
    const active = currVal != null && currVal == value
    return {
      key,
      label,
      icon,
      value,
      isActive: active,
      iconColor: modeIconColor.value,
      activeIconColor: modeActiveIconColor.value,
      wrapperStyle: {
        width: `${size + 20}px`,
        height: `${size + 20}px`,
        backgroundColor: active ? 'rgba(0, 212, 255, 0.1)' : 'rgba(255, 255, 255, 0)',
        borderColor: active ? modeActiveIconColor.value : modeIconColor.value,
      },
      labelStyle: {
        color: active ? modeActiveFontColor.value : modeFontColor.value,
        fontSize: `${Math.max(10, size * 0.55)}px`,
      },
    }
  }

  return [
    buildMode('auto', t('scadaComponents.acModeAuto'), 'auto', config.value.modeAutoValue),
    buildMode('cool', t('scadaComponents.acModeCool'), 'snow', config.value.modeCoolValue),
    buildMode('heat', t('scadaComponents.acModeHeat'), 'sun', config.value.modeHeatValue),
    buildMode('fan', t('scadaComponents.acModeFan'), 'fan2', config.value.modeFanValue),
  ]
})

// ═══════════════════════════════════════════════════════════════════════════════
// 风速按钮列表
// ═══════════════════════════════════════════════════════════════════════════════

interface FanItem {
  key: string
  label: string
  value: number | string
  isActive: boolean
  itemStyle: { backgroundColor: string; borderRadius: string }
  labelStyle: { color: string; fontSize: string }
}

const fanList = computed<FanItem[]>(() => {
  const currVal = fanVal.value
  const fontSize = fanFontSize.value

  const buildFan = (key: string, label: string, value: number | string): FanItem => {
    // eslint-disable-next-line eqeqeq
    const active = currVal != null && currVal == value
    return {
      key,
      label,
      value,
      isActive: active,
      itemStyle: {
        backgroundColor: active ? fanActiveBackgroundColor.value : fanBackgroundColor.value,
        borderRadius: '6px',
      },
      labelStyle: {
        color: active ? fanActiveFontColor.value : fanFontColor.value,
        fontSize: `${fontSize}px`,
      },
    }
  }

  return [
    buildFan('auto', t('scadaComponents.acFanSpeedAuto'), config.value.fanAutoValue),
    buildFan('low', t('scadaComponents.acFanSpeedLow'), config.value.fanLowValue),
    buildFan('medium', t('scadaComponents.acFanSpeedMedium'), config.value.fanMediumValue),
    buildFan('high', t('scadaComponents.acFanSpeedHigh'), config.value.fanHighValue),
  ]
})

// ═══════════════════════════════════════════════════════════════════════════════
// 电源开关 — 向点位写入值
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
      (e instanceof Error ? e.message : t('common.operationFailed'))
    ElMessage.error(detail)
  } finally {
    writing.value = false
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 仪表盘加减按钮 — 写入设定值
// ═══════════════════════════════════════════════════════════════════════════════

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
      (e instanceof Error ? e.message : t('common.operationFailed'))
    ElMessage.error(detail)
  } finally {
    writing.value = false
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 模式按钮 — 写入模式值
// ═══════════════════════════════════════════════════════════════════════════════

const handleWriteMode = async (mode: ModeItem) => {
  if (!isOn.value || props.editing || writing.value) return
  if (!bindings.value?.mode) {
    modeVal.value = mode.value
    return
  }
  writing.value = true
  try {
    const res = await writeModeBinding(mode.value)
    if (!res.success) ElMessage.error(res.message)
  } catch (e: unknown) {
    const detail =
      (e as any)?.response?.data?.detail ||
      (e instanceof Error ? e.message : t('common.operationFailed'))
    ElMessage.error(detail)
  } finally {
    writing.value = false
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 风速按钮 — 写入风速值
// ═══════════════════════════════════════════════════════════════════════════════

const handleWriteFan = async (fan: FanItem) => {
  if (!isOn.value || props.editing || writing.value) return
  if (!bindings.value?.fanSpeed) {
    fanVal.value = fan.value
    return
  }
  writing.value = true
  try {
    const res = await writeFanBinding(fan.value)
    if (!res.success) ElMessage.error(res.message)
  } catch (e: unknown) {
    const detail =
      (e as any)?.response?.data?.detail ||
      (e instanceof Error ? e.message : t('common.operationFailed'))
    ElMessage.error(detail)
  } finally {
    writing.value = false
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 区域样式（位置 + 颜色）
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

const modeZoneStyle = computed(() => ({
  left: `${config.value.modePosition.x}px`,
  right: `${config.value.modePosition.x}px`,
  top: `${config.value.modePosition.y}px`,
}))

const fanZoneStyle = computed(() => ({
  left: `${config.value.fanSpeedPosition.x}px`,
  right: `${config.value.fanSpeedPosition.x}px`,
  top: `${config.value.fanSpeedPosition.y}px`,
}))
</script>

<style scoped>
.ac-controller {
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
  gap: 2px;
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
  margin-top: 2px;
}

.gauge-btn {
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
  font-size: 14px;
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

/* 模式按钮 */
.zone-mode {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}

.mode-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.mode-item.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.mode-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid;
  transition: border-color 0.2s, background-color 0.2s;
  margin-bottom: 4px;
}

.mode-label {
  line-height: 1;
  white-space: nowrap;
}

/* 风速按钮 */
.zone-fan {
  display: flex;
  gap: 4px;
  align-items: stretch;
  justify-content: space-between;
}

.fan-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 4px 0;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;
}

.fan-item.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.fan-item:hover:not(.disabled) {
  opacity: 0.85;
}

.fan-label {
  line-height: 1;
  white-space: nowrap;
}

/* 渐变定义占位 */
.gauge-gradient-defs {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}
</style>
