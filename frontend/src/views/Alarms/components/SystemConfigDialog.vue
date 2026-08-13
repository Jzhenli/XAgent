<template>
  <el-dialog
    :model-value="modelValue"
    :title="t('alerts.systemConfigTitle')"
    width="min(560px, 92vw)"
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
      <el-divider content-position="left">{{ t('alerts.basicSettings') }}</el-divider>

      <el-form-item :label="t('alerts.retentionDaysLabel')" prop="retentionDays">
        <el-input-number
          v-model="form.retentionDays"
          :min="1"
          :max="365"
          controls-position="right"
        />
        <span class="form-item-hint">{{ t('alerts.retentionDaysHint') }}</span>
      </el-form-item>

      <el-form-item :label="t('alerts.maxNotificationsLabel')" prop="maxNotifications">
        <el-input-number
          v-model="form.maxNotifications"
          :min="100"
          :max="10000"
          :step="100"
          controls-position="right"
        />
        <span class="form-item-hint">{{ t('alerts.maxNotificationsHint') }}</span>
      </el-form-item>

      <el-form-item :label="t('alerts.notificationLevelsLabel')" prop="notifyLevels">
        <el-checkbox-group v-model="form.notifyLevels">
          <el-checkbox label="critical">{{ t('alerts.levelCritical') }}</el-checkbox>
          <el-checkbox label="warning">{{ t('alerts.levelWarning') }}</el-checkbox>
          <el-checkbox label="info">{{ t('alerts.levelInfo') }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-divider content-position="left">{{ t('alerts.notificationMethods') }}</el-divider>

      <el-form-item :label="t('alerts.desktopNotificationLabel')">
        <el-switch v-model="form.desktopEnabled" />
        <span class="form-item-hint">{{ t('alerts.desktopNotificationHint') }}</span>
      </el-form-item>

      <el-form-item :label="t('alerts.soundLabel')">
        <el-switch v-model="form.soundEnabled" />
        <span class="form-item-hint">{{ t('alerts.soundHint') }}</span>
      </el-form-item>

      <el-divider content-position="left">{{ t('alerts.doNotDisturb') }}</el-divider>

      <el-form-item :label="t('alerts.doNotDisturbLabel')">
        <el-switch v-model="form.quietHoursEnabled" />
        <span class="form-item-hint">{{ t('alerts.doNotDisturbHint') }}</span>
      </el-form-item>

      <template v-if="form.quietHoursEnabled">
        <el-form-item :label="t('alerts.startTimeLabel')" prop="quietHoursStart">
          <el-time-select
            v-model="form.quietHoursStart"
            start="00:00"
            step="00:30"
            end="23:30"
            :placeholder="t('alerts.selectStartTime')"
          />
        </el-form-item>
        <el-form-item :label="t('alerts.endTimeLabel')" prop="quietHoursEnd">
          <el-time-select
            v-model="form.quietHoursEnd"
            start="00:00"
            step="00:30"
            end="23:30"
            :placeholder="t('alerts.selectEndTime')"
          />
        </el-form-item>
      </template>

      <el-divider content-position="left">{{ t('alerts.autoProcess') }}</el-divider>

      <el-form-item :label="t('alerts.autoReadLabel')">
        <el-input-number
          v-model="form.autoReadMinutes"
          :min="0"
          :max="10080"
          controls-position="right"
        />
        <span class="form-item-hint">{{ t('alerts.autoReadHint') }}</span>
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
import type { SystemNotificationConfig } from '@/stores/alerts'

const props = defineProps<{
  /** 对话框可见性 */
  modelValue: boolean
  /** 系统通知配置表单 */
  form: SystemNotificationConfig
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
  retentionDays: [{ required: true, message: t('alerts.retentionDaysRequired'), trigger: 'blur' }],
  maxNotifications: [{ required: true, message: t('alerts.maxNotificationsRequired'), trigger: 'blur' }],
  quietHoursStart: [{ required: true, message: t('alerts.startTimeRequired'), trigger: 'change' }],
  quietHoursEnd: [{ required: true, message: t('alerts.endTimeRequired'), trigger: 'change' }],
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
