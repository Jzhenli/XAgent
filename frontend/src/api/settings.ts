import api from './index'

export interface SettingResponse {
  key: string
  value: any
  updatedAt: number
}

export interface SettingListResponse {
  settings: Record<string, any>
}

export const settingsApi = {
  /** 读取单条设置（key 不存在返回 null） */
  async get<T = any>(key: string): Promise<T | null> {
    try {
      const res = await api.get<SettingResponse>(`/api/settings/${key}`)
      return res.data.value as T
    } catch (err: any) {
      if (err.response?.status === 404) return null
      throw err
    }
  },

  /** 写入/覆盖设置（upsert） */
  async set<T = any>(key: string, value: T): Promise<SettingResponse> {
    const res = await api.put<SettingResponse>(`/api/settings/${key}`, value)
    return res.data
  },

  /** 删除设置 */
  async remove(key: string): Promise<void> {
    await api.delete(`/api/settings/${key}`)
  },

  /** 列出全部设置 */
  async list(): Promise<SettingListResponse> {
    const res = await api.get<SettingListResponse>('/api/settings')
    return res.data
  },
}
