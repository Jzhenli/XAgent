<template>
  <el-dialog
    :model-value="props.visible"
    :title="t('devices.deviceDiscovery')"
    :width="dialogWidth"
    class="x-dialog"
    align-center
    :close-on-click-modal="false"
    @close="close"
  >
    <!-- 步骤条 -->
    <div class="steps-compact mb-3">
      <div
        class="step-item"
        :class="{ active: currentStep === 0, completed: currentStep > 0 }"
      >
        <div class="step-circle">1</div>
        <div class="step-text">{{ t("devices.discoveryStep1") }}</div>
      </div>
      <div class="step-line" :class="{ active: currentStep >= 1 }"></div>
      <div
        class="step-item"
        :class="{ active: currentStep === 1, completed: currentStep > 1 }"
      >
        <div class="step-circle">2</div>
        <div class="step-text">{{ t("devices.discoveryStep2") }}</div>
      </div>
      <div class="step-line" :class="{ active: currentStep >= 2 }"></div>
      <div class="step-item" :class="{ active: currentStep === 2 }">
        <div class="step-circle">3</div>
        <div class="step-text">{{ t("devices.discoveryStep3") }}</div>
      </div>
    </div>

    <!-- 步骤 0: 配置参数 -->
    <div v-show="currentStep === 0" class="step-content">
      <el-card shadow="never" class="search-config-card">
        <template #header>
          <div class="card-header">
            <span class="header-title">{{
              t("devices.discoverySearchConfig")
            }}</span>
          </div>
        </template>

        <el-form label-width="100px">
          <el-form-item :label="t('devices.discoverySelectNic')">
            <el-select
              v-model="selectedInterfaceIp"
              :placeholder="t('devices.discoverySelectNicPlaceholder')"
              clearable
              class="w-full"
            >
              <el-option
                v-for="nic in networkInterfaces"
                :key="nic.ip_address"
                :label="`${nic.name} (${nic.ip_address})`"
                :value="nic.ip_address"
              />
            </el-select>
            <div class="form-tip">{{ t("devices.discoveryNicTip") }}</div>
          </el-form-item>

          <el-form-item :label="t('devices.discoveryNetworkRange')">
            <el-input
              v-model="networkRange"
              :placeholder="t('devices.discoveryNetworkRangePlaceholder')"
              clearable
            />
          </el-form-item>

          <el-form-item :label="t('devices.discoveryDeviceIdRange')">
            <el-row :gutter="8">
              <el-col :span="12">
                <el-input-number
                  v-model="deviceIdRangeMin"
                  :placeholder="t('devices.discoveryMinValue')"
                  :min="0"
                  clearable
                  class="w-full"
                  controls-position="right"
                />
                <div class="form-tip">{{ t("devices.discoveryMinId") }}</div>
              </el-col>
              <el-col :span="12">
                <el-input-number
                  v-model="deviceIdRangeMax"
                  :placeholder="t('devices.discoveryMaxValue')"
                  :min="0"
                  clearable
                  class="w-full"
                  controls-position="right"
                />
                <div class="form-tip">{{ t("devices.discoveryMaxId") }}</div>
              </el-col>
            </el-row>
            <div class="form-tip">
              {{ t("devices.discoveryDeviceIdRangeTip") }}
            </div>
          </el-form-item>

          <el-form-item :label="t('devices.discoveryTimeout')">
            <el-input-number
              v-model="timeout"
              :min="0.1"
              :max="30"
              :step="0.5"
              :precision="1"
              controls-position="right"
            />
            <span class="unit-text">{{ t("devices.discoverySeconds") }}</span>
            <div class="form-tip inline">
              {{ t("devices.discoveryTimeoutTip") }}
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 步骤 1: 搜索中 -->
    <div v-show="currentStep === 1" class="step-content">
      <el-card shadow="never" class="searching-card">
        <div class="searching-animation">
          <el-icon class="searching-icon" :size="48">
            <Search />
          </el-icon>
          <div class="searching-text">
            <h3>{{ t("devices.discoverySearching") }}</h3>
            <p class="sub-text">{{ t("devices.discoverySearchingTip") }}</p>
            <p class="timeout-text">
              {{ t("devices.discoveryExpectedTime", { timeout }) }}
            </p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 步骤 2: 搜索结果 -->
    <div v-show="currentStep === 2" class="step-content">
      <!-- 设备列表 -->
      <el-card shadow="never" class="search-result-card">
        <template #header>
          <div class="card-header">
            <div class="header-left">
              <span class="header-title">{{
                t("devices.discoveryDeviceList")
              }}</span>
              <el-tag type="success"
                >{{ discoveredDevices.length }}
                {{ t("devices.discoveryFound") }}</el-tag
              >
              <el-tag type="primary"
                >{{ selectedCount }}
                {{ t("devices.discoverySelected") }}</el-tag
              >
            </div>
            <el-button
              type="primary"
              :icon="RefreshRight"
              @click="restartDiscovery"
            >
              {{ t("devices.discoveryResearch") }}
            </el-button>
          </div>
        </template>

        <!-- 空状态 -->
        <el-empty
          v-if="discoveredDevices.length === 0"
          :description="t('devices.discoveryNoDevices')"
          :image-size="80"
        >
          <el-button type="primary" @click="restartDiscovery">
            {{ t("devices.discoveryAdjustAndRetry") }}
          </el-button>
        </el-empty>

        <!-- 设备表格 -->
        <el-table
          v-else
          ref="tableRef"
          :data="discoveredDevices"
          @selection-change="updateSelection"
          max-height="360"
        >
          <el-table-column type="selection" width="48" />
          <el-table-column
            prop="device_id"
            :label="t('devices.discoveryDeviceId')"
            width="80"
          />
          <el-table-column :label="t('devices.discoveryAddress')" width="150">
            <template #default="{ row }">
              {{ row.address }}:{{ row.port }}
            </template>
          </el-table-column>
          <el-table-column
            prop="device_name"
            :label="t('devices.discoveryDeviceName')"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="vendor_name"
            :label="t('devices.discoveryVendor')"
            min-width="100"
            show-overflow-tooltip
          />
          <el-table-column
            prop="model_name"
            :label="t('devices.discoveryModel')"
            min-width="100"
            show-overflow-tooltip
          />

          <!-- 操作列 -->
          <el-table-column
            :label="t('common.actions')"
            width="90"
            fixed="right"
          >
            <template #default="{ row }">
              <div v-if="!isExistingDevice(row)" class="operation-icons">
                <el-tooltip
                  :content="t('devices.discoveryQuickAdd')"
                  placement="top"
                >
                  <span class="icon-action">
                    <el-icon
                      v-if="isAddingDevice(row)"
                      class="is-loading icon-loading-primary"
                      :size="24"
                    >
                      <Loading />
                    </el-icon>
                    <XIcon
                      v-else
                      name="add"
                      :size="24"
                      type="mono-line"
                      :color="{ normal: 'var(--color-primary)' }"
                      @click="addSingleDevice(row)"
                    />
                  </span>
                </el-tooltip>
                <el-tooltip
                  :content="t('devices.discoveryCustomizeAdd')"
                  placement="top"
                >
                  <XIcon
                    name="edit"
                    :size="24"
                    type="mono-line"
                    :color="{ normal: 'var(--el-color-warning)' }"
                    class="ml-2"
                    @click="customizeDevice(row)"
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="discoveredDevices.length > 0" class="table-footer">
          <el-checkbox
            v-model="selectAll"
            @change="toggleSelectAll"
            :indeterminate="
              selectedCount > 0 && selectedCount < discoveredDevices.length
            "
          >
            {{ t("devices.discoverySelectAll") }}
          </el-checkbox>
          <span class="selection-count"
            >
            {{ selectedCount }}/{{ discoveredDevices.length }}
            {{ t("devices.discoverySelected") }}</span
          >
        </div>
      </el-card>
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <!-- 步骤 0: 配置 -->
      <template v-if="currentStep === 0">
        <el-button @click="close">{{ t("common.cancel") }}</el-button>
        <el-button
          type="primary"
          :icon="Search"
          :loading="searching"
          @click="startDiscovery"
        >
          {{ t("devices.discoveryStart") }}
        </el-button>
      </template>

      <!-- 步骤 1: 搜索中 -->
      <template v-else-if="currentStep === 1">
        <el-button @click="close" :disabled="searching">{{
          t("common.cancel")
        }}</el-button>
        <el-button type="primary" :loading="true"
          >{{ t("devices.discoverySearching") }}...</el-button
        >
      </template>

      <!-- 步骤 2: 结果 -->
      <template v-else-if="currentStep === 2">
        <el-button @click="close">{{ t("common.close") }}</el-button>
        <el-button
          type="primary"
          :icon="CircleCheck"
          :loading="batchAdding"
          @click="batchAdd"
          :disabled="discoveredDevices.length === 0"
        >
          {{ t("devices.discoveryBatchAdd", { count: selectedCount }) }}
        </el-button>
      </template>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, RefreshRight, CircleCheck, Loading } from "@element-plus/icons-vue";
import XIcon from "@/icon/index.vue";
import { deviceApi } from "@/api/devices";
import type {
  DiscoveredDeviceResponse,
  DeviceConfig,
  DiscoverDevicesRequest,
  NetworkInterfaceResponse,
} from "@/api/types";

const { t } = useI18n();

interface Props {
  visible: boolean;
  existingDevices?: DeviceConfig[];
}

interface Emits {
  (e: "close"): void;
  (e: "success"): void;
  (e: "quickAdd", device: DiscoveredDeviceResponse): void;
  (e: "customize", device: DiscoveredDeviceResponse): void;
}

const props = withDefaults(defineProps<Props>(), {
  existingDevices: () => [],
});
const emit = defineEmits<Emits>();

/** 步骤索引：0 配置 / 1 搜索中 / 2 搜索结果 */
const currentStep = ref(0);

/** 对话框最小宽度映射（按屏幕宽度自适应） */
const DIALOG_WIDTH_MAP = [
  { max: 768, width: "550px" },
  { max: 1024, width: "600px" },
  { max: 1440, width: "650px" },
  { max: Infinity, width: "900px" },
];

const dialogWidth = computed(() => {
  const screenWidth = window.innerWidth;
  return (
    DIALOG_WIDTH_MAP.find((item) => screenWidth < item.max)?.width ?? "700px"
  );
});

/** 网卡列表与当前选中的网卡 IP */
const networkInterfaces = ref<NetworkInterfaceResponse[]>([]);
const selectedInterfaceIp = ref<string>("");

/** 发现参数 */
const networkRange = ref("");
const deviceIdRangeMin = ref<number | null>(null);
const deviceIdRangeMax = ref<number | null>(null);
const timeout = ref(5.0);

/** 发现结果与选择状态 */
const searching = ref(false);
const discoveredDevices = ref<DiscoveredDeviceResponse[]>([]);
const selectedDevices = ref<DiscoveredDeviceResponse[]>([]);
const selectAll = ref(false);

interface TableInstance {
  toggleRowSelection: (
    row: DiscoveredDeviceResponse,
    selected?: boolean,
  ) => void;
  toggleAllSelection: () => void;
  clearSelection: () => void;
}

const tableRef = ref<TableInstance>();

/** 单个设备快速添加的 loading 状态（按 device_id） */
const addingDeviceIds = ref<Record<number, boolean>>({});

/** 批量添加的 loading 状态 */
const batchAdding = ref(false);

const selectedCount = computed(() => selectedDevices.value.length);

function isAddingDevice(device: DiscoveredDeviceResponse): boolean {
  return !!addingDeviceIds.value[device.device_id];
}

/**
 * 构建 BACnet 设备配置，复用于单个添加和批量添加。
 */
function buildDeviceConfig(device: DiscoveredDeviceResponse): DeviceConfig {
  return {
    asset: `bacnet_${device.device_id}`,
    name: device.device_name || `BACnet Device ${device.device_id}`,
    description: `${device.vendor_name || "Unknown"} - ${device.model_name || "Unknown"}`,
    enabled: true,
    plugin: {
      name: "bacnet",
      config: {
        host: device.address,
        port: device.port,
        device_id: device.device_id,
        timeout: 5,
        interval: 1,
      },
    },
    points: [],
  };
}

/**
 * 从当前表单值构建设备发现请求体。
 */
function buildDiscoveryRequest(): DiscoverDevicesRequest {
  const request: DiscoverDevicesRequest = {
    timeout: timeout.value,
  };

  if (networkRange.value) {
    request.network_range = networkRange.value;
  }

  if (deviceIdRangeMin.value !== null && deviceIdRangeMax.value !== null) {
    request.device_id_range = [deviceIdRangeMin.value, deviceIdRangeMax.value];
  }

  if (selectedInterfaceIp.value) {
    request.interface_ip = selectedInterfaceIp.value;
  }

  return request;
}

/**
 * 等待剩余时间，确保搜索动画至少显示指定时长。
 */
async function ensureMinDisplayTime(startTime: number, minDisplayTime: number) {
  const elapsed = Date.now() - startTime;
  if (elapsed < minDisplayTime) {
    await new Promise((resolve) =>
      setTimeout(resolve, minDisplayTime - elapsed),
    );
  }
}

/**
 * 提取错误详情，优先使用服务端返回的 detail。
 */
function extractErrorDetail(error: any): string {
  return (
    error?.response?.data?.detail || error?.message || t("common.unknownError")
  );
}

/** 按 BACnet 地址、端口、设备 ID 查找已存在的设备配置 */
function findExistingDevice(
  device: DiscoveredDeviceResponse,
): DeviceConfig | undefined {
  return props.existingDevices.find((existing) => {
    if (existing.plugin?.name !== "bacnet") return false;
    const config = existing.plugin.config;
    return (
      String(config.host) === device.address &&
      Number(config.port) === device.port &&
      Number(config.device_id) === device.device_id
    );
  });
}

/** 判断设备是否已存在于设备列表中 */
function isExistingDevice(device: DiscoveredDeviceResponse): boolean {
  return !!findExistingDevice(device);
}

/** 同步表格默认选中状态：已添加设备默认勾选 */
async function syncTableSelection() {
  await nextTick();
  const existingRows = discoveredDevices.value.filter(isExistingDevice);
  existingRows.forEach((row) => {
    tableRef.value?.toggleRowSelection(row, true);
  });
}

/** 全选/取消全选 */
function toggleSelectAll(val: boolean) {
  if (val) {
    tableRef.value?.toggleAllSelection();
  } else {
    tableRef.value?.clearSelection();
  }
}

/** 表格多选状态变化 */
const updateSelection = (selection: DiscoveredDeviceResponse[]) => {
  selectedDevices.value = selection;
  selectAll.value = selection.length === discoveredDevices.value.length;
};

/** 开始设备发现 */
const startDiscovery = async () => {
  currentStep.value = 1;
  searching.value = true;
  discoveredDevices.value = [];
  selectedDevices.value = [];

  const startTime = Date.now();
  const MIN_DISPLAY_TIME = 1500;

  try {
    const response = await deviceApi.discoverDevices(buildDiscoveryRequest());
    await ensureMinDisplayTime(startTime, MIN_DISPLAY_TIME);

    if (!response.success) {
      ElMessage.error(t("devices.discoveryFailed"));
      currentStep.value = 0;
      return;
    }

    discoveredDevices.value = response.devices;
    currentStep.value = 2;
    await syncTableSelection();

    if (response.total === 0) {
      ElMessage.warning(t("devices.discoveryNoDevicesFound"));
    } else {
      ElMessage.success(
        t("devices.discoveryFoundDevices", { count: response.total }),
      );
    }
  } catch (error: any) {
    await ensureMinDisplayTime(startTime, MIN_DISPLAY_TIME);
    ElMessage.error(
      t("devices.discoveryFailedWithDetail", {
        detail: extractErrorDetail(error),
      }),
    );
    currentStep.value = 0;
  } finally {
    searching.value = false;
  }
};

/** 快速添加单个设备 */
const addSingleDevice = async (device: DiscoveredDeviceResponse) => {
  if (isAddingDevice(device)) return;
  addingDeviceIds.value[device.device_id] = true;

  try {
    const deviceConfig = buildDeviceConfig(device);
    await deviceApi.create(deviceConfig);

    ElMessage.success(
      t("devices.deviceAddedSuccess", { name: deviceConfig.name }),
    );
    emit("quickAdd", device);

    const selectedIndex = selectedDevices.value.findIndex(
      (d) => d.device_id === device.device_id,
    );
    if (selectedIndex !== -1) {
      selectedDevices.value.splice(selectedIndex, 1);
    }

    const index = discoveredDevices.value.findIndex(
      (d) => d.device_id === device.device_id,
    );
    if (index !== -1) {
      discoveredDevices.value.splice(index, 1);
    }
  } catch (error: any) {
    ElMessage.error(
      t("devices.addDeviceFailed", { detail: extractErrorDetail(error) }),
    );
  } finally {
    addingDeviceIds.value[device.device_id] = false;
  }
};

/** 自定义添加单个设备 */
const customizeDevice = (device: DiscoveredDeviceResponse) => {
  emit("customize", device);
};

/** 批量同步选中的设备：新增选中且未添加的设备，删除未选中的已添加设备 */
const batchAdd = async () => {
  const newDevices = selectedDevices.value.filter((d) => !isExistingDevice(d));
  const unselectedExistingDevices = discoveredDevices.value.filter(
    (d) =>
      isExistingDevice(d) &&
      !selectedDevices.value.some((s) => s.device_id === d.device_id),
  );
  const deleteAssets = unselectedExistingDevices
    .map((d) => findExistingDevice(d)?.asset)
    .filter((asset): asset is string => !!asset);

  if (newDevices.length === 0 && deleteAssets.length === 0) {
    ElMessage.warning(t("devices.pleaseSelectDevices"));
    return;
  }

  try {
    await ElMessageBox.confirm(
      t("devices.batchSyncConfirm", {
        addCount: newDevices.length,
        deleteCount: deleteAssets.length,
      }),
      t("devices.batchAddConfirmTitle"),
      {
        confirmButtonText: t("common.confirm"),
        cancelButtonText: t("common.cancel"),
        type: "info",
        customClass: "x-message-box",
      },
    );
  } catch {
    return;
  }

  batchAdding.value = true;
  try {
    let addSucceeded = 0;
    let addFailed = 0;
    let deleteSucceeded = 0;
    let deleteFailed = 0;

    if (newDevices.length > 0) {
      const devicesToAdd = newDevices.map(buildDeviceConfig);
      const response = await deviceApi.batchCreate(devicesToAdd);
      addSucceeded = response.succeeded;
      addFailed = response.failed;
    }

    if (deleteAssets.length > 0) {
      const deleteResults = await Promise.allSettled(
        deleteAssets.map((asset) => deviceApi.delete(asset)),
      );
      deleteSucceeded = deleteResults.filter(
        (r) => r.status === "fulfilled",
      ).length;
      deleteFailed = deleteResults.filter(
        (r) => r.status === "rejected",
      ).length;
    }

    if (addSucceeded > 0) {
      ElMessage.success(t("devices.batchAddSuccess", { count: addSucceeded }));
    }
    if (deleteSucceeded > 0) {
      ElMessage.success(
        t("devices.batchDeleteSuccess", { count: deleteSucceeded }),
      );
    }

    if (addFailed > 0) {
      ElMessage.warning(
        t("devices.batchAddPartialFailed", { count: addFailed }),
      );
    }
    if (deleteFailed > 0) {
      ElMessage.warning(
        t("devices.batchDeletePartialFailed", { count: deleteFailed }),
      );
    }

    if (addSucceeded > 0 || deleteSucceeded > 0) {
      emit("success");
      close();
    } else {
      ElMessage.error(t("devices.batchAddFailed"));
    }
  } catch (error: any) {
    ElMessage.error(
      t("devices.batchAddFailedWithDetail", {
        detail: extractErrorDetail(error),
      }),
    );
  } finally {
    batchAdding.value = false;
  }
};

/** 关闭弹窗并重置状态 */
const close = () => {
  currentStep.value = 0;
  emit("close");
};

/** 重新搜索：清空结果并回到配置步骤 */
const restartDiscovery = () => {
  currentStep.value = 0;
  discoveredDevices.value = [];
  selectedDevices.value = [];
};

/** 弹窗打开时加载网卡列表并默认选中优先级最高的网卡 */
watch(
  () => props.visible,
  async (visible) => {
    if (!visible) return;

    try {
      networkInterfaces.value = await deviceApi.getNetworkInterfaces();
      if (networkInterfaces.value.length > 0) {
        selectedInterfaceIp.value = networkInterfaces.value[0].ip_address;
      } else {
        selectedInterfaceIp.value = "";
        ElMessage.warning(t("devices.noNetworkInterface"));
      }
    } catch (error: any) {
      ElMessage.error(t("devices.getNetworkInterfacesFailed"));
    }
  },
);
</script>

<style>
/* 引入 Devices 模块通用弹框样式（需 unscoped，弹框内容 teleport 到 body） */
@import "./DialogCommon.css";
</style>

<style scoped>
/* ========== 通用间距工具类 ========== */
.w-full {
  width: 100%;
}

.mb-3 {
  margin-bottom: 16px;
}

.ml-2 {
  margin-left: 12px;
}

/* ========== 卡片容器与头部 ========== */
:deep(.el-card) {
  border-radius: 12px;
}

.search-config-card {
  background-color: rgba(255, 255, 255, 0.07);
}

.search-result-card {
  background-color: rgba(255, 255, 255, 0.07);
  min-height: 460px;
}

.search-result-card :deep(.el-table),
.search-result-card :deep(.el-table__expanded-cell),
.search-result-card :deep(.el-table th),
.search-result-card :deep(.el-table tr),
.search-result-card :deep(.el-table td) {
  background-color: transparent;
}

.search-result-card :deep(.el-table__body tr:hover > td.el-table__cell) {
  background-color: rgba(255, 255, 255, 0.1);
}

.search-result-card :deep(.el-checkbox__inner) {
  background-color: var(--bg-card);
  border-color: var(--border-base);
}

.search-result-card :deep(.el-checkbox__inner:hover),
.search-result-card :deep(.el-checkbox:hover .el-checkbox__inner),
.search-result-card :deep(.el-table__body tr:hover .el-checkbox__inner) {
  border-color: var(--color-primary);
}

.search-result-card :deep(.el-checkbox__input.is-checked .el-checkbox__inner),
.search-result-card :deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.search-result-card :deep(.el-checkbox__input.is-focus .el-checkbox__inner) {
  border-color: var(--color-primary);
}

.search-result-card :deep(.el-table) {
  max-height: 360px !important;
}

@media (max-width: 767px) {
  .search-result-card :deep(.el-table) {
    max-height: 260px !important;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .search-result-card :deep(.el-table) {
    max-height: 300px !important;
  }
}

@media (min-width: 1024px) and (max-width: 1439px) {
  .search-result-card :deep(.el-table) {
    max-height: 340px !important;
  }
}

@media (min-width: 1440px) {
  .search-result-card :deep(.el-table) {
    max-height: 380px !important;
  }
}

:deep(.el-card__header) {
  padding: 16px 20px;
}

:deep(.el-card__body) {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.header-left .el-tag {
  font-size: 13px;
}

/* ========== 操作按钮 / 单位文本 ========== */
.operation-icons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}

.icon-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
}

.icon-loading-primary {
  color: var(--color-primary);
}

.unit-text {
  margin-left: 12px;
  color: var(--text-regular);
  font-size: 14px;
}

/* ========== 表单提示文本 ========== */
.form-tip {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-top: 4px;
}

.form-tip.inline {
  display: inline;
  margin-top: 0;
  margin-left: 12px;
}

/* ========== 步骤条 ========== */
.steps-compact {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0 16px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--border-base);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
}

.step-item.active .step-circle {
  background: var(--color-primary);
  color: white;
}

.step-item.completed .step-circle {
  background: var(--color-success);
  color: white;
}

.step-text {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
  transition: all 0.3s;
}

.step-item.active .step-text {
  color: var(--color-primary);
  font-weight: 600;
}

.step-item.completed .step-text {
  color: var(--color-success);
}

.step-line {
  width: 40px;
  height: 2px;
  background: var(--border-base);
  margin: 0 10px;
  transition: all 0.3s;
}

.step-line.active {
  background: var(--color-primary);
}

/* ========== 步骤内容与搜索动画 ========== */
.step-content {
  min-height: 240px;
}

.searching-card {
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.07);
}

.searching-animation {
  text-align: center;
  padding: 24px 0;
}

.searching-icon {
  animation: pulse 2s ease-in-out infinite;
  color: var(--color-primary);
  margin-bottom: 16px;
}

.searching-text h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
}

.searching-text .sub-text {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: var(--text-regular);
}

.searching-text .timeout-text {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

/* ========== 表单样式 ========== */
.el-form-item {
  margin-bottom: 18px;
}

.el-form-item :deep(.el-form-item__label) {
  font-size: 14px;
  padding-right: 12px;
  line-height: 32px;
}

.el-form-item :deep(.el-form-item__content) {
  line-height: 32px;
}

/* ========== 表格样式 ========== */
.el-table {
  font-size: 14px;
}

.el-table :deep(.el-table__row) {
  height: 44px;
}

.el-table th {
  font-size: 14px;
  font-weight: 600;
}

.el-table td {
  padding: 8px 0;
}

/* ========== 表格底部 ========== */
.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 4px;
  border-top: 1px solid var(--border-base);
  margin-top: 8px;
}

.selection-count {
  font-size: 13px;
  color: var(--text-secondary);
}

/* ========== 空状态样式调整 ========== */
.el-empty {
  padding: 20px 0;
}

:deep(.el-empty__description p) {
  font-size: 14px;
  color: var(--text-secondary);
}

/* ========== 响应式适配 ========== */
@media (max-width: 767px) {
  .el-table {
    max-height: 220px !important;
  }

  .step-content {
    min-height: 200px !important;
  }

  .el-form-item {
    margin-bottom: 14px;
  }

  .el-form-item :deep(.el-form-item__label) {
    font-size: 13px;
    padding-right: 8px;
  }

  .step-circle {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }

  .step-text {
    font-size: 12px;
  }

  .step-line {
    width: 24px;
    margin: 0 6px;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .el-table {
    max-height: 260px !important;
  }

  .step-circle {
    width: 26px;
    height: 26px;
    font-size: 13px;
  }

  .step-text {
    font-size: 13px;
  }

  .el-form-item :deep(.el-form-item__label) {
    font-size: 14px;
    padding-right: 10px;
  }
}

@media (min-width: 1024px) and (max-width: 1439px) {
  .el-table {
    max-height: 300px !important;
    font-size: 14px;
  }

  .el-table :deep(.el-table__row) {
    height: 46px;
  }

  .step-circle {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }

  .step-text {
    font-size: 14px;
  }

  .header-title {
    font-size: 15px;
  }

  .el-form-item {
    margin-bottom: 18px;
  }

  .el-form-item :deep(.el-form-item__label) {
    font-size: 14px;
    padding-right: 12px;
  }
}

@media (min-width: 1440px) {
  .el-table {
    max-height: 340px !important;
    font-size: 14px;
  }

  .el-table :deep(.el-table__row) {
    height: 48px;
  }

  .el-table th {
    font-size: 14px;
  }

  .step-circle {
    width: 30px;
    height: 30px;
    font-size: 15px;
  }

  .step-text {
    font-size: 15px;
  }

  .header-title {
    font-size: 16px;
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .el-form-item :deep(.el-form-item__label) {
    font-size: 15px;
    padding-right: 14px;
  }

  .form-tip {
    font-size: 13px;
  }
}
</style>
