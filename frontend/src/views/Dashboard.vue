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
              <svg class="icon-svg" viewBox="0 0 24 24" fill="none">
                <path class="icon-path" d="M18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="currentColor"/>
                <path class="icon-wave wave-1" d="M3 12c0-1 .2-2.1.5-3.1L1.5 8.5C1 9.7.8 11 .8 12c0 1 .2 2.3.7 3.5l2-2.4c-.3-1-.5-2.1-.5-3.1z" fill="currentColor"/>
                <path class="icon-wave wave-2" d="M21 12c0 1-.2 2.1-.5 3.1l2 2.4c.5-1.2.7-2.5.7-3.5s-.2-2.3-.7-3.5l-2 2.4c.3 1 .5 2.1.5 3.1z" fill="currentColor"/>
              </svg>
              <span class="icon-dot dot-1"></span>
              <span class="icon-dot dot-2"></span>
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
          <el-card class="stat-card device-card" shadow="hover">
            <div class="stat-icon devices">
              <svg class="icon-svg" viewBox="0 0 24 24" fill="none">
                <rect x="2.5" y="3.5" width="19" height="13" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <rect x="4.5" y="5.5" width="15" height="9" rx="1" fill="currentColor" opacity="0.9"/>
                <path d="M8 20h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M12 16.5V20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <circle class="icon-pulse" cx="12" cy="10" r="2" fill="none" stroke="currentColor" stroke-width="1.2"/>
                <circle class="icon-pulse-dot" cx="12" cy="10" r="0.8" fill="currentColor"/>
              </svg>
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
          <el-card class="stat-card channel-card" shadow="hover">
            <div class="stat-icon channels">
              <svg class="icon-svg" viewBox="0 0 24 24" fill="none">
                <path class="icon-ring ring-1" d="M12 3c4.97 0 9 4.03 9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
                <path class="icon-ring ring-2" d="M12 6c3.31 0 6 2.69 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
                <circle cx="12" cy="12" r="3.5" fill="currentColor"/>
                <path class="icon-wave wave-1" d="M5 12H3m16 0h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path class="icon-wave wave-2" d="M6.5 9.5L5 8m12.5 1.5L19 8m-12.5 5.5L5 16m12.5-2.5L19 16" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              </svg>
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
          <el-card class="stat-card rule-card" shadow="hover">
            <div class="stat-icon rules">
              <svg class="icon-svg" viewBox="0 0 24 24" fill="none">
                <path class="icon-bolt bolt-1" d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="currentColor"/>
                <path class="icon-bolt bolt-2" d="M18.5 2L10.5 12H16l-1.5 8 8-10H17l1.5-8z" fill="currentColor" opacity="0.5"/>
                <path class="icon-ring ring-1" d="M4 7c1.5-2 3.5-3.5 6-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.6"/>
                <path class="icon-ring ring-2" d="M20 17c-1.5 2-3.5 3.5-6 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.6"/>
              </svg>
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
import { useThemeStore } from '@/stores/theme'

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
const themeStore = useThemeStore()
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

/** 根据当前主题获取图表配色方案 */
function getChartColors(isDark: boolean) {
  if (isDark) {
    return {
      lineStart: '#22d3ee',
      lineEnd: '#a855f7',
      lineShadow: 'rgba(34, 211, 238, 0.4)',
      areaStops: [
        { offset: 0, color: 'rgba(34, 211, 238, 0.4)' },
        { offset: 0.5, color: 'rgba(168, 85, 247, 0.2)' },
        { offset: 1, color: 'rgba(168, 85, 247, 0.03)' }
      ],
      itemColor: '#22d3ee',
      axisLine: '#3a3a5e',
      axisLabel: '#8d9096',
      splitLine: 'rgba(58, 58, 94, 0.5)',
      tooltipBg: 'rgba(22, 33, 62, 0.95)',
      tooltipBorder: '#3a3a5e',
      tooltipText: '#e4e7ed'
    }
  }
  return {
    lineStart: '#3498db',
    lineEnd: '#8b5cf6',
    lineShadow: 'rgba(52, 152, 219, 0.3)',
    areaStops: [
      { offset: 0, color: 'rgba(52, 152, 219, 0.35)' },
      { offset: 0.5, color: 'rgba(139, 92, 246, 0.15)' },
      { offset: 1, color: 'rgba(139, 92, 246, 0.02)' }
    ],
    itemColor: '#3498db',
    axisLine: '#e0e0e0',
    axisLabel: '#95a5a6',
    splitLine: 'rgba(235, 238, 245, 0.8)',
    tooltipBg: '#ffffff',
    tooltipBorder: '#e0e0e0',
    tooltipText: '#2c3e50'
  }
}

/** 构建完整图表配置 */
function buildChartOption(isDark: boolean) {
  const c = getChartColors(isDark)
  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: c.tooltipBg,
      borderColor: c.tooltipBorder,
      textStyle: { color: c.tooltipText }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [] as string[],
      axisLine: { lineStyle: { color: c.axisLine } },
      axisLabel: { color: c.axisLabel },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: c.axisLabel },
      splitLine: { lineStyle: { color: c.splitLine, type: 'dashed' } }
    },
    series: [{
      name: t('dashboard.dataCollection'),
      type: 'line',
      smooth: true,
      showSymbol: false,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: c.areaStops
        }
      },
      lineStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: c.lineStart },
            { offset: 1, color: c.lineEnd }
          ]
        },
        width: 3,
        shadowColor: c.lineShadow,
        shadowBlur: 10,
        shadowOffsetY: 5
      },
      itemStyle: { color: c.itemColor },
      emphasis: {
        focus: 'series',
        scale: true
      },
      data: [] as number[]
    }]
  }
}

/** 图表配置对象（主题感知） */
const dataChartOption = ref(buildChartOption(themeStore.isDark()))

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

/** 主题变化时重建图表配置 */
watch(() => themeStore.theme, () => {
  const isDark = themeStore.isDark()
  const newOption = buildChartOption(isDark)
  newOption.series[0].data = dataChartOption.value.series[0].data
  newOption.xAxis.data = dataChartOption.value.xAxis.data
  dataChartOption.value = newOption
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

/* ==================== 卡片基础样式（酷炫主题） ==================== */
.stat-cards,
.chart-row,
.info-row {
  margin-bottom: 24px;
}

.stat-cards :deep(.el-card),
.chart-card :deep(.el-card),
.info-card :deep(.el-card) {
  background: var(--bg-card) !important;
  border: 1px solid var(--border-base) !important;
  border-radius: 14px !important;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-cards :deep(.el-card:hover),
.chart-card :deep(.el-card:hover),
.info-card :deep(.el-card:hover) {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(52, 152, 219, 0.15) !important;
  transform: translateY(-2px);
}

/* ==================== 统计卡片样式 ==================== */
.stat-card {
  padding: 0;
  margin-bottom: 16px;
  border-radius: 14px;
  position: relative;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  padding: 20px;
}

.stat-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 14px 0 0 14px;
}

.stat-card:hover {
  transform: translateY(-3px);
}

/* 设备卡片 - 蓝色渐变 */
.stat-cards :deep(.el-card.device-card)::before {
  background: linear-gradient(180deg, #3498db 0%, #2980b9 100%);
}

.stat-cards :deep(.el-card.device-card:hover) {
  box-shadow: 0 8px 30px rgba(52, 152, 219, 0.2), 0 0 20px rgba(52, 152, 219, 0.1) !important;
}

/* 通道卡片 - 紫色渐变 */
.stat-cards :deep(.el-card.channel-card)::before {
  background: linear-gradient(180deg, #8b5cf6 0%, #6d28d9 100%);
}

.stat-cards :deep(.el-card.channel-card:hover) {
  box-shadow: 0 8px 30px rgba(139, 92, 246, 0.2), 0 0 20px rgba(139, 92, 246, 0.1) !important;
}

/* 规则卡片 - 绿色渐变 */
.stat-cards :deep(.el-card.rule-card)::before {
  background: linear-gradient(180deg, #27ae60 0%, #229954 100%);
}

.stat-cards :deep(.el-card.rule-card:hover) {
  box-shadow: 0 8px 30px rgba(39, 174, 96, 0.2), 0 0 20px rgba(39, 174, 96, 0.1) !important;
}

/* 告警卡片 - 红色渐变 + 发光 */
.stat-cards :deep(.el-card.alert-card-highlight)::before {
  background: linear-gradient(180deg, #e74c3c 0%, #c0392b 100%);
}

.stat-cards :deep(.el-card.alert-card-highlight:hover) {
  box-shadow: 0 8px 30px rgba(231, 76, 60, 0.25), 0 0 25px rgba(231, 76, 60, 0.15) !important;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.stat-icon::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 55%);
  pointer-events: none;
}

.stat-icon .icon-svg {
  width: 32px;
  height: 32px;
  color: #ffffff;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.35));
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-cards :deep(.el-card:hover) .icon-svg {
  transform: scale(1.08);
}

/* 告警图标 - 声波扩散动画 */
.stat-icon.alerts .icon-wave {
  opacity: 0.85;
  transform-origin: center;
  animation: alert-wave 2s ease-in-out infinite;
}
.stat-icon.alerts .wave-1 { animation-delay: 0s; }
.stat-icon.alerts .wave-2 { animation-delay: 0.3s; }

@keyframes alert-wave {
  0%, 100% { opacity: 0.85; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.15); }
}

/* 设备图标 - 脉冲呼吸动画 */
.stat-icon.devices .icon-pulse {
  animation: pulse-ring 2s ease-in-out infinite;
}
.stat-icon.devices .icon-pulse-dot {
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-ring {
  0%, 100% { opacity: 0.9; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* 通道图标 - 信号环扩散动画 */
.stat-icon.channels .icon-ring {
  transform-origin: 12px 12px;
  animation: signal-ring 2.5s ease-out infinite;
}
.stat-icon.channels .ring-1 { animation-delay: 0s; }
.stat-icon.channels .ring-2 { animation-delay: 0.4s; }

@keyframes signal-ring {
  0% { opacity: 0.9; transform: scale(0.9); }
  100% { opacity: 0; transform: scale(1.25); }
}

/* 规则图标 - 闪电闪烁动画 */
.stat-icon.rules .icon-bolt {
  transform-origin: center;
  animation: bolt-flash 2s ease-in-out infinite;
}
.stat-icon.rules .bolt-2 {
  animation: bolt-flash 2s ease-in-out infinite 0.15s;
  opacity: 0.5;
}
.stat-icon.rules .icon-ring {
  animation: ring-spin 4s linear infinite;
  transform-origin: 12px 12px;
}

@keyframes bolt-flash {
  0%, 90%, 100% { transform: scale(1); opacity: 1; }
  93% { transform: scale(1.15); opacity: 0.7; }
  96% { transform: scale(0.95); opacity: 1; }
}

@keyframes ring-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 告警卡片装饰圆点 */
.stat-icon .icon-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
}
.stat-icon .dot-1 {
  top: 10px;
  right: 12px;
  animation: dot-pulse 1.5s ease-in-out infinite;
}
.stat-icon .dot-2 {
  bottom: 12px;
  left: 10px;
  animation: dot-pulse 1.5s ease-in-out infinite 0.5s;
}

@keyframes dot-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}

/* 告警图标 - 红橙渐变 + 发光扫光 */
.stat-icon.alerts {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 40%, #c44569 100%);
  box-shadow: 0 6px 20px rgba(238, 90, 111, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.stat-cards :deep(.el-card:hover) .stat-icon.alerts {
  box-shadow: 0 8px 28px rgba(238, 90, 111, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

/* 设备图标 - 青蓝渐变 + 电光感 */
.stat-icon.devices {
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 55%, #0052d4 100%);
  box-shadow: 0 6px 20px rgba(58, 123, 213, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.stat-cards :deep(.el-card:hover) .stat-icon.devices {
  box-shadow: 0 8px 28px rgba(58, 123, 213, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

/* 通道图标 - 紫粉渐变 + 魔幻感 */
.stat-icon.channels {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #8b5cf6 100%);
  box-shadow: 0 6px 20px rgba(168, 85, 247, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.stat-cards :deep(.el-card:hover) .stat-icon.channels {
  box-shadow: 0 8px 28px rgba(168, 85, 247, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

/* 规则图标 - 青绿渐变 + 活力感 */
.stat-icon.rules {
  background: linear-gradient(135deg, #11d3bc 0%, #20bf6b 55%, #0fb9b1 100%);
  box-shadow: 0 6px 20px rgba(32, 191, 107, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.stat-cards :deep(.el-card:hover) .stat-icon.rules {
  box-shadow: 0 8px 28px rgba(32, 191, 107, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.stat-content {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
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
.chart-card :deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light) !important;
  position: relative;
}

.chart-card :deep(.el-card__header)::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 80px;
  background: linear-gradient(90deg, var(--color-primary) 0%, transparent 100%);
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

/* ==================== 信息面板样式 ==================== */
.info-card {
  border-radius: 14px;
  height: 100%;
}

.info-card :deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light) !important;
  position: relative;
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
  background: var(--bg-card-s);
  border-radius: 10px;
  border: 1px solid var(--border-light);
  transition: all 0.25s ease;
}

.channel-stat-item:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
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
  border-radius: 10px;
  background: var(--bg-card-s);
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-light);
}

.alert-item:hover {
  transform: translateX(4px);
}

.alert-item.critical {
  background: rgba(231, 76, 60, 0.08);
  border-left: 3px solid var(--color-danger);
}

.alert-item.critical:hover {
  border-color: var(--color-danger);
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.15);
}

.alert-item.warning {
  background: rgba(243, 156, 18, 0.08);
  border-left: 3px solid var(--color-warning);
}

.alert-item.warning:hover {
  border-color: var(--color-warning);
  box-shadow: 0 4px 15px rgba(243, 156, 18, 0.15);
}

.alert-item:not(.critical):not(.warning) {
  border-left: 3px solid var(--color-info);
}

.alert-item:not(.critical):not(.warning):hover {
  border-color: var(--color-primary);
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
  background: var(--bg-card-s);
  border-radius: 10px;
  border: 1px solid var(--border-light);
  transition: all 0.25s ease;
}

.info-item:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
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
  .stat-icon { width: 48px; height: 48px; margin-right: 12px; }
  .stat-icon .icon-svg { width: 26px; height: 26px; }
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
  .stat-icon { width: 56px; height: 56px; }
  .stat-icon .icon-svg { width: 30px; height: 30px; }
  .stat-value { font-size: 26px; }
}

/* 大屏屏幕 (1920px+) */
@media (min-width: 1920px) {
  .dashboard { max-width: 1800px; }
  .stat-card { padding: 20px; }
  .stat-icon { width: 60px; height: 60px; }
  .stat-icon .icon-svg { width: 34px; height: 34px; }
  .stat-value { font-size: 28px; }
}

/* 小屏/平板 (1024px以下) */
@media (max-width: 1023px) {
  .stat-card { padding: 16px; }
  .stat-icon { width: 50px; height: 50px; }
  .stat-icon .icon-svg { width: 28px; height: 28px; }
  .stat-value { font-size: 24px; }
  .resource-gauges { flex-wrap: wrap; }
  .gauge-item { flex: 1; min-width: 80px; }
}

/* 移动端 (768px以下) */
@media (max-width: 768px) {
  .dashboard-toolbar { padding: 0; }
  .update-time { font-size: 12px; }
  .stat-card { padding: 12px; }
  .stat-icon { width: 48px; height: 48px; margin-right: 12px; }
  .stat-icon .icon-svg { width: 26px; height: 26px; }
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
