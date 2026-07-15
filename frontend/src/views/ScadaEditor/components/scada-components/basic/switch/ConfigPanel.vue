<template>
  <div class="config-section">
    <div class="section-title">{{ t("componentConfig.switchConfig") }}</div>

    <!-- 数据绑定：通断映射 -->
    <div class="subsection-title">{{ t("componentConfig.dataSection") }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.onValue") }}</label>
        <input v-model.lazy="onValueModel" type="text" />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.offValue") }}</label>
        <input v-model.lazy="offValueModel" type="text" />
      </div>
    </div>

    <!-- 样式：颜色选择器 -->
    <div class="subsection-title">{{ t("componentConfig.styleSection") }}</div>
    <div
      v-for="(group, groupIndex) in colorPickerGroups"
      :key="groupIndex"
      class="form-row"
    >
      <div v-for="item in group" :key="item.key" class="form-group">
        <label>{{ t(item.labelKey) }}</label>
        <el-color-picker
          :model-value="config[item.key]"
          show-alpha
          @change="updateConfig(item.key, $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import { useScadaConfig } from "../../../../hooks/useScadaEditor";
import type { ScadaComponent, ComponentConfig } from "../../../../types";

const { t } = useI18n();

const props = defineProps<{
  component: ScadaComponent;
}>();

const { config, updateConfig } = useScadaConfig(
  props.component as ScadaComponent<"switch">,
);

/** 通值输入框的 v-model 桥接 */
const onValueModel = computed({
  get: () => formatTypedValue(config.value.onValue),
  set: (value: string) => updateConfig("onValue", parseTypedValue(value)),
});

/** 断值输入框的 v-model 桥接 */
const offValueModel = computed({
  get: () => formatTypedValue(config.value.offValue),
  set: (value: string) => updateConfig("offValue", parseTypedValue(value)),
});

/** 颜色选择器配置分组 */
type SwitchConfig = ComponentConfig<"switch">;
type ColorKey = keyof Pick<SwitchConfig, "thumbColor" | "onColor" | "offColor">;

interface ColorPickerItem {
  key: ColorKey;
  labelKey: string;
}

const colorPickerGroups: ColorPickerItem[][] = [
  [
    { key: "thumbColor", labelKey: "componentConfig.thumbColor" },
    { key: "onColor", labelKey: "componentConfig.onColor" },
  ],
  [{ key: "offColor", labelKey: "componentConfig.offColor" }],
];

/**
 * 将用户输入的字符串解析为强类型值。
 * 支持布尔字面量、数字以及普通字符串。
 */
const parseTypedValue = (raw: string): number | boolean | string => {
  const trimmed = raw.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  const numeric = Number(trimmed);
  if (trimmed !== "" && !Number.isNaN(numeric)) return numeric;
  return trimmed;
};

/**
 * 将强类型值格式化为字符串，供文本输入框展示。
 */
const formatTypedValue = (
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
