<template>
  <div class="dashboard-toolbar">
    <div class="toolbar-right">
      <el-button
        :icon="RefreshRight"
        @click="handleRefresh"
        :loading="refreshing"
        circle
        size="small"
        :title="$t('dashboard.refreshData')"
      />
      <span class="update-time">{{ $t('dashboard.lastUpdate') }}: {{ lastUpdateTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RefreshRight } from '@element-plus/icons-vue'

defineProps<{
  lastUpdateTime: string
  refreshing: boolean
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

/** 点击刷新按钮，向父组件抛出 refresh 事件 */
function handleRefresh() {
  emit('refresh')
}
</script>

<style scoped>
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
</style>