/**
 * 原平台数据管理器存根基类（本地库逻辑已下线）
 *
 * 保留原因：外部包 @x-plateform/graphic-editor 的 GraphicRender 组件持有
 * manager 引用并可能调用以下方法（setDataModels / setModelBindings /
 * getTrendRef / on / off / dispatch 等），本类作为契约兼容层将它们全部
 * 实现为无副作用的空操作，保证 GraphicRender 正常运行。
 *
 * 真实的后端点位读值逻辑由子类 DataHandleManager 实现：
 * setPointBindings / dispose 之外的方法请勿添加业务实现。
 */
export default class DataManager {
  currentSpaceRef: string = ''

  dataModels: any[] = []

  modelBindings: any[] = []

  interval: number | null = null

  setDataModels(list: any[]) {}

  spaceEquipmentsPromise: Promise<any[]> = Promise.resolve([])

  async setPointBindings(
    list: [
      any | undefined,
      ((value: any, type?: any, translatedText?: string) => void) | undefined
    ][]
  ): Promise<any[]> {
    return []
  }

  setCurrentSpace(spaceRef?: string) {}

  async getCurrentSpaceEquipmentByName(name: string, templateRef: string) {
    return undefined
  }

  setModelBindings(list: any[]) {}

  pointTrendCache: Map<string, Promise<string>> = new Map()

  async getTrendRefByPointRef(pointRef: string) {
    return ''
  }

  async getTrendRef(list: (any | undefined)[]) {
    return []
  }

  async getTrendResult(
    list: (any | undefined)[],
    chartCondition: { jMode: number; dMode: number; startDate: Date; endDate: Date }
  ) {
    return []
  }

  subscribedPointMap: Map<string, ((value: any, type?: any, translatedText?: string) => void)[]> =
    new Map()

  async getEquipmentByDataModelBinding(binding: any) {
    return undefined
  }

  pointValidateCache = new Map<string, Promise<boolean>>()
  modelValidateCache = new Map<string, Promise<any | undefined>>()

  async validateBinding(
    binding?: any | { cpntId: number; innerName?: string; bindingType?: undefined }
  ): Promise<
    | undefined
    | 'networkPointLost'
    | 'equipmentReferenceLost'
    | 'equipmentPointUnbind'
    | 'equipmentPointBindingLost'
  > {
    return undefined
  }

  async validatePoint(pointRef: string) {
    return true
  }

  async getEquipmentByRef(modelRef: string): Promise<any | undefined> {
    return undefined
  }

  _eventCallback = new Map<String, any[]>()

  on(eventName: string, callback: any) {
    return () => {}
  }
  off(eventName: string, callback?: any) {}

  dispatch(eventName: string, event?: any, ...args: any[]) {}

  dispose() {}
}
