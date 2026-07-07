import { BACnetClassId } from "./bacnetClassId";
import request from "./request";
import systemService, { ServiceTypes, allServices } from "./systemService";
export class NetworkService {
    async getChildren(reference) {
        return request({
            url: 'BuildingNetwork/GetNavView',
            params: {
                isGetParent: false,
                reference: reference
            }
        }).then((data) => {
            return networkService.formatNetworkData(data, reference);
        });
    }
    formatNetworkData(data, reference) {
        if (!data.data)
            return [];
        let result = systemService.currentUser?.userName === 'XPlateformDev' ? data.data : data.data.filter((item) => item?.reference !== 'XPlateform:System');
        if (reference == '$site') {
            return result;
        }
        result.sort((a, b) => {
            if (a.classId == b.classId) {
                return a.name.localeCompare(b.name);
            }
            else {
                return a.classId - b.classId;
            }
        });
        (reference?.startsWith("XPlateform:SystemPoint")) && result.sort((a, b) => {
            if (a.classId == BACnetClassId.Folder && b.classId != BACnetClassId.Folder) {
                return -1;
            }
            else if (a.classId != BACnetClassId.Folder && b.classId == BACnetClassId.Folder) {
                return 1;
            }
            return 0;
        });
        (reference?.startsWith("XPlateform:KNX/")) && result.sort((a, b) => {
            let aKnxAdress = a.reference?.split(':').filter((t) => !isNaN(Number(t)));
            let bKnxAdress = b.reference?.split(':').filter((t) => !isNaN(Number(t)));
            return Number(aKnxAdress[aKnxAdress.length - 1]) > Number(bKnxAdress[bKnxAdress.length - 1]) ? 1 : -1;
        });
        return result;
    }
    async getAncestors(reference) {
        return request({
            url: 'BuildingNetwork/GetNavView',
            params: {
                isGetParent: true,
                reference
            }
        }).then((data) => {
            return data.data;
        });
    }
    async addDeviceTags(data) {
        return request({
            url: 'BuildingNetwork/InsertThirdObjs',
            method: 'post',
            data: data
        }).then((data) => {
            return data.data;
        });
    }
    networkItemGetBuffer = [];
    networkItemQueryPromise = Promise.resolve(new Map());
    async getNetworkItem(reference) {
        if (this.networkItemGetBuffer.indexOf(reference) === -1) {
            this.networkItemGetBuffer.push(reference);
        }
        return Promise.resolve().then(() => {
            return this._startQueryNetworkItem();
        }).then(resultMap => resultMap.get(reference));
    }
    async _startQueryNetworkItem() {
        if (this.networkItemGetBuffer.length !== 0) {
            const tempBuffer = this.networkItemGetBuffer.concat([]);
            this.networkItemGetBuffer.splice(0, this.networkItemGetBuffer.length);
            this.networkItemQueryPromise = this.networkItemQueryPromise.then(() => {
                return request({
                    url: 'BuildingNetwork/GetViewDetailByRefs',
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    data: `"${tempBuffer.join(",")}"`,
                });
            }).then((data) => {
                const networkItemResultMap = new Map();
                data.data.forEach((item) => {
                    networkItemResultMap.set(item.reference, item);
                });
                return networkItemResultMap;
            });
        }
        return this.networkItemQueryPromise;
    }
    createFolder(data) {
        return request({
            url: 'BuildingNetwork/createFolder',
            method: 'post',
            data: data,
        });
    }
    systemObjectRefList = [
        "$site",
        "XPlateform:BACnet",
        "XPlateform:KNX",
        "XPlateform:Camera",
        "XPlateform:System",
        "XPlateform:HikVision",
        "XPlateform:System/$SystemTrends",
        "XPlateform:System/$SystemLogics",
        "XPlateform:System/$SystemSchedules",
        "XPlateform:System/$SystemEquipmentTemplates",
        "XPlateform:System/$SystemGraphicTemplates",
        "XPlateform:System/$SystemPopupTemplates",
        "XPlateform:System/$SystemDashboardTemplates",
        "XPlateform:System/$SystemDeviceTemplates",
        "XPlateform:API",
        "XPlateform:Modbus",
        "XPlateform:OPCUA",
        "XPlateform:SystemPoint"
    ];
}
/**
 * NetworkTree (在OCT中查询时可以指定特定archive)
 * 1. 获取某个节点的子节点, 参数为空即为获取根节点
 * 2. 获取某个reference对应的节点信息
 * 3. 获取某个节点的祖先节点(初始化需要选中特定节点时需要用到)
 * 4. 查询某个类型的节点的属性列表（是否为可绑定的属性） ————此接口移至pointDataService中
 */
let networkService = allServices.get(ServiceTypes.network);
if (!networkService) {
    networkService = new NetworkService();
    allServices.set(ServiceTypes.network, networkService);
}
export default networkService;
//# sourceMappingURL=networkService.js.map