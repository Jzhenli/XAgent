<template>
  <div class="nav-button-container" :class="{ 'is-editing': editing }">
    <button
      type="button"
      class="nav-button"
      :style="buttonStyle"
      @click.stop="handleClick"
    >
      {{ displayText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { ScadaComponent, NavButtonComponentConfig } from '@/types/scada'

const { t } = useI18n()
const router = useRouter()

const props = defineProps<{
  component: ScadaComponent
  editing?: boolean
}>()

const navConfig = computed(() => props.component.config as NavButtonComponentConfig)

const displayText = computed(() => navConfig.value?.text || t('componentConfig.navButton'))

const buttonStyle = computed(() => {
  const config = navConfig.value
  const borderWidth = config.borderWidth ?? 0
  const borderColor = config.borderColor ?? config.backgroundColor ?? '#409eff'
  return {
    color: config.fontColor ?? '#ffffff',
    fontSize: `${config.fontSize ?? 14}px`,
    backgroundColor: config.backgroundColor ?? '#409eff',
    border: borderWidth > 0
      ? `${borderWidth}px solid ${borderColor}`
      : 'none',
    borderRadius: `${config.borderRadius ?? 4}px`,
  }
})

const handleClick = (event: MouseEvent) => {
  event.preventDefault()

  if (props.editing) return

  const config = navConfig.value
  if (!config) return

  if (config.jumpMode === 'url') {
    const url = config.targetUrl?.trim()
    if (!url) {
      ElMessage.warning(t('componentConfig.pleaseEnterTargetUrl'))
      return
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.location.href = url
    } else if (url.startsWith('/')) {
      router.push(url)
    } else {
      window.location.href = url
    }
  } else if (config.jumpMode === 'project') {
    const projectId = config.targetProjectId
    if (!projectId) {
      ElMessage.warning(t('componentConfig.pleaseSelectProject'))
      return
    }
    const routeName = config.targetProjectType === 'Graphic' ? 'GraphicPreview' : 'ScadaPreview'
    router.push({ name: routeName, params: { id: projectId } })
  }
}
</script>

<style scoped>
.nav-button-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.nav-button-container.is-editing .nav-button {
  pointer-events: none;
  cursor: inherit;
}

.nav-button {
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
}

.nav-button:hover {
  opacity: 0.9;
}

.nav-button:active {
  opacity: 0.8;
}
</style>
