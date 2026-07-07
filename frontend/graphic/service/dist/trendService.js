import { t } from "./languages";
import request from "./request";
import systemService, { ServiceTypes, allServices } from "./systemService";
export class TrendService {
    async getTrendInfoListByPoint(reference) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.trend),
            url: 'Trend/GetTrendRefsByPointRef?pointRef=' + reference,
            method: 'post',
        }).then((res) => {
            return res.data || [];
        });
    }
    async getTrendLogsByTrendRefs(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.trend),
            url: 'Trend/GetTrendLogsByTrendRefs',
            method: 'post',
            data: {
                objPartialRef: null,
                ...data
            }
        }).then((res) => {
            return res.data;
        });
    }
    async getTrendListByPoint(pointRef, options) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.trend),
            url: 'Trend/GetTrendLogsByPointRef',
            method: 'post',
            data: {
                objPartialRef: pointRef,
                ...options
            }
        }).then((result) => {
            return result.data;
        });
    }
    async getTrendByRef(trendRef, options) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.trend),
            url: 'Trend/GetTrendLogsByTrendRef',
            method: 'post',
            data: {
                objPartialRef: trendRef,
                ...options
            }
        }).then((result) => {
            return result.data;
        });
    }
    async listTrendStudyBySpaceRef(spaceRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.trend),
            url: 'Trend/GetTrendStudysDetailBySpaceRef',
            method: 'post',
            params: { spaceRef }
        }).then((result) => {
            if (result.statusCode === 200) {
                return result.data;
            }
        });
    }
    async getTrendStudyById(id, options) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.trend),
            url: 'Trend/GetTrendLogsByTSRef',
            method: 'post',
            data: {
                objPartialRef: id,
                ...options
            }
        }).then((result) => {
            return result.data;
        });
    }
    async getTrendStudyDetail(trendStudyRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.trend),
            url: 'Trend/GetTrendStudyDetail?trendStudyRef=' + trendStudyRef,
            method: 'post',
        }).then((result) => {
            return result.data;
        }).catch((error) => {
            return { code: 1, message: t("查询详情失败") };
        });
    }
    setJMode(bindingType, jMode) {
        let ret = null;
        if (bindingType == 'point') {
            switch (jMode) {
                case 'h':
                    ret = 1;
                    break;
                case 'd':
                    ret = 2;
                    break;
                case 'm':
                    ret = 4;
                    break;
                case 'y':
                    ret = 5;
                    break;
                default:
                    break;
            }
        }
        else {
            switch (jMode) {
                case 'h':
                    ret = 3;
                    break;
                case 'd':
                    ret = 2;
                    break;
                case 'm':
                    ret = 1;
                    break;
                case 'y':
                    ret = 0;
                    break;
                default:
                    break;
            }
        }
        return ret;
    }
    getJMode(bindingType, chartJMode) {
        let ret = null;
        if (bindingType == 'point') {
            switch (chartJMode) {
                case '1':
                    ret = 'h';
                    break;
                case '2':
                    ret = 'd';
                    break;
                case '4':
                    ret = 'm';
                    break;
                case '5':
                    ret = 'y';
                    break;
                default:
                    break;
            }
        }
        else {
            switch (chartJMode) {
                case '3':
                    ret = 'h';
                    break;
                case '2':
                    ret = 'd';
                    break;
                case '1':
                    ret = 'm';
                    break;
                case '0':
                    ret = 'y';
                    break;
                default:
                    break;
            }
        }
        return ret;
    }
    getTextTrendLogs(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.trend),
            url: 'Trend/GetTextTrendLogs',
            method: 'post',
            data
        }).then((result) => {
            return result.data;
        }).catch((error) => {
            return { code: 1, message: t("查询详情失败") };
        });
    }
}
let trendService = allServices.get(ServiceTypes.trend);
if (!trendService) {
    trendService = new TrendService();
    allServices.set(ServiceTypes.trend, trendService);
}
export default trendService;
//# sourceMappingURL=trendService.js.map