<template>
  <div class="settings-section">
    <h3>{{ $t('settings.menu.visualization') }}</h3>
    <el-form label-width="160px" class="settings-form">
      <el-form-item :label="$t('settings.visualization.polling_interval')">
        <el-input-number
          v-model="systemStore.visualizationConfig.pollingInterval"
          :min="1000"
          :max="30000"
          :step="500"
        />
        <span style="margin-left: 8px; color: var(--text-secondary); font-size: 14px;">{{ $t('settings.visualization.milliseconds') }}</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSaveVisualization">{{ $t('settings.general.save_config') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useVisualizationConfig } from '../composables/useVisualizationConfig'

const { systemStore, handleSaveVisualization } = useVisualizationConfig()
</script>

<style scoped>
.settings-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: var(--text-primary);
}

.settings-form {
  max-width: 600px;
}

@media (min-width: 1025px) and (max-width: 1366px) {
  .settings-section h3 {
    font-size: 16px;
    margin-bottom: 16px;
  }

  .settings-form {
    max-width: 100%;
  }
}
</style>