<template>
  <div class="node-config-panel">
    <!-- 面板头部：标题 -->
    <div class="panel-header">
      <h3>{{ panelTitle }}</h3>
    </div>

    <div class="panel-body">
      <!-- 数据触发器配置 -->
      <template v-if="nodeType === 'trigger' && localData.trigger">
        <div class="form-group">
          <label>{{ t('nodeConfig.dataSourceDevice') }}</label>
          <el-select
            v-model="selectedTriggerDevice"
            :placeholder="t('common.pleaseSelect', { name: t('nodeConfig.dataSourceDevice') })"
            filterable
            clearable
            value-key="asset"
            style="width: 100%"
            class="scada-select"
            popper-class="scada-select-dropdown"
          >
            <el-option
              v-for="device in triggerDevices"
              :key="device.asset"
              :label="`${device.name || device.asset} (${device.plugin?.name})`"
              :value="device"
            >
              <div class="device-option">
                <span class="device-name">{{ device.name || device.asset }}</span>
                <span class="device-meta">{{ device.plugin?.name }} · {{ device.points?.length || 0 }} {{ t('nodeConfig.points') }}</span>
              </div>
            </el-option>
          </el-select>
        </div>
        <div class="form-group">
          <label>{{ t('nodeConfig.dataPoint') }}</label>
          <el-select
            v-model="localData.trigger.field"
            :placeholder="t('common.pleaseSelect', { name: t('nodeConfig.dataPoint') })"
            filterable
            clearable
            :disabled="!selectedTriggerDevice"
            style="width: 100%"
            class="scada-select"
            popper-class="scada-select-dropdown"
            @change="updateData"
          >
            <el-option
              v-for="point in triggerPoints"
              :key="point.name"
              :label="`${point.description || point.name}${point.unit ? ' (' + point.unit + ')' : ''}`"
              :value="point.name"
            >
              <div class="point-option">
                <span class="point-name">{{ point.name }}</span>
                <span class="point-meta">
                  {{ point.data_type }}{{ point.unit ? ' · ' + point.unit : '' }}
                </span>
              </div>
            </el-option>
          </el-select>
        </div>
        <div v-if="localData.trigger.sourceService" class="form-group info-group">
          <label>{{ t('nodeConfig.southPlugin') }}</label>
          <div class="info-value">{{ localData.trigger.sourceService }}</div>
        </div>
        <div class="form-group">
          <label>{{ t('nodeConfig.description') }}</label>
          <textarea
            v-model="localData.trigger.description"
            :placeholder="t('nodeConfig.optionalDesc')"
            @input="updateData"
          ></textarea>
        </div>
      </template>

      <!-- 定时触发器配置 -->
      <template v-if="nodeType === 'schedule-trigger' && localData.scheduleTrigger">
        <div class="form-group">
          <label>{{ t('nodeConfig.triggerMode') }}</label>
          <el-select
            v-model="localData.scheduleTrigger.mode"
            style="width: 100%"
            class="scada-select"
            popper-class="scada-select-dropdown"
            @change="updateData"
          >
            <el-option
              v-for="mode in SCHEDULE_MODES"
              :key="mode.value"
              :label="t(mode.labelKey)"
              :value="mode.value"
            />
          </el-select>
        </div>

        <!-- 周期模式配置 -->
        <template v-if="localData.scheduleTrigger.mode === 'periodic'">
          <div class="form-group">
            <label>{{ t('nodeConfig.executionFrequency') }}</label>
            <el-select
            v-model="localData.scheduleTrigger.frequency"
            style="width: 100%"
            class="scada-select"
            popper-class="scada-select-dropdown"
            @change="updateData"
          >
            <el-option
              v-for="freq in SCHEDULE_FREQUENCIES"
              :key="freq.value"
              :label="t(freq.labelKey)"
              :value="freq.value"
            />
          </el-select>
          </div>

          <div class="form-group">
            <label>{{ t('nodeConfig.executionTime') }}</label>
            <el-time-picker
              v-model="localData.scheduleTrigger.time"
              format="HH:mm"
              value-format="HH:mm"
              class="scada-time-picker"
              popper-class="scada-select-dropdown"
              @change="updateData"
            />
          </div>

          <div v-if="localData.scheduleTrigger.frequency === 'weekly'" class="form-group">
            <label>{{ t('nodeConfig.selectWeekday') }}</label>
            <div class="weekday-selector">
              <button
                v-for="day in WEEKDAYS"
                :key="day.value"
                class="weekday-btn"
                :class="{ active: isDaySelected(day.value) }"
                @click="toggleDay(day.value)"
              >
                {{ t(day.labelKey) }}
              </button>
            </div>
          </div>
        </template>

        <!-- 一次性模式配置 -->
        <template v-if="localData.scheduleTrigger.mode === 'once'">
          <div class="form-group">
            <label>{{ t('nodeConfig.executionTime') }}</label>
            <el-time-picker
              v-model="localData.scheduleTrigger.time"
              format="HH:mm"
              value-format="HH:mm"
              class="scada-time-picker"
              popper-class="scada-select-dropdown"
              @change="updateData"
            />
          </div>
          <div class="form-group">
            <label>{{ t('nodeConfig.executionDate') }}</label>
            <el-date-picker
              v-model="localData.scheduleTrigger.startDate"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              class="scada-date-picker"
              popper-class="scada-select-dropdown"
              @change="updateData"
            />
          </div>
        </template>

        <!-- Cron 表达式模式配置 -->
        <template v-if="localData.scheduleTrigger.mode === 'cron'">
          <div class="form-group">
            <label>{{ t('nodeConfig.cronExpression') }}</label>
            <input
              v-model="localData.scheduleTrigger.cron"
              type="text"
              :placeholder="t('nodeConfig.cronFormat')"
              @input="updateData"
            >
            <span class="hint">{{ t('nodeConfig.cronFormat') }}</span>
          </div>
          <div class="cron-examples">
            <p><strong>{{ t('nodeConfig.cronExample') }}:</strong></p>
            <p>0 0 8 * * ? - {{ t('ruleEditor.executionTime') }}8:00</p>
            <p>0 30 18 * * ? - {{ t('ruleEditor.executionTime') }}18:30</p>
            <p>0 0 9 ? * MON-FRI - {{ t('ruleEditor.executionTime') }}9:00</p>
          </div>
        </template>

        <div class="form-group">
          <label>{{ t('nodeConfig.effectiveDateRange') }}</label>
          <div class="date-range">
            <el-date-picker
              v-model="localData.scheduleTrigger.startDate"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :placeholder="t('nodeConfig.startDate')"
              class="scada-date-picker"
              popper-class="scada-select-dropdown"
              @change="updateData"
            />
            <span>{{ t('nodeConfig.to') }}</span>
            <el-date-picker
              v-model="localData.scheduleTrigger.endDate"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :placeholder="t('nodeConfig.endDate')"
              class="scada-date-picker"
              popper-class="scada-select-dropdown"
              @change="updateData"
            />
          </div>
        </div>

        <div class="form-group">
          <label>{{ t('nodeConfig.description') }}</label>
          <textarea
            v-model="localData.scheduleTrigger.description"
            :placeholder="t('nodeConfig.optionalDesc')"
            @input="updateData"
          ></textarea>
        </div>
      </template>

      <!-- 条件判断配置 -->
      <template v-if="nodeType === 'condition' && localData.condition">
        <div class="form-group">
          <label>{{ t('nodeConfig.fieldName') }}</label>
          <el-select
            v-if="allDevicePoints.length > 0"
            v-model="localData.condition.field"
            :placeholder="t('nodeConfig.selectOrEnterField')"
            filterable
            allow-create
            clearable
            style="width: 100%"
            class="scada-select"
            popper-class="scada-select-dropdown"
            @change="updateData"
          >
            <el-option
              v-for="point in allDevicePoints"
              :key="point.name"
              :label="point.description || point.name"
              :value="point.name"
            />
          </el-select>
          <input
            v-else
            v-model="localData.condition.field"
            type="text"
            placeholder="e.g. temperature"
            @input="updateData"
          >
        </div>
        <div class="form-group">
          <label>{{ t('nodeConfig.operator') }}</label>
          <el-select
            v-model="localData.condition.operator"
            style="width: 100%"
            class="scada-select"
            popper-class="scada-select-dropdown"
            @change="updateData"
          >
            <el-option
              v-for="op in OPERATORS"
              :key="op.value"
              :label="t(op.labelKey)"
              :value="op.value"
            />
          </el-select>
        </div>
        <div class="form-group">
          <label>{{ t('nodeConfig.comparisonValue') }}</label>
          <input
            v-model="localData.condition.value"
            type="text"
            placeholder="e.g. 30"
            @input="updateData"
          >
        </div>
        <div class="form-group">
          <label>{{ t('nodeConfig.duration') }}</label>
          <input
            v-model.number="localData.condition.duration"
            type="number"
            min="0"
            :placeholder="t('nodeConfig.instantTrigger')"
            @input="updateData"
          >
          <span class="hint">0 = {{ t('nodeConfig.instantTrigger') }}</span>
        </div>
        <div class="form-group">
          <label>{{ t('nodeConfig.description') }}</label>
          <textarea
            v-model="localData.condition.description"
            :placeholder="t('nodeConfig.optionalDesc')"
            @input="updateData"
          ></textarea>
        </div>
      </template>

      <!-- 逻辑运算配置 -->
      <template v-if="nodeType === 'logic' && localData.logic">
        <div class="form-group">
          <label>{{ t('nodeConfig.logicOperator') }}</label>
          <el-select
            v-model="localData.logic.operator"
            :placeholder="t('common.pleaseSelect', { name: t('nodeConfig.logicOperator') })"
            style="width: 100%"
            class="scada-select"
            popper-class="scada-select-dropdown"
            @change="updateData"
          >
            <el-option
              v-for="op in LOGIC_OPERATORS"
              :key="op.value"
              :label="t(op.labelKey)"
              :value="op.value"
            />
          </el-select>
        </div>
        <div class="logic-hint">
          <p><strong>AND:</strong> {{ t('nodeConfig.logicAnd') }}</p>
          <p><strong>OR:</strong> {{ t('nodeConfig.logicOr') }}</p>
          <p><strong>NOT:</strong> {{ t('nodeConfig.logicNot') }}</p>
        </div>
        <div class="form-group">
          <label>{{ t('nodeConfig.description') }}</label>
          <textarea
            v-model="localData.logic.description"
            :placeholder="t('nodeConfig.optionalDesc')"
            @input="updateData"
          ></textarea>
        </div>
      </template>

      <!-- 执行动作配置 -->
      <template v-if="nodeType === 'action' && localData.action">
        <div class="form-group">
          <label>{{ t('nodeConfig.targetDevice') }}</label>
          <el-select
            v-model="selectedActionDevice"
            :placeholder="t('common.pleaseSelect', { name: t('nodeConfig.targetDevice') })"
            filterable
            clearable
            value-key="asset"
            style="width: 100%"
            class="scada-select"
            popper-class="scada-select-dropdown"
          >
            <el-option
              v-for="device in actionDevices"
              :key="device.asset"
              :label="`${device.name || device.asset} (${device.plugin?.name})`"
              :value="device"
            >
              <div class="device-option">
                <span class="device-name">{{ device.name || device.asset }}</span>
                <span class="device-meta">{{ device.plugin?.name }} · {{ device.points?.length || 0 }} {{ t('nodeConfig.points') }}</span>
              </div>
            </el-option>
          </el-select>
        </div>
        <div class="form-group">
          <label>{{ t('nodeConfig.operationType') }}</label>
          <el-select
            v-model="localData.action.operation"
            :placeholder="t('common.pleaseSelect', { name: t('nodeConfig.operationType') })"
            style="width: 100%"
            class="scada-select"
            popper-class="scada-select-dropdown"
            @change="updateData"
          >
            <el-option :label="t('nodeConfig.writeSetpoint')" value="write_setpoint" />
          </el-select>
        </div>
        <template v-if="localData.action.operation === 'write_setpoint'">
          <div class="form-group">
            <label>{{ t('nodeConfig.writePoint') }}</label>
            <el-select
              v-model="selectedActionPoint"
              :placeholder="t('common.pleaseSelect', { name: t('nodeConfig.writePoint') })"
              filterable
              clearable
              :disabled="!selectedActionDevice"
              style="width: 100%"
              class="scada-select"
              popper-class="scada-select-dropdown"
            >
              <el-option
                v-for="point in actionPoints"
                :key="point.name"
                :label="`${point.description || point.name}${point.unit ? ' (' + point.unit + ')' : ''}`"
                :value="point.name"
              >
                <div class="point-option">
                  <span class="point-name">{{ point.name }}</span>
                  <span class="point-meta">{{ point.data_type }}{{ point.unit ? ' · ' + point.unit : '' }}</span>
                </div>
              </el-option>
            </el-select>
          </div>
          <div class="form-group">
            <label>{{ t('nodeConfig.writeValue') }}</label>
            <input
              v-model="actionValue"
              type="text"
              placeholder="e.g. true / 1 / 25.5"
            >
          </div>
        </template>
        <div v-if="localData.action.targetService" class="form-group info-group">
          <label>{{ t('nodeConfig.southPlugin') }}</label>
          <div class="info-value">{{ localData.action.targetService }}</div>
        </div>
        <div class="form-group">
          <label>{{ t('nodeConfig.delayExecution') }}</label>
          <input
            v-model.number="localData.action.delay"
            type="number"
            min="0"
            :placeholder="t('nodeConfig.immediateExecution')"
            @input="updateData"
          >
          <span class="hint">0 = {{ t('nodeConfig.immediateExecution') }}</span>
        </div>
        <div class="form-group">
          <label>{{ t('nodeConfig.description') }}</label>
          <textarea
            v-model="localData.action.description"
            :placeholder="t('nodeConfig.optionalDesc')"
            @input="updateData"
          ></textarea>
        </div>
      </template>

      <!-- 通知告警配置 -->
      <template v-if="nodeType === 'notification' && localData.notification">
        <div class="form-group">
          <label>{{ t('nodeConfig.notificationLevel') }}</label>
          <el-select
            v-model="localData.notification.level"
            :placeholder="t('common.pleaseSelect', { name: t('nodeConfig.notificationLevel') })"
            style="width: 100%"
            class="scada-select"
            popper-class="scada-select-dropdown"
            @change="updateData"
          >
            <el-option
              v-for="lv in NOTIFICATION_LEVELS"
              :key="lv.value"
              :label="t(lv.labelKey)"
              :value="lv.value"
            />
          </el-select>
        </div>
        <div class="form-group">
          <label>{{ t('nodeConfig.notificationChannel') }}</label>
          <el-select
            v-model="localData.notification.channel_type"
            :placeholder="t('common.pleaseSelect', { name: t('nodeConfig.notificationChannel') })"
            style="width: 100%"
            :disabled="notificationChannelTypes.length === 0"
            class="scada-select"
            popper-class="scada-select-dropdown"
            @change="updateData"
          >
            <el-option
              v-for="ct in notificationChannelTypes"
              :key="ct.value"
              :label="ct.label"
              :value="ct.value"
            />
          </el-select>
          <div v-if="notificationChannelTypes.length === 0" class="warning-hint">
            💡 {{ t('nodeConfig.noAvailableChannels') }}
          </div>
        </div>
        <div class="form-group info-box">
          <span class="info-icon">💡</span>
          <span>{{ t('nodeConfig.channelConfigHint') }}</span>
        </div>
        <div class="form-group">
          <label>{{ t('nodeConfig.description') }}</label>
          <textarea
            v-model="localData.notification.description"
            :placeholder="t('nodeConfig.optionalDesc')"
            @input="updateData"
          ></textarea>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { RuleNodeData, NodeType } from '@/types/rule'
import { OPERATORS, LOGIC_OPERATORS, SCHEDULE_MODES, SCHEDULE_FREQUENCIES, WEEKDAYS, NOTIFICATION_LEVELS } from '@/types/rule'
import { useDeviceStore } from '@/stores/devices'
import { useAlertStore } from '@/stores/alerts'
import type { DeviceConfig, PointConfig } from '@/api/types'

const { t } = useI18n()

const props = defineProps<{
  /** 节点 ID */
  nodeId: string
  /** 节点类型 */
  nodeType: NodeType
  /** 节点数据 */
  nodeData: RuleNodeData
}>()

const emit = defineEmits<{
  (e: 'update', data: RuleNodeData): void
}>()

const deviceStore = useDeviceStore()
const alertStore = useAlertStore()

/** 本地副本数据（编辑期间暂存，作为唯一数据源） */
const localData = ref<RuleNodeData>(JSON.parse(JSON.stringify(props.nodeData || {})))

/** 规则引擎支持的通知渠道类型 */
type SupportedNotificationChannel = 'email' | 'webhook' | 'system'

const SUPPORTED_NOTIFICATION_CHANNELS: SupportedNotificationChannel[] = ['email', 'webhook', 'system']

/** 已启用且受规则引擎支持的通知渠道列表 */
const availableChannels = computed(() => {
  return alertStore.channels
    .filter(channel => channel.enabled && SUPPORTED_NOTIFICATION_CHANNELS.includes(channel.type as SupportedNotificationChannel))
    .map(channel => ({
      value: channel.type as SupportedNotificationChannel,
      label: t('notificationChannels.' + channel.type) || channel.name,
      disabled: false
    }))
})

/** 通知渠道类型下拉选项 */
const notificationChannelTypes = computed(() => {
  if (availableChannels.value.length === 0) {
    return []
  }
  return availableChannels.value
})

/** 所有设备的所有启用的点位（供条件节点字段选择器使用） */
const allDevicePoints = computed<PointConfig[]>(() => {
  return devices.value
    .filter(d => d.enabled && d.points)
    .flatMap(d => d.points?.filter(p => p.enabled) || [])
})

// ==================== 数据同步 ====================

/**
 * 确保各类型节点的数据结构已初始化
 * 注意：通知渠道默认值在 onMounted 中异步设置，此处仅做结构初始化
 */
const ensureNodeData = () => {
  if (props.nodeType === 'trigger' && !localData.value.trigger) {
    localData.value.trigger = { source: '', field: '' }
  }
  if (props.nodeType === 'schedule-trigger' && !localData.value.scheduleTrigger) {
    localData.value.scheduleTrigger = { mode: 'periodic', time: '08:00', frequency: 'daily', days: [] }
  }
  if (props.nodeType === 'condition' && !localData.value.condition) {
    localData.value.condition = { field: '', operator: '>', value: '', duration: 0 }
  }
  if (props.nodeType === 'logic' && !localData.value.logic) {
    localData.value.logic = { operator: 'and' }
  }
  if (props.nodeType === 'action' && !localData.value.action) {
    localData.value.action = { target_asset: '', operation: 'write_setpoint', parameters: {}, delay: 0 }
  }
  if (props.nodeType === 'notification' && !localData.value.notification) {
    // 先设置结构，渠道默认值在渠道加载完成后异步设置
    localData.value.notification = { channel_type: 'system', level: 'warning' }
  }
}

ensureNodeData()

/** 外部数据变化时同步本地数据（如重置节点数据为默认值） */
watch(() => props.nodeData, (newData) => {
  localData.value = JSON.parse(JSON.stringify(newData || {}))
  ensureNodeData()
}, { deep: true })

/** 挂载时初始化设备数据，并异步设置通知渠道默认值 */
onMounted(async () => {
  // 始终强制获取最新设备数据，确保与设备管理页面同步
  deviceStore.fetchDevices()
  if (alertStore.channels.length === 0) {
    await alertStore.fetchChannels()
  }

  // 渠道加载完成后，如果通知节点还未设置渠道，使用第一个可用渠道
  if (props.nodeType === 'notification' && localData.value.notification) {
    const currentChannel = localData.value.notification.channel_type
    if (!currentChannel && availableChannels.value.length > 0) {
      localData.value.notification.channel_type = availableChannels.value[0].value
    }
  }
})

// ==================== 设备/点位选择器 ====================

const devices = computed<DeviceConfig[]>(() => deviceStore.devices)

/** 触发器可用设备（已启用） */
const triggerDevices = computed(() =>
  devices.value.filter(d => d.enabled)
)

/** 当前选中的触发器设备 */
const selectedTriggerDevice = computed<DeviceConfig | undefined>({
  get: () => {
    const source = localData.value.trigger?.source
    return devices.value.find(d => d.asset === source)
  },
  set: (device: DeviceConfig | undefined) => {
    if (localData.value.trigger && device) {
      localData.value.trigger.source = device.asset
      localData.value.trigger.sourceService = device.plugin?.name || ''
      localData.value.trigger.field = ''
      updateData()
    }
  }
})

/** 触发器设备的可用点位 */
const triggerPoints = computed<PointConfig[]>(() => {
  if (!selectedTriggerDevice.value) return []
  return selectedTriggerDevice.value.points?.filter(p => p.enabled) || []
})

/** 动作节点可用设备（已启用） */
const actionDevices = computed(() => devices.value.filter(d => d.enabled))

/** 当前选中的动作目标设备 */
const selectedActionDevice = computed<DeviceConfig | undefined>({
  get: () => {
    const targetAsset = localData.value.action?.target_asset
    return devices.value.find(d => d.asset === targetAsset)
  },
  set: (device: DeviceConfig | undefined) => {
    if (localData.value.action && device) {
      localData.value.action.target_asset = device.asset
      localData.value.action.targetService = device.plugin?.name || ''
      localData.value.action.operation = 'write_setpoint'
      localData.value.action.parameters = {}
      updateData()
    }
  }
})

/** 动作目标设备的可写点位 */
const actionPoints = computed<PointConfig[]>(() => {
  if (!selectedActionDevice.value) return []
  return selectedActionDevice.value.points?.filter(p => p.enabled) || []
})

/** 动作节点选中的写入点位 */
const selectedActionPoint = computed<string>({
  get: () => localData.value.action?.parameters?.point || '',
  set: (val: string) => {
    if (localData.value.action) {
      localData.value.action.parameters = {
        ...localData.value.action.parameters,
        point: val,
      }
      updateData()
    }
  }
})

/**
 * 动作写入值
 * 空字符串和纯文本保留为字符串，纯数字才转为 number
 */
const actionValue = computed<string>({
  get: () => {
    const v = localData.value.action?.parameters?.value
    return v !== undefined ? String(v) : ''
  },
  set: (val: string) => {
    if (localData.value.action) {
      // 空字符串保持为空字符串，不转为 0
      if (val === '') {
        localData.value.action.parameters = {
          ...localData.value.action.parameters,
          value: '',
        }
      } else {
        const numVal = Number(val)
        localData.value.action.parameters = {
          ...localData.value.action.parameters,
          value: isNaN(numVal) ? val : numVal,
        }
      }
      updateData()
    }
  }
})

// ==================== 面板操作 ====================

/** 根据节点类型返回对应的面板标题 */
const panelTitle = computed(() => {
  const titles: Record<NodeType, string> = {
    trigger: t('nodeConfig.triggerTitle'),
    'schedule-trigger': t('nodeConfig.scheduleTitle'),
    condition: t('nodeConfig.conditionTitle'),
    logic: t('nodeConfig.logicTitle'),
    action: t('nodeConfig.actionTitle'),
    notification: t('nodeConfig.notificationTitle')
  }
  return titles[props.nodeType]
})

/** 通知配置变更时同步更新 */
const updateData = () => {
  emit('update', { ...localData.value })
}

/** 切换定时任务的星期选择（创建新数组避免共享引用） */
const toggleDay = (day: number) => {
  if (!localData.value.scheduleTrigger) return
  const days = localData.value.scheduleTrigger.days
  const index = days.indexOf(day)
  if (index === -1) {
    localData.value.scheduleTrigger.days = [...days, day]
  } else {
    localData.value.scheduleTrigger.days = days.filter(d => d !== day)
  }
  updateData()
}

/** 判断指定星期是否已选中 */
const isDaySelected = (day: number) => {
  return localData.value.scheduleTrigger?.days?.includes(day) || false
}
</script>

<style scoped>
.node-config-panel {
  width: 100%;
  background: var(--re-panel-bg);
  backdrop-filter: var(--re-panel-blur);
  -webkit-backdrop-filter: var(--re-panel-blur);
  border-left: 1px solid var(--re-panel-border);
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid var(--re-panel-border);
  background: var(--re-toolbar-bg);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.panel-header::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -10px;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, var(--re-accent) 0%, transparent 70%);
  opacity: 0.15;
  filter: blur(16px);
  pointer-events: none;
}

.panel-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  background: var(--re-title-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.3px;
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
  background: transparent;
}
.panel-body::-webkit-scrollbar-thumb {
  background: var(--border-base);
  border-radius: 3px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input {
  width: 100%;
  padding: 8px 0;
  border: none;
  border-bottom: 1px solid var(--re-input-border);
  border-radius: 0;
  font-size: 13px;
  background-color: transparent;
  color: var(--text-primary);
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group textarea {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--re-input-border);
  border-radius: 10px;
  font-size: 13px;
  background-color: var(--re-input-bg);
  color: var(--text-primary);
  transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
  box-sizing: border-box;
}

.form-group input:hover {
  border-bottom-color: var(--re-input-border-hover);
}

.form-group textarea:hover {
  border-color: var(--re-input-border-hover);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--text-placeholder);
}

.form-group input:focus {
  outline: none;
  border-bottom-color: var(--re-accent);
}

.form-group textarea:focus {
  outline: none;
  border-color: var(--re-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--re-accent) 20%, transparent), 0 0 12px color-mix(in srgb, var(--re-accent) 25%, transparent);
}

/* ==================== Time Pickers & Date Pickers ==================== */
.form-group :deep(.scada-time-picker),
.form-group :deep(.scada-date-picker) {
  width: 100%;
}

.form-group :deep(.scada-time-picker .el-input),
.form-group :deep(.scada-date-picker .el-input) {
  width: 100%;
}

.form-group :deep(.scada-time-picker .el-input__wrapper),
.form-group :deep(.scada-date-picker .el-input__wrapper) {
  padding: 8px 0;
  border: none !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  border-bottom: 1px solid var(--re-input-border) !important;
  border-radius: 0 !important;
  outline: none !important;
  box-shadow: none !important;
  background-color: transparent !important;
  transition: border-color 0.2s;
  cursor: pointer;
  box-sizing: border-box;
}

.form-group :deep(.scada-time-picker .el-input__wrapper:hover),
.form-group :deep(.scada-date-picker .el-input__wrapper:hover) {
  border-bottom-color: var(--re-input-border-hover) !important;
}

.form-group :deep(.scada-time-picker .el-input__wrapper.is-focused),
.form-group :deep(.scada-date-picker .el-input__wrapper.is-focused) {
  border-bottom-color: var(--re-accent) !important;
}

/* Input text color & font */
.form-group :deep(.scada-time-picker .el-input__inner),
.form-group :deep(.scada-date-picker .el-input__inner) {
  color: var(--text-primary);
  font-size: 13px;
}

/* Placeholder */
.form-group :deep(.scada-time-picker .el-input__inner::placeholder),
.form-group :deep(.scada-date-picker .el-input__inner::placeholder) {
  color: var(--text-placeholder);
}

/* Suffix icon (clock / calendar) - visible in dark theme */
.form-group :deep(.scada-time-picker .el-input__suffix),
.form-group :deep(.scada-date-picker .el-input__suffix) {
  color: var(--re-accent);
}

.form-group :deep(.scada-time-picker .el-input__suffix:hover),
.form-group :deep(.scada-date-picker .el-input__suffix:hover) {
  color: var(--re-accent-2);
}

.form-group textarea {
  min-height: 60px;
  resize: vertical;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
}

.form-group .hint {
  display: block;
  margin-top: 4px;
  font-size: 11px;
  color: var(--text-secondary);
}

.info-group .info-value {
  padding: 10px 12px;
  background: var(--re-chip-bg);
  border: 1px solid var(--re-chip-border);
  border-radius: 10px;
  font-size: 13px;
  color: var(--text-primary);
  font-family: 'JetBrains Mono', 'Consolas', monospace;
}

.device-option {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.device-option .device-name {
  font-size: 13px;
  color: var(--text-primary);
}

.device-option .device-meta {
  font-size: 11px;
  color: var(--text-secondary);
}

.point-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.point-option .point-name {
  font-size: 13px;
  color: var(--text-primary);
}

.point-option .point-meta {
  font-size: 11px;
  color: var(--text-secondary);
}

.logic-hint {
  padding: 12px 14px;
  background: var(--re-chip-bg);
  border: 1px solid var(--re-chip-border);
  border-radius: 10px;
  margin-bottom: 16px;
}

.logic-hint p {
  margin: 4px 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.weekday-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.weekday-btn {
  padding: 7px 11px;
  border: 1px solid var(--re-input-border);
  border-radius: 8px;
  background: var(--re-input-bg);
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
  color: var(--text-primary);
}

.weekday-btn:hover {
  border-color: var(--re-input-border-hover);
  box-shadow: 0 0 8px color-mix(in srgb, var(--re-accent) 30%, transparent);
}

.weekday-btn.active {
  background: linear-gradient(135deg, var(--re-accent), var(--re-accent-2));
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 12px color-mix(in srgb, var(--re-accent) 40%, transparent);
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-range .scada-date-picker {
  flex: 1;
}

.date-range span {
  color: var(--text-secondary);
  font-size: 12px;
}

.cron-examples {
  padding: 12px 14px;
  background: var(--re-chip-bg);
  border: 1px solid var(--re-chip-border);
  border-radius: 10px;
  margin-bottom: 16px;
  font-size: 12px;
  color: var(--text-secondary);
  font-family: 'JetBrains Mono', 'Consolas', monospace;
}

.cron-examples p {
  margin: 4px 0;
}

.info-box {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 10px 12px;
  background: var(--re-chip-bg);
  border: 1px solid var(--re-chip-border);
  border-radius: 10px;
  font-size: 12px;
  color: var(--text-primary);
  line-height: 1.4;
}

.info-icon {
  flex-shrink: 0;
}
</style>