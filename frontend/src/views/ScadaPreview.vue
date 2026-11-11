<template>
  <div class="preview-page">
    <!-- 画布常驻区：只要 currentPanel 存在就渲染，不随 loading 遮罩互斥销毁 -->
    <!-- key 去掉：让 Vue 按组件自身 comp.id 做 diff 复用，而非整个组件树重建 -->
    <div
      v-if="currentPanel"
      ref="adaptContainerRef"
      class="preview-content"
      :style="adaptContainerStyle"
    >
      <div class="canvas-frame" :style="adaptFrameStyle">
        <div class="canvas-scale" :style="adaptScaleStyle">
          <ScadaCanvas />
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!loading" class="empty-state">
      <el-empty :description="$t('scada.projectNotExist')">
        <el-button type="primary" @click="handleGoBack">{{ $t('scada.backToProjectList') }}</el-button>
      </el-empty>
    </div>

    <!-- 加载遮罩：覆盖层 z-index 在 canvas 之上，不销毁 canvas DOM -->
    <!-- 好处: canvas 在遮罩下继续响应式渲染新数据，loading=false 时可立即 paint -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <el-icon class="loading-spinner" :size="36"><Loading /></el-icon>
        <span class="loading-text">{{ $t('common.loading') }}</span>
      </div>
    </div>

    <div class="floating-back" @click="handleGoBack">
      <el-icon :size="20"><ArrowLeft /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useScadaEditor } from '@/views/ScadaEditor/hooks/useScadaEditor'
import { useScadaAdapt } from '@/views/ScadaEditor/hooks/useScadaAdapt'
import { useScadaPolling } from '@/views/ScadaEditor/hooks/useScadaBinding'
import { useScadaPointReader, ScadaPointReaderKey } from '@/utils/scadaPointReader'
import { ArrowLeft, Loading } from '@element-plus/icons-vue'
import ScadaCanvas from '@/views/ScadaEditor/components/ScadaCanvas.vue'
import { useSystemStore } from '@/stores/system'
import { panelStore } from '@/utils/panelStore'

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

/** 统一的面板加载入口：显示遮罩 → 清理旧状态 → 加载面板 → 等 canvas 渲染完 → 移除遮罩 */
async function initPanel(panelId: string, forceNetwork = false) {
  loading.value = true
  try {
    pointReader.clearDevices()   // 轻量重置：abort 在途请求 + 清运行时状态，保留 devices/skeletonCache
    const panel = await scada.loadPanel(panelId, forceNetwork)  // forceNetwork=true 跳过缓存，默认 IndexedDB 优先
    if (!panel) {
      scada.currentPanelId.value = null  // 加载失败让 currentPanel computed 返回 null
    }
    // loadPanel 内部 applyProjectData 已经更新 sourcePanel → ScadaCanvas 响应式拿到新数据
    // boundAssets 变化 → boundAssets watch 自动触发 refreshBoundDevices
  } finally {
    // 🆕 等 Vue 完成 canvas DOM 更新（v-for diff 新组件）再移除遮罩
    // 去掉 :key 后是组件级 diff 而非完全重建，安卓平板上 ~300ms → ~100ms
    await nextTick()
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
    await initPanel(panelId, true)  // 首次进入预览：强制从后端拿最新数据

    // 🆕 首屏加载完后，后台预加载所有项目进 IndexedDB（不阻塞遮罩，让用户先看到画面）
    // 后续 nav-button 面板间跳转直接命中 IndexedDB，遮罩可见从 ~1.3s 降到 ~310ms
    panelStore.preloadAll()
  } else {
    loading.value = false
  }
})

/** 监听路由参数变化（导航按钮跳转到同路由不同面板时，组件不会重新挂载，需手动重载） */
watch(() => route.params.id, async (newId) => {
  if (newId && newId !== scada.currentPanelId.value) {
    await initPanel(newId as string, false)  // 预览内跳转：用 IndexedDB 缓存
    // loadPanel 后 boundAssets 变化 → boundAssets watch 自动触发 refreshBoundDevices
  }
})

onUnmounted(() => {
  scada.isEditing.value = true
  scada.isFullscreenPreview.value = false
  pointReader.clearDevices()
  stopPolling()
})

/** 退出预览：先彻底清空所有设备缓存（防内存泄漏），再清空 IndexedDB，
 * 用双 rAF 保证遮罩先被浏览器 paint 到屏幕，再执行导航让组件卸载 + AbortController 取消请求
 * 与新页面加载平滑衔接 */
const handleGoBack = () => {
  pointReader.clearAll()   // 用户主动退出预览态 → 彻底清空所有数据缓存
  panelStore.clear()       // 🆕 清空 IndexedDB（退出预览会话）

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
  /* P1-2：移除 box-shadow 模糊阴影 —— 低端平板 GPU 栅格化代价高，
     整屏画布上的阴影模糊会在每次子组件变更时触发大范围重栅格化，
     与 System 74% 的重合成直接相关；改用轻量 outline 保留面板边界感 */
  outline: 1px solid rgba(255, 255, 255, 0.08);
  /* 禁止 flex 收缩，保证滚动模式下的布局尺寸正确 */
  flex-shrink: 0;
}

.canvas-scale {
  transform-origin: top left;
  /* P1-2：稳定合成层 —— 显式告知浏览器该层会做 transform 动画，
     避免子组件每次变更都触发整层栅格化重绘；
     contain: layout paint 限制子树独立渲染域，进一步降低 paint 扇出 */
  will-change: transform;
  contain: layout paint;
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
}

.floating-back:hover {
  background: rgba(255, 255, 255, 0.22);
}
</style>