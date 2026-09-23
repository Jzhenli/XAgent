<template>
  <div class="config-section">
    <div class="section-title">{{ t("componentConfig.acFanSpeedIconConfig") }}</div>

    <!-- Data binding: current value & speed value mapping -->
    <div class="subsection-title">{{ t("componentConfig.dataSection") }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.acFanSpeedCurrentValue") }}</label>
        <input
          type="text"
          :value="config.currentValue"
          @change="
            updateConfig(
              'currentValue',
              parseValue(($event.target as HTMLInputElement).value),
            )
          "
        />
      </div>
    </div>

    <!-- 档位值映射 -->
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.acFanSpeedAutoValue") }}</label>
        <input
          type="text"
          :value="config.autoValue"
          @change="
            updateConfig(
              'autoValue',
              parseValue(($event.target as HTMLInputElement).value),
            )
          "
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.acFanSpeedLowValue") }}</label>
        <input
          type="text"
          :value="config.lowValue"
          @change="
            updateConfig(
              'lowValue',
              parseValue(($event.target as HTMLInputElement).value),
            )
          "
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.acFanSpeedMediumValue") }}</label>
        <input
          type="text"
          :value="config.mediumValue"
          @change="
            updateConfig(
              'mediumValue',
              parseValue(($event.target as HTMLInputElement).value),
            )
          "
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.acFanSpeedHighValue") }}</label>
        <input
          type="text"
          :value="config.highValue"
          @change="
            updateConfig(
              'highValue',
              parseValue(($event.target as HTMLInputElement).value),
            )
          "
        />
      </div>
    </div>

    <!-- 自定义组合档位 -->
    <div class="subsection-title">{{ t("componentConfig.acFanSpeedIconCycleModes") }}</div>
    <div class="cycle-modes">
      <label
        v-for="speed in allSpeeds"
        :key="speed.key"
        class="cycle-mode-item"
      >
        <input
          type="checkbox"
          :checked="isSpeedInCycle(speed.key)"
          @change="toggleSpeed(speed.key)"
        />
        <span class="cycle-mode-label">{{ speed.label }}</span>
      </label>
    </div>

    <!-- Style -->
    <div class="subsection-title">{{ t("componentConfig.styleSection") }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.iconSize") }}</label>
        <input
          type="number"
          :value="config.iconSize"
          @change="
            updateConfig('iconSize', +($event.target as HTMLInputElement).value)
          "
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.iconColor") }}</label>
        <el-color-picker
          :model-value="config.iconColor"
          show-alpha
          @change="updateConfig('iconColor', $event)"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.activeIconColor") }}</label>
        <el-color-picker
          :model-value="config.activeIconColor"
          show-alpha
          @change="updateConfig('activeIconColor', $event)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.backgroundColor") }}</label>
        <el-color-picker
          :model-value="config.backgroundColor"
          show-alpha
          @change="updateConfig('backgroundColor', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useScadaConfig } from "../../../../hooks/useScadaEditor";
import type { ScadaComponent, AcFanSpeedKey } from "../../../../types";

const { t } = useI18n();

const props = defineProps<{
  component: ScadaComponent;
}>();

const { config, updateConfig } = useScadaConfig(
  props.component as ScadaComponent<"acFanSpeedIcon">,
);

/** 所有可选档位（固定顺序） */
const allSpeeds = computed<{ key: AcFanSpeedKey; label: string }[]>(() => [
  { key: "auto", label: t("scadaComponents.acFanSpeedAuto") },
  { key: "low", label: t("scadaComponents.acFanSpeedLow") },
  { key: "medium", label: t("scadaComponents.acFanSpeedMedium") },
  { key: "high", label: t("scadaComponents.acFanSpeedHigh") },
]);

/** 判断某档位是否在循环列表中 */
const isSpeedInCycle = (key: AcFanSpeedKey): boolean => {
  const list = config.value.cycleModes;
  return Array.isArray(list) && list.includes(key);
};

/** 切换某档位的勾选状态 */
const toggleSpeed = (key: AcFanSpeedKey) => {
  const list: AcFanSpeedKey[] = Array.isArray(config.value.cycleModes)
    ? [...config.value.cycleModes]
    : ["auto", "low", "medium", "high"];

  const index = list.indexOf(key);
  if (index >= 0) {
    list.splice(index, 1);
  } else {
    list.push(key);
  }

  // 至少保留一个档位
  const finalList: AcFanSpeedKey[] = list.length > 0 ? list : [key];
  updateConfig("cycleModes", finalList);
};

const parseValue = (value: string): number | string => {
  const trimmed = value.trim();
  if (trimmed === "") return "";
  const num = Number(trimmed);
  return Number.isNaN(num) ? trimmed : num;
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

.form-group input[type="text"],
.form-group input[type="number"] {
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

/* 循环档位勾选区域 */
.cycle-modes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
}

.cycle-mode-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}

.cycle-mode-item input[type="checkbox"] {
  width: 14px;
  height: 14px;
  accent-color: var(--color-primary);
  cursor: pointer;
}

.cycle-mode-label {
  font-size: 12px;
  color: var(--text-primary);
}
</style>
