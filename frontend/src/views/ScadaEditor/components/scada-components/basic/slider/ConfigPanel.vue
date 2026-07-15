<template>
  <div class="config-section">
    <div class="section-title">{{ t('componentConfig.sliderConfig') }}</div>

    <div class="subsection-title">{{ t('componentConfig.dataSection') }}</div>
    <div class="form-group">
      <label>{{ t('componentConfig.currentValue') }}</label>
      <input
        type="number"
        :value="config.value ?? min"
        @input="updateNumericValue($event)"
      />
    </div>

    <div class="subsection-title">{{ t('componentConfig.styleSection') }}</div>
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
        <label>{{ t('componentConfig.backgroundColor') }}</label>
        <el-color-picker
          :model-value="config.backgroundColor"
          show-alpha
          @change="updateConfig('backgroundColor', $event as string)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScadaConfig } from '../../../../hooks/useScadaEditor'
import type { ScadaComponent, SliderComponentConfig } from '../../../../types'

const { t } = useI18n()

const props = defineProps<{
  component: ScadaComponent
}>()

const { config, updateConfig, updateValue } = useScadaConfig(
  props.component as ScadaComponent<'slider'>,
)

const min = computed(() => (config.value as SliderComponentConfig).min ?? 0)

const updateNumericValue = (e: Event) => {
  const value = +((e.target as HTMLInputElement).value)
  updateValue(isNaN(value) ? min.value : value)
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
