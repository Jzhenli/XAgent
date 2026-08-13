<template>
  <div
    ref="canvasRef"
    class="scada-canvas"
    :style="canvasStyle"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseLeave"
    @dblclick="handleDoubleClick"
    @contextmenu="handleContextMenu"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <div v-if="showGrid" class="grid-overlay" :style="gridStyle" />
    
    <div v-if="guideLines.length > 0" class="guide-lines">
      <div
        v-for="(line, idx) in guideLines"
        :key="idx"
        class="guide-line"
        :class="{ 'guide-x': line.type === 'x', 'guide-y': line.type === 'y' }"
        :style="getGuideLineStyle(line)"
      />
    </div>

    <div
      v-if="boxSelectState.active"
      class="box-select"
      :style="boxSelectStyle"
    />

    <div class="components-layer">
      <div
        v-for="comp in currentPanel?.components"
        :key="comp.id"
        class="component-wrapper"
        :class="{
          'component-selected': isSelected(comp.id),
          'component-locked': comp.locked,
          'component-hidden': !comp.visible
        }"
        :style="getComponentStyle(comp)"
        :data-component-id="comp.id"
      >
        <component
          :is="getComponent(comp.type)"
          :component="comp"
          :editing="isEditing"
          @select="$emit('select', comp.id)"
        />

        <div
          v-if="isSelected(comp.id) && isEditing && !comp.locked"
          class="selection-border"
        >
          <div
          v-for="handle in resizeHandles"
          :key="handle"
          class="resize-handle"
          :class="handle"
          @mousedown.stop="startResize(handle, comp.id, $event)"
        />
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="contextMenu.visible"
        class="scada-context-menu"
        :style="{ left: contextMenu.position.x + 'px', top: contextMenu.position.y + 'px' }"
        @pointerdown.stop
        @click.stop
        @contextmenu.prevent
      >
        <template v-if="contextMenu.type === 'node'">
          <div class="context-menu-item" @click="handleContextAction('copy')">
            <span>{{ $t('scada.copy') }}</span>
          </div>
          <div class="context-menu-item" @click="handleContextAction('delete')">
            <span>{{ $t('scada.delete') }}</span>
          </div>
          <div
            v-if="targetComponent?.locked"
            class="context-menu-item"
            @click="handleContextAction('unlock')"
          >
            <span>{{ $t('scada.contextMenu.unlock') }}</span>
          </div>
          <div
            v-else
            class="context-menu-item"
            @click="handleContextAction('lock')"
          >
            <span>{{ $t('scada.contextMenu.lock') }}</span>
          </div>
          <div class="context-menu-divider" />
          <div class="context-menu-item" @click="handleContextAction('bringToFront')">
            <span>{{ $t('scada.contextMenu.bringToFront') }}</span>
          </div>
          <div class="context-menu-item" @click="handleContextAction('sendToBack')">
            <span>{{ $t('scada.contextMenu.sendToBack') }}</span>
          </div>
        </template>
        <template v-else>
          <div class="context-menu-item" @click="handleContextAction('paste')">
            <span>{{ $t('scada.paste') }}</span>
          </div>
          <div
            v-if="selectedComponentIds.length > 0"
            class="context-menu-item"
            @click="handleContextAction('delete')"
          >
            <span>{{ $t('scada.delete') }}</span>
          </div>
        </template>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useScadaCanvas } from '../hooks/useScadaCanvas'
import { getComponent } from '../registry'
import type { GuideLine, ResizeHandle } from '../types'

const resizeHandles: ResizeHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']

defineEmits<{
  (e: 'select', id: string): void
}>()

const {
  canvasRef,
  guideLines,
  boxSelectState,
  currentPanel,
  selectedComponentIds,
  canvasWidth,
  canvasHeight,
  gridSize,
  isEditing,
  zoom,
  showGrid,
  contextMenu,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleMouseLeave,
  handleDoubleClick,
  handleContextMenu,
  closeContextMenu,
  handleContextAction,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  startResize
} = useScadaCanvas()

// 右键菜单目标组件（用于判断锁定状态）
const targetComponent = computed(() => {
  if (!contextMenu.value.targetId || !currentPanel.value) return null
  return currentPanel.value.components.find(c => c.id === contextMenu.value.targetId) || null
})

// 点击菜单外部关闭右键菜单
const handleDocumentPointerDown = () => {
  if (contextMenu.value.visible) {
    closeContextMenu()
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
})

const isSelected = (id: string) => selectedComponentIds.value.includes(id)

const canvasStyle = computed(() => ({
  width: `${canvasWidth.value * zoom.value}px`,
  height: `${canvasHeight.value * zoom.value}px`,
  backgroundColor: currentPanel.value?.backgroundColor || '#f0f2f5',
  backgroundImage: currentPanel.value?.backgroundImage ? `url(${currentPanel.value.backgroundImage})` : undefined,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}))

const gridStyle = computed(() => ({
  backgroundSize: `${gridSize.value * zoom.value}px ${gridSize.value * zoom.value}px`,
  backgroundImage: `linear-gradient(to right, rgba(34, 211, 238, 0.15) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(168, 85, 247, 0.15) 1px, transparent 1px)`
}))

const getGuideLineStyle = (line: GuideLine) => {
  if (line.type === 'x') {
    return { left: `${line.pos * zoom.value}px`, height: '100%', width: '1px' }
  }
  return { top: `${line.pos * zoom.value}px`, width: '100%', height: '1px' }
}

const boxSelectStyle = computed(() => {
  const start = boxSelectState.value.start
  const end = boxSelectState.value.end
  return {
    left: `${Math.min(start.x, end.x) * zoom.value}px`,
    top: `${Math.min(start.y, end.y) * zoom.value}px`,
    width: `${Math.abs(end.x - start.x) * zoom.value}px`,
    height: `${Math.abs(end.y - start.y) * zoom.value}px`
  }
})

const getComponentStyle = (comp: { x: number; y: number; config: { width: number; height: number } }) => ({
  left: `${comp.x * zoom.value}px`,
  top: `${comp.y * zoom.value}px`,
  width: `${comp.config.width * zoom.value}px`,
  height: `${comp.config.height * zoom.value}px`
})
</script>

<style scoped>
.scada-canvas {
  position: relative;
  overflow: hidden;
  cursor: crosshair;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(34, 211, 238, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(34, 211, 238, 0.15);
}

.grid-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.guide-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.guide-line {
  position: absolute;
  background: linear-gradient(90deg, transparent, var(--scada-cyan), transparent);
  z-index: 100;
  box-shadow: 0 0 8px rgba(34, 211, 238, 0.6);
}

.guide-line.guide-y {
  background: linear-gradient(180deg, transparent, var(--scada-cyan), transparent);
  box-shadow: 0 0 8px rgba(34, 211, 238, 0.6);
}

.box-select {
  position: absolute;
  border: 1.5px dashed var(--scada-cyan);
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(168, 85, 247, 0.08) 100%);
  z-index: 200;
  pointer-events: none;
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
  border-radius: 4px;
}

.components-layer {
  position: absolute;
  inset: 0;
}

.component-wrapper {
  position: absolute;
  cursor: move;
  user-select: none;
  box-sizing: border-box;
  transition: transform 0.2s ease;
}

.component-wrapper.component-hidden {
  opacity: 0.3;
  filter: grayscale(0.5);
}

.component-wrapper.component-locked {
  cursor: not-allowed;
}

.component-wrapper.component-selected {
  z-index: 10;
}

.selection-border {
  position: absolute;
  inset: -5px;
  border: 2px solid transparent;
  border-radius: 6px;
  pointer-events: none;
  background:
    linear-gradient(90deg, var(--scada-cyan) 0%, var(--scada-purple) 100%) border-box,
    transparent padding-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  box-shadow: 0 0 20px var(--scada-cyan-glow), 0 0 40px var(--scada-purple-glow);
  animation: border-flow 3s ease infinite;
  background-size: 200% 200%;
}

@keyframes border-flow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.resize-handle {
  position: absolute;
  width: 12px;
  height: 12px;
  background: radial-gradient(circle at 35% 35%, var(--scada-cyan) 0%, var(--scada-purple) 100%);
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 0 8px rgba(34, 211, 238, 0.8), 0 0 16px rgba(168, 85, 247, 0.5);
  transition: all 0.2s ease;
  animation: handle-pulse 2s ease-in-out infinite;
}

.resize-handle:hover {
  border-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 12px rgba(34, 211, 238, 1), 0 0 24px rgba(168, 85, 247, 0.7);
  animation-play-state: paused;
}

.resize-handle.nw { top: -6px; left: -6px; cursor: nw-resize; }
.resize-handle.n { top: -7px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
.resize-handle.ne { top: -6px; right: -6px; cursor: ne-resize; }
.resize-handle.e { top: 50%; right: -7px; transform: translateY(-50%); cursor: e-resize; }
.resize-handle.se { bottom: -6px; right: -6px; cursor: se-resize; }
.resize-handle.s { bottom: -7px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
.resize-handle.sw { bottom: -6px; left: -6px; cursor: sw-resize; }
.resize-handle.w { top: 50%; left: -7px; transform: translateY(-50%); cursor: w-resize; }

.resize-handle.n:hover { transform: translateX(-50%) scale(1.3); }
.resize-handle.s:hover { transform: translateX(-50%) scale(1.3); }
.resize-handle.e:hover { transform: translateY(-50%) scale(1.3); }
.resize-handle.w:hover { transform: translateY(-50%) scale(1.3); }
.resize-handle.nw:hover,
.resize-handle.ne:hover,
.resize-handle.se:hover,
.resize-handle.sw:hover {
  transform: scale(1.3);
}

@keyframes handle-pulse {
  0%, 100% { box-shadow: 0 0 8px rgba(34, 211, 238, 0.8), 0 0 16px rgba(168, 85, 247, 0.5); }
  50% { box-shadow: 0 0 14px rgba(34, 211, 238, 1), 0 0 28px rgba(168, 85, 247, 0.7); }
}

.scada-context-menu {
  position: fixed;
  z-index: 9999;
  min-width: 160px;
  padding: 6px 0;
  background: var(--scada-menu-bg);
  border: 1px solid var(--scada-menu-border);
  border-radius: 8px;
  box-shadow: 0 8px 32px var(--bg-mask), 0 0 16px var(--scada-cyan-glow);
  backdrop-filter: blur(12px);
  user-select: none;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 13px;
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.context-menu-item:hover {
  background: var(--scada-bg-hover);
  color: var(--scada-cyan);
}

.context-menu-divider {
  height: 1px;
  margin: 4px 8px;
  background: linear-gradient(90deg, transparent, var(--scada-cyan), transparent);
  opacity: 0.3;
}
</style>