<template>
  <div class="log-viewer">
    <div class="log-toolbar">
      <el-select
        v-model="selectedLevel"
        :placeholder="$t('settings.log.levelFilter')"
        clearable
        style="width: 120px"
      >
        <el-option label="DEBUG" value="DEBUG" />
        <el-option label="INFO" value="INFO" />
        <el-option label="WARNING" value="WARNING" />
        <el-option label="ERROR" value="ERROR" />
      </el-select>

      <el-button
        type="primary"
        @click="fetchLogs"
        :loading="loading"
      >
        {{ $t('settings.log.refresh') }}
      </el-button>

      <el-button
        @click="exportLogs"
        :disabled="logs.length === 0"
      >
        {{ $t('settings.log.exportLogs') }}
      </el-button>
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

const logs = ref<LogLine[]>([])
const selectedLevel = ref('')
const loading = ref(false)

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
  } catch (error: any) {
    ElMessage.error(error.response?.data?.detail || t('settings.log.fetchFailed'))
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
    // 生成日志内容（保持原格式）
    const logContent = logs.value
      .map(log => `${log.timestamp} - ${log.logger} - ${log.level} - ${log.message}`)
      .join('\n')

    // 创建Blob
    const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' })

    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url

    // 生成文件名（包含过滤条件和时间戳）
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)
    const levelSuffix = selectedLevel.value ? `_${selectedLevel.value}` : '_ALL'
    link.download = `xagent_logs${levelSuffix}_${timestamp}.txt`

    // 触发下载
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // 清理URL
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
.log-viewer {
  background: var(--bg-container);
  border-radius: 8px;
}

.log-toolbar {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid var(--border-base);
}

.log-content {
  max-height: 500px;
  overflow-y: auto;
  padding: 12px;
  font-family: 'Fira Code', monospace;
  font-size: 13px;
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
</style>