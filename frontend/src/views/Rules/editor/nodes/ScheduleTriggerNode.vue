<template>
  <div class="rule-node schedule-node">
    <Handle type="target" :position="Position.Top" />
    <div class="node-glow" aria-hidden="true"></div>

    <div class="node-header">
      <div class="node-icon-wrap">
        <span class="node-icon">⏰</span>
      </div>
      <span class="node-title">{{ node.data?.label || t('nodeViews.scheduleTrigger') }}</span>
    </div>

    <div class="node-body">
      <div class="node-info has-data">
        <div class="info-row">
          <span class="info-label">{{ t('nodeViews.mode') }}</span>
          <span class="info-value">
            {{ scheduleData?.mode === 'cron' ? 'Cron' : (scheduleData?.mode === 'once' ? t('nodeViews.once') : t('nodeViews.periodic')) }}
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">{{ t('nodeViews.time') }}</span>
          <span class="info-value">{{ getScheduleDisplay }}</span>
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

const scheduleData = computed(() => node.data?.scheduleTrigger)

const getScheduleDisplay = computed(() => {
  if (!scheduleData.value) return t('nodeViews.notConfigured')
  if (scheduleData.value.mode === 'cron') {
    return scheduleData.value.cron || t('nodeViews.cronExpression')
  }
  if (scheduleData.value.mode === 'once') {
    return `${t('nodeViews.once')}: ${scheduleData.value.time}`
  }
  const freqMap: Record<string, string> = {
    daily: t('nodeViews.daily'),
    weekly: t('nodeViews.weekly'),
    monthly: t('nodeViews.monthly')
  }
  const freq = freqMap[scheduleData.value.frequency || 'daily']
  return `${freq} ${scheduleData.value.time}`
})
</script>

<style scoped>
.rule-node {
  position: relative;
  min-width: 180px;
  background: var(--node-schedule-bg);
  border: 1.5px solid var(--node-schedule-border);
  border-radius: 14px;
  padding: 0;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px) saturate(1.4);
  -webkit-backdrop-filter: blur(10px) saturate(1.4);
  color: #fff;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s;
  overflow: visible;
}
.rule-node:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.25), 0 0 20px var(--node-schedule-glow), inset 0 1px 0 rgba(255, 255, 255, 0.25);
}
.node-glow {
  position: absolute; inset: -3px; border-radius: 16px;
  background: radial-gradient(ellipse at center, var(--node-schedule-glow) 0%, transparent 70%);
  z-index: -1; opacity: 0.6; pointer-events: none; filter: blur(12px);
  animation: pulse-glow 3s ease-in-out infinite;
}
@keyframes pulse-glow { 0%,100% {opacity:.4} 50% {opacity:.8} }
.node-header {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 14px 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.18);
}
.node-icon-wrap {
  width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
  background: rgba(255, 255, 255, 0.22); border-radius: 8px; backdrop-filter: blur(6px);
}
.node-icon { font-size: 16px; }
.node-title { font-size: 13px; font-weight: 600; letter-spacing: 0.3px; text-shadow: 0 1px 2px rgba(0,0,0,0.2); }
.node-body { padding: 10px 14px 12px; }
.node-info { font-size: 11px; }
.info-row { display: flex; align-items: baseline; gap: 6px; margin-bottom: 4px; line-height: 1.5; }
.info-row:last-child { margin-bottom: 0; }
.info-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.7; flex-shrink: 0; }
.info-value { font-family: 'JetBrains Mono', 'Consolas', monospace; font-size: 11px; font-weight: 500; color: #fff; word-break: break-all; }
.rule-node :deep(.vue-flow__handle) {
  width: 12px; height: 12px; background: var(--re-handle-bg);
  border: 2px solid var(--node-schedule-border); box-shadow: 0 0 8px var(--node-schedule-glow);
  transition: box-shadow 0.2s, background 0.2s;
}
.rule-node :deep(.vue-flow__handle:hover) {
  box-shadow: 0 0 14px var(--node-schedule-glow), 0 0 4px var(--node-schedule-glow);
  background: var(--node-schedule-border);
}
</style>
