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
      <!-- 紧凑模式下显示返回按钮 -->
      <div v-if="isCompact" class="panel-header-left">
        <el-button link @click="emit('back')">
          <el-icon><ArrowLeft /></el-icon>
          {{ t("devices.returnToDevice") }}
        </el-button>
      </div>
      <!-- 设备名称标题 -->
      <span class="panel-title">
        <template v-if="!isCompact">{{ t("devices.pointList") }}</template>
        {{ deviceName }}
      </span>
      <!-- 紧凑模式下显示点位数量徽标 -->
      <span v-if="isCompact" class="point-count">{{ points.length }}</span>
      <!-- 操作按钮组：新增点位 / 发现点位 -->
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
        <el-table-column
          prop="name"
          :label="t('devices.pointName')"
        />
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
        <el-table-column :label="t('devices.dataType')">
          <template #default="{ row }">
            <el-tag
              size="small"
              :type="getDataTypeTagType(row.data_type)"
            >{{ row.data_type }}</el-tag>
          </template>
        </el-table-column>
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
        <el-table-column
          v-if="!isCompact"
          :label="t('devices.lastUpdate')"
        >
          <template #default="{ row }">
            <span v-if="row.lastUpdate">{{ row.lastUpdate }}</span>
            <span v-else class="text-muted">--</span>
          </template>
        </el-table-column>
        <!-- 配置预览列（仅非紧凑模式显示） -->
        <el-table-column
          v-if="!isCompact"
          :label="t('common.config')"
        >
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
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/stores/users";
import { Icon } from "@/icon/index";
import { TrendCharts, Plus, Search, ArrowLeft } from "@element-plus/icons-vue";
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
 */
const props = defineProps<{
  selectedAsset: string | null;
  deviceName: string;
  points: PointDisplay[];
  currentPluginName: string;
  isCompact: boolean;
  showAddBtn: boolean;
  showDiscoverBtn: boolean;
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
}>();

const { t } = useI18n();
const userStore = useUserStore();

/**
 * 根据数据类型返回对应的 el-tag 类型（用于彩色显示）
 */
function getDataTypeTagType(dataType: string): "" | "success" | "warning" | "danger" | "info" {
  if (!dataType) return "";

  // 整数类型 → 绿色
  if (/^(u?int(16|32|64)?)$/.test(dataType)) return "success";

  // 物理量 / 模拟量 → 绿色
  const physicalTypes = [
    "temperature", "humidity", "voltage", "current", "power", "energy",
    "co2", "brightness", "dimming", "blinds", "percent",
    "analogInput", "analogOutput", "analogValue",
  ];
  if (physicalTypes.includes(dataType)) return "success";

  // 浮点类型 → 黄色
  if (/^float/.test(dataType)) return "warning";

  // 多状态类型 → 黄色
  if (dataType.startsWith("multiState")) return "warning";

  // 布尔 / 二进制 / 开关 → 红色
  const binaryTypes = [
    "bool", "binary", "switch",
    "binaryInput", "binaryOutput", "binaryValue",
  ];
  if (binaryTypes.includes(dataType)) return "danger";

  // 字符串 / 场景 / 颜色 → 蓝色
  const stringLikeTypes = ["string", "scene", "color_rgb"];
  if (stringLikeTypes.includes(dataType)) return "info";

  return "";
}
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
  background: var(--bg-card);
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
/* 默认标签（无类型）：中性灰色 */
.point-list :deep(.el-tag:not(.el-tag--success):not(.el-tag--danger):not(.el-tag--warning):not(.el-tag--info)) {
  background: var(--bg-hover) !important;
  border-color: var(--border-light) !important;
  color: var(--text-regular) !important;
}

/* 有类型标签：使用主题变量，自动适配深浅色 */
.point-list :deep(.el-tag--success) {
  background: var(--color-success-light) !important;
  border-color: var(--color-success) !important;
  color: var(--color-success) !important;
}

.point-list :deep(.el-tag--danger) {
  background: var(--color-danger-light) !important;
  border-color: var(--color-danger) !important;
  color: var(--color-danger) !important;
}

.point-list :deep(.el-tag--warning) {
  background: var(--color-warning-light) !important;
  border-color: var(--color-warning) !important;
  color: var(--color-warning) !important;
}

.point-list :deep(.el-tag--info) {
  background: var(--color-info-light) !important;
  border-color: var(--color-info) !important;
  color: var(--color-info) !important;
}

/* ========== el-button 样式优化 ========== */
.point-list :deep(.el-button.is-link) {
  color: var(--color-primary) !important;
}

.point-list :deep(.el-button.is-link:hover) {
  color: var(--color-primary-hover) !important;
  background: var(--color-primary-light) !important;
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
