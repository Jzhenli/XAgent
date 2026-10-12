import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePointStore } from '@/stores/points'
import { useDeviceStore } from '@/stores/devices'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { PointConfig } from '@/api/types'
import type { PointDisplay } from '@/stores/points'
import type { PointFormData, WriteFormData } from '../types'
import { createInitialPointForm } from '../types'

export function usePointManagement(
  selectedDeviceAsset: ReturnType<typeof ref<string | null>>
) {
  const { t } = useI18n()
  const pointStore = usePointStore()
  const deviceStore = useDeviceStore()

  const showPointDialog = ref(false)
  const pointFormRef = ref()
  const isEditingPoint = ref(false)
  const editingPointName = ref('')
  const savingPoint = ref(false)

  const showWriteDialog = ref(false)
  const writing = ref(false)

  const modbusDataTypes = [
    { label: t('devices.modbus.uint16'), value: 'uint16' },
    { label: t('devices.modbus.int16'), value: 'int16' },
    { label: t('devices.modbus.uint32'), value: 'uint32' },
    { label: t('devices.modbus.int32'), value: 'int32' },
    { label: t('devices.modbus.float32'), value: 'float32' },
    { label: t('devices.modbus.float32Swap'), value: 'float32_swap' },
    { label: t('devices.modbus.float64'), value: 'float64' },
    { label: t('devices.modbus.uint64'), value: 'uint64' },
    { label: t('devices.modbus.int64'), value: 'int64' },
    { label: t('devices.modbus.bool'), value: 'bool' },
    { label: t('devices.modbus.string'), value: 'string' }
  ]

  // KNX DPT 分组选项:数据来自《KNX取值范围》文档(ETS 取值范围,191 个子类型),
  // label 为文档原文 "DPT-名称",value 为 DPT 编号(如 "5.001")。
  // 文档未收录的 DPT(如 12.x/16.x/17.x/18.x/19.x/232.x)由下拉 allow-create 手动输入;
  // 后端对未识别的 DPT 会回退 1.001 并打 warning。
  const knxDptGroups: Array<{ group: string; options: Array<{ label: string; value: string }> }> = [
    {
      group: '1.* 1-bit',
      options: [
        { label: '1.001-Switch', value: '1.001' },
        { label: '1.002-boolean', value: '1.002' },
        { label: '1.003-enable', value: '1.003' },
        { label: '1.004-ramp', value: '1.004' },
        { label: '1.005-alarm', value: '1.005' },
        { label: '1.006-binary value', value: '1.006' },
        { label: '1.007-step', value: '1.007' },
        { label: '1.008-up/down', value: '1.008' },
        { label: '1.009-open/close', value: '1.009' },
        { label: '1.010-start/stop', value: '1.010' },
        { label: '1.011-state', value: '1.011' },
        { label: '1.012-invert', value: '1.012' },
        { label: '1.013-dim send style', value: '1.013' },
        { label: '1.014-input source', value: '1.014' },
        { label: '1.015-reset', value: '1.015' },
        { label: '1.016-acknowledge', value: '1.016' },
        { label: '1.017-trigger', value: '1.017' },
        { label: '1.018-occupancy', value: '1.018' },
        { label: '1.019-window/door', value: '1.019' },
        { label: '1.021-logical function', value: '1.021' },
        { label: '1.022-scene', value: '1.022' },
        { label: '1.023-shutter/blinds mode', value: '1.023' },
        { label: '1.024-day/night', value: '1.024' },
        { label: '1.100-cooling/heating', value: '1.100' }
      ]
    },
    {
      group: '2.* 1-bit controlled',
      options: [
        { label: '2.001-switch control', value: '2.001' },
        { label: '2.002-boolean control', value: '2.002' },
        { label: '2.003-enable control', value: '2.003' },
        { label: '2.004-ramp control', value: '2.004' },
        { label: '2.005-alarm control', value: '2.005' },
        { label: '2.006-binary value control', value: '2.006' },
        { label: '2.007-step control', value: '2.007' },
        { label: '2.008-direction control 1', value: '2.008' },
        { label: '2.009-direction control 2', value: '2.009' },
        { label: '2.010-start control', value: '2.010' },
        { label: '2.011-state control', value: '2.011' },
        { label: '2.012-invert control', value: '2.012' }
      ]
    },
    {
      group: '3.* 3-bit controlled',
      options: [
        { label: '3.007-dimming control', value: '3.007' },
        { label: '3.008-blind control', value: '3.008' }
      ]
    },
    {
      group: '5.* 8-bit unsigned value',
      options: [
        { label: '5.001-percentage (0..100%)', value: '5.001' },
        { label: '5.003-angle (degrees)', value: '5.003' },
        { label: '5.004-percentage (0..255%)', value: '5.004' },
        { label: '5.005-ratio (0..255)', value: '5.005' },
        { label: '5.006-tariff (0..255)', value: '5.006' },
        { label: '5.010-counter pulses (0..255)', value: '5.010' },
        { label: '5.100-fan stage (0..255)', value: '5.100' }
      ]
    },
    {
      group: '6.* 8-bit signed value',
      options: [
        { label: '6.001-percentage (-128..127%)', value: '6.001' },
        { label: '6.010-counter pulses(-128..127)', value: '6.010' },
        { label: '6.020-status with mode', value: '6.020' }
      ]
    },
    {
      group: '7.* 2-byte unsigned value',
      options: [
        { label: '7.001-pulses', value: '7.001' },
        { label: '7.002-time(ms)', value: '7.002' },
        { label: '7.003-time(10 ms)', value: '7.003' },
        { label: '7.004-time(100 ms)', value: '7.004' },
        { label: '7.005-time(s)', value: '7.005' },
        { label: '7.006-time(min)', value: '7.006' },
        { label: '7.007-time(h)', value: '7.007' },
        { label: '7.010-property data type', value: '7.010' },
        { label: '7.011-length(mm)', value: '7.011' },
        { label: '7.012-current(mA)', value: '7.012' },
        { label: '7.013-brightness(lux)', value: '7.013' },
        { label: '7.600-absolute colour temperature(K)', value: '7.600' }
      ]
    },
    {
      group: '8.* 2-byte signed value',
      options: [
        { label: '8.001-pulse difference', value: '8.001' },
        { label: '8.002-time lag(ms)', value: '8.002' },
        { label: '8.003-time lag(10 ms)', value: '8.003' },
        { label: '8.004-time lag(100 ms)', value: '8.004' },
        { label: '8.005-time lag(s)', value: '8.005' },
        { label: '8.006-time lag(min)', value: '8.006' },
        { label: '8.007-time lag(h)', value: '8.007' },
        { label: '8.010-percentage difference(%)', value: '8.010' },
        { label: '8.011-rotation angle(°)', value: '8.011' },
        { label: '8.012-length(m)', value: '8.012' }
      ]
    },
    {
      group: '9.* 2-byte float value',
      options: [
        { label: '9.001-temperature (°C)', value: '9.001' },
        { label: '9.002-temperature difference (K)', value: '9.002' },
        { label: '9.003-kelvin/hour (K/h)', value: '9.003' },
        { label: '9.004-lux (Lux)', value: '9.004' },
        { label: '9.005-speed (m/s)', value: '9.005' },
        { label: '9.006-pressure (Pa)', value: '9.006' },
        { label: '9.007-humidity (%)', value: '9.007' },
        { label: '9.008-parts/million (ppm)', value: '9.008' },
        { label: '9.009-air flow (m*/h)', value: '9.009' },
        { label: '9.010-time (s)', value: '9.010' },
        { label: '9.011-time (ms)', value: '9.011' },
        { label: '9.020-voltage (mV)', value: '9.020' },
        { label: '9.021-current (mA)', value: '9.021' },
        { label: '9.022-power density (W/m²)', value: '9.022' },
        { label: '9.023-kelvin/percent (K/%)', value: '9.023' },
        { label: '9.024-power (kW)', value: '9.024' },
        { label: '9.025-volume flow (l/h)', value: '9.025' },
        { label: '9.026-rain amount (l/m²)', value: '9.026' },
        { label: '9.027-temperature (°F)', value: '9.027' },
        { label: '9.028-wind speed (km/h)', value: '9.028' },
        { label: '9.029-absolute humidity (g/m³)', value: '9.029' },
        { label: '9.030-concentration (ug/m³)', value: '9.030' },
        // { label: '9.031-coefficient', value: '9.031' }
      ]
    },
    {
      group: '10.* time',
      options: [
        { label: '10.001-time of day', value: '10.001' }
      ]
    },
    {
      group: '11.* date',
      options: [
        { label: '11.001-date', value: '11.001' }
      ]
    },
    {
      group: '13.* 4-byte signed value',
      options: [
        { label: '13.001-counter pulses(signed)', value: '13.001' },
        { label: '13.002-flow rate (m³/h)', value: '13.002' },
        { label: '13.010-active energy (Wh)', value: '13.010' },
        { label: '13.011-apparent energy (VAh)', value: '13.011' },
        { label: '13.012-reactive energy (VARh)', value: '13.012' },
        { label: '13.013-active energy (kWh)', value: '13.013' },
        { label: '13.014-apparent energy (kVAh)', value: '13.014' },
        { label: '13.015-reactive energy (kVARh)', value: '13.015' },
        { label: '13.016-active energy (MWh)', value: '13.016' },
        { label: '13.100-time lag (s)', value: '13.100' }
        // 注:文档中的 13.1200/13.1201 子号为 4 位,非标准 KNX DPT,
        // 后端格式校验(DPT_STRING_PATTERN,子号最多 3 位)会拒绝并回退 1.001,故不列出
      ]
    },
    {
      group: '14.* 4-byte float value',
      options: [
        { label: '14.000-acceleration (m/s²)', value: '14.000' },
        { label: '14.001-angular acceleration (rad/s²)', value: '14.001' },
        { label: '14.002-activation energy (J/mol)', value: '14.002' },
        { label: '14.003-radioactive activity(1/s)', value: '14.003' },
        { label: '14.004-amount of substance (mol)', value: '14.004' },
        { label: '14.005-amplitude', value: '14.005' },
        { label: '14.006-angle(radiant)', value: '14.006' },
        { label: '14.007-angle(degree)', value: '14.007' },
        { label: '14.008-angular momentum(Js)', value: '14.008' },
        { label: '14.009-angular velocity(rad/s)', value: '14.009' },
        { label: '14.010-area(m*m)', value: '14.010' },
        { label: '14.011-capacitance(F)', value: '14.011' },
        { label: '14.012-flux density(C/m²)', value: '14.012' },
        { label: '14.013-charge density(C/m³)', value: '14.013' },
        { label: '14.014-compressibility(m²/N)', value: '14.014' },
        { label: '14.015-conductance(S)', value: '14.015' },
        { label: '14.016-conductivity(S/m)', value: '14.016' },
        { label: '14.017-density (kg/m³)', value: '14.017' },
        { label: '14.018-electric charge(C)', value: '14.018' },
        { label: '14.019-electric current (A)', value: '14.019' },
        { label: '14.020-electric current density (A/m²)', value: '14.020' },
        { label: '14.021-electric dipole moment(Cm)', value: '14.021' },
        { label: '14.022-electric displacement(C/m²)', value: '14.022' },
        { label: '14.023-electric field strength (V/m)', value: '14.023' },
        { label: '14.024-electric flux(C)', value: '14.024' },
        { label: '14.025-electric flux density(C/m²)', value: '14.025' },
        { label: '14.026-electric polarization(C/m²)', value: '14.026' },
        { label: '14.027-electric potential(V)', value: '14.027' },
        { label: '14.028-electric potential difference(V)', value: '14.028' },
        { label: '14.029-electromagnetic moment(Am²)', value: '14.029' },
        { label: '14.030-electromotive force(V)', value: '14.030' },
        { label: '14.031-energy(J)', value: '14.031' },
        { label: '14.032-force(N)', value: '14.032' },
        { label: '14.033-frequency(Hz)', value: '14.033' },
        { label: '14.034-angular frequency(rad/s)', value: '14.034' },
        { label: '14.035-heat capacity(J/K)', value: '14.035' },
        { label: '14.036-heat flow rate(W)', value: '14.036' },
        { label: '14.037-heat quantity', value: '14.037' },
        { label: '14.038-impedance(Ω)', value: '14.038' },
        { label: '14.039-length(m)', value: '14.039' },
        { label: '14.040-light quantity(J)', value: '14.040' },
        { label: '14.041-luminance(cd/m²)', value: '14.041' },
        { label: '14.042-luminous flux (lm)', value: '14.042' },
        { label: '14.043-luminous intensity (cd)', value: '14.043' },
        { label: '14.044-magnetic field strength (A/m)', value: '14.044' },
        { label: '14.045-magnetic flux (Wb)', value: '14.045' },
        { label: '14.046-magnetic flux density (T)', value: '14.046' },
        { label: '14.047-magnetic moment (Am²)', value: '14.047' },
        { label: '14.048-magnetic polarization (T)', value: '14.048' },
        { label: '14.049-magnetization (A/m)', value: '14.049' },
        { label: '14.050-magnetomotive force (A)', value: '14.050' },
        { label: '14.051-mass (kg)', value: '14.051' },
        { label: '14.052-mass flux (kg/s)', value: '14.052' },
        { label: '14.053-momentum (N/s)', value: '14.053' },
        { label: '14.054-phase angle (rad)', value: '14.054' },
        { label: '14.055-phase angle (°)', value: '14.055' },
        { label: '14.056-power (W)', value: '14.056' },
        { label: '14.057-power factor (cos Φ)', value: '14.057' },
        { label: '14.058-pressure (Pa)', value: '14.058' },
        { label: '14.059-reactance (Ω)', value: '14.059' },
        { label: '14.060-resistance (Ω)', value: '14.060' },
        { label: '14.061-resistivity (Ωm)', value: '14.061' },
        { label: '14.062-self inductance (H)', value: '14.062' },
        { label: '14.063-solid angle (sr)', value: '14.063' },
        { label: '14.064-sound intensity (W/m²)', value: '14.064' },
        { label: '14.065-speed (m/s)', value: '14.065' },
        { label: '14.066-stress (Pa)', value: '14.066' },
        { label: '14.067-surface tension (N/m)', value: '14.067' },
        { label: '14.068-temperature (°C)', value: '14.068' },
        { label: '14.069-temperature absolute (K)', value: '14.069' },
        { label: '14.070-temperature difference (K)', value: '14.070' },
        { label: '14.071-thermal capacity (J/K)', value: '14.071' },
        { label: '14.072-thermal conductivity (W/mK)', value: '14.072' },
        { label: '14.073-thermoelectric power (V/K)', value: '14.073' },
        { label: '14.074-time (s)', value: '14.074' },
        { label: '14.075-torque (Nm)', value: '14.075' },
        { label: '14.076-volume (m³)', value: '14.076' },
        { label: '14.077-volume flux (m³/s)', value: '14.077' },
        { label: '14.078-weight (N)', value: '14.078' },
        { label: '14.079-work (J)', value: '14.079' },
        { label: '14.080-apparent power (VA)', value: '14.080' }
        // 注:文档中的 14.1200/14.1201 子号为 4 位,非标准 KNX DPT,同 13.x 组不列出
      ]
    },
    {
      group: '17.* scene number',
      options: [
        { label: '17.001-Scene number', value: '17.001' }
      ]
    },
    {
      group: '18.* scene control',
      options: [
        { label: '18.001-Scene control', value: '18.001' }
      ]
    },
    {
      group: '20.* 1-byte enum (HVAC/照明/遮阳等)',
      options: [
        { label: '20.001-SCLO mode', value: '20.001' },
        { label: '20.002-Building mode', value: '20.002' },
        { label: '20.003-Occupied', value: '20.003' },
        { label: '20.004-Priority', value: '20.004' },
        { label: '20.005-Light application mode', value: '20.005' },
        { label: '20.006-Light application area', value: '20.006' },
        { label: '20.007-Alarm class', value: '20.007' },
        { label: '20.008-PSU mode', value: '20.008' },
        { label: '20.011-System error class', value: '20.011' },
        { label: '20.012-HVAC error class', value: '20.012' },
        { label: '20.013-Time delay', value: '20.013' },
        { label: '20.014-Wind force scale (0..12)', value: '20.014' },
        { label: '20.017-Sensor mode', value: '20.017' },
        { label: '20.020-Actuator connect type', value: '20.020' },
        { label: '20.021-Cloud cover', value: '20.021' },
        { label: '20.022-Power return mode', value: '20.022' },
        { label: '20.100-Fuel type', value: '20.100' },
        { label: '20.101-Burner type', value: '20.101' },
        { label: '20.102-HVAC mode', value: '20.102' },
        { label: '20.103-DHW mode', value: '20.103' },
        { label: '20.104-Load priority', value: '20.104' },
        { label: '20.105-HVAC control mode', value: '20.105' },
        { label: '20.106-HVAC emergency mode', value: '20.106' },
        { label: '20.107-Changeover mode', value: '20.107' },
        { label: '20.108-Valve mode', value: '20.108' },
        { label: '20.109-Damper mode', value: '20.109' },
        { label: '20.110-Heater mode', value: '20.110' },
        { label: '20.111-Fan mode', value: '20.111' },
        { label: '20.112-Master/slave mode', value: '20.112' },
        { label: '20.113-Status room setpoint', value: '20.113' },
        { label: '20.114-Metering device type', value: '20.114' },
        { label: '20.115-Hum dehum mode', value: '20.115' },
        { label: '20.116-Enable H/C stage', value: '20.116' },
        { label: '20.120-ADA type', value: '20.120' },
        { label: '20.121-Backup mode', value: '20.121' },
        { label: '20.122-Start sync type', value: '20.122' },
        { label: '20.600-Behavior lock/unlock', value: '20.600' },
        { label: '20.601-Behavior bus power up/down', value: '20.601' },
        { label: '20.602-DALI fade time', value: '20.602' },
        { label: '20.603-Blink mode', value: '20.603' },
        { label: '20.604-Light control mode', value: '20.604' },
        { label: '20.605-PB switch mode', value: '20.605' },
        { label: '20.606-PB action mode', value: '20.606' },
        { label: '20.607-PB dimm mode', value: '20.607' },
        { label: '20.608-Switch on mode', value: '20.608' },
        { label: '20.609-Load type', value: '20.609' },
        { label: '20.610-Load type detection', value: '20.610' },
        { label: '20.611-Converter test control', value: '20.611' },
        { label: '20.801-SAB except behavior', value: '20.801' },
        { label: '20.802-SAB behavior on lock/unlock', value: '20.802' },
        { label: '20.803-SSSB mode', value: '20.803' },
        { label: '20.804-Blinds control mode', value: '20.804' }
        // 注:20.1000/20.1001/20.1002/20.1003(KNX RF 通信相关)子号为 4 位,
        // 超出后端 DPT 格式校验(子号最多 3 位),不列出
      ]
    },
    {
      group: '28.*',
      options: [
        { label: '28.001-Unicode UTF-8 String', value: '28.001' }
      ]
    }
  ]

  const bacnetDataTypes = [
    { label: t('devices.bacnet.analogInput'), value: 'analogInput' },
    { label: t('devices.bacnet.analogOutput'), value: 'analogOutput' },
    { label: t('devices.bacnet.analogValue'), value: 'analogValue' },
    { label: t('devices.bacnet.binaryInput'), value: 'binaryInput' },
    { label: t('devices.bacnet.binaryOutput'), value: 'binaryOutput' },
    { label: t('devices.bacnet.binaryValue'), value: 'binaryValue' },
    { label: t('devices.bacnet.multiStateInput'), value: 'multiStateInput' },
    { label: t('devices.bacnet.multiStateOutput'), value: 'multiStateOutput' },
    { label: t('devices.bacnet.multiStateValue'), value: 'multiStateValue' }
  ]

  const registerTypes = [
    { label: t('devices.registerType.holding'), value: 'holding' },
    { label: t('devices.registerType.input'), value: 'input' },
    { label: t('devices.registerType.coil'), value: 'coil' },
    { label: t('devices.registerType.discreteInput'), value: 'discrete_input' }
  ]

  const currentDevicePluginName = computed(() => {
    if (!selectedDeviceAsset.value) return ''
    const device = deviceStore.getDeviceByAsset(selectedDeviceAsset.value)
    return device?.plugin?.name || ''
  })

  const handleAddPoint = (form: PointFormData) => {
    if (!selectedDeviceAsset.value) return
    isEditingPoint.value = false
    editingPointName.value = ''
    Object.assign(form, createInitialPointForm(currentDevicePluginName.value))
    showPointDialog.value = true
  }

  const handleEditPoint = (point: PointDisplay, form: PointFormData) => {
    isEditingPoint.value = true
    editingPointName.value = point.name
    const config = point.config || {}
    const metadata = point.metadata || {}
    Object.assign(form, {
      name: point.name,
      description: point.description || '',
      data_type: point.data_type,
      standard_data_type: point.standard_data_type || '',
      unit: point.unit || '',
      enabled: point.enabled,
      configJson: JSON.stringify(config, null, 2),
      metadataJson: JSON.stringify(metadata, null, 2),
      tags: (point.tags || []).join(', '),
      address: config.address ?? 0,
      register_type: config.register_type || 'holding',
      count: config.count ?? 1,
      scale: config.scale ?? null,
      offset: config.offset ?? null,
      byte_order: config.byte_order || 'big',
      word_order: config.word_order || 'big',
      group_address: config.group_address || '',
      status_address: config.status_address || '',
      control_address: config.control_address || '',
      writable: config.writable ?? false,
      object_type: config.object_type || point.data_type || 'analogInput',
      object_instance: config.object_instance ?? 0,
      property: config.property || 'presentValue',
      alarm_high: metadata.alarm_high ?? null,
      alarm_low: metadata.alarm_low ?? null,
      min: metadata.min ?? null,
      max: metadata.max ?? null
    })
    showPointDialog.value = true
  }

  const buildPointConfig = (form: PointFormData): Record<string, unknown> => {
    const pluginName = currentDevicePluginName.value
    const config: Record<string, unknown> = {}
    
    if (pluginName === 'modbus_tcp' || pluginName === 'modbus_rtu') {
      config.address = form.address
      config.register_type = form.register_type
      config.count = form.count
      config.scale = form.scale
      config.offset = form.offset
      config.byte_order = form.byte_order
      config.word_order = form.word_order
    } else if (pluginName === 'knx') {
      config.group_address = form.group_address
      config.status_address = form.status_address || null
      config.control_address = form.control_address || null
      config.writable = form.writable
      config.scale = form.scale
      config.offset = form.offset
    } else if (pluginName === 'bacnet') {
      config.object_type = form.object_type
      config.object_instance = form.object_instance
      config.property = form.property
      config.scale = form.scale
      config.offset = form.offset
    }
    
    return config
  }

  const buildPointMetadata = (form: PointFormData): Record<string, unknown> => {
    const metadata: Record<string, unknown> = {}
    
    if (form.alarm_high !== null) {
      metadata.alarm_high = form.alarm_high
    }
    if (form.alarm_low !== null) {
      metadata.alarm_low = form.alarm_low
    }
    if (form.min !== null) {
      metadata.min = form.min
    }
    if (form.max !== null) {
      metadata.max = form.max
    }
    
    return metadata
  }

  const handleSavePoint = async (form: PointFormData) => {
    const config = buildPointConfig(form)
    const metadata = buildPointMetadata(form)

    savingPoint.value = true
    try {
      const asset = selectedDeviceAsset.value!
      if (isEditingPoint.value) {
        const updates: Record<string, unknown> = {
          description: form.description,
          data_type: form.data_type,
          unit: form.unit,
          enabled: form.enabled,
          config,
          metadata,
          tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
        }
        await pointStore.updatePoint(asset, editingPointName.value, updates)
        ElMessage.success(t('devices.pointUpdated'))
      } else {
        const point: PointConfig = {
          name: form.name,
          description: form.description || undefined,
          data_type: form.data_type,
          unit: form.unit || undefined,
          enabled: form.enabled,
          config,
          metadata,
          tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
        }
        await pointStore.addPoint(asset, point)
        ElMessage.success(t('devices.pointAdded'))
      }
      showPointDialog.value = false
    } catch (e: unknown) {
      const detail = (e as any)?.response?.data?.detail || (e instanceof Error ? e.message : t('common.unknownError'))
      ElMessage.error(isEditingPoint.value ? t('devices.updatePointFailed') + ': ' + detail : t('devices.addPointFailed') + ': ' + detail)
    } finally {
      savingPoint.value = false
    }
  }

  const handleDeletePoint = async (pointName: string) => {
    if (!selectedDeviceAsset.value) return
    try {
      await ElMessageBox.confirm(
        t('devices.deletePointConfirm', { name: pointName }),
        t('common.confirmDelete'),
        {
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
          type: 'warning',
          customClass: 'x-message-box'
        }
      )
      await pointStore.removePoint(selectedDeviceAsset.value!, pointName)
      ElMessage.success(t('devices.pointDeleted'))
    } catch (e: unknown) {
      if (e !== 'cancel') {
        ElMessage.error(t('common.deleteFailed') + ': ' + (e instanceof Error ? e.message : t('common.unknownError')))
      }
    }
  }

  const handleWritePoint = (point: PointDisplay, writeForm: WriteFormData) => {
    if (!selectedDeviceAsset.value) return
    const isDigital = point.type === 'digital' || point.standard_data_type === 'bool'
    writeForm.deviceAsset = selectedDeviceAsset.value
    writeForm.pointName = point.name
    writeForm.pointType = isDigital ? 'digital' : 'analog'
    writeForm.unit = point.unit || ''
    writeForm.currentValue = point.currentValue !== undefined && point.currentValue !== null
      ? String(point.currentValue)
      : '--'
    writeForm.value = ''
    writeForm.boolValue = point.currentValue === true || point.currentValue === 1
    showWriteDialog.value = true
  }

  const handleWriteSubmit = async (writeForm: WriteFormData) => {
    writing.value = true
    try {
      let value: number | boolean | string
      if (writeForm.pointType === 'digital') {
        value = writeForm.boolValue
      } else {
        const numVal = Number(writeForm.value)
        if (writeForm.value.trim() !== '' && !isNaN(numVal)) {
          value = numVal
        } else {
          value = writeForm.value
        }
      }

      const result = await pointStore.writePoint(
        writeForm.deviceAsset,
        writeForm.pointName,
        value
      )

      if (result.success) {
        ElMessage.success(result.message)
        showWriteDialog.value = false
      } else {
        ElMessage.error(result.message)
      }
    } catch (e: unknown) {
      ElMessage.error(t('devices.writeFailed') + ': ' + (e instanceof Error ? e.message : t('common.unknownError')))
    } finally {
      writing.value = false
    }
  }

  return {
    showPointDialog,
    pointFormRef,
    isEditingPoint,
    editingPointName,
    savingPoint,
    showWriteDialog,
    writing,
    modbusDataTypes,
    knxDptGroups,
    bacnetDataTypes,
    registerTypes,
    currentDevicePluginName,
    handleAddPoint,
    handleEditPoint,
    handleSavePoint,
    handleDeletePoint,
    handleWritePoint,
    handleWriteSubmit
  }
}
