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
          :config="comp"
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useScadaCanvas } from '../hooks/useScadaCanvas'
import { getComponent } from '../registry'
import type { GuideLine, ResizeHandle } from '../types'

const resizeHandles: ResizeHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']

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
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleMouseLeave,
  handleDoubleClick,
  handleContextMenu,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  startResize
} = useScadaCanvas()

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
  backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`
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
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
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
  background-color: #409eff;
  z-index: 100;
}

.box-select {
  position: absolute;
  border: 2px dashed #409eff;
  background-color: rgba(64, 158, 255, 0.1);
  z-index: 200;
  pointer-events: none;
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
}

.component-wrapper.component-hidden {
  opacity: 0.3;
}

.component-wrapper.component-locked {
  cursor: not-allowed;
}

.component-wrapper.component-selected {
  z-index: 10;
}

.selection-border {
  position: absolute;
  inset: -4px;
  border: 2px solid #409eff;
  border-radius: 4px;
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #fff;
  border: 1px solid #409eff;
  border-radius: 50%;
  cursor: pointer;
  pointer-events: auto;
}

.resize-handle.nw { top: -4px; left: -4px; cursor: nw-resize; }
.resize-handle.n { top: -4px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
.resize-handle.ne { top: -4px; right: -4px; cursor: ne-resize; }
.resize-handle.e { top: 50%; right: -4px; transform: translateY(-50%); cursor: e-resize; }
.resize-handle.se { bottom: -4px; right: -4px; cursor: se-resize; }
.resize-handle.s { bottom: -4px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
.resize-handle.sw { bottom: -4px; left: -4px; cursor: sw-resize; }
.resize-handle.w { top: 50%; left: -4px; transform: translateY(-50%); cursor: w-resize; }
</style>