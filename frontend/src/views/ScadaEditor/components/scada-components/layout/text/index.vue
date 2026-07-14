<template>
  <div 
    class="text-container"
    :style="containerStyle"
  >
    {{ displayContent }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ScadaComponent } from '@/types/scada'

const { t } = useI18n()

const props = defineProps<{
  config: ScadaComponent
  editing?: boolean
}>()

const textConfig = computed(() => (props.config as ScadaComponent<'text'>).config)
const currentValue = computed(() => props.config.config.value)

const displayContent = computed(() => {
  if (currentValue.value !== undefined && currentValue.value !== null && currentValue.value !== '') {
    return String(currentValue.value)
  }
  const content = textConfig.value?.content
  if (!content) return t('scadaComponents.defaultText')
  return t(content)
})

const justifyMap: Record<string, string> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end'
}

const containerStyle = computed(() => ({
  fontSize: `${textConfig.value?.fontSize || 14}px`,
  color: textConfig.value?.fontColor || '#2c3e50',
  fontWeight: textConfig.value?.fontWeight || 'normal',
  textAlign: textConfig.value?.textAlign || 'center',
  justifyContent: justifyMap[textConfig.value?.textAlign || 'center'],
  backgroundColor: textConfig.value?.backgroundColor || undefined,
  borderRadius: `${textConfig.value?.borderRadius ?? 4}px`
}))
</script>

<style scoped>
.text-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 8px;
  word-break: break-word;
}
</style>
