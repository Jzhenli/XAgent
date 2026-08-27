<template>
  <div class="rule-node logic-node">
    <Handle type="target" :position="Position.Top" />
    <Handle type="target" :position="Position.Left" id="left" />
    <div class="node-glow" aria-hidden="true"></div>

    <div class="node-header">
      <div class="node-icon-wrap">
        <span class="node-icon">🔀</span>
      </div>
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

const nodeData = computed(() => node.data?.logic)

const operatorLabel = computed(() => {
  const op = nodeData.value?.operator
  const labels: Record<string, string> = { 'and': 'AND', 'or': 'OR', 'not': 'NOT' }
  return labels[op || 'and'] || 'AND'
})

const operatorColor = computed(() => {
  const op = nodeData.value?.operator
  const colors: Record<string, string> = { 'and': '#64b5f6', 'or': '#ffb74d', 'not': '#ef5350' }
  return colors[op || 'and'] || '#64b5f6'
})
</script>

<style scoped>
.rule-node {
  position: relative; min-width: 100px;
  background: var(--node-logic-bg);
  border: none;
  border-radius: 14px; padding: 0;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.2), 0 0 0 1px rgba(255,255,255,0.06);
  backdrop-filter: blur(10px) saturate(1.4); -webkit-backdrop-filter: blur(10px) saturate(1.4);
  color: #fff; font-family: 'Inter', 'Segoe UI', sans-serif;
  transition: transform 0.25s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.25s; overflow: visible;
}
.rule-node:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.25), 0 0 10px var(--node-logic-glow), inset 0 1px 0 rgba(255,255,255,0.25);
}
.rule-node.selected,
:deep(.vue-flow__node.selected) .rule-node {
  box-shadow: 0 0 0 2px var(--node-logic-glow), 0 6px 20px rgba(0, 0, 0, 0.3);
}
.node-glow {
  position: absolute; inset: -3px; border-radius: 16px;
  background: radial-gradient(ellipse at center, var(--node-logic-glow) 0%, transparent 70%);
  z-index: -1; opacity: 0.6; pointer-events: none; filter: blur(12px);
  animation: pulse-glow 3s ease-in-out infinite;
}
@keyframes pulse-glow { 0%,100% {opacity:.4} 50% {opacity:.8} }
.node-header {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px 6px; border-bottom: 1px solid rgba(255,255,255,0.18);
}
.node-icon-wrap {
  width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.22); border-radius: 7px; backdrop-filter: blur(6px);
}
.node-icon { font-size: 14px; }
.node-title { font-size: 12px; font-weight: 600; letter-spacing: 0.3px; }
.node-body { padding: 8px 12px 10px; display: flex; justify-content: center; }
.logic-operator {
  font-size: 16px; font-weight: 800; text-align: center;
  padding: 4px 14px;
  background: rgba(0,0,0,0.25); border-radius: 10px;
  text-shadow: 0 0 8px currentColor;
  letter-spacing: 1px;
}
.rule-node :deep(.vue-flow__handle) {
  width: 12px; height: 12px; background: var(--re-handle-bg);
  border: 2px solid var(--node-logic-border); box-shadow: 0 0 8px var(--node-logic-glow);
  transition: box-shadow 0.2s, background 0.2s;
}
.rule-node :deep(.vue-flow__handle:hover) {
  box-shadow: 0 0 14px var(--node-logic-glow), 0 0 4px var(--node-logic-glow);
  background: var(--node-logic-border);
}
</style>
