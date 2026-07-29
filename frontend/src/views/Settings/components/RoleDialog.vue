<template>
  <el-dialog v-model="dialogVisible" :title="title" width="min(480px, 92vw)" destroy-on-close class="settings-dialog">
    <el-form label-width="90px">
      <el-form-item :label="$t('settings.role.name')" v-if="!editingRoleName">
        <el-input v-model="form.name" :placeholder="$t('settings.role.name_placeholder')" />
      </el-form-item>
      <el-form-item :label="$t('settings.role.name')" v-else>
        <el-input :model-value="form.name" disabled />
      </el-form-item>
      <el-form-item :label="$t('settings.user.display_name')">
        <el-input v-model="form.display_name" :placeholder="$t('settings.user.display_name_placeholder')" />
      </el-form-item>
      <el-form-item :label="$t('settings.role.description')">
        <el-input v-model="form.description" type="textarea" :rows="3" :placeholder="$t('settings.role.description_placeholder')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="emit('submit')">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  visible: boolean
  title: string
  editingRoleName: string | null
  form: {
    name: string
    display_name: string
    description: string
  }
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'submit'): void
}>()

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
})
</script>

<style>
.settings-dialog {
  --el-bg-color: var(--bg-modal);
  border-radius: 16px;
  overflow: hidden;
}

.settings-dialog .el-dialog__header {
  border-bottom: 1px solid var(--border-light, #ebeef5);
}

.settings-dialog .el-dialog__body {
  background: var(--bg-modal);
}

.settings-dialog .el-dialog__footer {
  background: var(--bg-modal);
  border-top: 1px solid var(--border-light, #ebeef5);
}
</style>