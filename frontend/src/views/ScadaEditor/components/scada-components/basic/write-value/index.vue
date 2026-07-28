<template>
  <div
    class="write-value-container"
    :style="containerStyle"
    @click="handleClick"
  >
    <div v-if="showEditor" class="write-value-edit-wrapper" @click.stop>
      <input
        ref="inputRef"
        v-model="inputValue"
        class="write-value-input"
        :style="inputStyle"
        type="text"
        :disabled="props.editing"
        @blur="handleCancel"
        @keydown.enter="handleSubmit"
        @keydown.esc="handleCancel"
      />
      <div class="write-value-actions">
        <span
          class="write-value-action write-value-confirm"
          :style="confirmStyle"
          @mousedown.prevent
          @touchstart.prevent
          @click="handleSubmit"
        >
          ✓
        </span>
        <span
          class="write-value-action write-value-cancel"
          :style="cancelStyle"
          @mousedown.prevent
          @touchstart.prevent
          @click="handleCancel"
        >
          ✕
        </span>
      </div>
    </div>
    <span v-else class="write-value-text" :style="textStyle">
      {{ displayValue }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import type { ScadaComponent, WriteValueComponentConfig } from '@/types/scada'
import { useScadaBinding } from '@/views/ScadaEditor/hooks'

const props = defineProps<{
  component: ScadaComponent
  editing?: boolean
}>()

const { t } = useI18n()

const writeValueConfig = computed(() => props.component.config as WriteValueComponentConfig)
const binding = computed(() => props.component.binding)
const fallbackValue = computed(() => writeValueConfig.value.value ?? '')

const { currentValue, writeValue } = useScadaBinding(binding, {}, fallbackValue)

const fontSize = computed(() => writeValueConfig.value.fontSize ?? 24)
const fontColor = computed(() => writeValueConfig.value.fontColor ?? '#000000')

const displayValue = computed(() => {
  const value = currentValue.value
  if (value === null || value === undefined) return ''
  return String(value)
})

const containerStyle = computed(() => ({
  fontSize: `${fontSize.value}px`,
  color: fontColor.value,
}))

const textStyle = computed(() => ({
  color: fontColor.value,
  fontSize: `${fontSize.value}px`,
}))

const showInputMode = computed(() => !!writeValueConfig.value.showInput)
const inputBorderColor = computed(() => writeValueConfig.value.inputBorderColor || 'var(--color-primary)')

const inputStyle = computed(() => ({
  color: fontColor.value,
  fontSize: `${fontSize.value}px`,
  borderColor: inputBorderColor.value,
}))

const isEditing = ref(false)
const inputValue = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const showEditor = computed(() => showInputMode.value && (isEditing.value || !!props.editing))

const confirmColor = computed(() => writeValueConfig.value.confirmColor || '#67c23a')
const cancelColor = computed(() => writeValueConfig.value.cancelColor || '#f56c6c')

const confirmStyle = computed(() => ({
  color: confirmColor.value,
  fontSize: `${fontSize.value}px`,
}))

const cancelStyle = computed(() => ({
  color: cancelColor.value,
  fontSize: `${fontSize.value}px`,
}))

watch(displayValue, (val) => {
  if (!isEditing.value) {
    inputValue.value = val
  }
}, { immediate: true })

const handleClick = () => {
  if (props.editing || !showInputMode.value) return
  isEditing.value = true
  inputValue.value = displayValue.value
  nextTick(() => {
    inputRef.value?.focus()
    inputRef.value?.select()
  })
}

const parseValue = (raw: string): number | string => {
  if (raw === '') return ''
  const num = Number(raw)
  if (!Number.isNaN(num) && raw.trim() === String(num)) {
    return num
  }
  return raw
}

const handleSubmit = async () => {
  if (props.editing) return
  const target = parseValue(inputValue.value)
  isEditing.value = false

  if (!binding.value) {
    currentValue.value = target
    return
  }

  const result = await writeValue(target)
  if (result.success) {
    ElMessage.success(t('scada.writeValueDialog.success'))
  } else {
    ElMessage.error(result.message || t('scada.writeValueDialog.failed'))
  }
}

const handleCancel = () => {
  if (props.editing) return
  isEditing.value = false
  inputValue.value = displayValue.value
}
</script>

<style scoped>
.write-value-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
}

.write-value-text {
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.write-value-edit-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
}

.write-value-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0 4px;
  border: 1px solid;
  border-radius: 4px;
  background: transparent;
  text-align: center;
  outline: none;
  box-sizing: border-box;
}

.write-value-actions {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 8px;
}

.write-value-action {
  width: auto;
  min-width: 14px;
  height: 100%;
  padding: 0 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
}
</style>
