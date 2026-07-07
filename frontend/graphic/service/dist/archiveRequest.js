import axios from 'axios';
import systemService from './systemService';
const baseService = axios.create();
baseService.interceptors.request.use(preRequest, preRequestErr);
baseService.interceptors.response.use(onResponse, onResponseErr);
function preRequest(config) {
    const token = systemService.getAccessToken();
    if (token && config.headers) {
        config.headers['Authorization'] = 'Bearer ' + token;
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
export default baseService;
export function setArchiveRequestBaseUrl(url) {
    baseService.defaults.baseURL = url;
}
export async function useArchiveRequest(method, headers, url, data, pparams) {
    const params = {
        method: method || 'get'
    };
    if (headers) {
        params.headers = headers;
    }
    if (url) {
        params.url = url;
    }
    if (data) {
        params.data = data;
    }
    if (pparams) {
        params.params = pparams;
    }
    return baseService(params)
        .then((respose) => {
        if (respose?.successed) {
            return respose;
        }
        return Promise.reject({ code: 1, message: respose?.errorMessage, statusCode: respose?.statusCode });
    })
        .catch((error) => {
        return Promise.reject({ code: 1, message: error?.data, statusCode: error?.statusCode });
    })
        .finally(() => {
        //console.log("allways print finally...");
    });
}
//# sourceMappingURL=archiveRequest.js.map