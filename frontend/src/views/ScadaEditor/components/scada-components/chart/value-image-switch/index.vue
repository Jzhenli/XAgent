<template>
  <div class="value-image-switch" :style="containerStyle">
    <div v-if="!currentImageUrl && editing" class="image-placeholder">
      <span>{{ t('scadaComponents.imagePlaceholder') }}</span>
      <span v-if="currentValue !== null && currentValue !== undefined" class="image-value">({{ currentValue }})</span>
    </div>
    <img
      v-else-if="currentImageUrl"
      :src="currentImageUrl"
      :alt="component.name"
      class="image-content"
      :style="imageStyle"
      draggable="false"
    />
    <div v-else class="image-placeholder">
      <span>{{ t('scadaComponents.imagePlaceholder') }}</span>
      <span v-if="currentValue !== null && currentValue !== undefined" class="image-value">({{ currentValue }})</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ScadaComponent, ValueImageSwitchComponentConfig } from '@/types/scada'
import { useScadaBinding } from '@/views/ScadaEditor/hooks'

const props = defineProps<{
  component: ScadaComponent
  editing?: boolean
}>()

const { t } = useI18n()

const config = computed(() => props.component.config as ValueImageSwitchComponentConfig)
const binding = computed(() => props.component.binding)
const fallbackValue = computed(() => config.value?.value ?? null)

const { currentValue } = useScadaBinding(
  binding,
  {
    transform: (value) => value,
  },
  fallbackValue,
)

const items = computed(() => config.value?.items ?? [])
const defaultUrl = computed(() => config.value?.defaultUrl ?? '')
const fit = computed(() => config.value?.fit ?? 'contain')

// 根据当前值查找匹配的图片
const currentImageUrl = computed(() => {
  if (currentValue.value === null || currentValue.value === undefined) {
    return defaultUrl.value
  }

  const strValue = String(currentValue.value)
  const matched = items.value.find(item => String(item.value) === strValue)
  return matched?.url || defaultUrl.value
})

const containerStyle = computed(() => ({
  backgroundColor: config.value?.backgroundColor || undefined,
  borderRadius: `${config.value?.borderRadius ?? 4}px`,
  opacity: config.value?.opacity ?? 1,
}))

const imageStyle = computed(() => `object-fit: ${fit.value};`)
</script>

<style scoped>
.value-image-switch {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-container);
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  color: var(--text-placeholder);
  font-size: 14px;
  border: 2px dashed var(--border-base);
  border-radius: 4px;
}

.image-value {
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-secondary);
}

.image-content {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
