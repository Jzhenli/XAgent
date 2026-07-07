import networkService from "./networkService";
import request from "./request";
import systemService, { ServiceTypes, allServices } from './systemService';
import { t, i18nScope } from './languages';
export class KNXService {
    async createKnxGateway(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Knx/CreateKnxGateway',
            method: 'post',
            data: data
        });
    }
    async updateKnxGateway(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Knx/UpdateKnxGateway',
            method: 'post',
            data: data
        });
    }
    async getKnxGatewayDetail(gatewayRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Knx/KnxGatewayDetail',
            method: 'get',
            params: {
                gatewayRef: gatewayRef
            }
        });
    }
    async writeGroupValueList(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Knx/WriteGroupValueList',
            method: 'post',
            data
        });
    }
    async writeKnxValues(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Knx/WriteKnxValues',
            method: 'post',
            data
        });
    }
    async getUIObjFromKnxValue(dptType, oriValue) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Knx/GetUIObjFromKnxValue',
            method: 'post',
            data: {
                "dptType": dptType,
                "uiValues": [
                    {
                        "oriValue": oriValue,
                        "uiObj": null
                    }
                ]
            }
        });
    }
    transformNumber(value) {
        if (value < 10) {
            return '00' + value;
        }
        else if (value < 100) {
            return '0' + value;
        }
        else if (value < 1000) {
            return String(value);
        }
        else {
            return String(value);
        }
    }
    numberTypeDpt = ['5', '6', '7', '9', '8', '13', '14', '17'];
    transformDptTypeToNumber(text) {
        let main = text.split('.')[0];
        let child = text.split('.')[1];
        return Number(main + this.transformNumber(Number(child)));
    }
    transformNumberToDptType(num) {
        if (String(num).length >= 6) {
            return (num / 10000).toFixed(4);
        }
        else {
            return (num / 1000).toFixed(3);
        }
    }
    async getAllDptTypes() {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Knx/AllDptTypes',
            method: 'get'
        }).then((data) => {
            let allOption = [];
            data.data.forEach((main) => {
                if (main.mainTypeNumber == 6) {
                    main.subTypes = [main.subTypes[0], main.subTypes[1]];
                }
                main.text = main.text || '';
                main.showText = main.text || '';
                main.subTypes.forEach((item) => {
                    item.valueText = this.transformNumber(item.subTypeNumber);
                    allOption.push({
                        ...item,
                        value: main.mainTypeNumber + '.' + this.transformNumber(item.subTypeNumber),
                        mainType: main.mainTypeNumber,
                        showName: main.mainTypeNumber + '.' + this.transformNumber(item.subTypeNumber) + ' - ' + item.text
                    });
                });
            });
            allOption.forEach(item => {
                if (item.mainType == 10) {
                    item.fields[0].enumValues[0].value = 7;
                    item.fields[0].enumValues[7].value = 0;
                    const dayTranslate = [t("no day"), t("Monday"), t("Tuesday"), t("Wednesday"), t("Thursday"), t("Friday"), t("Saturday"), t("Sunday")];
                    const dayTranslateZH_CN = ["无日期", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天"];
                    item.fields[0].enumValues.forEach((enumValue) => {
                        enumValue.text = i18nScope.activeLanguage == 'zh-CN' ? dayTranslateZH_CN[dayTranslate.findIndex(t => t == enumValue.text)] : t(enumValue.text);
                    });
                }
            });
            return [data.data, allOption];
        });
        ;
    }
    async getKnxPoints(gatewayRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Knx/GetKnxPoints',
            method: 'get',
            params: {
                knxMiddleRef: gatewayRef
            }
        });
    }
    async UpdateKnxDptType(knxPointRef, newDptType) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Knx/UpdateKnxDptType',
            method: 'post',
            data: {
                "knxPointRef": knxPointRef,
                "newDptType": newDptType
            }
        });
    }
    async createKnxNodes(gatewayRef, File) {
        let fd = new FormData(); //声明formData()
        fd.append("File", File);
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Knx/CreateKnxNodes',
            headers: { "Content-Type": "multipart/form-data" },
            method: 'post',
            data: fd,
            params: {
                gatewayRef: gatewayRef
            }
        });
    }
    async reConnectKnxGateway(gatewayRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Knx/ReConnectKnxGateway',
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            data: JSON.stringify(gatewayRef)
        });
    }
    async getKnxGatewayStatusList() {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Knx/GetKnxGatewayStatusList',
            method: 'get'
        });
    }
    async importKnxDevicesByCsv(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Knx/ImportKnxDevicesByCsv',
            method: 'post',
            data
        });
    }
    async getKnxChildren(reference, isGetParent) {
        return request({
            url: 'BuildingNetwork/GetNavView',
            params: {
                isGetParent: isGetParent,
                reference: reference,
                includeSummary: true
            }
        }).then((data) => {
            if (isGetParent) {
                return (data.data || []);
            }
            else {
                return networkService.formatNetworkData(data, reference);
            }
        });
    }
    async getKnxPointsByRefs(references) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Knx/GetKnxPointsByRefs',
            data: references,
            method: 'post'
        }).then((data) => {
            return data.data;
        });
    }
    async getKNXValueText(dptType, text, allKnxType) {
        if (!dptType) {
            return text;
        }
        let currentVaule = '';
        let mainType = dptType.split('.')[0];
        if (mainType == '10' || mainType == '11' || mainType == '18') {
            let child = allKnxType[dptType].fields[0].enumValues;
            if (mainType == '10') {
                child[7].value = 0;
                child[0].value = null;
            }
            let res = await knxService.getUIObjFromKnxValue(dptType, text);
            mainType == '10' && (currentVaule = child.filter((t) => t.value == res.data?.uiValues[0]?.uiObj.dayOfWeek)[0].text + ',' + res.data?.uiValues[0]?.uiObj.timeOfDay);
            mainType == '11' && (currentVaule = res.data?.uiValues[0]?.uiObj.date.split(' ')[0]);
            mainType == '18' && (currentVaule = (res.data?.uiValues[0]?.uiObj.store ? 'Store' : 'Activate') + ',' + res.data?.uiValues[0]?.uiObj.sceneNumber);
        }
        else if (['1', '2', '3', '20', ...knxService.numberTypeDpt].indexOf(mainType) != -1) {
            currentVaule = text;
        }
        else {
            let res = await knxService.getUIObjFromKnxValue(dptType, text);
            currentVaule = res.data?.uiValues[0]?.uiObj || text;
        }
        return currentVaule;
    }
    async deleteGatewayCache(gatewayData) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/knx/DeleteGatewayCache',
            method: 'delete',
            params: gatewayData
        });
    }
    async getKnxDataByEquipRef(equipmentRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Knx/GetKnxDataByEquipRef',
            method: 'get',
            params: {
                equipmentRef
            }
        }).then((data) => {
            return data.data;
        });
    }
    async getEquipRefsByObjRef(objRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Knx/GetEquipRefsByObjRef',
            method: 'get',
            params: {
                objRef
            }
        }).then((data) => {
            return data.data;
        });
    }
}
let knxService = allServices.get(ServiceTypes.knx);
if (!knxService) {
    knxService = new KNXService();
    allServices.set(ServiceTypes.knx, knxService);
}
export default knxService;
//# sourceMappingURL=knxService.js.map