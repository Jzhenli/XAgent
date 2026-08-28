<template>
  <div class="point-trend">
    <div class="trend-header">
      <div class="header-left">
        <h3 class="header-title">{{ t("pointTrend.title") }}</h3>
        <span v-if="pointStore.selectedPoint" class="point-info">
          {{ pointStore.selectedDeviceAsset }} /
          {{ pointStore.selectedPoint.name }}
        </span>
        <el-tag v-if="pointStore.historyLoading" type="info" size="small">{{
          t("pointTrend.loading")
        }}</el-tag>
      </div>
      <div class="header-right">
        <div class="select-with-label">
          <span class="select-label">{{ t("pointTrend.timeRange") }}</span>
          <el-select
            v-model="pointStore.trendTimeRange"
            style="width: 100px"
            class="scada-select"
            popper-class="scada-select-dropdown"
          >
            <el-option
              v-for="opt in timeRangeOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </div>
        <el-button @click="loadData" :loading="pointStore.historyLoading">{{
          t("pointTrend.refresh")
        }}</el-button>
        <el-button @click="showConfig = !showConfig">
          <el-icon class="el-icon--left"><Setting /></el-icon>
          {{ t("pointTrend.config") }}
        </el-button>
        <el-button @click="handleDownloadExcel" :disabled="!trendData.length">
          <el-icon class="el-icon--left"><Download /></el-icon>
          {{ t("pointTrend.download") }}
        </el-button>
        <el-button @click="emit('close')" class="close-btn"
          >✕ {{ t("pointTrend.close") }}</el-button
        >
      </div>
    </div>

    <div v-if="showConfig" class="config-panel">
      <el-card shadow="never" class="search-config-card">
        <el-form label-width="120px">
          <el-form-item :label="t('pointTrend.autoRefresh')">
            <el-switch v-model="autoRefresh" />
          </el-form-item>
          <el-form-item :label="t('pointTrend.refreshInterval')">
            <el-input-number
              v-model="refreshInterval"
              :min="5"
              :max="300"
              :disabled="!autoRefresh"
            />
          </el-form-item>
          <el-form-item :label="t('pointTrend.showMinMax')">
            <el-switch v-model="showMinMax" />
          </el-form-item>
          <el-form-item :label="t('pointTrend.showAvgLine')">
            <el-switch v-model="showAvgLine" />
          </el-form-item>
          <el-form-item :label="t('pointTrend.showDataPoints')">
            <el-switch v-model="showDataPoints" />
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <div v-if="pointStore.selectedPoint" class="trend-content">
      <el-card shadow="never" class="search-result-card chart-card">
        <div class="chart-container">
          <v-chart :option="chartOption" class="trend-chart" autoresize />
        </div>
      </el-card>

      <el-card shadow="never" class="search-result-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">{{ t("pointTrend.statistics") }}</span>
          </div>
        </template>
        <div class="statistics-panel">
          <div class="stat-card">
            <span class="stat-label">{{ t("pointTrend.currentValue") }}</span>
            <span class="stat-value current">
              <template v-if="statisticsInfo?.isDigital">
                {{
                  pointStore.selectedPoint.currentValue === true ||
                  pointStore.selectedPoint.currentValue === 1
                    ? t("pointTrend.on")
                    : t("pointTrend.off")
                }}
              </template>
              <template v-else>
                {{ pointStore.selectedPoint.currentValue ?? "--" }}
                {{ pointStore.selectedPoint.unit }}
              </template>
            </span>
          </div>

          <template v-if="statisticsInfo?.isDigital">
            <div class="stat-card">
              <span class="stat-label">{{ t("pointTrend.onCount") }}</span>
              <span class="stat-value on">{{
                statisticsInfo?.onCount ?? 0
              }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">{{ t("pointTrend.offCount") }}</span>
              <span class="stat-value off">{{
                statisticsInfo?.offCount ?? 0
              }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">{{ t("pointTrend.onRate") }}</span>
              <span class="stat-value percentage"
                >{{ statisticsInfo?.onPercentage ?? 0 }}%</span
              >
            </div>
          </template>

          <template v-else>
            <div class="stat-card">
              <span class="stat-label">{{ t("pointTrend.minValue") }}</span>
              <span class="stat-value min">{{
                statisticsInfo?.min ?? "--"
              }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">{{ t("pointTrend.maxValue") }}</span>
              <span class="stat-value max">{{
                statisticsInfo?.max ?? "--"
              }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">{{ t("pointTrend.avgValue") }}</span>
              <span class="stat-value avg">{{
                statisticsInfo?.avg ?? "--"
              }}</span>
            </div>
          </template>

          <div class="stat-card">
            <span class="stat-label">{{ t("pointTrend.dataPoints") }}</span>
            <span class="stat-value">{{ statisticsInfo?.count ?? 0 }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">{{ t("pointTrend.timeRange") }}</span>
            <span class="stat-value time"
              >{{ statisticsInfo?.start ?? "--" }} ~
              {{ statisticsInfo?.end ?? "--" }}</span
            >
          </div>
        </div>
      </el-card>

      <el-card shadow="never" class="search-result-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">{{ t("pointTrend.pointInfo") }}</span>
          </div>
        </template>
        <div class="point-meta">
          <div class="meta-item">
            <span class="meta-label">{{ t("pointTrend.pointType") }}:</span>
            <el-tag size="small">{{
              pointStore.selectedPoint.type === "analog"
                ? t("pointTrend.analog")
                : t("pointTrend.digital")
            }}</el-tag>
          </div>
          <div class="meta-item">
            <span class="meta-label">{{ t("pointTrend.dataQuality") }}:</span>
            <el-tag
              :type="
                pointStore.selectedPoint.quality === 'good'
                  ? 'success'
                  : 'warning'
              "
              size="small"
            >
              {{
                pointStore.selectedPoint.quality === "good"
                  ? t("pointTrend.good")
                  : t("pointTrend.uncertain")
              }}
            </el-tag>
          </div>
          <div class="meta-item">
            <span class="meta-label">{{ t("pointTrend.range") }}:</span>
            <span
              >{{ pointStore.selectedPoint.minValue ?? "--" }} ~
              {{ pointStore.selectedPoint.maxValue ?? "--" }}
              {{ pointStore.selectedPoint.unit }}</span
            >
          </div>
          <div class="meta-item">
            <span class="meta-label">{{ t("pointTrend.trendRecord") }}:</span>
            <el-tag
              :type="
                pointStore.selectedPoint.trend?.enabled ? 'success' : 'info'
              "
              size="small"
            >
              {{
                pointStore.selectedPoint.trend?.enabled
                  ? t("pointTrend.enabled")
                  : t("pointTrend.disabled")
              }}
            </el-tag>
          </div>
        </div>
      </el-card>
    </div>

    <div v-else class="empty-state">
      <span class="empty-icon">📊</span>
      <p>{{ t("pointTrend.selectPointHint") }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { usePointStore } from "@/stores/points";
import { useThemeStore } from "@/stores/theme";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent,
  MarkLineComponent,
  MarkPointComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { Download, Setting } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

/* ========== i18n / ECharts 注册 / Store ========== */
const { t } = useI18n();

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent,
  MarkLineComponent,
  MarkPointComponent,
]);

const pointStore = usePointStore();
const themeStore = useThemeStore();

const props = defineProps<{
  deviceName?: string;
  pointName?: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

/* ========== 常量：时间范围映射 & 图表配色 ========== */
// 时间范围 -> 小时数映射，供历史数据拉取与降级数据生成使用
const HOURS_MAP: Record<string, number> = {
  "1h": 1,
  "6h": 6,
  "24h": 24,
  "7d": 168,
  "30d": 720,
};

// 图表元素配色（硬编码色值，与 ECharts option 配合使用）
const CHART_COLORS = {
  avgLine: "#f39c12",
  upperLimit: "#e74c3c",
  lowerLimit: "#3498db",
  digitalOn: "#27ae60",
  digitalOff: "#e74c3c",
  analogLine: "rgba(102, 102, 255, 1)",
  analogAreaStart: "rgba(102, 102, 255, 0.7)",
  analogAreaEnd: "rgba(102, 102, 255, 0)",
  digitalAreaStart: "rgba(200, 162, 38, 0.7)",
  digitalAreaEnd: "rgba(200, 162, 38, 0)",
} as const;

/* ========== 下拉选项 ========== */
const timeRangeOptions = computed(() => [
  { value: "1h", label: t("dashboard.timeRange1h") },
  { value: "6h", label: t("pointTrend.timeRange6h") },
  { value: "24h", label: t("dashboard.timeRange24h") },
  { value: "7d", label: t("dashboard.timeRange7d") },
  { value: "30d", label: t("pointTrend.timeRange30d") },
]);

/* ========== 配置面板开关 ========== */
const showConfig = ref(false);
const autoRefresh = ref(true);
const refreshInterval = ref(30);
const showMinMax = ref(true);
const showAvgLine = ref(true);
const showDataPoints = ref(false);

/* ========== 主题感知的 splitLine 颜色 ==========
 * 深色主题下使用半透明白色，浅色主题下使用半透明黑色，保证可见性。
 */
const splitLineColor = computed(() =>
  themeStore.theme === "dark"
    ? "rgba(255, 255, 255, 0.20)"
    : "rgba(0, 0, 0, 0.12)",
);

/* ========== 主题感知的 dataZoom 配置 ==========
 * 深色主题下 ECharts 默认的浅色 slider 在深色背景上几乎不可见，
 * 此处为深色主题显式指定配色；浅色主题沿用 ECharts 默认样式不动。
 */
const dataZoomOption = computed(() => {
  const inside = { type: "inside" as const, start: 0, end: 100 };
  const slider = { start: 0, end: 100 };

  if (themeStore.theme !== "dark") {
    return [inside, slider];
  }

  // 深色主题：使用项目主色（紫蓝）作为 filler / handle，配合半透明白色背景
  return [
    inside,
    {
      ...slider,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      fillerColor: "rgba(102, 102, 255, 0.25)",
      borderColor: "rgba(255, 255, 255, 0.10)",
      handleStyle: {
        color: "rgba(102, 102, 255, 0.85)",
        borderColor: "rgba(102, 102, 255, 1)",
      },
      moveHandleStyle: {
        color: "rgba(102, 102, 255, 0.6)",
      },
      textStyle: {
        color: "rgba(255, 255, 255, 0.7)",
      },
      dataBackground: {
        lineStyle: { color: "rgba(255, 255, 255, 0.25)" },
        areaStyle: { color: "rgba(255, 255, 255, 0.08)" },
      },
      selectedDataBackground: {
        lineStyle: { color: "rgba(102, 102, 255, 0.8)" },
        areaStyle: { color: "rgba(102, 102, 255, 0.2)" },
      },
    },
  ];
});

/* ========== 自动刷新定时器 ========== */
let refreshTimer: ReturnType<typeof setInterval> | null = null;

/**
 * 启动/重启自动刷新定时器。
 * - 先清理既有定时器，避免重复触发；
 * - 仅在 autoRefresh 开启时建立新的定时器。
 */
function startAutoRefresh() {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
  if (autoRefresh.value) {
    refreshTimer = setInterval(loadData, refreshInterval.value * 1000);
  }
}

/* ========== 数据源 ========== */
/**
 * 趋势数据：优先使用真实历史读数，缺失时回退到生成的模拟数据。
 */
const trendData = computed(() => {
  if (!pointStore.selectedPoint || !pointStore.selectedDeviceAsset) return [];

  const realData = pointStore.getPointTrendData(pointStore.selectedPoint.name);
  if (realData.length > 0) return realData;

  const hours = HOURS_MAP[pointStore.trendTimeRange] || 24;
  return pointStore.generateTrendData(pointStore.selectedPoint, hours);
});

/**
 * 判断当前点位是否为数字量（digital / bool）。
 */
function isDigitalPoint(
  point: { type?: string; standard_data_type?: string } | null,
): boolean {
  if (!point) return false;
  return point.type === "digital" || point.standard_data_type === "bool";
}

/**
 * 加载历史读数到 store。
 */
async function loadData() {
  if (!pointStore.selectedDeviceAsset) return;
  const hours = HOURS_MAP[pointStore.trendTimeRange] || 24;
  await pointStore.fetchHistoryReadings(pointStore.selectedDeviceAsset, hours);
}

/**
 * 导出趋势数据为 Excel 文件。
 */
function handleDownloadExcel() {
  const data = trendData.value;
  const point = pointStore.selectedPoint;
  if (!data.length || !point) return;

  const isDigital = isDigitalPoint(point);
  const rows = data.map((d) => ({
    [t("pointTrend.timeColumn")]: dayjs(d.timestamp).format("YYYY-MM-DD HH:mm:ss"),
    [t("pointTrend.valueColumn")]: isDigital
      ? d.value === 1
        ? t("pointTrend.on")
        : t("pointTrend.off")
      : d.value,
    [t("pointTrend.unitColumn")]: point.unit || "",
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [
    { wch: 22 },
    { wch: 15 },
    { wch: 10 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, t("pointTrend.sheetName"));

  const deviceName = pointStore.selectedDeviceAsset || "device";
  const pointName = point.name || "point";
  const timeStr = dayjs().format("YYYYMMDD-HHmmss");
  const fileName = `xplay-trend-${deviceName}-${pointName}-${timeStr}.xlsx`;

  XLSX.writeFile(wb, fileName);
  ElMessage.success(t("pointTrend.downloadSuccess"));
}

/* ========== 图表 option 构建（拆分为纯函数，便于阅读） ========== */

/**
 * 构建数值型点位的 markLine 数据（平均值 + 上下限）。
 */
function buildMarkLineData(
  point: { minValue?: number; maxValue?: number },
  stats: { avg: number },
): any[] {
  const lines: any[] = [];

  if (showAvgLine.value) {
    lines.push({
      name: t("pointTrend.averageLabel"),
      yAxis: stats.avg,
      lineStyle: { color: CHART_COLORS.avgLine, type: "dashed" },
      label: {
        formatter: `${t("pointTrend.averageLabel")}: ${stats.avg.toFixed(2)}`,
      },
    });
  }

  if (showMinMax.value && point.maxValue !== undefined) {
    lines.push({
      name: t("pointTrend.upperLimit"),
      yAxis: point.maxValue,
      lineStyle: { color: CHART_COLORS.upperLimit, type: "dashed" },
      label: {
        formatter: `${t("pointTrend.upperLimit")}: ${point.maxValue}`,
      },
    });
  }

  if (showMinMax.value && point.minValue !== undefined) {
    lines.push({
      name: t("pointTrend.lowerLimit"),
      yAxis: point.minValue,
      lineStyle: { color: CHART_COLORS.lowerLimit, type: "dashed" },
      label: {
        formatter: `${t("pointTrend.lowerLimit")}: ${point.minValue}`,
      },
    });
  }

  return lines;
}

/**
 * 构建面积渐变样式（数字量与模拟量使用不同配色）。
 */
function buildAreaStyle(isDigital: boolean) {
  const [start, end] = isDigital
    ? [CHART_COLORS.digitalAreaStart, CHART_COLORS.digitalAreaEnd]
    : [CHART_COLORS.analogAreaStart, CHART_COLORS.analogAreaEnd];

  return {
    color: {
      type: "linear",
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: start },
        { offset: 1, color: end },
      ],
    },
  };
}

/**
 * 构建单条 series 配置。
 */
function buildSeriesOption(
  isDigital: boolean,
  seriesName: string,
  seriesData: (string | number)[][],
  point: { minValue?: number; maxValue?: number },
  stats: { avg: number },
  hasData: boolean,
) {
  const markLineData = isDigital ? [] : buildMarkLineData(point, stats);

  return {
    name: seriesName,
    type: "line",
    smooth: !isDigital,
    step: isDigital ? ("middle" as const) : undefined,
    symbol: showDataPoints.value ? "circle" : "none",
    symbolSize: 6,
    sampling: "lttb",
    itemStyle: {
      color: isDigital
        ? (params: any) =>
            params.value[1] === 1
              ? CHART_COLORS.digitalOn
              : CHART_COLORS.digitalOff
        : CHART_COLORS.analogLine,
    },
    lineStyle: { width: isDigital ? 3 : 2 },
    areaStyle: buildAreaStyle(isDigital),
    data: seriesData,
    markLine:
      isDigital || markLineData.length === 0
        ? undefined
        : { silent: true, data: markLineData },
    markPoint:
      !isDigital && showMinMax.value && hasData
        ? {
            data: [
              {
                type: "max",
                name: t("pointTrend.maxValue"),
                itemStyle: { color: CHART_COLORS.upperLimit },
              },
              {
                type: "min",
                name: t("pointTrend.minValue"),
                itemStyle: { color: CHART_COLORS.digitalOn },
              },
            ],
          }
        : undefined,
  };
}

/**
 * 图表完整配置：标题 / 提示 / 图例 / 坐标轴 / 数据缩放 / 系列。
 */
const chartOption = computed(() => {
  const point = pointStore.selectedPoint;
  if (!point) return {};

  const data = trendData.value;
  const isDigital = isDigitalPoint(point);
  const seriesData = data.map((d) => [d.timestamp, d.value]);

  // 数值统计（用于 markLine / markPoint），无数据时退回 0
  const valueStats =
    data.length > 0
      ? {
          min: Math.min(...data.map((d) => d.value)),
          max: Math.max(...data.map((d) => d.value)),
          avg: data.reduce((sum, d) => sum + d.value, 0) / data.length,
        }
      : { min: 0, max: 0, avg: 0 };

  const seriesName = isDigital
    ? t("pointTrend.status")
    : t("pointTrend.value");

  return {
    title: {
      text: `${point.description || point.name} (${point.name})`,
      left: "center",
      textStyle: { fontSize: 16, fontWeight: "normal" },
    },
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const d = params[0];
        const time = dayjs(d.value[0]).format("MM-DD HH:mm:ss");
        const value = isDigital
          ? d.value[1] === 1
            ? t("pointTrend.on")
            : t("pointTrend.off")
          : d.value[1];
        return `${time}<br/>${t("pointTrend.value")}: ${value} ${point.unit || ""}`;
      },
    },
    legend: {
      data: isDigital
        ? [seriesName]
        : [
            t("pointTrend.value"),
            t("pointTrend.averageLabel"),
            t("pointTrend.upperLimit"),
            t("pointTrend.lowerLimit"),
          ],
      bottom: 10,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      top: "15%",
      containLabel: true,
    },
    dataZoom: dataZoomOption.value,
    xAxis: {
      type: "time",
      boundaryGap: false,
      axisLabel: {
        formatter: (value: number) => dayjs(value).format("HH:mm"),
      },
    },
    yAxis: {
      type: isDigital ? "category" : "value",
      name: isDigital ? "" : point.unit || "",
      min: isDigital ? undefined : (value: any) => Math.floor(value.min * 0.9),
      max: isDigital ? undefined : (value: any) => Math.ceil(value.max * 1.1),
      data: isDigital ? [t("pointTrend.off"), t("pointTrend.on")] : undefined,
      axisLabel: {
        formatter: isDigital ? (value: string) => value : undefined,
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: splitLineColor.value,
        },
      },
    },
    series: [
      buildSeriesOption(
        isDigital,
        seriesName,
        seriesData,
        point,
        valueStats,
        data.length > 0,
      ),
    ],
  };
});

/**
 * 统计信息：基于当前趋势数据计算 min/max/avg/count 等。
 * 数字量额外计算开/关次数与占比。
 */
const statisticsInfo = computed(() => {
  if (!trendData.value.length) return null;

  const values = trendData.value.map((d) => d.value);
  const sum = values.reduce((a, b) => a + b, 0);
  const point = pointStore.selectedPoint;
  const isDigital = isDigitalPoint(point);

  const onCount = isDigital ? values.filter((v) => v === 1).length : 0;
  const offCount = isDigital ? values.filter((v) => v === 0).length : 0;

  return {
    min: Math.min(...values).toFixed(2),
    max: Math.max(...values).toFixed(2),
    avg: (sum / values.length).toFixed(2),
    count: values.length,
    start: dayjs(trendData.value[0]?.timestamp).format("MM-DD HH:mm"),
    end: dayjs(trendData.value[trendData.value.length - 1]?.timestamp).format(
      "MM-DD HH:mm",
    ),
    isDigital,
    onCount,
    offCount,
    onPercentage: isDigital
      ? ((onCount / values.length) * 100).toFixed(1)
      : undefined,
  };
});

/* ========== 侦听器 ========== */
// autoRefresh 开关变化 -> 重启定时器
watch(autoRefresh, startAutoRefresh);

// 刷新间隔变化 -> 重启定时器以应用新间隔
watch(refreshInterval, startAutoRefresh);

// 时间范围变化 -> 重新拉取数据
watch(() => pointStore.trendTimeRange, loadData);

// 外部传入的 deviceName/pointName 变化 -> 切换点位并加载数据
watch(
  () => props.deviceName,
  async (name) => {
    if (name && props.pointName) {
      pointStore.selectPoint(name, props.pointName);
      await loadData();
    }
  },
  { immediate: true },
);

/* ========== 生命周期 ========== */
onMounted(startAutoRefresh);

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
});
</script>

<style>
/* 引入 Devices 模块通用弹框样式 */
@import "./DialogCommon.css";
</style>

<style scoped>
.point-trend {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  overflow: hidden;
}

/* ========== 头部区域 ========== */
.trend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-base);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 主头部标题（16px），与卡片标题 .card-title 区分 */
.header-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.point-info {
  font-size: 13px;
  color: var(--text-secondary);
  background: var(--bg-hover);
  padding: 4px 8px;
  border-radius: 4px;
}

.header-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.select-with-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.select-label {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.header-right :deep(.el-button) {
  background-color: transparent !important;
  border-color: transparent !important;
  box-shadow: none !important;
}

.header-right :deep(.el-button:hover),
.header-right :deep(.el-button:focus) {
  background-color: transparent !important;
  border-color: transparent !important;
  color: var(--color-primary) !important;
}

.header-right :deep(.el-button:not(.el-button--primary)) {
  background-color: transparent !important;
  border-color: transparent !important;
  color: var(--text-regular) !important;
}

.header-right :deep(.el-button:not(.el-button--primary):hover) {
  background-color: transparent !important;
  color: var(--color-primary) !important;
}

.close-btn {
  margin-left: 8px;
}

/* ========== 配置面板 ========== */
.config-panel {
  padding: 12px 16px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-base);
  flex-shrink: 0;
}

.search-config-card {
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 12px;
}

/* ========== 卡片通用样式 ========== */
.search-result-card {
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  margin-bottom: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

/* 卡片标题（15px），区别于主头部标题 */
.card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

:deep(.el-card__header) {
  padding: 12px 16px;
}

:deep(.el-card__body) {
  padding: 16px;
}

/* ========== 内容区域 ========== */
.trend-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  overflow-y: auto;
  background: var(--bg-card);
  min-height: 0;
}

.chart-card {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.chart-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px;
}

.chart-container {
  flex: 1;
  width: 100%;
  min-height: 300px;
}

.trend-chart {
  width: 100%;
  height: 100%;
  min-height: 300px;
}

/* ========== 统计面板 ========== */
.statistics-panel {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.stat-card {
  flex: 1;
  min-width: 120px;
  text-align: center;
  padding: 12px;
  background: var(--bg-hover);
  border-radius: 8px;
  border: 1px solid var(--border-lighter);
  transition: background-color 0.2s ease;
}

/* 深色主题下改用半透明白色叠加，营造玻璃层级感，避免纯色块过于沉闷 */
[data-theme="dark"] .stat-card {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.08);
}

.stat-label {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.stat-value.current {
  color: var(--color-primary);
}

.stat-value.min {
  color: var(--color-success);
}

.stat-value.max {
  color: var(--color-danger);
}

.stat-value.avg {
  color: var(--color-warning);
}

.stat-value.on {
  color: var(--color-success);
}

.stat-value.off {
  color: var(--color-danger);
}

.stat-value.percentage {
  color: #9b59b6;
}

.stat-value.time {
  font-size: 12px;
  color: var(--text-secondary);
}

/* ========== 点位信息 ========== */
.point-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.meta-label {
  color: var(--text-secondary);
}

/* ========== 空状态 ========== */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: var(--bg-card);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .trend-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-right {
    flex-wrap: wrap;
  }

  .statistics-panel {
    flex-direction: column;
  }

  .stat-card {
    min-width: unset;
  }

  .trend-chart {
    height: 300px;
  }
}
</style>
