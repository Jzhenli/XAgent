import { BACnetClassId } from "./bacnetClassId";
export type networkItem = {
    reference: string;
    name: string;
    type: string;
    classId: number;
    hasChild?: boolean;
};
export type VirtualAnalogPoint = {
    reference?: string;
    name: string;
    classId: BACnetClassId.SYSTEM_ANALOG_VALUE;
    description?: string;
    minValue?: number;
    maxValue?: number;
    unit?: string;
};
export type VirtualBinaryPoint = {
    reference?: string;
    name: string;
    classId: BACnetClassId.SYSTEM_BINARY_VALUE;
    description?: string;
    activeText?: string;
    inactiveText?: string;
};
export type VirtualMultiStatePoint = {
    reference?: string;
    name: string;
    classId: BACnetClassId.SYSTEM_MULTI_STATE_VALUE;
    description?: string;
    stateText?: string[];
};
export type VirtualPoint = VirtualAnalogPoint | VirtualBinaryPoint | VirtualMultiStatePoint;
export declare class NetworkService {
    getChildren(reference?: string): Promise<networkItem[]>;
    formatNetworkData(data: any, reference?: string): networkItem[];
    getAncestors(reference: string): Promise<networkItem[]>;
    addDeviceTags(data: any): Promise<networkItem[]>;
    networkItemGetBuffer: string[];
    networkItemQueryPromise: Promise<Map<string, networkItem>>;
    getNetworkItem(reference: string): Promise<networkItem>;
    _startQueryNetworkItem(): Promise<Map<string, networkItem>>;
    createFolder(data: any): Promise<unknown>;
    systemObjectRefList: string[];
}
declare const _default: NetworkService;
export default _default;
