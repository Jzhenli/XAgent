<template>
  <div class="config-section">
    <div class="section-title">{{ t("componentConfig.gaugeConfig") }}</div>

    <!-- 数据配置 -->
    <div class="subsection-title">{{ t("componentConfig.dataSection") }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.currentValue") }}</label>
        <input
          type="number"
          :value="config.value"
          @change="updateConfig('value', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.unit") }}</label>
        <input
          type="text"
          :value="config.unit"
          @input="updateConfig('unit', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.minValue") }}</label>
        <input
          type="number"
          :value="config.min"
          @change="updateConfig('min', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.maxValue") }}</label>
        <input
          type="number"
          :value="config.max"
          @change="updateConfig('max', +($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group form-group--switch">
        <label>{{ t("componentConfig.showButtons") }}</label>
        <el-switch
          :model-value="config.showButtons"
          @change="updateConfig('showButtons', $event as boolean)"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.step") }}</label>
        <input
          type="number"
          min="0"
          step="0.1"
          :value="config.step"
          @change="updateConfig('step', +($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <!-- 样式配置 -->
    <div class="subsection-title">{{ t("componentConfig.styleSection") }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.trackWidth") }}</label>
        <input
          type="number"
          min="1"
          :value="config.trackWidth"
          @change="updateConfig('trackWidth', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.trackColor") }}</label>
        <el-color-picker
          :model-value="config.trackColor"
          show-alpha
          @active-change="handleColorActiveChange('trackColor', $event)"
          @change="handleColorChange('trackColor', $event)"
        />
      </div>
    </div>

    <!-- 填充渐变色 -->
    <div class="form-row">
      <div class="form-group form-group--gradient-title">
        <label>{{ t("componentConfig.fillBackgroundColor") }}</label>
      </div>
    </div>
    <div class="form-row form-row--gradient-pickers">
      <div class="form-group form-group--gradient-pickers-inner">
        <el-color-picker
          v-for="(_, index) in gradientColors"
          :key="index"
          :model-value="gradientColors[index]"
          show-alpha
          @active-change="handleGradientActiveChange(index, $event)"
          @change="handleGradientChange(index, $event)"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.strokeLinecap") }}</label>
        <select
          :value="config.strokeLinecap"
          @change="
            updateConfig(
              'strokeLinecap',
              ($event.target as HTMLSelectElement).value as 'butt' | 'round' | 'square',
            )
          "
        >
          <option value="butt">{{ t("componentConfig.strokeLinecapButt") }}</option>
          <option value="round">{{ t("componentConfig.strokeLinecapRound") }}</option>
          <option value="square">{{ t("componentConfig.strokeLinecapSquare") }}</option>
        </select>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.fontSize") }}</label>
        <input
          type="number"
          min="1"
          :value="config.fontSize"
          @change="updateConfig('fontSize', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.unitFontSize") }}</label>
        <input
          type="number"
          min="1"
          :value="config.unitFontSize"
          @change="updateConfig('unitFontSize', +($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.fontColor") }}</label>
        <el-color-picker
          :model-value="config.fontColor"
          show-alpha
          @active-change="handleColorActiveChange('fontColor', $event)"
          @change="handleColorChange('fontColor', $event)"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.unitFontColor") }}</label>
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
          <option value="normal">{{ t("componentConfig.fontWeightNormal") }}</option>
          <option value="bold">{{ t("componentConfig.fontWeightBold") }}</option>
        </select>
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.unitFontWeight") }}</label>
        <select
          :value="config.unitFontWeight"
          @change="
            updateConfig(
              'unitFontWeight',
              ($event.target as HTMLSelectElement).value as 'normal' | 'bold',
            )
          "
        >
          <option value="normal">{{ t("componentConfig.fontWeightNormal") }}</option>
          <option value="bold">{{ t("componentConfig.fontWeightBold") }}</option>
        </select>
      </div>
    </div>

    <div v-if="config.showButtons" class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.stepFontSize") }}</label>
        <input
          type="number"
          min="1"
          :value="config.stepFontSize"
          @change="updateConfig('stepFontSize', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.stepFontColor") }}</label>
        <el-color-picker
          :model-value="config.stepFontColor"
          show-alpha
          @active-change="handleColorActiveChange('stepFontColor', $event)"
          @change="handleColorChange('stepFontColor', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useScadaConfig } from "../../../../hooks/useScadaEditor";
import type { ScadaComponent, GaugeComponentConfig } from "../../../../types";

const { t } = useI18n();

const props = defineProps<{
  component: ScadaComponent;
}>();

const { config, updateConfig } = useScadaConfig(
  props.component as ScadaComponent<"gauge">,
);

/** 支持颜色选择器清除/确认的单色字段 */
type ColorField = keyof Pick<
  GaugeComponentConfig,
  "trackColor" | "fontColor" | "stepFontColor" | "unitFontColor"
>;

const colorFields: ColorField[] = [
  "trackColor",
  "fontColor",
  "stepFontColor",
  "unitFontColor",
];

/** 颜色面板交互过程中缓存的最新值（用于处理清空色值时回写空字符串） */
const latestColor = ref<Record<ColorField, string>>({
  trackColor: "",
  fontColor: "",
  stepFontColor: "",
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

/** 当前填充渐变色，缺失时回退到 fillColor */
const gradientColors = computed(() => {
  const gradient = (config.value as GaugeComponentConfig).fillGradient;
  if (gradient && gradient.length === 3) return gradient;
  const fallback = (config.value as GaugeComponentConfig).fillColor ?? "#4a90e2";
  return [fallback, fallback, fallback];
});

/** 颜色面板交互过程中缓存的渐变值 */
const latestGradientColors = ref<string[]>(["#4a90e2", "#4a90e2", "#4a90e2"]);

watch(
  gradientColors,
  (values) => {
    latestGradientColors.value = [...values];
  },
  { immediate: true },
);

const handleGradientActiveChange = (index: number, val: string | null) => {
  latestGradientColors.value[index] = val || "";
};

const handleGradientChange = (index: number, val: string | null) => {
  const isCleared = val === null || val === undefined || val === "";
  const newColors = [...latestGradientColors.value];
  newColors[index] = isCleared ? "" : latestGradientColors.value[index];
  updateConfig("fillGradient", newColors);
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

.form-group--gradient-title {
  margin-bottom: 4px;
}

.form-row--gradient-pickers {
  align-items: flex-start;
}

.form-group--gradient-pickers-inner {
  display: flex;
  gap: 4px;
}

.form-group--gradient-pickers-inner :deep(.el-color-picker) {
  flex: 1;
}
</style>
