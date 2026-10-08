<template>
  <div class="info-card" :style="containerStyle">
    <!-- 顶部区域：左上标题 + 右上图标 -->
    <div class="ic-header">
      <span class="ic-title" :style="titleStyle">{{ config.title }}</span>
      <XIcon
        :name="config.iconName"
        type="mono-line"
        :size="config.iconSize"
        :color="iconColor"
      />
    </div>

    <!-- 底部区域：数值 + 单位 -->
    <div class="ic-body">
      <span class="ic-value" :style="valueStyle">{{ displayValue }}</span>
      <span class="ic-unit" :style="unitStyle">{{ config.unit }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import XIcon from '@/icon/index.vue'
import type { ScadaComponent, InfoCardComponentConfig } from '@/types/scada'
import { useScadaBinding } from '@/views/ScadaEditor/hooks'

const props = defineProps<{
  component: ScadaComponent
  editing?: boolean
}>()

const config = computed(() => props.component.config as InfoCardComponentConfig)
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
</script>

<style scoped>
.info-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 0 10px 10px;
  box-sizing: border-box;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(4px);
}

.ic-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
}

.ic-title {
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ic-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  flex-shrink: 0;
}

.ic-value {
  font-weight: 600;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.ic-unit {
  font-weight: 400;
  line-height: 1.2;
  white-space: nowrap;
}
</style>
