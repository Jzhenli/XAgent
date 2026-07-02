<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Connection, Cpu, Monitor, OfficeBuilding } from '@element-plus/icons-vue'

interface Props {
  visible: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'selectProtocol', protocol: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 协议类型定义
const protocols = [
  {
    name: 'Modbus TCP',
    key: 'modbus_tcp',
    icon: Connection,
    description: 'TCP协议',
    color: '#409EFF',
    supportsDiscovery: false
  },
  {
    name: 'Modbus RTU',
    key: 'modbus_rtu',
    icon: Cpu,
    description: '串口协议',
    color: '#67C23A',
    supportsDiscovery: false
  },
  {
    name: 'KNX',
    key: 'knx',
    icon: OfficeBuilding,
    description: '楼宇自动化',
    color: '#E6A23C',
    supportsDiscovery: false
  },
  {
    name: 'BACnet',
    key: 'bacnet',
    icon: Monitor,
    description: '楼宇自动化',
    color: '#F56C6C',
    supportsDiscovery: true,  // 标注支持自动发现
    badge: '支持自动发现'
  }
]

// 处理协议选择
const handleSelectProtocol = (protocol: string) => {
  emit('selectProtocol', protocol)
  emit('close')
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <el-dialog
    v-model="props.visible"
    title="添加设备 - 步骤 1/2"
    width="700px"
    @close="handleClose"
  >
    <!-- 提示文字 -->
    <el-text type="info" size="large" class="mb-4">
      选择设备协议类型
    </el-text>

    <!-- 协议卡片网格 -->
    <el-row :gutter="20" class="protocol-grid">
      <el-col 
        :span="6" 
        v-for="protocol in protocols" 
        :key="protocol.key"
      >
        <el-card
          shadow="hover"
          class="protocol-card"
          :body-style="{ padding: '30px' }"
          @click="handleSelectProtocol(protocol.key)"
        >
          <!-- 图标 -->
          <div class="icon-wrapper" :style="{ color: protocol.color }">
            <el-icon :size="60">
              <component :is="protocol.icon" />
            </el-icon>
          </div>

          <!-- 协议名称 -->
          <div class="protocol-name">
            {{ protocol.name }}
          </div>

          <!-- 描述 -->
          <div class="protocol-desc">
            {{ protocol.description }}
          </div>

          <!-- 自动发现标注（仅BACnet） -->
          <el-tag
            v-if="protocol.supportsDiscovery"
            type="success"
            effect="dark"
            class="discovery-badge"
          >
            ⭐ {{ protocol.badge }}
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
.protocol-grid {
  margin-top: 20px;
}

.protocol-card {
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  text-align: center;
}

.protocol-card:hover {
  border-color: var(--el-color-primary);
  transform: translateY(-5px);
}

.icon-wrapper {
  margin-bottom: 20px;
}

.protocol-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.protocol-desc {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 15px;
}

.discovery-badge {
  margin-top: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: center;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>