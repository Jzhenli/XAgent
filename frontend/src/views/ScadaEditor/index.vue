<template>
  <div class="scada-page" :class="{ 'preview-mode': isPreviewMode }">
    <div v-if="!isPreviewMode" class="page-header">
      <div class="header-left">
        <Icon
          name="arrowLeft"
          type="mono-line"
          :size="28"
          :color="{ normal: 'var(--text-primary)' }"
          @click="handleGoBack"
        />
        <span class="project-name">{{ currentPanel?.name || 'Loading...' }}</span>
      </div>
      <div class="header-actions">
        <div class="action-btn" @click="handlePreview">
          <el-icon :size="16"><View /></el-icon>
          <span>{{ $t('scada.preview') }}</span>
        </div>
        <div class="action-btn" @click="handleFullscreen">
          <el-icon :size="16"><FullScreen /></el-icon>
          <span>{{ $t('scada.fullscreen') }}</span>
        </div>
        <div class="action-btn" @click="handleExport">
          <el-icon :size="16"><Download /></el-icon>
          <span>{{ $t('common.export') }}</span>
        </div>
        <div class="action-btn" @click="handleImport">
          <el-icon :size="16"><Upload /></el-icon>
          <span>{{ $t('common.import') }}</span>
        </div>
        <div v-if="userStore.hasPermission('scada', 'update')" class="action-btn" @click="handleSave">
          <el-icon :size="16"><Check /></el-icon>
          <span>{{ $t('common.save') }}</span>
        </div>
      </div>
    </div>

    <div v-if="isPreviewMode" class="preview-header">
      <span class="preview-title">{{ currentPanel!.name }}</span>
      <div class="preview-actions">
        <el-button size="small" @click="handleExitPreview">{{ $t('scada.exitPreview') }}</el-button>
      </div>
    </div>

    <div class="scada-editor">
      <div v-if="!isPreviewMode" class="editor-left">
        <ComponentPalette :showComponentList="showComponentList" @toggleList="showComponentList = !showComponentList" />
      </div>

      <div v-if="!isPreviewMode" class="editor-list" :class="{ collapsed: !showComponentList }">
        <div v-if="showComponentList" class="list-panel">
          <ComponentList />
        </div>
      </div>

      <div class="editor-center">
        <div v-if="!isPreviewMode" class="editor-toolbar">
          <div class="toolbar-left">
            <el-button-group>
              <el-button
                size="small"
                :disabled="!scada.canUndo.value"
                @click="scada.undo()"
                :title="$t('scada.undo')"
              >
                ↩
              </el-button>
              <el-button
                size="small"
                :disabled="!scada.canRedo.value"
                @click="scada.redo()"
                :title="$t('scada.redo')"
              >
                ↪
              </el-button>
            </el-button-group>
            <el-button-group>
              <el-button size="small" @click="handleZoomOut">-</el-button>
              <el-button size="small" @click="handleZoomReset">{{ Math.round(scada.zoom.value * 100) }}%</el-button>
              <el-button size="small" @click="handleZoomIn">+</el-button>
            </el-button-group>
            <el-checkbox v-model="scada.showGrid.value" size="small">{{ $t('scada.showGrid') }}</el-checkbox>
            <el-checkbox v-model="scada.isEditing.value" size="small">{{ $t('scada.editMode') }}</el-checkbox>
            <el-popover placement="bottom-start" :width="320" trigger="hover">
              <template #reference>
                <el-button size="small" text class="shortcut-btn">
                  ⌨️ {{ $t('scada.shortcuts') }}
                </el-button>
              </template>
              <div class="shortcut-list">
                <div class="shortcut-item">
                  <span class="key-group"><kbd>Ctrl</kbd> + <kbd>C</kbd></span>
                  <span class="desc">{{ $t('scada.copy') }}</span>
                </div>
                <div class="shortcut-item">
                  <span class="key-group"><kbd>Ctrl</kbd> + <kbd>V</kbd></span>
                  <span class="desc">{{ $t('scada.paste') }}</span>
                </div>
                <div class="shortcut-item">
                  <span class="key-group"><kbd>Ctrl</kbd> + <kbd>D</kbd></span>
                  <span class="desc">{{ $t('scada.duplicate') }}</span>
                </div>
                <div class="shortcut-item">
                  <span class="key-group"><kbd>Delete</kbd></span>
                  <span class="desc">{{ $t('scada.delete') }}</span>
                </div>
                <div class="shortcut-item">
                  <span class="key-group"><kbd>←</kbd><kbd>→</kbd><kbd>↑</kbd><kbd>↓</kbd></span>
                  <span class="desc">{{ $t('scada.move') }}</span>
                </div>
                <div class="shortcut-item">
                  <span class="key-group"><kbd>Esc</kbd></span>
                  <span class="desc">{{ $t('scada.closeMenu') }}</span>
                </div>
                <div class="shortcut-item">
                  <span class="key-group"><kbd>Ctrl</kbd> + <kbd>Z</kbd></span>
                  <span class="desc">{{ $t('scada.undo') }}</span>
                </div>
                <div class="shortcut-item">
                  <span class="key-group"><kbd>Ctrl</kbd> + <kbd>Y</kbd></span>
                  <span class="desc">{{ $t('scada.redo') }}</span>
                </div>
              </div>
            </el-popover>
          </div>
          <div class="toolbar-right">
            <span class="component-count">{{ $t('scada.componentCount', { count: currentPanel?.components.length ?? 0 }) }}</span>
          </div>
        </div>

        <div ref="canvasWrapperRef" class="canvas-wrapper" @wheel="handleCanvasWheel">
          <ScadaCanvas v-if="!isLoading" />
          <div v-else class="canvas-loading">
            <div class="loading-spinner">
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
            </div>
            <span class="loading-text">{{ $t('common.loading') }}</span>
          </div>
        </div>
      </div>

      <div v-if="!isPreviewMode" class="editor-right">
        <ComponentConfig />
      </div>
    </div>

    <input
      ref="importInputRef"
      type="file"
      accept=".json"
      style="display: none"
      @change="handleImportFileChange"
    />

    <SaveConfirmModal
      :visible="showSaveConfirm"
      @save="handleConfirmSave"
      @discard="handleConfirmDiscard"
      @cancel="handleCancelConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useScadaEditor } from './hooks/useScadaEditor'
import { useUserStore } from '@/stores/users'
import { usePointStore } from '@/stores/points'
import { ElMessage, ElMessageBox } from 'element-plus'
import { FullScreen, View, Download, Upload, Check } from '@element-plus/icons-vue'
import { Icon } from '@/icon'
import { clamp } from './utils/math'
import { useScadaData } from './hooks/useScadaEditor'
import { useScadaNavigationGuard } from './hooks/useScadaNavigationGuard'
import ComponentPalette from './components/ComponentPalette.vue'
import ComponentList from './components/ComponentList.vue'
import ScadaCanvas from './components/ScadaCanvas.vue'
import ComponentConfig from './components/ComponentConfig.vue'
import SaveConfirmModal from './modal/SaveConfirmModal.vue'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const scada = useScadaEditor()
const userStore = useUserStore()
const pointStore = usePointStore()

const { currentPanel, exportPanel, importPanel } = useScadaData()

const isPreviewMode = ref(false)
const showComponentList = ref(false)
const isLoading = ref(true)
const importInputRef = ref<HTMLInputElement | null>(null)

const {
  showSaveConfirm,
  startLeaveConfirmation,
  confirmSave: handleConfirmSave,
  confirmDiscard: handleConfirmDiscard,
  cancelConfirm: handleCancelConfirm
} = useScadaNavigationGuard({
  isDirty: scada.isDirty,
  routeName: 'ScadaEditor',
  onSave: async () => {
    try {
      await scada.savePanel()
      ElMessage.success(t('scada.savePanelSuccess'))
      router.push({ name: 'ScadaList' })
    } catch (e) {
      console.error('Failed to save panel:', e)
      ElMessage.error(t('common.operationFailed'))
    }
  },
  onDiscard: () => {
    scada.discardDraft()
    router.push({ name: 'ScadaList' })
  }
})

onMounted(async () => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)

  const panelId = route.params.id as string
  const results = await Promise.allSettled([
    scada.loadPanel(panelId),
    pointStore.fetchDevicesWithPoints()
  ])

  if (results[0].status === 'rejected') {
    console.error('Failed to load panel:', results[0].reason)
    ElMessage.error(t('scada.loadPanelFailed'))
  } else if (results[0].value === null) {
    console.error('Panel not found or failed to parse:', panelId)
    ElMessage.error(t('scada.loadPanelFailed'))
  }
  if (results[1].status === 'rejected') {
    console.error('Failed to load devices:', results[1].reason)
    ElMessage.error(t('scada.loadDevicesFailed'))
  }

  isLoading.value = false
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})

const handleGoBack = () => {
  if (scada.isDirty.value) {
    startLeaveConfirmation()
  } else {
    router.push({ name: 'ScadaList' })
  }
}

const setPreviewMode = (enabled: boolean, fullscreen = false) => {
  isPreviewMode.value = enabled
  scada.isFullscreenPreview.value = fullscreen
  scada.isEditing.value = !enabled
}

const handleFullscreenChange = () => {
  if (!document.fullscreenElement && scada.isFullscreenPreview.value) {
    setPreviewMode(false, false)
  }
}

const handleZoomIn = () => {
  scada.zoom.value = clamp(scada.zoom.value + 0.1, 0.5, 2)
}

const handleZoomOut = () => {
  scada.zoom.value = clamp(scada.zoom.value - 0.1, 0.5, 2)
}

const handleZoomReset = () => {
  scada.zoom.value = 1
}

/** 画布视口容器引用（外层滚动区域） */
const canvasWrapperRef = ref<HTMLDivElement | null>(null)

/**
 * 滚轮缩放画布：以光标为锚点缩放，保持光标下的内容点位置不动
 * @param e - 滚轮事件
 */
const handleCanvasWheel = (e: WheelEvent) => {
  // 仅编辑模式接管滚轮；预览模式保留原生滚动
  if (!scada.isEditing.value) return
  // 纯横向滚动（如触控板横滑）交还给浏览器处理
  if (e.deltaY === 0) return

  const wrapper = canvasWrapperRef.value
  const canvasEl = wrapper?.querySelector('.scada-canvas') as HTMLElement | null
  if (!wrapper || !canvasEl) return

  e.preventDefault()

  const oldZoom = scada.zoom.value
  const newZoom = clamp(oldZoom + (e.deltaY < 0 ? 0.1 : -0.1), 0.5, 2)
  if (newZoom === oldZoom) return

  // 缩放前光标相对画布左上角的屏幕像素偏移
  const rect = canvasEl.getBoundingClientRect()
  const offsetX = e.clientX - rect.left
  const offsetY = e.clientY - rect.top

  scada.zoom.value = newZoom

  // DOM 尺寸更新后调整滚动量，使光标下的画布内容点仍位于光标处
  nextTick(() => {
    const newRect = canvasEl.getBoundingClientRect()
    const scale = newZoom / oldZoom
    wrapper.scrollLeft += newRect.left - (e.clientX - offsetX * scale)
    wrapper.scrollTop += newRect.top - (e.clientY - offsetY * scale)
  })
}

const handleSave = async () => {
  try {
    await scada.savePanel()
    ElMessage.success(t('scada.savePanelSuccess'))
  } catch (e) {
    console.error('Failed to save panel:', e)
    ElMessage.error(t('common.operationFailed'))
  }
}

const handlePreview = () => {
  setPreviewMode(true)
}

const handleExitPreview = () => {
  setPreviewMode(false)
  if (document.fullscreenElement) {
    document.exitFullscreen()
  }
}

const handleFullscreen = () => {
  const elem = document.documentElement
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  }
  setPreviewMode(true, true)
}

const handleExport = () => {
  exportPanel()
  ElMessage.success(t('scada.exportSuccess'))
}

const handleImport = () => {
  importInputRef.value?.click()
}

const handleImportFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    const text = await file.text()
    const panel = await importPanel(text)
    if (panel) {
      ElMessage.success(t('scada.importSuccess'))
    } else {
      ElMessage.error(t('scada.invalidPanelFile'))
    }
  } catch (e) {
    console.error('Failed to import panel:', e)
    ElMessage.error(t('scada.importFailed'))
  } finally {
    input.value = ''
  }
}
</script>

<style scoped>
.scada-page {
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  position: relative;
  z-index: 1;
  height: 100%;
  
}

.scada-page.preview-mode {
  background: radial-gradient(ellipse at center, #0f172a 0%, #020617 100%);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px;
  background: var(--bg-header);
  backdrop-filter: blur(10px);
  border-bottom: var(--scada-border-glow);
  flex-shrink: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.project-name {
  font-size: 18px;
  font-weight: 600;
  line-height: 28px;
  color: var(--text-primary);
  letter-spacing: 1px;
  text-shadow: 0 0 12px var(--scada-cyan-glow);
}

.header-actions {
  display: flex;
  gap: 6px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  height: 32px;
  font-size: 14px;
  line-height: 1;
  color: var(--text-primary);
  background: var(--bg-color);
  border: 1px solid var(--border-base);
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.action-btn:hover {
  color: var(--scada-cyan);
  background: var(--scada-bg-hover);
  border-color: var(--scada-cyan);
  box-shadow: 0 0 8px var(--scada-cyan-glow);
  transform: translateY(-1px);
}

.action-btn:active {
  color: var(--color-primary-active, var(--scada-cyan));
  background: var(--color-primary-light, var(--scada-bg-hover));
  border-color: var(--color-primary-active, var(--scada-cyan));
  transform: translateY(0);
  box-shadow: none;
  transition-duration: 0.05s;
}

.action-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--scada-cyan-glow);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 24px;
  background: var(--bg-header);
  color: var(--text-primary);
  flex-shrink: 0;
  backdrop-filter: blur(10px);
  border-bottom: var(--scada-border-glow);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.preview-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--scada-cyan);
  text-shadow: 0 0 12px var(--scada-cyan-glow);
}

.preview-actions {
  display: flex;
  gap: 8px;
}

.scada-editor {
  flex: 1;
  display: flex;
  min-height: 0;
  background: radial-gradient(ellipse at center bottom, rgba(34, 211, 238, 0.03) 0%, var(--bg-card) 70%);
  position: relative;
}

.preview-mode .scada-editor {
  background: radial-gradient(ellipse at center, #0f172a 0%, #020617 100%);
}

.editor-left {
  width: 280px;
  flex-shrink: 0;
  background: var(--scada-bg-elevated);
  backdrop-filter: blur(10px);
  border-right: var(--scada-border-glow);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.2);
}

.editor-list {
  width: 220px;
  flex-shrink: 0;
  background: var(--scada-bg-elevated);
  backdrop-filter: blur(10px);
  border-right: var(--scada-border-glow);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.2);
}

.editor-list.collapsed {
  width: 0;
  overflow: hidden;
}

.editor-list .list-panel {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.editor-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.editor-toolbar {
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  background: var(--scada-bg-elevated);
  backdrop-filter: blur(10px);
  border-bottom: var(--scada-border-glow);
  flex-shrink: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.shortcut-btn {
  font-size: 12px;
  padding: 4px 12px;
  color: var(--text-secondary);
  cursor: pointer;
  border: 1px solid rgba(34, 211, 238, 0.3);
  border-radius: 4px;
  background: rgba(34, 211, 238, 0.05);
  transition: all 0.2s;
}

.shortcut-btn:hover {
  color: var(--scada-cyan);
  border-color: var(--scada-cyan);
  background: rgba(34, 211, 238, 0.1);
  box-shadow: 0 0 10px var(--scada-cyan-glow);
}

.shortcut-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.shortcut-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 4px 0;
  font-size: 13px;
}

.key-group {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  font-size: 12px;
  font-family: inherit;
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(34, 211, 238, 0.3);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 -1px 0 rgba(255, 255, 255, 0.1);
  min-width: 24px;
  height: 22px;
}

.desc {
  color: var(--text-secondary);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.component-count {
  font-size: 13px;
  color: var(--scada-cyan);
  font-weight: 500;
  padding: 4px 12px;
  background: rgba(34, 211, 238, 0.1);
  border: 1px solid rgba(34, 211, 238, 0.3);
  border-radius: 12px;
}

.canvas-wrapper {
  flex: 1;
  overflow: auto;
  padding: 30px;
  display: flex;
  align-items: flex-start;
  background-color: var(--bg-card);
  position: relative;
}

/* 画布保持自身尺寸不被 flex 压缩（flex-shrink 默认为 1 会把画布压到视口宽度，导致无溢出、无滚动条），并用 auto 外边距居中：超出视口时边距归零，保证水平方向可完整滚动 */
.canvas-wrapper > :deep(.scada-canvas) {
  flex-shrink: 0;
  margin: 0 auto;
}

/* 画布滚动条：全局样式在黑色主题下与背景对比度过低，此处用中性灰色提升可见性 */
.canvas-wrapper {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.35) transparent;
}

.canvas-wrapper::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.canvas-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.canvas-wrapper::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.35);
  border-radius: 5px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.canvas-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.55);
  border: 2px solid transparent;
  background-clip: padding-box;
}

.canvas-wrapper::-webkit-scrollbar-corner {
  background: transparent;
}

.canvas-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  background-color: rgba(2, 6, 23, 0.9);
  z-index: 10;
  backdrop-filter: blur(4px);
}

.loading-spinner {
  position: relative;
  width: 64px;
  height: 64px;
}

.spinner-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: var(--scada-cyan);
  box-shadow: 0 0 20px var(--scada-cyan-glow);
  animation: spin-ring 1.4s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring:nth-child(2) {
  inset: 8px;
  border-top-color: var(--scada-purple);
  box-shadow: 0 0 20px var(--scada-purple-glow);
  animation-duration: 1.6s;
  animation-direction: reverse;
}

.spinner-ring:nth-child(3) {
  inset: 16px;
  border-top-color: #818cf8;
  box-shadow: 0 0 15px rgba(129, 140, 248, 0.4);
  animation-duration: 1.2s;
}

@keyframes spin-ring {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 15px;
  color: var(--scada-cyan);
  letter-spacing: 2px;
  font-weight: 500;
  text-shadow: 0 0 10px var(--scada-cyan-glow);
  animation: pulse-text 2s ease-in-out infinite;
}

@keyframes pulse-text {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.editor-right {
  width: 300px;
  flex-shrink: 0;
  background: var(--scada-bg-elevated);
  backdrop-filter: blur(10px);
  border-left: var(--scada-border-glow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.2);
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: transparent;
}

.empty-icon {
  font-size: 72px;
  margin-bottom: 16px;
  filter: drop-shadow(0 0 20px var(--scada-cyan-glow));
}

.empty-state p {
  margin: 0 0 16px 0;
  font-size: 14px;
}
</style>
