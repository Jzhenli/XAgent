<template>
  <div class="config-panel">
    <div class="panel-header">
      <h3>
        ⚙️
        {{ component ? t('componentConfig.componentConfig') : t('componentConfig.panelConfig') }}
      </h3>
    </div>

    <div v-if="component" class="panel-body">
      <div class="config-section">
        <div class="section-title">{{ t('componentConfig.basicInfo') }}</div>
        <div class="form-group">
          <label>{{ t('componentConfig.name') }}</label>
          <input type="text" :value="displayName" @input="updateName" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>X</label>
            <input type="number" :value="component.x" @input="updatePosition('x', $event)" />
          </div>
          <div class="form-group">
            <label>Y</label>
            <input type="number" :value="component.y" @input="updatePosition('y', $event)" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.width') }}</label>
            <input type="number" :value="component.config.width" @input="updateDimension('width', $event)" />
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.height') }}</label>
            <input type="number" :value="component.config.height" @input="updateDimension('height', $event)" />
          </div>
        </div>
      </div>

      <div class="config-section">
        <div class="section-title">{{ t('componentConfig.pointBinding') }}</div>
        <div class="form-group">
          <label>{{ t('componentConfig.device') }}</label>
          <el-select v-model="selectedDevice" @change="handleDeviceChange" clearable :placeholder="t('componentConfig.selectDevice')" style="width: 100%">
            <el-option v-for="device in pointStore.devices" :key="device.asset" :value="device.asset" :label="device.name" />
          </el-select>
        </div>
        <div class="form-group">
          <label>{{ t('componentConfig.point') }}</label>
          <el-select v-model="selectedPoint" @change="handlePointChange" clearable :placeholder="t('componentConfig.selectPoint')" style="width: 100%" :disabled="!selectedDevice">
            <el-option v-for="point in availablePoints" :key="point.name" :value="point.name" :label="point.name + (point.description ? ' (' + point.description + ')' : '')" />
          </el-select>
        </div>
      </div>

      <component v-if="componentConfigPanel && component" :is="componentConfigPanel" :key="component.id" :component="component" />
    </div>

    <div v-else-if="currentPanel" class="panel-body">
      <div class="config-section">
        <div class="section-title">{{ t('componentConfig.canvasSize') }}</div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.width') }}</label>
            <input type="number" v-model.number="panelWidth" min="400" max="4096" @change="updatePanelSize" />
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.height') }}</label>
            <input type="number" v-model.number="panelHeight" min="300" max="4096" @change="updatePanelSize" />
          </div>
        </div>
        <div class="preset-buttons">
          <el-button v-for="preset in presetSizes" :key="preset.key" size="small" @click="applyPreset(preset)">
            {{ t('componentConfig.' + preset.key) }}
          </el-button>
        </div>
      </div>

      <div class="config-section">
        <div class="section-title">{{ t('componentConfig.canvasStyle') }}</div>
        <div class="form-group">
          <label>{{ t('componentConfig.bgType') }}</label>
          <el-radio-group v-model="panelBgType" @change="onBgTypeChange">
            <el-radio value="color">{{ t('componentConfig.bgColor') }}</el-radio>
            <el-radio value="image">{{ t('componentConfig.bgImage') }}</el-radio>
          </el-radio-group>
        </div>
        <div v-if="panelBgType === 'color'" class="form-group">
          <label>{{ t('componentConfig.backgroundColor') }}</label>
          <div class="color-input">
            <el-color-picker v-model="panelBgColor" show-alpha @change="updatePanelSize" />
            <input type="text" v-model="panelBgColor" @change="updatePanelSize" placeholder="#f0f2f5" />
          </div>
        </div>
        <div v-else class="form-group">
          <label>{{ t('componentConfig.backgroundImage') }}</label>
          <div v-if="panelBgImage" class="bg-image-card">
            <div class="bg-image-preview"><img :src="panelBgImage" alt="bg" /></div>
            <div class="bg-image-actions">
              <el-button size="small" @click="triggerBgImageUpload">{{ t('componentConfig.changeBgImage') }}</el-button>
              <el-button size="small" type="danger" @click="removeBgImage">{{ t('componentConfig.removeBgImage') }}</el-button>
            </div>
          </div>
          <div v-else class="bg-upload-area" @click="triggerBgImageUpload">
            <span class="upload-icon">+</span>
            <span class="upload-text">{{ t('componentConfig.uploadBgImage') }}</span>
          </div>
          <input ref="bgImageInput" type="file" accept="image/*" class="hidden-file-input" @change="handleBgImageUpload" />
        </div>
        <div class="form-group">
          <label>{{ t('componentConfig.gridSize') }}</label>
          <input type="number" v-model.number="panelGrid" min="10" max="50" step="5" @change="updatePanelSize" />
        </div>
      </div>

      <div class="config-section">
        <div class="section-title">{{ t('componentConfig.panelInfo') }}</div>
        <div class="info-item">
          <span class="info-label">{{ t('componentConfig.panelName') }}</span>
          <span class="info-value">{{ currentPanel.name }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{ t('componentConfig.componentCount') }}</span>
          <span class="info-value">{{ currentPanel.components.length }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{ t('componentConfig.canvasDimensions') }}</span>
          <span class="info-value">{{ currentPanel.width }} × {{ currentPanel.height }}</span>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <span class="empty-icon">📦</span>
      <p>{{ t('componentConfig.selectComponentHint') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, markRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePointStore } from '@/stores/points'
import { getConfigPanel } from '../component-registry'
import { useScadaProps } from '../hooks/useScadaProps'

const { t } = useI18n()
const pointStore = usePointStore()

const bgImageInput = ref<HTMLInputElement | null>(null)

const {
  selectedDevice,
  selectedPoint,
  component,
  currentPanel,
  panelWidth,
  panelHeight,
  panelBgColor,
  panelGrid,
  panelBgImage,
  panelBgType,
  availablePoints,
  presetSizes,
  handleDeviceChange,
  handlePointChange,
  updateName,
  updatePosition,
  updateDimension,
  updatePanelSize,
  onBgTypeChange,
  handleBgImageUpload,
  removeBgImage,
  applyPreset
} = useScadaProps()

const componentConfigPanel = computed(() => {
  if (!component.value) return null
  const panel = getConfigPanel(component.value.type)
  return panel ? markRaw(panel) : null
})

const displayName = computed(() => {
  if (!component.value) return ''
  if (component.value.name?.startsWith('scadaComponentNames.')) {
    return t(component.value.name)
  }
  return component.value.name || component.value.type
})

const triggerBgImageUpload = () => {
  bgImageInput.value?.click()
}
</script>

<style scoped>
.config-panel {
  width: 280px;
  background: var(--bg-container);
  border-left: 1px solid var(--border-base);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  height: 44px;
  padding: 0 12px;
  border-bottom: 1px solid var(--border-base);
  background: var(--bg-hover);
  display: flex;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.panel-body {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
}

.config-section {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-light);
}

.config-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-bottom: 10px;
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  font-size: 12px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.hidden-file-input {
  display: none;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--border-base);
  border-radius: 4px;
  font-size: 13px;
}

.form-group input:focus, .form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-row {
  display: flex;
  gap: 8px;
}

.form-row .form-group {
  flex: 1;
}

.color-input {
  display: flex;
  gap: 8px;
  align-items: center;
}

.color-input input[type="text"] {
  flex: 1;
}

.preset-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  margin-top: 8px;
}

.bg-image-control {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bg-image-control .el-button {
  align-self: flex-start;
}

.bg-image-card {
  border: 1px solid var(--border-base);
  border-radius: 6px;
  overflow: hidden;
}

.bg-image-preview {
  width: 100%;
  height: 100px;
  overflow: hidden;
  background: var(--bg-secondary);
}

.bg-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bg-image-actions {
  display: flex;
  gap: 8px;
  padding: 8px;
  background: var(--bg-container);
}

.bg-image-actions .el-button {
  flex: 1;
}

.bg-upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
  border: 2px dashed var(--border-base);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.bg-upload-area:hover {
  border-color: var(--color-primary);
  background: rgba(64, 158, 255, 0.05);
}

.upload-icon {
  font-size: 32px;
  color: var(--text-secondary);
  line-height: 1;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 12px;
  color: var(--text-secondary);
}

.preset-buttons :deep(.el-button) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0;
  font-size: 11px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-light);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.info-value {
  font-size: 12px;
  color: var(--text-primary);
  font-weight: 500;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.empty-state p {
  margin: 0;
  font-size: 13px;
}
</style>