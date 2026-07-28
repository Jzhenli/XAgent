<template>
  <div class="settings-section">
    <h3>{{ $t('settings.menu.logs') }}</h3>
    <LogViewer />
  </div>
</template>

<script setup lang="ts">
import LogViewer from '@/components/LogViewer.vue'
</script>

<style scoped>
.settings-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: var(--text-primary);
}

@media (min-width: 1025px) and (max-width: 1366px) {
  .settings-section h3 {
    font-size: 16px;
    margin-bottom: 16px;
  }
}
</style>