import { PointAttrValueType } from "./constants";
export declare class PointDataSimulator {
    registedPoints: Map<string, Map<number, {
        translateMap: Promise<Map<number, string> | undefined>;
        type: Promise<PointAttrValueType | undefined>;
        callbackList: ((value: string, type?: PointAttrValueType, translatedText?: string) => void)[];
    }>>;
    /**
     * 订阅
     * @param pointRef
     * @param attrId
     * @param callback
     */
    subscribePoint(pointRef: string, attrId: number, callback: (value: string, type?: PointAttrValueType, translatedText?: string) => void): void;
    /**
     * 取消订阅
     * @param pointRef
     * @param attrId
     * @param callback
     * @returns
     */
    unsubscribePoint(pointRef: string, attrId?: number, callback?: (val: any) => void): void;
    /**
     * 触发收到消息，暴露手动触发的入口
     * @param pointRef
     * @param attrId
     * @param value
     * @returns
     */
    triggerPoint(pointRef: string, attrId: number, value: any): void;
    listRegistedPoints(): {
        pointRef: string;
        attrList: number[];
    }[];
}
declare const _default: PointDataSimulator;
export default _default;
