import request from "./request";
import systemService, { ServiceTypes, allServices } from './systemService';
export class CustomPageService {
    async listConfig() {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.customPageService),
            url: 'config/list',
        }).then((res) => {
            const ret = res.data;
            ret.forEach((item) => {
                item.id = item.id.toString();
            });
            return ret;
        }).catch(e => {
            return [];
        });
    }
    async saveConfig(config) {
        const url = config.id ? 'config/save' : 'config/add';
        const fd = this.getFormData(config);
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.customPageService),
            url: url,
            method: 'post',
            headers: { 'Content-Type': 'multipart/form-data' },
            data: fd,
        }).then((res) => {
            const data = res.data;
            return data?.id || config.id;
        });
    }
    getFormData(config) {
        const fd = new FormData();
        if (config.id !== undefined)
            fd.append('id', String(config.id));
        fd.append('entryName', config.entryName || '');
        fd.append('openType', String(config.openType ?? ''));
        fd.append('contentType', String(config.contentType ?? ''));
        if (config.contentUrl !== undefined)
            fd.append('contentUrl', config.contentUrl);
        if (config.entryType !== undefined)
            fd.append('entryType', String(config.entryType));
        if (config.entryPath !== undefined)
            fd.append('entryPath', config.entryPath);
        if (config.entryIcon !== undefined)
            fd.append('entryIcon', config.entryIcon);
        // append file if provided
        if (config.contentData instanceof File) {
            // backend should accept the field name 'contentData'
            fd.append('contentData', config.contentData, config.contentData.name);
        }
        return fd;
    }
    async deleteConfig(config) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.customPageService),
            url: 'config/delete',
            method: 'post',
            data: {
                id: config.id
            }
        }).then((res) => {
            if (res.success) {
                return true;
            }
            else {
                return false;
            }
        }).catch(err => {
            return false;
        });
    }
    async downloadContent(id) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.customPageService),
            url: `config/downloadContent/${id}`,
            responseType: 'blob',
        }).then((res) => {
            return res;
        });
    }
}
let customPageService = allServices.get(ServiceTypes.customPageService);
if (!customPageService) {
    customPageService = new CustomPageService();
    allServices.set(ServiceTypes.customPageService, customPageService);
}
export default customPageService;
//# sourceMappingURL=customPageService.js.map