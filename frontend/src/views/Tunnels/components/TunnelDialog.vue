<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :title="isEditing ? t('channels.editChannel') : t('channels.addChannel')"
    width="min(900px, 90vw)"
    :close-on-click-modal="false"
    align-center
    class="x-dialog tunnel-dialog"
  >
    <el-form
      ref="formRefInternal"
      :model="form"
      :rules="tunnelFormRules"
      label-width="100px"
      label-position="left"
    >
      <!-- 卡片1: 基本信息 -->
      <el-card class="config-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">{{ t('channels.basicInfo') }}</span>
            <el-tag type="danger" size="small">{{ t('channels.required') }}</el-tag>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="t('channels.channelId')" prop="id">
              <el-input
                v-model="form.id"
                :placeholder="t('channels.channelIdHint')"
                :disabled="isEditing"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('channels.channelName')" prop="name">
              <el-input v-model="form.name" :placeholder="t('channels.channelNameHint')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="t('channels.protocolType')" prop="protocol">
              <el-select
                :model-value="form.protocol"
                @update:model-value="handleProtocolChange"
                :placeholder="t('channels.selectProtocol')"
                class="scada-select"
                popper-class="scada-select-dropdown"
              >
                <el-option
                  v-for="opt in protocolOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('channels.enable')">
              <el-switch v-model="form.enabled" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="t('channels.description')">
          <el-input v-model="form.description" type="textarea" :rows="2" :placeholder="t('channels.descriptionHint')" />
        </el-form-item>
      </el-card>

      <!-- 卡片2: 连接配置 -->
      <el-card class="config-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">{{ t('channels.connectionConfig') }}</span>
            <el-tag type="danger" size="small">{{ t('channels.required') }}</el-tag>
          </div>
        </template>

        <!-- MQTT/HTTP 连接配置 -->
        <template v-if="form.protocol !== 'xnc'">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item :label="t('channels.hostAddress')" prop="host">
                <el-input v-model="form.host" :placeholder="t('channels.hostAddressHint')" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="t('channels.port')">
                <el-input-number v-model="form.port" :min="1" :max="65535" class="full-width" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="t('channels.username')">
                <el-input v-model="form.username" :placeholder="t('common.optional')" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="t('channels.password')">
                <el-input v-model="form.password" type="password" :placeholder="t('common.optional')" show-password />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <!-- XNC 连接配置 -->
        <template v-if="form.protocol === 'xnc'">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item :label="t('channels.localPort')">
                <el-input-number v-model="form.local_port" :min="1024" :max="65535" class="full-width" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="t('channels.remoteHost')">
                <el-input v-model="form.remote_host" :placeholder="t('channels.remoteHostHint')" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="t('channels.remotePort')">
                <el-input-number v-model="form.remote_port" :min="1" :max="65535" class="full-width" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-card>

      <!-- 卡片3: MQTT 适配器配置 -->
      <el-card v-if="form.protocol === 'mqtt'" class="config-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">{{ t('channels.adapterConfig') }}</span>
            <el-tag v-if="form.adapter === 'C001'" type="danger" size="small">{{ t('channels.required') }}</el-tag>
            <el-tag v-else type="info" size="small">{{ t('common.optional') }}</el-tag>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="t('channels.adapter')">
              <el-select
                :model-value="form.adapter"
                @update:model-value="handleAdapterChange"
                :placeholder="t('channels.adapterHint')"
                filterable
                allow-create
                class="scada-select"
                popper-class="scada-select-dropdown"
              >
                <el-option
                  v-for="opt in mqttAdapterOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                >
                  <span>{{ opt.label }}</span>
                  <span class="option-desc">{{ opt.description }}</span>
                </el-option>
              </el-select>
              <div class="form-hint">{{ t('channels.adapterHintText') }}</div>
            </el-form-item>
          </el-col>
          <el-col v-if="form.adapter === 'C001'" :span="12">
            <el-form-item :label="t('channels.productKey')" required>
              <el-input
                v-model="localProductKey"
                :placeholder="t('channels.productKeyHint')"
              />
              <div class="form-hint">{{ t('channels.productKeyDesc') }}</div>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 客户A模板配置 -->
        <el-form-item v-if="form.adapter === 'C001'" label=" ">
          <el-collapse class="full-width">
            <el-collapse-item :title="t('channels.templateConfig')">
              <el-alert type="info" :closable="false" class="alert-with-margin">
                {{ t('channels.templateConfigHint') }}
              </el-alert>
              <el-input
                v-model="form.adapter_config"
                type="textarea"
                :rows="15"
                :placeholder="t('channels.jsonConfigHint')"
              />
            </el-collapse-item>
          </el-collapse>
        </el-form-item>

        <!-- 其他适配器JSON配置 -->
        <el-form-item v-else-if="form.adapter !== 'standard'" :label="t('channels.adapterConfig')">
          <el-input
            v-model="form.adapter_config"
            type="textarea"
            :rows="5"
            :placeholder="t('channels.adapterConfigHint')"
          />
          <div class="form-hint">{{ t('channels.adapterConfigHintText') }}</div>
        </el-form-item>
      </el-card>

      <!-- 卡片4: 高级配置 -->
      <el-card class="config-card optional" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">{{ t('channels.advancedConfig') }}</span>
            <el-tag type="info" size="small">{{ t('common.optional') }}</el-tag>
          </div>
        </template>
        <el-collapse>
          <!-- MQTT 高级参数 -->
          <el-collapse-item v-if="form.protocol === 'mqtt'" :title="t('channels.mqttParams')">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="t('channels.clientId')">
                  <el-input v-model="form.client_id" :placeholder="t('channels.clientIdHint')" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="QoS">
                  <el-radio-group v-model="form.qos">
                    <el-radio :value="0">{{ t('channels.qos0') }}</el-radio>
                    <el-radio :value="1">{{ t('channels.qos1') }}</el-radio>
                    <el-radio :value="2">{{ t('channels.qos2') }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="t('channels.keepaliveTime')">
                  <el-input-number v-model="form.keepalive" :min="10" :max="3600" />
                  <span class="unit-hint">{{ t('channels.seconds') }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="t('channels.cleanSession')">
                  <el-switch v-model="form.clean_session" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="t('channels.publishMode')">
                  <el-radio-group v-model="form.publish_mode">
                    <el-radio value="single">{{ t('channels.singleSend') }}</el-radio>
                    <el-radio value="batch">{{ t('channels.batchSend') }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="t('channels.commandTimeout')">
                  <el-input-number v-model="form.command_timeout" :min="5" :max="300" />
                  <span class="unit-hint">{{ t('channels.seconds') }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <template v-if="form.adapter !== 'C001'">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item :label="t('channels.topic')">
                    <el-input v-model="form.topic" :placeholder="t('channels.topicHint')" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="t('channels.commandTopic')">
                    <el-input v-model="form.command_topic" :placeholder="t('channels.commandTopicHint')" />
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-collapse-item>

          <!-- XNC 高级参数 -->
          <el-collapse-item v-if="form.protocol === 'xnc'" :title="t('channels.xncParams')">
            <el-form-item :label="t('channels.reconnectInterval')">
              <el-input-number v-model="form.reconnect_interval" :min="1" :max="300" />
              <span class="unit-hint">{{ t('channels.reconnectIntervalHint') }}</span>
            </el-form-item>
            <el-form-item :label="t('channels.mappingConfig')">
              <el-input
                v-model="form.mapping_config"
                type="textarea"
                :rows="6"
                :placeholder="t('channels.mappingConfigHint')"
              />
              <div class="mapping-help">
                <div class="mapping-help-text">{{ t('channels.mappingConfigHintText') }}</div>
                <el-button type="primary" link size="small" @click="emit('fillMappingTemplate')">
                  {{ t('channels.fillTemplate') }}
                </el-button>
              </div>
            </el-form-item>
          </el-collapse-item>

          <!-- HTTP 高级参数 -->
          <el-collapse-item v-if="form.protocol === 'http'" :title="t('channels.httpParams')">
            <el-form-item :label="t('channels.endpointUrl')">
              <el-input v-model="form.endpoint" :placeholder="t('channels.endpointUrlHint')" />
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="t('channels.requestMethod')">
                  <el-radio-group v-model="form.method">
                    <el-radio value="GET">GET</el-radio>
                    <el-radio value="POST">POST</el-radio>
                    <el-radio value="PUT">PUT</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="t('channels.timeoutTime')">
                  <el-input-number v-model="form.timeout" :min="1" :max="300" />
                  <span class="unit-hint">{{ t('channels.seconds') }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item :label="t('channels.requestHeaders')">
              <el-input
                v-model="form.headers"
                type="textarea"
                :rows="3"
                :placeholder="t('channels.requestHeadersHint')"
              />
            </el-form-item>
          </el-collapse-item>

          <!-- 上传策略 -->
          <el-collapse-item :title="t('channels.uploadStrategy')">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="t('channels.immediateUpload')">
                  <el-switch v-model="form.immediate_upload" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="t('channels.batchSize')">
                  <el-input-number v-model="form.batch_size" :min="1" :max="10000" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="t('channels.uploadInterval')">
                  <el-input-number v-model="form.interval" :min="1" :max="3600" />
                  <span class="unit-hint">{{ t('channels.seconds') }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="t('channels.retryTimes')">
                  <el-input-number v-model="form.retry_times" :min="0" :max="10" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item :label="t('channels.retryInterval')">
              <el-input-number v-model="form.retry_interval" :min="1" :max="300" />
              <span class="unit-hint">{{ t('channels.retryIntervalHint') }}</span>
            </el-form-item>
          </el-collapse-item>

          <!-- 其他配置 -->
          <el-collapse-item :title="t('channels.otherConfig')">
            <el-form-item :label="t('channels.tags')">
              <el-input v-model="form.tags" :placeholder="t('channels.tagsHint')" />
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </el-form>

    <template #footer>
      <el-button @click="emit('update:modelValue', false)">{{ t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleSave" :loading="saving">
        {{ t('common.save') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormInstance } from 'element-plus'
import type { NorthChannelProtocol } from '@/api/types'
import type { ChannelFormData, ProtocolOption, MqttAdapterOption } from '../types'

const props = defineProps<{
  modelValue: boolean
  form: ChannelFormData
  isEditing: boolean
  saving: boolean
  protocolOptions: ProtocolOption[]
  mqttAdapterOptions: MqttAdapterOption[]
  productKey: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'update:productKey', val: string): void
  (e: 'updateAdapterConfig', config: string): void
  (e: 'save'): void
  (e: 'protocolChange', form: ChannelFormData, val: NorthChannelProtocol): void
  (e: 'adapterChange', form: ChannelFormData, val: string): void
  (e: 'fillMappingTemplate'): void
}>()

const { t } = useI18n()
const formRefInternal = ref<FormInstance>()

/**
 * productKey 本地双向绑定，通过 emit 同步 adapter_config 而非直接修改 props
 */
const localProductKey = computed({
  get: () => props.productKey,
  set: (val: string) => {
    emit('update:productKey', val)
    if (props.form.adapter === 'C001') {
      try {
        const config = JSON.parse(props.form.adapter_config || '{}')
        config.productKey = val
        emit('updateAdapterConfig', JSON.stringify(config, null, 2))
      } catch {
        // ignore
      }
    }
  }
})

const tunnelFormRules = computed(() => ({
  id: [{ required: true, message: t('channels.idRequired'), trigger: 'blur' }],
  name: [{ required: true, message: t('channels.nameRequired'), trigger: 'blur' }],
  protocol: [{ required: true, message: t('channels.protocolRequired'), trigger: 'change' }]
}))

const handleProtocolChange = (val: NorthChannelProtocol) => {
  emit('protocolChange', props.form, val)
}

const handleAdapterChange = (val: string) => {
  emit('adapterChange', props.form, val)
}

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
@import './TunnelDialogCommon.css';

.config-card {
  margin-bottom: 16px;
  border: 1px solid var(--border-base);
}

.config-card.optional {
  border-color: var(--border-base);
  background: var(--bg-hover);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  color: var(--text-primary);
}

.card-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
}

.tunnel-dialog .el-dialog__body {
  max-height: 60vh;
  overflow-y: auto;
}

.tunnel-dialog .el-dialog__header {
  padding: 16px 20px;
}

.full-width {
  width: 100%;
}

.unit-hint {
  margin-left: 8px;
  color: var(--text-secondary);
  font-size: 12px;
}

.option-desc {
  float: right;
  color: var(--text-secondary);
  font-size: 12px;
}

.mapping-help {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.mapping-help-text {
  font-size: 12px;
  color: var(--text-secondary);
}

.alert-with-margin {
  margin-bottom: 12px;
}
</style>
