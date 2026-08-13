<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('devices.writePointValue')"
    width="min(520px, 92vw)"
    :close-on-click-modal="false"
    align-center
    class="x-dialog write-value-dialog"
  >
    <!-- 科技感装饰线 -->
    <div class="deco-line" />
    
    <!-- 核心展示区：当前值高亮面板 -->
    <div class="cyber-panel">
      <div class="cyber-panel-label">
        <span class="dot" />
        {{ t('devices.currentValue') }}
      </div>
      <div class="cyber-panel-value">
        <span class="value-text">
          {{ form.currentValue || '—' }}
          <span v-if="form.unit" class="value-unit">{{ form.unit }}</span>
        </span>
        <div class="scan-line" />
      </div>
    </div>

    <!-- 设备/点位信息卡片区 -->
    <div class="info-grid">
      <div class="info-cell">
        <div class="info-cell-label">{{ t('devices.device') }}</div>
        <div class="info-cell-value">{{ deviceName }}</div>
      </div>
      <div class="info-cell">
        <div class="info-cell-label">{{ t('devices.point') }}</div>
        <div class="info-cell-value">{{ form.pointName }}</div>
      </div>
    </div>

    <!-- 写值输入区：根据点位类型切换不同的输入控件 -->
    <div class="write-form">
      <div class="target-label">
        <span class="dot-pulse" />
        {{ t('devices.targetValue') }}
      </div>
      
      <!-- 数字量：使用 el-switch 控制布尔值 -->
      <template v-if="form.pointType === 'digital'">
        <div class="write-bool-control">
          <el-switch 
            v-model="form.boolValue"
            :active-text="t('devices.on')"
            :inactive-text="t('devices.off')"
          />
        </div>
      </template>

      <!-- 模拟量：使用 el-input 输入数值，单位显示在 append 插槽 -->
      <template v-else>
        <div class="input-glow-wrapper">
          <el-input 
            v-model="form.value" 
            :placeholder="t('devices.writePlaceholderEmpty')"
            clearable
            size="large"
          >
            <template v-if="form.unit" #append>
              <span class="input-unit">{{ form.unit }}</span>
            </template>
          </el-input>
        </div>
        <!-- 单位提示文字 -->
        <div v-if="form.unit" class="write-hint">
          {{ t('devices.writeHint') }}
        </div>
      </template>
    </div>

    <!-- 底部按钮区：使用 div.action-btn 统一项目弹框按钮风格 -->
    <template #footer>
      <div class="dialog-footer">
        <div
          class="action-btn"
          @click="dialogVisible = false"
        >
          {{ t('common.cancel') }}
        </div>
        <div
          class="action-btn btn-primary"
          :class="{ 'is-loading': writing, 'is-disabled': isSubmitDisabled || writing }"
          @click="!isSubmitDisabled && !writing && emit('submit')"
        >
          <span v-if="writing" class="btn-spinner" />
          <span>{{ t('devices.confirmWrite') }}</span>
        </div>
      </div>
    </template>
  </el-dialog>
</template>


<script setup lang="ts">
/**
 * WriteValueDialog — 点位写值弹窗
 *
 * 支持两种点位类型的写值交互：
 * - 数字量 (digital)  → el-switch 开关 (布尔值)
 * - 模拟量 (analog)  → el-input 输入框 (数值/字符串)
 *
 * 父组件通过 v-model 控制弹框显隐，通过 form 传入当前点位信息，
 * 通过 @submit 事件触发写值提交。
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDeviceStore } from '@/stores/devices'
import type { WriteFormData } from '../types'

/** 组件 Props */
const props = defineProps<{
  /** 弹框显隐 (v-model 双向绑定) */
  modelValue: boolean
  /** 写值表单数据 */
  form: WriteFormData
  /** 写值进行中状态 (控制确认按钮 loading) */
  writing: boolean
}>()

/** 组件 Emits */
const emit = defineEmits<{
  /** 更新 modelValue (v-model 双向绑定) */
  (e: 'update:modelValue', val: boolean): void
  /** 提交写值请求 */
  (e: 'submit'): void
}>()

const { t } = useI18n()
const deviceStore = useDeviceStore()

// ==================== 双向绑定 ====================

/** v-model 桥接：将 modelValue prop 映射为 dialogVisible 计算属性 */
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
})

// ==================== 业务计算 ====================

/** 当前设备名称 (优先显示设备名，降级显示 asset 标识) */
const deviceName = computed(() => {
  return deviceStore.getDeviceByAsset(props.form.deviceAsset)?.name || props.form.deviceAsset
})

/**
 * 提交按钮禁用条件：
 * - 模拟量类型且输入值为空时禁用
 * - 数字量类型 (开关) 始终可提交
 */
const isSubmitDisabled = computed(() => {
  return props.form.pointType !== 'digital' && !props.form.value.trim()
})
</script>

<style>
/* 引入 Devices 模块通用弹框样式 (unscoped: 弹框内容 teleport 到 body) */
@import './DialogCommon.css';

/* ========== 酷炫写值弹框全局样式 ========== */
.write-value-dialog {
  background: linear-gradient(145deg, var(--bg-modal) 0%, rgba(10, 15, 30, 0.98) 100%) !important;
  border: 1px solid rgba(102, 102, 255, 0.3) !important;
  box-shadow:
    0 0 0 1px rgba(102, 102, 255, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 0 60px rgba(102, 102, 255, 0.15) !important;
}

.write-value-dialog .el-dialog__header {
  background: transparent !important;
  border-bottom: 1px solid rgba(102, 102, 255, 0.15);
  padding: 16px 20px !important;
}

.write-value-dialog .el-dialog__title {
  color: var(--text-primary) !important;
  font-size: 18px !important;
  font-weight: 700 !important;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #6666ff 0%, #00d4ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.write-value-dialog .el-dialog__body {
  background: transparent !important;
  padding: 24px 20px !important;
  position: relative;
  overflow: hidden;
}

.write-value-dialog .el-dialog__footer {
  background: transparent !important;
  border-top: 1px solid rgba(102, 102, 255, 0.15);
  padding: 16px 20px !important;
}
</style>

<style scoped>
/* ========== 科技感装饰线 ========== */
.deco-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #6666ff 50%,
    transparent 100%
  );
  animation: decoGlow 3s ease-in-out infinite;
  z-index: 1;
}

@keyframes decoGlow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

/* ========== 核心展示面板 (Cyber Panel) ========== */
.cyber-panel {
  background: linear-gradient(145deg, rgba(102, 102, 255, 0.08) 0%, rgba(0, 212, 255, 0.05) 100%);
  border: 1px solid rgba(102, 102, 255, 0.25);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  box-shadow:
    inset 0 0 20px rgba(102, 102, 255, 0.08),
    0 0 30px rgba(102, 102, 255, 0.1);
}

.cyber-panel-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #00d4ff;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 12px;
}

.cyber-panel-label .dot {
  width: 8px;
  height: 8px;
  background: #00d4ff;
  border-radius: 50%;
  box-shadow: 0 0 8px #00d4ff;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.cyber-panel-value {
  position: relative;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  border-left: 3px solid #6666ff;
  overflow: hidden;
}

.value-text {
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(102, 102, 255, 0.8);
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.value-unit {
  font-size: 16px;
  color: #a3a6ad;
  font-weight: 400;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #6666ff 50%,
    transparent 100%
  );
  opacity: 0.6;
  animation: scanAnim 2s linear infinite;
}

@keyframes scanAnim {
  0% { top: 0; }
  100% { top: 100%; }
}

/* ========== 信息网格 (Info Grid) ========== */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.info-cell {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 10px 12px;
  transition: all 0.3s ease;
}

.info-cell:hover {
  border-color: rgba(102, 102, 255, 0.4);
  background: rgba(102, 102, 255, 0.05);
}

.info-cell-label {
  font-size: 11px;
  color: var(--text-tertiary);
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info-cell-value {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ========== 写值输入区 ========== */
.write-form {
  padding: 0;
}

.target-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-regular);
  margin-bottom: 12px;
}

.dot-pulse {
  width: 6px;
  height: 6px;
  background: #6666ff;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(102, 102, 255, 0.7);
  animation: dotPulse 2s infinite;
}

@keyframes dotPulse {
  0% { box-shadow: 0 0 0 0 rgba(102, 102, 255, 0.7); }
  70% { box-shadow: 0 0 0 8px rgba(102, 102, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(102, 102, 255, 0); }
}

.input-glow-wrapper {
  position: relative;
  transition: all 0.3s ease;
}

.input-glow-wrapper:focus-within {
  box-shadow: 0 0 0 2px rgba(102, 102, 255, 0.3), 0 0 20px rgba(102, 102, 255, 0.15);
  border-radius: 4px;
}

.input-unit {
  font-size: 14px;
  color: var(--text-secondary);
}

.write-bool-control {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
}

/* 单位提示文字 */
.write-hint {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 10px;
  line-height: 1.5;
}

/* ========== 底部按钮区 ========== */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 90px;
  height: 36px;
  padding: 0 18px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
  color: var(--text-regular);
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
}

.action-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

/* 主色确认按钮 */
.action-btn.btn-primary {
  color: #fff;
  background: linear-gradient(135deg, #6666ff 0%, #00d4ff 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 102, 255, 0.4);
  position: relative;
  overflow: hidden;
}

.action-btn.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s ease;
}

.action-btn.btn-primary:hover:not(.is-disabled)::before {
  left: 100%;
}

.action-btn.btn-primary:hover:not(.is-disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(102, 102, 255, 0.5);
}

.action-btn.btn-primary:active:not(.is-disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(102, 102, 255, 0.4);
}

/* 禁用 / 加载状态 */
.action-btn.is-disabled {
  cursor: not-allowed;
  opacity: 0.5;
  filter: grayscale(0.5);
}

.action-btn.is-disabled:hover {
  transform: none;
}

.action-btn.is-loading {
  cursor: not-allowed;
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
