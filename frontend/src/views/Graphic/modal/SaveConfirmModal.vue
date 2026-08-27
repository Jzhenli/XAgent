<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <span class="modal-title">{{ $t('common.tip') }}</span>
          <el-icon class="modal-close" @click="$emit('cancel')">
            <Close />
          </el-icon>
        </div>
        <div class="modal-body">
          <p>{{ $t('scada.saveBeforeExit') }}</p>
        </div>
        <div class="modal-footer">
          <el-button @click="$emit('discard')">{{ $t('common.no') }}</el-button>
          <el-button type="primary" @click="$emit('save')">{{ $t('common.yes') }}</el-button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Close } from '@element-plus/icons-vue'

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
  width: 400px;
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

.modal-close {
  font-size: 18px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s;
}

.modal-close:hover {
  color: var(--color-primary);
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
