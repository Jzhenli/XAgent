import { t } from "./languages";
import request from "./request";
import systemService, { ServiceTypes, allServices } from "./systemService";
export class AlarmLogicService {
    async addFlow(data) {
        try {
            return await request({
                baseURL: systemService.getBaseUrl(ServiceTypes.alarmLogic),
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
                baseURL: systemService.getBaseUrl(ServiceTypes.alarmLogic),
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
                baseURL: systemService.getBaseUrl(ServiceTypes.alarmLogic),
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
                baseURL: systemService.getBaseUrl(ServiceTypes.alarmLogic),
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
                baseURL: systemService.getBaseUrl(ServiceTypes.alarmLogic),
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
                baseURL: systemService.getBaseUrl(ServiceTypes.alarmLogic),
                url: `/flow/${id}`,
                method: 'put',
                data
            });
        }
        catch (error) {
            return Promise.reject({ error, code: 1, message: t('操作失败') });
        }
    }
}
let alarmLogicService = allServices.get(ServiceTypes.alarmLogic);
if (!alarmLogicService) {
    alarmLogicService = new AlarmLogicService();
    allServices.set(ServiceTypes.alarmLogic, alarmLogicService);
}
export default alarmLogicService;
//# sourceMappingURL=alarmLogicService.js.map