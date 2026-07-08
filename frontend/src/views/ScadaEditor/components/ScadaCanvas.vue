<template>
  <div
    ref="canvasRef"
    class="scada-canvas"
    :style="{
      width: `${panel?.width || 1200}px`,
      height: `${panel?.height || 800}px`,
      backgroundColor: panel?.backgroundColor || '#f0f2f5',
      backgroundImage: panel?.backgroundImage ? `url(${panel.backgroundImage})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transform: `scale(${scadaStore.zoom})`,
      transformOrigin: 'top left'
    }"
    @drop="handleDrop"
    @dragover="handleDragOver"
    @click="handleCanvasClick"
    @contextmenu.prevent="handleCanvasContextMenu"
    @mousedown="handleCanvasMouseDown"
    @mousemove="handleCanvasMouseMove"
    @mouseenter="handleCanvasMouseEnter"
    @mouseleave="handleCanvasMouseLeave"
  >
    <div v-if="scadaStore.showGrid && isEditing" class="canvas-grid" :style="{ backgroundSize: `${panel?.grid || 20}px ${panel?.grid || 20}px` }" />

    <div
      v-for="comp in components"
      :key="comp.id"
      class="scada-component"
      :class="{ selected: selectedIds.includes(comp.id), 'multi-selected': selectedIds.length > 1, locked: comp.locked, editing: isEditing }"
      :style="getComponentStyle(comp)"
      @mousedown="handleComponentMouseDown($event, comp)"
      @click="handleComponentClick($event, comp)"
      @contextmenu.prevent="handleContextMenu($event, comp)"
    >
      <component :is="getComponent(comp.type)" v-if="getComponent(comp.type)" :config="comp" :editing="isEditing" />

      <template v-if="selectedId === comp.id && isEditing && selectedIds.length === 1">
        <div class="resize-handle nw" @mousedown.stop="handleResizeStart($event, 'nw')"></div>
        <div class="resize-handle n" @mousedown.stop="handleResizeStart($event, 'n')"></div>
        <div class="resize-handle ne" @mousedown.stop="handleResizeStart($event, 'ne')"></div>
        <div class="resize-handle e" @mousedown.stop="handleResizeStart($event, 'e')"></div>
        <div class="resize-handle se" @mousedown.stop="handleResizeStart($event, 'se')"></div>
        <div class="resize-handle s" @mousedown.stop="handleResizeStart($event, 's')"></div>
        <div class="resize-handle sw" @mousedown.stop="handleResizeStart($event, 'sw')"></div>
        <div class="resize-handle w" @mousedown.stop="handleResizeStart($event, 'w')"></div>
      </template>
    </div>

    <div
      v-if="isBoxSelecting"
      class="selection-box"
      :style="{
        left: `${Math.min(boxSelectStart.x, boxSelectEnd.x)}px`,
        top: `${Math.min(boxSelectStart.y, boxSelectEnd.y)}px`,
        width: `${Math.abs(boxSelectEnd.x - boxSelectStart.x)}px`,
        height: `${Math.abs(boxSelectEnd.y - boxSelectStart.y)}px`
      }"
    />

    <svg v-if="guideLines.length" class="alignment-guides" :width="panel?.width || 1200" :height="panel?.height || 800">
      <line
        v-for="(guide, index) in guideLines"
        :key="index"
        :x1="guide.type === 'x' ? guide.pos : 0"
        :y1="guide.type === 'x' ? 0 : guide.pos"
        :x2="guide.type === 'x' ? guide.pos : (panel?.width || 1200)"
        :y2="guide.type === 'x' ? (panel?.height || 800) : guide.pos"
        stroke="#ff4d4f"
        stroke-width="1"
        stroke-dasharray="4 4"
        vector-effect="non-scaling-stroke"
      />
    </svg>

    <Teleport to="body">
      <div v-if="contextMenuVisible && isEditing" class="context-menu-overlay" @click="hideContextMenu">
        <div class="context-menu" :style="{ left: `${contextMenuPosition.x}px`, top: `${contextMenuPosition.y}px` }" @click.stop>
          <template v-if="contextMenuType === 'node'">
            <div class="context-menu-item" @click="handleContextAction('copy')">
              <el-icon class="menu-icon"><CopyDocument /></el-icon>
              <span class="menu-label">{{ t('scadaContextMenu.copy') }}</span>
            </div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item" @click="handleContextAction(targetComponent?.locked ? 'unlock' : 'lock')">
              <el-icon class="menu-icon">
                <component :is="targetComponent?.locked ? Unlock : Lock" />
              </el-icon>
              <span class="menu-label">{{ targetComponent?.locked ? t('scadaContextMenu.unlock') : t('scadaContextMenu.lock') }}</span>
            </div>
            <div class="context-menu-item" @click="handleContextAction('delete')">
              <el-icon class="menu-icon"><Delete /></el-icon>
              <span class="menu-label">{{ t('scadaContextMenu.delete') }}</span>
            </div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item" @click="handleContextAction('bringToFront')">
              <el-icon class="menu-icon"><Top /></el-icon>
              <span class="menu-label">{{ t('scadaContextMenu.bringToFront') }}</span>
            </div>
            <div class="context-menu-item" @click="handleContextAction('sendToBack')">
              <el-icon class="menu-icon"><Bottom /></el-icon>
              <span class="menu-label">{{ t('scadaContextMenu.sendToBack') }}</span>
            </div>
          </template>
          <template v-else>
            <div v-if="scadaStore.clipboard" class="context-menu-item" @click="handleContextAction('paste')">
              <el-icon class="menu-icon"><Document /></el-icon>
              <span class="menu-label">{{ t('scadaContextMenu.paste') }}</span>
            </div>
            <div v-else class="context-menu-item disabled">
              <el-icon class="menu-icon"><Document /></el-icon>
              <span class="menu-label">{{ t('scadaContextMenu.noClipboard') }}</span>
            </div>
          </template>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScadaStore } from '@/stores/scada'
import type { ComponentType, ScadaComponent } from '@/types/scada'
import { getComponent } from '../component-registry'
import { useScadaCanvas, useScadaElement } from '../hooks'
import { getCanvasPositionFromEvent } from '../utils/dom'
import { CopyDocument, Document, Lock, Unlock, Delete, Top, Bottom } from '@element-plus/icons-vue'

const { t } = useI18n()
const scadaStore = useScadaStore()

const canvasRef = ref<HTMLElement | null>(null)

const {
  isBoxSelecting,
  boxSelectStart,
  boxSelectEnd,
  guideLines,
  contextMenuVisible,
  contextMenuPosition,
  contextMenuType,
  targetComponent,
  panel,
  components,
  selectedId,
  selectedIds,
  isEditing,
  getComponentStyle,
  handleCanvasMouseMove,
  handleCanvasMouseEnter,
  handleCanvasMouseLeave,
  handleComponentMouseDown,
  handleResizeStart,
  handleCanvasClick,
  handleCanvasMouseDown,
  handleComponentClick,
  handleContextMenu,
  handleCanvasContextMenu,
  hideContextMenu,
  handleContextAction
} = useScadaCanvas(canvasRef)

const { addComponent } = useScadaElement()

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  if (!isEditing.value || !canvasRef.value) return

  const type = e.dataTransfer?.getData('component-type') as ComponentType
  if (!type) return

  const pos = getCanvasPositionFromEvent(canvasRef.value, e, scadaStore.zoom)
  addComponent(type, pos.x, pos.y)
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
}
</script>

<style scoped>
.scada-canvas {
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-base);
  border-radius: 4px;
}

.canvas-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(var(--grid-line, rgba(0, 0, 0, 0.05)) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line, rgba(0, 0, 0, 0.05)) 1px, transparent 1px);
  pointer-events: none;
}

.selection-box {
  position: absolute;
  border: 1px dashed var(--color-primary);
  background-color: rgba(64, 158, 255, 0.1);
  pointer-events: none;
  z-index: 1000;
}

.alignment-guides {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1001;
}

.hidden-file-input {
  display: none;
}

.scada-component {
  position: absolute;
  cursor: move;
  user-select: none;
}

.scada-component.editing:hover {
  outline: 1px dashed var(--color-primary);
}

.scada-component.selected {
  outline: 2px solid var(--color-primary);
  box-shadow: 0 0 10px var(--color-primary-light);
}

.scada-component.selected.multi-selected {
  outline: 2px dashed var(--color-primary);
  background-color: rgba(64, 158, 255, 0.05);
}

.scada-component.locked {
  cursor: not-allowed;
  opacity: 0.7;
}

.resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--color-primary);
  border: 2px solid var(--bg-container);
  border-radius: 2px;
  z-index: 10;
}

.resize-handle.nw { top: -5px; left: -5px; cursor: nw-resize; }
.resize-handle.n { top: -5px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
.resize-handle.ne { top: -5px; right: -5px; cursor: ne-resize; }
.resize-handle.e { top: 50%; right: -5px; transform: translateY(-50%); cursor: e-resize; }
.resize-handle.se { bottom: -5px; right: -5px; cursor: se-resize; }
.resize-handle.s { bottom: -5px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
.resize-handle.sw { bottom: -5px; left: -5px; cursor: sw-resize; }
.resize-handle.w { top: 50%; left: -5px; transform: translateY(-50%); cursor: w-resize; }

.context-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.context-menu {
  position: fixed;
  min-width: 180px;
  background: var(--bg-container, #fff);
  border: 1px solid var(--border-base, #e4e7ed);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08);
  padding: 6px 0;
  z-index: 10000;
  backdrop-filter: blur(8px);
  animation: contextMenuFadeIn 0.15s ease-out;
}

@keyframes contextMenuFadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-primary, #303133);
  transition: all 0.15s ease;
  user-select: none;
}

.context-menu-item:hover {
  background-color: var(--color-primary-light, #ecf5ff);
  color: var(--color-primary, #409eff);
}

.context-menu-item:hover .menu-icon {
  color: var(--color-primary, #409eff);
}

.context-menu-item.danger {
  color: var(--color-danger, #f56c6c);
}

.context-menu-item.danger:hover {
  background-color: var(--color-danger-light, #fef0f0);
  color: var(--color-danger, #f56c6c);
}

.context-menu-item.danger:hover .menu-icon {
  color: var(--color-danger, #f56c6c);
}

.context-menu-item.disabled {
  cursor: not-allowed;
  opacity: 0.4;
  color: var(--text-secondary, #c0c4cc);
}

.context-menu-item.disabled:hover {
  background-color: transparent;
  color: var(--text-secondary, #c0c4cc);
}

.context-menu-item.disabled:hover .menu-icon {
  color: var(--text-secondary, #c0c4cc);
}

.menu-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--text-secondary, #909399);
  transition: color 0.15s ease;
}

.menu-label {
  flex: 1;
  white-space: nowrap;
}

.context-menu-divider {
  height: 1px;
  background-color: var(--border-light, #ebeef5);
  margin: 6px 12px;
}
</style>