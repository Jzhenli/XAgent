<template>
  <el-dialog
    :model-value="modelValue"
    :title="t('alerts.webhookConfigTitle')"
    width="min(520px, 92vw)"
    :close-on-click-modal="false"
    destroy-on-close
    class="x-dialog"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="110px"
      class="system-config-form"
    >
      <el-form-item label="URL" prop="url">
        <el-input v-model="form.url" placeholder="https://hooks.example.com/alert" />
      </el-form-item>

      <el-form-item :label="t('alerts.requestMethod')">
        <el-select v-model="form.method" style="width: 200px" class="scada-select" popper-class="scada-select-dropdown">
          <el-option label="POST" value="POST" />
          <el-option label="PUT" value="PUT" />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('alerts.customHeaders')">
        <el-input
          v-model="form.headers"
          type="textarea"
          :rows="3"
          placeholder='{"Content-Type": "application/json"}'
        />
      </el-form-item>

      <el-form-item :label="t('alerts.signatureKey')">
        <el-input
          v-model="form.secret"
          type="password"
          show-password
          :placeholder="t('alerts.signatureKeyHint')"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="emit('update:modelValue', false)">{{ t('common.cancel') }}</el-button>
      <el-button v-if="canSave" type="primary" @click="handleSave">
        {{ t('common.save') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormInstance } from 'element-plus'
import type { WebhookConfigForm } from '../types'

defineProps<{
  /** 对话框可见性 */
  modelValue: boolean
  /** Webhook 配置表单 */
  form: WebhookConfigForm
  /** 是否具备保存权限 */
  canSave: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save'): void
}>()

const { t } = useI18n()

/** 表单校验规则 */
const rules = {
  url: [{ required: true, message: t('alerts.webhookUrlRequired'), trigger: 'blur' }],
}

const formRef = ref<FormInstance>()

/** 校验通过后通知父级保存 */
const handleSave = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    emit('save')
  } catch {
    // 校验失败, 保持对话框打开
  }
}
</script>

<style>
@import './DialogCommon.css';
</style>
