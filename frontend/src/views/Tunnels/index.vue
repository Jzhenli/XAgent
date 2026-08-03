<template>
  <div class="tunnels-page">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="searchQuery"
          :placeholder="t('channels.searchPlaceholder')"
          :prefix-icon="Search"
          clearable
          class="toolbar-search"
        />
        <el-select
          v-model="statusFilter"
          :placeholder="t('channels.statusFilter')"
          clearable
          class="toolbar-filter"
        >
          <el-option :label="t('common.all')" value="" />
          <el-option :label="t('channels.online')" value="online" />
          <el-option :label="t('channels.offline')" value="offline" />
        </el-select>
        <el-select
          v-model="protocolFilter"
          :placeholder="t('channels.protocolFilter')"
          clearable
          class="toolbar-filter"
        >
          <el-option :label="t('common.all')" value="" />
          <el-option label="MQTT" value="mqtt" />
          <el-option label="XNC" value="xnc" />
          <el-option label="HTTP" value="http" />
        </el-select>
      </div>
      <div class="toolbar-right">
        <span class="stat-item stat-online">
          <span class="stat-value">{{ channelStore.onlineChannels }}</span>
          <span class="stat-label">{{ t('channels.online') }}</span>
        </span>
        <span class="stat-item">
          <span class="stat-value">{{ channelStore.totalChannels }}</span>
          <span class="stat-label">{{ t('channels.channels') }}</span>
        </span>
      </div>
    </div>

    <!-- 错误提示 -->
    <el-alert
      v-if="channelStore.error"
      :title="channelStore.error"
      type="error"
      show-icon
      closable
      style="margin-bottom: 16px"
    />

    <!-- 紧凑模式 -->
    <div v-if="isCompactMode" class="main-content compact-mode">
      <div class="compact-tabs">
        <div
          class="compact-tab"
          :class="{ active: activeTab === 'channels' }"
          @click="activeTab = 'channels'"
        >
          {{ t('channels.channelList') }}
          <span v-if="selectedChannelId" class="tab-badge">{{ selectedChannel?.name }}</span>
        </div>
        <div
          class="compact-tab"
          :class="{ active: activeTab === 'details', disabled: !selectedChannelId }"
          @click="selectedChannelId && (activeTab = 'details')"
        >
          {{ t('channels.channelDetails') }}
        </div>
      </div>

      <div v-show="activeTab === 'channels'" class="compact-panel channel-panel">
        <TunnelList
          v-bind="tunnelListProps"
          :is-compact="true"
          @select="handleViewDetails"
          @toggle="handleToggleTunnel"
          @edit="onEditTunnel"
          @delete="onDeleteTunnel"
          @test="handleTestConnection"
          @restart="handleRestartChannel"
          @add="onAddTunnel"
          @import="handleImportYaml"
          @export="handleExportYaml"
          @refresh="onRefresh"
        />
      </div>

      <div v-show="activeTab === 'details'" class="compact-panel details-panel">
        <TunnelDetails
          :channel="selectedChannel"
          :is-compact="true"
          @back="handleBackToList"
          @test="handleTestConnection"
          @restart="handleRestartChannel"
        />
      </div>
    </div>

    <!-- 正常模式 -->
    <div v-else class="main-content">
      <TunnelList
        v-bind="tunnelListProps"
        :is-compact="false"
        @select="handleViewDetails"
        @toggle="handleToggleTunnel"
        @edit="onEditTunnel"
        @delete="onDeleteTunnel"
        @test="handleTestConnection"
        @restart="handleRestartChannel"
        @add="onAddTunnel"
        @import="handleImportYaml"
        @export="handleExportYaml"
        @refresh="onRefresh"
      />

      <div class="details-panel-wrapper">
        <TunnelDetails
          :channel="selectedChannel"
          :is-compact="false"
          @test="handleTestConnection"
          @restart="handleRestartChannel"
        />
      </div>
    </div>

    <!-- 通道表单弹窗 -->
    <TunnelDialog
      :model-value="showTunnelDialog"
      @update:model-value="showTunnelDialog = $event"
      :form="tunnelForm"
      :is-editing="isEditing"
      :saving="saving"
      :protocol-options="protocolOptions"
      :mqtt-adapter-options="mqttAdapterOptions"
      v-model:product-key="productKey"
      @save="onSaveTunnel"
      @protocol-change="handleProtocolChange"
      @adapter-change="handleAdapterChange"
      @fill-mapping-template="onFillMappingTemplate"
    />

    <!-- 隐藏的文件输入（用于导入） -->
    <input
      ref="importFileRef"
      type="file"
      accept=".yaml,.yml"
      style="display: none"
      @change="handleImportFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useChannelStore } from '@/stores/channels'
import { useResponsive } from '@/utils/useResponsive'
import { Search } from '@element-plus/icons-vue'

import TunnelList from './components/TunnelList.vue'
import TunnelDetails from './components/TunnelDetails.vue'
import TunnelDialog from './components/TunnelDialog.vue'

import { useTunnelManagement } from './hooks/useTunnelManagement'
import { useTunnelDetails } from './hooks/useTunnelDetails'
import { useTunnelIO } from './hooks/useTunnelIO'

import { createInitialChannelForm } from './types'
import type { ChannelFormData } from './types'
import type { ChannelListItem } from '@/stores/channels'

const { t } = useI18n()
const channelStore = useChannelStore()
const { isTablet, isMobile, width } = useResponsive()

const isCompactMode = computed(() => isTablet.value || isMobile.value || width.value <= 1024)

// 工具栏状态
const searchQuery = ref('')
const statusFilter = ref('')
const protocolFilter = ref('')

// 表单数据
const tunnelForm = ref<ChannelFormData>(createInitialChannelForm())

// Hooks 初始化
const {
  showTunnelDialog,
  isEditing,
  saving,
  protocolOptions,
  mqttAdapterOptions,
  productKey,
  handleProtocolChange,
  handleAdapterChange,
  handleAddTunnel,
  handleEditTunnel,
  handleSaveTunnel,
  handleToggleTunnel,
  handleDeleteTunnel,
  handleRefresh,
  fillMappingTemplate
} = useTunnelManagement()

const {
  selectedChannelId,
  activeTab,
  selectedChannel,
  handleViewDetails,
  handleBackToList,
  handleTestConnection,
  handleRestartChannel
} = useTunnelDetails()

const {
  importFileRef,
  handleExportYaml,
  handleImportYaml,
  handleImportFileChange
} = useTunnelIO()

// 过滤后的通道列表
const filteredChannels = computed(() => {
  let list = channelStore.channelList
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.id.toLowerCase().includes(query) ||
      c.protocol.toLowerCase().includes(query)
    )
  }
  if (statusFilter.value === 'online') {
    list = list.filter(c => c.connectionStatus === 'online')
  } else if (statusFilter.value === 'offline') {
    list = list.filter(c => c.connectionStatus !== 'online')
  }
  if (protocolFilter.value) {
    list = list.filter(c => c.protocol === protocolFilter.value)
  }
  return list
})

// TunnelList Props
const tunnelListProps = computed(() => ({
  channels: filteredChannels.value,
  loading: channelStore.loading,
  selectedId: selectedChannelId.value
}))

// 事件桥接
const onAddTunnel = () => {
  handleAddTunnel(tunnelForm.value)
}

const onEditTunnel = (channel: ChannelListItem) => {
  handleEditTunnel(tunnelForm.value, channel)
}

const onSaveTunnel = () => {
  handleSaveTunnel(tunnelForm.value)
}

const onDeleteTunnel = (channel: ChannelListItem) => {
  handleDeleteTunnel(channel, () => {
    if (selectedChannelId.value === channel.id) {
      selectedChannelId.value = null
    }
  })
}

const onFillMappingTemplate = () => {
  fillMappingTemplate(tunnelForm.value)
}

const onRefresh = () => {
  handleRefresh()
}

// 初始化
onMounted(async () => {
  await channelStore.fetchChannels()
})
</script>

<style scoped>
.tunnels-page {
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: var(--bg-card);
  border-radius: 16px;
  box-shadow: var(--el-box-shadow);
  flex-shrink: 0;
}

.toolbar-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar-search {
  width: 250px;
}

.toolbar-search :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border-bottom: 1px solid var(--el-border-color) !important;
  border-radius: 0 !important;
}

.toolbar-search :deep(.el-input__wrapper:hover),
.toolbar-search :deep(.el-input__wrapper.is-focus) {
  box-shadow: none !important;
  border-bottom: 1px solid var(--el-color-primary) !important;
}

.toolbar-filter {
  width: 120px;
}

.toolbar-filter :deep(.el-select__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border-bottom: 1px solid var(--el-border-color) !important;
  border-radius: 0 !important;
}

.toolbar-filter :deep(.el-select__wrapper:hover),
.toolbar-filter :deep(.el-select__wrapper.is-focused) {
  box-shadow: none !important;
  border-bottom: 1px solid var(--el-color-primary) !important;
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.stat-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.stat-online .stat-value {
  color: var(--el-color-success);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 12px;
}

.main-content {
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.main-content.compact-mode {
  flex-direction: column;
}

.compact-tabs {
  display: flex;
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 4px;
  gap: 4px;
  flex-shrink: 0;
  box-shadow: var(--el-box-shadow);
}

.compact-tab {
  flex: 1;
  padding: 12px 16px;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  background: transparent;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.compact-tab:hover {
  background: var(--el-fill-color);
}

.compact-tab.active {
  background: var(--el-color-primary);
  color: #fff;
}

.compact-tab.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tab-badge {
  font-size: 12px;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.compact-tab:not(.active) .tab-badge {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.compact-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.channel-panel {
  background: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow);
}

.details-panel-wrapper {
  flex: 1;
  display: flex;
  overflow: hidden;
  min-width: 0;
  background: var(--bg-card);
  border-radius: 16px;
}

@media (max-width: 1200px) {
  .toolbar-search {
    width: 200px;
  }
}

@media (max-width: 1024px) {
  .toolbar-search {
    width: 180px;
  }

  .toolbar-filter {
    width: 110px;
  }
}

@media (max-width: 900px) {
  .main-content {
    flex-direction: column;
  }

  .toolbar-search {
    width: 100%;
    order: 1;
  }

  .toolbar-filter {
    width: 140px;
    order: 2;
  }

  .toolbar-right {
    order: 4;
    margin-left: auto;
    padding-left: 0;
    border-left: none;
  }
}

@media (max-width: 600px) {
  .toolbar {
    padding: 10px 12px;
  }

  .toolbar-search {
    width: 100%;
  }

  .toolbar-filter {
    width: 100%;
  }
}

@media (max-width: 1024px) {
  .compact-tab {
    padding: 8px 12px;
    font-size: 13px;
  }

  .toolbar {
    padding: 10px 12px;
    gap: 8px;
  }

  .toolbar-right {
    flex-wrap: wrap;
  }
}

@media (max-height: 700px) {
  .toolbar {
    padding: 8px 12px;
    gap: 8px;
  }

  .compact-tabs {
    padding: 2px;
    gap: 2px;
  }

  .compact-tab {
    padding: 6px 10px;
    font-size: 13px;
  }
}
</style>
