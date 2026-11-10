<template>
  <div
    class="light-button"
    :class="{ on: isOnState, writing }"
    :style="staticStyle"
    role="button"
    tabindex="0"
    @click="handleToggle"
    @keydown.enter="handleToggle"
    @keydown.space.prevent="handleToggle"
  >
    <XIcon
      :name="config.iconName"
      type="mono-line"
      :size="config.iconSize"
      :color="iconColor"
    />
    <span class="light-button__text">{{ config.text }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import XIcon from '@/icon/index.vue'
import type { ScadaComponent, LightButtonComponentConfig } from '@/types/scada'
import { useScadaBinding } from '@/views/ScadaEditor/hooks'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const props = defineProps<{
  component: ScadaComponent
  editing?: boolean
}>()

const config = computed(() => props.component.config as LightButtonComponentConfig)
const binding = computed(() => props.component.binding)
const fallbackValue = computed(() => config.value.value)

const onValue = computed(() => config.value.onValue ?? 1)
const offValue = computed(() => config.value.offValue ?? 0)

const isOn = (value: unknown): boolean => {
  if (value === undefined || value === null) return false
  // eslint-disable-next-line eqeqeq
  return value == onValue.value
}

const { currentValue, writeValue } = useScadaBinding(binding, {
  transform: (value) => isOn(value)
}, fallbackValue)

const writing = ref(false)

const isOnState = computed(() => !!currentValue.value)

/**
 * 静态样式：只放稳定的布局属性 + CSS 变量注入
 * 不包含 transition 目标属性（background-color, color, border-color, opacity）
 * 这些由 CSS class (.on) 切换驱动 transition
 */
const staticStyle = computed(() => {
  const cfg = config.value
  return {
    width: '100%',
    height: '100%',
    borderRadius: `${cfg.borderRadius ?? 8}px`,
    // border 简写：border-color 由 CSS 变量控制，不在 inline style 里
    border: cfg.borderWidth
      ? `${cfg.borderWidth}px solid var(--border-color)`
      : undefined,
    fontSize: `${cfg.fontSize ?? 12}px`,
    // opacity 用 CSS 变量注入，避免 inline style 直接写 opacity 与 .writing 类冲突
    '--opacity': cfg.opacity ?? 1,
    '--bg-off': cfg.backgroundColor || 'transparent',
    '--bg-on': cfg.activeBackgroundColor || cfg.backgroundColor || 'transparent',
    '--fg-off': cfg.fontColor || 'inherit',
    '--fg-on': cfg.activeFontColor || cfg.fontColor || 'inherit',
    '--icon-color-off': cfg.iconColor || 'var(--color-primary)',
    '--icon-color-on': cfg.activeIconColor || cfg.iconColor || 'var(--color-primary)',
    '--border-color': cfg.borderColor || 'transparent',
  }
})

/**
 * iconColor：每次 computed 返回新对象 { normal: ... }
 * XIcon 内部 props 变化会触发重渲染，这里保持最小改动
 */
const iconColor = computed(() => ({
  normal: isOnState.value
    ? (config.value.activeIconColor || config.value.iconColor || 'var(--color-primary)')
    : (config.value.iconColor || 'var(--color-primary)')
}))

const handleToggle = async () => {
  if (props.editing) return
  if (writing.value) return

  const targetValue = currentValue.value ? offValue.value : onValue.value
  const writeTarget = config.value.writePoint || binding.value

  if (writeTarget) {
    writing.value = true
    const originalValue = currentValue.value

    // 乐观更新
    currentValue.value = !originalValue

    try {
      const res = await writeValue(targetValue)
      if (!res.success) {
        currentValue.value = originalValue
        ElMessage.error(res.message)
      }
    } catch (e: unknown) {
      currentValue.value = originalValue
      const detail = (e as any)?.response?.data?.detail ||
        (e instanceof Error ? e.message : t('scadaComponents.operationFailed'))
      ElMessage.error(detail)
    } finally {
      writing.value = false
    }
  } else {
    // 未绑定点位：仅本地切换
    currentValue.value = !currentValue.value
  }
}
</script>

<style scoped>
.light-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
  /* transition 属性由 CSS class 切换触发，与 inline style 完全分离 */
  transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease, opacity 0.15s ease;

  /* 默认态（off）：状态色由 CSS 变量控制 */
  background-color: var(--bg-off);
  color: var(--fg-off);
  /* 基础透明度由配置注入的 CSS 变量控制 */
  opacity: var(--opacity, 1);
}

/* 激活态：background-color / color 切换，触发 transition */
.light-button.on {
  background-color: var(--bg-on);
  color: var(--fg-on);
}

.light-button:focus {
  outline: none;
}

.light-button:focus-visible {
  box-shadow: 0 0 0 2px var(--color-primary);
}

.light-button.writing {
  /* 轻微透明度提示（基于配置透明度），不阻塞点击 */
  opacity: calc(var(--opacity, 1) * 0.85);
}

.light-button__text {
  line-height: 1;
  text-align: center;
  white-space: nowrap;
}
</style>
