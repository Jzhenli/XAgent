import { PointAttrValueType, attributeItem } from './constants';
export declare class PointDataService {
    registedPoints: Map<string, Map<number, {
        translateMap: Promise<Map<number, string> | undefined>;
        type: Promise<PointAttrValueType | undefined>;
        callbackList: ((value: string, type?: PointAttrValueType, translatedText?: string) => void)[];
    }>>;
    allDptTypes: any;
    pointDptCache: Map<string, any>;
    doSubscribe(pointRef: string, attrId: number): void;
    updateValue(pointRef: string, attrId: number): void;
    doUnsubscribe(pointRef: string, attrId?: number): void;
    getType(attrId: number, pointType: any): Promise<PointAttrValueType | undefined>;
    subscribePoint(attr: {
        pointRef: string;
        attrId: number;
        pointType: any;
        bindingObj?: any;
    }, callback: (value: string, type?: PointAttrValueType, translatedText?: string) => void): void;
    updatePointAttr(pointRef: string, attrId: number, pointType: any): void;
    unsubscribePoint(pointRef: string, attrId?: number, callback?: (val: any) => void): void;
    triggerPoint(pointRef: string, attrId: number, value: any): Promise<void>;
    listRegistedPoints(): {
        pointRef: string;
        attrList: number[];
    }[];
    listAttributesByType(classId: string, bindable?: boolean): Promise<attributeItem[]>;
    Sortltem(reference: string): any;
    attributeQueryBuffer: {
        reference: string;
        propList: string;
    }[];
    allowPushPromise1: Promise<void>;
    allowPushResolve1: () => void;
    sendingLockCount1: number;
    getAttributeById(pointRef: string, attrId: number): Promise<attributeItem | undefined>;
    attrTranslateBuffer: {
        reference: string;
        propList: string;
    }[];
    allowPushPromise: Promise<void>;
    allowPushResolve: () => void;
    sendingLockCount: number;
    getTranslationMapById(pointRef: string, attrId: number): Promise<Map<number, string> | undefined>;
    attrQueryPromise: Promise<Map<string, attributeItem>>;
    startQueryAttributes(): Promise<Map<string, attributeItem>>;
    translationQueryPromise: Promise<Map<string, Map<number, string>>>;
    startQueryTranlations(): Promise<Map<string, Map<number, string>>>;
}
declare const _default: PointDataService;
export default _default;
