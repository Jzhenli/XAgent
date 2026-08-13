<template>
  <div class="settings-section">
    <div class="settings-header">
      <div class="settings-section-title">{{ $t('settings.menu.logs') }}</div>
      <div class="settings-header-actions">
        <el-select
          v-model="selectedLevel"
          :placeholder="$t('settings.log.levelFilter')"
          clearable
          class="plain-select"
          popper-class="plain-select-dropdown"
          @change="fetchLogs"
        >
          <el-option label="DEBUG" value="DEBUG" />
          <el-option label="INFO" value="INFO" />
          <el-option label="WARNING" value="WARNING" />
          <el-option label="ERROR" value="ERROR" />
        </el-select>

        <div
          class="action-btn accent"
          :class="{ loading: loading }"
          @click="handleRefreshClick"
        >
          <span v-if="!loading">{{ $t('settings.log.refresh') }}</span>
          <span v-else class="btn-spinner"></span>
        </div>

        <div
          class="action-btn download"
          :class="{ disabled: logs.length === 0 }"
          @click="handleExportClick"
        >
          {{ $t('settings.log.download') }}
        </div>
      </div>
    </div>

    <div class="log-content" v-loading="loading">
      <div
        v-for="(log, index) in logs"
        :key="index"
        class="log-line"
      >
        <span class="log-time">{{ log.timestamp }}</span>
        <span :class="['log-level', log.level.toLowerCase()]">
          {{ log.level }}
        </span>
        <span class="log-message">{{ log.message }}</span>
      </div>

      <div v-if="logs.length === 0 && !loading" class="log-empty">
        {{ $t('settings.log.empty') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '@/api/index'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

interface LogLine {
  timestamp: string
  level: string
  logger: string
  message: string
}

type ErrorLike = { response?: { data?: { detail?: string } } }

const logs = ref<LogLine[]>([])
const selectedLevel = ref('')
const loading = ref(false)

const handleRefreshClick = () => {
  if (loading.value) return
  fetchLogs()
}

const handleExportClick = () => {
  if (logs.value.length === 0) return
  exportLogs()
}

const fetchLogs = async () => {
  loading.value = true
  try {
    const response = await api.get('/api/logs', {
      params: {
        level: selectedLevel.value || undefined,
        lines: 200
      }
    })
    logs.value = response.data.logs
  } catch (error: unknown) {
    const err = error as ErrorLike
    ElMessage.error(err?.response?.data?.detail || t('settings.log.fetchFailed'))
  } finally {
    loading.value = false
  }
}

const exportLogs = () => {
  if (logs.value.length === 0) {
    ElMessage.warning(t('settings.log.noLogsToExport'))
    return
  }

  try {
    const logContent = logs.value
      .map(log => `${log.timestamp} - ${log.logger} - ${log.level} - ${log.message}`)
      .join('\n')

    const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)
    const levelSuffix = selectedLevel.value ? `_${selectedLevel.value}` : '_ALL'
    link.download = `xagent_logs${levelSuffix}_${timestamp}.txt`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)

    ElMessage.success(t('settings.log.exportSuccess', { count: logs.value.length }))
  } catch (error) {
    ElMessage.error(t('settings.log.exportFailed'))
    console.error('Export logs error:', error)
  }
}

onMounted(fetchLogs)
</script>

<style scoped>
.settings-section {
  display: flex;
  flex-direction: column;
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.settings-section-title {
  margin: 0;
  font-size: 18px;
  color: var(--text-primary);
}

.settings-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  height: 32px;
  padding: 0 15px;
  font-size: 14px;
  line-height: 1;
  color: var(--text-primary);
  background: var(--bg-color);
  border: 1px solid var(--border-base);
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
}

.action-btn.accent {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.13);
  border-color: rgba(255, 255, 255, 0.13);
}

.action-btn.download {
  color: #fff;
  background: rgba(102, 102, 255, 1);
  border-color: rgba(102, 102, 255, 1);
}

.action-btn.disabled,
.action-btn.loading {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

:deep(.el-select.plain-select) {
  width: 180px;
}

:deep(.el-select.plain-select .el-select__wrapper) {
  box-shadow: none !important;
  border: none !important;
  border-bottom: 1px solid var(--border-base, #dcdfe6) !important;
  border-radius: 0 !important;
  background: transparent !important;
  padding: 0 8px;
}

:deep(.el-select.plain-select.is-focused .el-select__wrapper) {
  border-bottom-color: var(--color-primary, #409eff) !important;
}

:deep(.el-select.plain-select .el-select__selected-item),
:deep(.el-select.plain-select .el-select__placeholder) {
  background: transparent !important;
  color: var(--text-primary);
  height: 32px;
  line-height: 32px;
  text-align: center;
}

:deep(.el-select.plain-select .el-select__suffix),
:deep(.el-select.plain-select .el-input__suffix) {
  color: var(--text-secondary);
}

.log-content {
  flex: 1;
  min-height: 300px;
  max-height: calc(100vh - 260px);
  overflow-y: auto;
  padding: 12px;
  font-family: 'Fira Code', monospace;
  font-size: 13px;
}

.log-content :deep(.el-loading-mask) {
  background-color: transparent !important;
}

.log-line {
  display: flex;
  gap: 12px;
  padding: 4px 0;
}

.log-time {
  color: #6a9955;
}

.log-level {
  width: 60px;
  font-weight: bold;
}

.log-level.info {
  color: #4ec9b0;
}

.log-level.warning {
  color: #dcdcaa;
}

.log-level.error {
  color: #f14c4c;
}

.log-level.debug {
  color: #608b4e;
}

.log-message {
  color: #d4d4d4;
}

.log-empty {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}

@media (min-width: 1025px) and (max-width: 1366px) {
  .settings-section-title {
    font-size: 16px;
  }
}
</style>

<style>
.plain-select-dropdown {
  background: var(--bg-card) !important;
}

.plain-select-dropdown .el-select-dropdown__item {
  text-align: center;
}
</style>