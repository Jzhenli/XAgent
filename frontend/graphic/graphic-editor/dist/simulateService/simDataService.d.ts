import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';

/**
 * 订阅
 * @param pointRef
 * @param attrId
 * @param callback
 */
declare function subscribePoint(attr: {
    pointRef: string;
    attrId: number;
    pointType: any;
    bindingObj: any;
}, callback: (value: string, type?: PointAttrValueType, translatedText?: string) => void): void;
/**
 * 取消订阅
 * @param pointRef
 * @param attrId
 * @param callback
 * @returns
 */
declare function unsubscribePoint(pointRef: string, attrId?: number, callback?: (val: any) => void): void;
/**
 * 触发收到消息，暴露手动触发的入口
 * @param pointRef
 * @param attrId
 * @param value
 * @returns
 */
declare function triggerPoint(pointRef: string, attrId: number, value: any): void;
declare function listRegistedPoints(): {
    pointRef: string;
    attrList: number[];
}[];
declare const _default: {
    subscribePoint: typeof subscribePoint;
    unsubscribePoint: typeof unsubscribePoint;
    triggerPoint: typeof triggerPoint;
    listRegistedPoints: typeof listRegistedPoints;
};
export default _default;
