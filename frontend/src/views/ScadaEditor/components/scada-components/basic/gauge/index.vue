<template>
  <div class="gauge-container" :style="containerStyle">
    <svg v-if="hasGradient" width="0" height="0" aria-hidden="true" class="gauge-gradient-defs">
      <defs>
        <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" :stop-color="gradientColors[0]" />
          <stop offset="50%" :stop-color="gradientColors[1]" />
          <stop offset="100%" :stop-color="gradientColors[2]" />
        </linearGradient>
      </defs>
    </svg>

    <div class="gauge-progress" :style="progressStyle">
      <el-progress
        type="dashboard"
        :percentage="progressPercentage"
        :color="progressColor"
        :width="gaugeSize"
        :stroke-width="trackWidth"
        :stroke-linecap="strokeLinecap"
      >
        <div class="gauge-center">
          <el-icon
            v-if="showButtons"
            class="gauge-icon gauge-icon-left"
            :class="{ 'is-disabled': writing }"
            :style="controlButtonStyle"
            @click.stop="decrement"
          >
            <ArrowLeft />
          </el-icon>

          <div class="gauge-value-wrap">
            <span class="gauge-value" :style="valueTextStyle">{{ displayValue }}</span>
            <span v-if="unit" class="gauge-unit" :style="unitTextStyle">{{ unit }}</span>
          </div>

          <el-icon
            v-if="showButtons"
            class="gauge-icon gauge-icon-right"
            :class="{ 'is-disabled': writing }"
            :style="controlButtonStyle"
            @click.stop="increment"
          >
            <ArrowRight />
          </el-icon>
        </div>
      </el-progress>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { ScadaComponent, GaugeComponentConfig } from '@/types/scada'
import { useScadaBinding } from '@/views/ScadaEditor/hooks'
import { useScadaConfig } from '@/views/ScadaEditor/hooks/useScadaEditor'

const props = defineProps<{
  component: ScadaComponent
  editing?: boolean
}>()

const { t } = useI18n()

/** 当前仪表盘组件配置 */
const gaugeConfig = computed(() => props.component.config as GaugeComponentConfig)
const binding = computed(() => props.component.binding)
const fallbackValue = computed(() => gaugeConfig.value?.value ?? 48)

/** 点位绑定：读取当前值并提供写入能力 */
const { currentValue, boundPoint, writeValue } = useScadaBinding(
  binding,
  { transform: (value) => (typeof value === 'number' ? value : 0) },
  fallbackValue,
)

const { updateValue } = useScadaConfig(props.component as ScadaComponent<'gauge'>)

// ═══════════════════════════════════════════════════════════════════════════════
// 数据范围配置
// ═══════════════════════════════════════════════════════════════════════════════
const min = computed(() => gaugeConfig.value?.min ?? 0)
const max = computed(() => gaugeConfig.value?.max ?? 100)
const step = computed(() => gaugeConfig.value?.step ?? 1)
const unit = computed(() => gaugeConfig.value?.unit ?? '')

// ═══════════════════════════════════════════════════════════════════════════════
// 样式配置
// ═══════════════════════════════════════════════════════════════════════════════
const showButtons = computed(() => gaugeConfig.value?.showButtons ?? true)
const fontSize = computed(() => gaugeConfig.value?.fontSize ?? 48)
const fontColor = computed(() => gaugeConfig.value?.fontColor ?? '#000000')
const fontWeight = computed(() => gaugeConfig.value?.fontWeight ?? 'bold')
const stepFontSize = computed(() => gaugeConfig.value?.stepFontSize ?? 12)
const stepFontColor = computed(() => gaugeConfig.value?.stepFontColor ?? fontColor.value)
const unitFontSize = computed(() => gaugeConfig.value?.unitFontSize ?? 16)
const unitFontColor = computed(() => gaugeConfig.value?.unitFontColor ?? fontColor.value)
const unitFontWeight = computed(() => gaugeConfig.value?.unitFontWeight ?? 'normal')
const trackColor = computed(() => gaugeConfig.value?.trackColor ?? '#4a4a6a')
const trackWidth = computed(() => gaugeConfig.value?.trackWidth ?? 12)
const strokeLinecap = computed(() => gaugeConfig.value?.strokeLinecap ?? 'round')

// ═══════════════════════════════════════════════════════════════════════════════
// 填充色与渐变
// ═══════════════════════════════════════════════════════════════════════════════
const fillColor = computed(() => gaugeConfig.value?.fillColor ?? '#4a90e2')
const gradientId = computed(() => `gauge-gradient-${props.component.id}`)

const isValidGradient = (gradient?: string[] | null): gradient is [string, string, string] =>
  Array.isArray(gradient) && gradient.length === 3 && gradient.every((color) => !!color)

/** 填充渐变色（3 色），缺失时回退到 fillColor */
const gradientColors = computed(() => {
  const gradient = gaugeConfig.value?.fillGradient
  if (isValidGradient(gradient)) return gradient
  const fallback = fillColor.value
  return [fallback, fallback, fallback]
})

const hasGradient = computed(() => isValidGradient(gaugeConfig.value?.fillGradient))

// ═══════════════════════════════════════════════════════════════════════════════
// 进度计算
// ═══════════════════════════════════════════════════════════════════════════════
/** 将数值归一化为 0-100 的进度百分比 */
const normalizePercentage = (value: number, minVal: number, maxVal: number): number => {
  const range = maxVal - minVal
  if (range <= 0) return 0
  return Math.min(100, Math.max(0, ((value - minVal) / range) * 100))
}

/** 当前值对应的仪表盘进度百分比 */
const progressPercentage = computed(() =>
  normalizePercentage(currentValue.value ?? min.value, min.value, max.value),
)

/**
 * 根据阈值配置生成 el-progress 的颜色数组
 * 无阈值时回退到单色
 */
const buildProgressColors = (
  thresholds: { value: number; color: string }[],
  minVal: number,
  maxVal: number,
  fallbackColor: string,
) => {
  if (thresholds.length === 0 || maxVal <= minVal) {
    return fallbackColor
  }
  return thresholds
    .map((item) => ({
      color: item.color,
      percentage: normalizePercentage(item.value, minVal, maxVal),
    }))
    .sort((a, b) => a.percentage - b.percentage)
}

/** 进度条颜色：优先使用阈值分段，否则使用单色填充 */
const progressColor = computed(() =>
  buildProgressColors(gaugeConfig.value?.thresholds ?? [], min.value, max.value, fillColor.value),
)

/** 仪表盘尺寸：取组件宽高短边，保证完整显示 */
const gaugeSize = computed(() => {
  const size = Math.min(gaugeConfig.value?.width ?? 180, gaugeConfig.value?.height ?? 180)
  return Math.max(60, size)
})

// ═══════════════════════════════════════════════════════════════════════════════
// 文本显示
// ═══════════════════════════════════════════════════════════════════════════════
/** 整数直接显示，否则保留一位小数 */
const formatNumber = (val: number): string =>
  Number.isInteger(val) ? val.toString() : val.toFixed(1)

/** 中心显示的当前值文本 */
const displayValue = computed(() => formatNumber(currentValue.value ?? fallbackValue.value ?? 0))

// ═══════════════════════════════════════════════════════════════════════════════
// 样式对象
// ═══════════════════════════════════════════════════════════════════════════════
const containerStyle = computed(() => ({
  borderRadius: `${gaugeConfig.value?.borderRadius ?? 12}px`,
  '--gauge-track-color': trackColor.value,
}))

const progressStyle = computed(() => ({
  '--gauge-stroke': hasGradient.value ? `url(#${gradientId.value})` : undefined,
}))

const valueTextStyle = computed(() => ({
  color: fontColor.value,
  fontSize: `${fontSize.value}px`,
  fontWeight: fontWeight.value,
}))

const unitTextStyle = computed(() => ({
  color: unitFontColor.value,
  fontSize: `${unitFontSize.value}px`,
  fontWeight: unitFontWeight.value,
}))

const controlButtonStyle = computed(() => ({
  color: stepFontColor.value,
  fontSize: `${Math.max(12, stepFontSize.value)}px`,
}))

// ═══════════════════════════════════════════════════════════════════════════════
// 数值写入
// ═══════════════════════════════════════════════════════════════════════════════
const writing = ref(false)

/** 将目标值限制在 [min, max] 范围内 */
const clampValue = (raw: number): number => Math.min(max.value, Math.max(min.value, raw))

/**
 * 应用数值变更：编辑模式更新模拟值，运行模式写入点位
 */
const applyValueChange = async (raw: number) => {
  const newValue = clampValue(raw)
  const previous = currentValue.value ?? fallbackValue.value ?? min.value

  if (newValue === previous) return

  // 乐观更新本地显示
  currentValue.value = newValue

  if (props.editing) {
    updateValue(newValue)
    return
  }

  if (binding.value && boundPoint.value?.writable) {
    writing.value = true
    try {
      const result = await writeValue(newValue)
      if (!result.success) {
        currentValue.value = previous
        ElMessage.error(result.message)
      }
    } catch (e: unknown) {
      currentValue.value = previous
      const detail =
        (e as any)?.response?.data?.detail ||
        (e instanceof Error ? e.message : t('scadaComponents.operationFailed'))
      ElMessage.error(detail)
    } finally {
      writing.value = false
    }
  }
}

/** 数值递增 */
const increment = () => {
  applyValueChange((currentValue.value ?? fallbackValue.value ?? min.value) + step.value)
}

/** 数值递减 */
const decrement = () => {
  applyValueChange((currentValue.value ?? fallbackValue.value ?? min.value) - step.value)
}
</script>

<style scoped>
.gauge-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

.gauge-progress {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gauge-progress :deep(.el-progress-circle__track) {
  stroke: var(--gauge-track-color);
}

.gauge-progress :deep(.el-progress-circle__path) {
  stroke: var(--gauge-stroke) !important;
}

.gauge-gradient-defs {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

.gauge-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.gauge-value-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 1em;
}

.gauge-value {
  text-align: center;
  line-height: 1;
  user-select: none;
}

.gauge-unit {
  font-size: 0.5em;
  margin-top: 2px;
  opacity: 0.8;
  line-height: 1;
}

.gauge-icon {
  padding: 0 4px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
  line-height: 1;
  user-select: none;
}

.gauge-icon:hover:not(.is-disabled) {
  opacity: 1;
}

.gauge-icon.is-disabled {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}

/** ArrowRight 图标内部箭头偏左，需额外左间距使左右箭头到数值的视觉距离对称 */
.gauge-icon-left {
  margin-right: 6px;
}
</style>
