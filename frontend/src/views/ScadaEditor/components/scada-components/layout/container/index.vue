<template>
  <div class="container-wrapper" :style="containerStyle">
    <div v-if="editing" class="container-placeholder">
      <span>{{ t('scadaComponents.containerPlaceholder') }}</span>
      <span v-if="currentValue" class="container-value">{{ currentValue }}</span>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ScadaComponent, ContainerComponentConfig } from '@/types/scada'

const props = defineProps<{
  config: ScadaComponent
  editing?: boolean
}>()

const { t } = useI18n()

const containerConfig = computed(() => props.config.config as ContainerComponentConfig)

const containerStyle = computed(() => ({
  backgroundColor: containerConfig.value?.backgroundColor || 'transparent',
  borderColor: containerConfig.value?.borderColor || 'var(--border-base)',
  borderWidth: `${containerConfig.value?.borderWidth || 1}px`,
  borderRadius: `${containerConfig.value?.borderRadius || 4}px`
}))

const currentValue = computed(() => props.config.config.value)
</script>

<style scoped>
.container-wrapper {
  width: 100%;
  height: 100%;
  border-style: solid;
  position: relative;
  overflow: hidden;
}

.container-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--text-placeholder);
  font-size: 14px;
  pointer-events: none;
  opacity: 0.5;
  text-align: center;
}

.container-value {
  display: block;
  font-size: 12px;
  margin-top: 4px;
}
</style>
