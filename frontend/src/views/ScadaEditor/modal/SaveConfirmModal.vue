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
}

.modal-title {
  font-size: 16px;
  font-weight: 500;
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