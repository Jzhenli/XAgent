<template>
  <div class="settings-section">
    <div class="settings-header">
      <h3>{{ $t("settings.menu.general") }}</h3>
      <div class="settings-header-actions">
        <span class="config-hint-inline save-hint">
          {{ $t("settings.general.storage_config_hint") }}
        </span>
        <div
          class="action-btn download"
          :class="{ loading: configLoading }"
          @click="emit('save')"
        >
          <span v-if="configLoading" class="btn-spinner"></span>
          {{ $t("settings.general.save_config") }}
        </div>
        
      </div>
    </div>

    <!-- 日志配置 -->
    <div class="config-group">
      <div class="config-group-title">
        {{ $t("settings.general.log_config_title") }}
      </div>
      <el-form
        label-width="140px"
        label-position="left"
        class="settings-form"
        v-loading="configLoading"
      >
        <!-- 日志级别 -->
        <el-form-item :label="$t('settings.general.log_level')">
          <el-select
            v-model="systemConfig.logging.level"
            class="plain-select"
            popper-class="plain-select-dropdown"
          >
            <el-option
              v-for="level in logLevels"
              :key="level"
              :label="level"
              :value="level"
            />
          </el-select>
          <span class="config-hint-inline">
            {{ $t("settings.general.log_level_hint") }}
          </span>
        </el-form-item>

        <!-- 日志数字配置项 -->
        <el-form-item
          v-for="field in logNumberFields"
          :key="field.key"
          :label="$t(field.labelKey)"
        >
          <el-input-number
            v-model="systemConfig.logging[field.key]"
            class="plain-input-number"
            :min="field.min"
            :max="field.max"
            :step="field.step"
          />
          <span v-if="field.unitKey" class="config-unit">
            {{ $t(field.unitKey) }}
          </span>
        </el-form-item>
      </el-form>
    </div>

    <!-- 存储配置 -->
    <div class="config-group">
      <div class="config-group-title">
        {{ $t("settings.general.storage_config_title") }}
      </div>
      <el-form label-width="140px" label-position="left" class="settings-form">
        <!-- 存储数字配置项 -->
        <el-form-item
          v-for="field in storageFields"
          :key="field.key"
          :label="$t(field.labelKey)"
        >
          <el-input-number
            v-model="systemConfig.storage[field.key]"
            class="plain-input-number"
            :min="field.min"
            :max="field.max"
            :step="field.step"
          />
          <span v-if="field.unitKey && field.hintKey" class="config-unit">
            {{ $t(field.unitKey) }} ({{ $t(field.hintKey) }})
          </span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
/** 日志配置数据结构 */
interface LoggingConfig {
  level: string;
  max_bytes: number;
  backup_count: number;
}

/** 存储配置数据结构 */
interface StorageConfig {
  retention_days: number;
  cleanup_interval: number;
}

/** 通用系统配置数据结构 */
interface SystemConfig {
  logging: LoggingConfig;
  storage: StorageConfig;
}

/** 数字输入框字段元数据 */
interface NumberField<TKey extends string> {
  /** 对应配置对象中的字段名 */
  key: TKey;
  /** i18n 标签键名 */
  labelKey: string;
  /** 最小值 */
  min: number;
  /** 最大值 */
  max: number;
  /** 步长 */
  step: number;
  /** 单位 i18n 键名，可选 */
  unitKey?: string;
  /** 提示文案 i18n 键名，可选 */
  hintKey?: string;
}

const props = defineProps<{
  /** 通用系统配置对象 */
  systemConfig: SystemConfig;
  /** 配置加载/保存状态 */
  configLoading: boolean;
}>();

const emit = defineEmits<{
  /** 保存配置事件 */
  (e: "save"): void;
}>();

/** 可选日志级别列表 */
const logLevels = ["DEBUG", "INFO", "WARNING", "ERROR"] as const;

/** 日志配置中的数字输入项 */
const logNumberFields: NumberField<keyof LoggingConfig>[] = [
  {
    key: "max_bytes",
    labelKey: "settings.general.log_max_size",
    min: 1,
    max: 100,
    step: 1,
    unitKey: "settings.general.unit_mb",
  },
  {
    key: "backup_count",
    labelKey: "settings.general.log_backup_count",
    min: 1,
    max: 20,
    step: 1,
  },
];

/** 存储配置中的数字输入项 */
const storageFields: NumberField<keyof StorageConfig>[] = [
  {
    key: "retention_days",
    labelKey: "settings.general.data_retention",
    min: 0,
    max: 365,
    step: 1,
    unitKey: "settings.general.unit_days",
    hintKey: "settings.general.data_retention_hint",
  },
  {
    key: "cleanup_interval",
    labelKey: "settings.general.cleanup_interval",
    min: 60,
    max: 86400,
    step: 1,
    unitKey: "settings.general.unit_seconds",
    hintKey: "settings.general.cleanup_interval_hint",
  },
];
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

:deep(.el-input-number.plain-input-number),
:deep(.el-select.plain-select) {
  width: 180px;
}

:deep(.el-input-number.plain-input-number .el-input__wrapper),
:deep(.el-select.plain-select .el-select__wrapper) {
  box-shadow: none !important;
  border: none !important;
  border-bottom: 1px solid var(--border-base, #dcdfe6) !important;
  border-radius: 0 !important;
  background: transparent !important;
  padding: 0 8px;
}

:deep(.el-input-number.plain-input-number .el-input__wrapper.is-focus),
:deep(.el-select.plain-select.is-focused .el-select__wrapper) {
  border-bottom-color: var(--color-primary, #409eff) !important;
}

:deep(.el-input-number.plain-input-number .el-input__inner),
:deep(.el-select.plain-select .el-select__selected-item),
:deep(.el-select.plain-select .el-select__placeholder) {
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

:deep(.el-select.plain-select .el-select__suffix),
:deep(.el-select.plain-select .el-input__suffix) {
  color: var(--text-secondary);
}

.settings-header-actions :deep(.el-form-item__label) {
  padding-right: 0;
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

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 80px;
  height: 32px;
  padding: 0 15px;
  font-size: 14px;
  line-height: 1;
  color: var(--text-primary);
  background: var(--bg-color);
  border: 1px solid var(--border-base);
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
}

.action-btn:hover,
.action-btn:active {
  color: var(--text-primary);
  background: var(--bg-color);
  border-color: var(--border-base);
}

.action-btn.download {
  color: #fff;
  background: rgba(102, 102, 255, 1);
  border-color: rgba(102, 102, 255, 1);
}

.action-btn.download:hover,
.action-btn.download:active {
  color: #fff;
  background: rgba(102, 102, 255, 1);
  border-color: rgba(102, 102, 255, 1);
}

.action-btn.loading {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
</style>

<style>
.plain-select-dropdown {
  background: var(--bg-card) !important;
}

.plain-select-dropdown .el-select-dropdown__item {
  text-align: center;
}
</style>
