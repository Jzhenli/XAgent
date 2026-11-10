<template>
  <div class="ac3-root">
  <div
    class="ac3-wrapper ac3-card"
    :class="{ 'is-on': isOn }"
    :style="wrapperCardStyle"
    @click.stop="handleBtnClick"
  >
    <!-- 顶部：左标题 + 右动态模式图标 -->
    <div class="ac3-card-header">
      <span class="ac3-card-title" :style="cardTitleStyle">{{ cardTitle }}</span>
      <Icon
        :name="isOn ? currentModeIcon : 'power-off'"
        :size="22"
        type="mono-line"
        :color="{ normal: isOn ? activeAccentColor : cardTitleColor }"
      />
    </div>

    <!-- 底部：当前温度（大数值）+ 单位 -->
    <div class="ac3-card-body">
      <span class="ac3-card-value" :style="cardValueStyle">{{ isOn ? currentValueDisplay : '--' }}</span>
      <span class="ac3-card-unit" :style="cardUnitStyle">{{ isOn ? gaugeUnit : '' }}</span>
    </div>
  </div>

    <!-- 弹框：Teleport 到 body（避免找不到 .canvas-wrapper target），
         overlay 用 position:fixed + 动态计算 canvas-wrapper rect，只覆盖画布区域 -->
    <Teleport v-if="dialogVisible" to="body">
      <div class="ac3-overlay" :style="overlayRectStyle" @click.self="dialogVisible = false">
        <div
          class="ac3-dialog-inner"
          :style="{ ...dialogInnerStyle, width: `${dialogWidth}px` }"
          @click.stop
        >
          <!-- 标题栏 -->
          <div class="ac3-dialog-header">
            <div class="ac3-dialog-title">
              <span class="main">{{ dialogTitle }}</span>
              <span v-if="dialogSubtitle" class="sub">{{ dialogSubtitle }}</span>
            </div>
            <div class="ac3-dialog-close" @click="dialogVisible = false">
              <el-icon><Close /></el-icon>
            </div>
          </div>

          <!-- 蓝色渐变主区域 -->
          <div class="ac3-main-area" :style="mainAreaStyle">
            <!-- 电源按钮 -->
            <div
              class="ac3-power-btn"
              :class="{ on: isOn }"
              :style="powerBtnStyle"
              @click="togglePower"
            >
              <el-icon><SwitchButton /></el-icon>
            </div>

            <!-- 中部内容（设定温度 + 当前温度）：absolute 居中 -->
            <div class="ac3-center-content">
              <div class="ac3-temp-display">
                <span class="temp-value" :style="tempFontStyle">{{ setpointValue }}</span>
                <span class="temp-unit">{{ gaugeUnit }}</span>
              </div>
              <div class="ac3-current-value">
                {{ currentValueLabel }}{{ currentValueDisplay }}{{ gaugeUnit }}
              </div>
            </div>

            <!-- 加减按钮：胶囊拼合 -->
            <div class="ac3-adjust-btns" :class="{ disabled: !isOn }">
              <div class="ac3-adj-btn left" @click="decrementSetpoint">−</div>
              <div class="ac3-adj-btn right" @click="incrementSetpoint">+</div>
            </div>
          </div>

          <!-- 模式选择 -->
          <div class="ac3-section">
            <div class="ac3-section-label">{{ config.modeSectionTitle }}</div>
            <div class="ac3-mode-grid">
              <div
                v-for="m in modeList"
                :key="m.key"
                class="ac3-mode-item"
                :class="{ active: m.isActive, disabled: !isOn }"
                :style="modeItemStyle"
                @click="handleWriteMode(m)"
              >
                <Icon
                  :name="m.icon"
                  :size="22"
                  type="mono-line"
                  :color="{ normal: m.isActive ? modeActiveIconColor : modeIconColor }"
                />
                <span class="mode-label">{{ m.label }}</span>
              </div>
            </div>
          </div>

          <!-- 风速选择 -->
          <div class="ac3-section" style="padding-top: 8px;">
            <div class="ac3-section-label">{{ config.fanSectionTitle }}</div>
            <div class="ac3-fan-grid">
              <div
                v-for="f in fanList"
                :key="f.key"
                class="ac3-fan-item"
                :class="{ active: f.isActive, disabled: !isOn, 'has-icon': !!f.icon }"
                :style="fanItemStyle"
                @click="handleWriteFan(f)"
              >
                <Icon
                  v-if="f.icon"
                  :name="f.icon"
                  :size="22"
                  type="mono-line"
                  :color="{ normal: f.isActive ? fanActiveIconColor : fanIconColor }"
                />
                <div v-else class="ac3-fan-bars">
                  <span v-for="i in f.barCount" :key="i" class="fan-bar" />
                </div>
                <span class="fan-label">{{ f.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Close, SwitchButton } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { ScadaComponent, AcController3ComponentConfig, PointBinding } from '@/views/ScadaEditor/types'
import { useScadaBinding } from '@/views/ScadaEditor/hooks'
import { useScadaConfig } from '@/views/ScadaEditor/hooks/useScadaEditor'
import { ScadaPointReaderKey, type ScadaPointReader } from '@/utils/scadaPointReader'
import { inject } from 'vue'
import { Icon } from '@/icon/index'

const props = defineProps<{
  component: ScadaComponent
  editing?: boolean
}>()

const { t } = useI18n()
const injectedReader = inject(ScadaPointReaderKey, null) as ScadaPointReader | null

const config = computed(() => props.component.config as AcController3ComponentConfig)
const bindings = computed(() => config.value.bindings)

// 编辑模式下通过配置开关实时控制弹框显隐
const { updateConfig } = useScadaConfig(
  props.component as ScadaComponent<'ac-controller-3'>,
)
const _dialogVisible = ref(false)

/**
 * 弹框可见性：
 * - 编辑模式：直接由 config.editModeOpenDialog 双向驱动（ConfigPanel 开关实时生效）
 * - 预览模式：由内部 ref 控制（点击按钮打开）
 */
const dialogVisible = computed<boolean>({
  get() {
    return props.editing ? !!config.value.editModeOpenDialog : _dialogVisible.value
  },
  set(val: boolean) {
    if (props.editing) {
      updateConfig('editModeOpenDialog', val)
    } else {
      _dialogVisible.value = val
    }
  },
})

// ═══════════════════════════════════════════════════════════════════════════════
// 点位绑定（复用 ac-controller 的 5 个 useScadaBinding）
// ═══════════════════════════════════════════════════════════════════════════════

// 开关
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

// 模式
const { currentValue: modeVal, writeValue: writeModeBinding } = useScadaBinding(
  computed<PointBinding | null>(() => bindings.value?.mode ?? null),
  {},
  computed(() => {
    const c = config.value
    if (c.modeAutoVisible) return c.modeAutoValue
    if (c.modeCoolVisible) return c.modeCoolValue
    if (c.modeHeatVisible) return c.modeHeatValue
    return c.modeFanValue
  }),
)

// 风速
const { currentValue: fanVal, writeValue: writeFanBinding } = useScadaBinding(
  computed<PointBinding | null>(() => bindings.value?.fanSpeed ?? null),
  {},
  computed(() => {
    const c = config.value
    if (c.fanAutoVisible) return c.fanAutoValue
    if (c.fanLowVisible) return c.fanLowValue
    if (c.fanMediumVisible) return c.fanMediumValue
    return c.fanHighValue
  }),
)

// 设定值
const { currentValue: setpointVal, writeValue: writeSetpoint } = useScadaBinding(
  computed<PointBinding | null>(() => bindings.value?.setpoint ?? null),
  { transform: (v) => (typeof v === 'number' ? v : Number(v) || config.value.gaugeMin) },
  computed(() => (config.value.gaugeMin + config.value.gaugeMax) / 2),
)

// 当前值（只读）
const { currentValue: currentVal } = useScadaBinding(
  computed<PointBinding | null>(() => bindings.value?.currentValue ?? null),
  { transform: (v) => (typeof v === 'number' ? v : Number(v) || 0) },
  computed(() => 25),
)

// ═══════════════════════════════════════════════════════════════════════════════
// 基础样式配置
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// 画布卡片样式（替换旧按钮样式）
// ═══════════════════════════════════════════════════════════════════════════════

const cardTitle = computed(() => config.value.cardTitle)
const cardTitleFontSize = computed(() => config.value.cardTitleFontSize)
const cardValueFontSize = computed(() => config.value.cardValueFontSize)
const cardUnitFontSize = computed(() => config.value.cardUnitFontSize)
const cardBackgroundColor = computed(() => config.value.cardBackgroundColor)
const cardTitleColor = computed(() => config.value.cardTitleColor)
const activeAccentColor = computed(() => config.value.activeAccentColor)
const cardBorderRadius = computed(() => config.value.cardBorderRadius)

// wrapper 卡片样式（背景色始终用用户配置，开机态靠 box-shadow 体现状态）
const wrapperCardStyle = computed(() => ({
  width: `${config.value.width}px`,
  height: `${config.value.height}px`,
  backgroundColor: cardBackgroundColor.value,    // 始终用用户配的背景色
  borderRadius: `${cardBorderRadius.value}px`,
  border: '1px solid rgba(0,0,0,0.06)',
}))

// 标题样式（颜色始终用用户配置）
const cardTitleStyle = computed(() => ({
  fontSize: `${cardTitleFontSize.value}px`,
  color: cardTitleColor.value,                    // 始终用用户配的标题色
}))

// 数值样式（始终用强调色）
const cardValueStyle = computed(() => ({
  fontSize: `${cardValueFontSize.value}px`,
  color: activeAccentColor.value,
}))

// 单位样式（始终用强调色，稍暗）
const cardUnitStyle = computed(() => ({
  fontSize: `${cardUnitFontSize.value}px`,
  color: activeAccentColor.value,
}))

// 动态模式图标
const currentModeIcon = computed(() => {
  const v = modeVal.value
  const c = config.value
  // eslint-disable-next-line eqeqeq
  if (c.modeAutoVisible  && (v == c.modeAutoValue  || String(v) === String(c.modeAutoValue)))  return 'auto'
  // eslint-disable-next-line eqeqeq
  if (c.modeCoolVisible  && (v == c.modeCoolValue  || String(v) === String(c.modeCoolValue)))  return 'snow'
  // eslint-disable-next-line eqeqeq
  if (c.modeHeatVisible  && (v == c.modeHeatValue  || String(v) === String(c.modeHeatValue)))  return 'sun'
  // eslint-disable-next-line eqeqeq
  if (c.modeFanVisible   && (v == c.modeFanValue   || String(v) === String(c.modeFanValue)))   return 'fan2'
  return 'auto'
})

const dialogTitle = computed(() => config.value.dialogTitle)
const dialogSubtitle = computed(() => config.value.dialogSubtitle)
const dialogWidth = computed(() => config.value.dialogWidth)
const dialogBackgroundColor = computed(() => config.value.dialogBackgroundColor)
const dialogBorderRadius = computed(() => config.value.dialogBorderRadius)

const mainAreaGradient = computed(() => config.value.mainAreaGradient)
const mainAreaGradientAngle = computed(() => config.value.mainAreaGradientAngle)
const mainAreaFontSize = computed(() => config.value.mainAreaFontSize)
const mainAreaTextColor = computed(() => config.value.mainAreaTextColor)

const gaugeMin = computed(() => config.value.gaugeMin)
const gaugeMax = computed(() => config.value.gaugeMax)
const gaugeStep = computed(() => config.value.gaugeStep)
const gaugeUnit = computed(() => config.value.gaugeUnit)
const currentValueLabel = computed(() => config.value.currentValueLabel)

const powerButtonSize = computed(() => config.value.powerButtonSize)
const powerButtonOnColor = computed(() => config.value.powerButtonOnColor)
const powerButtonOffColor = computed(() => config.value.powerButtonOffColor)

const modeIconColor = computed(() => config.value.modeIconColor)
const modeActiveIconColor = computed(() => config.value.modeActiveIconColor)
const modeBackgroundColor = computed(() => config.value.modeBackgroundColor ?? 'rgba(255, 255, 255, 0.08)')
const modeActiveBackgroundColor = computed(() => config.value.modeActiveBackgroundColor)
const modeFontColor = computed(() => config.value.modeFontColor)
const modeActiveFontColor = computed(() => config.value.modeActiveFontColor)

const fanBackgroundColor = computed(() => config.value.fanBackgroundColor)
const fanActiveBackgroundColor = computed(() => config.value.fanActiveBackgroundColor)
const fanIconColor = computed(() => config.value.fanIconColor)
const fanActiveIconColor = computed(() => config.value.fanActiveIconColor)
const fanFontColor = computed(() => config.value.fanFontColor)
const fanActiveFontColor = computed(() => config.value.fanActiveFontColor)

// ═══════════════════════════════════════════════════════════════════════════════
// 弹框可见性（已在上方 computed 中定义，卡片点击仅在预览模式生效）
// ═══════════════════════════════════════════════════════════════════════════════

const handleBtnClick = () => {
  if (props.editing) return   // 编辑模式下由配置开关直接控制，不响应点击
  dialogVisible.value = true
}

// ═══════════════════════════════════════════════════════════════════════════════
// 弹框内部样式
// ═══════════════════════════════════════════════════════════════════════════════

const dialogInnerStyle = computed(() => ({
  backgroundColor: dialogBackgroundColor.value,
  borderRadius: `${dialogBorderRadius.value}px`,
}))

// 弹框遮罩层：position: fixed + 动态计算画布容器 bounding rect
// 这样弹框只覆盖画布区域，不覆盖侧边栏
const canvasRect = ref({ top: 0, left: 0, width: 0, height: 0 })

function updateCanvasRect() {
  // 按优先级匹配容器：编辑页 canvas-wrapper → 预览页 preview-content → 兜底 body
  const el =
    document.querySelector<HTMLElement>('.canvas-wrapper') ??
    document.querySelector<HTMLElement>('.preview-content') ??
    document.querySelector<HTMLElement>('.scada-page') ??
    document.body
  if (el) {
    const r = el.getBoundingClientRect()
    canvasRect.value = { top: r.top, left: r.left, width: r.width, height: r.height }
  }
}

// 重试版：容器可能还没挂载，延迟重试几次
function retryUpdateCanvasRect(retries = 3, delay = 60) {
  updateCanvasRect()
  if (retries > 0 && canvasRect.value.width === 0) {
    setTimeout(() => retryUpdateCanvasRect(retries - 1, delay), delay)
  }
}

const overlayRectStyle = computed(() => ({
  position: 'fixed' as const,
  top: `${canvasRect.value.top}px`,
  left: `${canvasRect.value.left}px`,
  width: `${canvasRect.value.width}px`,
  height: `${canvasRect.value.height}px`,
  zIndex: 9999,
}))

onMounted(() => {
  nextTick(() => retryUpdateCanvasRect())
  window.addEventListener('resize', updateCanvasRect)
  window.addEventListener('scroll', updateCanvasRect, true)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateCanvasRect)
  window.removeEventListener('scroll', updateCanvasRect, true)
})

// 弹框打开时（dialogVisible 变 true）强制重算画布容器位置（带重试）
watch(dialogVisible, (val) => {
  if (val) nextTick(() => retryUpdateCanvasRect())
})

const mainAreaStyle = computed(() => {
  const [c1, c2] = mainAreaGradient.value
  const angle = mainAreaGradientAngle.value
  return {
    background: `linear-gradient(${angle}deg, ${c1}, ${c2})`,
  }
})

const tempFontStyle = computed(() => ({
  fontSize: `${mainAreaFontSize.value}px`,
  color: mainAreaTextColor.value,
}))

const powerBtnStyle = computed(() => ({
  width: `${powerButtonSize.value}px`,
  height: `${powerButtonSize.value}px`,
}))

const modeItemStyle = computed(() => ({
  '--mode-bg': modeBackgroundColor.value,
  '--mode-active-bg': modeActiveBackgroundColor.value,
  '--mode-active-fg': modeActiveFontColor.value,
  '--mode-fg': modeFontColor.value,
}))

const fanItemStyle = computed(() => ({
  '--fan-bg': fanBackgroundColor.value,
  '--fan-active-bg': fanActiveBackgroundColor.value,
  '--fan-active-fg': fanActiveFontColor.value,
  '--fan-fg': fanFontColor.value,
  '--fan-bar-off': fanIconColor.value,
  '--fan-bar-on': fanActiveIconColor.value,
}))

// ═══════════════════════════════════════════════════════════════════════════════
// 数值格式化
// ═══════════════════════════════════════════════════════════════════════════════

const setpointValue = computed(() => {
  const v = setpointVal.value
  const dp = config.value.cardValueDecimalPlaces ?? 0
  if (typeof v === 'number') return dp > 0 ? v.toFixed(dp) : String(Math.round(v))
  return `${config.value.gaugeMin}`
})

const currentValueDisplay = computed(() => {
  const v = currentVal.value
  const dp = config.value.cardValueDecimalPlaces ?? 0
  if (typeof v === 'number') return dp > 0 ? v.toFixed(dp) : String(Math.round(v))
  return '25'
})

// ═══════════════════════════════════════════════════════════════════════════════
// 模式按钮列表
// ═══════════════════════════════════════════════════════════════════════════════

interface ModeItem {
  key: string
  label: string
  icon: string
  value: number | string
  isActive: boolean
}

const modeList = computed<ModeItem[]>(() => {
  const currVal = modeVal.value
  const build = (visible: boolean, key: string, label: string, icon: string, value: number | string): ModeItem | null => {
    if (!visible) return null
    // eslint-disable-next-line eqeqeq
    const active = currVal != null && (currVal == value || String(currVal) === String(value))
    return { key, label, icon, value, isActive: active }
  }
  return [
    build(config.value.modeAutoVisible,  'auto',  config.value.modeAutoLabel,  'auto',  config.value.modeAutoValue),
    build(config.value.modeCoolVisible,  'cool',  config.value.modeCoolLabel,  'snow',  config.value.modeCoolValue),
    build(config.value.modeHeatVisible,  'heat',  config.value.modeHeatLabel,  'sun',   config.value.modeHeatValue),
    build(config.value.modeFanVisible,   'fan',   config.value.modeFanLabel,   'fanSpeed3',  config.value.modeFanValue),
  ].filter((x): x is ModeItem => x !== null)
})

// ═══════════════════════════════════════════════════════════════════════════════
// 风速按钮列表
// ═══════════════════════════════════════════════════════════════════════════════

interface FanItem {
  key: string
  label: string
  value: number | string
  isActive: boolean
  barCount: number
  icon?: string
}

const fanList = computed<FanItem[]>(() => {
  const currVal = fanVal.value
  const build = (
    visible: boolean,
    key: string,
    label: string,
    value: number | string,
    barCount: number,
    icon?: string,
  ): FanItem | null => {
    if (!visible) return null
    // eslint-disable-next-line eqeqeq
    const active = currVal != null && (currVal == value || String(currVal) === String(value))
    return { key, label, value, isActive: active, barCount, icon }
  }
  return [
    build(config.value.fanAutoVisible,    'auto',   config.value.fanAutoLabel,    config.value.fanAutoValue,    3, 'auto'),
    build(config.value.fanLowVisible,     'low',    config.value.fanLowLabel,     config.value.fanLowValue,     1),
    build(config.value.fanMediumVisible,   'medium', config.value.fanMediumLabel,  config.value.fanMediumValue,  2),
    build(config.value.fanHighVisible,    'high',   config.value.fanHighLabel,    config.value.fanHighValue,    3),
  ].filter((x): x is FanItem => x !== null)
})

// ═══════════════════════════════════════════════════════════════════════════════
// 写入逻辑（与 ac-controller 相同模式）
// ═══════════════════════════════════════════════════════════════════════════════

const writing = ref(false)

const handleApiError = (e: unknown) => {
  const detail =
    (e as any)?.response?.data?.detail ||
    (e instanceof Error ? e.message : t('common.operationFailed'))
  ElMessage.error(detail)
}

// 电源开关
const togglePower = async () => {
  if (writing.value) return
  const target = isOn.value ? 0 : 1
  if (!bindings.value?.power) {
    powerVal.value = target
    return
  }
  writing.value = true
  try {
    const res = await writePower(target)
    if (!res.success) ElMessage.error(res.message)
  } catch (e) {
    handleApiError(e)
  } finally {
    writing.value = false
  }
}

// 温度加减
const clamp = (v: number) => Math.min(gaugeMax.value, Math.max(gaugeMin.value, v))

const incrementSetpoint = async () => {
  if (!isOn.value || writing.value) return
  const raw = Number(setpointVal.value) || gaugeMin.value
  const next = clamp(raw + gaugeStep.value)
  await writeSetpointValue(next)
}

const decrementSetpoint = async () => {
  if (!isOn.value || writing.value) return
  const raw = Number(setpointVal.value) || gaugeMin.value
  const next = clamp(raw - gaugeStep.value)
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
  } catch (e) {
    handleApiError(e)
  } finally {
    writing.value = false
  }
}

// 模式写入
const handleWriteMode = async (m: ModeItem) => {
  if (!isOn.value || writing.value) return
  if (!bindings.value?.mode) {
    modeVal.value = m.value
    return
  }
  writing.value = true
  try {
    const res = await writeModeBinding(m.value)
    if (!res.success) ElMessage.error(res.message)
  } catch (e) {
    handleApiError(e)
  } finally {
    writing.value = false
  }
}

// 风速写入
const handleWriteFan = async (f: FanItem) => {
  if (!isOn.value || writing.value) return
  if (!bindings.value?.fanSpeed) {
    fanVal.value = f.value
    return
  }
  writing.value = true
  try {
    const res = await writeFanBinding(f.value)
    if (!res.success) ElMessage.error(res.message)
  } catch (e) {
    handleApiError(e)
  } finally {
    writing.value = false
  }
}
</script>

<style scoped>
/* 画布卡片：info-card 风格 */
.ac3-wrapper.ac3-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(4px);
  transition: box-shadow 0.2s, transform 0.1s, background-color 0.3s;
  user-select: none;
}
.ac3-wrapper.ac3-card:hover { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12); }
.ac3-wrapper.ac3-card:active { transform: scale(0.98); }
.ac3-wrapper.ac3-card.is-on  { box-shadow: 0 2px 14px rgba(102, 126, 234, 0.25); }

.ac3-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
}
.ac3-card-title {
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60%;
}
.ac3-card-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  flex-shrink: 0;
}
.ac3-card-value {
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.5px;
}
.ac3-card-unit {
  font-weight: 400;
  line-height: 1.2;
  padding-top: 3px;
  opacity: 0.75;
}

/* 遮罩层：position:fixed 由内联 style 动态设置（覆盖画布容器） */
.ac3-overlay {
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
  /* 确保不被画布滚动条裁掉 */
  overflow: auto;
}

/* 弹框内容 */
.ac3-dialog-inner {
  padding: 0;
  overflow: hidden;
  color: #fff;
  flex-shrink: 0;
  max-width: calc(100% - 32px);
  margin: auto;
}

/* 标题栏 */
.ac3-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  background: transparent;
}

.ac3-dialog-title {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.ac3-dialog-title .main {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

.ac3-dialog-title .sub {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.ac3-dialog-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.08);
  transition: background 0.2s, color 0.2s;
}

.ac3-dialog-close:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

/* 蓝色渐变主区域 */
.ac3-main-area {
  position: relative;
  margin: 0 20px;
  border-radius: 12px;
  padding: 0;
  min-height: 200px;
  display: block;
}

/* 电源按钮：absolute 右上角，44×44 大尺寸 */
.ac3-power-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ffffff;
  z-index: 2;
  transition: background 0.2s;
}

.ac3-power-btn .el-icon {
  font-size: 22px;
}

.ac3-power-btn.on {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.4);
}

/* 中部内容：absolute 居中 */
.ac3-center-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 1;
}

.ac3-temp-display {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  line-height: 1;
}

.ac3-temp-display .temp-value {
  font-weight: 700;
  letter-spacing: -1px;
}

.ac3-temp-display .temp-unit {
  font-size: 20px;
  opacity: 0.85;
  padding-bottom: 6px;
}

.ac3-current-value {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
}

/* 加减按钮：胶囊拼合，gap 3px */
.ac3-adjust-btns {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2px;
  z-index: 2;
}

.ac3-adjust-btns.disabled {
  opacity: 0.4;
  pointer-events: none;
}

.ac3-adj-btn {
  width: 76px;
  height: 44px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s, transform 0.1s;
}

.ac3-adj-btn.left {
  border-radius: 22px 0 0 22px;
}

.ac3-adj-btn.right {
  border-radius: 0 22px 22px 0;
}

.ac3-adj-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.ac3-adj-btn:active {
  transform: scale(0.94);
}

/* Section 通用 */
.ac3-section {
  padding: 16px 20px 8px;
}

.ac3-section-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 10px;
  padding-left: 4px;
}

/* 模式 */
.ac3-mode-grid {
  display: flex;
  gap: 10px;
}

.ac3-mode-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 4px;
  border-radius: 10px;
  cursor: pointer;
  background: var(--mode-bg);
  transition: background 0.2s;
}

.ac3-mode-item.active {
  background: var(--mode-active-bg);
}

.ac3-mode-item.disabled {
  opacity: 0.4;
  pointer-events: none;
}

.ac3-mode-item .mode-label {
  font-size: 12px;
  color: var(--mode-fg);
  line-height: 1;
  white-space: nowrap;
}

.ac3-mode-item.active .mode-label {
  color: var(--mode-active-fg);
}

/* 风速 */
.ac3-fan-grid {
  display: flex;
  gap: 10px;
}

.ac3-fan-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 4px;
  border-radius: 10px;
  cursor: pointer;
  background: var(--fan-bg);
  transition: background 0.2s;
}

.ac3-fan-item.active {
  background: var(--fan-active-bg);
}

.ac3-fan-item.disabled {
  opacity: 0.4;
  pointer-events: none;
}

.ac3-fan-bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 20px;
}

.ac3-fan-bars .fan-bar {
  width: 3px;
  background: var(--fan-bar-off);
  border-radius: 1px;
  transition: background 0.2s;
}

.ac3-fan-item:nth-child(2) .ac3-fan-bars .fan-bar:nth-child(1) { height: 10px; }
.ac3-fan-item:nth-child(2) .ac3-fan-bars .fan-bar:nth-child(2) { height: 0; display: none; }
.ac3-fan-item:nth-child(2) .ac3-fan-bars .fan-bar:nth-child(3) { height: 0; display: none; }

.ac3-fan-item:nth-child(3) .ac3-fan-bars .fan-bar:nth-child(1) { height: 6px; }
.ac3-fan-item:nth-child(3) .ac3-fan-bars .fan-bar:nth-child(2) { height: 14px; }
.ac3-fan-item:nth-child(3) .ac3-fan-bars .fan-bar:nth-child(3) { height: 0; display: none; }

.ac3-fan-item:nth-child(1) .ac3-fan-bars .fan-bar:nth-child(1) { height: 6px; }
.ac3-fan-item:nth-child(1) .ac3-fan-bars .fan-bar:nth-child(2) { height: 10px; }
.ac3-fan-item:nth-child(1) .ac3-fan-bars .fan-bar:nth-child(3) { height: 16px; }

.ac3-fan-item:nth-child(4) .ac3-fan-bars .fan-bar:nth-child(1) { height: 6px; }
.ac3-fan-item:nth-child(4) .ac3-fan-bars .fan-bar:nth-child(2) { height: 12px; }
.ac3-fan-item:nth-child(4) .ac3-fan-bars .fan-bar:nth-child(3) { height: 18px; }

.ac3-fan-item.active .ac3-fan-bars .fan-bar {
  background: var(--fan-bar-on);
}

.ac3-fan-item .fan-label {
  font-size: 12px;
  color: var(--fan-fg);
  line-height: 1;
  white-space: nowrap;
}

.ac3-fan-item.active .fan-label {
  color: var(--fan-active-fg);
}
</style>

