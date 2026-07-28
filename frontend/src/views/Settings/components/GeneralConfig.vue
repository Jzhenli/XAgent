<template>
  <div class="settings-section">
    <h3>{{ $t('settings.menu.general') }}</h3>

    <div class="config-group">
      <div class="config-group-title">{{ $t('settings.general.log_config_title') }}</div>
      <el-form label-width="140px" class="settings-form" v-loading="configLoading">
        <el-form-item :label="$t('settings.general.log_level')">
          <el-select v-model="systemConfig.logging.level" style="width: 200px">
            <el-option label="DEBUG" value="DEBUG" />
            <el-option label="INFO" value="INFO" />
            <el-option label="WARNING" value="WARNING" />
            <el-option label="ERROR" value="ERROR" />
          </el-select>
          <span class="config-hint-inline">{{ $t('settings.general.log_level_hint') }}</span>
        </el-form-item>

        <el-form-item :label="$t('settings.general.log_max_size')">
          <el-input-number
            v-model="systemConfig.logging.max_bytes"
            :min="1"
            :max="100"
            :step="1"
          />
          <span style="margin-left: 8px; color: var(--text-secondary); font-size: 14px;">{{ $t('settings.general.unit_mb') }}</span>
        </el-form-item>

        <el-form-item :label="$t('settings.general.log_backup_count')">
          <el-input-number
            v-model="systemConfig.logging.backup_count"
            :min="1"
            :max="20"
          />
        </el-form-item>
      </el-form>
    </div>

    <div class="config-group">
      <div class="config-group-title">{{ $t('settings.general.storage_config_title') }}</div>
      <el-form label-width="140px" class="settings-form">
        <el-form-item :label="$t('settings.general.data_retention')">
          <el-input-number
            v-model="systemConfig.storage.retention_days"
            :min="0"
            :max="365"
          />
          <span style="margin-left: 8px; color: var(--text-secondary); font-size: 14px;">{{ $t('settings.general.unit_days') }} ({{ $t('settings.general.data_retention_hint') }})</span>
        </el-form-item>

        <el-form-item :label="$t('settings.general.cleanup_interval')">
          <el-input-number
            v-model="systemConfig.storage.cleanup_interval"
            :min="60"
            :max="86400"
          />
          <span style="margin-left: 8px; color: var(--text-secondary); font-size: 14px;">{{ $t('settings.general.unit_seconds') }} ({{ $t('settings.general.cleanup_interval_hint') }})</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="emit('save')" :loading="configLoading">
            {{ $t('settings.general.save_config') }}
          </el-button>
          <span class="config-hint-inline" style="margin-left: 12px;">{{ $t('settings.general.storage_config_hint') }}</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  systemConfig: {
    logging: {
      level: string
      max_bytes: number
      backup_count: number
    }
    storage: {
      retention_days: number
      cleanup_interval: number
    }
  }
  configLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'save'): void
}>()
</script>

<style scoped>
.config-group {
  margin-bottom: 30px;
}

.config-group:last-child {
  margin-bottom: 0;
}

.settings-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: var(--text-primary);
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

  :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  :deep(.el-form-item__label) {
    font-size: 13px;
  }
}
</style>