<template>
  <el-dialog v-model="dialogVisible" :title="$t('settings.password.title')" width="min(400px, 90vw)" destroy-on-close class="x-dialog password-dialog">
    <el-form label-width="120px" label-position="left">
      <el-form-item :label="$t('settings.password.new_password')">
        <el-input v-model="form.new_password" type="password" show-password :placeholder="$t('settings.password.new_password_placeholder')" />
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
  form: { new_password: string }
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
/* 引入 Settings 模块通用弹框样式 */
@import '../style/DialogCommon.css';
</style>