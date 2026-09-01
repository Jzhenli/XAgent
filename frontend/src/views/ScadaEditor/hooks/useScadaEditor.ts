import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { projectApi } from '@/api/projects'
import { usePointStore } from '@/stores/points'

import type { Ref } from 'vue'
import type { Project } from '@/types/project'
import type { PointDisplay } from '@/stores/points'
import type {
  ScadaPanel,
  ScadaComponent,
  PointBinding,
  ComponentConfig
} from '../types'
import type { ComponentType } from '../registry'
import { COMPONENT_TEMPLATES } from '@/types/scada'
import {
  generateComponentId,
  cloneComponent,
  migrateComponents
} from '../utils/component'
import { normalizeAdaptMode } from '../utils/adapt'
import { downloadJson } from '../utils/dom'
import { setupUndoSystem, useScadaUndo, type OperationType } from './useScadaUndo'

// ═══════════════════════════════════════════════════════════════════════════════
// 模块级状态 —— 整个 ScadaEditor 共享同一份面板与交互状态
// ═══════════════════════════════════════════════════════════════════════════════

/** 当前加载的面板 ID */
const currentPanelId = ref<string | null>(null)
/** 从项目接口加载的原始面板数据 */
const sourcePanel = ref<ScadaPanel | null>(null)
/** 编辑过程中的草稿面板；存在时表示面板处于脏状态 */
const draftPanel = ref<ScadaPanel | null>(null)
/** 当前单选的组件 ID */
const selectedComponentId = ref<string | null>(null)
/** 当前多选的组件 ID 列表 */
const selectedComponentIds = ref<string[]>([])
/** 是否处于编辑模式（运行模式时为 false） */
const isEditing = ref(true)
/** 画布缩放比例 */
const zoom = ref(1)
/** 是否显示画布网格 */
const showGrid = ref(true)
/** 是否处于全屏预览状态 */
const isFullscreenPreview = ref(false)
/** 面板是否存在未保存的修改 */
const isDirty = ref(false)
/** 组件剪贴板 */
const clipboard = ref<ScadaComponent[]>([])
/** 需要滚动定位到的组件 ID */
const scrollToComponentId = ref<string | null>(null)

/**
 * 序列化当前面板状态用于撤销/重做
 */
function serializePanelState(): string {
  const panel = currentPanel.value
  if (!panel) return '{}'
  return JSON.stringify({
    width: panel.width,
    height: panel.height,
    grid: panel.grid,
    backgroundColor: panel.backgroundColor,
    backgroundImage: panel.backgroundImage,
    components: panel.components
  })
}

/**
 * 恢复面板状态用于撤销/重做
 */
function restorePanelState(state: string): void {
  try {
    const data = JSON.parse(state)
    const panel = getEditablePanel()
    if (!panel) return

    if (data.width !== undefined) panel.width = data.width
    if (data.height !== undefined) panel.height = data.height
    if (data.grid !== undefined) panel.grid = data.grid
    if (data.backgroundColor !== undefined) panel.backgroundColor = data.backgroundColor
    if (data.backgroundImage !== undefined) panel.backgroundImage = data.backgroundImage
    if (data.components !== undefined) {
      panel.components = JSON.parse(JSON.stringify(data.components))
    }
    panel.updatedAt = Date.now()
  } catch {
    console.error('Failed to restore panel state')
  }
}

let undoSystemInitialized = false

/** 当前生效的面板：优先取草稿，其次取原始数据 */
const currentPanel = computed<ScadaPanel | null>(() => {
  if (!currentPanelId.value) return null
  return draftPanel.value ?? sourcePanel.value ?? null
})

/** 当前单选的组件 */
const selectedComponent = computed<ScadaComponent | null>(() => {
  if (!currentPanel.value || !selectedComponentId.value) return null
  return currentPanel.value.components.find(c => c.id === selectedComponentId.value) ?? null
})

// ═══════════════════════════════════════════════════════════════════════════════
// 私有工具函数
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 从项目 data 字段解析面板业务数据
 * @param data 项目存储的 data 字段（字符串或对象）
 */
function parseProjectData(data: string | Record<string, unknown>): ScadaPanel | null {
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data
    return {
      id: '',
      name: '',
      type: 'Dashboard',
      description: '',
      width: parsed.width || 1200,
      height: parsed.height || 800,
      grid: parsed.grid || 20,
      backgroundColor: parsed.backgroundColor || '#f0f2f5',
      backgroundImage: parsed.backgroundImage,
      adaptMode: normalizeAdaptMode(parsed.adaptMode),
      components: migrateComponents(parsed.components || []),
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  } catch {
    return null
  }
}

/**
 * 将当前面板序列化为项目 update 接口需要的 payload
 * @param panel 目标面板
 */
function buildPanelPayload(panel: ScadaPanel): Record<string, unknown> {
  return {
    width: panel.width,
    height: panel.height,
    grid: panel.grid,
    backgroundColor: panel.backgroundColor,
    backgroundImage: panel.backgroundImage,
    adaptMode: panel.adaptMode,
    components: panel.components
  }
}

/**
 * 获取可编辑的草稿面板；不存在时基于原始数据创建
 */
function getEditablePanel(): ScadaPanel | null {
  if (!currentPanelId.value || !sourcePanel.value) return null

  if (!draftPanel.value) {
    draftPanel.value = JSON.parse(JSON.stringify(sourcePanel.value))
    isDirty.value = true
  }
  return draftPanel.value
}

// ═══════════════════════════════════════════════════════════════════════════════
// 主 Hook：useScadaEditor
// 负责面板加载、保存、组件 CRUD、选择状态、图层顺序等核心编辑状态
// ═══════════════════════════════════════════════════════════════════════════════

export function useScadaEditor() {
  if (!undoSystemInitialized) {
    setupUndoSystem(serializePanelState, restorePanelState)
    undoSystemInitialized = true
  }

  const { t } = useI18n()
  const undo = useScadaUndo()

  /** 内部公共函数：将 Project 数据应用到编辑器状态 */
  function applyProjectData(project: Project): ScadaPanel | null {
    const panel = parseProjectData(project.data)
    if (!panel) {
      console.error('Failed to deserialize panel data:', project.data)
      return null
    }

    panel.id = project.id
    panel.name = project.name
    panel.type = project.type
    panel.description = project.description
    panel.createdAt = project.createdAt
    panel.updatedAt = project.updatedAt

    currentPanelId.value = project.id
    sourcePanel.value = panel
    draftPanel.value = null
    isDirty.value = false
    selectedComponentId.value = null
    selectedComponentIds.value = []
    // 面板切换后旧撤销快照已无意义：既占内存，误按 Ctrl+Z 还会把新面板恢复成旧面板内容
    undo.clearHistory()

    return panel
  }

  /** 从网络加载指定项目对应的面板数据 */
  async function loadPanel(projectId: string): Promise<ScadaPanel | null> {
    let project: Project | null = null
    try {
      project = await projectApi.get(projectId)
    } catch (e) {
      console.error('Failed to fetch project:', e)
    }

    if (!project) {
      console.error('Project not found:', projectId)
      return null
    }

    return applyProjectData(project)
  }

  /** 从缓存/已获取的 Project 对象加载面板（跳过网络请求） */
  function loadPanelFromProject(project: Project): ScadaPanel | null {
    return applyProjectData(project)
  }

  /** 保存当前面板到项目接口 */
  async function savePanel(): Promise<void> {
    if (!currentPanelId.value || !currentPanel.value) return

    const payload = buildPanelPayload(currentPanel.value)

    await projectApi.update(currentPanelId.value, {
      data: payload,
      name: currentPanel.value.name,
      description: currentPanel.value.description,
      updatedAt: Date.now()
    })

    sourcePanel.value = JSON.parse(JSON.stringify(currentPanel.value))
    draftPanel.value = null
    isDirty.value = false
  }

  /** 丢弃当前草稿，恢复到上次保存的状态 */
  function discardDraft(): void {
    if (!currentPanelId.value) return
    draftPanel.value = null
    isDirty.value = false
    selectedComponentId.value = null
    selectedComponentIds.value = []
  }

  /** 切换当前面板 ID（用于多面板场景） */
  function selectPanel(id: string): void {
    currentPanelId.value = id
    selectedComponentId.value = null
    selectedComponentIds.value = []
  }

  /** 更新面板元数据（尺寸、背景等） */
  function updatePanel(updates: Partial<ScadaPanel>): void {
    const panel = getEditablePanel()
    if (!panel) return
    Object.assign(panel, updates)
    panel.updatedAt = Date.now()
  }

  /** 在指定坐标添加新组件 */
  function addComponent(type: ComponentType, x: number, y: number): ScadaComponent | null {
    const panel = getEditablePanel()
    if (!panel) return null

    const template = COMPONENT_TEMPLATES.find(t => t.type === type)
    if (!template) return null

    const config = JSON.parse(JSON.stringify(template.defaultConfig))

    const component: ScadaComponent = {
      id: generateComponentId(),
      type,
      name: template.name,
      x: Math.round(x / panel.grid) * panel.grid,
      y: Math.round(y / panel.grid) * panel.grid,
      config,
      binding: null,
      locked: false,
      visible: true
    }

    undo.pushOperation('add', t('scada.undoOperations.add', { name: template.name }), [component.id])

    panel.components.push(component)
    panel.updatedAt = Date.now()

    return component
  }

  /** 更新指定组件的属性 */
  function updateComponent(
    id: string,
    updates: Partial<ScadaComponent>,
    skipUndo = false
  ): void {
    const panel = getEditablePanel()
    if (!panel) return

    const component = panel.components.find(c => c.id === id)
    if (component) {
      Object.assign(component, updates)
      panel.updatedAt = Date.now()

      if (!skipUndo) {
        if (updates.config?.width !== undefined || updates.config?.height !== undefined) {
          undo.pushOperation('resize', t('scada.undoOperations.resize'), [id])
        } else if (updates.x !== undefined || updates.y !== undefined) {
          undo.pushOperation('move', t('scada.undoOperations.move'), [id])
        } else if (updates.binding !== undefined) {
          undo.pushOperation('bind', t('scada.undoOperations.bind'), [id])
        } else {
          undo.pushOperation('update', t('scada.undoOperations.update'), [id])
        }
      }
    }
  }

  /** 删除指定组件 */
  function deleteComponent(id: string): void {
    const panel = getEditablePanel()
    if (!panel) return

    const index = panel.components.findIndex(c => c.id === id)
    if (index === -1) return

    const component = panel.components[index]

    undo.pushOperation('delete', t('scada.undoOperations.delete', { name: component.name }), [id])

    panel.components.splice(index, 1)
    panel.updatedAt = Date.now()

    if (selectedComponentId.value === id) {
      selectedComponentId.value = null
    }
    selectedComponentIds.value = selectedComponentIds.value.filter(sid => sid !== id)
  }

  /** 删除所有选中的组件 */
  function deleteSelectedComponents(): void {
    const panel = getEditablePanel()
    if (!panel || selectedComponentIds.value.length === 0) return

    const deletedNames = panel.components
      .filter(c => selectedComponentIds.value.includes(c.id))
      .map(c => c.name)
      .join(', ')

    undo.pushOperation(
      'delete',
      t('scada.undoOperations.deleteMultiple', { count: selectedComponentIds.value.length }),
      [...selectedComponentIds.value]
    )

    panel.components = panel.components.filter(
      c => !selectedComponentIds.value.includes(c.id)
    )
    panel.updatedAt = Date.now()

    selectedComponentId.value = null
    selectedComponentIds.value = []
  }

  /** 单选组件 */
  function selectComponent(id: string | null): void {
    selectedComponentId.value = id
    selectedComponentIds.value = id ? [id] : []
  }

  /** 多选组件 */
  function selectComponents(ids: string[]): void {
    selectedComponentIds.value = ids
    selectedComponentId.value = ids.length > 0 ? ids[0] : null
  }

  /** 选中当前面板全部组件 */
  function selectAllComponents(): void {
    if (!currentPanel.value) return
    selectedComponentIds.value = currentPanel.value.components.map(c => c.id)
    if (selectedComponentIds.value.length > 0) {
      selectedComponentId.value = selectedComponentIds.value[0]
    }
  }

  /** 清空选择 */
  function clearSelection(): void {
    selectedComponentId.value = null
    selectedComponentIds.value = []
  }

  /** 移动组件到指定坐标（会自动吸附网格） */
  function moveComponent(id: string, x: number, y: number): void {
    const panel = getEditablePanel()
    if (!panel) return

    const component = panel.components.find(c => c.id === id)
    if (component && !component.locked) {
      component.x = Math.round(x / panel.grid) * panel.grid
      component.y = Math.round(y / panel.grid) * panel.grid
      panel.updatedAt = Date.now()
    }
  }

  /** 调整组件尺寸（会自动吸附网格） */
  function resizeComponent(id: string, width: number, height: number): void {
    const panel = getEditablePanel()
    if (!panel) return

    const component = panel.components.find(c => c.id === id)
    if (component && !component.locked) {
      component.config.width = Math.round(width / panel.grid) * panel.grid
      component.config.height = Math.round(height / panel.grid) * panel.grid
      panel.updatedAt = Date.now()
    }
  }

  /** 绑定/解绑组件点位 */
  function bindPoint(componentId: string, binding: PointBinding | null): void {
    updateComponent(componentId, { binding })
  }

  /** 复制指定组件（在原地生成一份带偏移的副本）；分组组件复制整组并保持成组 */
  function duplicateComponent(id: string): void {
    const panel = getEditablePanel()
    if (!panel) return

    const component = panel.components.find(c => c.id === id)
    if (!component) return

    // 分组组件：复制整组，副本共享一个全新 groupId（与原组相互独立）
    if (component.groupId) {
      const members = panel.components.filter(c => c.groupId === component.groupId)
      const newGroupId = `group-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const newIds: string[] = []

      members.forEach(m => {
        const copy = cloneComponent(m, { x: m.x + 20, y: m.y + 20 }, t('common.duplicateSuffix'), t)
        copy.groupId = newGroupId
        newIds.push(copy.id)
        panel.components.push(copy)
      })

      undo.pushOperation(
        'duplicate',
        t('scada.undoOperations.duplicate', { name: component.name }),
        newIds
      )
      panel.updatedAt = Date.now()
      return
    }

    const newComponent = cloneComponent(component, {
      x: component.x + 20,
      y: component.y + 20
    }, t('common.duplicateSuffix'), t)
    // 单组件副本不保留分组关系
    newComponent.groupId = null

    undo.pushOperation('duplicate', t('scada.undoOperations.duplicate', { name: component.name }), [newComponent.id])

    panel.components.push(newComponent)
    panel.updatedAt = Date.now()
  }

  /** 复制单个组件到剪贴板 */
  function copyComponent(id: string): void {
    if (!currentPanel.value) return
    const component = currentPanel.value.components.find(c => c.id === id)
    if (component) {
      clipboard.value = [JSON.parse(JSON.stringify(component))]
    }
  }

  /** 复制所有选中组件到剪贴板 */
  function copySelectedComponents(): void {
    if (!currentPanel.value || selectedComponentIds.value.length === 0) return
    clipboard.value = selectedComponentIds.value
      .map(id => currentPanel.value?.components.find(c => c.id === id))
      .filter((c): c is ScadaComponent => !!c)
      .map(c => JSON.parse(JSON.stringify(c)))
  }

  /** 粘贴剪贴板组件到指定坐标 */
  function pasteComponent(x?: number, y?: number): void {
    const panel = getEditablePanel()
    if (!panel || clipboard.value.length === 0) return

    const newIds: string[] = []
    // 剪贴板内同组组件映射到同一个全新 groupId：副本之间保持成组、与原组相互独立
    const groupIdRemap = new Map<string, string>()

    clipboard.value.forEach((clipComp, index) => {
      const offset = index * 20
      const newComponent = cloneComponent(clipComp, {
        x: x !== undefined ? x + offset : clipComp.x + 20,
        y: y !== undefined ? y + offset : clipComp.y + 20
      }, t('common.duplicateSuffix'), t)

      if (clipComp.groupId) {
        let newGroupId = groupIdRemap.get(clipComp.groupId)
        if (!newGroupId) {
          newGroupId = `group-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
          groupIdRemap.set(clipComp.groupId, newGroupId)
        }
        newComponent.groupId = newGroupId
      } else {
        newComponent.groupId = null
      }

      newIds.push(newComponent.id)
      panel.components.push(newComponent)
    })

    undo.pushOperation(
      'paste',
      t('scada.undoOperations.paste', { count: newIds.length }),
      newIds
    )

    panel.updatedAt = Date.now()

    selectedComponentIds.value = newIds
    if (newIds.length > 0) {
      selectedComponentId.value = newIds[0]
    }
  }

  /** 切换组件锁定状态 */
  function toggleLock(id: string): void {
    const panel = getEditablePanel()
    if (!panel) return
    const component = panel.components.find(c => c.id === id)
    if (component) {
      const willLock = !component.locked

      undo.pushOperation('lock', willLock ? t('scada.undoOperations.lock') : t('scada.undoOperations.unlock'), [id])

      component.locked = willLock
      panel.updatedAt = Date.now()
    }
  }

  /** 调整组件在图层中的顺序 */
  function reorderComponent(id: string, toFront: boolean): void {
    const panel = getEditablePanel()
    if (!panel) return

    const index = panel.components.findIndex(c => c.id === id)
    if (index === -1) return

    undo.pushOperation('reorder', toFront ? t('scada.undoOperations.bringToFront') : t('scada.undoOperations.sendToBack'), [id])

    const [component] = panel.components.splice(index, 1)
    if (toFront) {
      panel.components.push(component)
    } else {
      panel.components.unshift(component)
    }
    panel.updatedAt = Date.now()
  }

  function bringToFront(id: string): void {
    reorderComponent(id, true)
  }

  function sendToBack(id: string): void {
    reorderComponent(id, false)
  }

  /** 将选中的多个组件组合为一组 */
  function groupComponents(): void {
    const panel = getEditablePanel()
    if (!panel || selectedComponentIds.value.length < 2) return

    // 部分选中的组扩展为整组，避免重组后残留只有零星成员的"孤儿组"
    const expandedIds = new Set<string>()
    selectedComponentIds.value.forEach(id => {
      const comp = panel.components.find(c => c.id === id)
      if (!comp) return
      if (comp.groupId) {
        panel.components.forEach(c => {
          if (c.groupId === comp.groupId) expandedIds.add(c.id)
        })
      } else {
        expandedIds.add(id)
      }
    })

    if (expandedIds.size < 2) return

    const groupId = `group-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    undo.pushOperation(
      'group',
      t('scada.undoOperations.group', { count: expandedIds.size }),
      Array.from(expandedIds)
    )

    expandedIds.forEach(id => {
      const comp = panel.components.find(c => c.id === id)
      if (comp) {
        comp.groupId = groupId
      }
    })
    panel.updatedAt = Date.now()

    // 选中集同步为扩展后的整组成员
    selectedComponentIds.value = Array.from(expandedIds)
    selectedComponentId.value = selectedComponentIds.value[0] ?? null
  }

  /** 将选中组件所在的组解散 */
  function ungroupComponents(): void {
    const panel = getEditablePanel()
    if (!panel || selectedComponentIds.value.length === 0) return

    const groupIds = new Set<string>()
    selectedComponentIds.value.forEach(id => {
      const comp = panel.components.find(c => c.id === id)
      if (comp?.groupId) {
        groupIds.add(comp.groupId)
      }
    })

    if (groupIds.size === 0) return

    const affectedIds = panel.components
      .filter(c => c.groupId && groupIds.has(c.groupId))
      .map(c => c.id)

    undo.pushOperation(
      'ungroup',
      t('scada.undoOperations.ungroup', { count: affectedIds.length }),
      affectedIds
    )

    panel.components.forEach(c => {
      if (c.groupId && groupIds.has(c.groupId)) {
        c.groupId = null
      }
    })
    panel.updatedAt = Date.now()
  }

  /** 获取指定组件所属组的所有组件 ID */
  function getGroupMemberIds(componentId: string): string[] {
    const panel = currentPanel.value
    if (!panel) return []

    const comp = panel.components.find(c => c.id === componentId)
    if (!comp?.groupId) return []

    return panel.components
      .filter(c => c.groupId === comp.groupId)
      .map(c => c.id)
  }

  /** 判断选中组件是否处于分组状态 */
  function hasSelectedGroup(): boolean {
    if (selectedComponentIds.value.length === 0) return false
    const panel = currentPanel.value
    if (!panel) return false

    return selectedComponentIds.value.some(id => {
      const comp = panel.components.find(c => c.id === id)
      return !!comp?.groupId
    })
  }

  /** 标记需要滚动定位的组件 */
  function scrollToComponent(id: string): void {
    scrollToComponentId.value = id
  }

  /** 清除滚动定位标记 */
  function clearScrollTarget(): void {
    scrollToComponentId.value = null
  }

  return {
    // 状态引用
    currentPanelId,
    selectedComponentId,
    selectedComponentIds,
    isEditing,
    zoom,
    showGrid,
    isFullscreenPreview,
    isDirty,
    clipboard,
    scrollToComponentId,
    // 计算属性
    currentPanel,
    selectedComponent,
    // 面板操作
    loadPanel,
    loadPanelFromProject,
    savePanel,
    discardDraft,
    selectPanel,
    updatePanel,
    // 组件操作
    addComponent,
    updateComponent,
    deleteComponent,
    deleteSelectedComponents,
    selectComponent,
    selectComponents,
    selectAllComponents,
    clearSelection,
    moveComponent,
    resizeComponent,
    bindPoint,
    duplicateComponent,
    copyComponent,
    copySelectedComponents,
    pasteComponent,
    toggleLock,
    bringToFront,
    sendToBack,
    groupComponents,
    ungroupComponents,
    getGroupMemberIds,
    hasSelectedGroup,
    // 辅助
    scrollToComponent,
    clearScrollTarget,
    // 撤销/重做
    canUndo: undo.canUndo,
    canRedo: undo.canRedo,
    undo: undo.undo,
    redo: undo.redo,
    pushUndoOperation: undo.pushOperation,
    popLastUndoOperation: undo.popLastOperation
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 数据导入导出（与 useScadaEditor 共享同一份状态）
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 验证组件数据完整性
 * @param data 待验证数据
 */
export function validateComponent(data: unknown): data is ScadaComponent {
  if (typeof data !== 'object' || data === null) return false

  const comp = data as Partial<ScadaComponent>
  return (
    typeof comp.id === 'string' &&
    typeof comp.type === 'string' &&
    typeof comp.name === 'string' &&
    typeof comp.x === 'number' &&
    typeof comp.y === 'number' &&
    typeof comp.config === 'object' &&
    comp.config !== null &&
    typeof comp.config.width === 'number' &&
    typeof comp.config.height === 'number' &&
    typeof comp.locked === 'boolean' &&
    typeof comp.visible === 'boolean'
  )
}

/**
 * 验证面板数据完整性
 * @param data 待验证数据
 */
export function validatePanel(data: unknown): ScadaPanel | null {
  if (typeof data !== 'object' || data === null) return null

  const panel = data as Partial<ScadaPanel>
  if (
    typeof panel.name !== 'string' ||
    typeof panel.type !== 'string' ||
    typeof panel.width !== 'number' ||
    typeof panel.height !== 'number' ||
    !Array.isArray(panel.components)
  ) {
    return null
  }

  const validComponents = panel.components.filter((c) => validateComponent(c))

  return {
    id: panel.id || `project-${Date.now()}`,
    name: panel.name,
    type: (panel.type as ScadaPanel['type']) || 'Dashboard',
    description: typeof panel.description === 'string' ? panel.description : undefined,
    width: Math.max(400, Math.min(4096, panel.width)),
    height: Math.max(300, Math.min(4096, panel.height)),
    grid: typeof panel.grid === 'number' ? Math.max(10, Math.min(50, panel.grid)) : 20,
    backgroundColor: typeof panel.backgroundColor === 'string' ? panel.backgroundColor : '#f0f2f5',
    backgroundImage: typeof panel.backgroundImage === 'string' ? panel.backgroundImage : undefined,
    adaptMode: normalizeAdaptMode(panel.adaptMode),
    components: validComponents,
    createdAt: typeof panel.createdAt === 'number' ? panel.createdAt : Date.now(),
    updatedAt: Date.now()
  }
}

/**
 * 将面板序列化为 JSON 字符串
 * @param panel 面板对象
 */
export function serializePanel(panel: ScadaPanel): string {
  return JSON.stringify(panel, null, 2)
}

/**
 * 从 JSON 字符串反序列化并验证面板
 * @param jsonString JSON 字符串
 */
export function deserializePanel(jsonString: string): ScadaPanel | null {
  try {
    const data = JSON.parse(jsonString)
    return validatePanel(data)
  } catch {
    return null
  }
}

/**
 * Scada 面板数据导入导出 Hook
 */
export function useScadaData() {
  const scada = useScadaEditor()

  const currentPanel = computed(() => scada.currentPanel.value)

  /** 导出当前面板为 JSON 文件 */
  const exportPanel = (panel?: ScadaPanel) => {
    const targetPanel = panel || currentPanel.value
    if (!targetPanel) return
    downloadJson(targetPanel, `${targetPanel.name}.json`)
    return targetPanel
  }

  /** 从 JSON 字符串导入面板数据并替换当前面板内容 */
  const importPanel = async (jsonString: string): Promise<ScadaPanel | null> => {
    try {
      const data = JSON.parse(jsonString)
      const panel = validatePanel(data)
      if (!panel) return null

      scada.clearSelection()
      scada.updatePanel({
        width: panel.width,
        height: panel.height,
        grid: panel.grid,
        backgroundColor: panel.backgroundColor,
        backgroundImage: panel.backgroundImage,
        components: panel.components
      })

      return panel
    } catch {
      return null
    }
  }

  return {
    currentPanel,
    exportPanel,
    importPanel,
    serializePanel,
    deserializePanel,
    validatePanel,
    validateComponent
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 单组件实例 Hook
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 为单个组件实例提供便捷的状态查询与操作方法
 * @param componentId 组件 ID
 */
export function useScadaElement(componentId: string) {
  const scada = useScadaEditor()

  const component = computed(() => {
    const panel = scada.currentPanel.value
    if (!panel) return null
    return panel.components.find(c => c.id === componentId) ?? null
  })

  const isSelected = computed(() => scada.selectedComponentId.value === componentId)
  const isMultiSelected = computed(() => scada.selectedComponentIds.value.includes(componentId))
  const isLocked = computed(() => component.value?.locked ?? false)

  const select = () => scada.selectComponent(componentId)
  const update = (updates: Partial<ScadaComponent>) => scada.updateComponent(componentId, updates)
  const deleteElement = () => scada.deleteComponent(componentId)
  const toggleLock = () => scada.toggleLock(componentId)
  const bringToFront = () => scada.bringToFront(componentId)
  const sendToBack = () => scada.sendToBack(componentId)

  return {
    component,
    isSelected,
    isMultiSelected,
    isLocked,
    select,
    update,
    deleteElement,
    toggleLock,
    bringToFront,
    sendToBack
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 组件配置 Hook
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 提供对组件 config 对象的类型安全读写能力
 * @param component 组件对象
 */
export function useScadaConfig<T extends ComponentType = ComponentType>(component: ScadaComponent<T>) {
  const scada = useScadaEditor()

  /**
   * 始终从当前面板中读取该组件的最新配置。
   * 当首次编辑触发草稿面板（draftPanel）深拷贝后，传入的 component 对象可能不再
   * 与面板中的组件同步；依赖 currentPanel 可保证配置面板与画布状态一致。
   */
  const config = computed((): ScadaComponent<T>['config'] => {
    const latest = scada.currentPanel.value?.components.find(c => c.id === component.id)
    return (latest?.config ?? component.config) as ScadaComponent<T>['config']
  })

  /** 从当前面板获取该组件的最新配置，避免连续更新时读取到过期状态 */
  const getLatestConfig = (): ScadaComponent<T>['config'] => {
    return config.value
  }

  /** 更新单个配置项 */
  const updateConfig = <K extends keyof ComponentConfig<T>>(
    key: K,
    value: ComponentConfig<T>[K]
  ) => {
    scada.updateComponent(component.id, {
      config: { ...getLatestConfig(), [key]: value }
    } as Partial<ScadaComponent<T>>)
  }

  /** 批量更新多个配置项 */
  const updateConfigs = (updates: Partial<ComponentConfig<T>>) => {
    scada.updateComponent(component.id, {
      config: { ...getLatestConfig(), ...updates }
    } as Partial<ScadaComponent<T>>)
  }

  /** 更新 value 字段 */
  const updateValue = (value: ComponentConfig<T>['value']) => {
    updateConfig('value', value as ComponentConfig<T>['value'])
  }

  return { config, updateConfig, updateConfigs, updateValue }
}


