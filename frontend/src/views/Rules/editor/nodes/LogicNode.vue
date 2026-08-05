<template>
  <div class="rule-node logic-node">
    <Handle type="target" :position="Position.Top" />
    <Handle type="target" :position="Position.Left" id="left" />

    <div class="node-header">
      <span class="node-icon">🔀</span>
      <span class="node-title">{{ t('nodeViews.logic') }}</span>
    </div>

    <div class="node-body">
      <div class="logic-operator" :style="{ color: operatorColor }">
        {{ operatorLabel }}
      </div>
    </div>

    <Handle type="source" :position="Position.Bottom" />
    <Handle type="target" :position="Position.Right" id="right" />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position, useNode } from '@vue-flow/core'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { RuleNodeData } from '@/types/rule'

const { t } = useI18n()
const { node } = useNode<RuleNodeData>()

/** 逻辑节点数据 */
const nodeData = computed(() => node.data?.logic)

/** 操作符标签 */
const operatorLabel = computed(() => {
  const op = nodeData.value?.operator
  const labels: Record<string, string> = {
    'and': 'AND',
    'or': 'OR',
    'not': 'NOT'
  }
  return labels[op || 'and'] || 'AND'
})

/** 操作符对应颜色 */
const operatorColor = computed(() => {
  const op = nodeData.value?.operator
  const colors: Record<string, string> = {
    'and': '#3498db',
    'or': '#e67e22',
    'not': '#e74c3c'
  }
  return colors[op || 'and'] || '#3498db'
})
</script>

<style scoped>
.logic-node {
  background: var(--node-logic-bg);
  border: 2px solid var(--node-logic-border);
  min-width: 90px;
}

.logic-operator {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
</style>
