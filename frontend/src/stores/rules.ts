import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ruleApi } from '@/api/rules'
import type { RuleCreateRequest, RuleUpdateRequest, RuleResponse } from '@/api/types'
import { backendToViewItem, type RuleViewItem } from '@/utils/ruleBridge'

export type { RuleViewItem }

export interface RuleExecution {
  id: string
  ruleId: string
  ruleName: string
  triggeredAt: string
  status: 'success' | 'failed'
  duration: number
  errorMessage?: string
}

export const useRuleStore = defineStore('rules', () => {
  const rules = ref<RuleViewItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const executions = ref<RuleExecution[]>([])

  const activeRules = computed(() =>
    rules.value.filter(r => r.enabled).length
  )

  const totalRules = computed(() => rules.value.length)

  const todayExecutions = computed(() =>
    executions.value.filter(e => !e.triggeredAt.includes('昨天')).length
  )

  const fetchRules = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await ruleApi.list()
      rules.value = response.rules.map(r => backendToViewItem(r))
    } catch (e: any) {
      error.value = e.response?.data?.detail || e.message || '获取规则列表失败'
      console.error('[RuleStore] fetchRules error:', e)
    } finally {
      loading.value = false
    }
  }

  const getRule = async (ruleId: string): Promise<RuleResponse | null> => {
    try {
      return await ruleApi.get(ruleId)
    } catch (e: any) {
      console.error('[RuleStore] getRule error:', e)
      return null
    }
  }

  const createRule = async (data: RuleCreateRequest) => {
    try {
      const response = await ruleApi.create(data)
      if (response.success) {
        await fetchRules()
      }
      return response
    } catch (e: any) {
      error.value = e.response?.data?.detail || e.message || '创建规则失败'
      throw e
    }
  }

  const updateRule = async (ruleId: string, data: RuleUpdateRequest) => {
    try {
      const response = await ruleApi.update(ruleId, data)
      if (response.success) {
        await fetchRules()
      }
      return response
    } catch (e: any) {
      error.value = e.response?.data?.detail || e.message || '更新规则失败'
      throw e
    }
  }

  const deleteRule = async (id: string) => {
    try {
      const response = await ruleApi.remove(id)
      if (response.success) {
        rules.value = rules.value.filter(r => r.id !== id)
      }
      return response
    } catch (e: any) {
      error.value = e.response?.data?.detail || e.message || '删除规则失败'
      throw e
    }
  }

  const toggleRule = async (id: string) => {
    const rule = rules.value.find(r => r.id === id)
    if (!rule) return

    try {
      const response = await ruleApi.update(id, { enabled: !rule.enabled })
      if (response.success) {
        rule.enabled = !rule.enabled
      }
      return response
    } catch (e: any) {
      error.value = e.response?.data?.detail || e.message || '切换规则状态失败'
      throw e
    }
  }

  const copyRule = async (id: string) => {
    const rule = rules.value.find(r => r.id === id)
    if (!rule) return

    try {
      const newId = `rule-${Date.now()}`
      const createData: RuleCreateRequest = {
        id: newId,
        name: `${rule.name} (副本)`,
        description: rule.description,
        enabled: false,
        plugin: rule.plugin || { name: 'threshold_rule', config: {} },
        data_subscriptions: rule.data_subscriptions,
        notification: rule.notification,
        pipeline_id: rule.pipeline_id,
        channel_ids: rule.channel_ids,
      }

      if (createData.plugin?.config) {
        createData.plugin = {
          ...createData.plugin,
          config: { ...createData.plugin.config },
        }
      }

      const response = await ruleApi.create(createData)
      if (response.success) {
        await fetchRules()
      }
      return response
    } catch (e: any) {
      error.value = e.response?.data?.detail || e.message || '复制规则失败'
      throw e
    }
  }

  return {
    rules,
    loading,
    error,
    executions,
    activeRules,
    totalRules,
    todayExecutions,
    fetchRules,
    getRule,
    createRule,
    updateRule,
    deleteRule,
    toggleRule,
    copyRule,
  }
}, {
  persist: {
    key: 'xagent-rules-v1',
    storage: sessionStorage,
    paths: ['rules']
  }
})
