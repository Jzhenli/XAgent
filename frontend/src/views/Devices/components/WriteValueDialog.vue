<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDeviceStore } from '@/stores/devices'
import type { WriteFormData } from '../types'

const props = defineProps<{
  modelValue: boolean
  form: WriteFormData
  writing: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'submit'): void
}>()

const { t } = useI18n()
const deviceStore = useDeviceStore()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
})

const deviceName = computed(() => {
  return deviceStore.getDeviceByAsset(props.form.deviceAsset)?.name || props.form.deviceAsset
})

const isSubmitDisabled = computed(() => {
  return props.form.pointType !== 'digital' && !props.form.value.trim()
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('devices.writePointValue')"
    width="min(480px, 90vw)"
    :close-on-click-modal="false"
    class="x-dialog"
  >
    <div class="write-info">
      <div class="write-info-row">
        <span class="write-info-label">{{ t('devices.device') }}</span>
        <span class="write-info-value">{{ deviceName }}</span>
      </div>
      <div class="write-info-row">
        <span class="write-info-label">{{ t('devices.point') }}</span>
        <span class="write-info-value">{{ form.pointName }}</span>
      </div>
      <div class="write-info-row">
        <span class="write-info-label">{{ t('devices.currentValue') }}</span>
        <span class="write-info-value current-value">{{ form.currentValue }}{{ form.unit ? ' ' + form.unit : '' }}</span>
      </div>
    </div>
    <el-divider />
    <div class="write-form">
      <template v-if="form.pointType === 'digital'">
        <div class="write-bool-control">
          <span class="write-bool-label">{{ t('devices.targetValue') }}</span>
          <el-switch 
            v-model="form.boolValue"
            :active-text="t('devices.on')"
            :inactive-text="t('devices.off')"
            style="--el-switch-on-color: #27ae60"
          />
        </div>
      </template>
      <template v-else>
        <el-input 
          v-model="form.value" 
          :placeholder="form.currentValue !== '--' ? t('devices.writePlaceholder', { value: form.currentValue }) : t('devices.writePlaceholderEmpty')"
          clearable
        >
          <template v-if="form.unit" #append>{{ form.unit }}</template>
        </el-input>
        <div v-if="form.unit" class="write-hint">
          {{ t('devices.writeHint') }}
        </div>
      </template>
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
      <el-button 
        type="warning" 
        :loading="writing" 
        :disabled="isSubmitDisabled"
        @click="emit('submit')"
      >
        {{ t('devices.confirmWrite') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style>
/* 引入 Devices 模块通用弹框样式（需 unscoped，弹框内容 teleport 到 body） */
@import './DialogCommon.css';
</style>

<style scoped>
/* ========== 写值信息展示区 ========== */
.write-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.write-info-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.write-info-label {
  width: 60px;
  flex-shrink: 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.write-info-value {
  font-size: 14px;
  color: var(--text-primary);
}

.write-info-value.current-value {
  color: var(--color-primary);
  font-weight: 600;
}

/* ========== 写值输入区 ========== */
.write-form {
  padding: 0 4px;
}

.write-bool-control {
  display: flex;
  align-items: center;
  gap: 16px;
}

.write-bool-label {
  font-size: 14px;
  color: var(--text-regular);
}

.write-hint {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 8px;
  line-height: 1.5;
}
</style>
