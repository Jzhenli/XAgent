<!--
  DeviceList 组件
  ---------------------------------------------------------------------------
  用途：
    渲染设备列表，支持「紧凑模式（移动/平板）」和「普通模式（桌面端）」两种布局。
    通过 isCompact prop 在两种布局间切换。

  布局策略：
    - 两种模式共享同一套 loading / empty 状态渲染，避免模板重复。
    - 紧凑模式：网格卡片布局 (device-grid)。
    - 普通模式：列表项布局 (device-list)。

  Props:
    - devices: 设备列表数据
    - loading: 是否加载中
    - selectedAsset: 当前选中的设备 asset
    - isCompact: 是否紧凑模式（控制布局切换）

  Emits:
    - select(asset)     选中设备
    - toggle(asset)     切换设备启用状态
    - edit(device)      编辑设备
    - delete(device)    删除设备
    - reload(asset)     热加载设备
  ---------------------------------------------------------------------------
-->
<template>
  <!-- 紧凑模式（移动/平板）：顶部工具栏 + loading / empty / 列表 -->
  <template v-if="isCompact">
    <div class="compact-toolbar">
      <div class="panel-title-wrapper">
        <span class="panel-title">{{ t("devices.deviceList") }}</span>
        <span class="device-count"
          >{{ devices.length }} {{ t("devices.deviceCount") }}</span
        >
      </div>
      <div class="panel-actions" @click.stop>
        <el-tooltip
          v-if="canCreate"
          :content="t('devices.addDevice')"
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
            v-if="!loading"
            type="mono-line"
            name="refresh"
            :size="24"
            :color="{ normal: 'var(--el-text-color-primary)' }"
            @click="emit('refresh')"
          />
          <el-icon v-else class="is-loading" :size="24">
            <Refresh />
          </el-icon>
        </el-tooltip>
      </div>
    </div>

    <div v-if="loading && devices.length === 0" class="loading-state">
      <el-icon class="is-loading" :size="32"><Refresh /></el-icon>
      <p>{{ t("devices.loadingDevices") }}</p>
    </div>

    <div v-else-if="devices.length === 0" class="empty-state">
      <p>{{ t("devices.noDevices") }}</p>
    </div>

    <div v-else class="device-grid">
      <div
        v-for="device in devices"
        :key="device.asset"
        class="device-card"
        :class="{
          offline: device.connectionStatus !== 'online',
          selected: selectedAsset === device.asset,
        }"
        @click="emit('select', device.asset)"
      >
        <div class="device-card-header">
          <!-- 在线状态图标 -->
          <div
            class="device-status-icon"
            :class="{ online: device.connectionStatus === 'online' }"
          >
            <el-icon v-if="device.connectionStatus === 'online'"
              ><CircleCheck
            /></el-icon>
            <el-icon v-else><CircleClose /></el-icon>
          </div>

          <!-- 设备基本信息 -->
          <div class="device-card-info">
            <el-tooltip
              :content="device.name"
              placement="top"
              :show-after="300"
            >
              <div class="device-card-name">{{ device.name }}</div>
            </el-tooltip>
            <div class="device-card-meta">
              <div class="meta-plugin-name">{{ device.pluginName }}</div>
              <span class="meta-point-count"
                >{{ device.pointCount }} {{ t("devices.devicePoints") }}</span
              >
            </div>
          </div>
        </div>

        <!-- 操作区：启用开关 + 编辑/删除 -->
        <div class="device-card-actions">
          <el-switch
            v-if="canUpdate"
            :model-value="device.enabled"
            :size="actionSize"
            @change="emit('toggle', device.asset)"
            @click.stop
          />
          <div class="action-buttons" @click.stop>
            <el-button
              v-if="canUpdate"
              type="primary"
              link
              :size="actionSize"
              @click="emit('edit', device)"
            >
              {{ t("common.edit") }}
            </el-button>
            <el-button
              v-if="canDelete"
              type="danger"
              link
              :size="actionSize"
              @click="emit('delete', device)"
            >
              {{ t("common.delete") }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <!-- 普通模式（桌面端）：始终渲染面板，loading / empty 共享容器 -->
  <div v-else class="device-list-panel">
    <div class="panel-header">
      <div class="panel-title-wrapper">
        <span class="panel-title">{{ t("devices.deviceList") }}</span>
        <!-- <span class="device-count">{{ devices.length }} {{ t("devices.deviceCount") }}</span> -->
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
          :content="t('devices.addDevice')"
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

    <div v-if="loading && devices.length === 0" class="loading-state">
      <el-icon class="is-loading" :size="32"><Refresh /></el-icon>
      <p>{{ t("devices.loadingDevices") }}</p>
    </div>

    <div v-else-if="devices.length === 0" class="empty-state">
      <p>{{ t("devices.noDevices") }}</p>
    </div>

    <div v-else class="device-list">
      <div
        v-for="device in devices"
        :key="device.asset"
        class="device-item"
        :class="{
          offline: device.connectionStatus !== 'online',
          selected: selectedAsset === device.asset,
        }"
        @click="emit('select', device.asset)"
      >
        <!-- 在线状态图标 -->
        <div
          class="device-status-icon"
          :class="{ online: device.connectionStatus === 'online' }"
        >
          <el-icon v-if="device.connectionStatus === 'online'">
            <CircleCheck />
          </el-icon>
          <el-icon v-else><CircleClose /></el-icon>
        </div>

        <!-- 设备基本信息 -->
        <div class="device-item-content">
          <div class="device-item-name">{{ device.name }}</div>
          <div class="device-item-meta">
            <el-tooltip
              :content="device.pluginName"
              placement="top"
              :show-after="300"
            >
              <div class="meta-plugin-name">{{ device.pluginName }}</div>
            </el-tooltip>
            <span class="meta-point-count"
              >{{ device.pointCount }} {{ t("devices.devicePoints") }}</span
            >
          </div>
        </div>

        <!-- 操作区：启用开关 + 更多操作下拉 -->
        <div class="device-item-actions" @click.stop>
          <el-switch
            v-if="canUpdate"
            :model-value="device.enabled"
            :size="actionSize"
            @change="emit('toggle', device.asset)"
          />
          <el-dropdown
            trigger="click"
            popper-class="device-dropdown-popper"
            :teleported="false"
            @command="(cmd: string) => handleDropdownCommand(cmd, device)"
          >
            <el-button type="info" link :size="actionSize" class="more-btn">
              <el-icon :size="18"><MoreFilled /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu class="device-more-menu">
                <el-dropdown-item
                  v-if="canUpdate"
                  command="edit"
                  class="dropdown-item-edit"
                >
                  <el-icon :size="18"><Edit /></el-icon>
                  <span>{{ t("common.edit") }}</span>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="canUpdate"
                  command="reload"
                  class="dropdown-item-reload"
                >
                  <el-icon :size="18"><RefreshRight /></el-icon>
                  <span>{{ t("devices.hotReload") }}</span>
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
import {
  CircleCheck,
  CircleClose,
  Refresh,
  MoreFilled,
  Edit,
  RefreshRight,
  Delete,
} from "@element-plus/icons-vue";
import type { DeviceListItem } from "@/stores/devices";

/**
 * 组件 Props 定义
 * - devices: 设备列表数据
 * - loading: 是否加载中
 * - selectedAsset: 当前选中的设备 asset 编号
 * - isCompact: 是否以紧凑模式渲染（移动/平板 vs 桌面端）
 */
defineProps<{
  devices: DeviceListItem[];
  loading: boolean;
  selectedAsset: string | null;
  isCompact: boolean;
}>();

/**
 * 组件 Emits 定义
 */
const emit = defineEmits<{
  (e: "select", asset: string): void;
  (e: "toggle", asset: string): void;
  (e: "edit", device: DeviceListItem): void;
  (e: "delete", device: DeviceListItem): void;
  (e: "reload", asset: string): void;
  (e: "add"): void;
  (e: "import"): void;
  (e: "export"): void;
  (e: "refresh"): void;
}>();

const { t } = useI18n();
const userStore = useUserStore();
const { isTouch } = useResponsive();

/** 操作区组件尺寸：触控设备用 default，普通桌面用 small */
const actionSize = computed(() => (isTouch ? "default" : "small"));

/** 当前用户是否拥有更新 / 删除 / 新增权限 */
const canUpdate = computed(() => userStore.hasPermission("devices", "update"));
const canDelete = computed(() => userStore.hasPermission("devices", "delete"));
const canCreate = computed(() => userStore.hasPermission("devices", "create"));

/**
 * 处理桌面端「更多操作」下拉菜单的命令分发
 */
const handleDropdownCommand = (cmd: string, device: DeviceListItem) => {
  switch (cmd) {
    case "edit":
      emit("edit", device);
      break;
    case "delete":
      emit("delete", device);
      break;
    case "reload":
      emit("reload", device.asset);
      break;
  }
};
</script>

<style scoped>
@import "./DialogCommon.css";
/* ========== 桌面端：设备列表面板 ========== */
.device-list-panel {
  width: 300px;
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
  height: 60px;
  padding: 0 16px;
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

.device-count {
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

/* ========== 紧凑模式顶部工具栏 ========== */
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

.compact-toolbar .device-count {
  font-size: 12px;
}

.device-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

/* 列表项 */
.device-item {
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

.device-item:hover {
  background: var(--el-fill-color);
}

.device-item.selected {
  background: rgba(102, 102, 255, 0.1);
  border-color: rgba(102, 102, 255, 1);
}

.device-item.offline .device-status-icon,
.device-item.offline .device-item-content {
  opacity: 0.7;
}

.device-item-content {
  flex: 1;
  min-width: 0;
}

.device-item-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.device-item-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.device-item-meta .meta-plugin-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.device-item-meta .meta-point-count {
  flex-shrink: 0;
  white-space: nowrap;
}

.device-item-actions {
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

/* ========== 下拉菜单样式 ========== */
:deep(.device-dropdown-popper) {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

:deep(.device-more-menu) {
  padding: 8px;
  border-radius: 12px;
  min-width: 120px;
  background: var(--bg-modal, #fff) !important;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.12),
    0 2px 6px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(12px);
  animation: deviceDropdownFadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes deviceDropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

:deep(.device-more-menu .el-dropdown-menu__item) {
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

:deep(.device-more-menu .el-dropdown-menu__item .el-icon) {
  transition: transform 0.2s ease;
}

:deep(.device-more-menu .el-dropdown-menu__item:hover),
:deep(.device-more-menu .el-dropdown-menu__item:focus),
:deep(.device-more-menu .el-dropdown-menu__item:active) {
  background: rgba(102, 102, 255, 0.1) !important;
  color: rgba(102, 102, 255, 1) !important;
  transform: translateX(2px);
}

:deep(.device-more-menu .dropdown-item-delete) {
  color: var(--el-color-danger) !important;
}

:deep(.device-more-menu .dropdown-item-delete:hover),
:deep(.device-more-menu .dropdown-item-delete:focus),
:deep(.device-more-menu .dropdown-item-delete:active) {
  color: var(--el-color-danger) !important;
  transform: translateX(2px);
}

:deep(.device-more-menu .dropdown-item-delete:hover .el-icon) {
  color: var(--el-color-danger);
}

:deep(.device-more-menu .el-dropdown-menu__item.is-divider) {
  margin: 6px 4px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

/* ========== 紧凑模式：网格卡片 ========== */
.device-grid {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  align-content: start;
}

.device-card {
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.device-card:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}

.device-card.selected {
  border-color: rgba(102, 102, 255, 1);
  background: rgba(102, 102, 255, 0.1);
}

.device-card.offline .device-card-header {
  opacity: 0.7;
}

.device-card-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.device-card-info {
  flex: 1;
  min-width: 0;
}

.device-card-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.device-card-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.device-card-meta .meta-plugin-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.device-card-meta .meta-point-count {
  flex-shrink: 0;
  white-space: nowrap;
}

.device-card-actions {
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

/* ========== 共享状态 ========== */
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

/* ========== 共享状态图标：在线/离线 ========== */
.device-status-icon {
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

.device-status-icon.online {
  background: var(--el-color-success-light-9);
  color: var(--el-color-success);
}

.device-card .device-status-icon {
  width: 36px;
  height: 36px;
}

/* ========== el-switch 开启颜色 ========== */
:deep(.el-switch) {
  --el-switch-on-color: rgba(102, 102, 255, 1);
}

/* ========== 响应式：容器宽度 ========== */
@media (max-width: 1200px) {
  .device-list-panel {
    width: 280px;
    min-width: 240px;
  }
}

@media (max-width: 1024px) {
  .device-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 8px;
    padding: 8px;
  }

  .device-card {
    padding: 12px;
  }
}

@media (max-width: 900px) {
  .device-list-panel {
    width: 100%;
    min-width: 0;
    max-height: 280px;
  }
}

@media (max-width: 600px) {
  .device-list-panel {
    max-height: 220px;
  }

  .device-item {
    padding: 10px;
  }

  .device-item-meta {
    flex-direction: column;
    gap: 2px;
  }
}

/* ========== 响应式：触控设备（指针精度） ========== */
@media (pointer: coarse) {
  .device-item {
    padding: 14px 12px;
    min-height: 56px;
  }

  .device-item-actions {
    gap: 8px;
  }

  .more-btn {
    padding: 8px;
    min-width: 36px;
    min-height: 36px;
  }

  .device-status-icon {
    width: 36px;
    height: 36px;
  }

  .el-button {
    min-height: 36px;
  }
}

/* ========== 响应式：矮屏幕高度 ========== */
@media (max-height: 700px) {
  .device-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 6px;
    padding: 6px;
  }

  .device-card {
    padding: 10px;
  }

  .device-card-header {
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
