<template>
  <div class="image-container" :style="containerStyle">
    <div v-if="!imageUrl && editing" class="image-placeholder">
      <span>{{ t('scadaComponents.imagePlaceholder') }}</span>
      <span v-if="currentValue" class="image-value">{{ currentValue }}</span>
    </div>
    <div v-else class="image-content-wrapper">
      <img
        :src="imageUrl"
        :alt="config.name"
        class="image-content"
        :style="imageStyle"
        draggable="false"
      />
      <span v-if="currentValue" class="image-value-overlay">{{ currentValue }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ScadaComponent, ImageComponentConfig } from '@/types/scada'

const { t } = useI18n()

const props = defineProps<{
  config: ScadaComponent
  editing?: boolean
}>()

const imageConfig = computed(() => props.config.config as ImageComponentConfig)
const imageUrl = computed(() => imageConfig.value?.url || '')
const objectFit = computed(() => imageConfig.value?.fit || 'contain')
const imageStyle = computed(() => `object-fit: ${objectFit.value};`)
const currentValue = computed(() => props.config.config.value)

const containerStyle = computed(() => ({
  backgroundColor: imageConfig.value?.backgroundColor || undefined,
  borderRadius: `${imageConfig.value?.borderRadius ?? 4}px`,
  opacity: imageConfig.value?.opacity ?? 1
}))
</script>

<style scoped>
.image-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-container);
  border-radius: 4px;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--text-placeholder);
  font-size: 14px;
  border: 2px dashed var(--border-base);
  border-radius: 4px;
}

.image-content {
  width: 100%;
  height: 100%;
  display: block;
}

.image-content-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-value {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.image-value-overlay {
  position: absolute;
  bottom: 4px;
  right: 4px;
  font-size: 12px;
  color: var(--text-primary);
  background: rgba(0, 0, 0, 0.4);
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
