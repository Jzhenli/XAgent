import { reactive, watch } from 'vue'

/** UI 偏好字段：在这里添加新字段即可自动持久化 */
export interface ScadaUiPrefs {
  showComponentList: boolean
  paletteCompact: boolean
  // 后续新增偏好字段写这里，给默认值即可
}

const DEFAULT_PREFS: ScadaUiPrefs = {
  showComponentList: false,
  paletteCompact: false,
}

/** 单一 localStorage key，值为 { [panelId]: ScadaUiPrefs } 的嵌套 map */
export const UI_PREFS_STORAGE_KEY = 'scadaEditor.uiPrefs'

type PrefsMap = Record<string, Partial<ScadaUiPrefs>>

const loadMap = (): PrefsMap => {
  try {
    const raw = localStorage.getItem(UI_PREFS_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return {}
}

const saveMap = (map: PrefsMap) => {
  try { localStorage.setItem(UI_PREFS_STORAGE_KEY, JSON.stringify(map)) } catch { /* ignore */ }
}

/**
 * 按 panelId 隔离的 Scada 编辑器 UI 偏好
 * - 单一 localStorage key，内部用 panelId 作为二级 key
 * - reactive 对象，字段自动持久化；新增字段只需在 ScadaUiPrefs + DEFAULT_PREFS 里加
 */
export function useScadaUiPrefs(panelId: string) {
  // 每次进入编辑器时载入全量 map
  const prefsMap = reactive<PrefsMap>(loadMap())

  // 合并默认值 + 已存值
  const merged = { ...DEFAULT_PREFS, ...prefsMap[panelId] }
  const prefs = reactive<ScadaUiPrefs>(merged)

  // 当前 panelId 的偏好变化 → 回写到 map → 整体存 localStorage
  watch(
    () => ({ ...prefs }),
    (val) => {
      prefsMap[panelId] = val
      saveMap({ ...prefsMap })
    },
    { deep: true },
  )

  return prefs
}
