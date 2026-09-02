<template>
  <div class="preview-page">
    <div
      v-if="currentPanel"
      ref="adaptContainerRef"
      class="preview-content"
      :style="adaptContainerStyle"
    >
      <div class="canvas-frame" :style="adaptFrameStyle">
        <div class="canvas-scale" :style="adaptScaleStyle">
          <ScadaCanvas :key="`preview-${currentPanel.value?.id || 'unknown'}`" />
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <el-empty :description="$t('scada.projectNotExist')">
        <el-button type="primary" @click="handleGoBack">{{ $t('scada.backToProjectList') }}</el-button>
      </el-empty>
    </div>

    <div class="floating-back" @click="handleGoBack">
      <el-icon :size="20"><ArrowLeft /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useScadaEditor } from '@/views/ScadaEditor/hooks/useScadaEditor'
import { useScadaAdapt } from '@/views/ScadaEditor/hooks/useScadaAdapt'
import { useScadaPolling } from '@/views/ScadaEditor/hooks/useScadaBinding'
import { useScadaPointReader, ScadaPointReaderKey } from '@/utils/scadaPointReader'
import { ArrowLeft } from '@element-plus/icons-vue'
import ScadaCanvas from '@/views/ScadaEditor/components/ScadaCanvas.vue'
import { useSystemStore } from '@/stores/system'

useI18n()
const route = useRoute()
const router = useRouter()
const scada = useScadaEditor()
const pointReader = useScadaPointReader()
const systemStore = useSystemStore()

/** 预览适配容器：按面板适配模式计算容器、布局框、缩放层样式 */
const adaptContainerRef = ref<HTMLElement | null>(null)
const {
  containerStyle: adaptContainerStyle,
  frameStyle: adaptFrameStyle,
  scaleStyle: adaptScaleStyle
} = useScadaAdapt(adaptContainerRef)

provide(ScadaPointReaderKey, pointReader)

/** 启动当前面板绑定设备的周期性数据刷新，返回 stop 用于组件卸载时清理 */
const { refreshBoundDevices, stop: stopPolling } = useScadaPolling({ 
  interval: systemStore.visualizationConfig.pollingInterval,
  reader: pointReader
})

const currentPanel = computed(() => scada.currentPanel)

onMounted(async () => {
  const panelId = route.params.id as string
  if (panelId) {
    scada.isFullscreenPreview.value = true
    // 必须在 loadPanel 前设置：确保 boundAssets watch 触发时 refreshBoundDevices 不被 isEditing 短路
    scada.isEditing.value = false
    await scada.loadPanel(panelId)
    // loadPanel 后 boundAssets 变化 → boundAssets watch 自动触发 refreshBoundDevices
  }
})

/** 监听路由参数变化（导航按钮跳转到同路由不同面板时，组件不会重新挂载，需手动重载） */
watch(() => route.params.id, async (newId) => {
  if (newId && newId !== scada.currentPanelId.value) {
    await scada.loadPanel(newId as string)
    // loadPanel 后 boundAssets 变化 → boundAssets watch 自动触发 refreshBoundDevices
  }
})

onUnmounted(() => {
  scada.isEditing.value = true
  scada.isFullscreenPreview.value = false
  pointReader.clearDevices()
  stopPolling()
})

const handleGoBack = () => {
  router.push({ name: 'ScadaList' })
}
</script>

<style scoped>
.preview-page {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #1a1a2e;
}

.preview-content {
  /* 滚动与居中方式由适配模式内联样式控制 */
  flex: 1;
  min-width: 0;
  min-height: 0;
}

.canvas-frame {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  /* 禁止 flex 收缩，保证滚动模式下的布局尺寸正确 */
  flex-shrink: 0;
}

.canvas-scale {
  transform-origin: top left;
}

.empty-state {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.floating-back {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
}

.floating-back:hover {
  background: rgba(255, 255, 255, 0.22);
}
</style>