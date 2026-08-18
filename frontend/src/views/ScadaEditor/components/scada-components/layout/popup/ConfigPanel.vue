<template>
  <div class="config-section">
    <div class="section-title">{{ t("componentConfig.popupConfig") }}</div>

    <div class="subsection-title">{{ t("componentConfig.triggerSection") }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.triggerText") }}</label>
        <input
          type="text"
          :value="config.triggerText"
          @input="updateConfig('triggerText', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.triggerIcon") }}</label>
        <input
          type="text"
          :value="config.triggerIcon"
          placeholder="📌"
          @input="updateConfig('triggerIcon', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.fontSize") }}</label>
        <input
          type="number"
          :value="config.fontSize"
          @input="updateConfig('fontSize', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.triggerFontColor") }}</label>
        <el-color-picker
          :model-value="config.triggerFontColor"
          show-alpha
          @active-change="(val: string | null) => { latestTriggerFontColor = val || '' }"
          @change="(val: string | null) => handleColorChange('triggerFontColor', val)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.triggerBackgroundColor") }}</label>
        <el-color-picker
          :model-value="config.triggerBackgroundColor"
          show-alpha
          @active-change="(val: string | null) => { latestTriggerBgColor = val || '' }"
          @change="(val: string | null) => handleColorChange('triggerBackgroundColor', val)"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.triggerBorderColor") }}</label>
        <el-color-picker
          :model-value="config.triggerBorderColor"
          show-alpha
          @active-change="(val: string | null) => { latestTriggerBorderColor = val || '' }"
          @change="(val: string | null) => handleColorChange('triggerBorderColor', val)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.borderWidth") }}</label>
        <input
          type="number"
          :value="config.borderWidth"
          @input="updateConfig('borderWidth', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.triggerBorderRadius") }}</label>
        <input
          type="number"
          :value="config.triggerBorderRadius"
          @input="updateConfig('triggerBorderRadius', +($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <div class="subsection-title">{{ t("componentConfig.popupSection") }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t("componentConfig.popupTitle") }}</label>
        <input
          type="text"
          :value="config.popupTitle"
          @input="updateConfig('popupTitle', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.popupWidth") }}</label>
        <input
          type="number"
          :value="config.popupWidth"
          @input="updateConfig('popupWidth', +($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <div class="form-group">
      <label>{{ t("componentConfig.popupContent") }}</label>
      <textarea
        :value="config.popupContent"
        rows="4"
        :placeholder="config.useHtml ? '<p>支持 HTML 内容</p>' : '支持纯文本内容'"
        @input="updateConfig('popupContent', ($event.target as HTMLTextAreaElement).value)"
      />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="checkbox-label">
          <input
            type="checkbox"
            :checked="config.useHtml"
            @change="updateConfig('useHtml', ($event.target as HTMLInputElement).checked)"
          />
          {{ t("componentConfig.useHtml") }}
        </label>
      </div>
      <div class="form-group">
        <label>{{ t("componentConfig.maskColor") }}</label>
        <el-color-picker
          :model-value="config.maskColor"
          show-alpha
          @active-change="(val: string | null) => { latestMaskColor = val || '' }"
          @change="(val: string | null) => handleColorChange('maskColor', val)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScadaConfig } from '../../../../hooks/useScadaEditor'
import type { ScadaComponent } from '../../../../types'

const { t } = useI18n()

const props = defineProps<{
  component: ScadaComponent
}>()

const { config, updateConfig } = useScadaConfig(
  props.component as ScadaComponent<'popup'>
)

const latestTriggerFontColor = ref<string>('')
const latestTriggerBgColor = ref<string>('')
const latestTriggerBorderColor = ref<string>('')
const latestMaskColor = ref<string>('')

watch(
  () => config.value.triggerFontColor,
  (val) => { latestTriggerFontColor.value = val || '' },
  { immediate: true }
)
watch(
  () => config.value.triggerBackgroundColor,
  (val) => { latestTriggerBgColor.value = val || '' },
  { immediate: true }
)
watch(
  () => config.value.triggerBorderColor,
  (val) => { latestTriggerBorderColor.value = val || '' },
  { immediate: true }
)
watch(
  () => config.value.maskColor,
  (val) => { latestMaskColor.value = val || '' },
  { immediate: true }
)

const colorMap: Record<string, { ref: Ref<string> }> = {
  triggerFontColor: { ref: latestTriggerFontColor },
  triggerBackgroundColor: { ref: latestTriggerBgColor },
  triggerBorderColor: { ref: latestTriggerBorderColor },
  maskColor: { ref: latestMaskColor }
}

const handleColorChange = (key: string, val: string | null) => {
  const isCleared = val === null || val === undefined || val === ''
  const latest = colorMap[key]?.ref.value ?? ''
  updateConfig(key as any, isCleared ? '' : latest)
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
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 6px;
  font-size: 13px;
  background-color: var(--scada-bg-elevated);
  color: var(--text-primary);
}

.form-group textarea {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 6px;
  font-size: 13px;
  background-color: var(--scada-bg-elevated);
  color: var(--text-primary);
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
}

.form-group input::placeholder,
.form-group select::placeholder,
.form-group textarea::placeholder {
  color: var(--text-placeholder);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-group textarea:focus {
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

.checkbox-label {
  display: flex !important;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 14px;
  height: 14px;
  margin: 0;
}
</style>