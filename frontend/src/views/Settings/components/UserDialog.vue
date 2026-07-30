<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="min(480px, 92vw)"
    destroy-on-close
    class="user-settings-dialog"
  >
    <el-form label-width="90px" label-position="left">
      <el-form-item :label="$t('settings.user.username')" v-if="!editingUserId">
        <el-input
          v-model="form.username"
          :placeholder="$t('settings.user.username_placeholder')"
        />
      </el-form-item>
      <el-form-item :label="$t('settings.user.username')" v-else>
        <el-input :model-value="form.username" disabled />
      </el-form-item>
      <el-form-item :label="$t('settings.user.password')" v-if="!editingUserId">
        <el-input
          v-model="form.password"
          type="password"
          show-password
          :placeholder="$t('settings.user.password_placeholder')"
        />
      </el-form-item>
      <el-form-item :label="$t('settings.user.display_name')">
        <el-input
          v-model="form.display_name"
          :placeholder="$t('settings.user.display_name_placeholder')"
        />
      </el-form-item>
      <el-form-item :label="$t('settings.user.email')">
        <el-input
          v-model="form.email"
          :placeholder="$t('settings.user.email_placeholder')"
        />
      </el-form-item>
      <el-form-item :label="$t('settings.user.role')">
        <el-select v-model="form.role_name" style="width: 100%">
          <el-option
            v-for="opt in roleOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('settings.user.status')" v-if="editingUserId">
        <el-select v-model="form.status" style="width: 100%">
          <el-option :label="$t('settings.status.active')" value="active" />
          <el-option :label="$t('settings.status.inactive')" value="inactive" />
          <el-option :label="$t('settings.status.locked')" value="locked" />
        </el-select>
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
  editingUserId: number | null;
  form: {
    username: string;
    password: string;
    display_name: string;
    email: string;
    role_name: string;
    status: string;
  };
  roleOptions: { label: string; value: string }[];
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
.user-settings-dialog {
  background-color: var(--bg-modal) !important;
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.22),
    0 4px 16px rgba(0, 0, 0, 0.1) !important;
}

.user-settings-dialog .el-dialog__header {
  background-color: var(--bg-modal) !important;
}

.user-settings-dialog .el-dialog__body {
  background-color: var(--bg-modal) !important;
}

.user-settings-dialog .el-dialog__footer {
  background-color: var(--bg-modal) !important;
}

.user-settings-dialog .el-form-item__label {
  text-align: left !important;
}

.user-settings-dialog .el-input__wrapper,
.user-settings-dialog .el-select__wrapper,
.user-settings-dialog .el-textarea__wrapper {
  box-shadow: none !important;
  border: none !important;
  border-bottom: 1px solid var(--border-base, #dcdfe6) !important;
  border-radius: 0 !important;
  background: transparent !important;
}

.user-settings-dialog .el-input__wrapper.is-focus,
.user-settings-dialog .el-select.is-focused .el-select__wrapper,
.user-settings-dialog .el-textarea__wrapper.is-focus {
  border-bottom-color: var(--color-primary, #409eff) !important;
}

.user-settings-dialog .el-input__inner,
.user-settings-dialog .el-textarea__inner {
  background: transparent !important;
  color: var(--text-primary) !important;
}

.user-settings-dialog .el-select__selected-item,
.user-settings-dialog .el-select__placeholder {
  background: transparent !important;
  color: var(--text-primary) !important;
}

.user-settings-dialog .el-input__wrapper.is-disabled,
.user-settings-dialog .el-textarea.is-disabled .el-textarea__wrapper {
  background: transparent !important;
  border-bottom-color: var(--border-base, #dcdfe6) !important;
}

.user-settings-dialog .el-select__suffix,
.user-settings-dialog .el-input__suffix {
  color: var(--text-secondary);
}

.user-settings-dialog .el-button {
  transition: none !important;
}

.user-settings-dialog .el-button:not(.el-button--primary):hover {
  background-color: var(--el-button-bg-color) !important;
  border-color: var(--el-button-border-color) !important;
  color: var(--el-text-color-regular) !important;
}

.user-settings-dialog .el-button--primary {
  background-color: rgba(102, 102, 255, 1) !important;
  border-color: rgba(102, 102, 255, 1) !important;
}

.user-settings-dialog .el-button--primary:hover {
  background-color: rgba(102, 102, 255, 1) !important;
  border-color: rgba(102, 102, 255, 1) !important;
}
</style>
