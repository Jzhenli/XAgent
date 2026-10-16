<template>
  <div class="config-section">
    <div class="section-title">{{ t('componentConfig.valueProgressCardConfig') }}</div>

    <!-- 分区1：标题（左上） -->
    <div class="subsection-title">{{ t('componentConfig.valueProgressCardTitleSection') }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.title') }}</label>
        <input
          type="text"
          :value="config.title"
          @change="updateConfig('title', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.fontSize') }}</label>
        <input
          type="number"
          min="8"
          :value="config.titleFontSize"
          @change="updateConfig('titleFontSize', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.fontColor') }}</label>
        <el-color-picker
          :model-value="config.titleFontColor"
          show-alpha
          @change="updateConfig('titleFontColor', $event as string)"
        />
      </div>
    </div>

    <!-- 分区2：图标（右上） -->
    <div class="subsection-title">{{ t('componentConfig.valueProgressCardIconSection') }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.iconName') }}</label>
        <el-select
          :model-value="config.iconName"
          class="scada-select"
          popper-class="scada-select-dropdown"
          filterable
          @change="updateConfig('iconName', $event as string)"
        >
          <el-option
            v-for="icon in sortedIcons"
            :key="icon"
            :label="icon"
            :value="icon"
          >
            <span class="option-icon">
              <XIcon
                :name="icon"
                type="mono-line"
                :size="16"
                :color="{ normal: 'var(--text-regular)' }"
              />
            </span>
            <span>{{ icon }}</span>
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.iconSize') }}</label>
        <input
          type="number"
          min="8"
          :value="config.iconSize"
          @change="updateConfig('iconSize', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.iconColor') }}</label>
        <el-color-picker
          :model-value="config.iconColor"
          show-alpha
          @change="updateConfig('iconColor', $event as string)"
        />
      </div>
    </div>

    <!-- 分区3：当前值 -->
    <div class="subsection-title">{{ t('componentConfig.valueProgressCardValueSection') }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.currentValue') }}</label>
        <input
          type="number"
          :value="config.value"
          @change="updateConfig('value', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.valueFontSize') }}</label>
        <input
          type="number"
          min="8"
          :value="config.valueFontSize"
          @change="updateConfig('valueFontSize', +($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.valueColor') }}</label>
        <el-color-picker
          :model-value="config.valueFontColor"
          show-alpha
          @change="updateConfig('valueFontColor', $event as string)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.decimalPlaces') }}</label>
        <input
          type="number"
          min="0"
          max="6"
          :value="config.decimalPlaces"
          @change="updateConfig('decimalPlaces', +($event.target as HTMLInputElement).value)"
        />
      </div>
      
    </div>

    <!-- 分区4：单位 -->
    <div class="subsection-title">{{ t('componentConfig.valueProgressCardUnitSection') }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.unit') }}</label>
        <input
          type="text"
          :value="config.unit"
          @change="updateConfig('unit', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.unitFontSize') }}</label>
        <input
          type="number"
          min="8"
          :value="config.unitFontSize"
          @change="updateConfig('unitFontSize', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.unitFontColor') }}</label>
        <el-color-picker
          :model-value="config.unitFontColor"
          show-alpha
          @change="updateConfig('unitFontColor', $event as string)"
        />
      </div>
    </div>

    <!-- 分区5：进度条 -->
    <div class="subsection-title">{{ t('componentConfig.valueProgressCardBarSection') }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.minValue') }}</label>
        <input
          type="number"
          :value="config.min"
          @change="updateConfig('min', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.maxValue') }}</label>
        <input
          type="number"
          :value="config.max"
          @change="updateConfig('max', +($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.scaleFontSize') }}</label>
        <input
          type="number"
          min="6"
          :value="config.scaleFontSize"
          @change="updateConfig('scaleFontSize', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.scaleFontColor') }}</label>
        <el-color-picker
          :model-value="config.scaleFontColor"
          show-alpha
          @change="updateConfig('scaleFontColor', $event as string)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.barColor') }}</label>
        <input
          type="text"
          :value="config.barColor"
          placeholder="#3b82f6 或 linear-gradient(90deg, #3b82f6, #6366f1)"
          @change="updateConfig('barColor', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.barTrackColor') }}</label>
        <el-color-picker
          :model-value="config.barTrackColor"
          show-alpha
          @change="updateConfig('barTrackColor', $event as string)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.barHeight') }}</label>
        <input
          type="number"
          min="2"
          :value="config.barHeight"
          @change="updateConfig('barHeight', +($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.barRadius') }}</label>
        <input
          type="number"
          min="0"
          :value="config.barRadius"
          @change="updateConfig('barRadius', +($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.animationEnabled') }}</label>
        <el-switch
          :model-value="config.animationEnabled"
          @change="updateConfig('animationEnabled', $event as boolean)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.animationDuration') }}</label>
        <input
          type="number"
          min="0.3"
          max="5"
          step="0.1"
          :value="config.animationDuration"
          :disabled="!config.animationEnabled"
          @change="updateConfig('animationDuration', +($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <!-- 容器样式 -->
    <div class="subsection-title">{{ t('componentConfig.styleSection') }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.backgroundColor') }}</label>
        <el-color-picker
          :model-value="config.backgroundColor"
          show-alpha
          @change="updateConfig('backgroundColor', $event as string)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.borderRadius') }}</label>
        <input
          type="number"
          min="0"
          :value="config.borderRadius"
          @change="updateConfig('borderRadius', +($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.opacity') }}</label>
        <input
          type="number"
          min="0"
          max="1"
          step="0.1"
          :value="config.opacity"
          @change="updateConfig('opacity', +($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import XIcon from '@/icon/index.vue'
import { iconFontList } from '@/icon/x-icon'
import { useScadaConfig } from '../../../../hooks/useScadaEditor'
import type { ScadaComponent } from '../../../../types'

const { t } = useI18n()

const props = defineProps<{
  component: ScadaComponent
}>()

const { config, updateConfig } = useScadaConfig(
  props.component as ScadaComponent<'value-progress-card'>,
)

const sortedIcons = computed(() => [...iconFontList].sort())
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

.form-group :deep(.el-color-picker__trigger) {
  width: 100%;
}

.form-group :deep(.el-select) {
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
