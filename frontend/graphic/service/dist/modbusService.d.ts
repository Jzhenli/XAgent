import { VirtualPoint } from './networkService';
export declare class ModbusService {
    createModbusGateway(data: VirtualPoint): Promise<unknown>;
    updateModbusGateway(data: VirtualPoint): Promise<unknown>;
    getModbusGatewayDetail(gatewayRef: String): Promise<unknown>;
    getGateWayList(): Promise<unknown>;
    getXPointsByGatewayRef(gatewayRef: String): Promise<unknown>;
    batchInsertModbusPoints(gatewayRef: string, data: any): Promise<unknown>;
    getGateWayStatusList(): Promise<unknown>;
    writeModbus(data: any): Promise<unknown>;
    deleteGatewayCachebyModbus(gatewayData: any): Promise<unknown>;
    getRangeFromModbusType(valueType: string): {
        minValue: string;
        maxValue: number;
        integer: boolean;
    } | {
        minValue: number;
        maxValue: number;
        integer: boolean;
    } | {
        minValue: string;
        maxValue: string;
        integer?: undefined;
    } | {
        minValue: number;
        maxValue: string;
        integer: boolean;
    };
}
declare const _default: ModbusService;
export default _default;
