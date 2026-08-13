import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useChannelStore } from '@/stores/channels'
import { channelApi } from '@/api/channels'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { NorthChannelConfig, NorthChannelProtocol, NorthChannelConnection } from '@/api/types'
import type { ChannelListItem } from '@/stores/channels'
import type { ChannelFormData, ProtocolOption } from '../types'
import { createInitialChannelForm } from '../types'

// XNC 映射配置模板
const XNC_MAPPING_TEMPLATE = {
  vdid_mapping: {
    device_1: 1,
    device_2: 2
  },
  oid_mapping: {
    'device_1.temperature': 1,
    'device_1.humidity': 2,
    'device_2.pressure': 3
  },
  pid: {
    point_value: 85,
    point_error: 103
  }
}

export function useTunnelManagement() {
  const { t } = useI18n()
  const channelStore = useChannelStore()

  const showTunnelDialog = ref(false)
  const isEditing = ref(false)
  const editingId = ref('')
  const saving = ref(false)

  const protocolOptions: ProtocolOption[] = [
    {
      label: 'MQTT',
      value: 'mqtt',
      defaultPort: 1883,
      defaultConfig: {
        client_id: `xagent_${Date.now()}`,
        topic: 'data/upload',
        qos: 1,
        keepalive: 60,
        clean_session: true,
        command_topic: 'xagent/command',
        publish_mode: 'single',
        command_timeout: 30
      }
    },
    {
      label: 'XNC',
      value: 'xnc',
      defaultPort: 9000,
      defaultConfig: {
        local_port: 8888,
        remote_host: '127.0.0.1',
        remote_port: 9000,
        reconnect_interval: 5
      }
    },
    // {
    //   label: 'HTTP',
    //   value: 'http',
    //   defaultPort: 80,
    //   defaultConfig: {
    //     method: 'POST',
    //     timeout: 30
    //   }
    // }
  ]

  const adapterDefaultsCache = ref<Record<string, unknown>>({})
  const productKey = ref('')
  /** 适配器加载请求版本号，用于防止竞态条件 */
  let adapterRequestVersion = 0

  const mqttAdapterOptions = [
    // { label: t('channels.adapterStandard'), value: 'standard', description: t('channels.adapterStandardDesc') },
    { label: t('channels.adapterC001'), value: 'C001', description: t('channels.adapterC001Desc') }
  ]

  /**
   * 获取适配器默认配置
   */
  const loadAdapterDefaults = async (adapterCode: string): Promise<Record<string, unknown> | null> => {
    if (adapterDefaultsCache.value[adapterCode]) {
      return adapterDefaultsCache.value[adapterCode] as Record<string, unknown>
    }

    try {
      const result = await channelApi.getAdapterDefaults(adapterCode)
      adapterDefaultsCache.value[adapterCode] = result.defaults
      return result.defaults
    } catch (e) {
      console.error('Failed to load adapter defaults:', e)
      return null
    }
  }

  /**
   * 协议变更时填充默认配置
   */
  const handleProtocolChange = (form: ChannelFormData, val: NorthChannelProtocol) => {
    form.protocol = val
    const opt = protocolOptions.find(o => o.value === val)
    if (!opt) return
    form.port = opt.defaultPort
    if (opt.defaultConfig) {
      Object.assign(form, opt.defaultConfig)
    }
  }

  /**
   * 适配器变更处理（带竞态防护）
   */
  const handleAdapterChange = async (form: ChannelFormData, adapter: string) => {
    form.adapter = adapter

    if (adapter === 'standard') {
      form.adapter_config = '{}'
      productKey.value = ''
      return
    }

    // 新增模式或者编辑模式下 adapter_config 为空时，加载默认配置
    if (!isEditing.value || !form.adapter_config || form.adapter_config === '{}') {
      const requestVersion = ++adapterRequestVersion
      const defaults = await loadAdapterDefaults(adapter)
      // 竞态防护：仅当请求版本号仍为最新时才应用结果
      if (requestVersion !== adapterRequestVersion) return
      if (defaults) {
        form.adapter_config = JSON.stringify(defaults, null, 2)
        productKey.value = (defaults.productKey as string) || ''
      }
    } else {
      // 编辑模式且已有 adapter_config，仅同步 productKey
      try {
        const config = JSON.parse(form.adapter_config || '{}')
        productKey.value = config.productKey || ''
      } catch {
        productKey.value = ''
      }
    }
  }

  /**
   * 填充 XNC 映射配置模板
   */
  const fillMappingTemplate = (form: ChannelFormData) => {
    form.mapping_config = JSON.stringify(XNC_MAPPING_TEMPLATE, null, 2)
  }

  /**
   * 打开新增通道弹窗
   */
  const handleAddTunnel = (form: ChannelFormData) => {
    isEditing.value = false
    editingId.value = ''
    productKey.value = ''
    Object.assign(form, createInitialChannelForm())
    showTunnelDialog.value = true
  }

  /**
   * 打开编辑通道弹窗
   */
  const handleEditTunnel = (form: ChannelFormData, channel: ChannelListItem) => {
    const fullChannel = channelStore.getChannelById(channel.id)
    if (!fullChannel) return

    isEditing.value = true
    editingId.value = channel.id

    form.id = channel.id
    form.name = channel.name
    form.description = fullChannel.description || ''
    form.enabled = channel.enabled
    form.protocol = channel.protocol
    // 根据协议解析 host 和 port（HTTP 从 endpoint 解析，参考 channels store 的 mapChannelToListItem）
    if (fullChannel.protocol === 'http') {
      try {
        const url = new URL(fullChannel.connection.endpoint || '')
        form.host = url.hostname
        form.port = parseInt(url.port) || (url.protocol === 'https:' ? 443 : 80)
      } catch {
        form.host = fullChannel.connection.endpoint || ''
        form.port = 80
      }
    } else {
      form.host = fullChannel.connection.broker || fullChannel.connection.remote_host || ''
      form.port = fullChannel.connection.port || fullChannel.connection.remote_port || 1883
    }
    form.username = fullChannel.connection.username || ''
    form.password = ''
    form.client_id = fullChannel.connection.client_id || ''
    form.topic = fullChannel.connection.topic || ''
    form.qos = fullChannel.connection.qos || 0
    form.keepalive = fullChannel.connection.keepalive || 60
    form.clean_session = fullChannel.connection.clean_session ?? true
    form.adapter = fullChannel.adapter.adapter || 'standard'
    form.adapter_config = JSON.stringify(fullChannel.adapter.config || {}, null, 2)
    form.command_topic = fullChannel.connection.command_topic || ''
    form.publish_mode = fullChannel.connection.publish_mode || 'single'
    form.command_timeout = fullChannel.connection.command_timeout || 30
    form.local_port = fullChannel.connection.local_port || 8888
    form.remote_host = fullChannel.connection.remote_host || '127.0.0.1'
    form.remote_port = fullChannel.connection.remote_port || 9000
    form.reconnect_interval = fullChannel.connection.reconnect_interval || 5
    form.mapping_config = JSON.stringify(fullChannel.adapter.mapping_config || {}, null, 2)
    form.endpoint = fullChannel.connection.endpoint || ''
    form.method = fullChannel.connection.method || 'POST'
    form.headers = JSON.stringify(fullChannel.connection.headers || fullChannel.adapter.headers || {}, null, 2)
    form.timeout = fullChannel.connection.timeout || 30
    form.immediate_upload = fullChannel.upload_strategy?.immediate_upload ?? true
    form.batch_size = fullChannel.upload_strategy?.batch_size ?? 100
    form.interval = fullChannel.upload_strategy?.interval ?? 5
    form.retry_times = fullChannel.upload_strategy?.retry_times ?? 3
    form.retry_interval = fullChannel.upload_strategy?.retry_interval || 5
    form.tags = (fullChannel.tags || []).join(', ')

    try {
      const config = JSON.parse(form.adapter_config || '{}')
      productKey.value = config.productKey || ''
    } catch {
      productKey.value = ''
    }

    showTunnelDialog.value = true
  }

  /**
   * 构建提交用的 NorthChannelConfig
   */
  const buildChannelConfig = (form: ChannelFormData): NorthChannelConfig => {
    const connection: Record<string, unknown> = {}
    let adapterConfig: Record<string, unknown> = {}
    let adapterType = 'default'

    if (form.protocol === 'mqtt') {
      connection.broker = form.host
      connection.port = form.port
      if (form.username) connection.username = form.username
      if (form.password) connection.password = form.password
      connection.client_id = form.client_id
      connection.topic = form.topic
      connection.qos = form.qos
      connection.keepalive = form.keepalive
      connection.clean_session = form.clean_session
      if (form.command_topic) connection.command_topic = form.command_topic
      if (form.publish_mode) connection.publish_mode = form.publish_mode
      if (form.command_timeout) connection.command_timeout = form.command_timeout

      adapterType = 'mqtt'
      if (form.adapter) {
        adapterConfig.adapter = form.adapter
      }
      try {
        const adapterConfigObj = JSON.parse(form.adapter_config)
        if (Object.keys(adapterConfigObj).length > 0) {
          adapterConfig.config = adapterConfigObj
        }
      } catch (e) {
        console.error('Invalid adapter config JSON:', e)
      }
    } else if (form.protocol === 'xnc') {
      connection.local_port = form.local_port
      connection.remote_host = form.remote_host
      connection.remote_port = form.remote_port
      connection.reconnect_interval = form.reconnect_interval

      adapterType = 'xnc_protobuf'
      try {
        const mappingConfig = JSON.parse(form.mapping_config)
        if (Object.keys(mappingConfig).length > 0) {
          adapterConfig.mapping_config = mappingConfig
        }
      } catch (e) {
        console.error('Invalid mapping config JSON:', e)
      }
    } else if (form.protocol === 'http') {
      connection.endpoint = form.endpoint
      connection.method = form.method
      connection.timeout = form.timeout
      if (form.username) connection.username = form.username
      if (form.password) connection.password = form.password
      try {
        const headers = JSON.parse(form.headers)
        if (Object.keys(headers).length > 0) {
          connection.headers = headers
        }
      } catch (e) {
        console.error('Invalid headers JSON:', e)
      }

      adapterType = 'http'
    }

    const config: NorthChannelConfig = {
      id: form.id,
      name: form.name,
      enabled: form.enabled,
      protocol: form.protocol,
      status: 'offline',
      connection: connection as NorthChannelConnection,
      adapter: {
        type: adapterType,
        ...adapterConfig
      },
      upload_strategy: {
        immediate_upload: form.immediate_upload,
        batch_size: form.batch_size,
        interval: form.interval,
        retry_times: form.retry_times,
        retry_interval: form.retry_interval
      }
    }

    if (form.description) {
      config.description = form.description
    }

    if (form.tags) {
      config.tags = form.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    }

    return config
  }

  /**
   * 保存通道（带重复提交防护）
   */
  const handleSaveTunnel = async (form: ChannelFormData) => {
    // 防止重复提交
    if (saving.value) return
    saving.value = true
    try {
      const config = buildChannelConfig(form)

      if (isEditing.value) {
        await channelStore.updateChannel(editingId.value, config)
        ElMessage.success(t('channels.channelUpdated'))
      } else {
        await channelStore.createChannel(config)
        ElMessage.success(t('channels.channelCreated'))
      }
      showTunnelDialog.value = false
    } catch (e: unknown) {
      const errorObj = e as { response?: { data?: { detail?: string } }; message?: string }
      const detail = errorObj?.response?.data?.detail || (e instanceof Error ? e.message : t('common.unknownError'))
      ElMessage.error(isEditing.value ? t('channels.updateFailed', { message: detail }) : t('channels.createFailed', { message: detail }))
    } finally {
      saving.value = false
    }
  }

  /**
   * 切换通道启用状态
   */
  const handleToggleTunnel = async (id: string) => {
    try {
      await channelStore.toggleChannel(id)
      ElMessage.success(t('channels.statusChanged'))
    } catch (e: unknown) {
      ElMessage.error(t('channels.operationFailed', { message: e instanceof Error ? e.message : t('common.unknownError') }))
    }
  }

  /**
   * 删除通道
   */
  const handleDeleteTunnel = async (channel: ChannelListItem, onDeleted: () => void) => {
    try {
      await ElMessageBox.confirm(
        t('channels.deleteConfirmMessage', { name: channel.name, id: channel.id }),
        t('channels.deleteConfirmTitle'),
        {
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
          type: 'warning',
          customClass: 'x-message-box'
        }
      )
      await channelStore.deleteChannel(channel.id)
      onDeleted()
      ElMessage.success(t('channels.channelDeleted'))
    } catch (e: unknown) {
      if (e !== 'cancel') {
        ElMessage.error(t('channels.deleteFailed', { message: e instanceof Error ? e.message : t('common.unknownError') }))
      }
    }
  }

  /**
   * 刷新通道列表
   */
  const handleRefresh = async () => {
    await channelStore.fetchChannels()
  }

  return {
    showTunnelDialog,
    isEditing,
    editingId,
    saving,
    protocolOptions,
    mqttAdapterOptions,
    productKey,
    handleProtocolChange,
    handleAdapterChange,
    fillMappingTemplate,
    handleAddTunnel,
    handleEditTunnel,
    handleSaveTunnel,
    handleToggleTunnel,
    handleDeleteTunnel,
    handleRefresh
  }
}
