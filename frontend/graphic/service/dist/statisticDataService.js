import systemService, { allServices, ServiceTypes } from "./systemService";
import request from "./request";
// import Data from "./statisticData";
import { t } from './languages';
export class StatisticDataService {
    async queryData(cdt) {
        let param = {
            spaceReferences: cdt.spaceRef,
            startDate: cdt.startDate,
            endDate: cdt.endDate,
            polymerizeMode: (cdt.jMode || cdt.jMode === 0) ? cdt.jMode : 4,
            filterTags: cdt.filterByTags,
            groupByTags: cdt.groupByTags
        };
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.digitalTag),
            url: 'energy/getsummarydata',
            method: 'post',
            data: param
        }).then((res) => {
            return res.data ? res.data : [];
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t('操作失败') });
        });
    }
    async queryTrend(cdt) {
        return new Promise((resolve, reject) => {
            this.queryData(cdt).then(data => {
                let trendData;
                if (data) {
                    trendData = data.map(e => {
                        return {
                            groupByTags: e.groupByTags,
                            data: e.detailData
                        };
                    });
                }
                else {
                    trendData = [];
                }
                resolve(trendData);
            }).catch((error) => {
                reject({ code: 1, message: t('操作失败') });
            });
        });
    }
    async addBusiness(businessInfo) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.digitalTag),
            url: 'consumption/business/add',
            method: 'POST',
            data: businessInfo
        }).then((res) => {
            if (res.code === 0) {
                return res.data ? res.data : null;
            }
            else {
                return Promise.reject({ code: 1, message: t('新增失败') });
            }
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t('新增失败') });
        });
    }
    async editBusiness(businessInfo) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.digitalTag),
            url: 'consumption/business/save',
            method: 'POST',
            data: businessInfo
        }).then((res) => {
            if (res.code === 0) {
                return res.data ? res.data : null;
            }
            else {
                return Promise.reject({ code: 1, message: t('操作失败') });
            }
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t('操作失败') });
        });
    }
    async delBusiness(businessId) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.digitalTag),
            url: 'consumption/business/del?businessId=' + businessId,
            method: 'DELETE',
        }).then((res) => {
            if (res.code === 0) {
                return res.data ? res.data : null;
            }
            else {
                return Promise.reject({ code: 1, message: t('删除失败') });
            }
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t('删除失败') });
        });
    }
    // 获取所有商户list
    async getBusinessData() {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.digitalTag),
            url: 'consumption/business/list',
            method: 'GET'
        }).then((res) => {
            return res.data ? res.data : [];
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t('操作失败') });
        });
    }
    //根据商户id获取商户详情和关联表具
    async getBusinessDetail(businessId) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.digitalTag),
            url: 'consumption/business/info?businessId=' + businessId,
            method: 'GET',
        }).then((res) => {
            let ret;
            if (res.data) {
                res.data.businessMeterMapInfoList.forEach((e) => {
                    e.mappingInfo = JSON.parse(e.mappingInfo);
                    if (e.allocationRatio) {
                        e.allocationRatio = this.toFixedNum(Number(e.allocationRatio * 100));
                    }
                });
                ret = {
                    ...res.data.businessBasicInfo,
                    meterList: res.data.businessMeterMapInfoList ? res.data.businessMeterMapInfoList : [],
                };
                if (ret.meterList.length > 0) {
                    ret.meterList.forEach((e) => {
                        res.data.meterBasicInfoList.forEach((el) => {
                            if (e.meterReference == el.meterReference) {
                                e['meterName'] = el.meterName;
                                e['location'] = el.location;
                                e['meterType'] = el.meterType;
                                e['allocationType'] = el.allocationType.toString();
                            }
                        });
                    });
                }
            }
            return ret ? ret : null;
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t('操作失败') });
        });
    }
    //增加分摊表具
    async addBuMeter(businessId, item) {
        let param = {
            meterReference: item.meterReference,
            allocationRatio: item.allocationRatio ? item.allocationRatio / 100 : item.allocationRatio,
            timingPoint: item.timingPoint,
            unbandDateTime: item.unbandDateTime,
            mappingInfo: JSON.stringify(item.mappingInfo)
        };
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.digitalTag),
            url: 'consumption/mapping/allocate',
            method: 'POST',
            data: {
                businessId,
                ...param,
                status: 0
            }
        }).then((res) => {
            if (res.code === 0) {
                return res.data ? res.data : null;
            }
            else {
                return Promise.reject({ code: 1, message: t('新增失败') });
            }
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t('新增失败') });
        });
    }
    //编辑分摊表具
    async editBuMeter(businessId, item) {
        let param = {
            meterReference: item.meterReference,
            allocationRatio: item.allocationRatio ? item.allocationRatio / 100 : item.allocationRatio,
            timingPoint: item.timingPoint,
            unbandDateTime: item.unbandDateTime,
            mappingInfo: JSON.stringify(item.mappingInfo)
        };
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.digitalTag),
            url: 'consumption/mapping/update',
            method: 'POST',
            data: {
                businessId,
                ...param,
                status: 0
            }
        }).then((res) => {
            if (res.code === 0) {
                return res.data ? res.data : null;
            }
            else {
                return Promise.reject({ code: 1, message: t('操作失败') });
            }
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t('操作失败') });
        });
    }
    //删除分摊表具
    async delBuMeter(businessId, item) {
        let param = {
            meterReference: item.meterReference,
            allocationRatio: item.allocationRatio ? item.allocationRatio / 100 : item.allocationRatio,
            timingPoint: item.timingPoint,
            unbandDateTime: item.unbandDateTime,
            mappingInfo: JSON.stringify(item.mappingInfo)
        };
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.digitalTag),
            url: 'consumption/mapping/unbind',
            method: 'POST',
            data: {
                businessId,
                ...param,
                status: 0
            }
        }).then((res) => {
            if (res.code === 0) {
                return res.data ? res.data : null;
            }
            else {
                return Promise.reject({ code: 1, message: t('操作失败') });
            }
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t('操作失败') });
        });
    }
    // //根据日期获取商户的总览数据
    async getBusinessSummary(data) {
        let param = {
            businessId: data.id,
            startDate: data.startDate,
            endDate: data.endDate,
            meterType: Number(data.energyType), //0-电 1-水 2-气
            polymerizeMode: data.jMode, //1-月 2-天
            needYOYData: data.needYOYData
        };
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.digitalTag),
            url: 'consumption/summary',
            method: 'POST',
            data: param
        }).then((res) => {
            if (res.code === 0) {
                return res.data ? res.data : null;
            }
            else {
                return Promise.reject({ code: 1, message: t('操作失败') });
            }
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t('操作失败') });
        });
    }
    //获取空间下表具列表
    async getMeterList(spaceId) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.digitalTag),
            url: 'consumption/meterofspace/list?spaceRef=' + spaceId,
            method: 'GET',
        }).then((res) => {
            if (res.code === 0) {
                res.data.forEach((e) => {
                    e.allocationType = e.allocationType.toString();
                });
                return res.data ? res.data : [];
            }
            else {
                return Promise.reject({ code: 1, message: t('操作失败') });
            }
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t('操作失败') });
        });
    }
    //根据表具id获取表具详情和关联商户
    async getMeterDetail(meterRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.digitalTag),
            url: '/consumption/meter/detail?meterRef=' + meterRef,
            method: 'GET',
        }).then((res) => {
            let ret;
            if (res.data) {
                res.data.businessMeterMapInfoList.forEach((e) => {
                    e.mappingInfo = JSON.parse(e.mappingInfo);
                });
                ret = {
                    ...res.data.meterBasicInfo,
                };
                ret.allocationType = ret.allocationType.toString();
                if (res.data.businessMeterMapInfoList.length > 0) {
                    ret.businessList = res.data.businessMeterMapInfoList.map((e) => {
                        return {
                            id: e.businessId,
                            allocationRatio: this.toFixedNum(Number(e.allocationRatio * 100)),
                            timingPoint: e.timingPoint,
                            unbandDateTime: e.unbandDateTime,
                            mappingInfo: e.mappingInfo
                        };
                    }) || [];
                }
                ;
                if (res.data.businessBasicInfoList.length > 0) {
                    ret.businessList.forEach((e) => {
                        res.data.businessBasicInfoList.forEach((el) => {
                            if (e.id == el.id) {
                                e['name'] = el.name;
                                e['location'] = el.location;
                                e['area'] = el.area;
                                e['basicCharge'] = el.basicCharge;
                                e['contact'] = el.contact;
                                e['contactInfo'] = el.contactInfo;
                            }
                        });
                    });
                }
            }
            return ret ? ret : null;
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t('操作失败') });
        });
    }
    toFixedNum(num, pre = 2) {
        const factor = 10 ** pre;
        // 自定义四舍五入：先取绝对值四舍五入，再加上符号
        const rounded = (Math.sign(num) || 1) * Math.round(Math.abs(num) * factor) / factor;
        return rounded.toFixed(pre);
    }
}
let statisticDataService = allServices.get(ServiceTypes.statisticData);
if (!statisticDataService) {
    statisticDataService = new StatisticDataService();
    allServices.set(ServiceTypes.statisticData, statisticDataService);
}
export default statisticDataService;
//# sourceMappingURL=statisticDataService.js.map