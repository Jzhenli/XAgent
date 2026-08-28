<template>
  <div class="config-section">
    <div class="section-title">{{ t("componentConfig.iconConfig") }}</div>

    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.iconName") }}</label>
        <el-select
          :model-value="config.iconName"
          class="scada-select"
          popper-class="scada-select-dropdown"
          filterable
          @change="updateConfig('iconName', $event)"
        >
          <el-option
            v-for="name in iconOptions"
            :key="name"
            :label="name"
            :value="name"
          >
            <span class="option-icon">
              <XIcon
                :name="name"
                type="mono-line"
                :size="16"
                :color="{ normal: 'var(--text-regular)' }"
              />
            </span>
            <span>{{ name }}</span>
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.iconColor") }}</label>
        <el-color-picker
          :model-value="config.iconColor"
          show-alpha
          @active-change="handleColorActiveChange"
          @change="handleColorChange"
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
import XIcon from "@/icon/index.vue";

const { t } = useI18n();

const props = defineProps<{
  component: ScadaComponent;
}>();

const { config, updateConfig } = useScadaConfig(
  props.component as ScadaComponent<"icon">,
);

const latestIconColor = ref<string>("");

watch(
  () => config.value.iconColor,
  (val) => {
    latestIconColor.value = val || "";
  },
  { immediate: true },
);

const handleColorActiveChange = (val: string | null) => {
  latestIconColor.value = val || "";
};

const handleColorChange = (val: string | null) => {
  const isCleared = val === null || val === undefined || val === "";
  updateConfig("iconColor", isCleared ? "" : latestIconColor.value);
};

const svgModules = import.meta.glob("/src/icon/svg/*.svg") as Record<
  string,
  () => Promise<unknown>
>;

const iconOptions = computed(() => {
  const names = new Set<string>();
  Object.keys(svgModules).forEach((path) => {
    const fileName = path.split("/").pop() || "";
    const match = /^_(.+?)_[A-Z]{2}(?:_\d+)?\.svg$/.exec(fileName);
    if (match?.[1]) {
      names.add(match[1]);
    }
  });
  return Array.from(names).sort();
});
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

.option-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  margin-right: 4px;
  vertical-align: middle;
}
</style>
