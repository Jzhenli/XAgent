import type { NorthChannelProtocol } from '@/api/types'

/**
 * 通道表单数据结构（与 NorthChannelConfig 扁平化后的字段对应）
 */
export interface ChannelFormData {
  id: string
  name: string
  description: string
  enabled: boolean
  protocol: NorthChannelProtocol
  host: string
  port: number
  username: string
  password: string
  client_id: string
  topic: string
  qos: 0 | 1 | 2
  keepalive: number
  clean_session: boolean
  adapter: string
  adapter_config: string
  command_topic: string
  publish_mode: 'single' | 'batch'
  command_timeout: number
  local_port: number
  remote_host: string
  remote_port: number
  reconnect_interval: number
  mapping_config: string
  endpoint: string
  method: 'GET' | 'POST' | 'PUT'
  headers: string
  timeout: number
  immediate_upload: boolean
  batch_size: number
  interval: number
  retry_times: number
  retry_interval: number
  tags: string
}

/**
 * 协议选项配置
 */
export interface ProtocolOption {
  label: string
  value: NorthChannelProtocol
  defaultPort: number
  defaultConfig: Partial<ChannelFormData>
}

/**
 * MQTT 适配器选项
 */
export interface MqttAdapterOption {
  label: string
  value: string
  description: string
}

/**
 * 创建初始通道表单
 */
export const createInitialChannelForm = (): ChannelFormData => ({
  id: '',
  name: '',
  description: '',
  enabled: true,
  protocol: 'mqtt',
  host: '',
  port: 1883,
  username: '',
  password: '',
  client_id: `xagent_${Date.now()}`,
  topic: 'data/upload',
  qos: 1,
  keepalive: 60,
  clean_session: true,
  adapter: '',
  adapter_config: '{}',
  command_topic: '',
  publish_mode: 'single',
  command_timeout: 30,
  local_port: 8888,
  remote_host: '127.0.0.1',
  remote_port: 9000,
  reconnect_interval: 5,
  mapping_config: '{}',
  endpoint: '',
  method: 'POST',
  headers: '{}',
  timeout: 30,
  immediate_upload: true,
  batch_size: 100,
  interval: 5,
  retry_times: 3,
  retry_interval: 5,
  tags: ''
})
