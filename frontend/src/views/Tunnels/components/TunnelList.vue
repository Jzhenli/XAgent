<template>
  <!-- 紧凑模式：顶部工具栏 + 网格卡片 -->
  <template v-if="isCompact">
    <div class="compact-toolbar">
      <div class="panel-title-wrapper">
        <span class="panel-title">{{ t("channels.channelList") }}</span>
        <span class="channel-count"
          >{{ channels.length }} {{ t("channels.channelsCount") }}</span
        >
      </div>
      <div class="panel-actions" @click.stop>
        <el-tooltip
          v-if="canCreate"
          :content="t('channels.addChannel')"
          placement="top"
        >
          <el-button
            type="primary"
            link
            :size="actionSize"
            @click="emit('add')"
          >
            <el-icon><Plus /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip :content="t('common.export')" placement="top">
          <el-button link :size="actionSize" @click="emit('export')">
            <el-icon><Download /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip
          v-if="canCreate"
          :content="t('common.import')"
          placement="top"
        >
          <el-button link :size="actionSize" @click="emit('import')">
            <el-icon><Upload /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip :content="t('common.refresh')" placement="top">
          <el-button
            link
            :size="actionSize"
            :loading="loading"
            @click="emit('refresh')"
          >
            <el-icon><Refresh /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <div v-if="loading && channels.length === 0" class="loading-state">
      <el-icon class="is-loading" :size="32"><Refresh /></el-icon>
      <p>{{ t("channels.loadingChannelList") }}</p>
    </div>

    <div v-else-if="channels.length === 0" class="empty-state">
      <p>{{ t("channels.noChannels") }}</p>
    </div>

    <div v-else class="channel-grid">
      <div
        v-for="channel in channels"
        :key="channel.id"
        class="channel-card"
        :class="{
          offline: channel.connectionStatus !== 'online',
          selected: selectedId === channel.id,
        }"
        @click="emit('select', channel.id)"
      >
        <div class="channel-card-header">
          <div
            class="channel-status-icon"
            :class="{ online: channel.connectionStatus === 'online' }"
          >
            <el-icon v-if="channel.connectionStatus === 'online'"
              ><CircleCheck
            /></el-icon>
            <el-icon v-else><CircleClose /></el-icon>
          </div>
          <div class="channel-card-info">
            <div class="channel-card-name">{{ channel.name }}</div>
            <div class="channel-card-meta">
              <span>{{ channel.protocol.toUpperCase() }}</span>
              <span
                >{{ channel.uploadRate }} {{ t("channels.itemsPerMin") }}</span
              >
            </div>
          </div>
        </div>

        <div class="channel-card-stats">
          <div class="stat-mini">
            <span class="stat-mini-label">{{ t("channels.successRate") }}</span>
            <span class="stat-mini-value">{{ channel.successRate }}%</span>
          </div>
          <div class="stat-mini">
            <span class="stat-mini-label">{{ t("channels.backlog") }}</span>
            <span class="stat-mini-value">{{ channel.backlogCount }}</span>
          </div>
        </div>

        <div class="channel-card-actions">
          <el-switch
            v-if="canUpdate"
            :model-value="channel.enabled"
            :size="actionSize"
            @change="emit('toggle', channel.id)"
            @click.stop
          />
          <div class="action-buttons" @click.stop>
            <el-button
              v-if="canUpdate"
              type="primary"
              link
              :size="actionSize"
              @click="emit('edit', channel)"
            >
              {{ t("common.edit") }}
            </el-button>
            <el-dropdown
              trigger="click"
              popper-class="channel-dropdown-popper"
              :teleported="false"
              @command="(cmd: string) => handleDropdownCommand(cmd, channel)"
            >
              <el-button type="info" link :size="actionSize" class="more-btn">
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu class="channel-more-menu">
                  <el-dropdown-item command="test" :icon="Connection">{{
                    t("channels.testConnection")
                  }}</el-dropdown-item>
                  <el-dropdown-item
                    v-if="canUpdate"
                    command="restart"
                    :icon="RefreshRight"
                    >{{ t("channels.restart") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="canDelete"
                    command="delete"
                    :icon="Delete"
                    divided
                  >
                    <span class="delete-text">{{ t("common.delete") }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
  </template>

  <!-- 普通模式：列表面板 -->
  <div v-else class="channel-list-panel">
    <div class="panel-header">
      <div class="panel-title-wrapper">
        <span class="panel-title">{{ t("channels.channelList") }}</span>
      </div>
      <div class="panel-actions" @click.stop>
        <el-tooltip :content="t('common.export')" placement="top">
          <Icon
            type="mono-line"
            name="download"
            :size="24"
            :color="{ normal: 'var(--el-text-color-primary)' }"
            @click="emit('export')"
          />
        </el-tooltip>
        <el-tooltip
          v-if="canCreate"
          :content="t('common.import')"
          placement="top"
        >
          <Icon
            type="mono-line"
            name="import"
            :size="24"
            :color="{ normal: 'var(--el-text-color-primary)' }"
            @click="emit('import')"
          />
        </el-tooltip>
        <el-tooltip :content="t('common.refresh')" placement="top">
          <Icon
            type="mono-line"
            name="refresh"
            :size="24"
            :color="{ normal: 'var(--el-text-color-primary)' }"
            @click="emit('refresh')"
          />
        </el-tooltip>
        <el-tooltip
          v-if="canCreate"
          :content="t('channels.addChannel')"
          placement="top"
        >
          <Icon
            type="mono-line"
            name="add"
            :size="24"
            :color="{ normal: 'rgba(102, 102, 255, 1)' }"
            @click="emit('add')"
          />
        </el-tooltip>
      </div>
    </div>

    <div v-if="loading && channels.length === 0" class="loading-state">
      <el-icon class="is-loading" :size="32"><Refresh /></el-icon>
      <p>{{ t("channels.loadingChannelList") }}</p>
    </div>

    <div v-else-if="channels.length === 0" class="empty-state">
      <p>{{ t("channels.noChannels") }}</p>
    </div>

    <div v-else class="channel-list">
      <div
        v-for="channel in channels"
        :key="channel.id"
        class="channel-item"
        :class="{
          offline: channel.connectionStatus !== 'online',
          selected: selectedId === channel.id,
        }"
        @click="emit('select', channel.id)"
      >
        <div
          class="channel-status-icon"
          :class="{ online: channel.connectionStatus === 'online' }"
        >
          <el-icon v-if="channel.connectionStatus === 'online'" size="20">
            <CircleCheck />
          </el-icon>
          <el-icon v-else size="20"><CircleClose /></el-icon>
        </div>
        <div class="channel-item-content">
          <div class="channel-item-name">{{ channel.name }}</div>
          <div class="channel-item-meta">
            <span>{{ channel.protocol.toUpperCase() }}</span>
            <span>
              {{ channel.uploadRate }} {{ t("channels.itemsPerMin") }}
            </span>
            <span>{{ channel.successRate }}%</span>
          </div>
        </div>
        <div class="channel-item-actions" @click.stop>
          <el-switch
            v-if="canUpdate"
            :model-value="channel.enabled"
            :size="actionSize"
            @change="emit('toggle', channel.id)"
          />
          <el-dropdown
            trigger="click"
            popper-class="channel-dropdown-popper"
            :teleported="false"
            @command="(cmd: string) => handleDropdownCommand(cmd, channel)"
          >
            <el-button type="info" link :size="actionSize" class="more-btn">
              <el-icon :size="18"><MoreFilled /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu class="channel-more-menu">
                <el-dropdown-item
                  v-if="canUpdate"
                  command="edit"
                  class="dropdown-item-edit"
                >
                  <el-icon :size="18"><Edit /></el-icon>
                  <span>{{ t("common.edit") }}</span>
                </el-dropdown-item>
                <el-dropdown-item command="test" class="dropdown-item-test">
                  <el-icon :size="18"><Connection /></el-icon>
                  <span>{{ t("channels.testConnection") }}</span>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="canUpdate"
                  command="restart"
                  class="dropdown-item-restart"
                >
                  <el-icon :size="18"><RefreshRight /></el-icon>
                  <span>{{ t("channels.restart") }}</span>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="canDelete"
                  command="delete"
                  divided
                  class="dropdown-item-delete"
                >
                  <el-icon :size="18"><Delete /></el-icon>
                  <span>{{ t("common.delete") }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/stores/users";
import { useResponsive } from "@/utils/useResponsive";
import { Icon } from "@/icon/index";
import type { ChannelListItem } from "@/stores/channels";
import {
  CircleCheck,
  CircleClose,
  Refresh,
  MoreFilled,
  Edit,
  RefreshRight,
  Delete,
  Plus,
  Upload,
  Download,
  Connection,
} from "@element-plus/icons-vue";

const props = defineProps<{
  channels: ChannelListItem[];
  loading: boolean;
  selectedId: string | null;
  isCompact: boolean;
}>();

const emit = defineEmits<{
  (e: "select", id: string): void;
  (e: "toggle", id: string): void;
  (e: "edit", channel: ChannelListItem): void;
  (e: "delete", channel: ChannelListItem): void;
  (e: "test", id: string): void;
  (e: "restart", id: string): void;
  (e: "add"): void;
  (e: "import"): void;
  (e: "export"): void;
  (e: "refresh"): void;
}>();

const { t } = useI18n();
const userStore = useUserStore();

const actionSize = "default";
const canUpdate = computed(() => userStore.hasPermission("devices", "update"));
const canDelete = computed(() => userStore.hasPermission("devices", "delete"));
const canCreate = computed(() => userStore.hasPermission("devices", "create"));

const handleDropdownCommand = (cmd: string, channel: ChannelListItem) => {
  switch (cmd) {
    case "edit":
      emit("edit", channel);
      break;
    case "delete":
      emit("delete", channel);
      break;
    case "test":
      emit("test", channel.id);
      break;
    case "restart":
      emit("restart", channel.id);
      break;
  }
};
</script>

<style scoped>
.channel-list-panel {
  width: 360px;
  min-width: 260px;
  flex-shrink: 0;
  background: var(--bg-card);
  border-radius: 16px;
  box-shadow: var(--el-box-shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color-light);
  flex-shrink: 0;
  gap: 8px;
}

.panel-title-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.channel-count {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.panel-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.compact-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  gap: 8px;
  border-bottom: 1px solid var(--el-border-color-light);
  flex-shrink: 0;
}

.compact-toolbar .panel-title {
  font-size: 15px;
}

.compact-toolbar .channel-count {
  font-size: 12px;
}

.channel-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.channel-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;
  border: 1px solid transparent;
}

.channel-item:hover {
  background: var(--el-fill-color);
}

.channel-item.selected {
  background: rgba(102, 102, 255, 0.1);
  border-color: rgba(102, 102, 255, 1);
}

.channel-item.offline .channel-status-icon,
.channel-item.offline .channel-item-content {
  opacity: 0.7;
}

.channel-item-content {
  flex: 1;
  min-width: 0;
}

.channel-item-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.channel-item-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.channel-item-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.more-btn {
  padding: 6px;
  border-radius: 8px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.more-btn:hover {
  background: rgba(102, 102, 255, 0.12);
  color: rgba(102, 102, 255, 1);
  transform: scale(1.08);
  box-shadow: 0 2px 8px rgba(102, 102, 255, 0.2);
}

.more-btn:active {
  transform: scale(0.95);
}

.delete-text {
  color: var(--el-color-danger);
}

.channel-grid {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  align-content: start;
}

.channel-card {
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.channel-card:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}

.channel-card.selected {
  border-color: rgba(102, 102, 255, 1);
  background: rgba(102, 102, 255, 0.1);
}

.channel-card.offline .channel-card-header {
  opacity: 0.7;
}

.channel-card-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.channel-card-info {
  flex: 1;
  min-width: 0;
}

.channel-card-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.channel-card-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.channel-card-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  padding: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
}

.stat-mini {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-mini-label {
  font-size: 11px;
  color: var(--text-secondary);
}

.stat-mini-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.channel-card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-light);
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: var(--el-text-color-secondary);
}

.loading-state p {
  margin-top: 12px;
  font-size: 14px;
}

.empty-state {
  display: flex;
  justify-content: center;
  padding: 60px 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.channel-status-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

.channel-status-icon.online {
  background: var(--el-color-success-light-9);
  color: var(--el-color-success);
}

.channel-card .channel-status-icon {
  width: 36px;
  height: 36px;
}

:deep(.el-switch) {
  --el-switch-on-color: rgba(102, 102, 255, 1);
}

:deep(.channel-dropdown-popper) {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

:deep(.channel-more-menu) {
  padding: 8px;
  border-radius: 12px;
  min-width: 120px;
  background: var(--bg-modal, #fff) !important;
  border: 1px solid var(--el-border-color-lighter);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.12),
    0 2px 6px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(12px);
  animation: dropdownFadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

:deep(.channel-more-menu .el-dropdown-menu__item) {
  padding: 5px 7px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  background: transparent !important;
  color: var(--el-text-color-primary) !important;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

:deep(.channel-more-menu .el-dropdown-menu__item .el-icon) {
  transition: transform 0.2s ease;
}

:deep(.channel-more-menu .el-dropdown-menu__item:hover),
:deep(.channel-more-menu .el-dropdown-menu__item:focus),
:deep(.channel-more-menu .el-dropdown-menu__item:active) {
  background: rgba(102, 102, 255, 0.1) !important;
  color: rgba(102, 102, 255, 1) !important;
  transform: translateX(2px);
}

:deep(.channel-more-menu .dropdown-item-delete) {
  color: var(--el-color-danger) !important;
}

:deep(.channel-more-menu .dropdown-item-delete:hover),
:deep(.channel-more-menu .dropdown-item-delete:focus),
:deep(.channel-more-menu .dropdown-item-delete:active) {
  
  color: var(--el-color-danger) !important;
  transform: translateX(2px);
}

:deep(.channel-more-menu .dropdown-item-delete:hover .el-icon) {
  color: var(--el-color-danger);
}

:deep(.channel-more-menu .el-dropdown-menu__item.is-divider) {
  margin: 6px 4px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

@media (max-width: 1200px) {
  .channel-list-panel {
    width: 280px;
    min-width: 240px;
  }
}

@media (max-width: 1024px) {
  .channel-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 8px;
    padding: 8px;
  }

  .channel-card {
    padding: 12px;
  }
}

@media (max-width: 900px) {
  .channel-list-panel {
    width: 100%;
    min-width: 0;
    max-height: 280px;
  }
}

@media (max-width: 600px) {
  .channel-list-panel {
    max-height: 220px;
  }

  .channel-item {
    padding: 10px;
  }

  .channel-item-meta {
    flex-direction: column;
    gap: 2px;
  }
}

@media (pointer: coarse) {
  .channel-item {
    padding: 14px 12px;
    min-height: 56px;
  }

  .channel-item-actions {
    gap: 8px;
  }

  .more-btn {
    padding: 8px;
    min-width: 36px;
    min-height: 36px;
  }

  .channel-status-icon {
    width: 36px;
    height: 36px;
  }

  .el-button {
    min-height: 36px;
  }
}

@media (max-height: 700px) {
  .channel-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 6px;
    padding: 6px;
  }

  .channel-card {
    padding: 10px;
  }

  .channel-card-header {
    margin-bottom: 6px;
  }

  .panel-header {
    padding: 6px 10px;
    min-height: 36px;
  }

  .panel-title {
    font-size: 14px;
  }

  .loading-state,
  .empty-state {
    padding: 30px 0;
  }
}
</style>
