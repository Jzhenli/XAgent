<template>
  <!-- 设备编辑/新增对话框 -->
  <el-dialog
    v-model="dialogVisible"
    :title="isEditing ? t('devices.editDevice') : t('devices.addDevice')"
    width="min(600px, 90vw)"
    :close-on-click-modal="false"
    align-center
    class="x-dialog device-dialog"
  >
    <el-form
      ref="formRefInternal"
      :model="form"
      :rules="deviceFormRules"
      label-width="100px"
      label-position="left"
    >
      <!-- 基础信息 -->
      <el-form-item :label="t('devices.asset')" prop="asset">
        <el-input
          v-model="form.asset"
          :placeholder="t('devices.assetPlaceholder')"
          :disabled="isEditing"
        />
      </el-form-item>
      <el-form-item :label="t('devices.deviceName')">
        <el-input v-model="form.name" :placeholder="t('devices.namePlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('common.description')">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="2"
          :placeholder="t('devices.descriptionPlaceholder')"
        />
      </el-form-item>
      <el-form-item :label="t('devices.protocolType')" prop="pluginName">
        <div class="protocol-display">{{ selectedPluginLabel }}</div>
      </el-form-item>

      <!-- Modbus TCP 参数 -->
      <template v-if="form.pluginName === 'modbus_tcp'">
        <el-form-item :label="t('devices.host')" prop="host">
          <el-input v-model="form.host" :placeholder="t('devices.hostPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('devices.port')">
          <el-input-number v-model="form.port" :min="1" :max="65535" />
        </el-form-item>
      </template>

      <!-- Modbus RTU 参数 -->
      <template v-if="form.pluginName === 'modbus_rtu'">
        <el-form-item :label="t('devices.serialPort')" prop="serial_port">
          <el-input v-model="form.serial_port" :placeholder="t('devices.serialPortPlaceholder')" />
          <div class="form-hint">{{ t('devices.serialPortHint') }}</div>
        </el-form-item>
        <el-form-item :label="t('devices.baudrate')">
          <el-select v-model="form.baudrate" :placeholder="t('devices.selectBaudrate')" class="scada-select" popper-class="scada-select-dropdown">
            <el-option v-for="rate in baudrateOptions" :key="rate" :value="rate" :label="String(rate)" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('devices.parity')">
          <el-radio-group v-model="form.parity">
            <el-radio value="N">{{ t('devices.parityNone') }}</el-radio>
            <el-radio value="E">{{ t('devices.parityEven') }}</el-radio>
            <el-radio value="O">{{ t('devices.parityOdd') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="t('devices.stopbits')">
              <el-radio-group v-model="form.stopbits">
                <el-radio :value="1">1</el-radio>
                <el-radio :value="2">2</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('devices.bytesize')">
              <el-radio-group v-model="form.bytesize">
                <el-radio :value="7">7</el-radio>
                <el-radio :value="8">8</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <!-- Modbus 通用参数 (TCP / RTU 共有) -->
      <template v-if="isModbus">
        <el-form-item :label="t('devices.slaveId')">
          <el-input-number v-model="form.slave_id" :min="0" :max="255" />
        </el-form-item>
        <el-form-item :label="t('devices.collectionInterval')">
          <el-input-number v-model="form.interval" :min="1" :max="3600" />
          <div class="form-hint">{{ t('devices.collectionIntervalHint') }}</div>
        </el-form-item>
      </template>

      <!-- BACnet 参数 -->
      <template v-if="form.pluginName === 'bacnet'">
        <el-form-item :label="t('devices.deviceId')">
          <el-input-number v-model="form.device_id" :min="0" :max="4194303" />
        </el-form-item>
        <el-form-item :label="t('devices.collectionInterval')">
          <el-input-number v-model="form.interval" :min="1" :max="3600" />
          <div class="form-hint">{{ t('devices.bacnetIntervalHint') }}</div>
        </el-form-item>
        <el-form-item :label="t('devices.host')" prop="host">
          <el-input v-model="form.host" :placeholder="t('devices.hostPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('devices.port')">
          <el-input-number v-model="form.port" :min="1" :max="65535" />
        </el-form-item>
      </template>

      <!-- KNX 参数 -->
      <template v-if="form.pluginName === 'knx'">
        <el-form-item :label="t('devices.gatewayIp')" prop="host">
          <el-input v-model="form.host" :placeholder="t('devices.gatewayIpPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('devices.port')">
          <el-input-number v-model="form.port" :min="1" :max="65535" />
        </el-form-item>
        <el-form-item :label="t('devices.localIp')">
          <el-input v-model="form.local_ip" :placeholder="t('devices.localIpPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('devices.connectionMode')">
          <el-select v-model="form.connection_type" :placeholder="t('devices.selectConnectionMode')" class="scada-select" popper-class="scada-select-dropdown">
            <el-option :label="t('devices.connectionAutomatic')" value="automatic" />
            <el-option :label="t('devices.connectionTunneling')" value="tunneling" />
            <el-option :label="t('devices.connectionTunnelingTcp')" value="tunneling_tcp" />
            <el-option :label="t('devices.connectionRouting')" value="routing" />
            <el-option :label="t('devices.connectionTunnelingTcpSecure')" value="tunneling_tcp_secure" />
            <el-option :label="t('devices.connectionRoutingSecure')" value="routing_secure" />
          </el-select>
          <div class="form-hint">{{ t('devices.connectionModeHint') }}</div>
        </el-form-item>
        <el-form-item :label="t('devices.collectionInterval')">
          <el-input-number v-model="form.interval" :min="1" :max="3600" />
          <div class="form-hint">{{ t('devices.knxIntervalHint') }}</div>
        </el-form-item>
        <el-form-item :label="t('devices.syncMode')">
          <el-select v-model="form.sync_mode" :placeholder="t('devices.selectSyncMode')" class="scada-select" popper-class="scada-select-dropdown">
            <el-option :label="t('devices.syncSmart')" value="smart" />
            <el-option :label="t('devices.syncAlways')" value="always" />
            <el-option :label="t('devices.syncPassive')" value="passive" />
          </el-select>
          <div class="form-hint">{{ t('devices.syncModeHint') }}</div>
        </el-form-item>
        <el-form-item :label="t('devices.syncInterval')">
          <el-input-number v-model="form.sync_interval" :min="5" :max="1440" />
          <div class="form-hint">{{ t('devices.syncIntervalHint') }}</div>
        </el-form-item>
      </template>

      <!-- 通用参数 -->
      <el-form-item :label="t('devices.timeout')">
        <el-input-number v-model="form.timeout" :min="1" :max="60" />
      </el-form-item>
      <el-form-item :label="t('devices.enabled')">
        <el-switch v-model="form.enabled" />
      </el-form-item>
      <el-form-item :label="t('common.tags')">
        <el-input v-model="form.tags" :placeholder="t('devices.tagsPlaceholder')" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleSave" :loading="saving">
        {{ t('common.save') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DeviceFormData } from '../types'

const props = defineProps<{
  /** 控制对话框显示/隐藏 */
  modelValue: boolean
  /** 设备表单数据 */
  form: DeviceFormData
  /** 是否为编辑模式（true 为编辑，false 为新增） */
  isEditing: boolean
  /** 保存按钮 loading 状态 */
  saving: boolean
  /** 可用的协议插件选项列表 */
  pluginOptions: { label: string; value: string; defaultConfig?: any }[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'save'): void
}>()

const { t } = useI18n()

/** 内部表单 ref，用于校验 */
const formRefInternal = ref()

/** Modbus 协议类型判断，用于显示通用参数 */
const isModbus = computed(() =>
  props.form.pluginName === 'modbus_tcp' || props.form.pluginName === 'modbus_rtu'
)

/** 当前协议类型展示文本 */
const selectedPluginLabel = computed(() => {
  const opt = props.pluginOptions.find(o => o.value === props.form.pluginName)
  return opt?.label || props.form.pluginName
})

/** 串口波特率选项 */
const baudrateOptions = [1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200]

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

/** 表单校验规则，根据协议类型动态生成 */
const deviceFormRules = computed(() => ({
  asset: [{ required: true, message: t('devices.assetRequired'), trigger: 'blur' }],
  pluginName: [{ required: true, message: t('devices.pluginRequired'), trigger: 'change' }],
  host: props.form.pluginName === 'modbus_rtu'
    ? []
    : [{ required: true, message: t('devices.hostRequired'), trigger: 'blur' }],
  serial_port: props.form.pluginName === 'modbus_rtu'
    ? [{ required: true, message: t('devices.serialPortRequired'), trigger: 'blur' }]
    : [],
}))

/** 点击保存：先校验，通过后再 emit */
const handleSave = async () => {
  if (!formRefInternal.value) return
  try {
    await formRefInternal.value.validate()
    emit('save')
  } catch {
    // 校验失败，不触发保存
  }
}
</script>

<style>
/* 引入 Devices 模块通用弹框样式 */
@import './DialogCommon.css';

.protocol-display {
  width: 100%;
  height: 32px;
  line-height: 32px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-base);
  padding: 0 11px;
  box-sizing: border-box;
}

/* 弹框内容超出时显示滚动条 */
.device-dialog .el-dialog__body {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
