<template>
  <div class="image-container" :style="containerStyle">
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="component.name"
      class="image-content"
      :style="imageStyle"
      draggable="false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ScadaComponent, ImageComponentConfig } from '@/types/scada'

const props = defineProps<{
  component: ScadaComponent
  editing?: boolean
}>()

const imageConfig = computed(() => props.component.config as ImageComponentConfig)
const imageUrl = computed(() => imageConfig.value?.url || '')
const objectFit = computed(() => imageConfig.value?.fit || 'contain')
const imageStyle = computed(() => `object-fit: ${objectFit.value};`)

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

.image-content {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
