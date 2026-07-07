export declare class SystemLogicService {
    addFlow(data: any): Promise<unknown>;
    importFlow(data: any): Promise<unknown>;
    noderedLogin(): Promise<unknown>;
    getflow(id: string): Promise<unknown>;
    deleteflow(id: string): Promise<unknown>;
    editflow(id: string, data: any): Promise<unknown>;
    getDevices(data: any): Promise<unknown>;
    getGateway(): Promise<unknown>;
    scanTags(nid: any): Promise<unknown>;
    scanAllTags(gid: any): Promise<unknown>;
    getEleCalculation(url: string, data: any): Promise<unknown>;
}
declare const _default: SystemLogicService;
export default _default;
