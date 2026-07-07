import request from "./request";
import systemService, { ServiceTypes, allServices } from "./systemService";
import { t } from './languages';
export class SystemLogService {
    async getLogs(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.systemLog),
            url: 'SystemLog/SearchLogs',
            method: 'post',
            data: data
        }).then((result) => {
            if (result.statusCode == 200) {
                if (result.data && result.data.logs)
                    result.data.logs.forEach((e) => {
                        e.actionCategory = ActionCategory[e.actionCategory]();
                        e.actionOperType = ActionOperType[e.actionOperType]();
                    });
                return Promise.resolve(result.data);
            }
            else if (result.statusCode == 1019) {
                return Promise.reject({ code: 2, message: t("查询数据过多，请修改筛选条件后重试") });
            }
            return Promise.reject({ code: 4, message: t("查询失败") });
        })
            .catch((error) => {
            if (error.code == 2) {
                return Promise.reject(error);
            }
            return Promise.reject({ code: 5, message: t("查询失败") });
        });
    }
    getActionCategoryData() {
        let data = [];
        for (let e in ActionCategory) {
            if (ActionCategory.hasOwnProperty(e)) {
                data.push({
                    label: ActionCategory[e](),
                    value: e
                });
            }
        }
        return data;
    }
    getActionOperTypeData() {
        let data = [];
        for (let e in ActionOperType) {
            if (ActionOperType.hasOwnProperty(e)) {
                data.push({
                    label: ActionOperType[e](),
                    value: e
                });
            }
        }
        return data;
    }
}
const ActionCategory = {
    "Trend": () => t("趋势分析"),
    "Schedule": () => t("计划任务"),
    "Object": () => t("对象管理"),
    "Xct": () => t("存档管理"),
    "System": () => t("系统设置"),
    "Space": () => t("空间配置"),
    "Alarm": () => t("逻辑"),
    "User": () => t("用户管控"),
    "Energy": () => t("能碳管理"),
    // "Template": t("模板管理"),
    "EquipmentTemplate": () => t("设备模板"),
    "Equipment": () => t("设备"),
    "Layout": () => t("展示方案"),
    "UDPRouter": () => t("网络设置"),
    "KNX": () => t("灯控"),
    "Modbus": () => "Modbus",
    "OPCUA": () => "OPCUA",
};
const ActionOperType = {
    "login": () => t("登录"),
    "add": () => t("新增"),
    "update": () => t("编辑"),
    "delete": () => t("删除"),
    // "init": t("初始化"),
    // "add/update": t("新增并编辑")
};
let systemLogService = allServices.get(ServiceTypes.systemLog);
if (!systemLogService) {
    systemLogService = new SystemLogService();
    allServices.set(ServiceTypes.systemLog, systemLogService);
}
export default systemLogService;
//# sourceMappingURL=systemLogService.js.map