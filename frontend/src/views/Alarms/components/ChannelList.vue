<template>
  <div class="channels-section">
    <el-row :gutter="20">
      <el-col
        v-for="channel in channels"
        :key="channel.id"
        :span="channelColSpan"
      >
        <ChannelCard
          :channel="channel"
          :can-update="canUpdate"
          @toggle="emit('toggle', $event)"
          @configure="emit('configure', $event)"
          @test="emit('test', $event)"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useResponsive } from '@/utils/useResponsive'
import type { NotificationChannel } from '@/stores/alerts'
import ChannelCard from './ChannelCard.vue'

defineProps<{
  /** 通知渠道列表 */
  channels: NotificationChannel[]
  /** 是否具备更新权限 */
  canUpdate: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'configure', id: string): void
  (e: 'test', id: string): void
}>()

const { isTablet, isMobile } = useResponsive()

/** 响应式列宽 (移动端满宽 / 平板半宽 / 桌面三分之一) */
const channelColSpan = computed(() => {
  if (isMobile.value) return 24
  if (isTablet.value) return 12
  return 8
})
</script>

<style scoped>
.channels-section {
  padding: 16px 0;
}
</style>
