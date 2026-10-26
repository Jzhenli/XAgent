<template>
  <div class="value-progress-card" :style="containerStyle">
    <!-- 顶部区域：左上标题 + 右上图标 -->
    <div class="vpc-header">
      <span class="vpc-title" :style="titleStyle">{{ config.title }}</span>
      <XIcon
        :name="config.iconName"
        type="mono-line"
        :size="config.iconSize"
        :color="iconColor"
      />
    </div>

    <!-- 数值 + 单位 + 进度条 -->
    <div class="vpc-body">
      <div class="vpc-value-row">
        <span class="vpc-value" :style="valueStyle">{{ displayValue }}</span>
        <span class="vpc-unit" :style="unitStyle">{{ config.unit }}</span>
      </div>
      <div
        class="vpc-bar-track"
        :style="{ ...trackStyle, '--progress-percent': `${percent}%`, '--anim-duration': `${animationDuration}s` }"
        :class="{ 'anim-disabled': !animationEnabled }"
      >
        <!-- 基础填充层 -->
        <div class="vpc-bar-fill-base" :style="fillBaseStyle" />
        <!-- 层层递进条纹层 -->
        <div class="vpc-bar-fill-shimmer">
          <span v-for="i in 5" :key="i" class="shimmer-segment" :style="{ animationDelay: `${(i - 1) * 0.12}s` }" />
        </div>
        <!-- 前沿光晕脉冲 -->
        <div class="vpc-bar-fill-glow" :style="glowStyle" />
      </div>
      <div class="vpc-bar-scale" :style="scaleStyle">
        <span>{{ config.min }}</span>
        <span>{{ config.max }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import XIcon from '@/icon/index.vue'
import type { ScadaComponent, ValueProgressCardComponentConfig } from '@/types/scada'
import { useScadaBinding } from '@/views/ScadaEditor/hooks'

const props = defineProps<{
  component: ScadaComponent
  editing?: boolean
}>()

const config = computed(() => props.component.config as ValueProgressCardComponentConfig)
const binding = computed(() => props.component.binding)
const fallbackValue = computed(() => {
  const v = config.value.value
  return typeof v === 'number' ? v : 0
})

const { currentValue } = useScadaBinding(binding, {}, fallbackValue)

// ─── 图标颜色（XIcon 需要对象格式） ─────────────────────────
const iconColor = computed(() => ({ normal: config.value.iconColor }))

// ─── 容器样式 ───────────────────────────────────────────────
const containerStyle = computed(() => ({
  width: '100%',
  height: '100%',
  backgroundColor: config.value.backgroundColor ?? 'rgba(245, 247, 250, 0.9)',
  borderRadius: `${config.value.borderRadius ?? 12}px`,
  opacity: config.value.opacity ?? 1,
  border: config.value.borderWidth
    ? `${config.value.borderWidth}px solid ${config.value.borderColor ?? 'transparent'}`
    : undefined,
}))

// ─── 标题样式 ───────────────────────────────────────────────
const titleStyle = computed(() => ({
  fontSize: `${config.value.titleFontSize}px`,
  color: config.value.titleFontColor,
}))

// ─── 数值格式化 ─────────────────────────────────────────────
const displayValue = computed(() => {
  const raw = typeof currentValue.value === 'number'
    ? currentValue.value
    : Number(currentValue.value)
  if (Number.isNaN(raw)) return '--'
  const dp = config.value.decimalPlaces
  return dp > 0 ? raw.toFixed(dp) : String(Math.round(raw))
})

// ─── 当前值样式 ──────────────────────────────────────────────
const valueStyle = computed(() => ({
  fontSize: `${config.value.valueFontSize}px`,
  color: config.value.valueFontColor,
}))

// ─── 单位样式 ───────────────────────────────────────────────
const unitStyle = computed(() => ({
  fontSize: `${config.value.unitFontSize}px`,
  color: config.value.unitFontColor,
}))

// ─── 进度条百分比 ───────────────────────────────────────────
const percent = computed(() => {
  const min = config.value.min ?? 0
  const max = config.value.max ?? 100
  const range = max - min
  if (range <= 0) return 0
  const raw = typeof currentValue.value === 'number'
    ? currentValue.value
    : Number(currentValue.value) || min
  const ratio = (raw - min) / range
  return Math.max(0, Math.min(1, ratio)) * 100
})

// ─── 动画配置：编辑模式默认开启，预览模式默认关闭 ──────────────
const animationEnabled = computed(() => {
  const cfg = config.value.animationEnabled
  if (cfg !== undefined) return cfg
  return props.editing ?? false
})
const animationDuration = computed(() => config.value.animationDuration ?? 1.5)

// ─── 进度条轨道样式 ─────────────────────────────────────────
const trackStyle = computed(() => ({
  height: `${config.value.barHeight ?? 6}px`,
  backgroundColor: config.value.barTrackColor ?? 'rgba(0, 0, 0, 0.08)',
  borderRadius: `${config.value.barRadius ?? 3}px`,
}))

// ─── 基础填充层样式（使用 transform: scaleX 做 GPU 加速） ────
const fillBaseStyle = computed(() => ({
  background: config.value.barColor ?? 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)',
  borderRadius: `${config.value.barRadius ?? 3}px`,
}))

// ─── 前沿光晕位置（跟随进度条前沿） ─────────────────────────
const glowStyle = computed(() => ({
  left: `${percent.value}%`,
}))

// ─── 进度条刻度标签样式（min/max） ─────────────────────────
const scaleStyle = computed(() => ({
  fontSize: `${config.value.scaleFontSize ?? 9}px`,
  color: config.value.scaleFontColor ?? '#aaaaaa',
}))
</script>

<style scoped>
.value-progress-card {
  display: flex;
  flex-direction: column;
  padding: 10px 12px 8px 12px;
  box-sizing: border-box;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(4px);
}

.vpc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.vpc-title {
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vpc-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 4px;
}

.vpc-value-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-shrink: 0;
}

.vpc-value {
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.vpc-unit {
  font-weight: 400;
  line-height: 1;
  white-space: nowrap;
}

.vpc-bar-track {
  width: 100%;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
}

/* ── 基础填充层：用 scaleX 做 GPU 加速的平滑过渡 ── */
.vpc-bar-fill-base {
  position: absolute;
  inset: 0;
  width: 100%;
  transform: scaleX(var(--progress-percent, 0%));
  transform-origin: left center;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 1;
}

/* ── 层层递进条纹层：5 段依次点亮 ── */
.vpc-bar-fill-shimmer {
  position: absolute;
  inset: 0;
  width: 100%;
  transform: scaleX(var(--progress-percent, 0%));
  transform-origin: left center;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 2;
  overflow: hidden;
  display: flex;
  pointer-events: none;
}

.shimmer-segment {
  flex: 1;
  height: 100%;
  opacity: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.35) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer-pulse var(--anim-duration, 1.5s) ease-in-out infinite;
}

/* ── 前沿光晕脉冲 ── */
.vpc-bar-fill-glow {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: left 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 3;
  animation: glow-pulse var(--anim-duration, 1.5s) ease-in-out infinite;
  pointer-events: none;
}

/* ── 动画关闭时的 fallback：保留 width 过渡 ── */
.vpc-bar-track.anim-disabled .vpc-bar-fill-base,
.vpc-bar-track.anim-disabled .vpc-bar-fill-shimmer {
  transition: transform 0.3s ease;
}
.vpc-bar-track.anim-disabled .vpc-bar-fill-shimmer,
.vpc-bar-track.anim-disabled .vpc-bar-fill-glow {
  display: none;
}

/* ── 关键帧 ── */
@keyframes shimmer-pulse {
  0%,
  100% {
    opacity: 0;
    transform: translateX(-60%);
  }
  50% {
    opacity: 1;
    transform: translateX(60%);
  }
}

@keyframes glow-pulse {
  0%,
  100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(0.8);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.3);
  }
}

.vpc-bar-scale {
  display: flex;
  justify-content: space-between;
  line-height: 1;
  flex-shrink: 0;
}
</style>
