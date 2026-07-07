import request from "./request";
import systemService, { ServiceTypes, allServices } from "./systemService";
/**
 * 用于版本号查询，系统升级
 */
export class ServerConfigService {
    versionAvailable = false;
    getVersionsPromise = Promise.resolve();
    async getVersions(force = false) {
        if (force) {
            this.versionAvailable = false;
        }
        if (this.versionAvailable) {
            return this.getVersionsPromise;
        }
        this.getVersionsPromise = request({
            baseURL: systemService.getBaseUrl(ServiceTypes.serverConfig),
            url: 'systemversion/current',
            timeout: 5000,
        }).then(res => {
            this.versionAvailable = true;
            return res;
        }).catch(err => {
            this.versionAvailable = false;
            return Promise.reject(err);
        });
        return this.getVersionsPromise;
    }
    async updateVersion() {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.serverConfig),
            url: 'systemversion/update'
        });
    }
    async getIp() {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.serverConfig),
            url: 'Command/getIP'
        });
    }
    async setIp(ip, gateway, mask, broadcastAddress) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.serverConfig),
            url: 'Command/setIP',
            method: 'post',
            data: {
                ip, gateway, mask,
                broadcast_address: broadcastAddress
            }
        });
    }
}
let serverConfigService = allServices.get(ServiceTypes.serverConfig);
if (!serverConfigService) {
    serverConfigService = new ServerConfigService();
    allServices.set(ServiceTypes.serverConfig, serverConfigService);
}
export default serverConfigService;
//# sourceMappingURL=serverConfigService.js.map