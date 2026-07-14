import { ref, computed } from 'vue'

export type OperationType =
  | 'add'
  | 'delete'
  | 'update'
  | 'move'
  | 'resize'
  | 'bind'
  | 'duplicate'
  | 'paste'
  | 'lock'
  | 'reorder'
  | 'panel'

export interface UndoOperation {
  id: string
  type: OperationType
  description: string
  componentIds?: string[]
}

const MAX_HISTORY = 100

const undoStack = ref<{ state: string; op: UndoOperation }[]>([])
const redoStack = ref<{ state: string; op: UndoOperation }[]>([])

type StateProvider = () => string
type StateRestorer = (state: string) => void

let stateProvider: StateProvider | null = null
let stateRestorer: StateRestorer | null = null

export function setupUndoSystem(
  provider: StateProvider,
  restorer: StateRestorer
): void {
  stateProvider = provider
  stateRestorer = restorer
}

export function useScadaUndo() {
  const canUndo = computed(() => undoStack.value.length > 0)
  const canRedo = computed(() => redoStack.value.length > 0)

  const generateOpId = (): string =>
    `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const pushOperation = (
    type: OperationType,
    description: string,
    componentIds?: string[]
  ): void => {
    if (!stateProvider) return

    const state = stateProvider()
    const op: UndoOperation = {
      id: generateOpId(),
      type,
      description,
      componentIds
    }

    undoStack.value.push({ state, op })

    if (undoStack.value.length > MAX_HISTORY) {
      undoStack.value.shift()
    }

    redoStack.value = []
  }

  const undo = (): void => {
    if (undoStack.value.length === 0 || !stateRestorer) return

    const currentState = stateProvider?.()
    const { state: prevState, op } = undoStack.value.pop()!

    stateRestorer(prevState)

    if (currentState) {
      redoStack.value.push({ state: currentState, op })
    }
  }

  const redo = (): void => {
    if (redoStack.value.length === 0 || !stateRestorer) return

    const currentState = stateProvider?.()
    const { state: nextState, op } = redoStack.value.pop()!

    stateRestorer(nextState)

    if (currentState) {
      undoStack.value.push({ state: currentState, op })
    }
  }

  const clearHistory = (): void => {
    undoStack.value = []
    redoStack.value = []
  }

  const popLastOperation = (): void => {
    if (undoStack.value.length > 0) {
      undoStack.value.pop()
    }
  }

  const getLastOperation = (): UndoOperation | null => {
    const last = undoStack.value[undoStack.value.length - 1]
    return last?.op ?? null
  }

  return {
    canUndo,
    canRedo,
    pushOperation,
    undo,
    redo,
    clearHistory,
    getLastOperation,
    popLastOperation
  }
}