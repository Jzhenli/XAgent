<template>
  <div class="dashboard">
    <!-- ==================== 加载骨架屏 ==================== -->
    <div
      v-show="showSkeleton"
      class="dashboard-skeleton"
      role="region"
      aria-busy="true"
      :aria-label="$t('dashboard.ariaContentLoading')"
    >
      <!-- 骨架屏：统计卡片区域 -->
      <el-row :gutter="isMobile ? 12 : 20" class="skeleton-cards">
        <el-col :span="statCardSpan" v-for="i in 4" :key="i">
          <el-card class="skeleton-card" shadow="hover">
            <div class="skeleton-icon"></div>
            <div class="skeleton-content">
              <div class="skeleton-value"></div>
              <div class="skeleton-label"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 骨架屏：图表区域 -->
      <el-row :gutter="isMobile ? 12 : 20" class="skeleton-chart-row">
        <el-col :span="24">
          <el-card class="skeleton-chart" shadow="hover">
            <div class="skeleton-chart-header"></div>
            <div class="skeleton-chart-body"></div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 骨架屏：信息面板区域 -->
      <el-row :gutter="isMobile ? 12 : 20" class="skeleton-info-row">
        <el-col :span="infoColSpan" v-for="i in 2" :key="i">
          <el-card class="skeleton-info" shadow="hover">
            <div class="skeleton-info-header"></div>
            <div class="skeleton-info-body"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- ==================== 主内容区 ==================== -->
    <div
      v-show="showContent"
      class="dashboard-content"
      role="region"
      :aria-busy="!showContent"
      :aria-label="$t('dashboard.ariaDashboardContent')"
    >
      <!-- 顶部工具栏：刷新按钮与更新时间 -->
      <div class="dashboard-toolbar">
        <div class="toolbar-right">
          <el-button
            :icon="RefreshRight"
            @click="refreshData"
            :loading="refreshing"
            circle
            size="small"
            :title="$t('dashboard.refreshData')"
          />
          <span class="update-time">{{ $t('dashboard.lastUpdate') }}: {{ lastUpdateTime }}</span>
        </div>
      </div>

      <!-- 第一行：核心统计卡片（告警/设备/通道/规则） -->
      <el-row :gutter="isMobile ? 12 : 20" class="stat-cards">
        <!-- 待处理告警卡片（高亮样式） -->
        <el-col :span="statCardSpan">
          <el-card class="stat-card alert-card-highlight" shadow="hover">
            <div class="stat-icon alerts">
              <span>🔔</span>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ alertStore.pendingAlerts }}</div>
              <div class="stat-label">{{ $t('dashboard.pendingAlerts') }}</div>
              <div class="stat-trend" :class="alertTrend.type">{{ alertTrend.text }}</div>
            </div>
          </el-card>
        </el-col>

        <!-- 设备在线卡片 -->
        <el-col :span="statCardSpan">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-icon devices">
              <span>📱</span>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ deviceStore.onlineDevices }}/{{ deviceStore.totalDevices }}</div>
              <div class="stat-label">{{ $t('dashboard.onlineDevices') }}</div>
              <div class="stat-trend" :class="deviceTrend.type">{{ deviceTrend.text }}</div>
            </div>
          </el-card>
        </el-col>

        <!-- 通道在线卡片 -->
        <el-col :span="statCardSpan">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-icon channels">
              <span>📤</span>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ channelStore.onlineChannels }}/{{ channelStore.totalChannels }}</div>
              <div class="stat-label">{{ $t('dashboard.onlineChannels') }}</div>
              <div class="stat-trend" :class="channelTrend.type">{{ channelTrend.text }}</div>
            </div>
          </el-card>
        </el-col>

        <!-- 活动规则卡片 -->
        <el-col :span="statCardSpan">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-icon rules">
              <span>📋</span>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ ruleStore.activeRules }}/{{ ruleStore.totalRules }}</div>
              <div class="stat-label">{{ $t('dashboard.activeRules') }}</div>
              <div class="stat-trend" :class="ruleTrend.type">{{ ruleTrend.text }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 第二行：数据采集趋势图表 -->
      <el-row :gutter="isMobile ? 12 : 20" class="chart-row">
        <el-col :span="24">
          <el-card class="chart-card" shadow="hover" :style="{ height: chartHeight + 'px' }">
            <template #header>
              <div class="card-header">
                <div class="header-left">
                  <span class="chart-title">{{ $t('dashboard.title') }}</span>
                  <!-- 时间范围切换：1小时/24小时/7天 -->
                  <el-radio-group v-model="timeRange" size="small" class="time-range-selector">
                    <el-radio-button value="1h">{{ $t('dashboard.timeRange1h') }}</el-radio-button>
                    <el-radio-button value="24h">{{ $t('dashboard.timeRange24h') }}</el-radio-button>
                    <el-radio-button value="7d">{{ $t('dashboard.timeRange7d') }}</el-radio-button>
                  </el-radio-group>
                </div>
                <!-- 图表统计摘要（峰值/平均值） -->
                <div class="chart-summary">
                  <span class="summary-item">
                    <span class="label">{{ $t('dashboard.peak') }}:</span>
                    <span class="value">{{ chartSummary.peak }} {{ $t('dashboard.itemsPerHour') }}</span>
                  </span>
                  <span class="summary-item">
                    <span class="label">{{ $t('dashboard.average') }}:</span>
                    <span class="value">{{ chartSummary.average }} {{ $t('dashboard.itemsPerHour') }}</span>
                  </span>
                </div>
              </div>
            </template>
            <v-chart :option="dataChartOption" class="chart" autoresize />
          </el-card>
        </el-col>
      </el-row>

      <!-- 第三行左：系统资源监控（CPU/内存/磁盘） -->
      <el-row :gutter="isMobile ? 12 : 20" class="info-row">
        <el-col :span="infoColSpan">
          <el-card class="info-card resource-panel" shadow="hover">
            <template #header>
              <div class="panel-title">
                <span>{{ $t('dashboard.systemResource') }}</span>
                <el-tag size="small" :type="systemStore.stats.cpuUsage > 80 ? 'danger' : 'success'">
                  {{ systemStore.stats.cpuUsage > 80 ? $t('dashboard.highLoad') : $t('dashboard.runningNormal') }}
                </el-tag>
              </div>
            </template>
            <div class="resource-gauges">
              <div class="gauge-item">
                <div class="gauge-chart">
                  <el-progress
                    type="dashboard"
                    :percentage="systemStore.stats.cpuUsage"
                    :color="getProgressColor(systemStore.stats.cpuUsage)"
                    :width="80"
                  />
                </div>
                <div class="gauge-label">{{ $t('dashboard.cpu') }}</div>
              </div>
              <div class="gauge-item">
                <div class="gauge-chart">
                  <el-progress
                    type="dashboard"
                    :percentage="systemStore.stats.memoryUsage"
                    :color="getProgressColor(systemStore.stats.memoryUsage)"
                    :width="80"
                  />
                </div>
                <div class="gauge-label">{{ $t('dashboard.memory') }}</div>
              </div>
              <div class="gauge-item">
                <div class="gauge-chart">
                  <el-progress
                    type="dashboard"
                    :percentage="systemStore.stats.diskUsage"
                    :color="getProgressColor(systemStore.stats.diskUsage)"
                    :width="80"
                  />
                </div>
                <div class="gauge-label">{{ $t('dashboard.disk') }}</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 第三行右：通道上传统计 -->
        <el-col :span="infoColSpan" :class="{ 'mt-20': isMobile }">
          <el-card class="info-card" shadow="hover">
            <template #header>
              <div class="panel-title">
                <span>{{ $t('dashboard.channelUploadStats') }}</span>
                <el-tag size="small" :type="channelStore.averageSuccessRate > 95 ? 'success' : 'warning'">
                  {{ channelStore.averageSuccessRate > 95 ? $t('dashboard.transmissionGood') : $t('dashboard.needsAttention') }}
                </el-tag>
              </div>
            </template>
            <div class="channel-stats">
              <div class="channel-stat-item">
                <span class="stat-label">{{ $t('dashboard.totalUploadRate') }}</span>
                <span class="stat-value">{{ channelStore.totalUploadRate }} {{ $t('dashboard.itemsPerSecond') }}</span>
              </div>
              <div class="channel-stat-item">
                <span class="stat-label">{{ $t('dashboard.averageSuccessRate') }}</span>
                <span class="stat-value">{{ channelStore.averageSuccessRate }}%</span>
              </div>
              <div class="channel-stat-item">
                <span class="stat-label">{{ $t('dashboard.dataBacklog') }}</span>
                <span class="stat-value" :class="{ 'text-danger': channelStore.totalBacklog > 100 }">
                  {{ channelStore.totalBacklog }} {{ $t('dashboard.items') }}
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 第四行左：最新告警列表 -->
      <el-row :gutter="isMobile ? 12 : 20" class="info-row">
        <el-col :span="infoColSpan">
          <el-card class="info-card alert-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>{{ $t('dashboard.latestAlerts') }}</span>
                <el-button type="primary" link size="small" @click="router.push('/alerts')">
                  {{ $t('dashboard.viewAll') }}
                </el-button>
              </div>
            </template>
            <div class="alert-list">
              <div
                v-for="alert in alertStore.alerts.slice(0, 3)"
                :key="alert.id"
                class="alert-item"
                :class="alert.level"
              >
                <span class="alert-icon">
                  {{ alert.level === 'critical' ? '🚨' : alert.level === 'warning' ? '⚠️' : '💡' }}
                </span>
                <div class="alert-content">
                  <div class="alert-title">{{ alert.ruleName }}</div>
                  <div class="alert-desc">{{ alert.message }}</div>
                </div>
                <span class="alert-time">{{ alert.triggeredAt.split(' ')[1] }}</span>
              </div>
              <el-empty v-if="alertStore.alerts.length === 0" :description="$t('dashboard.noAlerts')" :image-size="60" />
            </div>
          </el-card>
        </el-col>

        <!-- 第四行右：系统运行信息 -->
        <el-col :span="infoColSpan" :class="{ 'mt-20': isMobile }">
          <el-card class="info-card" shadow="hover">
            <template #header>
              <div class="panel-title">
                <span>{{ $t('dashboard.systemInfo') }}</span>
                <el-tag size="small" type="info">{{ $t('dashboard.details') }}</el-tag>
              </div>
            </template>
            <div class="system-info">
              <div class="info-item">
                <span class="info-label">{{ $t('dashboard.uptime') }}</span>
                <span class="info-value">{{ Math.floor(systemStore.stats.uptime / 3600) }} {{ $t('dashboard.hours') }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('dashboard.totalCollection') }}</span>
                <span class="info-value">{{ systemStore.stats.totalReadings.toLocaleString() }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('dashboard.todayCollection') }}</span>
                <span class="info-value">{{ systemStore.stats.todayReadings.toLocaleString() }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('dashboard.dataQuality') }}</span>
                <span class="info-value" :class="{ 'text-success': systemStore.dataQuality.qualityRate > 95 }">
                  {{ systemStore.dataQuality.qualityRate }}%
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
// ==================== 组件配置 ====================
import { ref, computed, onMounted, onActivated, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { RefreshRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

// ECharts 核心模块
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, GaugeChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

// 状态管理
import { useDeviceStore } from '@/stores/devices'
import { useRuleStore } from '@/stores/rules'
import { useAlertStore } from '@/stores/alerts'
import { useSystemStore } from '@/stores/system'
import { useChannelStore } from '@/stores/channels'

// 工具函数
import { useResponsive } from '@/utils/useResponsive'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// 定义组件名称，用于 keep-alive 缓存
defineOptions({
  name: 'Dashboard'
})

// ==================== 响应式状态 ====================
const { t } = useI18n()
const router = useRouter()
const deviceStore = useDeviceStore()
const ruleStore = useRuleStore()
const alertStore = useAlertStore()
const systemStore = useSystemStore()
const channelStore = useChannelStore()
const { isTablet, isMobile, isSmallTablet, isMediumTablet, isLargeTablet } = useResponsive()

// 数据刷新状态
const lastUpdateTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const refreshing = ref(false)
const timeRange = ref('24h')

// 视图状态（用于骨架屏与内容切换）
const showContent = ref(false)
const showSkeleton = ref(true)
const isInitialized = ref(false)

// ==================== 响应式布局计算 ====================

/** 统计卡片的列跨度数（基于屏幕宽度自适应） */
const statCardSpan = computed(() => {
  if (isMobile.value) return 24
  if (isTablet.value) return 12
  return 6
})

/** 信息面板的列跨度数（移动端全宽，其他半宽） */
const infoColSpan = computed(() => {
  if (isMobile.value) return 24
  return 12
})

/** 图表高度（根据屏幕尺寸自适应） */
const chartHeight = computed(() => {
  if (isMobile.value) return 300
  if (isSmallTablet.value) return 280
  if (isMediumTablet.value) return 360
  return 420
})

// ==================== 工具函数 ====================

/** 根据使用率获取进度条颜色 */
function getProgressColor(percentage: number): string {
  if (percentage > 80) return 'var(--color-danger)'
  if (percentage > 60) return 'var(--color-warning)'
  return 'var(--color-success)'
}

/** 更新最后更新时间 */
function updateLastTime() {
  lastUpdateTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
}

// ==================== 趋势指示器 ====================

/** 告警趋势（待处理数量） */
const alertTrend = computed(() => {
  const pending = alertStore.pendingAlerts
  if (pending > 0) return { text: `${t('dashboard.pendingAlerts')} (${pending})`, type: 'danger' }
  return { text: t('dashboard.noNew'), type: 'success' }
})

/** 设备趋势（在线率） */
const deviceTrend = computed(() => {
  const online = deviceStore.onlineDevices
  const total = deviceStore.totalDevices
  if (total === 0) return { text: t('dashboard.noDevices'), type: 'info' }
  const percentage = Math.round((online / total) * 100)
  if (percentage >= 80) return { text: t('dashboard.runningWell'), type: 'success' }
  if (percentage >= 50) return { text: t('dashboard.partiallyOffline'), type: 'warning' }
  return { text: t('dashboard.mostlyOffline'), type: 'danger' }
})

/** 通道趋势（在线率） */
const channelTrend = computed(() => {
  const online = channelStore.onlineChannels
  const total = channelStore.totalChannels
  if (total === 0) return { text: t('dashboard.noChannels'), type: 'info' }
  const percentage = Math.round((online / total) * 100)
  if (percentage >= 80) return { text: t('dashboard.connectionNormal'), type: 'success' }
  if (percentage >= 50) return { text: t('dashboard.partiallyDisconnected'), type: 'warning' }
  return { text: t('dashboard.mostlyDisconnected'), type: 'danger' }
})

/** 规则趋势（启用状态） */
const ruleTrend = computed(() => {
  const active = ruleStore.activeRules
  const total = ruleStore.totalRules
  if (total === 0) return { text: t('dashboard.noRules'), type: 'info' }
  return { text: `${active}/${total} ${t('dashboard.enabled')}`, type: active > 0 ? 'success' : 'warning' }
})

// ==================== 图表配置 ====================

/** 图表数据摘要（峰值与平均值） */
const chartSummary = computed(() => {
  const data = dataChartOption.value.series[0].data
  if (data.length === 0) return { peak: 0, average: 0 }
  const peak = Math.max(...data)
  const average = Math.round(data.reduce((a, b) => a + b, 0) / data.length)
  return { peak, average }
})

/** 图表配置对象 */
const dataChartOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [] as string[]
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    name: t('dashboard.dataCollection'),
    type: 'line',
    smooth: true,
    areaStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
          { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
        ]
      }
    },
    lineStyle: { color: '#3b82f6', width: 2 },
    itemStyle: { color: '#3b82f6' },
    data: [] as number[]
  }]
})

// ==================== 数据管理 ====================

/** 并行获取所有数据源数据 */
async function fetchAllData() {
  try {
    const results = await Promise.allSettled([
      deviceStore.fetchDevices(),
      ruleStore.fetchRules(),
      alertStore.fetchAlerts(),
      channelStore.fetchChannels(),
      systemStore.fetchAllStats()
    ])

    const failedRequests = results.filter(r => r.status === 'rejected')
    if (failedRequests.length > 0) {
      console.warn('Some requests failed:', failedRequests)
    }

    updateChartData()
  } catch (error) {
    console.error('Failed to fetch data:', error)
    ElMessage.error(t('dashboard.dataLoadFailed'))
  }
}

/** 更新图表数据（根据选定的时间范围） */
async function updateChartData() {
  try {
    const chartData = await systemStore.generateChartData(timeRange.value)
    requestAnimationFrame(() => {
      dataChartOption.value.xAxis.data = chartData.map(d => d.time)
      dataChartOption.value.series[0].data = chartData.map(d => d.value)
    })
  } catch (error) {
    console.error('Failed to update chart data:', error)
    ElMessage.error(t('dashboard.dataFetchFailed'))
  }
}

/** 后台静默刷新数据（不显示 loading） */
async function refreshInBackground() {
  try {
    await fetchAllData()
    updateLastTime()
  } catch (error) {
    console.error('Failed to refresh data:', error)
  }
}

/** 手动刷新数据（带 loading 状态） */
async function refreshData() {
  if (refreshing.value) return
  refreshing.value = true
  try {
    await fetchAllData()
    updateLastTime()
    ElMessage.success(t('dashboard.dataRefreshed'))
  } finally {
    refreshing.value = false
  }
}

// ==================== 生命周期 ====================

/** 时间范围变化时自动更新图表 */
watch(timeRange, async () => {
  await updateChartData()
})

/** 组件挂载时初始化数据 */
onMounted(async () => {
  // 检查 store 中是否已有已加载的数据（来自 sessionStorage 持久化）
  const hasCacheData = deviceStore.devices.length > 0 ||
                       ruleStore.rules.length > 0 ||
                       alertStore.alerts.length > 0 ||
                       systemStore.stats.totalReadings > 0

  // 如果有缓存数据，立即显示内容，后台静默刷新
  if (hasCacheData) {
    showSkeleton.value = false
    showContent.value = true
    isInitialized.value = true
    refreshInBackground()
    return
  }

  // 无缓存数据（首次访问），保持骨架屏显示
  try {
    await fetchAllData()
    updateLastTime()
    // 等待 DOM 更新完成后平滑过渡
    await nextTick()
    requestAnimationFrame(() => {
      showSkeleton.value = false
      showContent.value = true
      isInitialized.value = true
    })
  } catch (error) {
    console.error('Failed to fetch data:', error)
    ElMessage.error(t('dashboard.dataLoadFailed'))
    showSkeleton.value = false
    showContent.value = true
    isInitialized.value = true
  }
})

/** keep-alive 激活时恢复状态 */
onActivated(async () => {
  if (isInitialized.value) {
    // 确保显示内容（防止状态异常）
    showSkeleton.value = false
    showContent.value = true
    // 后台静默刷新数据
    refreshInBackground()
  }
})
</script>

<style scoped>
/* ==================== 容器布局 ==================== */
.dashboard {
  padding: 0;
  max-width: 1600px;
  margin: 0 auto;
}

.dashboard-content {
  width: 100%;
}

/* ==================== 骨架屏样式 ==================== */
.dashboard-skeleton {
  padding: 0;
}

.skeleton-cards,
.skeleton-chart-row,
.skeleton-info-row {
  margin-bottom: 20px;
}

.skeleton-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.skeleton-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(90deg, var(--bg-hover) 25%, var(--border-light) 50%, var(--bg-hover) 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

.skeleton-content {
  flex: 1;
}

.skeleton-value {
  height: 28px;
  width: 60%;
  border-radius: 4px;
  margin-bottom: 8px;
  background: linear-gradient(90deg, var(--bg-hover) 25%, var(--border-light) 50%, var(--bg-hover) 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

.skeleton-label {
  height: 16px;
  width: 40%;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--bg-hover) 25%, var(--border-light) 50%, var(--bg-hover) 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

.skeleton-chart {
  height: 350px;
}

.skeleton-chart-header {
  height: 40px;
  width: 30%;
  border-radius: 4px;
  margin-bottom: 20px;
  background: linear-gradient(90deg, var(--bg-hover) 25%, var(--border-light) 50%, var(--bg-hover) 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

.skeleton-chart-body {
  height: 250px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--bg-hover) 25%, var(--border-light) 50%, var(--bg-hover) 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

.skeleton-info {
  height: 200px;
}

.skeleton-info-header {
  height: 24px;
  width: 25%;
  border-radius: 4px;
  margin-bottom: 20px;
  background: linear-gradient(90deg, var(--bg-hover) 25%, var(--border-light) 50%, var(--bg-hover) 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

.skeleton-info-body {
  height: 120px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--bg-hover) 25%, var(--border-light) 50%, var(--bg-hover) 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* 深色模式骨架屏样式 */
@media (prefers-color-scheme: dark) {
  .skeleton-icon,
  .skeleton-value,
  .skeleton-label,
  .skeleton-chart-header,
  .skeleton-chart-body,
  .skeleton-info-header,
  .skeleton-info-body {
    background: linear-gradient(90deg, var(--bg-hover) 25%, var(--border-base) 50%, var(--bg-hover) 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s infinite;
  }
}

/* ==================== 工具栏样式 ==================== */
.dashboard-toolbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 4px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.update-time {
  color: var(--text-secondary);
  font-size: 13px;
}

/* ==================== 统计卡片样式 ==================== */
.stat-cards {
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  margin-bottom: 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.alert-card-highlight {
  border-left: 4px solid var(--color-danger);
  background: var(--color-danger-light);
}

.alert-card-highlight .stat-icon.alerts {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-right: 16px;
  flex-shrink: 0;
}

.stat-icon.devices { background: var(--color-primary); }
.stat-icon.channels { background: var(--color-info, #8b5cf6); }
.stat-icon.rules { background: var(--color-success); }
.stat-icon.alerts { background: var(--color-danger); }

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.stat-trend {
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
}

.stat-trend.success { color: var(--color-success); }
.stat-trend.warning { color: var(--color-warning); }
.stat-trend.danger { color: var(--color-danger); }
.stat-trend.info { color: var(--text-secondary); }

/* ==================== 图表区域样式 ==================== */
.chart-row {
  margin-bottom: 24px;
}

.chart-card {
  border-radius: 12px;
}

.chart-card :deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light);
}

.chart-card :deep(.el-card__body) {
  height: calc(100% - 70px);
  padding: 20px;
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

/* ==================== 信息面板样式 ==================== */
.info-row {
  margin-bottom: 24px;
}

.info-card {
  border-radius: 12px;
  height: 100%;
}

.info-card :deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light);
}

.info-card :deep(.el-card__body) {
  padding: 20px;
}

.panel-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* ---- 系统资源监控 ---- */
.resource-panel {
  height: auto;
}

.resource-gauges {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  padding: 10px 0;
}

.gauge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.gauge-chart {
  display: flex;
  align-items: center;
  justify-content: center;
}

.gauge-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}

/* ---- 通道上传统计 ---- */
.channel-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.channel-stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-hover);
  border-radius: 8px;
}

.channel-stat-item .stat-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.channel-stat-item .stat-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

/* ---- 最新告警列表 ---- */
.alert-card :deep(.el-card__header) {
  padding: 12px 20px;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: var(--bg-hover);
  transition: all 0.2s ease;
}

.alert-item:hover {
  background: var(--border-light);
}

.alert-item.critical {
  background: var(--color-danger-light);
  border-left: 3px solid var(--color-danger);
}

.alert-item.warning {
  background: var(--color-warning-light);
  border-left: 3px solid var(--color-warning);
}

.alert-icon {
  font-size: 20px;
}

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.alert-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.alert-time {
  font-size: 12px;
  color: var(--text-tertiary, #94a3b8);
}

/* ---- 系统运行信息 ---- */
.system-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: var(--bg-hover);
  border-radius: 8px;
}

.info-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

/* ==================== 工具类 ==================== */
.text-danger { color: var(--color-danger) !important; }
.text-success { color: var(--color-success) !important; }
.mt-20 { margin-top: 20px; }

/* ==================== 响应式设计 ==================== */
/* 低分辨率屏幕 (1365px以下且高度<700px) */
@media (max-width: 1365px) and (max-height: 700px) {
  .dashboard-toolbar { margin-bottom: 16px; }
  .stat-card { padding: 14px; margin-bottom: 12px; }
  .stat-icon { width: 48px; height: 48px; font-size: 22px; margin-right: 12px; }
  .stat-value { font-size: 22px; }
  .stat-label { font-size: 13px; }
  .stat-trend { font-size: 11px; }
  .chart-card :deep(.el-card__header) { padding: 12px 16px; }
  .chart-title { font-size: 14px; }
  .time-range-selector { margin-left: 12px; }
  .info-card :deep(.el-card__header) { padding: 12px 16px; }
  .info-card :deep(.el-card__body) { padding: 16px; }
  .resource-gauges { margin-bottom: 16px; padding: 8px 0; }
  .gauge-item { gap: 6px; }
  .gauge-label { font-size: 13px; }
  .channel-stats { gap: 10px; }
  .channel-stat-item { padding: 10px 12px; }
  .alert-list { gap: 10px; }
  .alert-item { padding: 10px; }
  .system-info { gap: 10px; }
  .info-item { padding: 8px 12px; }
}

/* 中等分辨率屏幕 (1366px - 1919px) */
@media (min-width: 1366px) and (max-width: 1919px) {
  .stat-card { padding: 18px; }
  .stat-icon { width: 56px; height: 56px; font-size: 26px; }
  .stat-value { font-size: 26px; }
}

/* 大屏屏幕 (1920px+) */
@media (min-width: 1920px) {
  .dashboard { max-width: 1800px; }
  .stat-card { padding: 20px; }
  .stat-icon { width: 60px; height: 60px; font-size: 28px; }
  .stat-value { font-size: 28px; }
}

/* 小屏/平板 (1024px以下) */
@media (max-width: 1023px) {
  .stat-card { padding: 16px; }
  .stat-icon { width: 50px; height: 50px; font-size: 24px; }
  .stat-value { font-size: 24px; }
  .resource-gauges { flex-wrap: wrap; }
  .gauge-item { flex: 1; min-width: 80px; }
}

/* 移动端 (768px以下) */
@media (max-width: 768px) {
  .dashboard-toolbar { padding: 0; }
  .update-time { font-size: 12px; }
  .stat-card { padding: 12px; }
  .stat-icon { width: 48px; height: 48px; font-size: 22px; margin-right: 12px; }
  .stat-value { font-size: 22px; }
  .stat-label { font-size: 12px; }
  .card-header { flex-direction: column; align-items: flex-start; gap: 12px; }
  .chart-summary { width: 100%; justify-content: space-around; }
  .resource-gauges { gap: 16px; }
}

/* 横屏平板 (1024px以下横屏) */
@media (max-width: 1024px) and (orientation: landscape) {
  .stat-cards { margin-bottom: 16px; }
  .chart-row { margin-bottom: 16px; }
}

/* ==================== 过渡动画 ==================== */
.fade-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.dashboard :deep(.el-loading-mask) {
  transition: opacity 0.3s ease-in-out;
}
</style>
