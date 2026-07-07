import { t } from "./languages";
import { BACnetClassId } from './bacnetClassId';
import request from './request';
import systemService, { ServiceTypes, allServices } from './systemService';
export var BasicValueTypes;
(function (BasicValueTypes) {
    BasicValueTypes["binary"] = "binary";
    BasicValueTypes["state"] = "state";
    BasicValueTypes["analog"] = "analog";
    BasicValueTypes["text"] = "text";
    BasicValueTypes["timestamp"] = "timestamp";
})(BasicValueTypes || (BasicValueTypes = {}));
export var MeterTemplateRef;
(function (MeterTemplateRef) {
    MeterTemplateRef["elec"] = "XPlateform:System/$SystemEquipmentTemplates:CONTAINER_CLASS-SystemPreset:EQUIPMENT-Consumption-Elec";
    MeterTemplateRef["water"] = "XPlateform:System/$SystemEquipmentTemplates:CONTAINER_CLASS-SystemPreset:EQUIPMENT-Consumption-Water";
    MeterTemplateRef["gas"] = "XPlateform:System/$SystemEquipmentTemplates:CONTAINER_CLASS-SystemPreset:EQUIPMENT-Consumption-Gas";
})(MeterTemplateRef || (MeterTemplateRef = {}));
export const MeterTemplateFolderRef = 'XPlateform:System/$SystemEquipmentTemplates:CONTAINER_CLASS-SystemPreset';
const equipmnetFolderRoot = 'XPlateform:System/$SystemEquipmentTemplates';
export class EquipmentService {
    // -------- 设备模板树相关 ----------
    // 查询某个folder下的所有内容，包括下级folder和设备模板
    async getFolderContent(reference) {
        if (!reference) {
            return this.getAncestors(equipmnetFolderRoot);
        }
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.equipment),
            url: 'template/getnavview',
            params: { reference }
        }).then((res) => {
            res.map((item) => {
                const initNames = [t('分户计费-燃气表'), t('分户计费-电表'), t('分户计费-水表'), t('系统预置模板')];
                if (item.reference.includes(MeterTemplateFolderRef)) {
                    item.name = t(item.name);
                }
            });
            res.sort((a, b) => {
                if (a.classId == BACnetClassId.Folder && b.classId != BACnetClassId.Folder) {
                    return -1;
                }
            });
            return res;
        });
    }
    // 查询某个folder的下级folder
    async getChildrenFolder(reference = equipmnetFolderRoot) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.equipment),
            url: 'template/getnavview',
            params: { reference }
        }).then((res) => {
            return res.filter((item) => item.classId === BACnetClassId.Folder);
        });
    }
    // 在指定folder下创建folder
    async createFolder(name, reference = equipmnetFolderRoot) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.equipment),
            url: 'template/createfolder',
            method: 'POST',
            data: { reference, name }
        });
    }
    // 修改folder名称
    async updateFolder(reference, name) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.equipment),
            url: 'template/updatefolder',
            method: 'POST',
            data: { reference, name }
        });
    }
    // 删除folder
    async deleteFolder(reference) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.equipment),
            url: 'template/deletefolder',
            method: 'DELETE',
            params: { reference }
        });
    }
    /**
     * 根据文件夹或模板的reference获取其所有祖先节点
     */
    async getAncestors(reference) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.equipment),
            url: 'template/folderpath',
            params: { reference }
        }).then((res) => {
            const result = res;
            return result.slice(2);
        });
    }
    // -------- 设备模板相关 ----------
    async listTemplatePointTypes() {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.equipment),
            url: 'template/equip/getallowpointtype'
        }).then((result) => {
            return result;
        });
    }
    // 查询某个folder下的所有设备模板
    async listTemplate(reference) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.equipment),
            url: 'template/getnavview',
            params: { reference }
        }).then((res) => {
            return res.filter((item) => item.classId === BACnetClassId.EquipmentTemplate);
        });
    }
    // 创建设备模板
    async createTemplate(reference, params) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.equipment),
            url: 'template/equip/add',
            method: 'POST',
            data: {
                ...params,
                reference,
            }
        }).then((res) => {
            return res;
        });
    }
    // 获取设备模板详情
    async getTemplateDetail(reference) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.equipment),
            url: 'template/equip/getbyref',
            method: 'POST',
            data: typeof reference == 'string' ? [reference] : reference
        }).then((data) => {
            data.forEach((item) => {
                const names = [t('表具读数'), t('固定比例'), t("使用时长"), t("自定义"), t("表具位置"), t("自动匹配关键字"), t("分摊方式")];
                if (item.reference.includes(MeterTemplateFolderRef)) {
                    item.points?.forEach((u) => {
                        u.name = t(u.name);
                    });
                    item.name = t(item.name);
                    item.uniqueAttributes?.forEach((u) => {
                        if (u.name == '自动匹配Key') {
                            u.name = '自动匹配关键字';
                        }
                        u.name = t(u.name);
                        let options = JSON.parse(u.options || '[]');
                        options.forEach((it) => {
                            it.label = t(it.label);
                        });
                        u.options = JSON.stringify(options);
                    });
                }
            });
            if (typeof reference == 'string') {
                return data[0];
            }
            return data;
        });
    }
    // 修改设备模板
    async updateTemplate(params) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.equipment),
            url: 'template/equip/save',
            method: 'POST',
            data: params
        });
    }
    // 删除设备模板
    async deleteTemplate(templateRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.equipment),
            url: 'template/delete',
            method: 'DELETE',
            params: { templateRef }
        });
    }
    // -------- 设备相关 ----------
    async listEquipmentBySpace(spaceRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.equipment),
            url: 'equipment/getbyspace',
            params: { spaceRef }
        }).then((res) => {
            return res;
        });
    }
    async getEquipmentDetail(reference) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.equipment),
            url: '/equipment/getbyref',
            params: { reference }
        }).then((data) => {
            return data;
        });
    }
    async createEquipment(spaceRef, equipmentTemplate) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.equipment),
            url: 'template/equip/instantiate',
            method: 'POST',
            data: { spaceRef, equipmentTemplate }
        }).then((res) => {
            return res.data;
        });
    }
    async updateEquipment(equipment) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.equipment),
            url: 'equipment/save',
            method: 'POST',
            data: equipment
        });
    }
    async deleteEquipment(reference) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.equipment),
            url: 'equipment/delete',
            method: 'DELETE',
            params: { reference }
        });
    }
    // 删除绑定点时bindingPointReference传入空字符串
    async updateEquipmentBindings(equipReference, pointsBindingMap) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.equipment),
            url: 'equipment/bindpoint',
            method: 'POST',
            data: { equipReference, pointsBindingMap }
        });
    }
    // 查询Equipment所在的Space
    async getSpaceByEquipment(equipRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.equipment),
            url: 'equipment/getspaceref',
            params: { equipRef }
        }).then((res) => {
            return res.data;
        });
    }
    // 查询Equipment所在的Space
    async updatepointlabel(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.equipment),
            url: 'equipment/updatepointlabel',
            data,
            method: 'post'
        });
    }
}
let equipmentService = allServices.get(ServiceTypes.equipment);
if (!equipmentService) {
    equipmentService = new EquipmentService();
    allServices.set(ServiceTypes.equipment, equipmentService);
}
export default equipmentService;
//# sourceMappingURL=equipmentService.js.map