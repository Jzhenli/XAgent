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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: var(--bg-container);
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-base);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.modal-close {
  font-size: 18px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s;
}

.modal-close:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: 20px;
}

.modal-body p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.modal-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--border-base);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
