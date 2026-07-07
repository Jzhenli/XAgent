import request from "./request";
import systemService, { ServiceTypes, allServices } from "./systemService";
import localforage from "localforage";
import { t } from './languages';
export var LayoutServiceType;
(function (LayoutServiceType) {
    LayoutServiceType[LayoutServiceType["Layout"] = 0] = "Layout";
    LayoutServiceType[LayoutServiceType["GraphicTemplate"] = 1] = "GraphicTemplate";
    LayoutServiceType[LayoutServiceType["DashboardTemplate"] = 2] = "DashboardTemplate";
    LayoutServiceType[LayoutServiceType["Graphic"] = 3] = "Graphic";
    LayoutServiceType[LayoutServiceType["Dashboard"] = 4] = "Dashboard";
    LayoutServiceType[LayoutServiceType["Chart"] = 5] = "Chart";
})(LayoutServiceType || (LayoutServiceType = {}));
export class LayoutService {
    async listLayoutBySpace(spaceRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Layout/ListLayoutBySpace',
            params: { spaceRef }
        }).then((res) => {
            return res.data;
        });
    }
    async validateResource(refList) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Layout/ValidateResource',
            method: 'post',
            data: { refList }
        }).then((res) => {
            const list = res.data;
            return list.filter((item) => item.isExist).map(item => item.oriRef);
        });
    }
    async createLayout(spaceRef, layout) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Layout/CreateLayout',
            method: 'post',
            data: { spaceRef, layout }
        }).then((res) => res.data);
    }
    async updateLayout(layout) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Layout/UpdateLayout',
            method: 'put',
            data: layout
        }).then((res) => res.data);
    }
    async deleteLayout(layoutRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Layout/DeleteLayout',
            method: 'delete',
            data: layoutRef
        }).then((res) => res.data);
    }
    async saveLayoutOrder(spaceRef, layoutRefList) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Layout/SortItemOrder',
            method: 'post',
            data: {
                parentRef: spaceRef,
                itemRefs: layoutRefList
            }
        }).then((res) => res.data);
    }
    async listResource(reference, resourceType) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Resource/ListResource',
            method: 'post',
            data: {
                reference,
                resourceType
            }
        }).then((res) => {
            return res.data;
        });
    }
    async createResource(parentRef, data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Resource/CreateResource',
            method: 'post',
            data: {
                parentRef,
                resourceItem: data
            }
        }).then((res) => {
            return res.data;
        });
    }
    async deleteItem(reference, type) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Common/DeleteItem',
            method: 'delete',
            data: {
                reference,
                type
            }
        }).then((res) => {
            return res.data;
        });
    }
    async deleteItems(references, isTemplate) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Common/DeleteItems',
            method: 'delete',
            data: {
                references,
                isTemplate
            }
        }).then((res) => {
            return res.data;
        });
    }
    async checkSpace(spaceRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Common/CheckSpace',
            method: 'get',
            params: {
                spaceRef
            }
        }).then((res) => {
            return res.data;
        });
    }
    async getResourceDetail(reference) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Resource/GetResourceDetail',
            params: {
                reference
            }
        }).then((res) => {
            return res.data;
        });
    }
    async updateResource(data) {
        delete data.lastUpdateTime;
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Resource/UpdateResource',
            method: 'put',
            data
        }).then((res) => {
            return res.data;
        });
    }
    async resourceSpaceInfo(reference, resourceType) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Resource/ResourceSpaceInfo',
            method: 'post',
            data: JSON.stringify([{ reference, resourceType }])
        }).then((res) => {
            return res.data;
        });
    }
    async getResListByTemplate(templateRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Resource/GetResListByTemplate',
            method: 'get',
            params: {
                templateRef
            }
        }).then((res) => {
            return res.data;
        });
    }
    GraphicFolderRoot = 'XPlateform:System/$SystemGraphicTemplates';
    DashboardFolderRoot = 'XPlateform:System/$SystemDashboardTemplates';
    // 创建模板
    async createTemplate(reference, params) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: '/Template/CreateTemplate',
            method: 'POST',
            data: {
                parentRef: reference,
                templateItem: params,
            }
        }).then((res) => {
            return res.data;
        });
    }
    // 获取模板详情
    async getTemplateDetail(reference) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: '/Template/GetTemplateDetail',
            params: { reference }
        }).then((data) => {
            return data;
        });
    }
    // 修改模板
    async updateTemplate(params) {
        delete params.lastUpdateTime;
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Template/UpdateTemplate',
            method: 'PUT',
            data: params
        });
    }
    // 模板列表
    async listTemplate(params) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Template/ListTemplate',
            method: 'GET',
            params: params
        });
    }
    // 删除模板
    async deleteTemplate(templateRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'template/delete',
            method: 'DELETE',
            params: { templateRef }
        });
    }
    // 获取能源配置列表
    async listEnergyLayout(id) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Common/ListItems',
            method: 'GET',
            params: {
                parentRef: id
            }
        }).then((result) => {
            return result.data;
        });
    }
    // 获取能源配置列表
    async deleteEnergyLayout(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Common/DeleteItem',
            method: 'DELETE',
            data
        });
    }
    // 新增能源配置
    async createEnergyLayout(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Common/CreateBaseItemWithBlob',
            method: 'POST',
            data
        });
    }
    // 修改能源配置
    async editEnergyLayout(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Common/UpdateBaseItemWithBlob',
            method: 'PUT',
            data
        });
    }
    // 查询能源配置详情
    async getEnergyLayoutDetail(id) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Common/GetBaseItemWithBlobDetail',
            method: 'get',
            params: {
                baseItemRef: id
            }
        });
    }
    // -------------------------- 3d 模型管理 -----------------------------
    modelDb = localforage.createInstance({
        name: 'cache3DModels'
    });
    model3DpathCache = new Map();
    modelCacheInited = false;
    init3dModelPromise = Promise.resolve();
    async list3DModels() {
        const layoutBaseUrl = systemService.getBaseUrl(ServiceTypes.layout);
        const ret = request({
            baseURL: layoutBaseUrl,
            url: 'Common/Get3DModels',
        }).then((res) => {
            if (res.statusCode == 200) {
                const ret = res.data.map((item) => {
                    this.model3DpathCache.set(item.name, { modelUrl: item.modelUrl, timestamp: new Date(item.lastWriteTime).getTime() });
                    return {
                        name: item.name,
                        thumbnail: layoutBaseUrl + '/' + item.previewImgUrl,
                    };
                });
                return ret;
            }
            else {
                throw 'error listing models';
            }
        });
        this.init3dModelPromise = ret;
        this.modelCacheInited = true;
        return ret;
    }
    async load3DModel(name) {
        if (!this.modelCacheInited) {
            this.list3DModels();
        }
        await this.init3dModelPromise;
        const layoutBaseUrl = systemService.getBaseUrl(ServiceTypes.layout);
        const m = await this.modelDb.getItem(name);
        const newTimestamp = this.model3DpathCache.get(name)?.timestamp;
        if (!m || (m && newTimestamp && newTimestamp > m.timestamp)) {
            return request({
                baseURL: layoutBaseUrl,
                url: this.model3DpathCache.get(name)?.modelUrl,
                responseType: 'arraybuffer'
            }).then((res) => {
                this.modelDb.setItem(name, { res, timestamp: newTimestamp });
                return res;
            });
        }
        else {
            return Promise.resolve(m.res);
        }
    }
    async set3DModels(params) {
        const formData = new FormData();
        formData.append('Name', params.name);
        // PreviewFile 如果本身是 File 或 Blob 可以直接添加
        formData.append('PreviewFile', params.PreviewFile);
        // ArrayBuffer 转 Blob
        const modelBlob = new Blob([params.ModelFile], { type: 'application/octet-stream' });
        formData.append('ModelFile', modelBlob, params.name + '.glb'); // 给文件名
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Common/Upload3DModel',
            method: 'post',
            headers: { 'Content-Type': 'multipart/form-data' },
            data: formData
        }).then((res) => {
            if (res.statusCode == 200) {
                return res.data;
            }
            else {
                throw 'error upload models';
            }
        }).catch(err => {
            return Promise.reject({ code: 1, message: t('操作失败') });
        });
    }
    async del3DModels(name) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.layout),
            url: 'Common/Delete3DModel',
            method: 'delete',
            params: {
                modelName: name,
            }
        }).then((res) => {
            if (res.statusCode == 200) {
                return res.data;
            }
            else {
                throw 'error delete models';
            }
        }).catch(err => {
            return Promise.reject({ code: 1, message: t('操作失败') });
        });
    }
}
let layoutService = allServices.get(ServiceTypes.layout);
if (!layoutService) {
    layoutService = new LayoutService();
    allServices.set(ServiceTypes.layout, layoutService);
}
export default layoutService;
//# sourceMappingURL=layoutService.js.map