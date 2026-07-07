import request from './request';
import dataValueHub from './dataValueHub';
import constants, { bindableList, PointAttrValueType, translateUnit } from './constants';
import { BACnetPropertyType } from './bacnetPropertyType';
import { ServiceTypes, allServices } from './systemService';
import knxService from './knxService';
export class PointDataService {
    registedPoints = new Map();
    allDptTypes;
    pointDptCache = new Map();
    doSubscribe(pointRef, attrId) {
        try {
            dataValueHub.subscribe(pointRef, attrId, (value) => {
                this.triggerPoint(pointRef, attrId, value);
            });
        }
        catch (e) {
            console.error(e);
        }
    }
    updateValue(pointRef, attrId) {
        dataValueHub.updateValue(pointRef, attrId);
    }
    doUnsubscribe(pointRef, attrId) {
        try {
            dataValueHub.unsubscribe(pointRef, attrId);
        }
        catch (e) {
            console.log(e);
        }
    }
    getType(attrId, pointType) {
        return new Promise((resolve) => {
            if (attrId !== BACnetPropertyType.propPresentValue) {
                resolve(PointAttrValueType.String);
            }
            else {
                if ([PointAttrValueType.Analog, PointAttrValueType.Binary, PointAttrValueType.State].includes(pointType)) {
                    resolve(pointType);
                }
                else {
                    resolve(PointAttrValueType.String);
                }
            }
        });
    }
    subscribePoint(attr, callback) {
        const { pointRef, attrId, pointType } = attr || {};
        let pointAttrs = this.registedPoints.get(pointRef);
        if (!pointAttrs) {
            pointAttrs = new Map();
            this.registedPoints.set(pointRef, pointAttrs);
        }
        let attrCallbacks = pointAttrs.get(attrId);
        if (!attrCallbacks) {
            const typePromise = this.getType(attrId, pointType);
            const translateMapPromise = typePromise.then(type => {
                if (type === PointAttrValueType.Binary || type === PointAttrValueType.State) {
                    return this.getTranslationMapById(pointRef, attrId);
                }
                else {
                    return;
                }
            });
            attrCallbacks = {
                translateMap: translateMapPromise,
                type: typePromise,
                callbackList: []
            };
            pointAttrs.set(attrId, attrCallbacks);
            attrCallbacks.callbackList.push(callback);
            this.doSubscribe(pointRef, attrId);
        }
        else {
            attrCallbacks.callbackList.push(callback);
            this.updateValue(pointRef, attrId);
        }
    }
    updatePointAttr(pointRef, attrId, pointType) {
        let pointAttrs = this.registedPoints.get(pointRef);
        if (!pointAttrs)
            return;
        let attrCallbacks = pointAttrs.get(attrId);
        const typePromise = this.getType(attrId, pointType);
        const translateMapPromise = typePromise.then(type => {
            if (type === PointAttrValueType.Binary || type === PointAttrValueType.State) {
                return this.getTranslationMapById(pointRef, attrId);
            }
            else {
                return;
            }
        });
        attrCallbacks = {
            translateMap: translateMapPromise,
            type: typePromise,
            callbackList: attrCallbacks?.callbackList || []
        };
        pointAttrs.set(attrId, attrCallbacks);
    }
    unsubscribePoint(pointRef, attrId, callback) {
        const pointAttrs = this.registedPoints.get(pointRef);
        if (!pointAttrs) {
            return;
        }
        if (attrId) {
            const attrCallbacks = pointAttrs.get(attrId);
            if (!attrCallbacks) {
                return;
            }
            if (callback) {
                const idx = attrCallbacks.callbackList.indexOf(callback);
                if (idx === -1) {
                    return;
                }
                else {
                    attrCallbacks.callbackList.splice(idx, 1);
                    if (attrCallbacks.callbackList.length === 0) {
                        this.doUnsubscribe(pointRef, attrId);
                        pointAttrs.delete(attrId);
                    }
                    if (pointAttrs.size === 0) {
                        this.registedPoints.delete(pointRef);
                    }
                }
            }
            else {
                this.doUnsubscribe(pointRef, attrId);
                pointAttrs.delete(attrId);
                if (pointAttrs.size === 0) {
                    this.registedPoints.delete(pointRef);
                }
            }
        }
        else {
            this.doUnsubscribe(pointRef);
            this.registedPoints.delete(pointRef);
        }
    }
    async triggerPoint(pointRef, attrId, value) {
        const attrCallbacks = this.registedPoints.get(pointRef)?.get(attrId);
        if (!attrCallbacks) {
            return;
        }
        const typePromise = attrCallbacks.type;
        const translateMapPromise = attrCallbacks.translateMap;
        let text = value;
        // knx的值特殊处理  先获取类型 然后根据类型转化
        if ((pointRef.startsWith('XPlateform:KNX') || pointRef.includes('EQUIPMENT_KNX_TEXT_VALUE')) && attrId == BACnetPropertyType.propPresentValue) {
            if (!this.allDptTypes) {
                let res = await knxService.getAllDptTypes();
                this.allDptTypes = {};
                res[1].forEach((t) => {
                    this.allDptTypes[t.value] = t;
                });
            }
            if (this.pointDptCache.get(pointRef) == undefined) {
                this.pointDptCache.set(pointRef, [{ pointRef, attrId, value }]);
                let dptType;
                // knx的网络点
                if (pointRef.startsWith('XPlateform:KNX')) {
                    dptType = (await knxService.getKnxPointsByRefs([pointRef]))[0]?.dptType || '';
                }
                else {
                    // knx的设备点
                    dptType = (await knxService.getKnxDataByEquipRef(pointRef))?.dptStr || '';
                }
                let valueListCache = JSON.parse(JSON.stringify(this.pointDptCache.get(pointRef)));
                this.pointDptCache.set(pointRef, dptType);
                for (let i = 0; i < valueListCache.length; i++) {
                    this.triggerPoint(valueListCache[i].pointRef, valueListCache[i].attrId, valueListCache[i].value);
                }
            }
            else if (Array.isArray(this.pointDptCache.get(pointRef))) {
                let valueListCache = this.pointDptCache.get(pointRef);
                valueListCache.push({ pointRef, attrId, value });
                this.pointDptCache.set(pointRef, valueListCache);
                return;
            }
            else {
                text = await knxService.getKNXValueText(this.pointDptCache.get(pointRef), value, this.allDptTypes);
            }
        }
        Promise.all([typePromise, translateMapPromise]).then(([type, map]) => {
            attrCallbacks.callbackList.forEach(async (callback) => {
                if (attrId == BACnetPropertyType.propUnits) {
                    // 单独处理单位的翻译
                    callback(value, type, translateUnit(value) || map?.get(parseInt(value)));
                }
                else {
                    callback(text, type, map?.get(parseInt(text)));
                }
            });
        });
    }
    listRegistedPoints() {
        const ret = [];
        this.registedPoints.forEach((attrMap, pointRef) => {
            const attrList = [];
            attrMap.forEach((attrCallbacks, attrId) => {
                attrList.push(attrId);
            });
            ret.push({
                pointRef,
                attrList: attrList
            });
        });
        return ret;
    }
    async listAttributesByType(classId, bindable) {
        return request({
            url: 'Object/GetAttrsByPointType',
            params: { classId }
        }).then((data) => {
            return data.data.filter((item) => {
                return !bindable || bindableList.indexOf(item.viewPropertyId) > -1;
            }).map((item) => {
                return {
                    id: item.viewPropertyId,
                    label: item.viewPropertyName,
                };
            });
        });
    }
    Sortltem(reference) {
        return request({
            url: 'Object/SortItem',
            method: 'post',
            data: reference
        }).then((data) => {
            return data;
        });
    }
    attributeQueryBuffer = [];
    allowPushPromise1 = Promise.resolve();
    allowPushResolve1 = () => { };
    sendingLockCount1 = 0;
    //查询某个点属性的值类型 (PointAttrValueType)
    async getAttributeById(pointRef, attrId) {
        await this.allowPushPromise1;
        this.attributeQueryBuffer.push({ reference: pointRef, propList: attrId.toString() });
        this.sendingLockCount1++;
        const sendPromise = new Promise(resolve => {
            return setTimeout(resolve, 0);
        }).then(() => {
            const query = this.startQueryAttributes();
            this.sendingLockCount1--;
            if (this.sendingLockCount1 === 0) {
                this.allowPushResolve1();
            }
            return query;
        });
        return sendPromise.then((attributeQueryResult) => {
            const ret = attributeQueryResult.get(pointRef + ',' + attrId);
            if (attrId === BACnetPropertyType.propUnits && ret) {
                ret.type = PointAttrValueType.String;
            }
            return ret;
        });
    }
    attrTranslateBuffer = [];
    allowPushPromise = Promise.resolve();
    allowPushResolve = () => { };
    sendingLockCount = 0;
    //查询某个点属性值的翻译表
    async getTranslationMapById(pointRef, attrId) {
        await this.allowPushPromise;
        this.attrTranslateBuffer.push({ reference: pointRef, propList: attrId.toString() });
        this.sendingLockCount++;
        const sendPromise = new Promise(resolve => {
            return setTimeout(resolve, 0);
        }).then(() => {
            const query = this.startQueryTranlations();
            this.sendingLockCount--;
            if (this.sendingLockCount === 0) {
                this.allowPushResolve();
            }
            return query;
        });
        return sendPromise.then((translationQueryResult) => {
            return translationQueryResult.get(pointRef + ',' + attrId);
        });
    }
    attrQueryPromise = Promise.resolve(new Map());
    async startQueryAttributes() {
        if (this.attributeQueryBuffer.length !== 0) {
            const tempBuffer = getUniqueArray(this.attributeQueryBuffer);
            this.attributeQueryBuffer.splice(0, this.attributeQueryBuffer.length);
            this.allowPushPromise1 = new Promise((resolve) => {
                this.allowPushResolve1 = resolve;
            });
            this.attrQueryPromise = this.attrQueryPromise.then(() => {
                return request({
                    url: 'Object/GetAttrsByMultiRefs',
                    method: 'post',
                    data: tempBuffer,
                });
            }).then((data) => {
                const attributeQueryResult = new Map();
                data.data.forEach((item) => {
                    attributeQueryResult.set(item.reference + ',' + item.viewPropertyId, {
                        id: item.viewPropertyId,
                        label: item.viewPropertyName,
                        type: constants.translatePointClassToValueTypes(item.classId)
                    });
                });
                return attributeQueryResult;
            });
        }
        return this.attrQueryPromise;
    }
    translationQueryPromise = Promise.resolve(new Map());
    async startQueryTranlations() {
        if (this.attrTranslateBuffer.length !== 0) {
            const tempBuffer = getUniqueArray(this.attrTranslateBuffer);
            this.attrTranslateBuffer.splice(0, this.attrTranslateBuffer.length);
            this.allowPushPromise = new Promise((resolve) => {
                this.allowPushResolve = resolve;
            });
            this.translationQueryPromise = this.translationQueryPromise.then(() => {
                return request({
                    url: 'Object/GetItemCovMappers',
                    method: 'post',
                    data: tempBuffer,
                });
            }).then((data) => {
                const translationQueryResult = new Map();
                data.data.forEach((item) => {
                    translationQueryResult.set(item.reference + ',' + item.propertyId, new Map(item.propertyValues.map((pv) => {
                        return [pv.valueKey, pv.value];
                    })));
                });
                return translationQueryResult;
            }).catch(err => {
                return new Map();
            });
        }
        return this.translationQueryPromise;
    }
}
function getUniqueArray(array) {
    const ret = array.concat([]);
    for (let i = 0; i < ret.length; i++) {
        const itemI = ret[i];
        for (let j = i + 1; j < ret.length; j++) {
            const itemJ = ret[j];
            if (itemI.reference === itemJ.reference && itemI.propList === itemJ.propList) {
                ret.splice(j, 1);
                j--;
            }
        }
    }
    return ret;
}
let pointDataService = allServices.get(ServiceTypes.pointData);
if (!pointDataService) {
    pointDataService = new PointDataService();
    allServices.set(ServiceTypes.pointData, pointDataService);
}
export default pointDataService;
//# sourceMappingURL=pointDataService.js.map