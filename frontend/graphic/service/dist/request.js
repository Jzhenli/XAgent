import axios from 'axios';
import systemService from './systemService';
import RequestPool from './RequestPool';
const baseService = axios.create();
baseService.interceptors.request.use(preRequest, preRequestErr);
baseService.interceptors.response.use(onResponse, onResponseErr);
function preRequest(config) {
    const token = systemService.getAccessToken();
    if (token && config.headers) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    const archive = systemService.getArchive();
    if (archive && config.headers) {
        config.headers['archiveName'] = archive;
    }
    if (config.headers) {
        if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json; charset=utf-8';
        }
    }
    return config;
}
function preRequestErr(error) {
    return Promise.reject(error);
}
function onResponse(response) {
    // const status = response.status;
    const res = response.data;
    return res;
}
function onResponseErr(error) {
    if (error.response) {
        const status = error.response.status;
        const res = error.response.data;
        if (status == 401) {
            systemService.logout();
        }
        return Promise.reject({ code: status, data: res });
    }
    return Promise.reject(error);
}
export default new RequestPool(baseService).request;
export function setBaseUrl(url) {
    baseService.defaults.baseURL = url;
}
//# sourceMappingURL=request.js.map