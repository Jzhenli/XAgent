<template>
  <div class="config-section">
    <div class="section-title">{{ t("componentConfig.sliderBarConfig") }}</div>

    <!-- 数据：数值范围 -->
    <div class="subsection-title">{{ t("componentConfig.dataSection") }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.minValue") }}</label>
        <input
          type="number"
          :value="config.min"
          @change="
            updateConfig('min', +($event.target as HTMLInputElement).value)
          "
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.maxValue") }}</label>
        <input
          type="number"
          :value="config.max"
          @change="
            updateConfig('max', +($event.target as HTMLInputElement).value)
          "
        />
      </div>
    </div>

    <!-- 柱体管理：标签 / 当前值 / 点位绑定 -->
    <div class="subsection-title">
      {{ t("componentConfig.barItemsSection") }}
    </div>
    <div v-for="(item, index) in config.items" :key="index" class="bar-item">
      <div class="bar-item-header">
        <span class="bar-item-title"
          >{{ t("componentConfig.barItem") }} {{ index + 1 }}</span
        >
        <span class="bar-item-remove" @click="removeItem(index)">✕</span>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>{{ t("componentConfig.barLabel") }}</label>
          <input
            type="text"
            :value="item.label"
            @change="
              updateItem(index, {
                label: ($event.target as HTMLInputElement).value,
              })
            "
          />
        </div>
        <div class="form-group">
          <label>{{ t("componentConfig.currentValue") }}</label>
          <input
            type="number"
            :value="item.value"
            @change="
              updateItem(index, {
                value: +($event.target as HTMLInputElement).value,
              })
            "
          />
        </div>
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.device") }}</label>
        <el-select
          :model-value="item.binding?.deviceId ?? ''"
          class="scada-select"
          popper-class="scada-select-dropdown"
          clearable
          :placeholder="t('componentConfig.selectDevice')"
          @update:model-value="handleItemDeviceChange(index, $event as string)"
        >
          <el-option
            v-for="device in pointStore.devices"
            :key="device.asset"
            :value="device.asset"
            :label="device.name"
          />
        </el-select>
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.point") }}</label>
        <el-select
          :model-value="item.binding?.pointName ?? ''"
          class="scada-select"
          popper-class="scada-select-dropdown"
          clearable
          :placeholder="t('componentConfig.selectPoint')"
          :disabled="!item.binding?.deviceId"
          @update:model-value="handleItemPointChange(index, $event as string)"
        >
          <el-option
            v-for="point in getItemPoints(item)"
            :key="point.name"
            :value="point.name"
            :label="
              point.name + (point.description ? ` (${point.description})` : '')
            "
          />
        </el-select>
      </div>
    </div>
    <div class="add-item-btn" @click="addItem">
      + {{ t("componentConfig.addBarItem") }}
    </div>

    <!-- 样式：柱体 / 当前值 / 轴 -->
    <div class="subsection-title">{{ t("componentConfig.styleSection") }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.barColor") }}</label>
        <el-color-picker
          :model-value="config.barColor"
          show-alpha
          @change="updateConfig('barColor', $event as string)"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.borderRadius") }}</label>
        <input
          type="number"
          min="0"
          :value="config.barRadius ?? 0"
          @change="
            updateConfig(
              'barRadius',
              +($event.target as HTMLInputElement).value,
            )
          "
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.barWidth") }}</label>
        <input
          type="number"
          min="4"
          :value="config.barWidth"
          @change="
            updateConfig('barWidth', +($event.target as HTMLInputElement).value)
          "
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group form-group--switch">
        <label>{{ t("componentConfig.showCurrentValue") }}</label>
        <el-switch
          :model-value="config.showCurrentValue ?? true"
          @change="updateConfig('showCurrentValue', $event as boolean)"
        />
      </div>
      <div class="form-group">
        
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.valueFontSize") }}</label>
        <input
          type="number"
          min="8"
          :value="config.valueFontSize"
          @change="
            updateConfig(
              'valueFontSize',
              +($event.target as HTMLInputElement).value,
            )
          "
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.valueColor") }}</label>
        <el-color-picker
          :model-value="config.valueColor"
          show-alpha
          @change="updateConfig('valueColor', $event as string)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.axisFontSize") }}</label>
        <input
          type="number"
          min="8"
          :value="config.axisFontSize"
          @change="
            updateConfig(
              'axisFontSize',
              +($event.target as HTMLInputElement).value,
            )
          "
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.axisColor") }}</label>
        <el-color-picker
          :model-value="config.axisColor"
          show-alpha
          @change="updateConfig('axisColor', $event as string)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group form-group--switch">
        <label>{{ t("componentConfig.showYAxisLabel") }}</label>
        <el-switch
          :model-value="config.showYAxisLabel ?? true"
          @change="updateConfig('showYAxisLabel', $event as boolean)"
        />
      </div>
      <div class="form-group form-group--switch">
        <label>{{ t("componentConfig.showXAxisLabel") }}</label>
        <el-switch
          :model-value="config.showXAxis ?? true"
          @change="updateConfig('showXAxis', $event as boolean)"
        />
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { usePointStore } from "@/stores/points";
import { useScadaConfig } from "../../../../hooks/useScadaEditor";
import type { ScadaComponent, SliderBarItemConfig } from "../../../../types";

const { t } = useI18n();
const pointStore = usePointStore();

const props = defineProps<{
  component: ScadaComponent;
}>();

const { config, updateConfig } = useScadaConfig(
  props.component as ScadaComponent<"slider-bar">,
);

// ─── 柱体增删改 ────────────────────────────────────────────
const updateItems = (items: SliderBarItemConfig[]) => {
  updateConfig("items", items);
};

const updateItem = (index: number, patch: Partial<SliderBarItemConfig>) => {
  updateItems(
    config.value.items.map((item, i) =>
      i === index ? { ...item, ...patch } : item,
    ),
  );
};

const addItem = () => {
  const next = [
    ...config.value.items,
    {
      label: `${config.value.items.length + 1}#`,
      value: config.value.min,
      binding: null,
    },
  ];
  updateItems(next);
};

const removeItem = (index: number) => {
  updateItems(config.value.items.filter((_, i) => i !== index));
};

// ─── 每柱点位绑定 ──────────────────────────────────────────
const getItemPoints = (item: SliderBarItemConfig) => {
  if (!item.binding?.deviceId) return [];
  const device = pointStore.devices.find(
    (d) =>
      d.asset === item.binding!.deviceId || d.name === item.binding!.deviceId,
  );
  return device?.points || [];
};

const handleItemDeviceChange = (index: number, deviceId: string) => {
  updateItem(index, {
    binding: deviceId ? { deviceId, pointName: "" } : null,
  });
};

const handleItemPointChange = (index: number, pointName: string) => {
  const item = config.value.items[index];
  if (!item.binding || !pointName) {
    updateItem(index, { binding: null });
    return;
  }
  const point = getItemPoints(item).find((p) => p.name === pointName);
  updateItem(index, {
    binding: {
      ...item.binding,
      pointName,
      pointDescription: point?.description,
      unit: point?.unit,
    },
  });
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
  box-shadow: none !important;
}

.form-group input::placeholder,
.form-group select::placeholder {
  color: var(--text-placeholder);
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary) !important;
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

/* 柱体条目卡片 */
.bar-item {
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.02);
}

.bar-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.bar-item-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.bar-item-remove {
  font-size: 12px;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.bar-item-remove:hover {
  color: #f56c6c;
  background: rgba(245, 108, 108, 0.1);
}

.add-item-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border: 1px dashed rgba(34, 211, 238, 0.3);
  border-radius: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 10px;
}

.add-item-btn:hover {
  border-color: var(--scada-cyan);
  color: var(--scada-cyan);
  background: rgba(34, 211, 238, 0.05);
}

.form-group--switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-group--switch label {
  margin-bottom: 0;
}
</style>
