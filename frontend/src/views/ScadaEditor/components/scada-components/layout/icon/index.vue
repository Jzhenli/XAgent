<template>
  <div class="icon-container">
    <XIcon
      v-if="iconConfig.iconName"
      :name="iconConfig.iconName"
      type="mono-line"
      :size="iconSize"
      :color="iconColor"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import XIcon from '@/icon/index.vue'
import type { ScadaComponent } from '@/types/scada'

const props = defineProps<{
  config: ScadaComponent
  editing?: boolean
}>()

const iconConfig = computed(() => (props.config as ScadaComponent<'icon'>).config)

const iconSize = computed(() => Math.min(iconConfig.value.width, iconConfig.value.height))

const iconColor = computed(() => ({
  normal: iconConfig.value.iconColor || 'var(--color-primary)'
}))
</script>

<style scoped>
.icon-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
</style>
