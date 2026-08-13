<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="min(480px, 92vw)"
    destroy-on-close
    class="role-settings-dialog"
  >
    <el-form label-width="90px" label-position="left">
      <el-form-item :label="$t('settings.role.name')" v-if="!editingRoleName">
        <el-input
          v-model="form.name"
          :placeholder="$t('settings.role.name_placeholder')"
        />
      </el-form-item>
      <el-form-item :label="$t('settings.role.name')" v-else>
        <el-input :model-value="form.name" disabled />
      </el-form-item>
      <el-form-item :label="$t('settings.user.display_name')">
        <el-input
          v-model="form.display_name"
          :placeholder="$t('settings.user.display_name_placeholder')"
        />
      </el-form-item>
      <el-form-item :label="$t('settings.role.description')">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          :placeholder="$t('settings.role.description_placeholder')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">{{
        $t("common.cancel")
      }}</el-button>
      <el-button type="primary" @click="emit('submit')">{{
        $t("common.confirm")
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  visible: boolean;
  title: string;
  editingRoleName: string | null;
  form: {
    name: string;
    display_name: string;
    description: string;
  };
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "submit"): void;
}>();

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit("update:visible", val),
});
</script>

<style>
.role-settings-dialog {
  background-color: var(--bg-modal) !important;
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.22),
    0 4px 16px rgba(0, 0, 0, 0.10) !important;
}

.role-settings-dialog .el-dialog__header {
  background-color: var(--bg-modal) !important;
}

.role-settings-dialog .el-dialog__body {
  background-color: var(--bg-modal) !important;
}

.role-settings-dialog .el-dialog__footer {
  background-color: var(--bg-modal) !important;
}

.role-settings-dialog .el-form-item__label {
  text-align: left !important;
}

.role-settings-dialog .el-input__wrapper,
.role-settings-dialog .el-textarea__wrapper {
  box-shadow: none !important;
  border: none !important;
  border-bottom: 1px solid var(--border-base, #dcdfe6) !important;
  border-radius: 0 !important;
  background: transparent !important;
}

.role-settings-dialog .el-input__wrapper.is-focus,
.role-settings-dialog .el-textarea__wrapper.is-focus {
  border-bottom-color: var(--color-primary, #409eff) !important;
}

.role-settings-dialog .el-input__inner,
.role-settings-dialog .el-textarea__inner {
  background: transparent !important;
  color: var(--text-primary) !important;
}

.role-settings-dialog .el-input__wrapper.is-disabled,
.role-settings-dialog .el-textarea.is-disabled .el-textarea__wrapper {
  background: transparent !important;
  border-bottom-color: var(--border-base, #dcdfe6) !important;
}

.role-settings-dialog .el-button {
  transition: none !important;
}

.role-settings-dialog .el-button:not(.el-button--primary):hover {
  background-color: var(--el-button-bg-color) !important;
  border-color: var(--el-button-border-color) !important;
  color: var(--el-text-color-regular) !important;
}

.role-settings-dialog .el-button--primary {
  background-color: rgba(102, 102, 255, 1) !important;
  border-color: rgba(102, 102, 255, 1) !important;
}

.role-settings-dialog .el-button--primary:hover {
  background-color: rgba(102, 102, 255, 1) !important;
  border-color: rgba(102, 102, 255, 1) !important;
}
</style>
