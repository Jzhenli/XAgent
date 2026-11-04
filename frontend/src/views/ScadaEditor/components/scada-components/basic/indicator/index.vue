<template>
  <div class="indicator-container">
    <div class="indicator-light" :class="{ on: currentValue }" :style="staticStyle"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ScadaComponent, IndicatorComponentConfig } from '@/types/scada'
import { useScadaBinding } from '@/views/ScadaEditor/hooks'

const props = defineProps<{
  component: ScadaComponent
  editing?: boolean
}>()

const indicatorConfig = computed(() => props.component.config as IndicatorComponentConfig)
const binding = computed(() => props.component.binding)
const fallbackValue = computed(() => props.component.config.value)

const onValue = computed(() => indicatorConfig.value?.onValue ?? 1)
const offValue = computed(() => indicatorConfig.value?.offValue ?? 0)

const isOn = (value: unknown): boolean => {
  if (value === undefined || value === null) return false
  // eslint-disable-next-line eqeqeq
  return value == onValue.value
}

const { currentValue } = useScadaBinding(binding, {
  transform: (value) => isOn(value)
}, fallbackValue)

const colorWithAlpha = (color: string | undefined, alpha: number): string => {
  if (!color) return `rgba(39, 174, 96, ${alpha})`
  if (color === 'transparent') return `rgba(0, 0, 0, 0)`
  if (color.startsWith('rgba')) {
    return color.replace(/,\s*[\d.]+\s*\)$/, `, ${alpha})`)
  }
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`)
  }
  if (color.startsWith('#')) {
    const hex = color.replace('#', '')
    const fullHex = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex
    const bigint = parseInt(fullHex.slice(0, 6), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  return color
}

/**
 * 静态样式：注入 CSS 变量供 class 切换使用
 * 不包含 transition 目标属性（background-color, box-shadow）
 */
const staticStyle = computed(() => {
  const cfg = indicatorConfig.value
  const onColor = cfg?.onColor || '#27ae60'
  const offColor = cfg?.offColor || '#95a5a6'
  return {
    '--bg-off': offColor,
    '--bg-on': onColor,
    '--glow-on': colorWithAlpha(onColor, 0.5),
    '--glow-off': colorWithAlpha(offColor, 0.3),
  }
})
</script>

<style scoped>
.indicator-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.indicator-light {
  width: 70%;
  height: 70%;
  border-radius: 50%;
  /* transition 属性明确列出，禁止 all 通配 */
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  /* 默认态（off）：背景色由 CSS 变量控制，box-shadow 无 */
  background-color: var(--bg-off);
  box-shadow: none;
}

/* 激活态：background-color / box-shadow 由 class 切换驱动 transition */
.indicator-light.on {
  background-color: var(--bg-on);
  box-shadow: 0 0 20px var(--glow-on);
}
</style>
