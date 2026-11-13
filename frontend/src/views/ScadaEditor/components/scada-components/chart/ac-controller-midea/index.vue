<template>
  <div class="acm-root">
    <div
      class="acm-wrapper acm-card"
      :class="{ 'is-on': isOn }"
      :style="wrapperCardStyle"
      @click.stop="handleBtnClick"
    >
      <!-- 顶部：左标题 + 右动态模式图标 -->
      <div class="acm-card-header">
        <span class="acm-card-title" :style="cardTitleStyle">{{ cardTitle }}</span>
        <Icon
          :name="isOn ? currentModeIcon : 'power-off'"
          :size="config.cardIconSize"
          type="mono-line"
          :color="{ normal: isOn ? activeAccentColor : cardTitleColor }"
        />
      </div>

      <!-- 底部：当前温度（大数值）+ 单位 -->
      <div class="acm-card-body">
        <span class="acm-card-value" :style="cardValueStyle">{{ isOn ? currentValueDisplay : '--' }}</span>
        <span class="acm-card-unit" :style="cardUnitStyle">{{ isOn ? gaugeUnit : '' }}</span>
      </div>
    </div>

    <!-- 弹框：Teleport 到 body -->
    <Teleport v-if="dialogVisible" to="body">
      <div class="acm-overlay" :style="overlayRectStyle" @click.self="dialogVisible = false">
        <div
          class="acm-dialog-inner"
          :style="{ ...dialogInnerStyle, width: `${dialogWidth}px` }"
          @click.stop
        >
          <!-- 标题栏 -->
          <div class="acm-dialog-header">
            <div class="acm-dialog-title">
              <span class="main" :style="dialogTitleStyle">{{ dialogTitle }}</span>
              <span v-if="dialogSubtitle" class="sub" :style="dialogSubtitleStyle">{{ dialogSubtitle }}</span>
            </div>
            <div class="acm-dialog-close" @click="dialogVisible = false">
              <el-icon><Close /></el-icon>
            </div>
          </div>

          <!-- 蓝色渐变主区域 -->
          <div class="acm-main-area" :style="mainAreaStyle">
            <!-- 电源按钮 -->
            <div
              class="acm-power-btn"
              :class="{ on: isOn }"
              :style="[powerBtnStyle, powerBtnBgStyle]"
              @click="togglePower"
            >
              <el-icon><SwitchButton /></el-icon>
            </div>

            <!-- 中部内容：状态文字 + 设定温度 + 当前温度 -->
            <div class="acm-center-content">
              <div v-if="showMainAreaStatusText" class="acm-status-text" :style="statusTextStyle">
                模式：{{ statusModeText }}{{ statusModeText && statusFanText ? '  ' : '' }}风速：{{ statusFanText }}
              </div>
              <div class="acm-temp-display">
                <span class="temp-value" :style="tempFontStyle">{{ setpointValue }}</span>
                <span class="temp-unit" :style="gaugeUnitStyle">{{ gaugeUnit }}</span>
              </div>
              <div class="acm-current-value" :style="currentValueStyle">
                {{ currentValueLabel }}{{ currentValueDisplay }}{{ gaugeUnit }}
              </div>
            </div>

            <!-- 加减按钮：胶囊拼合 -->
            <div class="acm-adjust-btns" :class="{ disabled: !isOn }">
              <div class="acm-adj-btn left" :style="stepBtnStyle" @click="decrementSetpoint">−</div>
              <div class="acm-adj-btn right" :style="stepBtnStyle" @click="incrementSetpoint">+</div>
            </div>
          </div>

          <!-- 模式选择（5 按钮，支持双按钮同时高亮） -->
          <div class="acm-section">
            <div class="acm-section-label">{{ config.modeSectionTitle }}</div>
            <div class="acm-mode-grid">
              <div
                v-for="m in modeList"
                :key="m.key"
                class="acm-mode-item"
                :class="{ active: activeModeKeys.has(m.key), disabled: !isOn }"
                :style="modeItemStyle"
                @click="handleModeClick(m)"
              >
                <Icon
                  :name="m.icon"
                  :size="22"
                  type="mono-line"
                  :color="{ normal: activeModeKeys.has(m.key) ? modeActiveIconColor : modeIconColor }"
                />
                <span class="mode-label">{{ m.label }}</span>
              </div>
            </div>
          </div>

          <!-- 风速选择：左侧自动按钮 + 右侧 7 档滑块 -->
          <div class="acm-section acm-section-fan">
            <div class="acm-section-label">{{ config.fanSectionTitle }}</div>
            <div class="acm-fan-row">
              <!-- 自动按钮 -->
              <div
                v-if="showFanAuto"
                class="acm-fan-auto-btn"
                :class="{ active: isFanAuto, disabled: !isOn }"
                :style="fanItemStyle"
                @click="toggleFanAuto"
              >
                <Icon
                  :name="'auto'"
                  :size="22"
                  type="mono-line"
                  :color="{ normal: isFanAuto ? fanActiveIconColor : fanIconColor }"
                />
                <span class="fan-label">{{ config.fanAutoLabel }}</span>
              </div>

              <!-- 7 档滑块 -->
              <div class="acm-fan-slider" :class="{ disabled: !isOn }">
                <div class="acm-fan-slider-track" :style="sliderTrackStyle">
                  <div
                    class="acm-fan-slider-btn minus"
                    :class="{ disabled: activeFanLevelIndex <= 0 }"
                    @click.stop="decrementFanLevel"
                  >−</div>
                  <div class="acm-fan-levels">
                    <div
                      v-for="(level, idx) in visibleFanLevels"
                      :key="level.key"
                      class="acm-fan-level-block"
                      :class="{ active: idx === activeFanLevelIndex }"
                      :style="sliderBlockStyle(idx === activeFanLevelIndex)"
                      @click.stop="selectFanLevel(idx)"
                    />
                  </div>
                  <div
                    class="acm-fan-slider-btn plus"
                    :class="{ disabled: activeFanLevelIndex >= visibleFanLevels.length - 1 }"
                    @click.stop="incrementFanLevel"
                  >+</div>
                </div>
                <div class="acm-fan-slider-label" :style="sliderTextStyle">
                  {{ isFanAuto ? config.fanAutoLabel : (activeFanLevel?.label ?? `${fanVal.value}档`) }}
                </div>
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
import type {
  ScadaComponent,
  AcControllerMideaComponentConfig,
  PointBinding,
} from '@/views/ScadaEditor/types'
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

const config = computed(() => props.component.config as AcControllerMideaComponentConfig)
const bindings = computed(() => config.value.bindings)

// 编辑模式下通过配置开关实时控制弹框显隐
const { updateConfig } = useScadaConfig(
  props.component as ScadaComponent<'ac-controller-midea'>,
)
const _dialogVisible = ref(false)

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
// 点位绑定
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
  computed(() => config.value.modeCoolValue),
)

// 风速
const { currentValue: fanVal, writeValue: writeFanBinding } = useScadaBinding(
  computed<PointBinding | null>(() => bindings.value?.fanSpeed ?? null),
  {},
  computed(() => config.value.fanAutoValue),
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
// 画布卡片样式
// ═══════════════════════════════════════════════════════════════════════════════

const cardTitle = computed(() => config.value.cardTitle)
const cardTitleFontSize = computed(() => config.value.cardTitleFontSize)
const cardValueFontSize = computed(() => config.value.cardValueFontSize)
const cardUnitFontSize = computed(() => config.value.cardUnitFontSize)
const cardBackgroundColor = computed(() => config.value.cardBackgroundColor)
const cardTitleColor = computed(() => config.value.cardTitleColor)
const activeAccentColor = computed(() => config.value.activeAccentColor)
const cardBorderRadius = computed(() => config.value.cardBorderRadius)

const wrapperCardStyle = computed(() => ({
  width: `${config.value.width}px`,
  height: `${config.value.height}px`,
  backgroundColor: cardBackgroundColor.value,
  borderRadius: `${cardBorderRadius.value}px`,
  border: '1px solid rgba(0,0,0,0.06)',
}))

const cardTitleStyle = computed(() => ({
  fontSize: `${cardTitleFontSize.value}px`,
  color: cardTitleColor.value,
}))

const cardValueStyle = computed(() => ({
  fontSize: `${cardValueFontSize.value}px`,
  color: activeAccentColor.value,
}))

const cardUnitStyle = computed(() => ({
  fontSize: `${cardUnitFontSize.value}px`,
  color: activeAccentColor.value,
}))

// 动态模式图标
const currentModeIcon = computed(() => {
  const v = modeVal.value
  const c = config.value
  // eslint-disable-next-line eqeqeq
  if (v == c.modeAutoCoolValue || v == c.modeAutoCoolValue) return 'snow'
  // eslint-disable-next-line eqeqeq
  if (v == c.modeAutoHeatValue || v == c.modeHeatValue) return 'sun'
  // eslint-disable-next-line eqeqeq
  if (v == c.modeAutoDehumidifyValue || v == c.modeDehumidifyValue) return 'droplet'
  // eslint-disable-next-line eqeqeq
  if (v == c.modeAutoFanValue || v == c.modeFanValue) return 'fanSpeed3'
  // eslint-disable-next-line eqeqeq
  if (v == c.modeCoolValue) return 'snow'
  // eslint-disable-next-line eqeqeq
  if (v == c.modeHeatValue) return 'sun'
  // eslint-disable-next-line eqeqeq
  if (v == c.modeDehumidifyValue) return 'droplet'
  // eslint-disable-next-line eqeqeq
  if (v == c.modeFanValue) return 'fanSpeed3'
  return 'auto'
})

// ═══════════════════════════════════════════════════════════════════════════════
// 弹框样式配置
// ═══════════════════════════════════════════════════════════════════════════════

const dialogTitle = computed(() => config.value.dialogTitle)
const dialogSubtitle = computed(() => config.value.dialogSubtitle)
const dialogTitleStyle = computed(() => ({
  fontSize: `${config.value.dialogTitleFontSize}px`,
  color: config.value.dialogTitleColor,
}))
const dialogSubtitleStyle = computed(() => ({
  fontSize: `${config.value.dialogSubtitleFontSize}px`,
  color: config.value.dialogSubtitleColor,
}))
const currentValueStyle = computed(() => ({
  fontSize: `${config.value.currentValueFontSize}px`,
  color: config.value.currentValueColor,
}))
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
const showMainAreaStatusText = computed(() => config.value.showMainAreaStatusText)
const mainAreaStatusTextColor = computed(() => config.value.mainAreaStatusTextColor)

const powerButtonSize = computed(() => config.value.powerButtonSize)
const powerButtonOnColor = computed(() => config.value.powerButtonOnColor)
const powerButtonOffColor = computed(() => config.value.powerButtonOffColor)

const modeIconColor = computed(() => config.value.modeIconColor)
const modeActiveIconColor = computed(() => config.value.modeActiveIconColor)
const modeBackgroundColor = computed(() => config.value.modeBackgroundColor ?? 'rgba(255, 255, 255, 0.08)')
const modeActiveBackgroundColor = computed(() => config.value.modeActiveBackgroundColor)
const modeFontColor = computed(() => config.value.modeFontColor)
const modeActiveFontColor = computed(() => config.value.modeActiveFontColor)

// 风速相关
const fanIconColor = computed(() => config.value.modeIconColor)   // 复用
const fanActiveIconColor = computed(() => config.value.modeActiveIconColor)  // 复用
const fanBackgroundColor = computed(() => config.value.modeBackgroundColor)  // 复用
const fanActiveBackgroundColor = computed(() => config.value.modeActiveBackgroundColor)  // 复用
const fanFontColor = computed(() => config.value.modeFontColor)  // 复用
const fanActiveFontColor = computed(() => config.value.modeActiveFontColor)  // 复用
const fanLevelsTrackBackgroundColor = computed(() => config.value.fanLevelsTrackBackgroundColor)
const fanLevelsActiveBackgroundColor = computed(() => config.value.fanLevelsActiveBackgroundColor)
const fanLevelsTextColor = computed(() => config.value.fanLevelsTextColor)

// ═══════════════════════════════════════════════════════════════════════════════
// 弹框遮罩层
// ═══════════════════════════════════════════════════════════════════════════════

const handleBtnClick = () => {
  if (props.editing) return
  dialogVisible.value = true
}

const dialogInnerStyle = computed(() => ({
  backgroundColor: dialogBackgroundColor.value,
  borderRadius: `${dialogBorderRadius.value}px`,
}))

const canvasRect = ref({ top: 0, left: 0, width: 0, height: 0 })

function updateCanvasRect() {
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

watch(dialogVisible, (val) => {
  if (val) nextTick(() => retryUpdateCanvasRect())
})

const mainAreaStyle = computed(() => {
  const [c1, c2] = mainAreaGradient.value
  const angle = mainAreaGradientAngle.value
  return {
    background: `linear-gradient(${angle}deg, ${c1}, ${c2})`,
    borderRadius: `${config.value.mainAreaBorderRadius}px`,
  }
})

const tempFontStyle = computed(() => ({
  fontSize: `${mainAreaFontSize.value}px`,
  color: mainAreaTextColor.value,
}))

const gaugeUnitStyle = computed(() => ({
  fontSize: `${config.value.gaugeUnitFontSize}px`,
  color: config.value.gaugeUnitColor,
}))

const statusTextStyle = computed(() => ({
  color: mainAreaStatusTextColor.value,
}))

const powerBtnStyle = computed(() => ({
  width: `${powerButtonSize.value}px`,
  height: `${powerButtonSize.value}px`,
  color: config.value.powerButtonIconColor,
}))

const powerBtnBgStyle = computed(() => ({
  background: isOn.value
    ? config.value.powerButtonOnColor
    : config.value.powerButtonOffColor,
}))

const stepBtnStyle = computed(() => ({
  background: config.value.stepButtonBackgroundColor,
  fontSize: `${config.value.stepButtonIconSize}px`,
  color: config.value.stepButtonColor,
}))

const modeItemStyle = computed(() => ({
  '--mode-bg': modeBackgroundColor.value,
  '--mode-active-bg': modeActiveBackgroundColor.value,
  '--mode-active-fg': modeActiveFontColor.value,
  '--mode-fg': modeFontColor.value,
}))

const fanItemStyle = computed(() => ({
  '--mode-bg': fanBackgroundColor.value,
  '--mode-active-bg': fanActiveBackgroundColor.value,
  '--mode-active-fg': fanActiveFontColor.value,
  '--mode-fg': fanFontColor.value,
}))

const sliderTrackStyle = computed(() => ({
  backgroundColor: fanLevelsTrackBackgroundColor.value,
}))

const sliderTextStyle = computed(() => ({
  color: fanLevelsTextColor.value,
}))

function sliderBlockStyle(active: boolean) {
  return {
    backgroundColor: active ? fanLevelsActiveBackgroundColor.value : 'transparent',
    border: active ? 'none' : `2px solid rgba(255,255,255,0.25)`,
  }
}

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
// 模式按钮列表 + 双按钮高亮核心逻辑
// ═══════════════════════════════════════════════════════════════════════════════

interface ModeItem {
  key: string
  label: string
  icon: string
  // 点击此按钮写入的 mode 值
  writeValue: number | string
}

// 5 个模式按钮的定义（不处理激活判断，由 activeModeKeys 统一处理）
const modeList = computed<ModeItem[]>(() => {
  const c = config.value
  const items: ModeItem[] = []
  if (c.modeAutoVisible) items.push({
    key: 'auto',
    label: c.modeAutoLabel,
    icon: 'auto',
    writeValue: c.modeAutoCoolValue, // 自动按钮点击值由 handleAutoClick 重写，这里只是占位
  })
  if (c.modeCoolVisible) items.push({
    key: 'cool',
    label: c.modeCoolLabel,
    icon: 'snow',
    writeValue: c.modeCoolValue,
  })
  if (c.modeHeatVisible) items.push({
    key: 'heat',
    label: c.modeHeatLabel,
    icon: 'sun',
    writeValue: c.modeHeatValue,
  })
  if (c.modeDehumidifyVisible) items.push({
    key: 'dehumidify',
    label: c.modeDehumidifyLabel,
    icon: 'droplet',
    writeValue: c.modeDehumidifyValue,
  })
  if (c.modeFanVisible) items.push({
    key: 'fan',
    label: c.modeFanLabel,
    icon: 'fanSpeed3',
    writeValue: c.modeFanValue,
  })
  return items
})

// 记录上次手动选中的模式类型（用于自动模式组合）
type ManualModeKey = 'cool' | 'heat' | 'dehumidify' | 'fan'
const lastManualMode = ref<ManualModeKey>('cool')

// 当前激活的按钮 key 集合（支持 1 个或 2 个同时高亮）
const activeModeKeys = computed<Set<string>>(() => {
  const v = modeVal.value
  const c = config.value
  const keys = new Set<string>()
  // eslint-disable-next-line eqeqeq
  if (v == c.modeCoolValue) keys.add('cool')
  // eslint-disable-next-line eqeqeq
  if (v == c.modeHeatValue) keys.add('heat')
  // eslint-disable-next-line eqeqeq
  if (v == c.modeDehumidifyValue) keys.add('dehumidify')
  // eslint-disable-next-line eqeqeq
  if (v == c.modeFanValue) keys.add('fan')
  // eslint-disable-next-line eqeqeq
  if (v == c.modeAutoCoolValue) { keys.add('auto'); keys.add('cool') }
  // eslint-disable-next-line eqeqeq
  if (v == c.modeAutoHeatValue) { keys.add('auto'); keys.add('heat') }
  // eslint-disable-next-line eqeqeq
  if (v == c.modeAutoDehumidifyValue) { keys.add('auto'); keys.add('dehumidify') }
  // eslint-disable-next-line eqeqeq
  if (v == c.modeAutoFanValue) { keys.add('auto'); keys.add('fan') }
  return keys
})

// 模式点击写入
const writing = ref(false)

const handleModeClick = async (m: ModeItem) => {
  if (!isOn.value || writing.value) return
  writing.value = true
  try {
    if (m.key === 'auto') {
      // 点击自动按钮 → 根据 lastManualMode 写入对应的 autoXxxValue
      const map: Record<ManualModeKey, number | string> = {
        cool: config.value.modeAutoCoolValue,
        heat: config.value.modeAutoHeatValue,
        dehumidify: config.value.modeAutoDehumidifyValue,
        fan: config.value.modeAutoFanValue,
      }
      const target = map[lastManualMode.value]
      await writeModeBinding(target)
    } else {
      // 手动模式 → 更新 lastManualMode，写入手动 value
      lastManualMode.value = m.key as ManualModeKey
      await writeModeBinding(m.writeValue)
    }
  } catch (e) {
    handleApiError(e)
  } finally {
    writing.value = false
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 风速滑块逻辑
// ═══════════════════════════════════════════════════════════════════════════════

interface FanLevelItem {
  key: string
  label: string
  value: number | string
}

// 7 档档位（visible 的）
const visibleFanLevels = computed<FanLevelItem[]>(() => {
  const c = config.value
  const all: FanLevelItem[] = [
    c.fanLevel1Visible && { key: '1', label: c.fanLevel1Label, value: c.fanLevel1Value },
    c.fanLevel2Visible && { key: '2', label: c.fanLevel2Label, value: c.fanLevel2Value },
    c.fanLevel3Visible && { key: '3', label: c.fanLevel3Label, value: c.fanLevel3Value },
    c.fanLevel4Visible && { key: '4', label: c.fanLevel4Label, value: c.fanLevel4Value },
    c.fanLevel5Visible && { key: '5', label: c.fanLevel5Label, value: c.fanLevel5Value },
    c.fanLevel6Visible && { key: '6', label: c.fanLevel6Label, value: c.fanLevel6Value },
    c.fanLevel7Visible && { key: '7', label: c.fanLevel7Label, value: c.fanLevel7Value },
  ].filter((x): x is FanLevelItem => !!x)
  return all
})

const showFanAuto = computed(() => config.value.fanAutoVisible)

const isFanAuto = computed(() => {
  const v = fanVal.value
  const autoVal = config.value.fanAutoValue
  // eslint-disable-next-line eqeqeq
  return v == autoVal
})

// 当前激活档位在 visibleFanLevels 中的索引
const activeFanLevelIndex = computed<number>(() => {
  if (isFanAuto.value) return -1
  const v = fanVal.value
  const idx = visibleFanLevels.value.findIndex(
    l => l.value == v || String(l.value) === String(v), // eslint-disable-line eqeqeq
  )
  return idx >= 0 ? idx : 0
})

const activeFanLevel = computed<FanLevelItem | null>(() => {
  const idx = activeFanLevelIndex.value
  return idx >= 0 ? visibleFanLevels.value[idx] ?? null : null
})

// 点击 +/- 在 visible 档位间切换
const incrementFanLevel = async () => {
  if (!isOn.value || writing.value) return
  if (isFanAuto.value) return // 自动态不能+/-
  const nextIdx = Math.min(activeFanLevelIndex.value + 1, visibleFanLevels.value.length - 1)
  await writeFanLevel(nextIdx)
}

const decrementFanLevel = async () => {
  if (!isOn.value || writing.value) return
  if (isFanAuto.value) return
  const prevIdx = Math.max(activeFanLevelIndex.value - 1, 0)
  await writeFanLevel(prevIdx)
}

const selectFanLevel = async (idx: number) => {
  if (!isOn.value || writing.value) return
  await writeFanLevel(idx)
}

const writeFanLevel = async (idx: number) => {
  const level = visibleFanLevels.value[idx]
  if (!level) return
  writing.value = true
  try {
    if (!bindings.value?.fanSpeed) {
      fanVal.value = level.value as number
      return
    }
    const res = await writeFanBinding(level.value)
    if (!res.success) ElMessage.error(res.message)
  } catch (e) {
    handleApiError(e)
  } finally {
    writing.value = false
  }
}

const toggleFanAuto = async () => {
  if (!isOn.value || writing.value) return
  writing.value = true
  try {
    if (!bindings.value?.fanSpeed) {
      fanVal.value = config.value.fanAutoValue as number
      return
    }
    const res = await writeFanBinding(config.value.fanAutoValue)
    if (!res.success) ElMessage.error(res.message)
  } catch (e) {
    handleApiError(e)
  } finally {
    writing.value = false
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 状态文字（主区域顶部）
// ═══════════════════════════════════════════════════════════════════════════════

const statusModeText = computed(() => {
  const v = modeVal.value, c = config.value
  // eslint-disable-next-line eqeqeq
  if (v == c.modeAutoCoolValue) return `自动${c.modeCoolLabel}`
  // eslint-disable-next-line eqeqeq
  if (v == c.modeAutoHeatValue) return `自动${c.modeHeatLabel}`
  // eslint-disable-next-line eqeqeq
  if (v == c.modeAutoDehumidifyValue) return `自动${c.modeDehumidifyLabel}`
  // eslint-disable-next-line eqeqeq
  if (v == c.modeAutoFanValue) return `自动${c.modeFanLabel}`
  // eslint-disable-next-line eqeqeq
  if (v == c.modeCoolValue) return c.modeCoolLabel
  // eslint-disable-next-line eqeqeq
  if (v == c.modeHeatValue) return c.modeHeatLabel
  // eslint-disable-next-line eqeqeq
  if (v == c.modeDehumidifyValue) return c.modeDehumidifyLabel
  // eslint-disable-next-line eqeqeq
  if (v == c.modeFanValue) return c.modeFanLabel
  return ''
})

const statusFanText = computed(() => {
  if (isFanAuto.value) return '自动'
  return activeFanLevel.value?.label ?? `${fanVal.value}档`
})

// ═══════════════════════════════════════════════════════════════════════════════
// 写入逻辑（电源 / 温度）
// ═══════════════════════════════════════════════════════════════════════════════

const handleApiError = (e: unknown) => {
  const detail =
    (e as any)?.response?.data?.detail ||
    (e instanceof Error ? e.message : t('common.operationFailed'))
  ElMessage.error(detail)
}

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
</script>

<style scoped>
/* 画布卡片：info-card 风格 */
.acm-wrapper.acm-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(4px);
  user-select: none;
}
.acm-wrapper.acm-card:hover { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12); }
.acm-wrapper.acm-card:active { transform: scale(0.98); }
.acm-wrapper.acm-card.is-on  { box-shadow: 0 2px 14px rgba(102, 126, 234, 0.25); }

.acm-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
}
.acm-card-title {
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60%;
}
.acm-card-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  flex-shrink: 0;
}
.acm-card-value {
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.5px;
}
.acm-card-unit {
  font-weight: 400;
  line-height: 1.2;
  padding-top: 3px;
  opacity: 0.75;
}

/* 弹框遮罩 */
.acm-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
}

/* 弹框内容 */
.acm-dialog-inner {
  padding: 0;
  overflow: hidden;
  color: #fff;
  flex-shrink: 0;
  max-width: calc(100% - 32px);
  margin: auto;
}

/* 标题栏 */
.acm-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  background: transparent;
}

.acm-dialog-title {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.acm-dialog-title .main {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

.acm-dialog-title .sub {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.acm-dialog-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.08);
}

.acm-dialog-close:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

/* 蓝色渐变主区域 */
.acm-main-area {
  position: relative;
  margin: 0 20px;
  border-radius: 12px;
  padding: 0;
  min-height: 200px;
  display: block;
}

/* 电源按钮 */
.acm-power-btn {
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
}
.acm-power-btn .el-icon { font-size: 22px; }
.acm-power-btn.on {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.4);
}

/* 中部内容 */
.acm-center-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  z-index: 1;
}

.acm-status-text {
  font-size: 13px;
  margin-bottom: 2px;
  white-space: nowrap;
}

.acm-temp-display {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  line-height: 1;
}
.acm-temp-display .temp-value {
  font-weight: 700;
  letter-spacing: -1px;
}
.acm-temp-display .temp-unit {
  font-size: 20px;
  opacity: 0.85;
  padding-bottom: 6px;
}

.acm-current-value {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
}

/* 加减按钮 */
.acm-adjust-btns {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2px;
  z-index: 2;
}
.acm-adjust-btns.disabled {
  opacity: 0.4;
  pointer-events: none;
}
.acm-adj-btn {
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
}
.acm-adj-btn.left { border-radius: 22px 0 0 22px; }
.acm-adj-btn.right { border-radius: 0 22px 22px 0; }
.acm-adj-btn:hover { background: rgba(255, 255, 255, 0.3); }
.acm-adj-btn:active { transform: scale(0.94); }

/* Section 通用 */
.acm-section {
  padding: 16px 20px 8px;
}
.acm-section-fan { padding-top: 4px; }

.acm-section-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 10px;
  padding-left: 4px;
}

/* 模式区域 */
.acm-mode-grid {
  display: flex;
  gap: 10px;
}
.acm-mode-item {
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
}
.acm-mode-item.active {
  background: var(--mode-active-bg);
}
.acm-mode-item.disabled {
  opacity: 0.4;
  pointer-events: none;
}
.acm-mode-item .mode-label {
  font-size: 12px;
  color: var(--mode-fg);
  line-height: 1;
  white-space: nowrap;
}
.acm-mode-item.active .mode-label {
  color: var(--mode-active-fg);
}

/* 风速区域：自动按钮 + 滑块 */
.acm-fan-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

/* 自动按钮（复用模式 item 样式） */
.acm-fan-auto-btn {
  flex: 0 0 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 4px;
  border-radius: 10px;
  cursor: pointer;
  background: var(--mode-bg);
}
.acm-fan-auto-btn.active {
  background: var(--mode-active-bg);
}
.acm-fan-auto-btn.disabled {
  opacity: 0.4;
  pointer-events: none;
}
.acm-fan-auto-btn .fan-label {
  font-size: 12px;
  color: var(--mode-fg);
  line-height: 1;
  white-space: nowrap;
}
.acm-fan-auto-btn.active .fan-label {
  color: var(--mode-active-fg);
}

/* 滑块容器 */
.acm-fan-slider {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.acm-fan-slider.disabled {
  opacity: 0.4;
  pointer-events: none;
}

.acm-fan-slider-track {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border-radius: 10px;
  min-height: 44px;
}

.acm-fan-slider-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}
.acm-fan-slider-btn:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.3);
}
.acm-fan-slider-btn.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.acm-fan-levels {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;
}

.acm-fan-level-block {
  flex: 1;
  height: 22px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.acm-fan-level-block:hover {
  transform: scaleY(1.15);
}

.acm-fan-slider-label {
  text-align: center;
  font-size: 12px;
  padding-bottom: 2px;
}
</style>
