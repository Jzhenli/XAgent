<template>
  <div class="config-section">
    <div class="section-title">{{ t("componentConfig.textConfig") }}</div>

    <div class="form-group">
      <label>{{ t("componentConfig.content") }}</label>
      <textarea
        :value="config.content"
        rows="3"
        @input="
          updateConfig('content', ($event.target as HTMLTextAreaElement).value)
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
        <el-select
          :model-value="config.fontWeight"
          class="scada-select"
          popper-class="scada-select-dropdown"
          @update:model-value="
            updateConfig('fontWeight', $event as 'normal' | 'bold')
          "
        >
          <el-option
            value="normal"
            :label="t('componentConfig.fontWeightNormal')"
          />
          <el-option
            value="bold"
            :label="t('componentConfig.fontWeightBold')"
          />
        </el-select>
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.rotation") }}</label>
        <div class="rotation-input">
          <input
            type="number"
            :value="config.rotation ?? 0"
            step="1"
            min="-180"
            max="180"
            @input="
              updateConfig(
                'rotation',
                clampRotation(($event.target as HTMLInputElement).value),
              )
            "
          />
          <span class="rotation-unit">°</span>
        </div>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.textAlign") }}</label>
        <el-select
          :model-value="config.textAlign"
          class="scada-select"
          popper-class="scada-select-dropdown"
          @update:model-value="
            updateConfig('textAlign', $event as 'left' | 'center' | 'right')
          "
        >
          <el-option value="left" :label="t('componentConfig.alignLeft')" />
          <el-option value="center" :label="t('componentConfig.alignCenter')" />
          <el-option value="right" :label="t('componentConfig.alignRight')" />
        </el-select>
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.skewDirection") }}</label>
        <el-select
          :model-value="skewPreset"
          class="scada-select"
          popper-class="scada-select-dropdown"
          @update:model-value="applySkewPreset"
        >
          <el-option value="normal" :label="t('componentConfig.skewNormal')" />
          <el-option value="left" :label="t('componentConfig.skewLeft')" />
          <el-option value="right" :label="t('componentConfig.skewRight')" />
        </el-select>
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
import { ref, computed, watch } from "vue";
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

/** 把旋转角度限制在 [-180, 180] 范围内 */
function clampRotation(value: string): number {
  const num = Number.parseFloat(value);
  if (Number.isNaN(num)) return 0;
  return Math.max(-180, Math.min(180, num));
}

/** 左/右倾斜预设角度（degrees） */
const LEFT_SKEW = -15;
const RIGHT_SKEW = 15;

type SkewPreset = "normal" | "left" | "right";

/** 根据 config.skewX 反推出下拉选中值（兼容已有任意值） */
const skewPreset = computed<SkewPreset>(() => {
  const v = config.value.skewX ?? 0;
  if (v === 0) return "normal";
  if (Math.abs(v - LEFT_SKEW) < 0.5) return "left";
  if (Math.abs(v - RIGHT_SKEW) < 0.5) return "right";
  // 非预设值（兼容旧数据或将来手动设置），就近归档
  return v < 0 ? "left" : "right";
});

/** 下拉选择 → 写入 config.skewX */
function applySkewPreset(preset: SkewPreset) {
  const map: Record<SkewPreset, number> = {
    normal: 0,
    left: LEFT_SKEW,
    right: RIGHT_SKEW,
  };
  updateConfig("skewX", map[preset]);
}
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
.form-group textarea {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 6px;
  font-size: 13px;
  background-color: var(--scada-bg-elevated);
  color: var(--text-primary);
  font-family: inherit;
  box-sizing: border-box;
  resize: vertical;
}

.form-group textarea {
  line-height: 1.4;
  min-height: 60px;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--text-placeholder);
}

.form-group input:focus,
.form-group textarea:focus {
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

.rotation-input {
  position: relative;
  width: 100%;
}

.rotation-input input {
  padding-right: 22px;
}

.rotation-unit {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: var(--text-placeholder);
  pointer-events: none;
}
</style>
