<template>
  <div v-if="!isReady" class="loading-state" v-loading="true" :element-loading-text="$t('common.loading')">
  </div>
  <div v-else class="scada-page" :class="{ 'preview-mode': isPreviewMode }">
    <div v-if="!isPreviewMode" class="page-header">
      <div class="header-left">
        <el-button :icon="ArrowLeft" @click="handleGoBack">{{ $t('scada.backToList') }}</el-button>
        <span class="project-name">{{ currentPanel?.name }}</span>
      </div>
      <div class="header-actions">
        <el-button :icon="View" @click="handlePreview">{{ $t('scada.preview') }}</el-button>
        <el-button :icon="FullScreen" @click="handleFullscreen">{{ $t('scada.fullscreen') }}</el-button>
        <el-button @click="handleExport">{{ $t('common.export') }}</el-button>
        <el-button @click="handleImport">{{ $t('common.import') }}</el-button>
        <el-button v-if="userStore.hasPermission('scada', 'update')" @click="handleSave">{{ $t('common.save') }}</el-button>
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
            <span class="component-count">{{ $t('scada.componentCount', { count: currentPanel!.components.length }) }}</span>
          </div>
        </div>

        <div class="canvas-wrapper">
          <ScadaCanvas />
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useScadaEditor } from './hooks/useScadaEditor'
import { useUserStore } from '@/stores/users'
import { usePointStore } from '@/stores/points'
import { ElMessage, ElMessageBox } from 'element-plus'
import { FullScreen, View, ArrowLeft } from '@element-plus/icons-vue'
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
const isReady = ref(false)
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
  await scada.loadPanel(route.params.id as string)
  await pointStore.fetchDevicesWithPoints()
  isReady.value = true
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
  } catch {
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
  background: var(--bg-secondary);
  position: relative;
  z-index: 1;
  height: 100%;
}

.scada-page.preview-mode {
  background: #1a1a2e;
}

.page-header {
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

.project-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.header-actions {
  display: flex;
  gap: 8px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.preview-title {
  font-size: 16px;
  font-weight: 500;
}

.preview-actions {
  display: flex;
  gap: 8px;
}

.scada-editor {
  flex: 1;
  display: flex;
  min-height: 0;
  background: var(--bg-secondary);
  position: relative;
}

.preview-mode .scada-editor {
  background: #1a1a2e;
}

.editor-left {
  width: 280px;
  flex-shrink: 0;
  background: var(--bg-container);
  border-right: 1px solid var(--border-base);
}

.editor-list {
  width: 220px;
  flex-shrink: 0;
  background: var(--bg-container);
  border-right: 1px solid var(--border-base);
  transition: width 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;
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
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  background: var(--bg-container);
  border-bottom: 1px solid var(--border-base);
  flex-shrink: 0;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.shortcut-btn {
  font-size: 12px;
  padding: 0 8px;
  color: var(--text-secondary);
  cursor: pointer;
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
  padding: 2px 6px;
  font-size: 12px;
  font-family: inherit;
  color: var(--text-primary);
  background: var(--bg-secondary);
  border: 1px solid var(--border-base);
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  min-width: 20px;
  height: 20px;
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
  font-size: 12px;
  color: var(--text-secondary);
}

.canvas-wrapper {
  flex: 1;
  overflow: auto;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: var(--bg-container);
}

.editor-right {
  width: 280px;
  flex-shrink: 0;
  background: var(--bg-container);
  border-left: 1px solid var(--border-base);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.loading-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: var(--bg-secondary);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  margin: 0 0 16px 0;
  font-size: 14px;
}
</style>
