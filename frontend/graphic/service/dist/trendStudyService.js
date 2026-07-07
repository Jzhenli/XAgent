import { t } from "./languages";
import request from "./request";
import systemService, { ServiceTypes, allServices } from "./systemService";
function formatItem(item) {
    let points = [];
    item.trendStudyPoints.map((i) => {
        points.push({
            id: i.pointReference,
            name: i.pointName,
            icon: 'origin-binary'
        });
    });
    return {
        id: item.trendStudyRef,
        name: item.trendStudyName,
        trendId: item.trendStudyRef,
        trendName: item.trendStudyName,
        // dateStart: item.startDate + ' ' + item.startTime,
        // dateEnd: item.endDate + ' ' + item.endTime,
        // timeInterval: [
        //     new Date(item.startDate + ' ' + item.startTime),
        //     new Date(item.endDate + ' ' + item.endTime)
        // ],
        // certification: [item.lable],
        subSystem: '',
        discription: item.trendStudyDes,
        points: points,
        trendStudyPoints: item.trendStudyPoints,
        trendDefQueCondition: item.trendDefQueCondition
    };
}
export class TrendStudyService {
    async getTrendListBySpace(spaceId) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.trendStudy),
            url: 'GetTrendStudysDetailBySpaceRef?spaceRef=' + spaceId,
            method: 'post',
        }).then((result) => {
            if (result.statusCode === 200) {
                return (result?.data ?? []).map((item) => {
                    return formatItem(item);
                });
            }
            return Promise.reject({ code: 1, message: result?.errorMessage });
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t("查询失败") });
        });
    }
    // 编辑
    async modifyTrendStudy(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.trendStudy),
            url: 'WriteTrendStudy',
            method: 'post',
            data: data
        }).then((result) => {
            if (result.statusCode === 200) {
                return result?.data || 0;
            }
            return Promise.reject({ code: 1, message: result?.errorMessage });
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t("操作失败") });
        });
    }
    // 新增
    async createTrendStudyWithSpace(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.trendStudy),
            url: 'CreateTrendStudyWithSpace',
            method: 'post',
            data: data
        }).then((result) => {
            if (result.statusCode === 200) {
                return result?.data || 0;
            }
            return Promise.reject({ code: 1, message: result?.errorMessage });
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t("操作失败") });
        });
    }
    // 删除
    async deleteTrendStudy(trendId) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.trendStudy),
            url: 'DeleteTrendStudy?trendStudyRef=' + trendId,
            method: 'delete',
        }).then((result) => {
            if (result.statusCode === 200) {
                return result?.data || 0;
            }
            return Promise.reject({ code: 1, message: result?.errorMessage });
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t("操作失败") });
        });
    }
}
let trendStudyService = allServices.get(ServiceTypes.trendStudy);
if (!trendStudyService) {
    trendStudyService = new TrendStudyService();
    allServices.set(ServiceTypes.trendStudy, trendStudyService);
}
export default trendStudyService;
//# sourceMappingURL=trendStudyService.js.map