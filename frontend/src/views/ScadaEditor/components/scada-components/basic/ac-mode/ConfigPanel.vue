<template>
  <div class="config-section">
    <div class="section-title">{{ t("componentConfig.acModeConfig") }}</div>

    <!-- Data binding: current value & mode value mapping -->
    <div class="subsection-title">{{ t("componentConfig.dataSection") }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.acModeCurrentValue") }}</label>
        <input
          type="text"
          :value="config.currentValue"
          @change="
            updateConfig(
              'currentValue',
              parseValue(($event.target as HTMLInputElement).value),
            )
          "
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.acModeCoolValue") }}</label>
        <input
          type="text"
          :value="config.coolValue"
          @change="
            updateConfig(
              'coolValue',
              parseValue(($event.target as HTMLInputElement).value),
            )
          "
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.acModeHeatValue") }}</label>
        <input
          type="text"
          :value="config.heatValue"
          @change="
            updateConfig(
              'heatValue',
              parseValue(($event.target as HTMLInputElement).value),
            )
          "
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.acModeAutoValue") }}</label>
        <input
          type="text"
          :value="config.autoValue"
          @change="
            updateConfig(
              'autoValue',
              parseValue(($event.target as HTMLInputElement).value),
            )
          "
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.acModeFanValue") }}</label>
        <input
          type="text"
          :value="config.fanValue"
          @change="
            updateConfig(
              'fanValue',
              parseValue(($event.target as HTMLInputElement).value),
            )
          "
        />
      </div>
    </div>

    <!-- Style -->
    <div class="subsection-title">{{ t("componentConfig.styleSection") }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.iconSize") }}</label>
        <input
          type="number"
          :value="config.iconSize"
          @change="
            updateConfig('iconSize', +($event.target as HTMLInputElement).value)
          "
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.fontSize") }}</label>
        <input
          type="number"
          :value="config.fontSize"
          @change="
            updateConfig('fontSize', +($event.target as HTMLInputElement).value)
          "
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.fontColor") }}</label>
        <el-color-picker
          :model-value="config.fontColor"
          show-alpha
          @change="updateConfig('fontColor', $event)"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.activeFontColor") }}</label>
        <el-color-picker
          :model-value="config.activeFontColor"
          show-alpha
          @change="updateConfig('activeFontColor', $event)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.iconColor") }}</label>
        <el-color-picker
          :model-value="config.iconColor"
          show-alpha
          @change="updateConfig('iconColor', $event)"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.activeIconColor") }}</label>
        <el-color-picker
          :model-value="config.activeIconColor"
          show-alpha
          @change="updateConfig('activeIconColor', $event)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.backgroundColor") }}</label>
        <el-color-picker
          :model-value="config.backgroundColor"
          show-alpha
          @change="updateConfig('backgroundColor', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useScadaConfig } from "../../../../hooks/useScadaEditor";
import type { ScadaComponent } from "../../../../types";

const { t } = useI18n();

const props = defineProps<{
  component: ScadaComponent;
}>();

const { config, updateConfig } = useScadaConfig(
  props.component as ScadaComponent<"acMode">,
);

const parseValue = (value: string): number | string => {
  const trimmed = value.trim();
  if (trimmed === "") return "";
  const num = Number(trimmed);
  return Number.isNaN(num) ? trimmed : num;
};
</script>

<style scoped>
.config-section {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-light);
}

.config-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-bottom: 10px;
}

.subsection-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 12px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px dashed var(--border-light);
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  font-size: 12px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 6px;
  font-size: 13px;
  background-color: var(--scada-bg-elevated);
  color: var(--text-primary);
}

.form-group input::placeholder,
.form-group select::placeholder {
  color: var(--text-placeholder);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-group :deep(.el-color-picker__trigger) {
  width: 100%;
}

.form-row {
  display: flex;
  gap: 8px;
}

.form-row .form-group {
  flex: 1;
}
</style>
