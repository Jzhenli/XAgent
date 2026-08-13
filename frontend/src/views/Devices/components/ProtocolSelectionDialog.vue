<template>
  <el-dialog
    :model-value="props.visible"
    :title="t('devices.selectProtocolTitle')"
    width="800px"
    class="x-dialog"
    align-center
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 协议卡片网格 -->
    <el-row :gutter="20" class="protocol-grid">
      <el-col :span="6" v-for="protocol in protocols" :key="protocol.key">
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
      <div class="cancel-text-btn" tabindex="0" @click="handleClose" @keydown.enter="handleClose">
        {{ t("common.cancel") }}
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import {
  Connection,
  Cpu,
  Monitor,
  OfficeBuilding,
} from "@element-plus/icons-vue";

const { t } = useI18n();

interface Props {
  visible: boolean;
}

interface Emits {
  (e: "close"): void;
  (e: "selectProtocol", protocol: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 协议类型定义
const protocols = [
  {
    name: "Modbus TCP",
    key: "modbus_tcp",
    icon: Connection,
    description: t("devices.protocolDescModbusTcp"),
    color: "#409EFF",
    supportsDiscovery: false,
  },
  {
    name: "Modbus RTU",
    key: "modbus_rtu",
    icon: Cpu,
    description: t("devices.protocolDescModbusRtu"),
    color: "#67C23A",
    supportsDiscovery: false,
  },
  {
    name: "KNX",
    key: "knx",
    icon: OfficeBuilding,
    description: t("devices.protocolDescKnx"),
    color: "#E6A23C",
    supportsDiscovery: false,
  },
  {
    name: "BACnet",
    key: "bacnet",
    icon: Monitor,
    description: t("devices.protocolDescBacnet"),
    color: "#F56C6C",
    supportsDiscovery: true,
    badge: t("devices.protocolDiscoveryBadge"),
  },
];

// 处理协议选择
const handleSelectProtocol = (protocol: string) => {
  emit("selectProtocol", protocol);
  emit("close");
};

const handleClose = () => {
  emit("close");
};
</script>

<style>
/* 引入 Devices 模块通用弹框样式（需 unscoped，弹框内容 teleport 到 body） */
@import "./DialogCommon.css";
</style>

<style scoped>
/* ========== 协议卡片网格 ========== */
.protocol-grid {
  margin-top: 10px;
}

/* 让同一行的 el-col 等高，保证卡片高度一致 */
.protocol-grid .el-col {
  display: flex;
  min-width: 0;
}

.protocol-card {
  cursor: pointer;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.07);
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.protocol-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

/* 卡片内容垂直居中 */
.protocol-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.icon-wrapper {
  margin-bottom: 20px;
}

.protocol-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.protocol-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 15px;
}

.discovery-badge {
  margin-top: 10px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
