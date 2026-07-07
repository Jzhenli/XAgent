export declare class OpcuaService {
    createOPCUAGateway(data: any): Promise<unknown>;
    updateOPCUAGateway(data: any): Promise<unknown>;
    getOPCUAGatewayDetail(gatewayRef: string): Promise<unknown>;
    createOPCUAFolder(data: any): Promise<unknown>;
    updateOPCUAFolder(data: string): Promise<unknown>;
    getObjDetail(data: string[]): Promise<unknown>;
    syncFolder(data: any): Promise<unknown>;
    authModeOpts: {
        label: string;
        value: string;
    }[];
    securityModeOpt: {
        label: string;
        value: string;
    }[];
    securityPolicyOpt: {
        label: string;
        value: string;
    }[];
    deleteOPCUAGatewayCache(params: any): Promise<unknown>;
    writeSingleValue(data: any): Promise<unknown>;
}
declare const _default: OpcuaService;
export default _default;
