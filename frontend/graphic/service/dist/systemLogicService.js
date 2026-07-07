import { t } from "./languages";
import request from "./request";
import systemService, { ServiceTypes, allServices } from "./systemService";
export class SystemLogicService {
    async addFlow(data) {
        try {
            return await request({
                baseURL: systemService.getBaseUrl(ServiceTypes.systemLogic),
                url: '/flow',
                method: 'post',
                data
            });
        }
        catch (error) {
            return Promise.reject({ code: 1, message: t('操作失败') });
        }
    }
    async importFlow(data) {
        try {
            return await request({
                baseURL: systemService.getBaseUrl(ServiceTypes.systemLogic),
                url: '/flow/import',
                method: 'post',
                data
            });
        }
        catch (error) {
            return Promise.reject({ code: 1, message: t('操作失败') });
        }
    }
    async noderedLogin() {
        try {
            return await request({
                baseURL: systemService.getBaseUrl(ServiceTypes.systemLogic),
                url: 'auth/token',
                method: 'post',
                data: {
                    "client_id": "node-red-admin",
                    "grant_type": "password",
                    "scope": "*",
                    "username": "admin1",
                    "password": "admin123"
                }
            });
        }
        catch (error) {
            return Promise.reject({ code: 1, message: t('操作失败') });
        }
    }
    async getflow(id) {
        try {
            return await request({
                baseURL: systemService.getBaseUrl(ServiceTypes.systemLogic),
                url: `/flow/${id}`,
                method: 'get',
            });
        }
        catch (error) {
            return Promise.reject({ code: 1, message: t('操作失败') });
        }
    }
    async deleteflow(id) {
        try {
            return await request({
                baseURL: systemService.getBaseUrl(ServiceTypes.systemLogic),
                url: `/flow/${id}`,
                method: 'delete',
            });
        }
        catch (error) {
            return Promise.reject({ error, code: 1, message: t('操作失败') });
        }
    }
    async editflow(id, data) {
        try {
            return await request({
                baseURL: systemService.getBaseUrl(ServiceTypes.systemLogic),
                url: `/flow/${id}`,
                method: 'put',
                data
            });
        }
        catch (error) {
            return Promise.reject({ error, code: 1, message: t('操作失败') });
        }
    }
    async getDevices(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.systemLogic),
            url: '/device?id=' + data.id + '&pageIndex=' + data.pageIndex + '&pageSize=' + data.pageSize + '&state=all'
        }).then(result => {
            return result;
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t("查询失败") });
        });
    }
    async getGateway() {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.systemLogic),
            url: '/gateway'
        }).then(result => {
            return result;
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t("查询失败") });
        });
    }
    async scanTags(nid) {
        nid = encodeURIComponent(nid);
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.systemLogic),
            url: '/tags?id=' + nid + '&pageIndex=0&pageSize=999&state=all'
        }).then(result => {
            return result;
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t("查询失败") });
        });
    }
    async scanAllTags(gid) {
        gid = encodeURIComponent(gid);
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.systemLogic),
            url: '/allTags?id=' + gid
        }).then(result => {
            return result;
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t("查询失败") });
        });
    }
    async getEleCalculation(url, data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.systemLogic),
            url: url,
            method: 'post',
            data: data
        }).then(result => {
            return result;
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t("查询失败") });
        });
    }
}
let systemLogicService = allServices.get(ServiceTypes.systemLogic);
if (!systemLogicService) {
    systemLogicService = new SystemLogicService();
    allServices.set(ServiceTypes.systemLogic, systemLogicService);
}
export default systemLogicService;
//# sourceMappingURL=systemLogicService.js.map