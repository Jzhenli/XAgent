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

export const createInitialDeviceForm = (): DeviceFormData => ({
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
})

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
