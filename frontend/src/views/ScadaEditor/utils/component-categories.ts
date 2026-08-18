import type { ComponentTemplate } from '@/types/scada'
import { getAllTemplates } from '../component-registry'

export interface CategoryConfig {
  key: string
  icon: string
  order: number
}

export const COMPONENT_CATEGORIES: CategoryConfig[] = [
  { key: 'basic', icon: '📝', order: 1 },
  { key: 'layout', icon: '📦', order: 2 },
  { key: 'chart', icon: '📊', order: 3 },
]

export const getSortedCategories = (): CategoryConfig[] => {
  return [...COMPONENT_CATEGORIES].sort((a, b) => a.order - b.order)
}

export const getComponentsByCategory = (categoryKey: string): ComponentTemplate[] => {
  const templates = getAllTemplates()
  return templates.filter(t => t.category === `scadaComponentCategories.${categoryKey}`)
}

export const getGroupedComponents = (): Record<string, ComponentTemplate[]> => {
  const grouped: Record<string, ComponentTemplate[]> = {}
  
  for (const category of getSortedCategories()) {
    const components = getComponentsByCategory(category.key)
    if (components.length > 0) {
      grouped[category.key] = components
    }
  }
  
  return grouped
}

export const getCategoryConfig = (key: string): CategoryConfig | undefined => {
  return COMPONENT_CATEGORIES.find(c => c.key === key)
}