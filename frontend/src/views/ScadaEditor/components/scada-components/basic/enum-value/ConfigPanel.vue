<template>
  <div class="config-section">
    <div class="section-title">{{ t("componentConfig.enumValueConfig") }}</div>

    <div class="subsection-title">{{ t("componentConfig.dataSection") }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.currentValue") }}</label>
        <input
          type="text"
          :value="config.value"
          @change="
            updateConfig('value', parseValue(($event.target as HTMLInputElement).value))
          "
        />
      </div>
    </div>

    <div class="subsection-title">{{ t("componentConfig.enumItems") }}</div>
    <div
      v-for="(item, index) in config.enumItems"
      :key="index"
      class="enum-item-row"
    >
      <div class="form-group">
        <label v-if="index === 0">{{ t("componentConfig.enumText") }}</label>
        <input
          type="text"
          :value="item.text"
          @input="updateEnumItem(index, 'text', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label v-if="index === 0">{{ t("componentConfig.enumValue") }}</label>
        <input
          type="text"
          :value="item.value"
          @input="updateEnumItem(index, 'value', parseValue(($event.target as HTMLInputElement).value))"
        />
      </div>
      <button
        type="button"
        class="remove-btn"
        :title="t('componentConfig.removeEnumItem')"
        @click="removeEnumItem(index)"
      >
        ×
      </button>
    </div>
    <button type="button" class="add-btn" @click="addEnumItem">
      {{ t("componentConfig.addEnumItem") }}
    </button>

    <div class="subsection-title">{{ t("componentConfig.styleSection") }}</div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useScadaConfig } from "../../../../hooks/useScadaEditor";
import type { ScadaComponent, EnumValueComponentConfig } from "../../../../types";

const { t } = useI18n();

const props = defineProps<{
  component: ScadaComponent;
}>();

const { config, updateConfig } = useScadaConfig(
  props.component as ScadaComponent<"enum-value">,
);

const parseValue = (value: string): number | string => {
  const trimmed = value.trim();
  if (trimmed === "") return "";
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? trimmed : parsed;
};

const updateEnumItem = (
  index: number,
  field: "text" | "value",
  value: string | number,
) => {
  const items = [...(config.value.enumItems ?? [])];
  items[index] = { ...items[index], [field]: value };
  updateConfig("enumItems", items);
};

const addEnumItem = () => {
  const items = [...(config.value.enumItems ?? [])];
  const nextValue = items.length > 0 ? Math.max(...items.map((item) => Number(item.value) || 0)) + 1 : 1;
  items.push({ text: "", value: nextValue });
  updateConfig("enumItems", items);
};

const removeEnumItem = (index: number) => {
  const items = [...(config.value.enumItems ?? [])];
  items.splice(index, 1);
  updateConfig("enumItems", items);
};

type ColorField = keyof Pick<EnumValueComponentConfig, "fontColor">;

const colorFields: ColorField[] = ["fontColor"];

const latestColor = ref<Record<ColorField, string>>({
  fontColor: "",
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

.enum-item-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.enum-item-row .form-group {
  flex: 1;
  margin-bottom: 6px;
}

.remove-btn {
  width: 28px;
  height: 28px;
  margin-bottom: 6px;
  padding: 0;
  border: 1px solid var(--border-base);
  border-radius: 4px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.remove-btn:hover {
  color: var(--color-danger);
  border-color: var(--color-danger);
}

.add-btn {
  width: 100%;
  padding: 6px 8px;
  border: 1px dashed var(--border-base);
  border-radius: 4px;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 13px;
}

.add-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
</style>
