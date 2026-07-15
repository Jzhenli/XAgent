<template>
  <div class="config-section">
    <div class="section-title">{{ t('componentConfig.buttonConfig') }}</div>

    <div class="subsection-title">{{ t('componentConfig.dataSection') }}</div>
    <div class="form-group">
      <label>{{ t('componentConfig.writeValue') }}</label>
      <input
        type="text"
        :value="writeValueModel"
        @change="updateConfig('writeValue', parseTypedValue(($event.target as HTMLInputElement).value))"
      />
    </div>

    <div class="subsection-title">{{ t('componentConfig.styleSection') }}</div>
    <div class="form-group">
      <label>{{ t('componentConfig.buttonText') }}</label>
      <input
        type="text"
        :value="config.text"
        @input="updateConfig('text', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.fontSize') }}</label>
        <input
          type="number"
          :value="config.fontSize ?? 14"
          @input="updateConfig('fontSize', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.fontColor') }}</label>
        <el-color-picker
          :model-value="config.fontColor"
          show-alpha
          @change="updateConfig('fontColor', $event as string)"
        />
      </div>
    </div>
    <div class="form-group">
      <label>{{ t('componentConfig.buttonColor') }}</label>
      <el-color-picker
        :model-value="config.backgroundColor"
        show-alpha
        @change="updateConfig('backgroundColor', $event as string)"
      />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.borderWidth') }}</label>
        <input
          type="number"
          min="0"
          :value="config.borderWidth ?? 0"
          @input="updateConfig('borderWidth', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.borderColor') }}</label>
        <el-color-picker
          :model-value="config.borderColor"
          show-alpha
          @change="updateConfig('borderColor', $event as string)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScadaConfig } from '../../../../hooks/useScadaEditor'
import type { ScadaComponent } from '../../../../types'

const { t } = useI18n()

const props = defineProps<{
  component: ScadaComponent
}>()

const { config, updateConfig } = useScadaConfig(
  props.component as ScadaComponent<'button'>,
)

const writeValueModel = computed(() => formatTypedValue(config.value.writeValue))

const parseTypedValue = (raw: string): number | boolean | string => {
  const trimmed = raw.trim()
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  const numeric = Number(trimmed)
  if (trimmed !== '' && !Number.isNaN(numeric)) return numeric
  return trimmed
}

const formatTypedValue = (
  value: number | boolean | string | undefined | null,
): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  return String(value)
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
