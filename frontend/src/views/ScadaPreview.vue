<template>
  <div class="preview-page">
    <!-- 加载遮罩：彻底覆盖 canvas 区域，防止闪显上一次残留的面板数据 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <el-icon class="loading-spinner" :size="36"><Loading /></el-icon>
        <span class="loading-text">{{ $t('common.loading') }}</span>
      </div>
    </div>

    <div
      v-else-if="currentPanel"
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
import { ArrowLeft, Loading } from '@element-plus/icons-vue'
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
const { stop: stopPolling } = useScadaPolling({
  interval: systemStore.visualizationConfig.pollingInterval,
  reader: pointReader
})

const currentPanel = computed(() => scada.currentPanel)

/** 加载遮罩状态：为 true 时 canvas 被完全遮住，避免闪显上一次残留的面板数据 */
const loading = ref(true)

/** 统一的面板加载入口：负责显示遮罩 → 清理旧面板累积状态 → 加载面板 → 隐藏遮罩 */
async function initPanel(panelId: string) {
  loading.value = true
  try {
    // 切面板时主动清空上一面板的所有设备缓存 + abort 在途请求：
    // 避免 skeletonCache / historyRequestCache / inflightDeviceFetches 累积到退出时一次性清理造成卡顿。
    // clearDevices 内部会新建 AbortController，后续 loadPanel 触发的新轮询请求会使用新 controller 的 signal
    pointReader.clearDevices()

    const panel = await scada.loadPanel(panelId)
    if (!panel) {
      // 加载失败：清空模块级 currentPanelId，让 currentPanel computed 返回 null，
      // 避免遮罩收起后 v-else-if 匹配到上一次残留的面板数据
      scada.currentPanelId.value = null
    }
    // loadPanel 后 boundAssets 变化 → boundAssets watch 自动触发 refreshBoundDevices
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const panelId = route.params.id as string
  if (panelId) {
    scada.isFullscreenPreview.value = true
    // 必须在 loadPanel 前设置：确保 boundAssets watch 触发时 refreshBoundDevices 不被 isEditing 短路
    scada.isEditing.value = false
    // 预览模式重置编辑器 zoom，由 useScadaAdapt 负责适配缩放
    scada.zoom.value = 1
    await initPanel(panelId)
  } else {
    loading.value = false
  }
})

/** 监听路由参数变化（导航按钮跳转到同路由不同面板时，组件不会重新挂载，需手动重载） */
watch(() => route.params.id, async (newId) => {
  if (newId && newId !== scada.currentPanelId.value) {
    await initPanel(newId as string)
    // loadPanel 后 boundAssets 变化 → boundAssets watch 自动触发 refreshBoundDevices
  }
})

onUnmounted(() => {
  scada.isEditing.value = true
  scada.isFullscreenPreview.value = false
  pointReader.clearDevices()
  stopPolling()
})

/** 退出预览：先显示全屏遮罩立即遮盖 canvas（避免清理阻塞时画面卡顿暴露），
 * 用双 rAF 保证遮罩先被浏览器 paint 到屏幕（单 rAF 在 paint 前执行 router.push，
 * 用户完全感知不到遮罩存在），再执行导航让组件卸载 + AbortController 取消请求
 * 与新页面加载平滑衔接 */
const handleGoBack = () => {
  loading.value = true
  // 双 rAF：第 1 帧让 Vue 更新 DOM（遮罩 v-if 生效），第 2 帧在浏览器 paint 之后再导航
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      router.push({ name: 'ScadaList' })
    })
  })
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

/* ── 加载遮罩 ───────────────────────────────────────────── */
.loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #1a1a2e;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #fff;
}

.loading-spinner {
  animation: scada-preview-spin 1s linear infinite;
}

@keyframes scada-preview-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
  opacity: 0.7;
  letter-spacing: 1px;
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