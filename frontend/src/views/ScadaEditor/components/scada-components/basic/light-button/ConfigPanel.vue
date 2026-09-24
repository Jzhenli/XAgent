<template>
  <div class="config-section">
    <div class="section-title">
      {{ t("componentConfig.lightButtonConfig") }}
    </div>

    <!-- 数据绑定：通断映射 -->
    <div class="subsection-title">{{ t("componentConfig.dataSection") }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.currentValue") }}</label>
        <input
          type="number"
          :value="config.value ?? ''"
          @change="
            updateConfig(
              'value',
              ($event.target as HTMLInputElement).value === ''
                ? null
                : +($event.target as HTMLInputElement).value,
            )
          "
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.onValue") }}</label>
        <input
          type="number"
          :value="config.onValue"
          @change="
            updateConfig('onValue', +($event.target as HTMLInputElement).value)
          "
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.offValue") }}</label>
        <input
          type="number"
          :value="config.offValue"
          @change="
            updateConfig('offValue', +($event.target as HTMLInputElement).value)
          "
        />
      </div>
    </div>

    <!-- 图标设置 -->
    <div class="subsection-title">{{ t("componentConfig.iconConfig") }}</div>
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
          @change="updateConfig('iconColor', $event || '')"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.activeIconColor") }}</label>
        <el-color-picker
          :model-value="config.activeIconColor"
          show-alpha
          @change="updateConfig('activeIconColor', $event || '')"
        />
      </div>
    </div>

    <!-- 文本 -->
    <div class="subsection-title">{{ t("componentConfig.textConfig") }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.content") }}</label>
        <input
          type="text"
          :value="config.text"
          @change="
            updateConfig('text', ($event.target as HTMLInputElement).value)
          "
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.fontSize") }}</label>
        <input
          type="number"
          :value="config.fontSize"
          @change="
            updateConfig('fontSize', +($event.target as HTMLInputElement).value)
          "
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.fontColor") }}</label>
        <el-color-picker
          :model-value="config.fontColor"
          show-alpha
          @change="updateConfig('fontColor', $event || '')"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.activeFontColor") }}</label>
        <el-color-picker
          :model-value="config.activeFontColor"
          show-alpha
          @change="updateConfig('activeFontColor', $event || '')"
        />
      </div>
    </div>

    <!-- 背景与圆角 -->
    <div class="subsection-title">{{ t("componentConfig.styleSection") }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.backgroundColor") }}</label>
        <el-color-picker
          :model-value="config.backgroundColor"
          show-alpha
          @change="updateConfig('backgroundColor', $event || '')"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.activeBackgroundColor") }}</label>
        <el-color-picker
          :model-value="config.activeBackgroundColor"
          show-alpha
          @change="updateConfig('activeBackgroundColor', $event || '')"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.borderRadius") }}</label>
        <input
          type="number"
          :value="config.borderRadius"
          @change="
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
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useScadaConfig } from "../../../../hooks/useScadaEditor";
import type { ScadaComponent } from "../../../../types";
import XIcon from "@/icon/index.vue";
import { iconFontList } from "@/icon/x-icon";

const { t } = useI18n();

const props = defineProps<{
  component: ScadaComponent;
}>();

const { config, updateConfig } = useScadaConfig(
  props.component as ScadaComponent<"light-button">,
);

// 直接从 iconfont 列表过滤 light 相关图标（XIcon 实际渲染依赖字体 class）
const iconOptions = computed(() =>
  iconFontList.filter((name) => name.startsWith("light")).sort(),
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

.form-group input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 6px;
  font-size: 13px;
  background-color: var(--scada-bg-elevated);
  color: var(--text-primary);
  box-sizing: border-box;
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
