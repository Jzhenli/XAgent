/**
 * 用于版本号查询，系统升级
 */
export declare class ServerConfigService {
    versionAvailable: boolean;
    getVersionsPromise: Promise<any>;
    getVersions(force?: boolean): Promise<any>;
    updateVersion(): Promise<unknown>;
    getIp(): Promise<unknown>;
    setIp(ip: string, gateway: string, mask?: string, broadcastAddress?: string): Promise<unknown>;
}
declare const _default: ServerConfigService;
export default _default;
