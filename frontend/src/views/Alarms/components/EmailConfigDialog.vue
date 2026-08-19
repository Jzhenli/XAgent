<template>
  <el-dialog
    :model-value="modelValue"
    :title="t('alerts.emailConfigTitle')"
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
      <el-divider content-position="left">{{ t('alerts.smtpServer') }}</el-divider>

      <el-form-item :label="t('alerts.serverAddress')" prop="smtpHost">
        <el-input v-model="form.smtpHost" placeholder="smtp.example.com" />
      </el-form-item>

      <el-form-item :label="t('alerts.port')" prop="smtpPort">
        <el-input-number v-model="form.smtpPort" :min="1" :max="65535" controls-position="right" />
      </el-form-item>

      <el-form-item :label="t('alerts.enableTls')">
        <el-switch v-model="form.useTls" />
      </el-form-item>

      <el-form-item :label="t('alerts.enableSsl')">
        <el-switch v-model="form.useSsl" />
        <span class="form-item-hint">{{ t('alerts.sslHint') }}</span>
      </el-form-item>

      <el-divider content-position="left">{{ t('alerts.authInfo') }}</el-divider>

      <el-form-item :label="t('alerts.username')">
        <el-input v-model="form.username" placeholder="user@example.com" />
      </el-form-item>

      <el-form-item :label="t('alerts.password')">
        <el-input v-model="form.password" type="password" show-password placeholder="********" />
      </el-form-item>

      <el-form-item :label="t('alerts.fromAddressLabel')" prop="fromAddress">
        <el-input v-model="form.fromAddress" placeholder="noreply@example.com" />
      </el-form-item>

      <el-divider content-position="left">{{ t('alerts.recipientsLabel') }}</el-divider>

      <el-form-item :label="t('alerts.recipientsLabel')" prop="recipients">
        <el-select
          v-model="form.recipients"
          multiple
          filterable
          allow-create
          default-first-option
          :placeholder="t('alerts.recipientsPlaceholder')"
          style="width: 100%"
          class="scada-select"
          popper-class="scada-select-dropdown"
        />
        <span class="form-item-hint">{{ t('alerts.recipientsHint') }}</span>
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
import type { EmailConfigForm } from '../types'

defineProps<{
  /** 对话框可见性 */
  modelValue: boolean
  /** 邮件配置表单 */
  form: EmailConfigForm
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
  smtpHost: [{ required: true, message: t('alerts.smtpHostRequired'), trigger: 'blur' }],
  smtpPort: [{ required: true, message: t('alerts.smtpPortRequired'), trigger: 'blur' }],
  fromAddress: [{ required: true, message: t('alerts.fromAddressRequired'), trigger: 'blur' }],
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
