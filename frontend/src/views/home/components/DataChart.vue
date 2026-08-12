<template>
  <el-card
    class="chart-card"
    shadow="hover"
    :style="{ height: chartHeight + 'px' }"
  >
    <template #header>
      <div class="card-header">
        <div class="header-left">
          <span class="chart-title">{{ $t("dashboard.title") }}</span>
          <span class="summary-item">
            <span class="label">{{ $t("dashboard.peak") }}:</span>
            <span class="value"
              >{{ chartSummary.peak }} {{ $t("dashboard.itemsPerHour") }}</span
            >
          </span>
          <span class="summary-item">
            <span class="label">{{ $t("dashboard.average") }}:</span>
            <span class="value"
              >{{ chartSummary.average }}
              {{ $t("dashboard.itemsPerHour") }}</span
            >
          </span>
        </div>
        <div class="chart-summary">
          <el-radio-group v-model="timeRange" class="time-range-selector">
            <el-radio-button value="1h">
              {{ $t("dashboard.timeRange1h") }}
            </el-radio-button>
            <el-radio-button value="24h">
              {{ $t("dashboard.timeRange24h") }}
            </el-radio-button>
            <el-radio-button value="7d">
              {{ $t("dashboard.timeRange7d") }}
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </template>
    <v-chart
      ref="chartRef"
      :option="dataChartOption"
      class="chart"
      autoresize
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onActivated, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { useThemeStore } from "@/stores/theme";
import { useSystemStore } from "@/stores/system";
import type { ChartSummary } from "../types";

/* 注册 ECharts 组件：仅注册本组件用到的图表类型 */
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

const props = defineProps<{
  chartHeight: number;
  refreshKey: number;
}>();

const emit = defineEmits<{
  (e: "update:timeRange", value: string): void;
}>();

const { t } = useI18n();
const themeStore = useThemeStore();
const systemStore = useSystemStore();

const timeRange = ref("24h");
const chartRef = ref<InstanceType<typeof VChart> | null>(null);
const isChartReady = ref(false);
/** 图表初始化最大重试次数（防止 DOM 尚未渲染完成） */
const MAX_INIT_RETRIES = 5;

/** 从图表数据中计算峰值和平均值摘要 */
const chartSummary = computed<ChartSummary>(() => {
  const data = dataChartOption.value.series[0].data;
  if (data.length === 0) return { peak: 0, average: 0 };
  const peak = Math.max(...data);
  const average = Math.round(data.reduce((a, b) => a + b, 0) / data.length);
  return { peak, average };
});

/** 根据主题返回图表配色方案 */
function getChartColors(isDark: boolean) {
  if (isDark) {
    return {
      lineStart: "#22d3ee",
      lineEnd: "#a855f7",
      lineShadow: "rgba(34, 211, 238, 0.4)",
      areaStops: [
        { offset: 0, color: "rgba(34, 211, 238, 0.4)" },
        { offset: 0.5, color: "rgba(168, 85, 247, 0.2)" },
        { offset: 1, color: "rgba(168, 85, 247, 0.03)" },
      ],
      itemColor: "#22d3ee",
      axisLine: "#3a3a5e",
      axisLabel: "#8d9096",
      splitLine: "rgba(58, 58, 94, 0.5)",
      tooltipBg: "rgba(22, 33, 62, 0.95)",
      tooltipBorder: "#3a3a5e",
      tooltipText: "#e4e7ed",
    };
  }
  return {
    lineStart: "#3498db",
    lineEnd: "#8b5cf6",
    lineShadow: "rgba(52, 152, 219, 0.3)",
    areaStops: [
      { offset: 0, color: "rgba(52, 152, 219, 0.35)" },
      { offset: 0.5, color: "rgba(139, 92, 246, 0.15)" },
      { offset: 1, color: "rgba(139, 92, 246, 0.02)" },
    ],
    itemColor: "#3498db",
    axisLine: "#e0e0e0",
    axisLabel: "#95a5a6",
    splitLine: "rgba(235, 238, 245, 0.8)",
    tooltipBg: "#ffffff",
    tooltipBorder: "#e0e0e0",
    tooltipText: "#2c3e50",
  };
}

/** 构建 ECharts 配置项：包含 tooltip、坐标轴、折线+面积样式 */
function buildChartOption(isDark: boolean) {
  const c = getChartColors(isDark);
  return {
    tooltip: {
      trigger: "axis",
      backgroundColor: c.tooltipBg,
      borderColor: c.tooltipBorder,
      textStyle: { color: c.tooltipText },
    },
    grid: {
      left: "2%",
      right: "2%",
      bottom: "3%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [] as string[],
      axisLine: { lineStyle: { color: c.axisLine } },
      axisLabel: { color: c.axisLabel },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisLabel: { color: c.axisLabel },
      splitLine: { lineStyle: { color: c.splitLine, type: "dashed" } },
    },
    series: [
      {
        name: t("dashboard.dataCollection"),
        type: "line",
        smooth: true,
        showSymbol: false,
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: c.areaStops,
          },
        },
        lineStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: c.lineStart },
              { offset: 1, color: c.lineEnd },
            ],
          },
          width: 3,
          shadowColor: c.lineShadow,
          shadowBlur: 10,
          shadowOffsetY: 5,
        },
        itemStyle: { color: c.itemColor },
        emphasis: {
          focus: "series",
          scale: true,
        },
        data: [] as number[],
      },
    ],
  };
}

const dataChartOption = ref(buildChartOption(themeStore.isDark()));

/* ==================== 侦听器 ==================== */

/** 时间范围切换时重新拉取数据并通知父组件 */
watch(timeRange, async (newVal) => {
  emit("update:timeRange", newVal);
  await updateChartData();
});

/** 主题切换时重建图表配色（保留已有数据） */
watch(
  () => themeStore.theme,
  () => {
    const isDark = themeStore.isDark();
    const newOption = buildChartOption(isDark);
    newOption.series[0].data = dataChartOption.value.series[0].data;
    newOption.xAxis.data = dataChartOption.value.xAxis.data;
    dataChartOption.value = newOption;
  },
);

/** 父组件触发刷新时重新拉取数据 */
watch(
  () => props.refreshKey,
  async () => {
    await updateChartData();
  },
);

/** 从 store 拉取指定时间范围的图表数据并更新配置 */
async function updateChartData() {
  try {
    const chartData = await systemStore.generateChartData(timeRange.value);
    requestAnimationFrame(() => {
      dataChartOption.value.xAxis.data = chartData.map((d) => d.time);
      dataChartOption.value.series[0].data = chartData.map((d) => d.value);
    });
  } catch (error) {
    console.error("Failed to update chart data:", error);
  }
}

/** 初始化图表：通过双 rAF + 重试机制确保 DOM 已渲染 */
async function initChartWithRetry(retryCount = 0) {
  await nextTick();
  requestAnimationFrame(async () => {
    requestAnimationFrame(async () => {
      if (!chartRef.value) {
        if (retryCount < MAX_INIT_RETRIES) {
          setTimeout(
            () => initChartWithRetry(retryCount + 1),
            50 * (retryCount + 1),
          );
        }
        return;
      }
      const el = chartRef.value.$el as HTMLElement;
      const { clientWidth, clientHeight } = el;
      if (clientWidth === 0 || clientHeight === 0) {
        if (retryCount < MAX_INIT_RETRIES) {
          setTimeout(
            () => initChartWithRetry(retryCount + 1),
            50 * (retryCount + 1),
          );
        }
        return;
      }
      isChartReady.value = true;
      await updateChartData();
    });
  });
}

onMounted(() => {
  initChartWithRetry();
});

onActivated(() => {
  if (isChartReady.value) {
    updateChartData();
  } else {
    initChartWithRetry();
  }
});
</script>

<style scoped>
.chart-card {
  margin-bottom: 16px;
  border-radius: 16px;
  background: var(--bg-card);
}

.chart-card :deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light) !important;
  position: relative;
}

.chart-card :deep(.el-card__header)::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 80px;
  background: linear-gradient(90deg, var(--color-primary) 0%, transparent 100%);
}

.chart-card :deep(.el-card__body) {
  height: calc(100% - 70px);
  padding: 0px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.5px;
}

.time-range-selector {
  margin-left: 16px;
}

.chart-summary {
  display: flex;
  gap: 20px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.summary-item .label {
  font-size: 13px;
  color: var(--text-secondary);
}

.summary-item .value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
