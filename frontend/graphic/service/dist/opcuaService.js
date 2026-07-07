import request from "./request";
import systemService, { ServiceTypes, allServices } from './systemService';
import { t } from './languages';
export class OpcuaService {
    async createOPCUAGateway(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/OPCUA/CreateGateway',
            headers: { 'Content-Type': 'multipart/form-data' },
            method: 'post',
            data: data
        });
    }
    async updateOPCUAGateway(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/OPCUA/UpdateGateway',
            headers: { 'Content-Type': 'multipart/form-data' },
            method: 'post',
            data: data
        });
    }
    async getOPCUAGatewayDetail(gatewayRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/OPCUA/GatewayDetail',
            method: 'get',
            params: { gatewayRef }
        });
    }
    async createOPCUAFolder(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/OPCUA/CreateFolder',
            method: 'post',
            data
        });
    }
    async updateOPCUAFolder(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/OPCUA/UpdateFolder',
            method: 'post',
            data
        });
    }
    async getObjDetail(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/OPCUA/GetObjDetail',
            method: 'post',
            data
        });
    }
    syncFolder(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/OPCUA/syncFolder',
            method: 'post',
            data
        });
    }
    authModeOpts = [{
            label: t("匿名访问"),
            value: "0",
        }, {
            label: t("用户名/密码"),
            value: "1",
        }, {
            label: t("证书"),
            value: "2",
        }];
    securityModeOpt = [{
            label: t("仅签名"),
            value: "2",
        }, {
            label: t("签名并加密"),
            value: "3",
        }];
    securityPolicyOpt = [{
            label: t("Basic128Rsa15（已弃用，仅用于兼容旧设备）"),
            value: "1",
        }, {
            label: t("Basic256（已弃用，仅用于兼容旧设备）"),
            value: "2",
        }, {
            label: t("Basic256Sha256（推荐，广泛支持"),
            value: "3",
        }, {
            label: t("Aes128Sha256RsaOaep"),
            value: "4",
        }, {
            label: t("Aes256_Sha256_RsaPss（最强安全策略） "),
            value: "5",
        }];
    deleteOPCUAGatewayCache(params) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/OPCUA/DeleteGatewayCache',
            method: 'delete',
            params
        });
    }
    writeSingleValue(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/OPCUA/WriteSingleValue',
            method: 'post',
            data
        });
    }
}
let opcuaService = allServices.get(ServiceTypes.opcua);
if (!opcuaService) {
    opcuaService = new OpcuaService();
    allServices.set(ServiceTypes.opcua, opcuaService);
}
export default opcuaService;
//# sourceMappingURL=opcuaService.js.map