<template>
  <div class="component-list">
    <div class="list-header">
      <span class="header-title">{{ $t('scada.componentList') }}</span>
      <span class="header-count">{{ components.length }}</span>
    </div>

    <div class="list-content">
      <div v-if="components.length === 0" class="empty-list">{{ $t('scada.noComponents') }}</div>

      <div v-for="component in components" :key="component.id" class="list-item" :class="{ active: selectedIds.includes(component.id) }" @click="handleLocateComponent(component)">
        <div class="item-icon">{{ getComponentIcon(component.type) }}</div>
        <div class="item-info">
          <div class="item-name">{{ getComponentName(component) }}</div>
          <div class="item-position">X: {{ Math.round(component.x) }}, Y: {{ Math.round(component.y) }}</div>
        </div>
        <el-button :icon="Delete" size="small" text class="delete-btn" @click="handleDeleteComponent(component, $event)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Delete } from '@element-plus/icons-vue'
import { useScadaEditor } from '../hooks/useScadaEditor'
import { getComponentMeta } from '../registry'
import type { ScadaComponent } from '../types'

const { t } = useI18n()
const scada = useScadaEditor()

const components = computed(() => scada.currentPanel.value?.components || [])
const selectedIds = computed(() => scada.selectedComponentIds.value)

const getComponentIcon = (type: string) => {
  return getComponentMeta(type as any)?.template.icon || '📦'
}

const getComponentName = (comp: ScadaComponent) => {
  if (comp.name?.startsWith('scadaComponentNames.')) {
    return t(comp.name)
  }
  return comp.name || comp.type
}

const handleLocateComponent = (component: ScadaComponent) => {
  scada.selectComponent(component.id)
  scada.scrollToComponent(component.id)
}

const handleDeleteComponent = (component: ScadaComponent, event: Event) => {
  event.stopPropagation()
  scada.deleteComponent(component.id)
}
</script>

<style scoped>
.component-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: transparent;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(34, 211, 238, 0.15);
  flex-shrink: 0;
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%);
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 1px;
  text-shadow: 0 0 8px rgba(34, 211, 238, 0.3);
}

.header-count {
  font-size: 12px;
  color: var(--scada-cyan);
  background: rgba(34, 211, 238, 0.15);
  padding: 3px 10px;
  border-radius: 12px;
  border: 1px solid rgba(34, 211, 238, 0.3);
  font-weight: 500;
}

.list-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.list-content::-webkit-scrollbar {
  width: 6px;
}

.list-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}

.list-content::-webkit-scrollbar-thumb {
  background: rgba(34, 211, 238, 0.3);
  border-radius: 3px;
}

.list-content::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 211, 238, 0.5);
}

.empty-list {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-tertiary);
  font-size: 13px;
  text-align: center;
  padding: 20px;
  flex-direction: column;
  gap: 12px;
}

.empty-list::before {
  content: '📡';
  font-size: 32px;
  opacity: 0.5;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid transparent;
}

.list-item:hover {
  background: var(--scada-bg-hover);
  border-color: rgba(34, 211, 238, 0.2);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.list-item.active {
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%);
  border: 1px solid rgba(34, 211, 238, 0.5);
  box-shadow: 0 0 16px rgba(34, 211, 238, 0.3), inset 0 0 20px rgba(34, 211, 238, 0.05);
}

.list-item.active .item-icon {
  background: linear-gradient(135deg, var(--scada-cyan) 0%, var(--scada-purple) 100%);
  color: #fff;
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.5);
}

.list-item.active .item-name {
  color: var(--scada-cyan);
  font-weight: 600;
}

.item-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  font-size: 16px;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 13px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-position {
  font-size: 11px;
  color: var(--text-tertiary);
  margin-top: 3px;
  font-family: 'Consolas', 'Monaco', monospace;
}

.delete-btn {
  opacity: 0;
  transition: all 0.2s;
  color: var(--text-tertiary);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  padding: 4px;
}

.list-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  color: #f56c6c;
  background: rgba(245, 108, 108, 0.15);
}
</style>