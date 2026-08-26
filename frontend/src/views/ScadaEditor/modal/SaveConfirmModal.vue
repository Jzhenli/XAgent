<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('cancel')">
      <div class="modal-container">
        <div class="modal-header">
          <span class="modal-title">{{ $t('scada.exitConfirmTitle') }}</span>
        </div>
        <div class="modal-body">
          <p>{{ $t('scada.exitConfirm') }}</p>
        </div>
        <div class="modal-footer">
          <el-button @click="$emit('cancel')">{{ $t('common.cancel') }}</el-button>
          <el-button @click="$emit('discard')">{{ $t('scada.discardChanges') }}</el-button>
          <el-button type="primary" @click="$emit('save')">{{ $t('common.save') }}</el-button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
}>()

defineEmits<{
  save: []
  discard: []
  cancel: []
}>()
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--confirm-overlay-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: var(--bg-modal);
  border-radius: 16px;
  width: 420px;
  box-shadow:
    0 24px 64px rgba(0, 0, 0, 0.28),
    0 8px 24px rgba(0, 0, 0, 0.14),
    0 2px 6px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid var(--border-base);
}

.modal-header {
  padding: 16px 20px;
  background-color: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-body {
  padding: 20px;
  background-color: var(--bg-card);
}

.modal-body p {
  margin: 0;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.6;
}

.modal-footer {
  padding: 14px 20px;
  background-color: var(--bg-card);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-footer :deep(.el-button) {
  transition: all 0.2s;
}

.modal-footer :deep(.el-button:not(.el-button--primary)) {
  background-color: var(--el-button-bg-color);
  border-color: var(--el-button-border-color);
  color: var(--text-regular);
}

.modal-footer :deep(.el-button.el-button--primary) {
  background-color: rgba(102, 102, 255, 1);
  border-color: rgba(102, 102, 255, 1);
  color: #fff;
}

.modal-footer :deep(.el-button.el-button--primary:hover) {
  background-color: rgba(102, 102, 255, 0.88);
  border-color: rgba(102, 102, 255, 0.88);
}
</style>