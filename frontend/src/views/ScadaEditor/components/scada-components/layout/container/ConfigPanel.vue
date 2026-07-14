<template>
  <div class="config-section">
    <div class="section-title">{{ t('componentConfig.containerConfig') }}</div>

    <div class="subsection-title">{{ t('componentConfig.dataSection') }}</div>
    <div class="form-group">
      <label>{{ t('componentConfig.currentValue') }}</label>
      <input type="text" :value="config.value ?? ''" @input="updateValue(($event.target as HTMLInputElement).value || null)">
    </div>

    <div class="subsection-title">{{ t('componentConfig.styleSection') }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.backgroundColor') }}</label>
        <el-color-picker :model-value="config.backgroundColor" show-alpha @change="updateConfig('backgroundColor', $event)" />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.borderColor') }}</label>
        <el-color-picker :model-value="config.borderColor" show-alpha @change="updateConfig('borderColor', $event)" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.borderWidth') }}</label>
        <input type="number" :value="config.borderWidth" @input="updateConfig('borderWidth', +($event.target as HTMLInputElement).value)">
      </div>
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
import type { ScadaComponent } from '../../../../types'

const { t } = useI18n()

const props = defineProps<{
  component: ScadaComponent
}>()

const { config, updateConfig, updateValue } = useScadaConfig(props.component as ScadaComponent<'container'>)
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
  border: 1px solid var(--border-base);
  border-radius: 4px;
  font-size: 13px;
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
</style>
