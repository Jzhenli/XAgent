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
  background: rgba(2, 6, 23, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(34, 211, 238, 0.15), 0 0 80px rgba(168, 85, 247, 0.1);
  overflow: hidden;
  border: 1px solid rgba(34, 211, 238, 0.2);
  animation: modal-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 18px 24px;
  border-bottom: 1px solid rgba(34, 211, 238, 0.15);
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(168, 85, 247, 0.08) 100%);
}

.modal-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 1px;
  text-shadow: 0 0 10px rgba(34, 211, 238, 0.3);
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-title::before {
  content: '⚠️';
  font-size: 20px;
  filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.5));
}

.modal-body {
  padding: 24px;
}

.modal-body p {
  margin: 0;
  color: var(--text-regular);
  font-size: 15px;
  line-height: 1.8;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid rgba(34, 211, 238, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: rgba(255, 255, 255, 0.02);
}

.modal-footer :deep(.el-button) {
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.5px;
}

.modal-footer :deep(.el-button:not(.el-button--primary)) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(34, 211, 238, 0.3);
  color: var(--text-regular);
}

.modal-footer :deep(.el-button:not(.el-button--primary):hover) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(34, 211, 238, 0.5);
  color: var(--text-primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.modal-footer :deep(.el-button.el-button--primary) {
  background: linear-gradient(135deg, var(--scada-cyan) 0%, #0ea5e9 100%);
  border: none;
  color: #0f172a;
  font-weight: 600;
  box-shadow: 0 4px 16px var(--scada-cyan-glow);
}

.modal-footer :deep(.el-button.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(34, 211, 238, 0.6), 0 0 40px rgba(34, 211, 238, 0.2);
  filter: brightness(1.1);
}

.modal-footer :deep(.el-button.el-button--primary:active) {
  transform: translateY(0);
}
</style>