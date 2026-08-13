<template>
  <div class="config-section">
    <div class="section-title">{{ t("componentConfig.switchConfig") }}</div>

    <!-- 数据绑定：通断映射 -->
    <div class="subsection-title">{{ t("componentConfig.dataSection") }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.onValue") }}</label>
        <input
          type="number"
          :value="config.onValue"
          @change="updateConfig('onValue', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.offValue") }}</label>
        <input
          type="number"
          :value="config.offValue"
          @change="updateConfig('offValue', +($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <!-- 样式：颜色选择器 -->
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
  props.component as ScadaComponent<"switch">,
);
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
