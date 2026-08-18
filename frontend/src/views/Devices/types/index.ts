export interface DeviceFormData {
  asset: string
  name: string
  description: string
  enabled: boolean
  pluginName: string
  host: string
  port: number
  slave_id: number
  timeout: number
  interval: number
  // Modbus RTU 串口参数
  serial_port: string
  baudrate: number
  parity: string
  stopbits: number
  bytesize: number
  // KNX 参数
  gateway_ip: string
  local_ip: string
  connection_type: string
  sync_mode: string
  sync_interval: number
  // BACnet 参数
  device_id: number
  tags: string
}

export interface PointFormData {
  name: string
  description: string
  data_type: string
  standard_data_type: string
  unit: string
  enabled: boolean
  configJson: string
  metadataJson: string
  tags: string
  address: number
  register_type: 'holding' | 'input' | 'coil' | 'discrete_input'
  count: number
  scale: number | null
  offset: number | null
  byte_order: 'big' | 'little'
  word_order: 'big' | 'little'
  group_address: string
  status_address: string
  control_address: string
  writable: boolean
  object_type: string
  object_instance: number
  property: string
  alarm_high: number | null
  alarm_low: number | null
  min: number | null
  max: number | null
}

export interface WriteFormData {
  deviceAsset: string
  pointName: string
  pointType: 'analog' | 'digital' | ''
  unit: string
  currentValue: string
  value: string
  boolValue: boolean
}

/**
 * 各插件协议的默认配置，作为单一数据源在新增/编辑设备表单中复用。
 */
export const PLUGIN_DEFAULTS: Record<string, Record<string, any>> = {
  modbus_tcp: { host: '', port: 502, slave_id: 1, timeout: 5, interval: 1 },
  modbus_rtu: {
    serial_port: '/dev/ttyUSB0', baudrate: 9600, parity: 'N',
    stopbits: 1, bytesize: 8, slave_id: 1, timeout: 5, interval: 1
  },
  knx: {
    gateway_ip: '', local_ip: '', port: 3671, connection_type: 'automatic',
    interval: 1, sync_mode: 'smart', sync_interval: 60, timeout: 5
  },
  bacnet: { host: '', port: 47808, device_id: 1234, timeout: 5, interval: 5 }
}

/** 全量表单字段的默认值（与具体协议无关的部分已填好，协议相关部分由 PLUGIN_DEFAULTS 合并） */
const BASE_FORM_DEFAULTS: DeviceFormData = {
  asset: '',
  name: '',
  description: '',
  enabled: true,
  pluginName: 'modbus_tcp',
  host: '',
  port: 502,
  slave_id: 1,
  timeout: 5,
  interval: 1,
  serial_port: '/dev/ttyUSB0',
  baudrate: 9600,
  parity: 'N',
  stopbits: 1,
  bytesize: 8,
  gateway_ip: '',
  local_ip: '',
  connection_type: 'automatic',
  sync_mode: 'smart',
  sync_interval: 60,
  device_id: 1234,
  tags: ''
}

/** 创建空表单（默认 modbus_tcp 协议） */
export const createInitialDeviceForm = (pluginName: string = 'modbus_tcp'): DeviceFormData => {
  const pluginDefaults = PLUGIN_DEFAULTS[pluginName] || {}
  return {
    ...BASE_FORM_DEFAULTS,
    pluginName,
    ...pluginDefaults
  }
}

/**
 * 把插件配置、连接信息、标签等数据合并到表单中。
 * - protocolDefaults：协议自己的默认值（PLUGIN_DEFAULTS[pluginName]）
 * - config：         设备实际的 plugin.config（可能为空）
 * - connection：     设备连接信息（host/port/serial_port/baudrate）
 * - extra：          其他基础字段（asset/name/description/enabled/pluginName/tags）
 */
export interface PopulateFormOptions {
  pluginName: string
  config?: Record<string, unknown>
  connection?: { host?: string; port?: number; serial_port?: string; baudrate?: number }
  tags?: string[]
  asset?: string
  name?: string
  description?: string
  enabled?: boolean
}

export const populateDeviceForm = (form: DeviceFormData, opts: PopulateFormOptions): void => {
  const { pluginName, config = {}, connection = {}, tags = [], asset, name, description, enabled } = opts
  const protocolDefaults = PLUGIN_DEFAULTS[pluginName] || {}

  // 1. 先用基础默认值 + 协议默认值重置表单，确保无旧字段残留
  Object.assign(form, BASE_FORM_DEFAULTS, { pluginName }, protocolDefaults)

  // 2. 覆盖实际的业务字段
  if (asset !== undefined) form.asset = asset
  if (name !== undefined) form.name = name
  if (description !== undefined) form.description = description
  if (enabled !== undefined) form.enabled = enabled
  form.tags = tags.join(', ')

  // 3. 覆盖连接信息
  if (connection.host !== undefined) form.host = connection.host
  if (connection.port !== undefined) form.port = connection.port
  if (connection.serial_port !== undefined) form.serial_port = connection.serial_port
  if (connection.baudrate !== undefined) form.baudrate = connection.baudrate

  // 4. 用实际 config 覆盖
  for (const key of Object.keys(config)) {
    const value = config[key]
    if (value !== undefined && value !== null) {
      ;(form as Record<string, any>)[key] = value
    }
  }
}

export const createInitialPointForm = (pluginName: string = 'modbus_tcp'): PointFormData => ({
  name: '',
  description: '',
  data_type: pluginName === 'knx' ? 'switch' : pluginName === 'bacnet' ? 'analogInput' : 'uint16',
  standard_data_type: '',
  unit: '',
  enabled: true,
  configJson: '{}',
  metadataJson: '{}',
  tags: '',
  address: 0,
  register_type: 'holding',
  count: 1,
  scale: null,
  offset: null,
  byte_order: 'big',
  word_order: 'big',
  group_address: '',
  status_address: '',
  control_address: '',
  writable: false,
  object_type: 'analogInput',
  object_instance: 0,
  property: 'presentValue',
  alarm_high: null,
  alarm_low: null,
  min: null,
  max: null
})
