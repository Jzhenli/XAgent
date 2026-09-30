<template>
  <div class="component-list" ref="listRef">
    <div class="list-header">
      <span class="header-title">{{ $t('scada.componentList') }}</span>
      <span class="header-count">{{ components.length }}</span>
    </div>

    <div class="list-content" ref="listContentRef">
      <div v-if="components.length === 0" class="empty-list">{{ $t('scada.noComponents') }}</div>

      <div
        v-for="component in components"
        :key="component.id"
        class="list-item"
        :class="{ active: selectedIds.includes(component.id), locked: component.locked }"
        @click="handleLocateComponent(component)"
        @contextmenu.prevent="handleContextMenu($event, component)"
      >
        <div class="item-icon">
          {{ getComponentIcon(component.type) }}
          <div v-if="component.locked" class="locked-badge" title="Locked">
            <Lock :size="10" />
          </div>
        </div>
        <div class="item-info">
          <div class="item-name">{{ getComponentName(component) }}</div>
          <div class="item-position">X: {{ Math.round(component.x) }}, Y: {{ Math.round(component.y) }}</div>
        </div>
      </div>
    </div>

    <!-- 右键菜单 -->
    <Teleport to="body">
      <div
        v-if="menuVisible"
        class="scada-list-context-menu"
        :style="menuStyle"
        @contextmenu.prevent
      >
        <div class="menu-item" @click="handleToggleLock">
          <Lock v-if="!targetComponent?.locked" :size="12" />
          <Unlock v-else :size="12" />
          <span>{{ targetComponent?.locked ? t('scada.contextMenu.unlock') : t('scada.contextMenu.lock') }}</span>
        </div>
        <div class="menu-item" @click="handleBringToFront">
          <Top :size="12" />
          <span>{{ t('scada.contextMenu.bringToFront') }}</span>
        </div>
        <div class="menu-item" @click="handleSendToBack">
          <Bottom :size="12" />
          <span>{{ t('scada.contextMenu.sendToBack') }}</span>
        </div>
        <div class="menu-divider"></div>
        <div class="menu-item" @click="handleMenuDelete">
          <Delete :size="12" />
          <span>{{ t('scada.delete') }}</span>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Delete, Lock, Unlock, Top, Bottom } from '@element-plus/icons-vue'
import { useScadaEditor } from '../hooks/useScadaEditor'
import { getComponentMeta } from '../registry'
import type { ScadaComponent } from '../types'

const { t } = useI18n()
const scada = useScadaEditor()

const listRef = ref<HTMLElement | null>(null)
const listContentRef = ref<HTMLElement | null>(null)

// 右键菜单状态
const menuVisible = ref(false)
const menuX = ref(0)
const menuY = ref(0)
const targetComponent = ref<ScadaComponent | null>(null)

const components = computed(() => scada.currentPanel.value?.components || [])
const selectedIds = computed(() => scada.selectedComponentIds.value)

const menuStyle = computed(() => ({
  left: `${menuX.value}px`,
  top: `${menuY.value}px`
}))

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

// ═══════════════════════════════════════════════════════════════════════════════
// 右键菜单逻辑
// ═══════════════════════════════════════════════════════════════════════════════

/** 打开右键菜单 */
function handleContextMenu(event: MouseEvent, component: ScadaComponent) {
  event.preventDefault()
  event.stopPropagation()

  targetComponent.value = component
  scada.selectComponent(component.id)

  // 定位菜单，确保不超出视口
  const menuWidth = 180
  const menuHeight = 200
  menuX.value = Math.min(event.clientX, window.innerWidth - menuWidth - 8)
  menuY.value = Math.min(event.clientY, window.innerHeight - menuHeight - 8)

  menuVisible.value = true
}

/** 关闭右键菜单 */
function closeMenu() {
  menuVisible.value = false
  targetComponent.value = null
}

/** 锁定/解锁 */
function handleToggleLock() {
  if (!targetComponent.value) return
  scada.toggleLock(targetComponent.value.id)
  closeMenu()
}

/** 置于顶层 */
function handleBringToFront() {
  if (!targetComponent.value) return
  scada.bringToFront(targetComponent.value.id)
  closeMenu()
}

/** 置于底层 */
function handleSendToBack() {
  if (!targetComponent.value) return
  scada.sendToBack(targetComponent.value.id)
  closeMenu()
}

/** 删除 */
function handleMenuDelete() {
  if (!targetComponent.value) return
  scada.deleteComponent(targetComponent.value.id)
  closeMenu()
}

/** 全局点击监听：点击菜单外关闭 */
function handleDocumentClick(event: MouseEvent) {
  if (!menuVisible.value) return
  const target = event.target as HTMLElement
  if (!target.closest('.scada-list-context-menu')) {
    closeMenu()
  }
}

/** ESC 键关闭菜单 */
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && menuVisible.value) {
    closeMenu()
  }
}

/** 滚动时关闭菜单 */
function handleScroll() {
  if (menuVisible.value) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('scroll', handleScroll, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('scroll', handleScroll, true)
})
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
  border: 1px solid var(--border-base);
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

/* 锁定状态 */
.list-item.locked {
  opacity: 0.7;
}

.list-item.locked .item-name {
  font-style: italic;
}

.item-icon {
  position: relative;
}

.locked-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--scada-purple);
  border-radius: 50%;
  color: #fff;
  box-shadow: 0 0 6px rgba(168, 85, 247, 0.5);
}
</style>

<!-- 右键菜单样式：使用非 scoped 因为 Teleport 到 body -->
<style>
.scada-list-context-menu {
  position: fixed;
  z-index: 9999;
  min-width: 140px;
  padding: 6px;
  background: rgba(20, 24, 40, 0.95);
  border: 1px solid rgba(34, 211, 238, 0.3);
  border-radius: 8px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 0 16px rgba(34, 211, 238, 0.15);
  backdrop-filter: blur(12px);
  animation: scada-menu-fade-in 0.15s ease-out;
}

@keyframes scada-menu-fade-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.scada-list-context-menu .menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-primary);
  transition: all 0.15s ease;
  user-select: none;
  white-space: nowrap;
}

.scada-list-context-menu .menu-item:hover {
  background: rgba(34, 211, 238, 0.15);
  color: var(--scada-cyan);
  box-shadow: inset 0 0 12px rgba(34, 211, 238, 0.1);
}

.scada-list-context-menu .menu-item svg {
  flex-shrink: 0;
  width: 12px;
  height: 12px;
}

.scada-list-context-menu .menu-divider {
  height: 1px;
  margin: 4px 8px;
  background: rgba(34, 211, 238, 0.2);
}
</style>