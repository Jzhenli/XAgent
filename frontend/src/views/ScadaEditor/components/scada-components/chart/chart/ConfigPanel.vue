<template>
  <div class="config-section">
    <div class="section-title">{{ t('componentConfig.chartConfig') }}</div>

    <div class="subsection-title">{{ t('componentConfig.dataSection') }}</div>
    <div class="form-group">
      <label>{{ t('componentConfig.currentValue') }}</label>
      <input type="number" :value="config.value ?? 0" @input="updateNumericValue($event)">
    </div>
    <div class="form-group">
      <label>{{ t('componentConfig.timeRange') }}</label>
      <select :value="config.timeRange" @change="updateConfig('timeRange', ($event.target as HTMLSelectElement).value as ChartComponentConfig['timeRange'])">
        <option value="1h">{{ t('dashboard.timeRange1h') }}</option>
        <option value="6h">{{ t('pointTrend.timeRange6h') }}</option>
        <option value="24h">{{ t('dashboard.timeRange24h') }}</option>
        <option value="7d">{{ t('dashboard.timeRange7d') }}</option>
      </select>
    </div>

    <div class="subsection-title">{{ t('componentConfig.styleSection') }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.lineColor') }}</label>
        <el-color-picker :model-value="config.lineColor" show-alpha @change="updateConfig('lineColor', $event)" />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.backgroundColor') }}</label>
        <el-color-picker :model-value="config.backgroundColor" show-alpha @change="updateConfig('backgroundColor', $event)" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.borderRadius') }}</label>
        <input type="number" :value="config.borderRadius" @input="updateConfig('borderRadius', +($event.target as HTMLInputElement).value)">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useScadaConfig } from '../../../../hooks/useScadaEditor'
import type { ScadaComponent, ChartComponentConfig } from '../../../../types'

const { t } = useI18n()

const props = defineProps<{
  component: ScadaComponent
}>()

const { config, updateConfig, updateValue } = useScadaConfig(props.component as ScadaComponent<'chart-line'>)

const updateNumericValue = (e: Event) => {
  const value = +((e.target as HTMLInputElement).value)
  updateValue(isNaN(value) ? 0 : value)
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
