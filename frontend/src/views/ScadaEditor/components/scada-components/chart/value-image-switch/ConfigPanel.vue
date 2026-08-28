<template>
  <div class="config-section">
    <div class="section-title">{{ t('componentConfig.valueImageSwitchConfig') }}</div>

    <!-- 默认图片 -->
    <div class="subsection-title">{{ t('componentConfig.defaultImage') }}</div>
    <div class="form-group">
      <div v-if="config.defaultUrl" class="bg-image-card">
        <div class="bg-image-preview">
          <img :src="config.defaultUrl" alt="default">
        </div>
        <div class="bg-image-actions">
          <el-button size="small" @click="triggerUpload('default')">{{ t('componentConfig.changeImage') }}</el-button>
          <el-button size="small" type="danger" @click="removeDefaultImage">{{ t('componentConfig.removeImage') }}</el-button>
        </div>
      </div>
      <div v-else class="bg-upload-area" @click="triggerUpload('default')">
        <span class="upload-icon">+</span>
        <span class="upload-text">{{ t('componentConfig.uploadDefaultImage') }}</span>
      </div>
    </div>

    <!-- 值对应图片列表 -->
    <div class="subsection-title">{{ t('componentConfig.valueImageItems') }}</div>
    <div class="items-list">
      <div v-for="(item, index) in config.items" :key="index" class="item-row">
        <div class="item-header">
          <span class="item-index">{{ index + 1 }}</span>
          <span class="item-remove" @click="removeItem(index)">✕</span>
        </div>
        <div class="item-content">
          <div class="form-group">
            <label>{{ t('componentConfig.imageValue') }}</label>
            <input
              type="text"
              :value="item.value"
              @change="updateItemValue(index, ($event.target as HTMLInputElement).value)"
            />
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.imageFile') }}</label>
            <div v-if="item.url" class="item-image-card">
              <div class="item-image-preview">
                <img :src="item.url" alt="item">
              </div>
              <div class="item-image-actions">
                <el-button size="small" @click="triggerUpload(`item_${index}`)">{{ t('componentConfig.changeImage') }}</el-button>
              </div>
            </div>
            <div v-else class="bg-upload-area small" @click="triggerUpload(`item_${index}`)">
              <span class="upload-icon">+</span>
              <span class="upload-text">{{ t('componentConfig.uploadImage') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-button class="add-item-btn" @click="addItem">
      + {{ t('componentConfig.addValueImageItem') }}
    </el-button>

    <!-- 样式配置 -->
    <div class="subsection-title">{{ t('componentConfig.styleSection') }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.imageFit') }}</label>
        <el-select
          :model-value="config.fit || 'contain'"
          class="scada-select"
          popper-class="scada-select-dropdown"
          @update:model-value="updateConfig('fit', $event as ValueImageSwitchComponentConfig['fit'])"
        >
          <el-option value="contain" :label="t('componentConfig.fitContain')" />
          <el-option value="cover" :label="t('componentConfig.fitCover')" />
          <el-option value="fill" :label="t('componentConfig.fitFill')" />
        </el-select>
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.backgroundColor') }}</label>
        <el-color-picker :model-value="config.backgroundColor" show-alpha @change="updateConfig('backgroundColor', $event)" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.borderRadius') }}</label>
        <input type="number" :value="config.borderRadius" @change="updateConfig('borderRadius', +($event.target as HTMLInputElement).value)">
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.opacity') }}</label>
        <input type="number" :value="config.opacity" min="0" max="1" step="0.1" @change="updateConfig('opacity', +($event.target as HTMLInputElement).value)">
      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input
      v-for="key in fileInputKeys"
      :key="key"
      :ref="(el: any) => setFileInputRef(el, key)"
      type="file"
      accept="image/*"
      class="hidden-file-input"
      @change="(e: Event) => handleImageUpload(e, key)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScadaConfig } from '../../../../hooks/useScadaEditor'
import type { ScadaComponent, ValueImageSwitchComponentConfig, ValueImageItem } from '../../../../types'

const { t } = useI18n()

const props = defineProps<{
  component: ScadaComponent
}>()

const { config, updateConfig } = useScadaConfig(
  props.component as ScadaComponent<'value-image-switch'>,
)

const fileInputs = ref<Record<string, HTMLInputElement | null>>({})

const fileInputKeys = computed(() => {
  const keys: string[] = ['default']
  if (config.value?.items) {
    config.value.items.forEach((_, i) => keys.push(`item_${i}`))
  }
  return keys
})

const setFileInputRef = (el: any, key: string) => {
  if (el) {
    fileInputs.value[key] = el as HTMLInputElement
  }
}

const triggerUpload = (key: string) => {
  fileInputs.value[key]?.click()
}

const handleImageUpload = (e: Event, key: string) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    const result = event.target?.result as string
    if (!result) return

    if (key === 'default') {
      updateConfig('defaultUrl', result)
    } else if (key.startsWith('item_')) {
      const index = parseInt(key.replace('item_', ''), 10)
      const items = [...(config.value?.items ?? [])]
      if (items[index]) {
        items[index] = { ...items[index], url: result }
        updateConfig('items', items)
      }
    }
  }
  reader.readAsDataURL(file)
  input.value = ''
}

const removeDefaultImage = () => {
  updateConfig('defaultUrl', '')
}

const addItem = () => {
  const items = [...(config.value?.items ?? [])]
  const newItem: ValueImageItem = { value: '', url: '' }
  updateConfig('items', [...items, newItem])
}

const removeItem = (index: number) => {
  const items = [...(config.value?.items ?? [])]
  items.splice(index, 1)
  updateConfig('items', items)
}

const updateItemValue = (index: number, value: string) => {
  const items = [...(config.value?.items ?? [])]
  if (items[index]) {
    items[index] = { ...items[index], value }
    updateConfig('items', items)
  }
}
</script>

<style scoped>
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

.subsection-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 12px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px dashed var(--border-light);
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

.form-group input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 6px;
  font-size: 13px;
  background-color: var(--scada-bg-elevated);
  color: var(--text-primary);
}

.form-group input::placeholder {
  color: var(--text-placeholder);
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-group :deep(.el-color-picker__trigger) {
  width: 100%;
}

.form-row {
  display: flex;
  gap: 8px;
}

.form-row .form-group {
  flex: 1;
}

.hidden-file-input {
  display: none;
}

.bg-image-card {
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
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
  padding: 8px;
  background: var(--scada-bg-elevated);
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
  border: 1px dashed rgba(34, 211, 238, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.02);
}

.bg-upload-area.small {
  height: 60px;
}

.bg-upload-area:hover {
  border-color: var(--scada-cyan);
  background: rgba(34, 211, 238, 0.05);
}

.upload-icon {
  font-size: 32px;
  color: var(--text-secondary);
  line-height: 1;
  margin-bottom: 8px;
}

.bg-upload-area.small .upload-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.upload-text {
  font-size: 12px;
  color: var(--text-secondary);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-row {
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 8px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.02);
  margin-bottom: 10px;
}

.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.item-index {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.item-remove {
  font-size: 12px;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.item-remove:hover {
  color: #f56c6c;
  background: rgba(245, 108, 108, 0.1);
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-image-card {
  border: 1px solid rgba(34, 211, 238, 0.15);
  border-radius: 6px;
  overflow: hidden;
}

.item-image-preview {
  width: 100%;
  height: 60px;
  overflow: hidden;
  background: var(--bg-secondary);
}

.item-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-image-actions {
  padding: 4px;
  background: var(--scada-bg-elevated);
}

.add-item-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 4px;
  padding: 8px;
  border: 1px dashed rgba(34, 211, 238, 0.3);
  border-radius: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
}

.add-item-btn:hover {
  border-color: var(--scada-cyan);
  color: var(--scada-cyan);
  background: rgba(34, 211, 238, 0.05);
}
</style>
