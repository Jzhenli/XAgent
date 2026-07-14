import type { PanelType } from '@/views/ScadaEditor/types'

export interface Project {
  id: string
  name: string
  type: PanelType
  description?: string
  data: any
  createdAt: number
  updatedAt: number
}