/**
 * 组件通用工具
 * 用于在列表、配置面板等处统一解析组件名称与图标
 */

import type { ScadaComponent, ComponentType } from '@/types/scada'
import { getComponentMeta } from '../component-registry'

/** 解析组件显示名称：支持国际化 key 或自定义名称 */
export function resolveComponentName(
  component: ScadaComponent | null | undefined,
  t: (key: string) => string
): string {
  if (!component) return ''
  if (component.name?.startsWith('scadaComponentNames.')) {
    return t(component.name)
  }
  return component.name || component.type
}

/** 获取组件图标，未注册时返回默认占位 */
export function getComponentIcon(type: string): string {
  const meta = getComponentMeta(type as ComponentType)
  return meta?.template.icon || '☐'
}
