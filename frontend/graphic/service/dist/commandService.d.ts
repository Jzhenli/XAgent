export type NetworkItem = {
    name: string;
    ip: string;
    port: number;
    type: string;
    id: number;
    isExist?: boolean;
    active?: boolean;
};
export declare class CommandService {
    getAvailablePresentValueRange(reference: string): Promise<unknown>;
    getObjectCurrentCommandPriority(reference: string): Promise<number>;
    getObjectRealtimeProperty(reference: string, propertyId: number): Promise<any>;
    sendCommandSetPresentValue(reference: string, value: string | number, priority: number): Promise<unknown>;
    sendCommandReleaseAll(reference: string, priority?: number): Promise<unknown>;
    delObjectByPatrialRef(partialRef: string): Promise<unknown>;
    discoverDevices(): Promise<NetworkItem[]>;
    ipToNumber(ip: any): any;
    getDiscoverResult(): Promise<unknown>;
    getPointStatus(): Promise<Record<string, number>>;
    mapDevice(ipaddress: string, instance: number): Promise<never>;
    syncObjProperties(partialRef: string, includeChild?: boolean): Promise<never>;
}
declare const _default: CommandService;
export default _default;
