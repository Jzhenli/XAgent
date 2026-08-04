<template>
  <div class="alarms-page">
    <el-tabs v-model="activeTab" class="alarms-tabs">
      <!-- 告警记录 -->
      <el-tab-pane :label="t('alerts.tabAlerts')" name="alerts">
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
      </el-tab-pane>

      <!-- 通知渠道 -->
      <el-tab-pane :label="t('alerts.tabChannels')" name="channels">
        <ChannelList
          :channels="alertStore.channels"
          :can-update="canUpdate"
          @toggle="handleToggleChannel"
          @configure="handleConfigureChannel"
          @test="handleTestChannel"
        />
      </el-tab-pane>
    </el-tabs>

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

// ==================== 过滤后的告警列表 ====================
/**
 * 依次应用关键字搜索、级别筛选、状态筛选
 */
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
}

.alarms-tabs {
  background: var(--bg-container);
  border-radius: 8px;
  padding: 16px;
  box-shadow: var(--shadow-light);
}

@media (max-width: 1024px) {
  .alarms-tabs {
    padding: 12px;
  }
}

@media (max-width: 768px) {
  .alarms-tabs {
    padding: 8px;
  }
}
</style>
