<template>
  <el-dialog v-model="dialogVisible" :title="title" width="min(480px, 92vw)" destroy-on-close>
    <el-form label-width="90px">
      <el-form-item :label="$t('settings.user.username')" v-if="!editingUserId">
        <el-input v-model="form.username" :placeholder="$t('settings.user.username_placeholder')" />
      </el-form-item>
      <el-form-item :label="$t('settings.user.username')" v-else>
        <el-input :model-value="form.username" disabled />
      </el-form-item>
      <el-form-item :label="$t('settings.user.password')" v-if="!editingUserId">
        <el-input v-model="form.password" type="password" show-password :placeholder="$t('settings.user.password_placeholder')" />
      </el-form-item>
      <el-form-item :label="$t('settings.user.display_name')">
        <el-input v-model="form.display_name" :placeholder="$t('settings.user.display_name_placeholder')" />
      </el-form-item>
      <el-form-item :label="$t('settings.user.email')">
        <el-input v-model="form.email" :placeholder="$t('settings.user.email_placeholder')" />
      </el-form-item>
      <el-form-item :label="$t('settings.user.role')">
        <el-select v-model="form.role_name" style="width: 100%">
          <el-option v-for="opt in roleOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
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
  editingUserId: number | null
  form: {
    username: string
    password: string
    display_name: string
    email: string
    role_name: string
    status: string
  }
  roleOptions: { label: string; value: string }[]
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