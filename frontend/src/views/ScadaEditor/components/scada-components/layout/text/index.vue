<template>
  <div 
    class="text-container"
    :style="containerStyle"
  >
    {{ displayContent }}
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import type { ScadaComponent } from '@/types/scada'

const props = defineProps<{
  component: ScadaComponent
  editing?: boolean
}>()

const textConfig = computed(() => (props.component as ScadaComponent<'text'>).config)

const displayContent = computed(() => {
  const content = textConfig.value?.content
  if (!content) return 'Text'
  return content
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
  background: textConfig.value?.backgroundColor || undefined,
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
