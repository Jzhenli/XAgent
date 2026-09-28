<template>
  <div class="component-palette" :class="{ compact: singleColumn }">
    <div class="palette-header">
      <div class="header-content">
        <span class="header-title">{{ t('componentPalette.title') }}</span>
        <div class="header-actions">
          <div class="header-toggle" @click="toggleGridLayout" :title="singleColumn ? t('componentPalette.doubleColumn') : t('componentPalette.singleColumn')">
            <el-icon><Grid v-if="!singleColumn" /><List v-else /></el-icon>
          </div>
          <div class="header-toggle" @click="emit('toggleList')" :title="props.showComponentList ? t('componentPalette.hideComponentList') : t('componentPalette.showComponentList')">
            <el-icon><DArrowLeft v-if="props.showComponentList" /><DArrowRight v-else /></el-icon>
          </div>
        </div>
      </div>
    </div>
    
    <div class="palette-body">
      <!-- Category menu（仅双列模式显示） -->
      <div v-if="!singleColumn" class="category-menu">
        <div
          v-for="category in categories"
          :key="category.key"
          class="menu-item"
          :class="{ 'active': activeCategory === category.key }"
          @click="selectCategory(category.key)"
        >
          <span class="menu-icon">{{ category.icon }}</span>
          <span class="menu-label">{{ t(`scadaComponentCategories.${category.key}`) }}</span>
        </div>
      </div>

      <!-- Component panel -->
      <div class="component-panel">
        <div v-if="activeComponents.length === 0" class="empty-category">
          {{ $t('scada.noComponents') }}
        </div>
        <div v-else class="component-grid" :class="{ 'single-column': singleColumn }">
          <div
            v-for="template in activeComponents"
            :key="template.type"
            class="component-item"
            draggable="true"
            @dragstart="onDragStart(template.type as ComponentType, $event)"
          >
            <div class="component-icon">{{ template.icon }}</div>
            <div class="component-name">{{ t(template.name) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { type ComponentType } from '@/types/scada'
import {
  getSortedCategories,
  getComponentsByCategory
} from '../utils/component-categories'
import { getAllTemplates } from '../component-registry'
import { DArrowLeft, DArrowRight, Grid, List } from '@element-plus/icons-vue'

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'dragStart', type: ComponentType): void
  (e: 'toggleList'): void
  (e: 'compact', value: boolean): void
}>()

const props = defineProps<{
  showComponentList?: boolean
  initialCompact?: boolean
}>()

// Active category state（双列模式用）
const activeCategory = ref<string>('basic')

// Grid layout: false = 双列网格（默认，显示分类菜单），true = 单列列表（隐藏分类菜单、平铺所有组件）
const singleColumn = ref<boolean>(props.initialCompact ?? false)
const toggleGridLayout = () => {
  singleColumn.value = !singleColumn.value
}

// 通知父组件面板是否紧凑（单列模式下父容器要收窄）
watch(singleColumn, (val) => emit('compact', val), { immediate: true })

// Get all categories sorted by order
const categories = computed(() => getSortedCategories())

// Get components: 单列平铺全部，双列按分类
const activeComponents = computed(() => {
  if (singleColumn.value) {
    return getAllTemplates()
  }
  return getComponentsByCategory(activeCategory.value)
})

const onDragStart = (type: ComponentType, event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('component-type', type)
    event.dataTransfer.effectAllowed = 'copy'
  }
  emit('dragStart', type)
}

const selectCategory = (key: string) => {
  activeCategory.value = key
}
</script>

<style scoped>
.component-palette {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: transparent;
}

.palette-header {
  height: 48px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(34, 211, 238, 0.15);
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%);
  flex-shrink: 0;
}

/* 单列紧凑模式：header padding 收窄 */
.component-palette.compact .palette-header {
  padding: 0 10px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  gap: 8px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 1px;
  text-shadow: 0 0 8px rgba(34, 211, 238, 0.3);
}

/* 紧凑模式：标题字号缩小 */
.component-palette.compact .header-title {
  font-size: 13px;
  letter-spacing: 0.5px;
}

.palette-hint {
  font-size: 11px;
  color: var(--text-tertiary);
  padding: 6px 12px;
  border-bottom: 1px solid rgba(34, 211, 238, 0.1);
}

.header-toggle {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(34, 211, 238, 0.3);
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-tertiary);
  transition: all 0.25s ease;
  flex-shrink: 0;
  background: var(--scada-bg-elevated);
}

/* 紧凑模式：切换按钮更小 */
.component-palette.compact .header-toggle {
  width: 28px;
  height: 28px;
}

.header-toggle:hover {
  background: rgba(34, 211, 238, 0.1);
  color: var(--scada-cyan);
  border-color: var(--scada-cyan);
  transform: scale(1.05);
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.3);
}

.palette-body {
  flex: 1;
  display: flex;
  min-height: 0;
  overflow: hidden;
}

/* Category menu sidebar */
.category-menu {
  width: 72px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.02);
  border-right: 1px solid rgba(34, 211, 238, 0.1);
  overflow-y: auto;
  padding: 10px 0;
}

.category-menu::-webkit-scrollbar {
  width: 4px;
}

.category-menu::-webkit-scrollbar-thumb {
  background: rgba(34, 211, 238, 0.2);
  border-radius: 2px;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 3px solid transparent;
  margin: 2px 0;
}

.menu-item:hover {
  background: var(--scada-bg-hover);
  border-left-color: var(--scada-cyan-glow);
}

.menu-item.active {
  background: linear-gradient(90deg, rgba(34, 211, 238, 0.15) 0%, rgba(168, 85, 247, 0.08) 100%);
  border-left-color: var(--scada-cyan);
  box-shadow: inset 0 0 20px rgba(34, 211, 238, 0.05);
}

.menu-item.active .menu-icon {
  filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.5));
}

.menu-icon {
  font-size: 22px;
  line-height: 1;
  transition: all 0.2s ease;
}

.menu-label {
  font-size: 11px;
  color: var(--text-tertiary);
  text-align: center;
  line-height: 1.2;
  letter-spacing: 0.5px;
}

.menu-item.active .menu-label {
  color: var(--scada-cyan);
  font-weight: 600;
}

/* Component panel */
.component-panel {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
}

/* 紧凑模式：panel padding 收窄 */
.component-palette.compact .component-panel {
  padding: 8px;
}

.component-panel::-webkit-scrollbar {
  width: 6px;
}

.component-panel::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}

.component-panel::-webkit-scrollbar-thumb {
  background: rgba(34, 211, 238, 0.3);
  border-radius: 3px;
}

.component-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 211, 238, 0.5);
}

.empty-category {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-tertiary);
  font-size: 13px;
  text-align: center;
  padding: 20px;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

/* 紧凑模式：双列间距收窄 */
.component-palette.compact:not(.force-single) .component-grid {
  gap: 6px;
}

.component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  padding: 10px;
  background: var(--scada-bg-elevated);
  border: 1px solid rgba(34, 211, 238, 0.15);
  border-radius: 8px;
  cursor: grab;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.component-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.component-item:hover {
  background: rgba(34, 211, 238, 0.1);
  border-color: var(--scada-cyan);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), 0 0 20px rgba(34, 211, 238, 0.2);
}

.component-item:hover::before {
  opacity: 1;
}

.component-item:hover .component-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 0 12px rgba(34, 211, 238, 0.5));
}

.component-item:active {
  cursor: grabbing;
  transform: scale(0.92);
  box-shadow: 0 0 30px rgba(34, 211, 238, 0.3);
}

.component-icon {
  font-size: 28px;
  margin-bottom: 6px;
  line-height: 1;
  transition: all 0.25s ease;
}

/* 紧凑模式双列：图标缩小 */
.component-palette.compact .component-grid:not(.single-column) .component-icon {
  font-size: 22px;
  margin-bottom: 4px;
}

.component-name {
  font-size: 11px;
  color: var(--text-regular);
  text-align: center;
  line-height: 1.3;
  word-break: break-all;
  overflow-wrap: break-word;
  max-width: 100%;
  letter-spacing: 0.3px;
}

/* 紧凑模式双列：文字缩小 */
.component-palette.compact .component-grid:not(.single-column) .component-name {
  font-size: 10px;
}

.component-item:hover .component-name {
  color: var(--scada-cyan);
}

/* ---- 单列列表布局 ---- */
.component-grid.single-column {
  grid-template-columns: 1fr;
  gap: 6px;
}

.component-grid.single-column .component-item {
  aspect-ratio: auto;
  flex-direction: row;
  justify-content: flex-start;
  gap: 10px;
  padding: 8px 12px;
}

.component-grid.single-column .component-icon {
  font-size: 22px;
  margin-bottom: 0;
  flex-shrink: 0;
}

.component-grid.single-column .component-name {
  font-size: 12px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
