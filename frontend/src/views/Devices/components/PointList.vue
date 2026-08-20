<!--
  PointList 组件 - 点位列表展示
  功能：展示指定设备的点位列表，支持查看实时数值、趋势图、写入值等操作
  适用场景：设备详情页的点位管理区域
-->
<template>
  <!-- 空状态：未选择设备时显示提示 -->
  <div v-if="!selectedAsset" class="empty-state">
    <el-icon :size="48"><TrendCharts /></el-icon>
    <p>
      {{
        isCompact
          ? t("devices.pleaseSelectDevice")
          : t("devices.selectDeviceToViewPoints")
      }}
    </p>
    <el-button v-if="isCompact" type="primary" @click="emit('back')">{{
      t("devices.returnToDeviceList")
    }}</el-button>
  </div>

  <!-- 点位列表主体 -->
  <div v-else class="point-list">
    <!-- 面板头部：设备名称 + 操作按钮 -->
    <div class="panel-header">
      <div class="panel-header-left">
        <!-- 设备名称标题 -->
        <span class="panel-title">
          <template v-if="!isCompact">{{ t("devices.pointList") }}</template>
          {{ deviceName }}
        </span>
        <!-- 紧凑模式下显示点位数量徽标 -->
        <span v-if="isCompact" class="point-count">{{ points.length }}</span>
      </div>
      <!-- 操作按钮组：新增点位 / 发现点位 / 更多操作 -->
      <div class="panel-actions">
        <div
          v-if="showAddBtn"
          class="action-btn btn-primary"
          @click="emit('add')"
        >
          <el-icon :size="14"><Plus /></el-icon>
          {{ t("devices.addPoint") }}
        </div>
        <div
          v-if="showDiscoverBtn"
          class="action-btn success"
          @click="emit('discover')"
        >
          <el-icon :size="14"><Search /></el-icon>
          {{ t("devices.discoverPoints") }}
        </div>
        <el-dropdown
          trigger="click"
          popper-class="point-dropdown-popper"
          :teleported="false"
          @command="handleDropdownCommand"
        >
          <Icon
            name="menu"
            type="mono-line"
            :size="20"
            :color="{ normal: 'var(--el-text-color-primary)' }"
          />
          <template #dropdown>
            <el-dropdown-menu class="point-more-menu">
              <el-dropdown-item command="export" class="dropdown-item-export">
                <el-icon :size="16"><Download /></el-icon>
                <span>{{ t("devices.exportPoints") }}</span>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="userStore.hasPermission('devices', 'create')"
                command="import"
                class="dropdown-item-import"
              >
                <el-icon :size="16"><Upload /></el-icon>
                <span>{{ t("devices.importPoints") }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 点位数据表格 -->
    <div class="table-wrapper">
      <el-table
        :data="points"
        stripe
        style="width: 100%; flex: 1"
        height="100%"
      >
        <!-- 点位名称列 -->
        <el-table-column prop="name" :label="t('devices.pointName')" />
        <!-- 描述列（仅非紧凑模式显示） -->
        <el-table-column
          v-if="!isCompact"
          prop="description"
          :label="t('common.description')"
        />
        <!-- 实时数值列：显示当前值 + 单位 -->
        <el-table-column :label="t('devices.currentValue')">
          <template #default="{ row }">
            <span
              v-if="row.currentValue !== undefined && row.currentValue !== null"
              class="current-value"
            >
              {{ row.currentValue }}{{ row.unit ? " " + row.unit : "" }}
            </span>
            <span v-else class="text-muted">--</span>
          </template>
        </el-table-column>
        <!-- 数据类型列 -->
        <el-table-column prop="data_type" :label="t('devices.dataType')" />
        <!-- 质量状态列：good(绿) / bad(红) / unknown(黄) -->
        <el-table-column :label="t('devices.quality')">
          <template #default="{ row }">
            <el-tag
              v-if="row.quality"
              size="small"
              :type="
                row.quality === 'good'
                  ? 'success'
                  : row.quality === 'bad'
                    ? 'danger'
                    : 'warning'
              "
            >
              {{
                row.quality === "good"
                  ? t("devices.qualityGood")
                  : row.quality === "bad"
                    ? t("devices.qualityBad")
                    : t("devices.qualityUnknown")
              }}
            </el-tag>
            <span v-else class="text-muted">--</span>
          </template>
        </el-table-column>
        <!-- 最后更新时间列（仅非紧凑模式显示） -->
        <el-table-column v-if="!isCompact" :label="t('devices.lastUpdate')">
          <template #default="{ row }">
            <span v-if="row.lastUpdate">{{ row.lastUpdate }}</span>
            <span v-else class="text-muted">--</span>
          </template>
        </el-table-column>
        <!-- 配置预览列（仅非紧凑模式显示） -->
        <el-table-column v-if="!isCompact" :label="t('common.config')">
          <template #default="{ row }">
            <el-tooltip
              :content="JSON.stringify(row.config, null, 2)"
              placement="top"
              :show-after="300"
              popper-class="config-tooltip"
              teleported
            >
              <span class="config-cell">{{ JSON.stringify(row.config) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 操作列：趋势图 / 写值 / 编辑 / 删除 -->
        <el-table-column :label="t('common.actions')" fixed="right">
          <template #default="{ row }">
            <div class="action-icons">
              <!-- 查看趋势 -->
              <el-tooltip :content="t('devices.pointTrend')" placement="top">
                <Icon
                  name="trend"
                  type="mono-line"
                  :size="24"
                  :color="{ normal: 'var(--el-text-color-primary)' }"
                  @click="emit('viewTrend', selectedAsset!, row.name)"
                />
              </el-tooltip>
              <!-- 写入值（需可写权限 + 写权限） -->
              <el-tooltip
                v-if="
                  row.writable && userStore.hasPermission('devices', 'update')
                "
                :content="t('devices.writeValue')"
                placement="top"
              >
                <Icon
                  name="input"
                  type="mono-line"
                  :size="24"
                  :color="{ normal: 'var(--el-text-color-primary)' }"
                  @click="emit('writeValue', row)"
                />
              </el-tooltip>
              <!-- 编辑点位 -->
              <el-tooltip
                v-if="userStore.hasPermission('devices', 'update')"
                :content="t('common.edit')"
                placement="top"
              >
                <Icon
                  name="edit"
                  type="mono-line"
                  :size="24"
                  :color="{ normal: 'var(--el-text-color-primary)' }"
                  @click="emit('editPoint', row)"
                />
              </el-tooltip>
              <!-- 删除点位 -->
              <el-tooltip
                v-if="userStore.hasPermission('devices', 'delete')"
                :content="t('common.delete')"
                placement="top"
              >
                <Icon
                  name="delete"
                  type="mono-line"
                  :size="24"
                  :color="{ normal: 'var(--el-text-color-primary)' }"
                  @click="emit('deletePoint', row.name)"
                />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/stores/users";
import { usePointStore } from "@/stores/points";
import { Icon } from "@/icon/index";
import {
  TrendCharts,
  Plus,
  Search,
  Upload,
  Download,
} from "@element-plus/icons-vue";
import type { PointDisplay } from "@/stores/points";

/**
 * Props 定义
 * @property selectedAsset - 当前选中的资产ID，为 null 时显示空状态
 * @property deviceName - 设备名称，显示在面板标题中
 * @property points - 点位数据数组
 * @property currentPluginName - 当前插件名称（预留，用于差异化展示）
 * @property isCompact - 是否为紧凑布局模式
 * @property showAddBtn - 是否显示"添加点位"按钮
 * @property showDiscoverBtn - 是否显示"发现点位"按钮
 * @property pollingEnabled - 是否启用读数轮询（紧凑模式下仅面板可见时为 true）
 */
const props = defineProps<{
  selectedAsset: string | null;
  deviceName: string;
  points: PointDisplay[];
  currentPluginName: string;
  isCompact: boolean;
  showAddBtn: boolean;
  showDiscoverBtn: boolean;
  pollingEnabled: boolean;
}>();

/**
 * Emits 事件定义
 * @event back - 返回上一级（设备列表）
 * @event add - 新增点位
 * @event discover - 发现点位
 * @event viewTrend - 查看点位趋势图
 * @event writeValue - 写入点位值
 * @event editPoint - 编辑点位
 * @event deletePoint - 删除点位
 */
const emit = defineEmits<{
  (e: "back"): void;
  (e: "add"): void;
  (e: "discover"): void;
  (e: "viewTrend", asset: string, pointName: string): void;
  (e: "writeValue", point: PointDisplay): void;
  (e: "editPoint", point: PointDisplay): void;
  (e: "deletePoint", pointName: string): void;
  (e: "import"): void;
  (e: "export"): void;
}>();

const { t } = useI18n();
const userStore = useUserStore();
const pointStore = usePointStore();

const POLLING_INTERVAL = 5000;
let pollingTimer: ReturnType<typeof setTimeout> | null = null;
/** 轮询会话令牌：每次启停递增，使进行中的旧请求链失效，防止切设备后双链并行 */
let pollingSession = 0;

/**
 * 启动周期性读数轮询
 * 采用 setTimeout 自调度链：上一次请求返回后才排下一次，
 * 避免慢接口下 setInterval 固定触发导致的请求堆叠与乱序覆盖
 */
const startPolling = (asset: string) => {
  stopPolling();
  const session = ++pollingSession;
  const tick = async () => {
    await pointStore.refreshDeviceReadings(asset);
    // 会话已失效（已停止或已被新设备替换），终止本链
    if (session !== pollingSession) return;
    pollingTimer = setTimeout(tick, POLLING_INTERVAL);
  };
  pollingTimer = setTimeout(tick, POLLING_INTERVAL);
};

const stopPolling = () => {
  pollingSession++;
  if (pollingTimer !== null) {
    clearTimeout(pollingTimer);
    pollingTimer = null;
  }
};

watch(
  () => [props.selectedAsset, props.pollingEnabled] as const,
  ([newAsset, enabled]) => {
    if (newAsset && enabled) {
      startPolling(newAsset);
    } else {
      stopPolling();
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  stopPolling();
});

const handleDropdownCommand = (cmd: string) => {
  if (cmd === "import") {
    emit("import");
  } else if (cmd === "export") {
    emit("export");
  }
};
</script>

<style scoped>
/* 点位列表容器：纵向弹性布局 */
.point-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  border-radius: 16px;
  box-shadow: var(--el-box-shadow);
  border: 1px solid var(--border-base);
}

/* 空状态容器：未选择设备时显示 */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  box-shadow: var(--el-box-shadow);
  border: 1px solid var(--border-base);
  color: var(--text-tertiary);
}

.empty-state p {
  margin-top: 16px;
  font-size: 14px;
}

/* 面板头部：标题 + 操作按钮 */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
}

.panel-header-left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

/* 操作按钮组 */
.panel-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 表格外层容器 */
.table-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 12px 12px 12px;
  overflow: hidden;
  min-height: 0;
}

/* ========== 操作按钮（div 实现） ========== */
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
  line-height: 1;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
}

.action-btn.btn-primary {
  color: #fff;
  background: rgba(102, 102, 255, 1);
}

.action-btn.success {
  color: #fff;
  background: var(--color-success);
}

/* 操作图标组 */
.action-icons {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 配置单元格：截断显示 */
.config-cell {
  font-size: 12px;
  color: var(--text-secondary);
  word-break: break-all;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}

.text-muted {
  color: var(--text-tertiary);
}

/* 当前值样式：高亮显示 */
.current-value {
  font-weight: 600;
  color: var(--color-primary);
}

/* 点位数量徽标 */
.point-count {
  font-size: 12px;
  padding: 2px 8px;
  background: var(--bg-hover);
  color: var(--text-regular);
  border-radius: 10px;
  margin: 0 8px;
}

/* ========== el-table 样式覆盖（透明背景） ========== */
/*
  Element Plus 在 .el-table 元素上自身定义了 --el-table-bg-color 等变量，
  且全局 element-theme.css 对 --el-fill-color-blank 使用了 !important，
  导致在父容器 .point-list 上修改变量无法穿透到 .el-table。
  因此必须直接在 .el-table 元素上重写这些 CSS 变量。
*/
.point-list :deep(.el-table) {
  --el-table-bg-color: transparent !important;
  --el-table-tr-bg-color: transparent !important;
  --el-table-header-bg-color: transparent !important;
  --el-table-row-hover-bg-color: var(--color-primary-light) !important;
}

.point-list :deep(.el-table),
.point-list :deep(.el-table__inner-wrapper),
.point-list :deep(.el-table__body-wrapper),
.point-list :deep(.el-table__header-wrapper),
.point-list :deep(.el-table__footer-wrapper),
.point-list :deep(.el-table__empty-block),
.point-list :deep(.el-table__fixed),
.point-list :deep(.el-table__fixed-right),
.point-list :deep(.el-table__fixed-left),
.point-list :deep(.el-table__fixed-right-patch),
.point-list :deep(.el-table th.el-table__cell),
.point-list :deep(.el-table td.el-table__cell) {
  background: transparent !important;
}

.point-list :deep(.el-table th.el-table__cell) {
  color: var(--text-regular);
  font-weight: 600;
  border-bottom: 1px solid var(--border-light) !important;
}

.point-list :deep(.el-table td.el-table__cell) {
  border-bottom: 1px solid var(--border-lighter) !important;
  color: var(--text-primary);
}

/* 斑马纹行：交替半透明背景 */
.point-list
  :deep(
    .el-table--striped
      .el-table__body
      tr.el-table__row--striped
      td.el-table__cell
  ) {
  background: var(--bg-card-s) !important;
}

/* 鼠标悬停行高亮 */
.point-list :deep(.el-table__body tr:hover > td.el-table__cell),
.point-list :deep(.el-table__fixed-body-wrapper tr:hover > td.el-table__cell) {
  background: var(--color-primary-light) !important;
}

/* ========== el-tag 样式优化 ========== */
/* 所有标签：去除边框，字体颜色与其他列保持一致，自动适配深浅色主题 */
.point-list :deep(.el-tag) {
  border-color: transparent !important;
  color: rgba(255, 255, 255, 1) !important;
}

/* 默认标签（无类型）：中性背景 */
.point-list
  :deep(
    .el-tag:not(.el-tag--success):not(.el-tag--danger):not(
        .el-tag--warning
      ):not(.el-tag--info)
  ) {
  background: var(--bg-hover) !important;
}

/* 有类型标签：纯色背景，使用主题变量自动适配深浅色 */
.point-list :deep(.el-tag--success) {
  background: var(--color-success-light) !important;
}

.point-list :deep(.el-tag--danger) {
  background: var(--color-danger-light) !important;
}

.point-list :deep(.el-tag--warning) {
  background: var(--color-warning-light) !important;
}

.point-list :deep(.el-tag--info) {
  background: var(--color-info-light) !important;
}

/* ========== el-button 样式优化 ========== */
.point-list :deep(.el-button.is-link) {
  color: var(--color-primary) !important;
}

.point-list :deep(.el-button.is-link:hover) {
  color: var(--color-primary-hover) !important;
  background: var(--color-primary-light) !important;
}

/* ========== 下拉菜单样式 ========== */
:deep(.point-dropdown-popper) {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

:deep(.point-more-menu) {
  padding: 8px;
  border-radius: 12px;
  min-width: 120px;
  background: var(--bg-modal, #fff) !important;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.12),
    0 2px 6px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(12px);
  animation: pointDropdownFadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes pointDropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

:deep(.point-more-menu .el-dropdown-menu__item) {
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

:deep(.point-more-menu .el-dropdown-menu__item .el-icon) {
  transition: transform 0.2s ease;
}

:deep(.point-more-menu .el-dropdown-menu__item:hover),
:deep(.point-more-menu .el-dropdown-menu__item:focus),
:deep(.point-more-menu .el-dropdown-menu__item:active) {
  background: rgba(102, 102, 255, 0.1) !important;
  color: rgba(102, 102, 255, 1) !important;
  transform: translateX(2px);
}

/* ========== 响应式：平板/小屏 ========== */
@media (max-width: 1024px) {
  .panel-header {
    padding: 8px 12px;
  }
}

/* ========== 响应式：矮屏（如笔记本） ========== */
@media (max-height: 700px) {
  .panel-header {
    padding: 6px 10px;
    min-height: 36px;
  }

  .panel-title {
    font-size: 14px;
  }
}
</style>

<!-- 非 scoped 样式：用于 teleported tooltip 的全局样式 -->
<style>
.config-tooltip {
  max-width: 420px !important;
  white-space: pre-wrap !important;
  word-break: break-all !important;
  max-height: 320px !important;
  overflow-y: auto !important;
  font-family: "Consolas", "Monaco", "Courier New", monospace !important;
  font-size: 12px !important;
  line-height: 1.6 !important;
}
</style>
