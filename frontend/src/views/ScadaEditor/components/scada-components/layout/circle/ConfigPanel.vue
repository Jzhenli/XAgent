<template>
  <div class="config-section">
    <div class="section-title">{{ t("componentConfig.circleConfig") }}</div>

    <div class="subsection-title">{{ t("componentConfig.styleSection") }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.backgroundColor") }}</label>
        <el-color-picker
          :model-value="config.backgroundColor"
          show-alpha
          @active-change="handleBackgroundActiveChange"
          @change="handleBackgroundChange"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.borderWidth") }}</label>
        <input
          type="number"
          :value="config.borderWidth"
          @input="
            updateConfig(
              'borderWidth',
              +($event.target as HTMLInputElement).value,
            )
          "
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.borderColor") }}</label>
        <el-color-picker
          :model-value="config.borderColor"
          show-alpha
          @active-change="handleBorderActiveChange"
          @change="handleBorderChange"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.blur") }}</label>
        <input
          type="number"
          min="0"
          :value="config.blur"
          @input="
            updateConfig(
              'blur',
              +($event.target as HTMLInputElement).value,
            )
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useScadaConfig } from "../../../../hooks/useScadaEditor";
import type { ScadaComponent } from "../../../../types";

const { t } = useI18n();

const props = defineProps<{
  component: ScadaComponent;
}>();

const { config, updateConfig } = useScadaConfig(
  props.component as ScadaComponent<"circle">,
);

const latestBackgroundColor = ref<string>("");
const latestBorderColor = ref<string>("");

watch(
  () => config.value.backgroundColor,
  (val) => {
    latestBackgroundColor.value = val || "";
  },
  { immediate: true },
);

watch(
  () => config.value.borderColor,
  (val) => {
    latestBorderColor.value = val || "";
  },
  { immediate: true },
);

const handleBackgroundActiveChange = (val: string | null) => {
  latestBackgroundColor.value = val || "";
};

const handleBackgroundChange = (val: string | null) => {
  const isCleared = val === null || val === undefined || val === "";
  updateConfig("backgroundColor", isCleared ? "" : latestBackgroundColor.value);
};

const handleBorderActiveChange = (val: string | null) => {
  latestBorderColor.value = val || "";
};

const handleBorderChange = (val: string | null) => {
  const isCleared = val === null || val === undefined || val === "";
  updateConfig("borderColor", isCleared ? "" : latestBorderColor.value);
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
  background-color: var(--bg-input);
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
