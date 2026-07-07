import { PointAttrValueType } from "./constants";
import pointDataService from "./pointDataService";
import { ServiceTypes, allServices } from "./systemService";
export class PointDataSimulator {
    registedPoints = new Map();
    /**
     * 订阅
     * @param pointRef
     * @param attrId
     * @param callback
     */
    subscribePoint(pointRef, attrId, callback) {
        let pointAttrs = this.registedPoints.get(pointRef);
        if (!pointAttrs) {
            pointAttrs = new Map();
            this.registedPoints.set(pointRef, pointAttrs);
        }
        let attrCallbacks = pointAttrs.get(attrId);
        if (!attrCallbacks) {
            const typePromise = pointDataService.getAttributeById(pointRef, attrId).then(res => res?.type);
            const translateMapPromise = typePromise.then(type => {
                if (type === PointAttrValueType.Binary || type === PointAttrValueType.State) {
                    return pointDataService.getTranslationMapById(pointRef, attrId);
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
        }
        attrCallbacks.callbackList.push(callback);
    }
    /**
     * 取消订阅
     * @param pointRef
     * @param attrId
     * @param callback
     * @returns
     */
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
                        pointAttrs.delete(attrId);
                    }
                    if (pointAttrs.size === 0) {
                        this.registedPoints.delete(pointRef);
                    }
                }
            }
            else {
                pointAttrs.delete(attrId);
                if (pointAttrs.size === 0) {
                    this.registedPoints.delete(pointRef);
                }
            }
        }
        else {
            this.registedPoints.delete(pointRef);
        }
    }
    /**
     * 触发收到消息，暴露手动触发的入口
     * @param pointRef
     * @param attrId
     * @param value
     * @returns
     */
    triggerPoint(pointRef, attrId, value) {
        const attrCallbacks = this.registedPoints.get(pointRef)?.get(attrId);
        if (!attrCallbacks) {
            return;
        }
        const typePromise = attrCallbacks.type;
        const translateMapPromise = attrCallbacks.translateMap;
        Promise.all([typePromise, translateMapPromise]).then(([type, map]) => {
            attrCallbacks.callbackList.forEach(callback => {
                callback(value, type, map?.get(value));
            });
        });
    }
    //列出当前所有订阅的点及其属性
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
}
let pointDataSimulator = allServices.get(ServiceTypes.pointDataSimulator);
if (!pointDataSimulator) {
    pointDataSimulator = new PointDataSimulator();
    allServices.set(ServiceTypes.pointDataSimulator, pointDataSimulator);
}
export default pointDataSimulator;
//# sourceMappingURL=pointDataSimulator.js.map