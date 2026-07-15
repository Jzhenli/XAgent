import type { ScadaComponent, StyleConfig, ComponentConfig } from '../types'
import type { ComponentType } from '../registry'
import { getComponentTemplate, componentMetaRegistry } from '../component-registry'

/**
 * 生成唯一组件ID
 */
export function generateComponentId(): string {
  return `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 深拷贝组件并生成新ID
 * @param source - 源组件
 * @param overrides - 覆盖属性
 * @param nameSuffix - 复制名称后缀（应传入当前语言的翻译文本）
 */
export function cloneComponent(
  source: ScadaComponent,
  overrides: Partial<ScadaComponent> = {},
  nameSuffix = ' (copy)'
): ScadaComponent {
  return {
    ...JSON.parse(JSON.stringify(source)),
    id: generateComponentId(),
    name: `${source.name}${nameSuffix}`,
    ...overrides
  }
}

/**
 * 解析组件显示名称：支持国际化 key 或自定义名称
 * @param component - 组件对象
 * @param t - 国际化函数
 */
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

/**
 * 判断组件数据是否为旧格式（包含独立的 style/currentValue/xxxConfig 字段）
 */
function isLegacyComponent(data: Record<string, unknown>): boolean {
  return !data.config || typeof data.config !== 'object'
}

/**
 * 提取旧格式中的业务配置字段
 */
const legacyConfigKeys: Record<string, string[]> = {
  text: ['textConfig'],
  gauge: ['gaugeConfig'],
  'chart-line': ['chartConfig'],
  'chart-bar': ['chartConfig'],
  indicator: ['indicatorConfig'],
  switch: ['switchConfig'],
  slider: ['sliderConfig'],
  image: ['imageConfig'],
  button: ['buttonConfig']
}

/**
 * 将旧格式组件数据迁移为新的统一 config 格式
 * @param data - 原始组件数据
 */
export function migrateComponentConfig(data: unknown): ScadaComponent | null {
  if (typeof data !== 'object' || data === null) return null

  const comp = data as Record<string, unknown>
  if (typeof comp.id !== 'string' || typeof comp.type !== 'string') return null

  if (!(comp.type in componentMetaRegistry)) {
    return null
  }

  const type = comp.type as ComponentType

  if (!isLegacyComponent(comp)) {
    return comp as unknown as ScadaComponent
  }

  const template = getComponentTemplate(type)
  const defaultConfig = template
    ? (JSON.parse(JSON.stringify(template.defaultConfig)) as ComponentConfig)
    : { width: 100, height: 100 }

  const style = (comp.style as StyleConfig) || {
    width: defaultConfig.width,
    height: defaultConfig.height
  }

  const config: ComponentConfig = {
    ...defaultConfig,
    ...style,
    value: comp.currentValue !== undefined ? (comp.currentValue as ComponentConfig['value']) : defaultConfig.value
  }

  const keys = legacyConfigKeys[type] || []
  for (const key of keys) {
    const legacyConfig = comp[key]
    if (legacyConfig && typeof legacyConfig === 'object') {
      Object.assign(config, legacyConfig)
    }
  }

  config.width = typeof style.width === 'number' ? style.width : defaultConfig.width ?? 100
  config.height = typeof style.height === 'number' ? style.height : defaultConfig.height ?? 100

  return {
    id: comp.id,
    type,
    name: typeof comp.name === 'string' ? comp.name : type,
    x: typeof comp.x === 'number' ? comp.x : 0,
    y: typeof comp.y === 'number' ? comp.y : 0,
    config,
    binding: comp.binding || null,
    locked: !!comp.locked,
    visible: comp.visible !== false
  } as ScadaComponent
}

/**
 * 批量迁移组件数据
 * @param components - 原始组件数组
 */
export function migrateComponents(components: unknown[]): ScadaComponent[] {
  return components
    .map(c => migrateComponentConfig(c))
    .filter((c): c is ScadaComponent => c !== null)
}
