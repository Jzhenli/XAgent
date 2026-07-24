import type { RuleNode, RuleEdge, Rule, RuleNodeData, NodeType } from '@/types/rule'

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function uuidv4(): string {
  return generateUUID()
}

export function generateNodeId(type: NodeType): string {
  return `${type}-${generateUUID().slice(0, 8)}`
}

export function createNode(
  type: NodeType, 
  position: { x: number; y: number },
  data?: Partial<RuleNodeData>
): RuleNode {
  const defaultData: Record<NodeType, RuleNodeData> = {
    trigger: { trigger: { source: '', field: '' }, label: '数据触发器' },
    'schedule-trigger': { 
      scheduleTrigger: { 
        mode: 'periodic', 
        time: '08:00', 
        frequency: 'daily', 
        days: [] 
      }, 
      label: '定时触发器' 
    },
    condition: { condition: { field: '', operator: '>', value: '', duration: 0 }, label: '条件判断' },
    logic: { logic: { operator: 'and' }, label: '逻辑运算' },
    action: { action: { target_asset: '', operation: '', parameters: {}, delay: 0 }, label: '执行动作' },
    notification: { 
      notification: { 
        channel_type: 'system', 
        level: 'warning', 
        recipients: '', 
        retention_days: 30 
      }, 
      label: '通知告警' 
    }
  }

  return {
    id: generateNodeId(type),
    type,
    position,
    data: { ...defaultData[type], ...data }
  }
}

export function graphToExpression(nodes: RuleNode[]): string {
  if (nodes.length === 0) return ''
  
  const triggerNodes = nodes.filter(n => n.type === 'trigger' || n.type === 'schedule-trigger')
  const conditionNodes = nodes.filter(n => n.type === 'condition')
  const logicNodes = nodes.filter(n => n.type === 'logic')
  const actionNodes = nodes.filter(n => n.type === 'action')
  
  const parts: string[] = []
  
  // 处理触发器
  triggerNodes.forEach(node => {
    if (node.type === 'schedule-trigger' && node.data?.scheduleTrigger) {
      const schedule = node.data?.scheduleTrigger
      if (schedule.mode === 'cron') {
        parts.push(`schedule: cron "${schedule.cron}"`)
      } else if (schedule.mode === 'once') {
        parts.push(`schedule: once at ${schedule.time} on ${schedule.startDate}`)
      } else {
        const freqMap: Record<string, string> = {
          daily: 'daily',
          weekly: 'weekly',
          monthly: 'monthly'
        }
        const freq = freqMap[schedule.frequency || 'daily']
        parts.push(`schedule: ${freq} at ${schedule.time}`)
      }
    } else if (node.type === 'trigger' && node.data?.trigger) {
      const trigger = node.data?.trigger
      if (trigger.source && trigger.field) {
        parts.push(`trigger: ${trigger.source}.${trigger.field}`)
      }
    }
  })
  
  // 处理条件
  const conditionExprs: string[] = []
  conditionNodes.forEach(node => {
    const cond = node.data?.condition
    if (cond && cond.field && cond.value) {
      let expr = ''
      if (cond.operator === 'regex') {
        expr = `${cond.field} =~ "${cond.value}"`
      } else {
        expr = `${cond.field} ${cond.operator} ${cond.value}`
      }
      conditionExprs.push(expr)
    }
  })
  
  if (conditionExprs.length > 0) {
    if (logicNodes.length > 0 && conditionExprs.length > 1) {
      const logicNode = logicNodes[0]
      const op = logicNode.data?.logic?.operator || 'and'
      
      if (op === 'not') {
        parts.push(`not (${conditionExprs.join(' and ')})`)
      } else {
        parts.push(conditionExprs.join(` ${op} `))
      }
    } else {
      parts.push(conditionExprs.join(' and '))
    }
  }
  
  // 处理动作
  actionNodes.forEach(node => {
    const action = node.data?.action
    if (action && action.target_asset && action.operation) {
      parts.push(`action: ${action.target_asset}.${action.operation}`)
    }
  })
  
  return parts.join(' -> ')
}

export interface GraphValidationError {
  key: string
  params?: Record<string, string | number>
}

export interface ValidateGraphOptions {
  ruleName?: string
}

export function validateGraph(
  nodes: RuleNode[],
  edges: RuleEdge[],
  options?: ValidateGraphOptions
): {
  valid: boolean
  errors: GraphValidationError[]
} {
  const errors: GraphValidationError[] = []

  if (options?.ruleName !== undefined && options.ruleName.trim() === '') {
    errors.push({ key: 'ruleEditor.errors.emptyName' })
  }

  if (nodes.length === 0) {
    errors.push({ key: 'ruleEditor.errors.emptyCanvas' })
    return { valid: false, errors }
  }

  const triggerNodes = nodes.filter(n => n.type === 'trigger' || n.type === 'schedule-trigger')
  const conditionNodes = nodes.filter(n => n.type === 'condition')
  const actionNodes = nodes.filter(n => n.type === 'action')
  const notificationNodes = nodes.filter(n => n.type === 'notification')

  if (triggerNodes.length === 0) {
    errors.push({ key: 'ruleEditor.errors.missingTrigger' })
  }

  if (actionNodes.length === 0 && notificationNodes.length === 0) {
    errors.push({ key: 'ruleEditor.errors.missingAction' })
  }

  const getNodeLabel = (node: RuleNode) => node.data?.label || node.id

  // 验证定时触发器
  triggerNodes.forEach(node => {
    const label = getNodeLabel(node)
    if (node.type === 'schedule-trigger') {
      const schedule = node.data?.scheduleTrigger
      if (!schedule?.time && schedule?.mode !== 'cron') {
        errors.push({ key: 'ruleEditor.errors.scheduleMissingTime', params: { label } })
      }
      if (schedule?.mode === 'cron' && !schedule.cron) {
        errors.push({ key: 'ruleEditor.errors.scheduleMissingCron', params: { label } })
      }
    } else if (node.type === 'trigger') {
      const trigger = node.data?.trigger
      if (!trigger?.source) {
        errors.push({ key: 'ruleEditor.errors.triggerMissingSource', params: { label } })
      }
      if (!trigger?.field) {
        errors.push({ key: 'ruleEditor.errors.triggerMissingField', params: { label } })
      }
    }
  })

  conditionNodes.forEach(node => {
    const label = getNodeLabel(node)
    const cond = node.data?.condition
    if (!cond?.field) {
      errors.push({ key: 'ruleEditor.errors.conditionMissingField', params: { label } })
    }
    if (!cond?.value && cond?.value !== 0) {
      errors.push({ key: 'ruleEditor.errors.conditionMissingValue', params: { label } })
    }
  })

  actionNodes.forEach(node => {
    const label = getNodeLabel(node)
    const action = node.data?.action
    if (!action?.target_asset) {
      errors.push({ key: 'ruleEditor.errors.actionMissingTarget', params: { label } })
    }
    if (!action?.operation) {
      errors.push({ key: 'ruleEditor.errors.actionMissingOperation', params: { label } })
    }
  })

  notificationNodes.forEach(node => {
    const label = getNodeLabel(node)
    const notif = node.data?.notification
    if (!notif?.channel_type) {
      errors.push({ key: 'ruleEditor.errors.notificationMissingChannel', params: { label } })
    }
  })

  if (edges.length === 0 && nodes.length > 1) {
    errors.push({ key: 'ruleEditor.errors.missingConnection' })
  }

  return { valid: errors.length === 0, errors }
}

export function exportRule(nodes: RuleNode[], edges: RuleEdge[]): Rule {
  const expression = graphToExpression(nodes)
  
  // 判断规则类型
  const hasScheduleTrigger = nodes.some(n => n.type === 'schedule-trigger')
  const ruleType = hasScheduleTrigger ? 'schedule' : 'scene'
  
  return {
    id: uuidv4(),
    name: '新规则',
    description: '通过可视化编辑器创建的规则',
    type: ruleType,
    enabled: true,
    priority: 10,
    graph: { nodes, edges },
    expression,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    executionCount: 0
  }
}

export function importRule(rule: Rule): { nodes: RuleNode[], edges: RuleEdge[] } {
  return {
    nodes: rule.graph.nodes,
    edges: rule.graph.edges
  }
}

export function createDefaultRule(): { nodes: RuleNode[], edges: RuleEdge[] } {
  const triggerNode = createNode('trigger', { x: 250, y: 50 })
  const conditionNode = createNode('condition', { x: 250, y: 180 })
  const actionNode = createNode('action', { x: 250, y: 340 })
  
  triggerNode.data!.trigger = {
    source: 'temperature_sensor',
    field: 'temperature',
    description: '温度传感器'
  }
  
  conditionNode.data!.condition = {
    field: 'temperature',
    operator: '>',
    value: '30',
    duration: 300,
    description: '温度超过30度持续5分钟'
  }
  
  actionNode.data!.action = {
    target_asset: 'air_conditioner',
    operation: 'write_setpoint',
    parameters: { point: 'power', value: 1 },
    delay: 0,
    description: '开启空调'
  }
  
  const edges: RuleEdge[] = [
    {
      id: 'e-trigger-condition',
      source: triggerNode.id,
      target: conditionNode.id,
      type: 'smoothstep',
      animated: true
    },
    {
      id: 'e-condition-action',
      source: conditionNode.id,
      target: actionNode.id,
      type: 'smoothstep',
      animated: true
    }
  ]
  
  return { nodes: [triggerNode, conditionNode, actionNode], edges }
}

export function createScheduleRule(): { nodes: RuleNode[], edges: RuleEdge[] } {
  const scheduleNode = createNode('schedule-trigger', { x: 250, y: 50 })
  const actionNode = createNode('action', { x: 250, y: 180 })
  
  scheduleNode.data!.scheduleTrigger = {
    mode: 'periodic',
    time: '18:00',
    frequency: 'daily',
    days: [],
    description: '每天18:00执行'
  }
  
  actionNode.data!.action = {
    target_asset: 'lighting_system',
    operation: 'turn_on',
    parameters: { zone: 'office' },
    delay: 0,
    description: '开启照明'
  }
  
  const edges: RuleEdge[] = [
    {
      id: 'e-schedule-action',
      source: scheduleNode.id,
      target: actionNode.id,
      type: 'smoothstep',
      animated: true
    }
  ]
  
  return { nodes: [scheduleNode, actionNode], edges }
}
