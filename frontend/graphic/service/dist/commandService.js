import { BACnetPropertyType } from "./bacnetPropertyType";
import request from "./request";
import systemService, { ServiceTypes, allServices } from "./systemService";
import networkService from "./networkService";
import { t } from './languages';
const commandApi = "BACnetCommandAPI";
const deviceApi = "BACnetDeviceAPI";
const objectApi = "BACnetObjectAPI";
export class CommandService {
    async getAvailablePresentValueRange(reference) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.command),
            url: `${objectApi}/GetPresentDataRange`,
            method: 'get',
            params: {
                partialRef: reference
            }
        });
    }
    async getObjectCurrentCommandPriority(reference) {
        return this.getObjectRealtimeProperty(reference, BACnetPropertyType.propCurrentCommandPriority)
            .then(result => {
            return parseInt(result);
        });
    }
    async getObjectRealtimeProperty(reference, propertyId) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.command),
            url: `${objectApi}/ReadProperty`,
            params: {
                partialRef: reference,
                pid: propertyId,
            }
        }).then((result) => {
            if (result.ack === "true") {
                return result.value;
            }
            else {
                return Promise.reject("ack false");
            }
        });
    }
    async sendCommandSetPresentValue(reference, value, priority) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.command),
            url: `${commandApi}/SetPresentValue`,
            method: 'post',
            data: {
                reference,
                value,
                priority
            }
        });
    }
    async sendCommandReleaseAll(reference, priority) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.command),
            url: `${commandApi}/ReleaseAll`,
            method: 'post',
            data: {
                reference,
                priority
            }
        });
    }
    async delObjectByPatrialRef(partialRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.command),
            url: `${objectApi}/DelObjectByPatrialRef`,
            method: 'post',
            params: {
                partialRef
            }
        });
    }
    async discoverDevices() {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.command),
            url: `${deviceApi}/DiscoverDevices`,
            method: 'post'
        }).then(async (result) => {
            let list = [];
            const keys = Object.keys(result);
            for (let i = 0; i < keys.length; i++) {
                const parts = result[keys[i]].split(":");
                list.push({
                    name: keys[i],
                    ip: parts[0],
                    port: parts[1],
                    type: parts[2],
                    id: parts[3],
                    isExist: false,
                    active: false
                });
            }
            list = list.sort((a, b) => this.ipToNumber(a.ip) - this.ipToNumber(b.ip));
            let data = await networkService.getChildren('XPlateform:BACnet');
            data.forEach((e) => {
                list.forEach(el => {
                    if (e.reference.split("-")[1] == el.id) {
                        el.isExist = true;
                    }
                });
            });
            return list;
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t('查询失败') });
        });
    }
    ipToNumber(ip) {
        return ip.split('.').reduce((acc, octet) => acc * 256 + Number(octet), 0);
    }
    async getDiscoverResult() {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.command),
            url: `${deviceApi}/GetDiscoverResult`,
            method: 'post'
        });
    }
    async getPointStatus() {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.command),
            url: `${deviceApi}/GetPointStatus`,
            method: 'post'
        }).then(result => {
            return result;
        });
    }
    async mapDevice(ipaddress, instance) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.command),
            url: `${deviceApi}/MapDevice`,
            method: 'post',
            params: {
                ipaddress,
                instance
            }
        }).then((result) => {
            if (!result.ack) {
                return Promise.reject();
            }
            else {
                return;
            }
        });
    }
    async syncObjProperties(partialRef, includeChild) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.command),
            url: `${objectApi}/SyncObjProperties`,
            params: {
                partialRef,
                includeChild: includeChild || false
            }
        }).then((result) => {
            if (!result.ack) {
                return Promise.reject();
            }
        });
    }
}
let commandService = allServices.get(ServiceTypes.command);
if (!commandService) {
    commandService = new CommandService();
    allServices.set(ServiceTypes.command, commandService);
}
export default commandService;
//# sourceMappingURL=commandService.js.map