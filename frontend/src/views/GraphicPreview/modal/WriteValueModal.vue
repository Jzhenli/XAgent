<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('scada.writeValueDialog.title')"
    width="350px"
    :close-on-click-modal="false"
  >
    <el-input-number
      v-model="inputValue"
      :min="Number.MIN_SAFE_INTEGER"
      :max="Number.MAX_SAFE_INTEGER"
      :step="1"
      :placeholder="t('scada.writeValueDialog.placeholder')"
      style="width: 100%"
    />
    <template #footer>
      <el-button @click="handleCancel">{{ t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleConfirm">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'confirm', value: number): void
}>()

const dialogVisible = ref(false)
const inputValue = ref<number | null>(null)

watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val
    if (!val) {
      inputValue.value = null
    }
  }
)

watch(
  dialogVisible,
  (val) => {
    emit('update:visible', val)
  }
)

const handleCancel = () => {
  dialogVisible.value = false
}

const handleConfirm = () => {
  if (inputValue.value === null) {
    return
  }
  emit('confirm', inputValue.value)
  dialogVisible.value = false
}
</script>