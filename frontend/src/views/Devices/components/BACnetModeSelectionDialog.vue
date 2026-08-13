<template>
  <el-dialog
    :model-value="props.visible"
    :title="t('devices.bacnetModeTitle')"
    width="600px"
    class="x-dialog"
    align-center
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 模式卡片 -->
    <el-row :gutter="20" class="mode-grid">
      <el-col 
        :span="12" 
        v-for="mode in modes" 
        :key="mode.key"
      >
        <el-card
          shadow="hover"
          class="mode-card"
          :body-style="{ padding: '40px' }"
          @click="handleSelectMode(mode.key as 'manual' | 'discover')"
        >
          <!-- 图标 -->
          <div class="icon-wrapper" :style="{ color: mode.color }">
            <el-icon :size="80">
              <component :is="mode.icon" />
            </el-icon>
          </div>

          <!-- 模式名称 -->
          <div class="mode-name">
            {{ mode.name }}
          </div>

          <!-- 描述 -->
          <div class="mode-desc">
            {{ mode.description }}
          </div>

          <!-- 推荐标注（自动发现） -->
          <el-tag
            v-if="mode.recommended"
            type="success"
            effect="dark"
            class="recommended-badge"
          >
            {{ mode.badge }}
          </el-tag>
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="cancel-text-btn" tabindex="0" @click="handleClose" @keydown.enter="handleClose">
        {{ t("common.cancel") }}
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Edit, Search } from '@element-plus/icons-vue'

interface Props {
  visible: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'selectMode', mode: 'manual' | 'discover'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

// 模式定义
const modes = [
  {
    name: t('devices.manualConfig'),
    key: 'manual',
    icon: Edit,
    description: t('devices.manualConfigDesc'),
    color: '#909399',
    recommended: false
  },
  {
    name: t('devices.autoDiscover'),
    key: 'discover',
    icon: Search,
    description: t('devices.autoDiscoverDesc'),
    color: '#67C23A',
    recommended: true,
    badge: '⭐ ' + t('devices.recommended')
  }
]

// 处理模式选择
const handleSelectMode = (mode: 'manual' | 'discover') => {
  emit('selectMode', mode)
  emit('close')
}

const handleClose = () => {
  emit('close')
}
</script>

<style>
/* 引入 Devices 模块通用弹框样式（需 unscoped，弹框内容 teleport 到 body） */
@import './DialogCommon.css';
</style>

<style scoped>
/* ========== 模式卡片网格 ========== */
.mode-grid {
  margin-top: 20px;
}

/* 让同一行的 el-col 等高，保证卡片高度一致 */
.mode-grid .el-col {
  display: flex;
}

.mode-card {
  cursor: pointer;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.07);
  flex: 1;
}

.mode-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

/* 卡片内容垂直居中 */
.mode-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.icon-wrapper {
  margin-bottom: 25px;
}

.mode-name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  color: var(--text-primary);
}

.mode-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.recommended-badge {
  margin-top: 15px;
}

/* 取消按钮：暗色主题使用半透明白色边框，亮色主题自动切换为深色系 */
.cancel-text-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 16px;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  border-radius: 2px;
  transition: all 0.2s;
}

[data-theme='dark'] .cancel-text-btn {
  background: rgba(255, 255, 255, 0.13);
  border: 1px solid rgba(255, 255, 255, 0.13);
  color: var(--text-primary);
}

[data-theme='dark'] .cancel-text-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.25);
}

[data-theme='light'] .cancel-text-btn {
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: var(--text-regular);
}

[data-theme='light'] .cancel-text-btn:hover {
  background: rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.2);
}
</style>
