<template>
  <el-dialog
    v-model="visible"
    :title="$t('scada.editProject')"
    width="500px"
    class="project-dialog"
  >
    <el-form label-width="80px">
      <el-form-item :label="$t('scada.projectName')" required>
        <el-input v-model="name" :placeholder="$t('scada.enterProjectName')" />
      </el-form-item>
      <el-form-item :label="$t('scada.projectDesc')">
        <el-input
          v-model="description"
          type="textarea"
          :placeholder="$t('scada.enterProjectDesc')"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="$emit('save')">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const visible = defineModel<boolean>({ required: true })
const name = defineModel<string>('name', { required: true })
const description = defineModel<string>('description', { required: true })

defineEmits<{
  (e: 'save'): void
}>()
</script>

<style>
.project-dialog {
  background-color: var(--bg-card) !important;
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.22),
    0 4px 16px rgba(0, 0, 0, 0.10) !important;
}

.project-dialog .el-dialog__header {
  background-color: var(--bg-card) !important;
  padding: 16px 20px;
  margin-right: 0;
}

.project-dialog .el-dialog__title {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
}

.project-dialog .el-dialog__body {
  background-color: var(--bg-card) !important;
  padding: 20px;
}

.project-dialog .el-dialog__footer {
  background-color: var(--bg-card) !important;
  padding: 14px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.project-dialog .el-form-item__label {
  color: var(--text-primary);
  text-align: left !important;
  font-weight: 500;
}

.project-dialog .el-form-item.is-required .el-form-item__label::before {
  color: var(--color-danger);
}

.project-dialog .el-input__wrapper,
.project-dialog .el-textarea__wrapper {
  box-shadow: none !important;
  border: none !important;
  border-bottom: 1px solid var(--border-base) !important;
  border-radius: 0 !important;
  background: transparent !important;
  transition: border-color 0.2s;
}

.project-dialog .el-input__wrapper.is-focus,
.project-dialog .el-textarea__wrapper.is-focus {
  border-bottom-color: var(--color-primary) !important;
}

.project-dialog .el-input__inner,
.project-dialog .el-textarea__inner {
  background: transparent !important;
  color: var(--text-primary) !important;
}

.project-dialog .el-input__inner::placeholder,
.project-dialog .el-textarea__inner::placeholder {
  color: var(--text-placeholder);
}

.project-dialog .el-input__wrapper.is-disabled,
.project-dialog .el-textarea.is-disabled .el-textarea__wrapper {
  background: transparent !important;
  
}

.project-dialog .el-input__suffix {
  color: var(--text-secondary);
}

.project-dialog .el-button {
  transition: all 0.2s !important;
}

.project-dialog .el-button:not(.el-button--primary) {
  background-color: var(--el-button-bg-color) !important;
  border-color: var(--el-button-border-color) !important;
  color: var(--text-regular) !important;
}

.project-dialog .el-button:not(.el-button--primary):hover {
  background-color: var(--el-button-hover-bg-color) !important;
  border-color: var(--el-color-primary) !important;
  color: var(--color-primary) !important;
}

.project-dialog .el-button--primary {
  background-color: rgba(102, 102, 255, 1) !important;
  border-color: rgba(102, 102, 255, 1) !important;
  color: #fff !important;
}

.project-dialog .el-button--primary:hover {
  background-color: rgba(102, 102, 255, 0.88) !important;
  border-color: rgba(102, 102, 255, 0.88) !important;
}
</style>
