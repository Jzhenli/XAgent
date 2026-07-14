<template>
  <div class="config-section">
    <div class="section-title">{{ t("componentConfig.switchConfig") }}</div>

    <div class="subsection-title">{{ t("componentConfig.dataSection") }}</div>
    <div class="form-group">
      <label>{{ t("componentConfig.currentValue") }}</label>
      <select
        :value="currentValueBoolean ? 'true' : 'false'"
        @change="updateBooleanValue($event)"
      >
        <option value="true">{{ t("common.on") }}</option>
        <option value="false">{{ t("common.off") }}</option>
      </select>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.onValue") }}</label>
        <input
          type="text"
          :value="formatValue(config.onValue)"
          @change="
            updateConfig(
              'onValue',
              parseValue(($event.target as HTMLInputElement).value),
            )
          "
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.offValue") }}</label>
        <input
          type="text"
          :value="formatValue(config.offValue)"
          @change="
            updateConfig(
              'offValue',
              parseValue(($event.target as HTMLInputElement).value),
            )
          "
        />
      </div>
    </div>

    <div class="subsection-title">{{ t("componentConfig.styleSection") }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.thumbColor") }}</label>
        <el-color-picker
          :model-value="config.thumbColor"
          show-alpha
          @change="updateConfig('thumbColor', $event)"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.onColor") }}</label>
        <el-color-picker
          :model-value="config.onColor"
          show-alpha
          @change="updateConfig('onColor', $event)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.offColor") }}</label>
        <el-color-picker
          :model-value="config.offColor"
          show-alpha
          @change="updateConfig('offColor', $event)"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.borderRadius") }}</label>
        <input
          type="number"
          :value="config.borderRadius"
          @input="
            updateConfig(
              'borderRadius',
              +($event.target as HTMLInputElement).value,
            )
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import { useScadaConfig } from "../../../../hooks/useScadaEditor";
import type { ScadaComponent } from "../../../../types";

const { t } = useI18n();

const props = defineProps<{
  component: ScadaComponent;
}>();

const { config, updateConfig, updateValue } = useScadaConfig(
  props.component as ScadaComponent<"switch">,
);

const currentValueBoolean = computed(
  () => config.value.value === true || config.value.value === 1,
);

const updateBooleanValue = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value === "true";
  updateValue(value);
};

const parseValue = (raw: string): number | boolean | string => {
  const trimmed = raw.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  const numeric = Number(trimmed);
  if (trimmed !== "" && !isNaN(numeric)) return numeric;
  return trimmed;
};

const formatValue = (
  value: number | boolean | string | undefined | null,
): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
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
  border: 1px solid var(--border-base);
  border-radius: 4px;
  font-size: 13px;
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
