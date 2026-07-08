import { computed } from 'vue'
import { useScadaStore } from '@/stores/scada'
import type { ScadaComponent, PointBinding } from '../types'
import type { ComponentType } from '../registry'
import { getComponentMeta } from '../registry'

export function useScadaElement() {
  const scadaStore = useScadaStore()

  const currentPanel = computed(() => scadaStore.currentPanel)
  const components = computed(() => currentPanel.value?.components || [])
  const selectedId = computed(() => scadaStore.selectedComponentId)
  const selectedIds = computed(() => scadaStore.selectedComponentIds)
  const selectedComponent = computed(() => scadaStore.selectedComponent)

  const addComponent = (type: ComponentType, x: number, y: number) => {
    const component = scadaStore.addComponent(type, x, y)
    if (component) {
      scadaStore.selectComponent(component.id)
    }
    return component
  }

  const updateComponent = (id: string, updates: Partial<ScadaComponent>) => {
    scadaStore.updateComponent(id, updates)
  }

  const deleteComponent = (id: string) => {
    scadaStore.deleteComponent(id)
  }

  const deleteSelectedComponents = () => {
    scadaStore.deleteSelectedComponents()
  }

  const selectComponent = (id: string | null) => {
    scadaStore.selectComponent(id)
  }

  const selectAllComponents = () => {
    scadaStore.selectAllComponents()
  }

  const clearSelection = () => {
    scadaStore.clearSelection()
  }

  const moveComponent = (id: string, x: number, y: number) => {
    scadaStore.moveComponent(id, x, y)
  }

  const resizeComponent = (id: string, width: number, height: number) => {
    scadaStore.resizeComponent(id, width, height)
  }

  const bindPoint = (componentId: string, binding: PointBinding | null) => {
    scadaStore.bindPoint(componentId, binding)
  }

  const duplicateComponent = (id: string) => {
    scadaStore.duplicateComponent(id)
  }

  const copyComponent = (id: string) => {
    scadaStore.copyComponent(id)
  }

  const copySelectedComponents = () => {
    scadaStore.copySelectedComponents()
  }

  const pasteComponent = (x?: number, y?: number) => {
    scadaStore.pasteComponent(x, y)
  }

  const toggleLock = (id: string) => {
    scadaStore.toggleLock(id)
  }

  const bringToFront = (id: string) => {
    scadaStore.bringToFront(id)
  }

  const sendToBack = (id: string) => {
    scadaStore.sendToBack(id)
  }

  const scrollToComponent = (id: string) => {
    scadaStore.scrollToComponent(id)
  }

  const resolveComponentName = (component: ScadaComponent | null | undefined, t: (key: string) => string): string => {
    if (!component) return ''
    if (component.name?.startsWith('scadaComponentNames.')) {
      return t(component.name)
    }
    return component.name || component.type
  }

  const getComponentIcon = (type: string): string => {
    const meta = getComponentMeta(type as ComponentType)
    return meta?.template.icon || '☐'
  }

  return {
    currentPanel,
    components,
    selectedId,
    selectedIds,
    selectedComponent,
    addComponent,
    updateComponent,
    deleteComponent,
    deleteSelectedComponents,
    selectComponent,
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
    scrollToComponent,
    resolveComponentName,
    getComponentIcon
  }
}