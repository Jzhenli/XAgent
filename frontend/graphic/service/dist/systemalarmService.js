import request from './request';
import systemService, { ServiceTypes, allServices } from './systemService';
import { t } from './languages';
export class SystemAlarmService {
    async getFlowsByType(params) {
        try {
            return await request({
                baseURL: systemService.getBaseUrl(ServiceTypes.systemAlarm),
                url: 'getallbytype',
                params
            });
        }
        catch (error) {
            return Promise.reject({ code: 1, message: t('查询失败') });
        }
    }
    async getFlowsBySpaceType(params, filterType) {
        try {
            let result = await request({
                baseURL: systemService.getBaseUrl(ServiceTypes.systemAlarm),
                url: 'getbyspaceandtype',
                params
            });
            const username = systemService.currentUser?.userName;
            if (username != 'System' && username != 'XPlateformDev') {
                result = result.filter((item) => item.name.indexOf('xpf@ds_') == -1);
            }
            result = result.filter((item) => JSON.parse(item.rule).filter((rule) => rule.type == (filterType || 'tab')).length > 0);
            return result;
        }
        catch (error) {
            return Promise.reject({ code: 1, message: t('查询失败') });
        }
    }
    async getFlowById(id) {
        try {
            const result = await request({
                baseURL: systemService.getBaseUrl(ServiceTypes.systemAlarm),
                url: 'getbyid',
                params: { id }
            });
            return result;
        }
        catch (error) {
            return Promise.reject({ code: 1, message: t('查询失败') });
        }
    }
    async addFlow(data) {
        try {
            return await request({
                baseURL: systemService.getBaseUrl(ServiceTypes.systemAlarm),
                url: 'add',
                method: 'post',
                data
            });
        }
        catch (error) {
            return Promise.reject({ code: 1, message: t('操作失败') });
        }
    }
    async editFlow(data) {
        try {
            return await request({
                baseURL: systemService.getBaseUrl(ServiceTypes.systemAlarm),
                url: 'save',
                method: 'post',
                data
            });
        }
        catch (error) {
            return Promise.reject({ code: 1, message: t('操作失败') });
        }
    }
    async deleteFlow(id) {
        try {
            return await request({
                baseURL: systemService.getBaseUrl(ServiceTypes.systemAlarm),
                url: 'delete' + '?id=' + id,
                method: 'delete',
            });
        }
        catch (error) {
            return Promise.reject({ code: 1, message: t('操作失败') });
        }
    }
    async getUnAcknowledgeAlarmsCount(params) {
        try {
            return await request({
                baseURL: systemService.getBaseUrl(ServiceTypes.systemAlarm),
                url: 'getflowforspace',
                params
            });
        }
        catch (error) {
            return Promise.reject({ code: 1, message: t('查询失败') });
        }
    }
    async addAlarmRule(data) {
        try {
            return await request({
                baseURL: systemService.getBaseUrl(ServiceTypes.systemAlarm),
                url: 'addflow',
                method: 'post',
                data
            });
        }
        catch (error) {
            return Promise.reject({ code: 1, message: t('操作失败') });
        }
    }
    async deleteAlarmRule(data) {
        try {
            return await request({
                baseURL: systemService.getBaseUrl(ServiceTypes.systemAlarm),
                url: 'deleteflow',
                method: 'delete',
                data
            });
        }
        catch (error) {
            return Promise.reject({ code: 1, message: t('操作失败') });
        }
    }
    async editAlarmRule(data) {
        try {
            return await request({
                baseURL: systemService.getBaseUrl(ServiceTypes.systemAlarm),
                url: 'saveflow',
                method: 'post',
                data
            });
        }
        catch (error) {
            return Promise.reject({ code: 1, message: t('操作失败') });
        }
    }
}
let systemAlarmService = allServices.get(ServiceTypes.systemAlarm);
if (!systemAlarmService) {
    systemAlarmService = new SystemAlarmService();
    allServices.set(ServiceTypes.systemAlarm, systemAlarmService);
}
export default systemAlarmService;
//# sourceMappingURL=systemalarmService.js.map