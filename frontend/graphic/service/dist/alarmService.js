import request from './request';
import systemService, { ServiceTypes, allServices } from './systemService';
import { t } from './languages';
export class AlarmService {
    async getUnAcknowledgeAlarmsCount() {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.alarm),
            url: 'untreated'
        }).then((result) => {
            return result.count;
        });
    }
    async getLatestAlarm() {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.alarm),
            url: 'latest'
        });
    }
    async acknowledgeAlarms(refList, message) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.alarm),
            url: 'ack',
            method: 'post',
            data: {
                PointRefs: refList,
                AcknowledgeMessage: message
            }
        }).then((result) => {
            return result;
        });
        ;
    }
    async discardAlarm(refList, message) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.alarm),
            url: 'discard',
            method: 'post',
            data: {
                PointRefs: refList,
                DiscardMessage: message
            }
        }).then((result) => {
            return result;
        }).catch((error) => {
            console.log("error:", error);
            return Promise.reject({ code: 1, message: t('操作失败') });
        });
    }
    async getPriortyCategory() {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.alarm),
            url: 'prioritystage',
            method: 'get',
        }).then((result) => {
            return result;
        });
    }
    async getAlarms(pdata) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.alarm),
            url: 'list',
            method: 'post',
            data: pdata
        }).then((result) => {
            return result;
        });
    }
    async getHistroy(pointRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.alarm),
            url: 'history?pointRef=' + pointRef,
            method: 'get',
        }).then((result) => {
            return result;
        });
    }
    async getAlarmAnnotation(alarmId) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.alarm),
            url: 'annotations?alarmId=' + alarmId,
            method: 'get',
        }).then((result) => {
            return result;
        });
    }
    async annotationAlarm(pdata) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.alarm),
            url: 'annotation',
            method: 'post',
            data: pdata
        }).then((result) => {
            return result;
        }).catch((error) => {
            console.log("error:", error);
            return Promise.reject({ code: 1, message: t('操作失败') });
        });
    }
    getAlarmTypeData() {
        let data = [];
        for (let e in AlarmType) {
            if (AlarmType.hasOwnProperty(e)) {
                data.push({
                    label: this.getAlarmTypeName(e),
                    value: e
                });
            }
        }
        return data;
    }
    getAlarmTypeName(type) {
        switch (type) {
            case AlarmType.EVENT_OUT_OF_RANGE:
                return t('超出范围');
            case AlarmType.EVENT_CHANGE_OF_VALUE:
                return t('值改变');
            case AlarmType.EVENT_CHANGE_OF_STATE:
                return t('状态改变');
            case AlarmType.EVENT_COMMAND_FAILURE:
                return t('命令失败');
            case AlarmType.EVENT_UNSIGNED_RANGE:
                return t('开关量超出范围');
            default:
                return '';
        }
    }
    getAlarmSourceData() {
        let data = [];
        for (let e in AlarmSource) {
            if (AlarmSource.hasOwnProperty(e)) {
                data.push({
                    label: this.getAlarmSourceName(e),
                    value: e
                });
            }
        }
        return data;
    }
    getAlarmSourceName(type) {
        switch (type) {
            case AlarmSource.SYSTEM_ALARM:
                return t('系统预警');
            case AlarmSource.DEVICE_ALARM:
                return t('硬件预警');
            default:
                return '';
        }
    }
    async setPriortyCategory(pdata) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.alarm),
            url: 'saveprioritystage',
            method: 'post',
            data: pdata
        })
            .then((result) => {
            return result;
        })
            .catch((error) => {
            console.log("error:", error);
            return Promise.reject({ code: 1, message: t('操作失败') });
        })
            .finally(() => {
        });
    }
}
let alarmService = allServices.get(ServiceTypes.alarm);
if (!alarmService) {
    alarmService = new AlarmService();
    allServices.set(ServiceTypes.alarm, alarmService);
}
var AlarmType;
(function (AlarmType) {
    AlarmType["EVENT_OUT_OF_RANGE"] = "EVENT_OUT_OF_RANGE";
    AlarmType["EVENT_CHANGE_OF_VALUE"] = "EVENT_CHANGE_OF_VALUE";
    AlarmType["EVENT_CHANGE_OF_STATE"] = "EVENT_CHANGE_OF_STATE";
    AlarmType["EVENT_COMMAND_FAILURE"] = "EVENT_COMMAND_FAILURE";
    AlarmType["EVENT_UNSIGNED_RANGE"] = "EVENT_UNSIGNED_RANGE";
})(AlarmType || (AlarmType = {}));
var AlarmSource;
(function (AlarmSource) {
    AlarmSource["SYSTEM_ALARM"] = "SYSTEM_ALARM";
    AlarmSource["DEVICE_ALARM"] = "DEVICE_ALARM";
})(AlarmSource || (AlarmSource = {}));
export default alarmService;
//# sourceMappingURL=alarmService.js.map