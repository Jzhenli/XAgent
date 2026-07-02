<script setup lang="ts">
import { ref } from 'vue'
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

// 模式定义
const modes = [
  {
    name: '手动配置',
    key: 'manual',
    icon: Edit,
    description: '手动填写所有参数',
    color: '#909399',
    recommended: false
  },
  {
    name: '自动发现',
    key: 'discover',
    icon: Search,
    description: '自动搜索网络中的设备',
    color: '#67C23A',
    recommended: true,  // 推荐
    badge: '⭐ 推荐'
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

<template>
  <el-dialog
    v-model="props.visible"
    title="BACnet 模式选择"
    width="500px"
    @close="handleClose"
  >
    <!-- 提示文字 -->
    <el-text type="info" size="large" class="mb-4">
      选择配置方式
    </el-text>

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
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.mode-grid {
  margin-top: 20px;
}

.mode-card {
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  text-align: center;
}

.mode-card:hover {
  border-color: var(--el-color-primary);
  transform: translateY(-5px);
}

.icon-wrapper {
  margin-bottom: 25px;
}

.mode-name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}

.mode-desc {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 20px;
}

.recommended-badge {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: center;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>