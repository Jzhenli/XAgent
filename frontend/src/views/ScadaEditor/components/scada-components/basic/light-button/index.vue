<template>
  <div
    class="light-button"
    :class="{ on: isOnState, writing }"
    :style="buttonStyle"
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

const iconColor = computed(() => ({
  normal: isOnState.value
    ? (config.value.activeIconColor || config.value.iconColor || 'var(--color-primary)')
    : (config.value.iconColor || 'var(--color-primary)')
}))

const buttonStyle = computed(() => {
  const cfg = config.value
  return {
    width: '100%',
    height: '100%',
    backgroundColor: isOnState.value
      ? (cfg.activeBackgroundColor || cfg.backgroundColor || 'transparent')
      : (cfg.backgroundColor || 'transparent'),
    borderRadius: `${cfg.borderRadius ?? 8}px`,
    color: isOnState.value
      ? (cfg.activeFontColor || cfg.fontColor || 'inherit')
      : (cfg.fontColor || 'inherit'),
    fontSize: `${cfg.fontSize ?? 12}px`,
    border: cfg.borderWidth
      ? `${cfg.borderWidth}px solid ${cfg.borderColor || 'transparent'}`
      : undefined,
    // writing 态降透明度（内联样式优先级高于 scoped CSS，需在此合并）
    opacity: writing.value ? 0.7 : (cfg.opacity ?? 1)
  }
})

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
  transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}

.light-button:focus {
  outline: none;
}

.light-button:focus-visible {
  box-shadow: 0 0 0 2px var(--color-primary);
}

.light-button.writing {
  opacity: 0.7;
  pointer-events: none;
}

.light-button__text {
  line-height: 1;
  text-align: center;
  white-space: nowrap;
}
</style>
