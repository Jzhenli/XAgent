<template>
  <div class="config-section">
    <div class="section-title">{{ t('componentConfig.sliderSwitchConfig') }}</div>

    <!-- 数据：数值范围 -->
    <div class="subsection-title">{{ t('componentConfig.dataSection') }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.currentValue') }}</label>
        <input
          type="number"
          :value="config.value"
          @change="updateConfig('value', +($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
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

    <!-- 样式：轨道 / 滑块 / 圆角 -->
    <div class="subsection-title">{{ t('componentConfig.styleSection') }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.activeTrackColor') }}</label>
        <el-color-picker
          :model-value="config.activeTrackColor"
          show-alpha
          @change="updateConfig('activeTrackColor', $event as string)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.inactiveTrackColor') }}</label>
        <el-color-picker
          :model-value="config.inactiveTrackColor"
          show-alpha
          @change="updateConfig('inactiveTrackColor', $event as string)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.thumbColor') }}</label>
        <el-color-picker
          :model-value="config.thumbColor"
          show-alpha
          @change="updateConfig('thumbColor', $event as string)"
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

    <!-- 数字轴 -->
    <div class="subsection-title">{{ t('componentConfig.axisSection') }}</div>
    <div class="form-row">
      <div class="form-group form-group--switch">
        <label>{{ t('componentConfig.showAxis') }}</label>
        <el-switch
          :model-value="config.showAxis"
          @change="updateConfig('showAxis', $event as boolean)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.axisFontSize') }}</label>
        <input
          type="number"
          min="8"
          :value="config.axisFontSize"
          @change="updateConfig('axisFontSize', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.axisColor') }}</label>
        <el-color-picker
          :model-value="config.axisColor"
          show-alpha
          @change="updateConfig('axisColor', $event as string)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useScadaConfig } from '../../../../hooks/useScadaEditor'
import type { ScadaComponent } from '../../../../types'

const { t } = useI18n()

const props = defineProps<{
  component: ScadaComponent
}>()

const { config, updateConfig } = useScadaConfig(
  props.component as ScadaComponent<'slider-switch'>,
)
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

.form-row {
  display: flex;
  gap: 8px;
}

.form-row .form-group {
  flex: 1;
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
