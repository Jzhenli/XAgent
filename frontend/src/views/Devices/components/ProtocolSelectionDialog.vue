<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Connection, Cpu, Monitor, OfficeBuilding } from '@element-plus/icons-vue'

const { t } = useI18n()

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
    description: t('devices.protocolDescModbusTcp'),
    color: '#409EFF',
    supportsDiscovery: false
  },
  {
    name: 'Modbus RTU',
    key: 'modbus_rtu',
    icon: Cpu,
    description: t('devices.protocolDescModbusRtu'),
    color: '#67C23A',
    supportsDiscovery: false
  },
  {
    name: 'KNX',
    key: 'knx',
    icon: OfficeBuilding,
    description: t('devices.protocolDescKnx'),
    color: '#E6A23C',
    supportsDiscovery: false
  },
  {
    name: 'BACnet',
    key: 'bacnet',
    icon: Monitor,
    description: t('devices.protocolDescBacnet'),
    color: '#F56C6C',
    supportsDiscovery: true,
    badge: t('devices.protocolDiscoveryBadge')
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
    :model-value="props.visible"
    :title="t('devices.selectProtocolTitle')"
    width="700px"
    @close="handleClose"
  >
    <!-- 提示文字 -->
    <el-text type="info" size="large" class="mb-4">
      {{ t('devices.selectProtocolHint') }}
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
        <el-button @click="handleClose">{{ t('common.cancel') }}</el-button>
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
