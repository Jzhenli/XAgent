<template>
  <div class="dashboard">
    <DashboardSkeleton
      v-show="showSkeleton"
      :is-mobile="isMobile"
      :stat-card-span="statCardSpan"
      :info-col-span="infoColSpan"
    />

    <!-- ==================== 主内容区 ==================== -->
    <div
      v-show="showContent"
      class="dashboard-content"
      role="region"
      :aria-busy="!showContent"
      :aria-label="$t('dashboard.ariaDashboardContent')"
    >
      <DashboardToolbar
        :last-update-time="lastUpdateTime"
        :refreshing="refreshing"
        @refresh="refreshData"
      />

      <StatCards
        :stat-card-span="statCardSpan"
        :is-mobile="isMobile"
      />

      <DataChart :chart-height="chartHeight" :refresh-key="chartRefreshKey" />

      <el-row :gutter="isMobile ? 12 : 16" class="info-row">
        <el-col :span="infoColSpan">
          <SystemResource />
        </el-col>
        <el-col :span="infoColSpan" :class="{ 'mt-20': isMobile }">
          <ChannelUploadStats />
        </el-col>
      </el-row>

      <el-row :gutter="isMobile ? 12 : 16" class="info-row">
        <el-col :span="infoColSpan">
          <LatestAlerts />
        </el-col>
        <el-col :span="infoColSpan" :class="{ 'mt-20': isMobile }">
          <SystemInfo />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onActivated, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

import { useDeviceStore } from '@/stores/devices'
import { useRuleStore } from '@/stores/rules'
import { useAlertStore } from '@/stores/alerts'
import { useSystemStore } from '@/stores/system'
import { useChannelStore } from '@/stores/channels'

import { useResponsive } from '@/utils/useResponsive'

import DashboardSkeleton from './components/DashboardSkeleton.vue'
import DashboardToolbar from './components/DashboardToolbar.vue'
import StatCards from './components/StatCards.vue'
import DataChart from './components/DataChart.vue'
import SystemResource from './components/SystemResource.vue'
import ChannelUploadStats from './components/ChannelUploadStats.vue'
import LatestAlerts from './components/LatestAlerts.vue'
import SystemInfo from './components/SystemInfo.vue'

defineOptions({ name: 'Dashboard' })

const { t } = useI18n()
const deviceStore = useDeviceStore()
const ruleStore = useRuleStore()
const alertStore = useAlertStore()
const systemStore = useSystemStore()
const channelStore = useChannelStore()
const { isTablet, isMobile, isSmallTablet, isMediumTablet } = useResponsive()

/* ==================== 响应式布局计算 ==================== */

/** 统计卡片列宽：移动端整行、平板半行、桌面1/4行 */
const statCardSpan = computed(() => {
  if (isMobile.value) return 24
  if (isTablet.value) return 12
  return 6
})

/** 信息面板列宽：移动端整行、其他半行 */
const infoColSpan = computed(() => {
  if (isMobile.value) return 24
  return 12
})

/** 图表高度随屏幕尺寸适配 */
const chartHeight = computed(() => {
  if (isMobile.value) return 300
  if (isSmallTablet.value) return 280
  if (isMediumTablet.value) return 360
  return 420
})

/* ==================== 页面状态 ==================== */

const lastUpdateTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const refreshing = ref(false)
const showContent = ref(false)
const showSkeleton = ref(true)
const isInitialized = ref(false)
/** 图表刷新Key：自增时触发 DataChart 重新拉取数据 */
const chartRefreshKey = ref(0)

/* ==================== 数据协调 ==================== */

/** 更新最后刷新时间戳 */
function updateLastTime() {
  lastUpdateTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
}

/** 并行拉取所有 store 数据，单个请求失败不影响其他请求 */
async function fetchAllData() {
  try {
    const results = await Promise.allSettled([
      deviceStore.fetchDevices(),
      deviceStore.fetchConnectionStatus(),
      ruleStore.fetchRules(),
      alertStore.fetchAlerts(),
      channelStore.fetchChannels(),
      systemStore.fetchAllStats()
    ])
    const failedRequests = results.filter(r => r.status === 'rejected')
    if (failedRequests.length > 0) {
      console.warn('Some requests failed:', failedRequests)
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
    ElMessage.error(t('dashboard.dataLoadFailed'))
  }
}

/** 静默刷新：不加 loading 状态、不弹提示，用于 keep-alive 激活和有缓存数据时 */
async function refreshInBackground() {
  try {
    await fetchAllData()
    updateLastTime()
    chartRefreshKey.value++
  } catch (error) {
    console.error('Failed to refresh data:', error)
  }
}

/** 手动刷新：带 loading 状态和成功提示 */
async function refreshData() {
  if (refreshing.value) return
  refreshing.value = true
  try {
    await fetchAllData()
    updateLastTime()
    chartRefreshKey.value++
    ElMessage.success(t('dashboard.dataRefreshed'))
  } finally {
    refreshing.value = false
  }
}

/* ==================== 生命周期 ==================== */

onMounted(async () => {
  // 若 store 已有缓存数据，直接展示内容并静默刷新
  const hasCacheData = deviceStore.devices.length > 0 ||
                       ruleStore.rules.length > 0 ||
                       alertStore.alerts.length > 0 ||
                       systemStore.stats.totalReadings > 0

  if (hasCacheData) {
    showSkeleton.value = false
    showContent.value = true
    isInitialized.value = true
    refreshInBackground()
    return
  }

  // 首次加载：等待数据就绪后通过 rFrame 平滑过渡到内容区
  try {
    await fetchAllData()
    updateLastTime()
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

/** keep-alive 重新激活时静默刷新数据 */
onActivated(async () => {
  if (isInitialized.value) {
    showSkeleton.value = false
    showContent.value = true
    refreshInBackground()
  }
})
</script>

<style scoped>
.dashboard {
  padding: 0;
  max-width: 1600px;
  margin: 0 auto;
}

.dashboard-content {
  width: 100%;
}

.info-row {
  margin-bottom: 16px;
  display: flex;
  align-items: stretch;
}

.info-row > .el-col {
  display: flex;
}

.info-row > .el-col > * {
  flex: 1;
  height: 280px;
}

.info-row :deep(.el-card) {
  background: var(--bg-card) !important;
  border: 1px solid var(--border-base) !important;
  border-radius: 16px !important;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.info-row :deep(.el-card:hover) {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(52, 152, 219, 0.15) !important;
  transform: translateY(-2px);
}

.mt-20 { margin-top: 20px; }

@media (max-width: 768px) {
  .dashboard { padding: 0 12px; }
  
  .info-row > .el-col > * {
    height: 240px;
  }
}
</style>