<template>
  <div class="config-section">
    <div class="section-title">{{ t('componentConfig.arcConfig') }}</div>

    <div class="subsection-title">{{ t('componentConfig.styleSection') }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.strokeColor') }}</label>
        <el-color-picker
          :model-value="config.strokeColor"
          show-alpha
          @active-change="(val: string | null) => { latestStrokeColor = val || '' }"
          @change="handleStrokeColorChange"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.strokeWidth') }}</label>
        <input
          type="number"
          min="1"
          :value="config.strokeWidth"
          @change="updateConfig('strokeWidth', +($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.arcStartAngle') }}</label>
        <input
          type="number"
          :value="config.startAngle"
          @change="updateConfig('startAngle', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.arcEndAngle') }}</label>
        <input
          type="number"
          :value="config.endAngle"
          @change="updateConfig('endAngle', +($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.lineArrow') }}</label>
        <el-select
          :model-value="config.arrow || 'none'"
          class="scada-select"
          popper-class="scada-select-dropdown"
          @update:model-value="handleArrowChange"
        >
          <el-option value="none" :label="t('componentConfig.arrowNone')" />
          <el-option value="start" :label="t('componentConfig.arrowStart')" />
          <el-option value="end" :label="t('componentConfig.arrowEnd')" />
          <el-option value="both" :label="t('componentConfig.arrowBoth')" />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScadaConfig } from '../../../../hooks/useScadaEditor'
import type { ScadaComponent, ArcComponentConfig } from '../../../../types'

const { t } = useI18n()

const props = defineProps<{
  component: ScadaComponent
}>()

const { config, updateConfig } = useScadaConfig(
  props.component as ScadaComponent<'arc'>,
)

const latestStrokeColor = ref<string>('')

watch(
  () => config.value.strokeColor,
  (val) => {
    latestStrokeColor.value = val || ''
  },
  { immediate: true },
)

const handleStrokeColorChange = (val: string | null) => {
  const isCleared = val === null || val === undefined || val === ''
  updateConfig('strokeColor', isCleared ? '' : latestStrokeColor.value)
}

const handleArrowChange = (val: string) => {
  updateConfig('arrow', val as ArcComponentConfig['arrow'])
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
</style>
