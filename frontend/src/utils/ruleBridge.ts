import type { RuleNode, RuleEdge, NodeType } from '@/types/rule'
import type {
  RuleResponse,
  RuleCreateRequest,
  RuleUpdateRequest,
  RulePluginConfig,
  RuleDataSubscription,
  RuleNotificationConfig
} from '@/api/types'
import { graphToExpression, graphToExpressions, groupNodesIntoChains } from './ruleConverter'
import i18n from '@/i18n'

const VISUAL_GRAPH_KEY = '_visual_graph'

export interface RuleViewItem {
  id: string
  name: string
  description?: string
  type: 'scene' | 'alert' | 'schedule'
  enabled: boolean
  priority: number
  expression?: string
  expressions: string[]
  executionCount: number
  lastTriggered?: string
  plugin?: RulePluginConfig
  data_subscriptions?: RuleDataSubscription[]
  notification?: RuleNotificationConfig
  pipeline_id?: string
  channel_ids?: string[]
}

export interface ActionChannelConfig {
  target_service: string
  target_asset: string
  operation: string
  point?: string
  value?: any
  parameters?: Record<string, any>
  delay?: number
}

export interface NotificationChannelConfig {
  channel_type: 'email' | 'webhook' | 'system'
  level: 'info' | 'warning' | 'error' | 'critical'
  recipients: string[]
  smtp_host?: string
  smtp_port?: number
  smtp_user?: string
  smtp_password?: string
  from_address?: string
  use_tls?: boolean
  webhook_url?: string
  webhook_method?: string
  webhook_headers?: Record<string, string>
  retention_days?: number
}

function extractRuleType(rule: RuleResponse): 'scene' | 'alert' | 'schedule' {
  const pluginConfig = rule.plugin?.config || {}
  const visualGraph = pluginConfig[VISUAL_GRAPH_KEY]

  if (visualGraph?.nodes) {
    const hasScheduleTrigger = visualGraph.nodes.some(
      (n: any) => n.type === 'schedule-trigger'
    )
    if (hasScheduleTrigger) return 'schedule'

    const hasNotification = visualGraph.nodes.some(
      (n: any) => n.type === 'notification'
    )
    if (hasNotification) return 'alert'
  }

  if (rule.plugin?.name === 'schedule_rule') {
    return 'schedule'
  }

  if (rule.plugin?.name === 'expression_rule') {
    return 'alert'
  }

  if (rule.data_subscriptions && rule.data_subscriptions.length > 0) {
    return 'scene'
  }

  return 'scene'
}

function extractExpression(rule: RuleResponse): { combined: string; list: string[] } {
  const pluginConfig = rule.plugin?.config || {}
  const visualGraph = pluginConfig[VISUAL_GRAPH_KEY]

  if (visualGraph?.nodes && visualGraph.edges) {
    return {
      combined: graphToExpression(visualGraph.nodes),
      list: graphToExpressions(visualGraph.nodes, visualGraph.edges),
    }
  }

  if (rule.plugin?.name === 'schedule_rule') {
    const triggerType = rule.plugin.config.trigger_type
    if (triggerType === 'cron') {
      const cron = rule.plugin.config.cron
      return { combined: `cron: ${cron}`, list: [`cron: ${cron}`] }
    }
    const interval = rule.plugin.config.interval || 60
    return { combined: `每 ${interval} 秒`, list: [`每 ${interval} 秒`] }
  }

  if (rule.plugin?.name === 'threshold_rule') {
    const { threshold, operator } = rule.plugin.config
    const expr = `value ${operator || '>'} ${threshold}`
    return { combined: expr, list: [expr] }
  }

  if (rule.plugin?.name === 'expression_rule') {
    const expr = rule.plugin.config.expression || ''
    return { combined: expr, list: expr ? [expr] : [] }
  }

  return { combined: '', list: [] }
}

export function backendToViewItem(rule: RuleResponse): RuleViewItem {
  const { combined, list } = extractExpression(rule)
  return {
    id: rule.id,
    name: rule.name,
    description: rule.description,
    type: extractRuleType(rule),
    enabled: rule.enabled,
    priority: 10,
    expression: combined,
    expressions: list,
    executionCount: rule.execution_count ?? 0,
    lastTriggered: rule.last_triggered
      ? new Date(rule.last_triggered * 1000).toLocaleString('zh-CN')
      : undefined,
    plugin: rule.plugin,
    data_subscriptions: rule.data_subscriptions,
    notification: rule.notification,
    pipeline_id: rule.pipeline_id,
    channel_ids: rule.channel_ids,
  }
}

/** 通知级别权重（用于多通知节点聚合时取最高级别） */
const NOTIFICATION_LEVEL_ORDER: Record<string, number> = {
  info: 0,
  warning: 1,
  error: 2,
  critical: 3,
}

/** 生成表达式中的字符串字面量（转义反斜杠与双引号） */
function quoteLiteral(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

/**
 * 构建单条链的数据触发守卫
 * 后端按 "资产 + 点位" 逐个求值表达式，守卫确保每条链只被自己的触发数据激活，
 * 避免多链场景下其他链的点位数据误触发本链
 */
function buildChainGuard(triggerNodes: RuleNode[]): string | null {
  const guards: string[] = []
  for (const node of triggerNodes) {
    const trigger = node.data?.trigger
    if (!trigger?.source || !trigger.field) continue
    guards.push(
      `asset == ${quoteLiteral(trigger.source)} and point == ${quoteLiteral(trigger.field)}`
    )
  }
  if (guards.length === 0) return null
  return guards.length === 1 ? guards[0] : `(${guards.join(' or ')})`
}

/**
 * 构建单条链的条件表达式
 * 条件字段与链内触发字段一致时使用 `value` 变量（后端求值上下文保证其存在），
 * 否则保留字段名（跨字段条件后端本身不支持，维持原行为）
 */
function buildChainConditions(chain: RuleNode[], triggerFields: Set<string>): string | null {
  const parts: string[] = []
  for (const node of chain) {
    if (node.type !== 'condition') continue
    const cond = node.data?.condition
    if (!cond?.field) continue

    const variable = triggerFields.has(cond.field) ? 'value' : cond.field
    if (cond.operator === 'regex') {
      parts.push(`${variable} =~ "${cond.value}"`)
    } else {
      parts.push(`${variable} ${cond.operator} ${cond.value}`)
    }
  }
  if (parts.length === 0) return null

  const logicOp = chain.find(n => n.type === 'logic')?.data?.logic?.operator || 'and'
  if (logicOp === 'not') {
    return `not (${parts.join(' and ')})`
  }
  if (parts.length === 1) {
    return parts[0]
  }
  return `(${parts.join(` ${logicOp} `)})`
}

/**
 * 构建链感知的组合表达式（后端单规则仅支持一个 expression）
 * 单条规则包含多条独立规则链时，每条链生成带触发守卫的子表达式并以 or 连接：
 * 任一条链的数据到达且条件满足即触发规则；无条件链为 "数据到达即触发"。
 * 依赖后端表达式引擎的短路求值，保证未激活链的变量不会被求值。
 * 返回 null 表示图中不存在带有效数据触发器的链。
 */
function buildCombinedExpression(chains: RuleNode[][]): string | null {
  const chainExprs: string[] = []

  for (const chain of chains) {
    const triggerNodes = chain.filter(n => n.type === 'trigger')
    // 无数据触发器的链不会产生数据订阅，条件无法被求值，跳过
    const guard = buildChainGuard(triggerNodes)
    if (!guard) continue

    const triggerFields = new Set(
      triggerNodes
        .map(n => n.data?.trigger?.field)
        .filter((f): f is string => Boolean(f))
    )
    const conditions = buildChainConditions(chain, triggerFields)
    chainExprs.push(conditions ? `${guard} and ${conditions}` : guard)
  }

  return chainExprs.length > 0 ? chainExprs.join(' or ') : null
}

function buildScheduleConfig(scheduleNodes: RuleNode[]): Record<string, any> {
  if (scheduleNodes.length === 0) return {}

  const nodeData = scheduleNodes[0].data
  const schedule = nodeData?.scheduleTrigger
  if (!schedule) return { trigger_type: 'interval', interval: 60 }

  const mode = schedule.mode || 'periodic'

  if (mode === 'cron' && schedule.cron) {
    return {
      trigger_type: 'cron',
      cron: schedule.cron,
    }
  }

  if (mode === 'once' && schedule.time) {
    const startDate = schedule.startDate
    if (startDate) {
      const dt = new Date(`${startDate}T${schedule.time}`)
      return {
        trigger_type: 'cron',
        cron: `${dt.getSeconds()} ${dt.getMinutes()} ${dt.getHours()} ${dt.getDate()} ${dt.getMonth() + 1} ?`,
      }
    }
    const [hours, minutes] = schedule.time.split(':').map(Number)
    return {
      trigger_type: 'cron',
      cron: `0 ${minutes} ${hours} * * ?`,
    }
  }

  const frequency = schedule.frequency || 'daily'
  const time = schedule.time || '08:00'
  const [hours, minutes] = time.split(':').map(Number)
  const days = schedule.days || []

  if (frequency === 'daily') {
    return {
      trigger_type: 'cron',
      cron: `0 ${minutes} ${hours} * * ?`,
    }
  }

  if (frequency === 'weekly' && days.length > 0) {
    const dow = days.join(',')
    return {
      trigger_type: 'cron',
      cron: `0 ${minutes} ${hours} ? * ${dow}`,
    }
  }

  return {
    trigger_type: 'interval',
    interval: 60,
  }
}

/** 提取所有动作节点的通道配置（多链场景下每条链的动作都保留） */
function buildActionChannelConfigs(actionNodes: RuleNode[]): ActionChannelConfig[] {
  const configs: ActionChannelConfig[] = []
  for (const node of actionNodes) {
    const action = node.data?.action
    if (!action) continue
    configs.push({
      target_service: action.targetService || action.target_asset || '',
      target_asset: action.target_asset || '',
      operation: action.operation || 'write_setpoint',
      point: action.parameters?.point || '',
      value: action.parameters?.value,
      parameters: action.parameters || {},
      delay: action.delay || 0,
    })
  }
  return configs
}

/** 提取所有通知节点的通道配置（多链场景下每条链的通知都保留） */
function buildNotificationChannelConfigs(notificationNodes: RuleNode[]): NotificationChannelConfig[] {
  const configs: NotificationChannelConfig[] = []
  for (const node of notificationNodes) {
    const notif = node.data?.notification
    if (!notif) continue
    configs.push({
      channel_type: notif.channel_type || 'system',
      level: notif.level || 'warning',
      recipients: [],
    })
  }
  return configs
}

function serializeGraph(nodes: RuleNode[], edges: RuleEdge[]) {
  const serializableNodes = nodes.map(n => ({
    id: n.id,
    type: n.type,
    position: n.position,
    data: n.data,
    label: n.label,
  }))

  const serializableEdges = edges.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: e.type,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
  }))

  return { nodes: serializableNodes, edges: serializableEdges }
}

export function graphToBackendCreate(
  name: string,
  description: string,
  nodes: RuleNode[],
  edges: RuleEdge[],
  existingId?: string
): RuleCreateRequest {
  const triggerNodes = nodes.filter(n => n.type === 'trigger')
  const scheduleTriggerNodes = nodes.filter(n => n.type === 'schedule-trigger')
  const conditionNodes = nodes.filter(n => n.type === 'condition')
  const logicNodes = nodes.filter(n => n.type === 'logic')
  const actionNodes = nodes.filter(n => n.type === 'action')
  const notificationNodes = nodes.filter(n => n.type === 'notification')

  const dataSubscriptions: RuleDataSubscription[] = triggerNodes
    .filter(n => n.data?.trigger?.source && n.data?.trigger?.field)
    .map(n => ({
      asset: n.data!.trigger!.source,
      point: n.data!.trigger!.field,
      mode: 'single' as const,
    }))

  const graphData = serializeGraph(nodes, edges)

  const isScheduleRule = scheduleTriggerNodes.length > 0 && triggerNodes.length === 0

  /** 按连通分量拆分规则链：单条规则内可能包含多条独立的 "触发→条件→动作" 链 */
  const chains = groupNodesIntoChains(nodes, edges)
  /** 整图为单条链且仅一个条件、无逻辑节点时，才能安全映射为 threshold_rule */
  const isSingleThresholdChain =
    chains.length === 1 && conditionNodes.length === 1 && logicNodes.length === 0

  let plugin: RulePluginConfig

  if (isScheduleRule) {
    const scheduleConfig = buildScheduleConfig(scheduleTriggerNodes)
    plugin = {
      name: 'schedule_rule',
      config: {
        ...scheduleConfig,
        [VISUAL_GRAPH_KEY]: graphData,
      },
    }
  } else if (isSingleThresholdChain) {
    const cond = conditionNodes[0].data?.condition
    if (!cond) {
      plugin = {
        name: 'threshold_rule',
        config: {
          threshold: 0,
          operator: '>',
          duration: 0,
          [VISUAL_GRAPH_KEY]: graphData,
        },
      }
    } else {
      plugin = {
        name: 'threshold_rule',
        config: {
          threshold: Number(cond.value) || cond.value,
          operator: cond.operator,
          duration: cond.duration || 0,
          [VISUAL_GRAPH_KEY]: graphData,
        },
      }
    }
  } else {
    // 多链 / 多条件 / 带逻辑节点：生成链感知的组合表达式
    // 每条链带触发守卫（asset + point），链间用 or 连接，任一链满足即触发
    const expression = buildCombinedExpression(chains)
    if (expression) {
      plugin = {
        name: 'expression_rule',
        config: {
          expression,
          duration: 0,
          [VISUAL_GRAPH_KEY]: graphData,
        },
      }
    } else {
      plugin = {
        name: scheduleTriggerNodes.length > 0 ? 'schedule_rule' : 'threshold_rule',
        config: {
          trigger_type: 'interval',
          interval: 60,
          expression: 'true',
          duration: 0,
          [VISUAL_GRAPH_KEY]: graphData,
        },
      }
    }
  }

  let notification: RuleNotificationConfig | undefined
  const actionConfigs = buildActionChannelConfigs(actionNodes)
  const notifConfigs = buildNotificationChannelConfigs(notificationNodes)

  if (notifConfigs.length > 0) {
    // 多个通知节点：级别取最高，通知渠道全部绑定（去重）
    const highestLevel = notifConfigs.reduce<NotificationChannelConfig['level']>(
      (max, c) =>
        (NOTIFICATION_LEVEL_ORDER[c.level] ?? 0) >= (NOTIFICATION_LEVEL_ORDER[max] ?? 0)
          ? c.level
          : max,
      'info'
    )
    notification = {
      title: i18n.global.t('ruleEditor.notification.titleTriggered', { ruleName: name }),
      message: i18n.global.t('ruleEditor.notification.messageTriggered', { ruleName: name }),
      level: highestLevel,
      recipients: [],
    }
  } else if (actionConfigs.length > 0) {
    // 聚合所有动作节点信息，避免多链场景下只反映第一个动作
    notification = {
      title: i18n.global.t('ruleEditor.notification.titleTriggered', { ruleName: name }),
      message: i18n.global.t('ruleEditor.notification.messageAction', {
        asset: actionConfigs.map(c => c.target_asset).filter(Boolean).join(', '),
        operation: actionConfigs.map(c => c.operation).filter(Boolean).join(', '),
      }),
      level: 'warning',
    }
  }

  const ruleId = existingId || `rule-${Date.now()}`
  const channelIds: string[] = []

  // 使用固定的通知渠道 ID：system → system-notification / email → email-notification / webhook → webhook-notification
  for (const notifConfig of notifConfigs) {
    const defaultChannelId = `${notifConfig.channel_type}-notification`
    if (!channelIds.includes(defaultChannelId)) {
      channelIds.push(defaultChannelId)
    }
  }

  return {
    id: ruleId,
    name,
    description: description || undefined,
    enabled: true,
    plugin,
    data_subscriptions: dataSubscriptions.length > 0 ? dataSubscriptions : undefined,
    notification,
    channel_ids: channelIds.length > 0 ? channelIds : undefined,
  }
}

export function graphToBackendUpdate(
  name: string,
  description: string,
  nodes: RuleNode[],
  edges: RuleEdge[],
  currentEnabled: boolean
): RuleUpdateRequest {
  const createReq = graphToBackendCreate(name, description, nodes, edges)
  return {
    name: createReq.name,
    description: createReq.description,
    enabled: currentEnabled,
    plugin: createReq.plugin,
    data_subscriptions: createReq.data_subscriptions,
    notification: createReq.notification,
    channel_ids: createReq.channel_ids,
  }
}

export function backendToGraph(
  rule: RuleResponse
): { nodes: RuleNode[]; edges: RuleEdge[]; name: string; description: string } | null {
  const pluginConfig = rule.plugin?.config || {}
  const visualGraph = pluginConfig[VISUAL_GRAPH_KEY]

  if (visualGraph?.nodes && visualGraph.edges) {
    const nodes: RuleNode[] = visualGraph.nodes.map((n: any) => ({
      id: n.id,
      type: n.type as NodeType,
      position: n.position || { x: 0, y: 0 },
      data: n.data || {},
      label: n.label,
    }))

    const edges: RuleEdge[] = visualGraph.edges.map((e: any) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: e.type || 'smoothstep',
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
      animated: true,
    }))

    return {
      nodes,
      edges,
      name: rule.name,
      description: rule.description || '',
    }
  }

  return reconstructGraphFromBackend(rule)
}

function reconstructGraphFromBackend(
  rule: RuleResponse
): { nodes: RuleNode[]; edges: RuleEdge[]; name: string; description: string } {
  const nodes: RuleNode[] = []
  const edges: RuleEdge[] = []
  let yOffset = 50

  if (rule.plugin?.name === 'schedule_rule') {
    const config = rule.plugin.config
    const triggerType = config.trigger_type || 'interval'

    nodes.push({
      id: 'schedule-trigger-0',
      type: 'schedule-trigger',
      position: { x: 250, y: yOffset },
      data: {
        scheduleTrigger: {
          mode: triggerType === 'cron' ? 'cron' : 'periodic',
          cron: config.cron || '',
          frequency: 'daily',
          time: '08:00',
          days: [],
          description: '',
        },
        label: '定时触发器',
      },
    })
    yOffset += 150
  } else if (rule.data_subscriptions && rule.data_subscriptions.length > 0) {
    for (const sub of rule.data_subscriptions) {
      const nodeId = `trigger-${nodes.length}`
      nodes.push({
        id: nodeId,
        type: 'trigger',
        position: { x: 250, y: yOffset },
        data: {
          trigger: {
            source: sub.asset,
            field: sub.point,
            description: '',
          },
          label: '数据触发器',
        },
      })
      yOffset += 150
    }
  }

  if (rule.plugin && rule.plugin.name !== 'schedule_rule') {
    const condNodeId = `condition-${nodes.length}`
    const pluginName = rule.plugin.name
    const config = rule.plugin.config

    if (pluginName === 'threshold_rule') {
      nodes.push({
        id: condNodeId,
        type: 'condition',
        position: { x: 250, y: yOffset },
        data: {
          condition: {
            field: 'value',
            operator: config.operator || '>',
            value: config.threshold ?? 0,
            duration: config.duration || 0,
            description: '',
          },
          label: '条件判断',
        },
      })
    } else if (pluginName === 'expression_rule') {
      nodes.push({
        id: condNodeId,
        type: 'condition',
        position: { x: 250, y: yOffset },
        data: {
          condition: {
            field: 'value',
            operator: '>',
            value: config.expression || 'true',
            duration: config.duration || 0,
            description: `表达式: ${config.expression || 'true'}`,
          },
          label: '条件判断',
        },
      })
    }

    if (nodes.length >= 2) {
      const prevNode = nodes[nodes.length - 2]
      edges.push({
        id: `e-${prevNode.id}-${condNodeId}`,
        source: prevNode.id,
        target: condNodeId,
        type: 'smoothstep',
        animated: true,
      })
    }

    yOffset += 150
  }

  if (rule.notification) {
    const channelIds = rule.channel_ids || []
    const hasActionChannel = channelIds.some(id => id.startsWith('action-'))
    const hasNotifChannel = channelIds.some(id => id.startsWith('email-') || id.startsWith('webhook-') || id.startsWith('system-'))

    if (hasNotifChannel && !hasActionChannel) {
      const notifNodeId = `notification-${nodes.length}`
      const notifChannelId = channelIds.find(id => id.startsWith('email-') || id.startsWith('webhook-') || id.startsWith('system-')) || ''
      const channelType = notifChannelId.startsWith('email-') ? 'email' : notifChannelId.startsWith('webhook-') ? 'webhook' : 'system'
      nodes.push({
        id: notifNodeId,
        type: 'notification',
        position: { x: 250, y: yOffset },
        data: {
          notification: {
            channel_type: channelType as 'email' | 'webhook' | 'system',
            level: rule.notification.level || 'warning',
            recipients: (rule.notification.recipients || []).join(', '),
            description: rule.notification.message || '',
          },
          label: '通知告警',
        },
      })

      if (nodes.length >= 2) {
        const prevNode = nodes[nodes.length - 2]
        edges.push({
          id: `e-${prevNode.id}-${notifNodeId}`,
          source: prevNode.id,
          target: notifNodeId,
          type: 'smoothstep',
          animated: true,
        })
      }
    } else {
      const actionNodeId = `action-${nodes.length}`
      nodes.push({
        id: actionNodeId,
        type: 'action',
        position: { x: 250, y: yOffset },
        data: {
          action: {
            target_asset: '',
            operation: '',
            parameters: {},
            delay: 0,
            description: rule.notification.message || '',
          },
          label: '执行动作',
        },
      })

      if (nodes.length >= 2) {
        const prevNode = nodes[nodes.length - 2]
        edges.push({
          id: `e-${prevNode.id}-${actionNodeId}`,
          source: prevNode.id,
          target: actionNodeId,
          type: 'smoothstep',
          animated: true,
        })
      }
    }
  }

  return {
    nodes,
    edges,
    name: rule.name,
    description: rule.description || '',
  }
}
