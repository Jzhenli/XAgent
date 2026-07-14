import api from './index'
import type { Project } from '@/types/project'

export interface ProjectListResponse {
  items: Project[]
  total: number
}

export interface ProjectCreateRequest {
  id: string
  name: string
  type: Project['type']
  description?: string
  data?: any
  createdAt?: number
  updatedAt?: number
}

export interface ProjectUpdateRequest {
  name?: string
  description?: string
  data?: Record<string, unknown>
}

export interface ProjectCreateResponse {
  success: boolean
  project: Project
}

export interface ProjectUpdateResponse {
  success: boolean
  project: Project
}

export interface ProjectDeleteResponse {
  success: boolean
  message: string
}

export const projectApi = {
  async list(): Promise<ProjectListResponse> {
    const res = await api.get('/api/panels/')
    return res.data
  },

  async get(id: string): Promise<Project> {
    const res = await api.get(`/api/panels/${id}`)
    return res.data
  },

  async create(request: ProjectCreateRequest): Promise<any> {
    const res = await api.post('/api/panels/', request)
    return res.data
  },

  async update(id: string, request: any): Promise<any> {
    const res = await api.put(`/api/panels/${id}`, request)
    return res.data
  },

  async delete(id: string): Promise<ProjectDeleteResponse> {
    const res = await api.delete(`/api/panels/${id}`)
    return res.data
  }
}