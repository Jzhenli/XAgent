<template>
  <div class="alarms-page">
    <!-- 顶部工具栏 + 统计信息 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="tab-switcher">
          <div
            class="tab-item"
            :class="{ active: activeTab === 'alerts' }"
            @click="activeTab = 'alerts'"
          >
            {{ t('alerts.tabAlerts') }}
            <span v-if="alertStore.pendingAlerts > 0" class="tab-badge">
              {{ alertStore.pendingAlerts }}
            </span>
          </div>
          <div
            class="tab-item"
            :class="{ active: activeTab === 'channels' }"
            @click="activeTab = 'channels'"
          >
            {{ t('alerts.tabChannels') }}
          </div>
        </div>
      </div>

      <div class="toolbar-right">
        <!-- 告警统计 -->
        <div class="stat-group" v-if="activeTab === 'alerts'">
          <span class="stat-item stat-critical">
            <span class="stat-value">{{ alertStore.criticalAlerts }}</span>
            <span class="stat-label">{{ t('alerts.levelCritical') }}</span>
          </span>
          <span class="stat-item stat-pending">
            <span class="stat-value">{{ alertStore.pendingAlerts }}</span>
            <span class="stat-label">{{ t('alerts.statusNew') }}</span>
          </span>
          <span class="stat-item">
            <span class="stat-value">{{ alertStore.alerts.length }}</span>
            <span class="stat-label">{{ t('alerts.totalAlerts') }}</span>
          </span>
        </div>

        <!-- 渠道统计 -->
        <div class="stat-group" v-else>
          <span class="stat-item stat-enabled">
            <span class="stat-value">{{ enabledChannelCount }}</span>
            <span class="stat-label">{{ t('alerts.channelEnabled') }}</span>
          </span>
          <span class="stat-item">
            <span class="stat-value">{{ alertStore.channels.length }}</span>
            <span class="stat-label">{{ t('alerts.totalChannels') }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <el-alert
      v-if="alertStore.error"
      :title="alertStore.error"
      type="error"
      show-icon
      closable
      style="margin-bottom: 16px"
    />

    <!-- 告警记录面板 -->
    <div v-show="activeTab === 'alerts'" class="main-content">
      <div class="alerts-panel">
        <AlertToolbar
          :search-query="searchQuery"
          :level-filter="levelFilter"
          :status-filter="statusFilter"
          :loading="alertStore.loading"
          :can-delete="canDelete"
          @update:search-query="searchQuery = $event"
          @update:level-filter="levelFilter = $event"
          @update:status-filter="statusFilter = $event"
          @refresh="alertStore.fetchAlerts()"
          @clear-all="handleClearAll"
        />

        <AlertTable
          :alerts="filteredAlerts"
          :loading="alertStore.loading"
          :can-update="canUpdate"
          @acknowledge="handleAcknowledge"
          @resolve="handleResolve"
          @ignore="handleIgnore"
        />
      </div>
    </div>

    <!-- 通知渠道面板 -->
    <div v-show="activeTab === 'channels'" class="main-content">
      <div class="channels-panel">
        <ChannelList
          :channels="alertStore.channels"
          :can-update="canUpdate"
          @toggle="handleToggleChannel"
          @configure="handleConfigureChannel"
          @test="handleTestChannel"
        />
      </div>
    </div>

    <!-- 系统通知配置对话框 -->
    <SystemConfigDialog
      v-model="systemConfigDialogVisible"
      :form="systemConfigForm"
      :can-save="canUpdate"
      @save="handleSaveSystemConfig"
    />

    <!-- 邮件通知配置对话框 -->
    <EmailConfigDialog
      v-model="emailConfigDialogVisible"
      :form="emailConfigForm"
      :can-save="canUpdate"
      @save="handleSaveEmailConfig"
    />

    <!-- Webhook 配置对话框 -->
    <WebhookConfigDialog
      v-model="webhookConfigDialogVisible"
      :form="webhookConfigForm"
      :can-save="canUpdate"
      @save="handleSaveWebhookConfig"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAlertStore } from '@/stores/alerts'
import { useUserStore } from '@/stores/users'
import AlertToolbar from './components/AlertToolbar.vue'
import AlertTable from './components/AlertTable.vue'
import ChannelList from './components/ChannelList.vue'
import SystemConfigDialog from './components/SystemConfigDialog.vue'
import EmailConfigDialog from './components/EmailConfigDialog.vue'
import WebhookConfigDialog from './components/WebhookConfigDialog.vue'
import { useAlertManagement } from './hooks/useAlertManagement'
import { useChannelManagement } from './hooks/useChannelManagement'

const { t } = useI18n()
const alertStore = useAlertStore()
const userStore = useUserStore()

// ==================== 选项卡与筛选状态 ====================
const activeTab = ref('alerts')
const searchQuery = ref('')
const levelFilter = ref('')
const statusFilter = ref('')

// ==================== 权限控制 ====================
const canUpdate = computed(() => userStore.hasPermission('alerts', 'update'))
const canDelete = computed(() => userStore.hasPermission('alerts', 'delete'))

// ==================== 统计信息 ====================
const enabledChannelCount = computed(
  () => alertStore.channels.filter((c) => c.enabled).length,
)

// ==================== 过滤后的告警列表 ====================
const filteredAlerts = computed(() => {
  let alerts = [...alertStore.alerts]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    alerts = alerts.filter(
      (a) =>
        a.ruleName.toLowerCase().includes(query) ||
        a.message.toLowerCase().includes(query),
    )
  }

  if (levelFilter.value) {
    alerts = alerts.filter((a) => a.level === levelFilter.value)
  }

  if (statusFilter.value) {
    alerts = alerts.filter((a) => a.status === statusFilter.value)
  }

  return alerts
})

// ==================== 业务逻辑 Hooks ====================
const {
  handleAcknowledge,
  handleResolve,
  handleIgnore,
  handleClearAll,
} = useAlertManagement()

const {
  systemConfigDialogVisible,
  systemConfigForm,
  emailConfigDialogVisible,
  emailConfigForm,
  webhookConfigDialogVisible,
  webhookConfigForm,
  handleToggleChannel,
  handleConfigureChannel,
  handleSaveSystemConfig,
  handleSaveEmailConfig,
  handleSaveWebhookConfig,
  handleTestChannel,
} = useChannelManagement()

// ==================== 初始化 ====================
onMounted(async () => {
  await alertStore.fetchAlerts()
  await alertStore.fetchChannels()
})
</script>

<style scoped>
.alarms-page {
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 16px;
}

/* ========== 顶部工具栏 ========== */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg-card);
  border-radius: 16px;
  box-shadow: var(--el-box-shadow);
  flex-shrink: 0;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 选项卡切换器 */
.tab-switcher {
  display: flex;
  background: var(--el-bg-color);
  border-radius: 10px;
  padding: 4px;
  gap: 4px;
}

.tab-item {
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  background: transparent;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-item:hover {
  background: var(--el-fill-color);
}

.tab-item.active {
  background: var(--el-color-primary);
  color: #fff;
}

.tab-badge {
  font-size: 12px;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.tab-item:not(.active) .tab-badge {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

/* 统计信息 */
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.stat-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.stat-critical .stat-value {
  color: var(--el-color-danger);
}

.stat-pending .stat-value {
  color: var(--el-color-warning);
}

.stat-enabled .stat-value {
  color: var(--el-color-success);
}

/* ========== 主内容区 ========== */
.main-content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.alerts-panel,
.channels-panel {
  background: var(--bg-card);
  border-radius: 16px;
  box-shadow: var(--el-box-shadow);
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ========== 响应式 ========== */
@media (max-width: 1024px) {
  .tab-item {
    padding: 6px 12px;
    font-size: 13px;
  }

  .stat-value {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  .toolbar {
    padding: 10px 12px;
    gap: 8px;
  }

  .toolbar-left,
  .toolbar-right {
    width: 100%;
    justify-content: center;
  }

  .stat-group {
    gap: 12px;
  }

  .stat-value {
    font-size: 16px;
  }

  .alerts-panel,
  .channels-panel {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .stat-item {
    gap: 2px;
  }

  .stat-value {
    font-size: 14px;
  }

  .stat-label {
    font-size: 11px;
  }

  .tab-item {
    padding: 6px 10px;
    font-size: 12px;
  }
}

@media (max-height: 700px) {
  .toolbar {
    padding: 8px 12px;
    gap: 8px;
  }

  .tab-item {
    padding: 6px 10px;
    font-size: 13px;
  }

  .stat-value {
    font-size: 16px;
  }
}
</style>
