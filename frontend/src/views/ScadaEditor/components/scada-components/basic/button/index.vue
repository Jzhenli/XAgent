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
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const props = defineProps<{
  component: ScadaComponent
  editing?: boolean
}>()

const buttonConfig = computed(() => props.component.config as ButtonComponentConfig)
const binding = computed(() => props.component.binding)
const fallbackValue = computed(() => props.component.config.value)

const { currentValue, writeValue } = useScadaBinding(
  binding,
  {},
  fallbackValue,
)

const writing = ref(false)

// 按钮显示文字，直接使用配置值，默认回退为 "Button"
const displayText = computed(() => buttonConfig.value?.text || 'Button')

// 根据配置生成按钮内联样式
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

// 点击按钮时直接写入配置值
const handleClick = async () => {
  if (props.editing) return
  // 写值请求进行中时忽略点击，避免连续点击产生并发写请求
  if (writing.value) return

  // 必须存在绑定目标才能写入
  const target = binding.value || buttonConfig.value?.writePoint || null
  if (!target) {
    ElMessage.error(t('scadaBinding.noBoundPoint'))
    return
  }

  writing.value = true
  try {
    const result = await writeValue(buttonConfig.value?.writeValue)
    if (result.success) {
      //ElMessage.success(t('scadaComponents.commandSent'))
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
