// frontend/src/utils/panelStore.ts
import localforage from 'localforage'
import type { Project } from '@/types/project'

/**
 * 面板 IndexedDB 缓存（预览会话级）
 *
 * 生命周期: 预览页 fetchPanels/preloadAll → 写入
 *          退出预览（handleGoBack / exit）→ clear()
 *
 * 用途: 绕开 base64 图片导致的 ~1s 网络 + 三次 JSON 序列化瓶颈。
 * IndexedDB 用 structured clone 直接存对象，不做 JSON 字符串化，
 * 读 8MB 对象只需 ~10ms，比 HTTP localhost + 三次 JSON 序列化 (~1s) 快 100x。
 *
 * 为什么用 localforage 而非原生 IndexedDB:
 * - 已在 package.json（^1.10.0），零新依赖
 * - Promise API，比原生回调简洁
 * - 显式指定 INDEXEDDB driver，不降级
 * - structured clone 直接存对象，不需要 JSON 序列化
 */
const store = localforage.createInstance({
  name: 'XAgent',
  storeName: 'panel-cache',
  driver: localforage.INDEXEDDB
})

export const panelStore = {
  /** 读取单个面板 */
  async get(panelId: string): Promise<Project | null> {
    try {
      return await store.getItem<Project>(panelId)
    } catch (e) {
      console.warn('[panelStore] get failed:', e)
      return null
    }
  },

  /** 写入单个面板 */
  async set(project: Project): Promise<void> {
    try {
      await store.setItem(project.id, project)
    } catch (e) {
      console.warn('[panelStore] set failed:', e)
    }
  },

  /**
   * 批量写入 —— list() 后调用（vant fetchPanels + preloadAll 共用）
   * localforage 内部 IndexedDB 事务会合并多次 put
   */
  async setMany(projects: Project[]): Promise<void> {
    try {
      for (const p of projects) {
        await store.setItem(p.id, p)
      }
    } catch (e) {
      console.warn('[panelStore] setMany failed:', e)
    }
  },

  /**
   * 预加载所有项目 —— ScadaPreview / GraphicPreview 进入后后台跑
   * 不 await，不阻塞首屏加载体验
   */
  async preloadAll(): Promise<void> {
    try {
      const { projectApi } = await import('@/api/projects')
      const res = await projectApi.list()
      const items = res.items ?? []
      await this.setMany(items)
      console.log(`[panelStore] preloaded ${items.length} panels`)
    } catch (e) {
      console.warn('[panelStore] preloadAll failed:', e)
    }
  },

  /** 彻底清空 —— handleGoBack / exit 退出预览态时调用 */
  async clear(): Promise<void> {
    try {
      await store.clear()
      console.log('[panelStore] cleared')
    } catch (e) {
      console.warn('[panelStore] clear failed:', e)
    }
  },

  /** 当前缓存数量（调试用） */
  async size(): Promise<number> {
    try {
      return await store.length()
    } catch {
      return 0
    }
  }
}
