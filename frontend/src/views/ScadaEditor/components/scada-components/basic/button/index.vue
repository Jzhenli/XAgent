<template>
  <div class="button-container">
    <button
      class="scada-button"
      :disabled="writing"
      :style="buttonStyle"
      @click="handleClick"
    >
      {{ displayText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ScadaComponent, ButtonComponentConfig } from '@/types/scada'
import { useScadaBinding } from '@/views/ScadaEditor/hooks'
import { ElMessageBox, ElMessage } from 'element-plus'

const { t } = useI18n()

const props = defineProps<{
  config: ScadaComponent
  editing?: boolean
}>()

const buttonConfig = computed(() => props.config.config as ButtonComponentConfig)
const binding = computed(() => props.config.binding)
const fallbackValue = computed(() => props.config.config.value)

const { currentValue, writeValue } = useScadaBinding(
  binding,
  {},
  fallbackValue,
)

const writing = ref(false)

const displayText = computed(() => {
  const text = buttonConfig.value?.text
  if (!text) return t('scadaComponents.defaultButton')
  if (text.startsWith('scadaComponentNames.') || text.startsWith('scadaComponents.')) {
    return t(text)
  }
  return text
})

const buttonStyle = computed(() => {
  const config = buttonConfig.value
  const borderWidth = config.borderWidth ?? 0
  const borderColor = config.borderColor ?? config.backgroundColor ?? '#409eff'
  return {
    color: config.fontColor ?? '#ffffff',
    fontSize: `${config.fontSize ?? 14}px`,
    backgroundColor: config.backgroundColor ?? '#409eff',
    border: borderWidth > 0
      ? `${borderWidth}px ${config.borderStyle ?? 'solid'} ${borderColor}`
      : 'none',
  }
})

const handleClick = async () => {
  if (props.editing) return

  try {
    await ElMessageBox.confirm(
      t('scadaComponents.confirmExecute', { action: displayText.value }),
      t('scadaComponents.operationConfirm'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel') }
    )
  } catch {
    return
  }

  const target = binding.value || buttonConfig.value?.writePoint || null
  if (!target) {
    ElMessage.error(t('scadaBinding.noBoundPoint'))
    return
  }

  writing.value = true
  try {
    const result = await writeValue(buttonConfig.value?.writeValue)
    if (result.success) {
      ElMessage.success(t('scadaComponents.commandSent'))
    } else {
      ElMessage.error(result.message)
    }
  } catch (e: unknown) {
    const detail = (e as any)?.response?.data?.detail || (e instanceof Error ? e.message : t('scadaComponents.operationFailed'))
    ElMessage.error(detail)
  } finally {
    writing.value = false
  }
}
</script>

<style scoped>
.button-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.scada-button {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scada-button:hover {
  opacity: 0.9;
}

.scada-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
