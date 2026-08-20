<template>
  <div class="devices-page">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <!-- 搜索框 -->
        <el-input
          v-model="searchQuery"
          :placeholder="t('devices.searchPlaceholder')"
          :prefix-icon="Search"
          clearable
          class="toolbar-search"
        />
        <!-- 状态过滤器 -->
        <el-select
          v-model="statusFilter"
          :placeholder="t('devices.statusFilter')"
          clearable
          class="scada-select"
          popper-class="scada-select-dropdown"
        >
          <el-option :label="t('common.all')" value="" />
          <el-option :label="t('common.online')" value="online" />
          <el-option :label="t('common.offline')" value="offline" />
        </el-select>
      </div>
      <div class="toolbar-right">
        <!-- 统计信息 -->
         <span class="stat-item stat-online">
          <span class="stat-value">{{ deviceStore.onlineDevices }}</span>
          <span class="stat-label">{{ t("common.online") }}</span>
        </span>
        <span class="stat-item">
          <span class="stat-value">{{ deviceStore.totalDevices }}</span>
          <span class="stat-label">{{ t("devices.totalDevices") }}</span>
        </span>
      </div>
    </div>

    <!-- 错误提示 -->
    <el-alert
      v-if="deviceStore.error"
      :title="deviceStore.error"
      type="error"
      show-icon
      closable
      style="margin-bottom: 16px"
    />

    <!-- 紧凑模式 (移动端/平板) -->
    <div v-if="isCompactMode" class="main-content compact-mode">
      <!-- 选项卡切换 -->
      <div class="compact-tabs">
        <div
          class="compact-tab"
          :class="{ active: activeTab === 'devices' }"
          @click="activeTab = 'devices'"
        >
          {{ t("devices.deviceList") }}
          <span v-if="selectedDeviceAsset" class="tab-badge">{{
            deviceStore.getDeviceByAsset(selectedDeviceAsset)?.name
          }}</span>
        </div>
        <div
          class="compact-tab"
          :class="{
            active: activeTab === 'points',
            disabled: !selectedDeviceAsset,
          }"
          @click="selectedDeviceAsset && (activeTab = 'points')"
        >
          {{ t("devices.pointList") }}
          <span v-if="selectedDeviceAsset" class="tab-count">{{
            getDevicePoints(selectedDeviceAsset).length
          }}</span>
        </div>
      </div>

      <!-- 设备面板 -->
      <div v-show="activeTab === 'devices'" class="compact-panel device-panel">
        <DeviceList
          v-bind="deviceListProps"
          :is-compact="true"
          @select="handleViewPoints"
          @toggle="handleToggleDevice"
          @edit="onEditDevice"
          @delete="onDeleteDevice"
          @reload="handleReloadDevice"
          @add="handleAddDevice"
          @export="handleExportYaml"
          @import="handleImportYaml"
          @refresh="onRefresh"
        />
      </div>

      <!-- 点位面板 -->
      <div v-show="activeTab === 'points'" class="compact-panel points-panel">
        <PointList
          v-bind="pointListProps"
          :is-compact="true"
          @back="handleBackToDevices"
          @add="onAddPoint"
          @discover="showPointDiscoveryDialog = true"
          @viewTrend="handleViewTrend"
          @writeValue="onWritePoint"
          @editPoint="onEditPoint"
          @deletePoint="onDeletePoint"
          @import="handlePointImport"
          @export="handlePointExport"
        />
      </div>
    </div>

    <!-- 正常模式 (桌面端) -->
    <div v-else class="main-content">
      <DeviceList
        v-bind="deviceListProps"
        :is-compact="false"
        @select="handleViewPoints"
        @toggle="handleToggleDevice"
        @edit="onEditDevice"
        @delete="onDeleteDevice"
        @reload="handleReloadDevice"
        @add="handleAddDevice"
        @export="handleExportYaml"
        @import="handleImportYaml"
        @refresh="onRefresh"
      />

      <div class="points-panel-wrapper">
        <PointList
          v-bind="pointListProps"
          :is-compact="false"
          @back="handleBackToDevices"
          @add="onAddPoint"
          @discover="showPointDiscoveryDialog = true"
          @viewTrend="handleViewTrend"
          @writeValue="onWritePoint"
          @editPoint="onEditPoint"
          @deletePoint="onDeletePoint"
          @import="handlePointImport"
          @export="handlePointExport"
        />
      </div>
    </div>

    <!-- 设备表单弹窗 -->
    <DeviceDialog
      v-model="showDeviceDialog"
      :form="deviceForm"
      :is-editing="isEditing"
      :saving="saving"
      :plugin-options="pluginOptions"
      @save="onSaveDevice"
    />

    <!-- 点位表单弹窗 -->
    <PointDialog
      v-model="showPointDialog"
      :form="pointForm"
      :is-editing="isEditingPoint"
      :saving="savingPoint"
      :current-plugin-name="currentDevicePluginName"
      :modbus-data-types="modbusDataTypes"
      :knx-data-types="knxDataTypes"
      :bacnet-data-types="bacnetDataTypes"
      :register-types="registerTypes"
      @save="onSavePoint"
    />

    <!-- 写入值弹窗 -->
    <WriteValueDialog
      v-model="showWriteDialog"
      :form="writeForm"
      :writing="writing"
      @submit="onWriteSubmit"
    />

    <!-- 点位发现弹窗 -->
    <PointDiscovery
      v-if="selectedDeviceAsset"
      :device-asset="selectedDeviceAsset"
      :visible="showPointDiscoveryDialog"
      @close="showPointDiscoveryDialog = false"
      @success="handlePointDiscoverySuccess"
    />

    <!-- 趋势图抽屉 -->
    <el-drawer
      v-model="showTrend"
      :title="t('devices.pointTrend')"
      direction="rtl"
      size="70%"
      :with-header="false"
      class="trend-drawer"
    >
      <PointTrend
        :device-name="selectedPointForTrend?.deviceAsset"
        :point-name="selectedPointForTrend?.pointName"
        @close="handleCloseTrend"
      />
    </el-drawer>

    <!-- 隐藏的文件输入 (用于导入) -->
    <input
      ref="importFileRef"
      type="file"
      accept=".yaml,.yml"
      style="display: none"
      @change="handleImportFileChange"
    />

    <!-- 隐藏的文件输入 (用于点位 Excel 导入) -->
    <input
      ref="pointImportFileRef"
      type="file"
      accept=".xlsx,.xls"
      style="display: none"
      @change="onPointImportFileChange"
    />

    <!-- 设备发现流程组件 -->
    <ProtocolSelectionDialog
      :visible="showProtocolDialog"
      @close="showProtocolDialog = false"
      @selectProtocol="onSelectProtocol"
    />

    <BACnetModeSelectionDialog
      :visible="showBACnetModeDialog"
      @close="showBACnetModeDialog = false"
      @selectMode="onSelectBACnetMode"
    />

    <DeviceDiscovery
      :visible="showDiscoveryDialog"
      :existing-devices="deviceStore.devices"
      @close="showDiscoveryDialog = false"
      @success="handleDeviceDiscoverySuccess"
      @quickAdd="handleQuickAddDevice"
      @customize="handleCustomizeDevice"
    />

    <DeviceConfirmDialog
      :visible="showConfirmDialog"
      :device="selectedDevice"
      @close="showConfirmDialog = false"
      @success="handleDeviceConfirmSuccess"
      @back="handleBackToDiscovery"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useDeviceStore } from "@/stores/devices";
import { usePointStore } from "@/stores/points";
import { useUserStore } from "@/stores/users";
import { useResponsive } from "@/utils/useResponsive";
import {
  Search,
} from "@element-plus/icons-vue";
import PointTrend from "./components/PointTrend.vue";
import PointDiscovery from "./components/PointDiscovery.vue";
import DeviceDiscovery from "./components/DeviceDiscovery.vue";
import ProtocolSelectionDialog from "./components/ProtocolSelectionDialog.vue";
import BACnetModeSelectionDialog from "./components/BACnetModeSelectionDialog.vue";
import DeviceConfirmDialog from "./components/DeviceConfirmDialog.vue";

import { useDeviceManagement } from "./hooks/useDeviceManagement";
import { usePointManagement } from "./hooks/usePointManagement";
import { useDeviceIO } from "./hooks/useDeviceIO";
import { usePointIO } from "./hooks/usePointIO";
import { useDeviceDiscoveryFlow } from "./hooks/useDeviceDiscoveryFlow";

import DeviceList from "./components/DeviceList.vue";
import PointList from "./components/PointList.vue";
import DeviceDialog from "./components/DeviceDialog.vue";
import PointDialog from "./components/PointDialog.vue";
import WriteValueDialog from "./components/WriteValueDialog.vue";

import { createInitialDeviceForm, createInitialPointForm } from "./types";
import type { DeviceFormData, PointFormData, WriteFormData } from "./types";
import type { DeviceListItem } from "@/stores/devices";
import type { PointDisplay } from "@/stores/points";

const { t } = useI18n();
const deviceStore = useDeviceStore();
const pointStore = usePointStore();
const userStore = useUserStore();
const { isTablet, isMobile, width } = useResponsive();

/**
 * 是否为紧凑模式 (移动端/平板)
 */
const isCompactMode = computed(
  () => isTablet.value || isMobile.value || width.value <= 1024,
);

// ==================== 工具栏状态 ====================
const searchQuery = ref("");
const statusFilter = ref("");

// ==================== 设备/点位 状态 ====================
const selectedDeviceAsset = ref<string | null>(null);
const selectedPointForTrend = ref<{
  deviceAsset: string;
  pointName: string;
} | null>(null);
const showTrend = ref(false);
const showPointDiscoveryDialog = ref(false);
const activeTab = ref("devices");

// ==================== 表单数据 ====================
const deviceForm = ref<DeviceFormData>(createInitialDeviceForm());
const pointForm = ref<PointFormData>(createInitialPointForm());
const writeForm = ref<WriteFormData>({
  deviceAsset: "",
  pointName: "",
  pointType: "",
  unit: "",
  currentValue: "",
  value: "",
  boolValue: false,
});

// ==================== Hooks 初始化 ====================

// 设备管理 (Dialog状态、表单操作、CRUD)
const {
  showDeviceDialog,
  deviceFormRef,
  isEditing,
  saving,
  pluginOptions,
  handleToggleDevice,
  handleRefresh,
  handleEditDevice,
  handleSaveDevice,
  handleDeleteDevice,
  handleReloadDevice,
} = useDeviceManagement();

// 设备发现流程 (协议选择、BACnet配置、自动发现)
const {
  showProtocolDialog,
  showBACnetModeDialog,
  showDiscoveryDialog,
  showConfirmDialog,
  selectedDevice,
  handleAddDevice,
  handleSelectProtocol,
  handleSelectBACnetMode,
  handleCustomizeDevice,
  handleQuickAddDevice,
  handleDeviceDiscoverySuccess,
  handleDeviceConfirmSuccess,
  handleBackToDiscovery,
} = useDeviceDiscoveryFlow(showDeviceDialog);

// 点位管理 (Dialog状态、表单操作、CRUD、写入)
const {
  showPointDialog,
  pointFormRef,
  isEditingPoint,
  savingPoint,
  showWriteDialog,
  writing,
  modbusDataTypes,
  knxDataTypes,
  bacnetDataTypes,
  registerTypes,
  currentDevicePluginName,
  handleAddPoint,
  handleEditPoint,
  handleSavePoint,
  handleDeletePoint,
  handleWritePoint,
  handleWriteSubmit,
} = usePointManagement(selectedDeviceAsset);

// 设备导入导出
const {
  importFileRef,
  handleExportYaml,
  handleImportYaml,
  handleImportFileChange,
} = useDeviceIO();

// 点位导入导出 (Excel)
const {
  importFileRef: pointImportFileRef,
  handleExportExcel,
  handleImportExcel,
  handleImportFileChange: handlePointImportFileChange,
} = usePointIO();

// ==================== 计算属性 ====================

/**
 * 过滤后的设备列表 (应用搜索和状态过滤)
 */
const filteredSouthDevices = computed(() => {
  let list = deviceStore.southDevices;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    list = list.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.asset.toLowerCase().includes(query) ||
        d.pluginName.toLowerCase().includes(query),
    );
  }
  if (statusFilter.value === "online") {
    list = list.filter((d) => d.status === "active" && d.enabled);
  } else if (statusFilter.value === "offline") {
    list = list.filter((d) => d.status !== "active" || !d.enabled);
  }
  return list;
});

/**
 * 获取指定设备的点位列表
 */
const getDevicePoints = (asset: string) => {
  return pointStore.getDevicePoints(asset);
};

// ==================== 共用 Props 提取 ====================

/**
 * DeviceList 组件的 Props (避免在模板中重复)
 */
const deviceListProps = computed(() => ({
  devices: filteredSouthDevices.value,
  loading: deviceStore.loading,
  selectedAsset: selectedDeviceAsset.value,
}));

/**
 * PointList 组件的 Props (避免在模板中重复)
 * pollingEnabled：紧凑模式下面板通过 v-show 切换、组件不卸载，
 * 仅在"点位"标签页可见时轮询，避免返回设备列表后轮询空转
 */
const pointListProps = computed(() => ({
  selectedAsset: selectedDeviceAsset.value,
  deviceName:
    deviceStore.getDeviceByAsset(selectedDeviceAsset.value)?.name ||
    selectedDeviceAsset.value ||
    "",
  points: selectedDeviceAsset.value
    ? getDevicePoints(selectedDeviceAsset.value)
    : [],
  currentPluginName: currentDevicePluginName.value,
  showAddBtn: userStore.hasPermission("devices", "create"),
  showDiscoverBtn:
    userStore.hasPermission("devices", "create") &&
    currentDevicePluginName.value === "bacnet",
  pollingEnabled: !isCompactMode.value || activeTab.value === "points",
}));

// ==================== 事件处理 (从子组件到 Hooks 的桥接) ====================

/**
 * 选中设备 (加载点位)
 */
const handleViewPoints = async (asset: string) => {
  selectedDeviceAsset.value = asset;
  activeTab.value = "points";
  await pointStore.fetchDevicePoints(asset);
};

/**
 * 查看点位趋势图
 */
const handleViewTrend = (deviceAsset: string, pointName: string) => {
  selectedPointForTrend.value = { deviceAsset, pointName };
  pointStore.selectPoint(deviceAsset, pointName);
  showTrend.value = true;
};

/**
 * 关闭趋势图
 */
const handleCloseTrend = () => {
  showTrend.value = false;
  selectedPointForTrend.value = null;
  pointStore.clearSelection();
};

/**
 * 点位发现成功回调
 */
const handlePointDiscoverySuccess = async () => {
  showPointDiscoveryDialog.value = false;
  if (selectedDeviceAsset.value) {
    await pointStore.fetchDevicePoints(selectedDeviceAsset.value);
  }
};

// --- 设备相关操作 ---
const onDeleteDevice = (device: DeviceListItem) => {
  handleDeleteDevice(device, () => {
    if (selectedDeviceAsset.value === device.asset) {
      selectedDeviceAsset.value = null;
    }
  });
};

const onSaveDevice = () => {
  handleSaveDevice(deviceForm.value);
};

const onEditDevice = (device: DeviceListItem) => {
  handleEditDevice(device, deviceForm.value);
};

const onRefresh = () => {
  handleRefresh();
};

// --- 设备发现流程 ---
const onSelectProtocol = (protocol: string) => {
  handleSelectProtocol(protocol, deviceForm.value);
};

const onSelectBACnetMode = (mode: "manual" | "discover") => {
  handleSelectBACnetMode(mode, deviceForm.value);
};

// --- 点位相关操作 ---
const onAddPoint = () => {
  handleAddPoint(pointForm.value);
};

const onEditPoint = (point: PointDisplay) => {
  handleEditPoint(point, pointForm.value);
};

const onSavePoint = () => {
  handleSavePoint(pointForm.value);
};

const onDeletePoint = (pointName: string) => {
  handleDeletePoint(pointName);
};

const onWritePoint = (point: PointDisplay) => {
  handleWritePoint(point, writeForm.value);
};

const onWriteSubmit = () => {
  handleWriteSubmit(writeForm.value);
};

// --- 点位导入导出 ---
const handlePointExport = () => {
  if (!selectedDeviceAsset.value) return;
  const deviceName =
    deviceStore.getDeviceByAsset(selectedDeviceAsset.value)?.name ||
    selectedDeviceAsset.value;

  handleExportExcel(selectedDeviceAsset.value, deviceName);
};

const handlePointImport = () => {
  handleImportExcel();
};

const onPointImportFileChange = (e: Event) => {
  if (!selectedDeviceAsset.value) return;
  handlePointImportFileChange(e, selectedDeviceAsset.value);
};

// --- 导航控制 ---
const handleBackToDevices = () => {
  if (isCompactMode.value) {
    activeTab.value = "devices";
  } else {
    selectedDeviceAsset.value = null;
  }
};

// ==================== 初始化 ====================
onMounted(async () => {
  try {
    await Promise.all([
      deviceStore.fetchDevices(),
      deviceStore.fetchConnectionStatus(),
      pointStore.fetchDevicesWithPoints(),
    ]);
  } catch (e: unknown) {
    console.error('[Devices] Failed to initialize:', e);
  }
});
</script>

<style scoped>
.devices-page {
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

.toolbar-left :deep(.scada-select) {
  width: 140px;
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

.tab-count {
  font-size: 12px;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.compact-tab:not(.active) .tab-count {
  background: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
}

.compact-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.device-panel {
  background: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow);
}

.points-panel-wrapper {
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

<style>
/* 趋势图抽屉样式（需 unscoped，抽屉内容 teleport 到 body） */
.trend-drawer .el-drawer {
  /* 抽屉从右侧滑出，左侧边缘需要明显边界 */
  border-left: 1px solid var(--border-base) !important;
  box-shadow:
    -8px 0 24px rgba(0, 0, 0, 0.25),
    -2px 0 6px rgba(0, 0, 0, 0.12) !important;
}

.trend-drawer .el-drawer__body {
  background-color: var(--bg-card) !important;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
