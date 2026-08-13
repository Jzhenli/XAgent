<template>
  <div
    class="dashboard-skeleton"
    role="region"
    aria-busy="true"
    :aria-label="t('dashboard.ariaContentLoading')"
  >
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

    <el-row :gutter="isMobile ? 12 : 20" class="skeleton-chart-row">
      <el-col :span="24">
        <el-card class="skeleton-chart" shadow="hover">
          <div class="skeleton-chart-header"></div>
          <div class="skeleton-chart-body"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="isMobile ? 12 : 20" class="skeleton-info-row">
      <el-col :span="infoColSpan" v-for="i in 2" :key="i">
        <el-card class="skeleton-info" shadow="hover">
          <div class="skeleton-info-header"></div>
          <div class="skeleton-info-body"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  isMobile: boolean
  statCardSpan: number
  infoColSpan: number
}>()

const { t } = useI18n()
</script>

<!-- 骨架屏：在数据加载完成前展示，结构与主内容区一一对应 -->

<style scoped>
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
</style>
