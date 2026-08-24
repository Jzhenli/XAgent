export interface PointInfo {
  deviceId: string
  deviceName: string
  service?: string
  pointId: string
  pointName: string
  unit: string
  description: string
}

export interface TriggerConfig {
  mode: string
  onLabel?: string
  offLabel?: string
  label?: string
}

export interface PopupPointBinding {
  id: string
  displayName: string
  pointInfo: PointInfo
  triggerConfig: TriggerConfig
}

export interface ConfigPopupParam {
  enablePopup: boolean
  popupTitle: string
  popupWidth: number
  popupHeight: number
  popupBgColor: string
  popupFontSize: number
  popupFontColor: string
  popupPointBindings: PopupPointBinding[]
}
