<template>
  <div class="config-section">
    <div class="section-title">{{ t("componentConfig.textConfig") }}</div>

    <div class="form-group">
      <label>{{ t("componentConfig.content") }}</label>
      <input
        type="text"
        :value="config.content"
        @input="
          updateConfig('content', ($event.target as HTMLInputElement).value)
        "
      />
    </div>

    <div class="subsection-title">{{ t("componentConfig.styleSection") }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.fontSize") }}</label>
        <input
          type="number"
          :value="config.fontSize"
          @input="
            updateConfig('fontSize', +($event.target as HTMLInputElement).value)
          "
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.fontColor") }}</label>
        <el-color-picker
          :model-value="config.fontColor"
          show-alpha
          @change="updateConfig('fontColor', $event)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.fontWeight") }}</label>
        <select
          :value="config.fontWeight"
          @change="
            updateConfig(
              'fontWeight',
              ($event.target as HTMLSelectElement).value as 'normal' | 'bold',
            )
          "
        >
          <option value="normal">
            {{ t("componentConfig.fontWeightNormal") }}
          </option>
          <option value="bold">
            {{ t("componentConfig.fontWeightBold") }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.textAlign") }}</label>
        <select
          :value="config.textAlign"
          @change="
            updateConfig(
              'textAlign',
              ($event.target as HTMLSelectElement).value as
                | 'left'
                | 'center'
                | 'right',
            )
          "
        >
          <option value="left">{{ t("componentConfig.alignLeft") }}</option>
          <option value="center">{{ t("componentConfig.alignCenter") }}</option>
          <option value="right">{{ t("componentConfig.alignRight") }}</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.backgroundColor") }}</label>
        <el-color-picker
          :model-value="config.backgroundColor"
          show-alpha
          @active-change="handleActiveChange"
          @change="handleChange"
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
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useScadaConfig } from "../../../../hooks/useScadaEditor";
import type { ScadaComponent } from "../../../../types";

const { t } = useI18n();

const props = defineProps<{
  component: ScadaComponent;
}>();

const { config, updateConfig } = useScadaConfig(
  props.component as ScadaComponent<"text">,
);

const latestColor = ref<string>("");

watch(
  () => config.value.backgroundColor,
  (val) => {
    latestColor.value = val || "";
  },
  { immediate: true },
);

const handleActiveChange = (val: string | null) => {
  latestColor.value = val || "";
};

const handleChange = (val: string | null) => {
  const isCleared = val === null || val === undefined || val === "";
  updateConfig("backgroundColor", isCleared ? "" : latestColor.value);
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
