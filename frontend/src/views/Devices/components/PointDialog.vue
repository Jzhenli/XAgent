<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEditing ? t('devices.editPoint') : t('devices.addPoint')"
    width="min(700px, 92vw)"
    :close-on-click-modal="false"
    align-center
    class="x-dialog"
  >
    <!-- 表单滚动区域：字段较多时限制高度，避免弹框超出视口 -->
    <div class="point-dialog-scroll-body">
      <el-form
        ref="formRef"
        :model="form"
        :rules="pointFormRules"
        label-width="100px"
      >
        <!-- 基础信息 -->
        <el-form-item :label="t('devices.pointName')" prop="name">
          <el-input
            v-model="form.name"
            :placeholder="t('devices.pointNamePlaceholder')"
            :disabled="isEditing"
          />
        </el-form-item>
        <el-form-item :label="t('common.description')">
          <el-input
            v-model="form.description"
            :placeholder="t('devices.pointDescriptionPlaceholder')"
          />
        </el-form-item>

        <el-divider :content-position="t('devices.dividerLeft')">
          {{ t('devices.protocolConfig') }}
        </el-divider>

        <!-- Modbus TCP/RTU 协议配置 -->
        <template v-if="isModbus">
          <el-form-item :label="t('devices.dataType')" prop="data_type">
            <el-select
              v-model="form.data_type"
              :placeholder="t('devices.selectDataType')"
            >
              <el-option
                v-for="opt in modbusDataTypes"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('devices.registerAddress')" prop="address">
            <el-input-number
              v-model="form.address"
              :min="0"
              :max="65535"
              :placeholder="t('devices.registerAddressPlaceholder')"
            />
          </el-form-item>
          <el-form-item :label="t('devices.registerTypeLabel')">
            <el-select
              v-model="form.register_type"
              :placeholder="t('devices.selectRegisterType')"
            >
              <el-option
                v-for="opt in registerTypes"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('devices.registerCount')">
            <el-input-number
              v-model="form.count"
              :min="1"
              :max="16"
              :placeholder="t('devices.registerCountPlaceholder')"
            />
          </el-form-item>

          <!-- scale / offset 公共组件 -->
          <ScaleOffsetFields
            :form="form"
            :scale-placeholder="t('devices.scalePlaceholder')"
            :offset-placeholder="t('devices.offsetPlaceholder')"
          />

          <el-form-item :label="t('devices.byteOrder')">
            <el-radio-group v-model="form.byte_order">
              <el-radio value="big">{{ t('devices.byteOrderBig') }}</el-radio>
              <el-radio value="little">{{ t('devices.byteOrderLittle') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="t('devices.wordOrder')">
            <el-radio-group v-model="form.word_order">
              <el-radio value="big">{{ t('devices.wordOrderBig') }}</el-radio>
              <el-radio value="little">{{ t('devices.wordOrderLittle') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>

        <!-- KNX 协议配置 -->
        <template v-else-if="currentPluginName === 'knx'">
          <el-form-item :label="t('devices.dataType')" prop="data_type">
            <el-select
              v-model="form.data_type"
              :placeholder="t('devices.selectDataType')"
            >
              <el-option
                v-for="opt in knxDataTypes"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('devices.groupAddress')" prop="group_address">
            <el-input
              v-model="form.group_address"
              :placeholder="t('devices.groupAddressPlaceholder')"
            />
          </el-form-item>
          <el-form-item :label="t('devices.statusAddress')">
            <el-input
              v-model="form.status_address"
              :placeholder="t('devices.statusAddressPlaceholder')"
            />
          </el-form-item>
          <el-form-item :label="t('devices.controlAddress')">
            <el-input
              v-model="form.control_address"
              :placeholder="t('devices.controlAddressPlaceholder')"
            />
          </el-form-item>
          <el-form-item :label="t('devices.writable')">
            <el-switch v-model="form.writable" />
          </el-form-item>

          <!-- scale / offset 公共组件 -->
          <ScaleOffsetFields :form="form" />
        </template>

        <!-- BACnet 协议配置 -->
        <template v-else-if="currentPluginName === 'bacnet'">
          <el-form-item :label="t('devices.objectType')" prop="object_type">
            <el-select
              v-model="form.object_type"
              :placeholder="t('devices.selectObjectType')"
              @change="form.data_type = form.object_type"
            >
              <el-option
                v-for="opt in bacnetDataTypes"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="t('devices.objectInstance')"
            prop="object_instance"
          >
            <el-input-number
              v-model="form.object_instance"
              :min="0"
              :placeholder="t('devices.objectInstancePlaceholder')"
            />
          </el-form-item>
          <el-form-item :label="t('devices.property')">
            <el-input
              v-model="form.property"
              :placeholder="t('devices.propertyPlaceholder')"
            />
          </el-form-item>

          <!-- scale / offset 公共组件 -->
          <ScaleOffsetFields :form="form" />
        </template>

        <!-- 其他协议：使用 JSON 配置 -->
        <template v-else>
          <el-form-item :label="t('devices.dataType')" prop="data_type">
            <el-input
              v-model="form.data_type"
              :placeholder="t('devices.protocolSpecificType')"
            />
          </el-form-item>
          <el-form-item :label="t('devices.protocolConfig')">
            <el-input
              v-model="form.configJson"
              type="textarea"
              :rows="4"
              :placeholder="t('devices.configJsonPlaceholder')"
            />
          </el-form-item>
        </template>

        <el-divider :content-position="t('devices.dividerLeft')">
          {{ t('devices.generalConfig') }}
        </el-divider>

        <!-- 通用配置：标准类型、单位 -->
        <el-form-item :label="t('devices.standardType')">
          <el-input
            :model-value="form.standard_data_type || t('devices.autoDerived')"
            disabled
            :placeholder="t('devices.standardTypePlaceholder')"
          />
          <div class="form-hint">
            {{ t('devices.standardTypeHint') }}
          </div>
        </el-form-item>
        <el-form-item :label="t('devices.unit')">
          <el-input
            v-model="form.unit"
            :placeholder="t('devices.unitPlaceholder')"
          />
        </el-form-item>

        <el-divider :content-position="t('devices.dividerLeft')">
          {{ t('devices.metadata') }}
        </el-divider>

        <!-- 元数据：量程与报警阈值 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="t('devices.minValue')">
              <el-input-number
                v-model="form.min"
                :placeholder="t('devices.optionalPlaceholder')"
                clearable
                class="full-width"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('devices.maxValue')">
              <el-input-number
                v-model="form.max"
                :placeholder="t('devices.optionalPlaceholder')"
                clearable
                class="full-width"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="t('devices.highAlarm')">
              <el-input-number
                v-model="form.alarm_high"
                :placeholder="t('devices.optionalPlaceholder')"
                clearable
                class="full-width"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('devices.lowAlarm')">
              <el-input-number
                v-model="form.alarm_low"
                :placeholder="t('devices.optionalPlaceholder')"
                clearable
                class="full-width"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 启用状态与标签 -->
        <el-form-item :label="t('devices.enabled')">
          <el-switch v-model="form.enabled" />
        </el-form-item>
        <el-form-item :label="t('common.tags')">
          <el-input
            v-model="form.tags"
            :placeholder="t('devices.tagsPlaceholder')"
          />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">
        {{ t('common.cancel') }}
      </el-button>
      <el-button type="primary" @click="handleSave" :loading="saving">
        {{ t('common.save') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PointFormData } from '../types'
import ScaleOffsetFields from './ScaleOffsetFields.vue'

const props = defineProps<{
  modelValue: boolean
  form: PointFormData
  isEditing: boolean
  saving: boolean
  currentPluginName: string
  modbusDataTypes: { label: string; value: string }[]
  knxDataTypes: { label: string; value: string }[]
  bacnetDataTypes: { label: string; value: string }[]
  registerTypes: { label: string; value: string }[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'save'): void
}>()

const { t } = useI18n()

/** 表单 ref，用于校验与提交 */
const formRef = ref()

/** 弹框显隐双向绑定 */
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
})

/** 当前是否为 Modbus TCP/RTU 协议 */
const isModbus = computed(
  () => props.currentPluginName === 'modbus_tcp' || props.currentPluginName === 'modbus_rtu'
)

/** 点位表单校验规则 */
const pointFormRules = {
  name: [
    {
      required: true,
      message: t('devices.pointNameRequired'),
      trigger: 'blur'
    }
  ],
  data_type: [
    { required: true, message: t('devices.dataTypeRequired'), trigger: 'blur' }
  ]
}

/** 保存：校验通过后通知父组件执行保存逻辑 */
const handleSave = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    emit('save')
  } catch {
    // 校验失败，Element Plus 会自动展示错误提示
  }
}
</script>

<style>
/* 引入 Devices 模块通用弹框样式（需 unscoped，弹框内容 teleport 到 body） */
@import './DialogCommon.css';
</style>

<style scoped>
/* 表单滚动区域：限制最大高度，超出时显示纵向滚动条 */
.point-dialog-scroll-body {
  max-height: 60vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
}

/* 数字输入框在 el-col 内撑满宽度 */
.full-width {
  width: 100%;
}
</style>
