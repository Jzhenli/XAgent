<template>
  <div class="config-panel">
    <div class="panel-header">
      <h3>
        ⚙️
        {{
          component
            ? t("componentConfig.componentConfig")
            : t("componentConfig.panelConfig")
        }}
      </h3>
    </div>

    <div v-if="component" class="panel-body">
      <div class="config-section">
        <div class="section-title">{{ t("componentConfig.basicInfo") }}</div>
        <div class="form-group">
          <label>{{ t("componentConfig.name") }}</label>
          <input type="text" :value="displayName" @input="updateName" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>X</label>
            <input
              type="number"
              :value="component.x"
              @input="updatePosition('x', $event)"
            />
          </div>
          <div class="form-group">
            <label>Y</label>
            <input
              type="number"
              :value="component.y"
              @input="updatePosition('y', $event)"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.width") }}</label>
            <input
              type="number"
              :value="component.config.width"
              @input="updateDimension('width', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.height") }}</label>
            <input
              type="number"
              :value="component.config.height"
              @input="updateDimension('height', $event)"
            />
          </div>
        </div>
      </div>

      <div v-if="showPointBinding" class="config-section">
        <div class="section-title">{{ t("componentConfig.pointBinding") }}</div>
        <div class="form-group">
          <label>{{ t("componentConfig.device") }}</label>
          <el-select
            v-model="selectedDevice"
            class="scada-select"
            popper-class="scada-select-dropdown"
            @change="handleDeviceChange"
            clearable
            :placeholder="t('componentConfig.selectDevice')"
          >
            <el-option
              v-for="device in pointStore.devices"
              :key="device.asset"
              :value="device.asset"
              :label="device.name"
            />
          </el-select>
        </div>
        <div class="form-group">
          <label>{{ t("componentConfig.point") }}</label>
          <el-select
            v-model="selectedPoint"
            class="scada-select"
            popper-class="scada-select-dropdown"
            @change="handlePointChange"
            clearable
            :placeholder="t('componentConfig.selectPoint')"
            :disabled="!selectedDevice"
          >
            <el-option
              v-for="point in availablePoints"
              :key="point.name"
              :value="point.name"
              :label="
                point.name +
                (point.description ? ' (' + point.description + ')' : '')
              "
            />
          </el-select>
        </div>
      </div>

      <component
        v-if="componentConfigPanel && component"
        :is="componentConfigPanel"
        :key="component.id"
        :component="component"
      />
    </div>

    <div v-else-if="currentPanel" class="panel-body">
      <div class="config-section">
        <div class="section-title">{{ t("componentConfig.canvasSize") }}</div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.width") }}</label>
            <input
              type="number"
              v-model.number="panelWidth"
              min="400"
              max="4096"
              @change="updatePanelSize"
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.height") }}</label>
            <input
              type="number"
              v-model.number="panelHeight"
              min="300"
              max="4096"
              @change="updatePanelSize"
            />
          </div>
        </div>
        <div class="preset-buttons">
          <el-button
            v-for="preset in presetSizes"
            :key="preset.key"
            size="small"
            @click="applyPreset(preset)"
          >
            {{ t("componentConfig." + preset.key) }}
          </el-button>
        </div>
      </div>

      <div class="config-section">
        <div class="section-title">{{ t("componentConfig.canvasStyle") }}</div>
        <div class="form-group">
          <label>{{ t("componentConfig.bgType") }}</label>
          <el-radio-group v-model="panelBgType" @change="onBgTypeChange">
            <el-radio value="color">{{
              t("componentConfig.bgColor")
            }}</el-radio>
            <el-radio value="image">{{
              t("componentConfig.bgImage")
            }}</el-radio>
          </el-radio-group>
        </div>
        <div v-if="panelBgType === 'color'" class="form-group">
          <label>{{ t("componentConfig.backgroundColor") }}</label>
          <div class="color-input">
            <el-color-picker
              v-model="panelBgColor"
              show-alpha
              @change="updatePanelSize"
            />
            <input
              type="text"
              v-model="panelBgColor"
              @change="updatePanelSize"
              placeholder="#f0f2f5"
            />
          </div>
        </div>
        <div v-else class="form-group">
          <label>{{ t("componentConfig.backgroundImage") }}</label>
          <div v-if="panelBgImage" class="bg-image-card">
            <div class="bg-image-preview">
              <img :src="panelBgImage" alt="bg" />
            </div>
            <div class="bg-image-actions">
              <el-button size="small" @click="triggerBgImageUpload">{{
                t("componentConfig.changeBgImage")
              }}</el-button>
              <el-button size="small" type="danger" @click="removeBgImage">{{
                t("componentConfig.removeBgImage")
              }}</el-button>
            </div>
          </div>
          <div v-else class="bg-upload-area" @click="triggerBgImageUpload">
            <span class="upload-icon">+</span>
            <span class="upload-text">{{
              t("componentConfig.uploadBgImage")
            }}</span>
          </div>
          <input
            ref="bgImageInput"
            type="file"
            accept="image/*"
            class="hidden-file-input"
            @change="handleBgImageUpload"
          />
        </div>
        <div class="form-group">
          <label>{{ t("componentConfig.gridSize") }}</label>
          <input
            type="number"
            v-model.number="panelGrid"
            min="10"
            max="50"
            step="5"
            @change="updatePanelSize"
          />
        </div>
      </div>
      <div class="config-section">
        <div class="section-title">{{ t("componentConfig.adaptMode") }}</div>
        <div class="form-group">
          <el-radio-group
            v-model="panelAdaptMode"
            class="adapt-mode-group"
            @change="onAdaptModeChange"
          >
            <el-radio value="fit">{{
              t("componentConfig.adaptFit")
            }}</el-radio>
            <el-radio value="fitWidth">{{
              t("componentConfig.adaptFitWidth")
            }}</el-radio>
            <el-radio value="fitHeight">{{
              t("componentConfig.adaptFitHeight")
            }}</el-radio>
            <el-radio value="stretch">{{
              t("componentConfig.adaptStretch")
            }}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="config-section">
        <div class="section-title">{{ t("componentConfig.panelInfo") }}</div>
        <div class="info-item">
          <span class="info-label">{{ t("componentConfig.panelName") }}</span>
          <span class="info-value">{{ currentPanel.name }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{
            t("componentConfig.componentCount")
          }}</span>
          <span class="info-value">{{ currentPanel.components.length }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{
            t("componentConfig.canvasDimensions")
          }}</span>
          <span class="info-value"
            >{{ currentPanel.width }} × {{ currentPanel.height }}</span
          >
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <span class="empty-icon">📦</span>
      <p>{{ t("componentConfig.selectComponentHint") }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, markRaw } from "vue";
import { useI18n } from "vue-i18n";
import { usePointStore } from "@/stores/points";
import { getConfigPanel } from "../component-registry";
import { useScadaProps } from "../hooks/useScadaProps";

const { t } = useI18n();
const pointStore = usePointStore();

const bgImageInput = ref<HTMLInputElement | null>(null);

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
  panelAdaptMode,
  availablePoints,
  presetSizes,
  handleDeviceChange,
  handlePointChange,
  updateName,
  updatePosition,
  updateDimension,
  updatePanelSize,
  onBgTypeChange,
  onAdaptModeChange,
  handleBgImageUpload,
  removeBgImage,
  applyPreset,
} = useScadaProps();

const componentConfigPanel = computed(() => {
  if (!component.value) return null;
  const panel = getConfigPanel(component.value.type);
  return panel ? markRaw(panel) : null;
});

const displayName = computed(() => {
  if (!component.value) return "";
  if (component.value.name?.startsWith("scadaComponentNames.")) {
    return t(component.value.name);
  }
  return component.value.name || component.value.type;
});

const POINT_BINDINGLESS_TYPES = new Set([
  "text",
  "rectangle",
  "circle",
  "icon",
  "slider-bar",
  "image",
  "nav-button",
  "chart-line",
  "line",
  "arc",
  "popup",
]);

const showPointBinding = computed(() => {
  if (!component.value) return false;
  return !POINT_BINDINGLESS_TYPES.has(component.value.type);
});

const triggerBgImageUpload = () => {
  bgImageInput.value?.click();
};
</script>

<style scoped>
.config-panel {
  width: 300px;
  background: transparent;
  border-left: none;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  height: 48px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(34, 211, 238, 0.15);
  background: linear-gradient(
    135deg,
    rgba(34, 211, 238, 0.1) 0%,
    rgba(168, 85, 247, 0.08) 100%
  );
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.panel-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 1px;
  text-shadow: 0 0 8px rgba(34, 211, 238, 0.3);
}

.panel-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.panel-body::-webkit-scrollbar {
  width: 6px;
}

.panel-body::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}

.panel-body::-webkit-scrollbar-thumb {
  background: rgba(34, 211, 238, 0.3);
  border-radius: 3px;
}

.panel-body::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 211, 238, 0.5);
}

.config-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.config-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--scada-cyan);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(34, 211, 238, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title::before {
  content: "";
  width: 4px;
  height: 14px;
  background: linear-gradient(
    180deg,
    var(--scada-cyan) 0%,
    var(--scada-purple) 100%
  );
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(34, 211, 238, 0.5);
}

.form-group {
  margin-bottom: 14px;
}

.form-group label {
  display: block;
  font-size: 12px;
  color: var(--text-regular);
  margin-bottom: 6px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.hidden-file-input {
  display: none;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 6px;
  font-size: 13px;
  background: var(--scada-bg-elevated);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.form-group input::placeholder,
.form-group select::placeholder {
  color: var(--text-tertiary);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--scada-cyan);
  background: rgba(34, 211, 238, 0.05);
  box-shadow:
    0 0 0 3px rgba(34, 211, 238, 0.15),
    0 0 12px rgba(34, 211, 238, 0.2);
}

.form-row {
  display: flex;
  gap: 12px;
}

.form-row .form-group {
  flex: 1;
}

.color-input {
  display: flex;
  gap: 10px;
  align-items: center;
}

.color-input input[type="text"] {
  flex: 1;
}

.preset-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 10px;
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
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.bg-image-preview {
  width: 100%;
  height: 100px;
  overflow: hidden;
  background: var(--scada-bg-elevated);
}

.bg-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bg-image-actions {
  display: flex;
  gap: 8px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.02);
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
  border: 2px dashed rgba(34, 211, 238, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  background: rgba(255, 255, 255, 0.02);
}

.bg-upload-area:hover {
  border-color: var(--scada-cyan);
  background: var(--scada-bg-hover);
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.2);
}

.upload-icon {
  font-size: 36px;
  color: var(--scada-cyan);
  line-height: 1;
  margin-bottom: 8px;
  text-shadow: 0 0 12px rgba(34, 211, 238, 0.5);
}

.upload-text {
  font-size: 13px;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}

.preset-buttons :deep(.el-button) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0;
  font-size: 12px;
  background: var(--scada-bg-elevated);
  border: 1px solid rgba(34, 211, 238, 0.2);
  color: var(--text-regular);
  border-radius: 6px;
  padding: 8px 12px;
  transition: all 0.2s ease;
}

.preset-buttons :deep(.el-button:hover) {
  background: rgba(34, 211, 238, 0.1);
  border-color: var(--scada-cyan);
  color: var(--scada-cyan);
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.2);
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--scada-bg-elevated);
  border-radius: 4px;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 12px;
  color: var(--text-tertiary);
}

.info-value {
  font-size: 12px;
  color: var(--text-primary);
  font-weight: 600;
  font-family: "Consolas", "Monaco", monospace;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  gap: 12px;
}

.empty-icon {
  font-size: 56px;
  margin-bottom: 0;
  filter: drop-shadow(0 0 20px rgba(34, 211, 238, 0.3));
}

.empty-state p {
  margin: 0;
  font-size: 14px;
  text-align: center;
  line-height: 1.6;
}

.adapt-mode-group {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
}

.adapt-mode-group :deep(.el-radio) {
  margin-right: 0;
  height: auto;
  padding: 6px 8px;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.adapt-mode-group :deep(.el-radio:hover) {
  background: rgba(34, 211, 238, 0.05);
}

.adapt-mode-group :deep(.el-radio__label) {
  white-space: normal;
  line-height: 1.4;
}

:deep(.el-radio) {
  color: var(--text-regular) !important;
}

:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: var(--scada-cyan) !important;
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  background-color: var(--scada-cyan) !important;
  border-color: var(--scada-cyan) !important;
}

:deep(.el-radio__inner) {
  background-color: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(34, 211, 238, 0.3) !important;
}

:deep(.el-color-picker__trigger) {
  background: var(--scada-bg-elevated) !important;
  border-color: rgba(34, 211, 238, 0.3) !important;
  border-radius: 6px !important;
}
</style>
