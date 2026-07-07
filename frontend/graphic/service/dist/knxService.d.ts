import { networkItem, VirtualPoint } from './networkService';
export declare class KNXService {
    createKnxGateway(data: VirtualPoint): Promise<unknown>;
    updateKnxGateway(data: VirtualPoint): Promise<unknown>;
    getKnxGatewayDetail(gatewayRef: String): Promise<unknown>;
    writeGroupValueList(data: any): Promise<unknown>;
    writeKnxValues(data: any): Promise<unknown>;
    getUIObjFromKnxValue(dptType: string, oriValue: string): Promise<unknown>;
    transformNumber(value: number): string;
    numberTypeDpt: string[];
    transformDptTypeToNumber(text: string): number;
    transformNumberToDptType(num: number): string;
    getAllDptTypes(): Promise<any[]>;
    getKnxPoints(gatewayRef: String): Promise<unknown>;
    UpdateKnxDptType(knxPointRef: String, newDptType: string): Promise<unknown>;
    createKnxNodes(gatewayRef: String, File: Blob): Promise<unknown>;
    reConnectKnxGateway(gatewayRef: String): Promise<unknown>;
    getKnxGatewayStatusList(): Promise<unknown>;
    importKnxDevicesByCsv(data: any): Promise<unknown>;
    getKnxChildren(reference: string, isGetParent?: Boolean): Promise<networkItem[]>;
    getKnxPointsByRefs(references: string[]): Promise<any[]>;
    getKNXValueText(dptType: string, text: string, allKnxType: any): Promise<string>;
    deleteGatewayCache(gatewayData: any): Promise<unknown>;
    getKnxDataByEquipRef(equipmentRef: string): Promise<any>;
    getEquipRefsByObjRef(objRef: string): Promise<string[]>;
}
declare const _default: KNXService;
export default _default;
