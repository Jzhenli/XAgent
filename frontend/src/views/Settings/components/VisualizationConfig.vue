<template>
  <div class="settings-section">
    <div class="settings-header">
      <h3>{{ $t("settings.menu.visualization") }}</h3>
      <div class="settings-header-actions">
        <span class="config-hint-inline save-hint">
          {{ $t("settings.visualization.config_hint") }}
        </span>
        <el-button
          class="save-button"
          type="primary"
          @click="handleSaveVisualization"
          :loading="configLoading"
        >
          {{ $t("settings.general.save_config") }}
        </el-button>
      </div>
    </div>

    <div class="config-group">
      <div class="config-group-title">
        {{ $t("settings.menu.visualization") }}
      </div>
      <el-form
        label-width="140px"
        label-position="left"
        class="settings-form"
        v-loading="configLoading"
      >
        <el-form-item :label="$t('settings.visualization.polling_interval')">
          <el-input-number
            v-model="systemStore.visualizationConfig.pollingInterval"
            class="plain-input-number"
            :min="1000"
            :max="30000"
            :step="500"
          />
          <span class="config-unit">
            {{ $t("settings.visualization.milliseconds") }}
          </span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVisualizationConfig } from '../composables/useVisualizationConfig'

const { systemStore, configLoading, handleSaveVisualization } = useVisualizationConfig()
</script>

<style scoped>
.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.settings-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--text-primary);
}

.settings-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.config-group {
  margin-bottom: 30px;
}

.config-group:last-child {
  margin-bottom: 0;
}

.config-group-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e4e7ed;
}

.config-hint-inline {
  margin-left: 12px;
  font-size: 12px;
  color: #909399;
}

.config-unit {
  margin-left: 8px;
  color: var(--text-secondary);
  font-size: 14px;
}

.save-hint {
  margin-left: 12px;
}

.settings-form {
  max-width: 600px;
}

.settings-form :deep(.el-loading-mask) {
  background-color: transparent !important;
}

:deep(.el-input-number.plain-input-number) {
  width: 180px;
}

:deep(.el-input-number.plain-input-number .el-input__wrapper) {
  box-shadow: none !important;
  border: none !important;
  border-bottom: 1px solid var(--border-base, #dcdfe6) !important;
  border-radius: 0 !important;
  background: transparent !important;
  padding: 0 8px;
}

:deep(.el-input-number.plain-input-number .el-input__wrapper.is-focus) {
  border-bottom-color: var(--color-primary, #409eff) !important;
}

:deep(.el-input-number.plain-input-number .el-input__inner) {
  background: transparent !important;
  color: var(--text-primary);
  height: 32px;
  line-height: 32px;
  text-align: center;
}

:deep(.el-input-number.plain-input-number .el-input-number__decrease),
:deep(.el-input-number.plain-input-number .el-input-number__increase) {
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 18px;
  width: 28px;
  height: auto;
}

:deep(.el-input-number.plain-input-number .el-input-number__decrease:hover),
:deep(.el-input-number.plain-input-number .el-input-number__increase:hover) {
  color: var(--color-primary);
}

:deep(.el-input-number.plain-input-number .el-input-number__decrease:focus-visible),
:deep(.el-input-number.plain-input-number .el-input-number__increase:focus-visible),
:deep(.el-input-number.plain-input-number .el-input-number__decrease:active),
:deep(.el-input-number.plain-input-number .el-input-number__increase:active) {
  outline: none;
  box-shadow: none;
}

@media (min-width: 1025px) and (max-width: 1366px) {
  .settings-header h3 {
    font-size: 16px;
  }

  .settings-form {
    max-width: 100%;
  }

  :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  :deep(.el-form-item__label) {
    font-size: 13px;
  }
}
</style>