<template>
  <div class="config-section">
    <div class="section-title">{{ t("componentConfig.numberConfig") }}</div>

    <div class="subsection-title">{{ t("componentConfig.dataSection") }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.currentValue") }}</label>
        <input
          type="number"
          :value="config.value"
          @change="
            updateConfig('value', +($event.target as HTMLInputElement).value)
          "
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.decimalPlaces") }}</label>
        <input
          type="number"
          min="0"
          :value="config.decimalPlaces"
          @change="
            updateConfig(
              'decimalPlaces',
              +($event.target as HTMLInputElement).value,
            )
          "
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.unit") }}</label>
        <input
          type="text"
          :value="config.unit"
          @input="
            updateConfig('unit', ($event.target as HTMLInputElement).value)
          "
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group form-group--switch">
        <label>{{ t("componentConfig.showTitle") }}</label>
        <el-switch
          :model-value="config.showTitle"
          @change="updateConfig('showTitle', $event as boolean)"
        />
      </div>
      <div v-if="config.showTitle" class="form-group">
        <label>{{ t("componentConfig.title") }}</label>
        <input
          type="text"
          :value="config.title"
          @input="
            updateConfig('title', ($event.target as HTMLInputElement).value)
          "
        />
      </div>
    </div>

    <div class="subsection-title">{{ t("componentConfig.styleSection") }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.numberTitleFontSize") }}</label>
        <input
          type="number"
          min="1"
          :value="config.titleFontSize"
          @change="
            updateConfig(
              'titleFontSize',
              +($event.target as HTMLInputElement).value,
            )
          "
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.titleFontColor") }}</label>
        <el-color-picker
          :model-value="config.titleFontColor"
          show-alpha
          @active-change="handleColorActiveChange('titleFontColor', $event)"
          @change="handleColorChange('titleFontColor', $event)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.fontSize") }}</label>
        <input
          type="number"
          min="1"
          :value="config.fontSize"
          @change="
            updateConfig('fontSize', +($event.target as HTMLInputElement).value)
          "
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.fontColor") }}</label>
        <el-color-picker
          :model-value="config.fontColor"
          show-alpha
          @active-change="handleColorActiveChange('fontColor', $event)"
          @change="handleColorChange('fontColor', $event)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.numberUnitFontSize") }}</label>
        <input
          type="number"
          min="1"
          :value="config.unitFontSize"
          @change="
            updateConfig(
              'unitFontSize',
              +($event.target as HTMLInputElement).value,
            )
          "
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.numberUnitFontColor") }}</label>
        <el-color-picker
          :model-value="config.unitFontColor"
          show-alpha
          @active-change="handleColorActiveChange('unitFontColor', $event)"
          @change="handleColorChange('unitFontColor', $event)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.textAlign") }}</label>
        <el-select
          :model-value="config.textAlign"
          class="scada-select"
          popper-class="scada-select-dropdown"
          @update:model-value="updateConfig('textAlign', $event as NumberComponentConfig['textAlign'])"
        >
          <el-option value="left" :label="t('componentConfig.alignLeft')" />
          <el-option value="center" :label="t('componentConfig.alignCenter')" />
          <el-option value="right" :label="t('componentConfig.alignRight')" />
        </el-select>
      </div>
      <div class="form-group"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useScadaConfig } from "../../../../hooks/useScadaEditor";
import type { ScadaComponent, NumberComponentConfig } from "../../../../types";

const { t } = useI18n();

const props = defineProps<{
  component: ScadaComponent;
}>();

const { config, updateConfig } = useScadaConfig(
  props.component as ScadaComponent<"number">,
);

type ColorField = keyof Pick<
  NumberComponentConfig,
  "titleFontColor" | "fontColor" | "unitFontColor"
>;

const colorFields: ColorField[] = [
  "titleFontColor",
  "fontColor",
  "unitFontColor",
];

const latestColor = ref<Record<ColorField, string>>({
  titleFontColor: "",
  fontColor: "",
  unitFontColor: "",
});

watch(
  () => colorFields.map((field) => config.value[field]),
  (values) => {
    colorFields.forEach((field, index) => {
      latestColor.value[field] = (values[index] as string) || "";
    });
  },
  { immediate: true },
);

const handleColorActiveChange = (field: ColorField, val: string | null) => {
  latestColor.value[field] = val || "";
};

const handleColorChange = (field: ColorField, val: string | null) => {
  const isCleared = val === null || val === undefined || val === "";
  updateConfig(field, isCleared ? "" : latestColor.value[field]);
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

.form-group input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 6px;
  font-size: 13px;
  background-color: var(--scada-bg-elevated);
  color: var(--text-primary);
}

.form-group input::placeholder {
  color: var(--text-placeholder);
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-group--switch {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.form-group--switch :deep(.el-switch) {
  margin-top: 6px;
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
