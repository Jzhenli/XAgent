<template>
  <el-row :gutter="isMobile ? 12 : 20" class="stat-cards">
    <el-col :span="statCardSpan">
      <el-card class="stat-card alert-card-highlight" shadow="hover">
        <div class="stat-icon alerts">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none">
            <path class="icon-path" d="M18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="currentColor"/>
            <path class="icon-wave wave-1" d="M3 12c0-1 .2-2.1.5-3.1L1.5 8.5C1 9.7.8 11 .8 12c0 1 .2 2.3.7 3.5l2-2.4c-.3-1-.5-2.1-.5-3.1z" fill="currentColor"/>
            <path class="icon-wave wave-2" d="M21 12c0 1-.2 2.1-.5 3.1l2 2.4c.5-1.2.7-2.5.7-3.5s-.2-2.3-.7-3.5l-2 2.4c.3 1 .5 2.1.5 3.1z" fill="currentColor"/>
          </svg>
          <span class="icon-dot dot-1"></span>
          <span class="icon-dot dot-2"></span>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ alertStore.pendingAlerts }}</div>
          <div class="stat-label">{{ t('dashboard.pendingAlerts') }}</div>
        </div>
      </el-card>
    </el-col>

    <el-col :span="statCardSpan">
      <el-card class="stat-card device-card" shadow="hover">
        <div class="stat-icon devices">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none">
            <rect x="2.5" y="3.5" width="19" height="13" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <rect x="4.5" y="5.5" width="15" height="9" rx="1" fill="currentColor" opacity="0.9"/>
            <path d="M8 20h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M12 16.5V20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <circle class="icon-pulse" cx="12" cy="10" r="2" fill="none" stroke="currentColor" stroke-width="1.2"/>
            <circle class="icon-pulse-dot" cx="12" cy="10" r="0.8" fill="currentColor"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ deviceStore.onlineDevices }}/{{ deviceStore.totalDevices }}</div>
          <div class="stat-label">{{ t('dashboard.onlineDevices') }}</div>
        </div>
      </el-card>
    </el-col>

    <el-col :span="statCardSpan">
      <el-card class="stat-card channel-card" shadow="hover">
        <div class="stat-icon channels">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none">
            <path class="icon-ring ring-1" d="M12 3c4.97 0 9 4.03 9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
            <path class="icon-ring ring-2" d="M12 6c3.31 0 6 2.69 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
            <circle cx="12" cy="12" r="3.5" fill="currentColor"/>
            <path class="icon-wave wave-1" d="M5 12H3m16 0h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path class="icon-wave wave-2" d="M6.5 9.5L5 8m12.5 1.5L19 8m-12.5 5.5L5 16m12.5-2.5L19 16" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ channelStore.onlineChannels }}/{{ channelStore.totalChannels }}</div>
          <div class="stat-label">{{ t('dashboard.onlineChannels') }}</div>
        </div>
      </el-card>
    </el-col>

    <el-col :span="statCardSpan">
      <el-card class="stat-card rule-card" shadow="hover">
        <div class="stat-icon rules">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none">
            <path class="icon-bolt bolt-1" d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="currentColor"/>
            <path class="icon-bolt bolt-2" d="M18.5 2L10.5 12H16l-1.5 8 8-10H17l1.5-8z" fill="currentColor" opacity="0.5"/>
            <path class="icon-ring ring-1" d="M4 7c1.5-2 3.5-3.5 6-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.6"/>
            <path class="icon-ring ring-2" d="M20 17c-1.5 2-3.5 3.5-6 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.6"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ ruleStore.activeRules }}/{{ ruleStore.totalRules }}</div>
          <div class="stat-label">{{ t('dashboard.activeRules') }}</div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDeviceStore } from '@/stores/devices'
import { useRuleStore } from '@/stores/rules'
import { useAlertStore } from '@/stores/alerts'
import { useChannelStore } from '@/stores/channels'

defineProps<{
  statCardSpan: number
  isMobile?: boolean
}>()

const { t } = useI18n()
const deviceStore = useDeviceStore()
const ruleStore = useRuleStore()
const alertStore = useAlertStore()
const channelStore = useChannelStore()
</script>

<style scoped>
.stat-cards {
  margin-bottom: 0;
}

.stat-cards :deep(.el-card) {
  background: var(--bg-card) !important;
  border: 1px solid var(--border-base) !important;
  border-radius: 16px !important;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-cards :deep(.el-card:hover) {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(52, 152, 219, 0.15) !important;
  transform: translateY(-2px);
}

.stat-card {
  padding: 0;
  margin-bottom: 16px;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  padding: 20px;
}

.stat-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 16px 0 0 16px;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-cards :deep(.el-card.device-card)::before {
  background: linear-gradient(180deg, #3498db 0%, #2980b9 100%);
}

.stat-cards :deep(.el-card.device-card:hover) {
  box-shadow: 0 8px 30px rgba(52, 152, 219, 0.2), 0 0 20px rgba(52, 152, 219, 0.1) !important;
}

.stat-cards :deep(.el-card.channel-card)::before {
  background: linear-gradient(180deg, #8b5cf6 0%, #6d28d9 100%);
}

.stat-cards :deep(.el-card.channel-card:hover) {
  box-shadow: 0 8px 30px rgba(139, 92, 246, 0.2), 0 0 20px rgba(139, 92, 246, 0.1) !important;
}

.stat-cards :deep(.el-card.rule-card)::before {
  background: linear-gradient(180deg, #27ae60 0%, #229954 100%);
}

.stat-cards :deep(.el-card.rule-card:hover) {
  box-shadow: 0 8px 30px rgba(39, 174, 96, 0.2), 0 0 20px rgba(39, 174, 96, 0.1) !important;
}

.stat-cards :deep(.el-card.alert-card-highlight)::before {
  background: linear-gradient(180deg, #e74c3c 0%, #c0392b 100%);
}

.stat-cards :deep(.el-card.alert-card-highlight:hover) {
  box-shadow: 0 8px 30px rgba(231, 76, 60, 0.25), 0 0 25px rgba(231, 76, 60, 0.15) !important;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.stat-icon::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 55%);
  pointer-events: none;
}

.stat-icon .icon-svg {
  width: 32px;
  height: 32px;
  color: #ffffff;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.35));
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-cards :deep(.el-card:hover) .icon-svg {
  transform: scale(1.08);
}

.stat-icon.alerts .icon-wave {
  opacity: 0.85;
  transform-origin: center;
  animation: alert-wave 2s ease-in-out infinite;
}
.stat-icon.alerts .wave-1 { animation-delay: 0s; }
.stat-icon.alerts .wave-2 { animation-delay: 0.3s; }

@keyframes alert-wave {
  0%, 100% { opacity: 0.85; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.15); }
}

.stat-icon.devices .icon-pulse {
  animation: pulse-ring 2s ease-in-out infinite;
}
.stat-icon.devices .icon-pulse-dot {
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-ring {
  0%, 100% { opacity: 0.9; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.stat-icon.channels .icon-ring {
  transform-origin: 12px 12px;
  animation: signal-ring 2.5s ease-out infinite;
}
.stat-icon.channels .ring-1 { animation-delay: 0s; }
.stat-icon.channels .ring-2 { animation-delay: 0.4s; }

@keyframes signal-ring {
  0% { opacity: 0.9; transform: scale(0.9); }
  100% { opacity: 0; transform: scale(1.25); }
}

.stat-icon.rules .icon-bolt {
  transform-origin: center;
  animation: bolt-flash 2s ease-in-out infinite;
}
.stat-icon.rules .bolt-2 {
  animation: bolt-flash 2s ease-in-out infinite 0.15s;
  opacity: 0.5;
}
.stat-icon.rules .icon-ring {
  animation: ring-spin 4s linear infinite;
  transform-origin: 12px 12px;
}

@keyframes bolt-flash {
  0%, 90%, 100% { transform: scale(1); opacity: 1; }
  93% { transform: scale(1.15); opacity: 0.7; }
  96% { transform: scale(0.95); opacity: 1; }
}

@keyframes ring-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.stat-icon .icon-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
}
.stat-icon .dot-1 {
  top: 10px;
  right: 12px;
  animation: dot-pulse 1.5s ease-in-out infinite;
}
.stat-icon .dot-2 {
  bottom: 12px;
  left: 10px;
  animation: dot-pulse 1.5s ease-in-out infinite 0.5s;
}

@keyframes dot-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}

.stat-icon.alerts {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 40%, #c44569 100%);
  box-shadow: 0 6px 20px rgba(238, 90, 111, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.stat-cards :deep(.el-card:hover) .stat-icon.alerts {
  box-shadow: 0 8px 28px rgba(238, 90, 111, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.stat-icon.devices {
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 55%, #0052d4 100%);
  box-shadow: 0 6px 20px rgba(58, 123, 213, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.stat-cards :deep(.el-card:hover) .stat-icon.devices {
  box-shadow: 0 8px 28px rgba(58, 123, 213, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.stat-icon.channels {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #8b5cf6 100%);
  box-shadow: 0 6px 20px rgba(168, 85, 247, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.stat-cards :deep(.el-card:hover) .stat-icon.channels {
  box-shadow: 0 8px 28px rgba(168, 85, 247, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.stat-icon.rules {
  background: linear-gradient(135deg, #11d3bc 0%, #20bf6b 55%, #0fb9b1 100%);
  box-shadow: 0 6px 20px rgba(32, 191, 107, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.stat-cards :deep(.el-card:hover) .stat-icon.rules {
  box-shadow: 0 8px 28px rgba(32, 191, 107, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.stat-content {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}

@media (max-width: 1365px) and (max-height: 700px) {
  .stat-card { padding: 14px; margin-bottom: 12px; }
  .stat-icon { width: 48px; height: 48px; margin-right: 12px; }
  .stat-icon .icon-svg { width: 26px; height: 26px; }
  .stat-value { font-size: 22px; }
  .stat-label { font-size: 13px; }
}

@media (min-width: 1366px) and (max-width: 1919px) {
  .stat-card { padding: 18px; }
  .stat-icon { width: 56px; height: 56px; }
  .stat-icon .icon-svg { width: 30px; height: 30px; }
  .stat-value { font-size: 26px; }
}

@media (min-width: 1920px) {
  .stat-card { padding: 20px; }
  .stat-icon { width: 60px; height: 60px; }
  .stat-icon .icon-svg { width: 34px; height: 34px; }
  .stat-value { font-size: 28px; }
}

@media (max-width: 1023px) {
  .stat-card { padding: 16px; }
  .stat-icon { width: 50px; height: 50px; }
  .stat-icon .icon-svg { width: 28px; height: 28px; }
  .stat-value { font-size: 24px; }
}

@media (max-width: 768px) {
  .stat-card { padding: 12px; }
  .stat-icon { width: 48px; height: 48px; margin-right: 12px; }
  .stat-icon .icon-svg { width: 26px; height: 26px; }
  .stat-value { font-size: 22px; }
  .stat-label { font-size: 12px; }
}

@media (max-width: 1024px) and (orientation: landscape) {
  .stat-cards { margin-bottom: 16px; }
}
</style>