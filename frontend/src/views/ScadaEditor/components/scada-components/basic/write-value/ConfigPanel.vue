<template>
  <div class="config-section">
    <div class="section-title">{{ t('componentConfig.writeValueConfig') }}</div>

    <div class="subsection-title">{{ t('componentConfig.dataSection') }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.currentValue') }}</label>
        <input
          type="text"
          :value="config.value"
          @input="updateConfig('value', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <div class="subsection-title">{{ t('componentConfig.inputModeSection') }}</div>
    <div class="form-row">
      <div class="form-group form-group--switch">
        <label>{{ t('componentConfig.showInput') }}</label>
        <el-switch
          :model-value="config.showInput"
          @change="updateConfig('showInput', $event as boolean)"
        />
      </div>
      <div v-if="config.showInput" class="form-group">
        <label>{{ t('componentConfig.inputBorderColor') }}</label>
        <el-color-picker
          :model-value="config.inputBorderColor"
          show-alpha
          @active-change="handleInputBorderColorActiveChange"
          @change="handleInputBorderColorChange"
        />
      </div>
      <div v-else class="form-group"></div>
    </div>

    <div class="subsection-title">{{ t('componentConfig.styleSection') }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.fontSize') }}</label>
        <input
          type="number"
          min="1"
          :value="config.fontSize"
          @change="updateConfig('fontSize', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.fontColor') }}</label>
        <el-color-picker
          :model-value="config.fontColor"
          show-alpha
          @active-change="handleColorActiveChange"
          @change="handleColorChange"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.confirmColor') }}</label>
        <el-color-picker
          :model-value="config.confirmColor"
          show-alpha
          @active-change="handleConfirmColorActiveChange"
          @change="handleConfirmColorChange"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.cancelColor') }}</label>
        <el-color-picker
          :model-value="config.cancelColor"
          show-alpha
          @active-change="handleCancelColorActiveChange"
          @change="handleCancelColorChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScadaConfig } from '../../../../hooks/useScadaEditor'
import type { ScadaComponent } from '../../../../types'

const { t } = useI18n()

const props = defineProps<{
  component: ScadaComponent
}>()

const { config, updateConfig } = useScadaConfig(
  props.component as ScadaComponent<'write-value'>,
)

const latestFontColor = ref<string>('')
const latestConfirmColor = ref<string>('')
const latestCancelColor = ref<string>('')
const latestInputBorderColor = ref<string>('')

watch(
  () => config.value.fontColor,
  (val) => {
    latestFontColor.value = val || ''
  },
  { immediate: true },
)

watch(
  () => config.value.confirmColor,
  (val) => {
    latestConfirmColor.value = val || ''
  },
  { immediate: true },
)

watch(
  () => config.value.cancelColor,
  (val) => {
    latestCancelColor.value = val || ''
  },
  { immediate: true },
)

watch(
  () => config.value.inputBorderColor,
  (val) => {
    latestInputBorderColor.value = val || ''
  },
  { immediate: true },
)

const handleColorActiveChange = (val: string | null) => {
  latestFontColor.value = val || ''
}

const handleColorChange = (val: string | null) => {
  const isCleared = val === null || val === undefined || val === ''
  updateConfig('fontColor', isCleared ? '' : latestFontColor.value)
}

const handleConfirmColorActiveChange = (val: string | null) => {
  latestConfirmColor.value = val || ''
}

const handleConfirmColorChange = (val: string | null) => {
  const isCleared = val === null || val === undefined || val === ''
  updateConfig('confirmColor', isCleared ? '' : latestConfirmColor.value)
}

const handleCancelColorActiveChange = (val: string | null) => {
  latestCancelColor.value = val || ''
}

const handleCancelColorChange = (val: string | null) => {
  const isCleared = val === null || val === undefined || val === ''
  updateConfig('cancelColor', isCleared ? '' : latestCancelColor.value)
}

const handleInputBorderColorActiveChange = (val: string | null) => {
  latestInputBorderColor.value = val || ''
}

const handleInputBorderColorChange = (val: string | null) => {
  const isCleared = val === null || val === undefined || val === ''
  updateConfig('inputBorderColor', isCleared ? '' : latestInputBorderColor.value)
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
  background-color: var(--bg-input);
  color: var(--text-primary);
}

.form-group input::placeholder,
.form-group select::placeholder {
  color: var(--text-placeholder);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-group :deep(.el-color-picker__trigger) {
  width: 100%;
}

.form-group--switch {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.form-group--switch :deep(.el-switch) {
  margin-top: 6px;
}

.form-row {
  display: flex;
  gap: 8px;
}

.form-row .form-group {
  flex: 1;
}
</style>
