<template>
  <div class="rule-node action-node">
    <Handle type="target" :position="Position.Top" />
    <div class="node-glow" aria-hidden="true"></div>

    <div class="node-header">
      <div class="node-icon-wrap">
        <span class="node-icon">⚡</span>
      </div>
      <span class="node-title">{{ t('nodeViews.action') }}</span>
    </div>

    <div class="node-body">
      <div class="node-info" :class="{ 'has-data': hasValidData }">
        <div class="info-row">
          <span class="info-label">{{ t('nodeViews.target') }}</span>
          <span class="info-value">{{ nodeData?.target_asset || '—' }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">{{ t('nodeViews.operation') }}</span>
          <span class="info-value">{{ nodeData?.operation || '—' }}</span>
        </div>
        <div class="delay-badge" v-if="nodeData?.delay">
          {{ delayText }}
        </div>
      </div>
    </div>

    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position, useNode } from '@vue-flow/core'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { RuleNodeData } from '@/types/rule'

const { t } = useI18n()
const { node } = useNode<RuleNodeData>()

const nodeData = computed(() => node.data?.action)

const hasValidData = computed(() =>
  nodeData.value?.target_asset && nodeData.value?.operation
)

const delayText = computed(() => {
  const delay = nodeData.value?.delay || 0
  if (delay === 0) return t('nodeViews.instant')
  if (delay < 60) return `${t('nodeViews.delay')} ${delay}${t('nodeViews.seconds')}`
  if (delay < 3600) return `${t('nodeViews.delay')} ${Math.floor(delay / 60)}${t('nodeViews.minutes')}`
  return `${t('nodeViews.delay')} ${Math.floor(delay / 3600)}${t('nodeViews.hours')}`
})
</script>

<style scoped>
.rule-node {
  position: relative; min-width: 180px;
  background: var(--node-action-bg);
  border: 1.5px solid var(--node-action-border);
  border-radius: 14px; padding: 0;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.2), 0 0 0 1px rgba(255,255,255,0.06);
  backdrop-filter: blur(10px) saturate(1.4); -webkit-backdrop-filter: blur(10px) saturate(1.4);
  color: #fff; font-family: 'Inter', 'Segoe UI', sans-serif;
  transition: transform 0.25s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.25s; overflow: visible;
}
.rule-node:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.25), 0 0 20px var(--node-action-glow), inset 0 1px 0 rgba(255,255,255,0.25);
}
.node-glow {
  position: absolute; inset: -3px; border-radius: 16px;
  background: radial-gradient(ellipse at center, var(--node-action-glow) 0%, transparent 70%);
  z-index: -1; opacity: 0.6; pointer-events: none; filter: blur(12px);
  animation: pulse-glow 3s ease-in-out infinite;
}
@keyframes pulse-glow { 0%,100% {opacity:.4} 50% {opacity:.8} }
.node-header {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 14px 8px; border-bottom: 1px solid rgba(255,255,255,0.18);
}
.node-icon-wrap {
  width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.22); border-radius: 8px; backdrop-filter: blur(6px);
}
.node-icon { font-size: 16px; }
.node-title { font-size: 13px; font-weight: 600; letter-spacing: 0.3px; text-shadow: 0 1px 2px rgba(0,0,0,0.2); }
.node-body { padding: 10px 14px 12px; }
.node-info { font-size: 11px; opacity: 0.7; }
.node-info.has-data { opacity: 1; }
.info-row { display: flex; align-items: baseline; gap: 6px; margin-bottom: 4px; line-height: 1.5; }
.info-row:last-child { margin-bottom: 0; }
.info-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.7; flex-shrink: 0; }
.info-value { font-family: 'JetBrains Mono', 'Consolas', monospace; font-size: 11px; font-weight: 500; color: #fff; word-break: break-all; }
.delay-badge {
  margin-top: 6px; padding: 2px 8px;
  background: rgba(0,0,0,0.25); border-radius: 10px; font-size: 10px; color: #fff; display: inline-block;
}
.rule-node :deep(.vue-flow__handle) {
  width: 12px; height: 12px; background: var(--re-handle-bg);
  border: 2px solid var(--node-action-border); box-shadow: 0 0 8px var(--node-action-glow);
  transition: box-shadow 0.2s, background 0.2s;
}
.rule-node :deep(.vue-flow__handle:hover) {
  box-shadow: 0 0 14px var(--node-action-glow), 0 0 4px var(--node-action-glow);
  background: var(--node-action-border);
}
</style>
