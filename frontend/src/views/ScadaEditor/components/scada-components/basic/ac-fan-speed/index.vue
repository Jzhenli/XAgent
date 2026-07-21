<template>
  <div
    class="ac-fan-speed-container"
    :style="containerStyle"
  >
    <button
      v-for="mode in modes"
      :key="mode.key"
      class="ac-fan-speed-button"
      :class="{ active: isActive(mode.value), writing: writing && pendingValue === mode.value }"
      :style="buttonStyle(mode.key)"
      :disabled="writing"
      @click="handleModeClick(mode.value)"
    >
      <component
        :is="mode.icon"
        class="ac-fan-speed-icon"
        :style="iconStyle(mode.key)"
      />
      <span class="ac-fan-speed-label" :style="labelStyle(mode.key)">
        {{ mode.label }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ScadaComponent, AcFanSpeedComponentConfig } from '@/types/scada'
import { useScadaBinding } from '@/views/ScadaEditor/hooks'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const props = defineProps<{
  config: ScadaComponent
  editing?: boolean
}>()

const acFanSpeedConfig = computed(() => props.config.config as AcFanSpeedComponentConfig)
const binding = computed(() => props.config.binding)
const fallbackValue = computed(() => props.config.config.value)

const { currentValue, writeValue } = useScadaBinding(binding, {}, fallbackValue)

const writing = ref(false)
const pendingValue = ref<number | string | null>(null)

const configValues = computed(() => ({
  auto: acFanSpeedConfig.value?.autoValue ?? 0,
  high: acFanSpeedConfig.value?.highValue ?? 3,
  medium: acFanSpeedConfig.value?.mediumValue ?? 2,
  low: acFanSpeedConfig.value?.lowValue ?? 1
}))

const modeEntries = computed(() => [
  { key: 'auto' as const, label: t('scadaComponents.acFanSpeedAuto'), value: configValues.value.auto },
  { key: 'low' as const, label: t('scadaComponents.acFanSpeedLow'), value: configValues.value.low },
  { key: 'medium' as const, label: t('scadaComponents.acFanSpeedMedium'), value: configValues.value.medium },
  { key: 'high' as const, label: t('scadaComponents.acFanSpeedHigh'), value: configValues.value.high }
])

const modes = computed(() => modeEntries.value.map(entry => ({
  ...entry,
  icon: getSpeedIcon(entry.key)
})))

const isActive = (value: number | string): boolean => {
  // eslint-disable-next-line eqeqeq
  return currentValue.value != null && currentValue.value == value
}

const containerStyle = computed(() => ({
  backgroundColor: acFanSpeedConfig.value?.backgroundColor || 'rgba(255, 255, 255, 0.1)',
  borderRadius: `${acFanSpeedConfig.value?.borderRadius ?? 8}px`
}))

const buttonStyle = (key: string) => {
  const isCurrentActive = isActive(configValues.value[key as keyof typeof configValues.value])
  return {
    backgroundColor: isCurrentActive ? (acFanSpeedConfig.value?.activeBackgroundColor || '#409eff') : 'transparent',
    borderRadius: `${acFanSpeedConfig.value?.borderRadius ?? 8}px`
  }
}

const iconStyle = (key: string) => {
  const isCurrentActive = isActive(configValues.value[key as keyof typeof configValues.value])
  return {
    width: `${acFanSpeedConfig.value?.iconSize ?? 20}px`,
    height: `${acFanSpeedConfig.value?.iconSize ?? 20}px`,
    color: isCurrentActive ? (acFanSpeedConfig.value?.activeIconColor || '#ffffff') : (acFanSpeedConfig.value?.iconColor || 'rgba(255,255,255,0.7)')
  }
}

const labelStyle = (key: string) => {
  const isCurrentActive = isActive(configValues.value[key as keyof typeof configValues.value])
  return {
    color: isCurrentActive ? (acFanSpeedConfig.value?.activeFontColor || '#ffffff') : (acFanSpeedConfig.value?.fontColor || 'rgba(255,255,255,0.7)')
  }
}

const handleModeClick = async (value: number | string) => {
  if (props.editing) return

  const target = binding.value
  if (!target) {
    currentValue.value = value
    return
  }

  pendingValue.value = value
  writing.value = true

  try {
    const result = await writeValue(value)
    if (result.success) {
      ElMessage.success(t('scadaComponents.commandSent'))
    } else {
      ElMessage.error(result.message)
    }
  } catch (e: unknown) {
    const detail = (e as any)?.response?.data?.detail || (e instanceof Error ? e.message : t('scadaComponents.operationFailed'))
    ElMessage.error(detail)
  } finally {
    writing.value = false
    pendingValue.value = null
  }
}

function getSpeedIcon(key: 'auto' | 'low' | 'medium' | 'high') {
  const icons: Record<typeof key, () => any> = {
    auto: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9' })
    ]),
    low: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0' }),
      h('path', { d: 'M12 18v3' }),
      h('path', { d: 'M12 3v3' }),
      h('path', { d: 'M4.93 4.93l2.12 2.12' }),
      h('path', { d: 'M16.95 16.95l2.12 2.12' }),
      h('path', { d: 'M3 12h3' }),
      h('path', { d: 'M18 12h3' }),
      h('path', { d: 'M4.93 19.07l2.12-2.12' }),
      h('path', { d: 'M16.95 7.05l2.12-2.12' })
    ]),
    medium: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0' }),
      h('path', { d: 'M12 16v5' }),
      h('path', { d: 'M12 3v3' }),
      h('path', { d: 'M6.34 6.34l2.83 2.83' }),
      h('path', { d: 'M14.83 14.83l2.83 2.83' }),
      h('path', { d: 'M3 12h3' }),
      h('path', { d: 'M18 12h3' }),
      h('path', { d: 'M6.34 17.66l2.83-2.83' }),
      h('path', { d: 'M14.83 9.17l2.83-2.83' })
    ]),
    high: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0' }),
      h('path', { d: 'M12 2v5' }),
      h('path', { d: 'M12 17v5' }),
      h('path', { d: 'M4.93 4.93l3.54 3.54' }),
      h('path', { d: 'M15.53 15.53l3.54 3.54' }),
      h('path', { d: 'M2 12h5' }),
      h('path', { d: 'M17 12h5' }),
      h('path', { d: 'M4.93 19.07l3.54-3.54' }),
      h('path', { d: 'M15.53 8.47l3.54-3.54' })
    ])
  }
  return icons[key]
}
</script>

<style scoped>
.ac-fan-speed-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  padding: 4px;
  box-sizing: border-box;
  gap: 4px;
}

.ac-fan-speed-button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;
  padding: 4px 2px;
  background: transparent;
}

.ac-fan-speed-button:hover:not(:disabled) {
  opacity: 0.85;
}

.ac-fan-speed-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.ac-fan-speed-button.writing {
  opacity: 0.7;
}

.ac-fan-speed-icon {
  flex-shrink: 0;
}

.ac-fan-speed-label {
  font-size: 11px;
  line-height: 1;
  white-space: nowrap;
}
</style>
