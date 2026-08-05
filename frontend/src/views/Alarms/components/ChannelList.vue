<template>
  <div class="channels-section">
    <div v-if="channels.length === 0" class="empty-channels">
      <el-empty :description="t('alerts.noChannels')">
        <template #image>
          <div class="empty-icon">🔔</div>
        </template>
      </el-empty>
    </div>

    <div v-else class="channel-grid">
      <ChannelCard
        v-for="channel in channels"
        :key="channel.id"
        :channel="channel"
        :can-update="canUpdate"
        @toggle="emit('toggle', $event)"
        @configure="emit('configure', $event)"
        @test="emit('test', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()
</script>

<style scoped>
.channels-section {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.channel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  padding-bottom: 16px;
}

.empty-channels {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 300px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

/* ========== 响应式 ========== */
@media (max-width: 1200px) {
  .channel-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .channel-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
