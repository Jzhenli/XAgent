<template>
  <div class="preview-page" :class="{ fullscreen: isFullscreen }">
    <div v-if="!isFullscreen" class="preview-header">
      <div class="header-left">
        <el-button :icon="ArrowLeft" size="small" @click="handleGoBack">
          {{ $t('scada.backToList') }}
        </el-button>
        <h3 class="panel-title">{{ currentPanel.value?.name }}</h3>
      </div>
      <div class="header-right">
        <el-button :icon="FullScreen" size="small" @click="handleToggleFullscreen">
          {{ $t('scada.fullscreen') }}
        </el-button>
      </div>
    </div>

    <div v-if="currentPanel" class="preview-content">
      <div class="canvas-wrapper">
        <ScadaCanvas :key="`preview-${currentPanel.value?.id || 'unknown'}`" />
      </div>
    </div>

    <div v-else class="empty-state">
      <el-empty :description="$t('scada.projectNotExist')">
        <el-button type="primary" @click="handleGoBack">{{ $t('scada.backToProjectList') }}</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, provide, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useScadaEditor } from '@/views/ScadaEditor/hooks/useScadaEditor'
import { useScadaPolling } from '@/views/ScadaEditor/hooks/useScadaBinding'
import { useScadaPointReader, ScadaPointReaderKey } from '@/utils/scadaPointReader'
import { ArrowLeft, FullScreen } from '@element-plus/icons-vue'
import ScadaCanvas from '@/views/ScadaEditor/components/ScadaCanvas.vue'
import { useSystemStore } from '@/stores/system'

useI18n()
const route = useRoute()
const router = useRouter()
const scada = useScadaEditor()
const pointReader = useScadaPointReader()
const systemStore = useSystemStore()

provide(ScadaPointReaderKey, pointReader)

/** 启动当前面板绑定设备的周期性数据刷新，返回 stop 用于组件卸载时清理 */
const { refreshBoundDevices, stop: stopPolling } = useScadaPolling({ 
  interval: systemStore.visualizationConfig.pollingInterval,
  reader: pointReader
})

const isFullscreen = ref(false)

const currentPanel = computed(() => scada.currentPanel)

onMounted(async () => {
  const panelId = route.params.id as string
  if (panelId) {
    scada.isEditing.value = false
    scada.isFullscreenPreview.value = true
    await scada.loadPanel(panelId)
    await refreshBoundDevices()
  }
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

/** 监听路由参数变化（导航按钮跳转到同路由不同面板时，组件不会重新挂载，需手动重载） */
watch(() => route.params.id, async (newId) => {
  if (newId && newId !== scada.currentPanelId.value) {
    await scada.loadPanel(newId as string)
    await refreshBoundDevices()
  }
})

onUnmounted(() => {
  scada.isEditing.value = true
  scada.isFullscreenPreview.value = false
  pointReader.clearDevices()
  stopPolling()
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

const handleGoBack = () => {
  router.push({ name: 'ScadaList' })
}

const handleToggleFullscreen = async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
    } else {
      await document.exitFullscreen()
    }
  } catch {
    // 全屏 API 不被支持或权限不足，静默降级
  }
}
</script>

<style scoped>
.preview-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-secondary);
}

.preview-page.fullscreen {
  height: 100vh;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: var(--bg-container);
  border-bottom: 1px solid var(--border-base);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.panel-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.preview-content {
  flex: 1;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  background: #1a1a2e;
}

.canvas-wrapper {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.empty-state {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-page.fullscreen .preview-content {
  padding: 0;
}
</style>