<template>
  <div class="node-palette" :style="{ width: paletteWidth }">
    <div class="palette-header">
      <h3>{{ t('ruleNodes.nodePanel') }}</h3>
      <p class="hint">{{ t('ruleNodes.dragHint') }}</p>
      <div class="header-glow" aria-hidden="true"></div>
    </div>

    <div class="palette-body">
      <div v-for="(templates, category) in categories" :key="category" class="category-section">
        <div class="category-title">
          <span class="title-bar"></span>
          {{ t(category) }}
        </div>
        <div
          v-for="template in templates"
          :key="template.type"
          class="palette-item"
          :class="{ 'touch-item': isTablet || isMobile }"
          :style="{ '--node-color': template.color }"
          draggable="true"
          @dragstart="onDragStart(template.type, $event)"
        >
          <div class="item-glow" aria-hidden="true"></div>
          <div class="item-icon">{{ template.icon }}</div>
          <div class="item-info">
            <div class="item-label">{{ t(template.label) }}</div>
          </div>
          <div class="item-arrow">›</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NODE_TEMPLATES, type NodeType } from '@/types/rule'
import { useResponsive } from '@/utils/useResponsive'

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'dragStart', type: NodeType, event: DragEvent): void
}>()

const { isTablet, isMobile } = useResponsive()

const onDragStart = (type: NodeType, event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', type)
    event.dataTransfer.effectAllowed = 'move'
  }
  emit('dragStart', type, event)
}

const categories = computed(() => {
  const cats: Record<string, typeof NODE_TEMPLATES> = {}
  NODE_TEMPLATES.forEach(template => {
    const catKey = template.category
    if (!cats[catKey]) {
      cats[catKey] = []
    }
    cats[catKey].push(template)
  })
  return cats
})

const paletteWidth = computed(() => {
  if (isMobile.value) return '180px'
  if (isTablet.value) return '200px'
  return '220px'
})
</script>

<style scoped>
.node-palette {
  background: var(--re-panel-bg);
  backdrop-filter: var(--re-panel-blur);
  -webkit-backdrop-filter: var(--re-panel-blur);
  border-right: 1px solid var(--re-panel-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: relative;
}

.palette-header {
  padding: 16px 16px 14px;
  background: var(--re-toolbar-bg);
  border-bottom: 1px solid var(--re-panel-border);
  position: relative;
  overflow: hidden;
}

.header-glow {
  position: absolute;
  top: -30px;
  right: -20px;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, var(--re-accent) 0%, transparent 70%);
  opacity: 0.2;
  filter: blur(20px);
  pointer-events: none;
}

.palette-header h3 {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 700;
  background: var(--re-title-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.3px;
}

.palette-header .hint {
  margin: 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.palette-body {
  flex: 1;
  padding: 14px 12px;
  overflow-y: auto;
}

.palette-body::-webkit-scrollbar {
  width: 6px;
}
.palette-body::-webkit-scrollbar-track {
  background: transparent;
}
.palette-body::-webkit-scrollbar-thumb {
  background: var(--border-base);
  border-radius: 3px;
}

.category-section {
  margin-bottom: 18px;
}

.category-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
  padding-left: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-bar {
  width: 3px;
  height: 14px;
  background: linear-gradient(180deg, var(--re-accent), var(--re-accent-2));
  border-radius: 2px;
}

.palette-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  margin-bottom: 10px;
  background: var(--re-panel-bg);
  border: 1px solid var(--re-panel-border);
  border-left: 3px solid var(--node-color);
  border-radius: 12px;
  cursor: grab;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  -webkit-user-select: none;
  user-select: none;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.item-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 0% 50%, var(--node-color) 0%, transparent 60%);
  opacity: 0.08;
  pointer-events: none;
  transition: opacity 0.25s;
}

.palette-item:hover {
  transform: translateX(3px);
  border-color: var(--node-color);
  box-shadow: 0 4px 16px color-mix(in srgb, var(--node-color) 35%, transparent);
}

.palette-item:hover .item-glow {
  opacity: 0.15;
}

.palette-item:active {
  cursor: grabbing;
  transform: scale(0.97);
}

.palette-item.touch-item {
  padding: 14px;
  margin-bottom: 12px;
  min-height: 56px;
}

.palette-item.touch-item:active {
  background: var(--bg-hover);
  transform: scale(0.97);
}

.item-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--node-color) 20%, transparent);
  border: 1px solid color-mix(in srgb, var(--node-color) 40%, transparent);
  border-radius: 10px;
  font-size: 18px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--node-color) 25%, transparent);
}

.touch-item .item-icon {
  width: 42px;
  height: 42px;
  font-size: 20px;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.2px;
}

.touch-item .item-label {
  font-size: 15px;
}

.item-arrow {
  font-size: 18px;
  color: var(--text-tertiary);
  opacity: 0;
  transition: opacity 0.2s, transform 0.2s;
}

.palette-item:hover .item-arrow {
  opacity: 1;
  transform: translateX(2px);
  color: var(--node-color);
}

@media (max-width: 1024px) {
  .palette-header { padding: 12px; }
  .palette-header h3 { font-size: 14px; }
  .palette-body { padding: 10px 8px; }
  .category-title { font-size: 10px; }
}

@media (max-width: 768px) {
  .palette-header { padding: 10px; }
  .palette-header h3 { font-size: 13px; }
  .palette-header .hint { font-size: 11px; }
  .palette-body { padding: 8px; }
  .category-section { margin-bottom: 12px; }
  .category-title { font-size: 10px; margin-bottom: 6px; }
}
</style>
