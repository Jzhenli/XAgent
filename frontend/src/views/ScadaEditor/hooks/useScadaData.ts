import { computed } from 'vue'
import { useScadaStore } from '@/stores/scada'
import type { ScadaPanel, ScadaComponent } from '../types'
import { downloadJson } from '../utils/dom'

export function useScadaData() {
  const scadaStore = useScadaStore()

  const currentPanel = computed(() => scadaStore.currentPanel)
  const panels = computed(() => scadaStore.panels)

  const exportPanel = (panel?: ScadaPanel) => {
    const targetPanel = panel || currentPanel.value
    if (!targetPanel) return

    downloadJson(targetPanel, `${targetPanel.name}.json`)
    return targetPanel
  }

  const exportAllPanels = () => {
    downloadJson(panels.value, 'all-panels.json')
    return panels.value
  }

  const importPanel = (jsonString: string): ScadaPanel | null => {
    try {
      const data = JSON.parse(jsonString)
      const panel = validatePanel(data)
      if (panel) {
        panel.id = `panel-${Date.now()}`
        panel.createdAt = Date.now()
        panel.updatedAt = Date.now()
        panel.components.forEach((comp) => {
          comp.id = `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        })
        scadaStore.panels.push(panel)
        scadaStore.selectPanel(panel.id)
        return panel
      }
      return null
    } catch {
      return null
    }
  }

  const validatePanel = (data: unknown): ScadaPanel | null => {
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
      id: panel.id || `panel-${Date.now()}`,
      name: panel.name,
      type: (panel.type as ScadaPanel['type']) || 'Dashboard',
      description: typeof panel.description === 'string' ? panel.description : undefined,
      width: Math.max(400, Math.min(4096, panel.width)),
      height: Math.max(300, Math.min(4096, panel.height)),
      grid: typeof panel.grid === 'number' ? Math.max(10, Math.min(50, panel.grid)) : 20,
      backgroundColor: typeof panel.backgroundColor === 'string' ? panel.backgroundColor : '#f0f2f5',
      backgroundImage: typeof panel.backgroundImage === 'string' ? panel.backgroundImage : undefined,
      components: validComponents,
      createdAt: typeof panel.createdAt === 'number' ? panel.createdAt : Date.now(),
      updatedAt: Date.now()
    }
  }

  const validateComponent = (data: unknown): data is ScadaComponent => {
    if (typeof data !== 'object' || data === null) return false

    const comp = data as Partial<ScadaComponent>
    return (
      typeof comp.id === 'string' &&
      typeof comp.type === 'string' &&
      typeof comp.name === 'string' &&
      typeof comp.x === 'number' &&
      typeof comp.y === 'number' &&
      typeof comp.style === 'object' &&
      comp.style !== null &&
      typeof comp.style.width === 'number' &&
      typeof comp.style.height === 'number' &&
      typeof comp.locked === 'boolean' &&
      typeof comp.visible === 'boolean'
    )
  }

  const serializePanel = (panel: ScadaPanel): string => {
    return JSON.stringify(panel, null, 2)
  }

  const deserializePanel = (jsonString: string): ScadaPanel | null => {
    try {
      const data = JSON.parse(jsonString)
      return validatePanel(data)
    } catch {
      return null
    }
  }

  const cloneComponent = (
    source: ScadaComponent,
    overrides: Partial<ScadaComponent> = {}
  ): ScadaComponent => {
    return {
      ...JSON.parse(JSON.stringify(source)),
      id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${source.name} (副本)`,
      ...overrides
    }
  }

  const createPanel = (
    name: string,
    type: ScadaPanel['type'] = 'Dashboard',
    description?: string,
    width?: number,
    height?: number
  ) => {
    return scadaStore.createPanel(name, type, description, width, height)
  }

  const deletePanel = (id: string) => {
    scadaStore.deletePanel(id)
  }

  const updatePanel = (updates: Partial<ScadaPanel>) => {
    scadaStore.updatePanel(updates)
  }

  const selectPanel = (id: string) => {
    scadaStore.selectPanel(id)
  }

  return {
    currentPanel,
    panels,
    exportPanel,
    exportAllPanels,
    importPanel,
    serializePanel,
    deserializePanel,
    validatePanel,
    validateComponent,
    cloneComponent,
    createPanel,
    deletePanel,
    updatePanel,
    selectPanel
  }
}