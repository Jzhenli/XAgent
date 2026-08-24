<template>
  <el-dialog
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :show-close="false"
    :width="420"
    align-center
    class="wv-dialog"
    modal-class="wv-overlay"
  >
    <template #header>
      <div class="wv-header">
        <span class="wv-header__title">{{ t('scada.writeValueDialog.title') }}</span>
        <button class="wv-header__close" @click="handleCancel" aria-label="close">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </template>

    <div class="wv-body">
      <div class="wv-body__label">{{ t('scada.writeValueDialog.placeholder') }}</div>
      <el-input
        v-model="inputValueStr"
        class="wv-input"
        type="number"
        :min="Number.MIN_SAFE_INTEGER"
        :max="Number.MAX_SAFE_INTEGER"
      />
    </div>

    <template #footer>
      <div class="wv-footer">
        <el-button class="wv-btn wv-btn--cancel" @click="handleCancel">
          {{ t('common.cancel') }}
        </el-button>
        <el-button
          class="wv-btn wv-btn--confirm"
          :disabled="inputValue === null"
          @click="handleConfirm"
        >
          {{ t('common.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'confirm', value: number): void
}>()

const dialogVisible = ref(false)
const inputValue = ref<number | null>(null)
const inputValueStr = ref<string>('')

watch(inputValueStr, (val) => {
  if (val === '' || val === null) {
    inputValue.value = null
  } else {
    const num = Number(val)
    inputValue.value = isNaN(num) ? null : num
  }
})

watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val
    if (!val) {
      inputValue.value = null
      inputValueStr.value = ''
    }
  }
)

watch(dialogVisible, (val) => {
  emit('update:visible', val)
})

const handleCancel = () => {
  dialogVisible.value = false
}

const handleConfirm = () => {
  if (inputValue.value === null) {
    return
  }
  emit('confirm', inputValue.value)
  dialogVisible.value = false
}
</script>

<style>
/* ==================== 遮罩层 ==================== */
.el-overlay.wv-overlay {
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

/* ==================== 弹窗容器 ==================== */
.wv-dialog.el-dialog {
  padding: 0;
  border-radius: 14px;
  overflow: hidden;
  background-color: var(--bg-modal);
  border: 1px solid var(--border-base);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}

/* ==================== 头部 ==================== */
.wv-dialog .el-dialog__header {
  padding: 22px 24px 8px;
  margin-right: 0;
}

.wv-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.wv-header__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.2px;
}

.wv-header__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.wv-header__close:hover {
  background-color: var(--bg-base);
  color: var(--text-primary);
}

.wv-header__close svg {
  width: 16px;
  height: 16px;
}

/* ==================== 主体 ==================== */
.wv-dialog .el-dialog__body {
  padding: 12px 24px 4px;
}

.wv-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wv-body__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-regular);
}

/* ==================== 数值输入框 ==================== */
.wv-input.el-input {
  width: 100%;
}

.wv-input .el-input__wrapper {
  padding: 4px 12px;
  background-color: var(--bg-base);
  border: 1px solid var(--border-base);
  border-radius: 8px;
  box-shadow: none !important;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.wv-input .el-input__wrapper:hover {
  border-color: var(--color-primary);
}

.wv-input .el-input__wrapper.is-focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-light) !important;
}

.wv-input .el-input__inner {
  color: var(--text-primary);
  font-size: 15px;
  height: 28px;
  line-height: 28px;
}

.wv-input .el-input__inner::placeholder {
  color: var(--text-placeholder);
  font-size: 14px;
}

/* 隐藏原生 number spinner */
.wv-input .el-input__inner::-webkit-inner-spin-button,
.wv-input .el-input__inner::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* ==================== 底部 ==================== */
.wv-dialog .el-dialog__footer {
  padding: 16px 24px 22px;
}

.wv-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.wv-btn {
  min-width: 76px;
  height: 34px;
  padding: 0 18px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.wv-btn--cancel {
  background-color: transparent;
  border: 1px solid var(--border-base);
  color: var(--text-regular);
}

.wv-btn--cancel:hover {
  background-color: transparent;
  border-color: var(--border-base);
  color: var(--text-regular);
}

.wv-btn--confirm {
  background-color: var(--color-primary);
  border: 1px solid var(--color-primary);
  color: #ffffff;
}

.wv-btn--confirm:hover:not(.is-disabled) {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.wv-btn--confirm:active:not(.is-disabled) {
  background-color: var(--color-primary-active);
}

.wv-btn--confirm.is-disabled {
  background-color: var(--bg-disabled);
  border-color: var(--border-base);
  color: var(--text-placeholder);
  cursor: not-allowed;
}
</style>
