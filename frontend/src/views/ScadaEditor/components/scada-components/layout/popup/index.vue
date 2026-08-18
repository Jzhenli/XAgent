<template>
  <div class="popup-container">
    <div
      class="popup-trigger"
      :style="triggerStyle"
      @click="handleClick"
    >
      <span v-if="config.triggerIcon" class="trigger-icon">{{ config.triggerIcon }}</span>
      <span class="trigger-text">{{ config.triggerText }}</span>
    </div>

    <Teleport to="body">
      <Transition name="popup-fade">
        <div
          v-if="visible && !editing"
          class="popup-overlay"
          :style="overlayStyle"
          @click.self="closePopup"
        >
          <div class="popup-dialog" :style="dialogStyle">
            <div class="popup-header">
              <span class="popup-title">{{ config.popupTitle }}</span>
              <span class="popup-close" @click="closePopup">&times;</span>
            </div>
            <div class="popup-body">
              <div
                v-if="config.useHtml"
                class="popup-content"
                v-html="config.popupContent"
              />
              <div v-else class="popup-content popup-content--text">
                {{ config.popupContent }}
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ScadaComponent } from '@/types/scada'

const props = defineProps<{
  component: ScadaComponent
  editing?: boolean
}>()

const visible = ref(false)

const config = computed(() =>
  (props.component as ScadaComponent<'popup'>).config
)

const triggerStyle = computed(() => ({
  backgroundColor: config.value?.triggerBackgroundColor || '#409eff',
  color: config.value?.triggerFontColor || '#ffffff',
  borderColor: config.value?.triggerBorderColor || '#409eff',
  borderRadius: `${config.value?.triggerBorderRadius ?? 4}px`,
  fontSize: `${config.value?.fontSize ?? 14}px`,
  borderWidth: `${config.value?.borderWidth ?? 1}px`,
  borderStyle: 'solid' as const,
  width: '100%',
  height: '100%',
  display: 'flex' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  cursor: props.editing ? 'default' : 'pointer',
  userSelect: 'none' as const,
  transition: 'opacity 0.2s'
}))

const overlayStyle = computed(() => ({
  backgroundColor: config.value?.maskColor || 'rgba(0, 0, 0, 0.5)'
}))

const dialogStyle = computed(() => ({
  width: `${config.value?.popupWidth ?? 400}px`
}))

const handleClick = () => {
  if (props.editing) return
  visible.value = true
}

const closePopup = () => {
  visible.value = false
}
</script>

<style scoped>
.popup-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.popup-trigger {
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0 8px;
}

.popup-trigger:hover {
  opacity: 0.9;
}

.trigger-icon {
  margin-right: 4px;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.popup-dialog {
  background: #1e1e2e;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.popup-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.popup-close {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  line-height: 1;
  transition: color 0.2s;
}

.popup-close:hover {
  color: #ffffff;
}

.popup-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.popup-content {
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  line-height: 1.6;
}

.popup-content--text {
  white-space: pre-wrap;
}

.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 0.2s ease;
}

.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
}

.popup-fade-enter-active .popup-dialog,
.popup-fade-leave-active .popup-dialog {
  transition: transform 0.2s ease;
}

.popup-fade-enter-from .popup-dialog,
.popup-fade-leave-to .popup-dialog {
  transform: scale(0.95);
}
</style>