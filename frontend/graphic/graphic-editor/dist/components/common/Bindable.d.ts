import { default as PropertySerializable } from './PropertySerializable';
import { GBound, GPoint } from '../DrawingArea';

export type bindingValue = {
    pointReference: string;
    pointName: string;
    pointClassId: number;
    attributeId: number;
    attributeLabel: string;
};
export declare enum bindingType {
    Network = "Network",
    Equipment = "Equipment"
}
export type equipBindingValue = {
    innerRef: string;
    equipName?: string;
    key: string;
    pointType?: number;
    pointName?: string;
};
export type bindingObject = {
    [T in bindingType]: {
        type: T;
        bindingValue: {
            [bindingType.Network]: bindingValue;
            [bindingType.Equipment]: equipBindingValue;
        }[T];
    };
}[bindingType];
export type navBindingValue = {
    id: string;
    name: string;
    type?: string;
    graphicId?: string;
    graphicName?: string;
    dashboardId?: string;
    dashboardName?: string;
    videoBoardId?: string;
    videoBoardName?: string;
    layoutRef?: string;
    layoutName?: string;
};
export type customBindingValue = {
    url: string;
    name: string;
    paramList: {
        key: string;
        value: any;
    }[];
};
export type popupBindingValue = {
    id: string;
    name: string;
    graphicId: string;
    graphicName: string;
};
export type triggerModeType = 'switch' | 'number';
export type switchTriggerConfig = {
    mode: 'switch';
    onLabel: string;
    offLabel: string;
};
export type numberTriggerConfig = {
    mode: 'number';
    label: string;
};
export type triggerConfig = switchTriggerConfig | numberTriggerConfig;
export type pointInfo = {
    deviceId: string;
    deviceName: string;
    pointId: string;
    pointName: string;
    unit: string;
    description: string;
};
export type popupPointBinding = {
    id: string;
    displayName: string;
    pointInfo: pointInfo;
    triggerConfig?: triggerConfig;
};
export type popupConfigValue = {
    enablePopup: boolean;
    popupTitle: string;
    popupWidth: number;
    popupHeight: number;
    popupBgColor: string;
    popupFontSize: number;
    popupFontColor: string;
    popupPointBindings: popupPointBinding[];
};
export declare function createDefaultPopupConfig(): popupConfigValue;
export type animationConfig = {
    defaultState: string | undefined;
    continous: string[];
    discrete: string[];
};
declare abstract class Bindable extends PropertySerializable {
    bindingRenderValues: Map<number, {
        value: any;
        type?: any;
        translatedText?: string;
    }>;
    registerMultiplePoint(bindingList: any[], callback: (params: ({
        value: any;
        type?: any;
        translatedText?: string;
    } | undefined)[]) => void): [any, (value: any, type?: any, translatedText?: string) => void][];
    id: number;
    lastCpntId: number;
    displayName: string;
    getName(): string;
    getNextCpntId(): number;
    relatedChildrenProperties: string[];
    getBindingList(): any[];
    /**
     * 在中调用，在初始化时遍历所有已绑定点位，更新lastCpntId的值
     */
    updateLastCpntId(): void;
    removeBindPointFromEquipmentModel(cpntId: number): void;
    getOptions(): any;
    addChildrenBinding(uqId: number): number;
    removeChildrenBinding(uqId: number): void;
    updateChildrenBindingUqIds(lastIdList: number[], newIdList: number[]): void;
    getShapeTopLeft(): {
        x: number;
        y: number;
    };
    /**
     * 当绑定的值发生改变时，graphic对象需要随之变化
     */
    getPointAttrValueRegistrators(dataAccessManager?: any): [any, (value: string, type?: any, translatedText?: string) => void][];
    /**
     * 用于点击设置值
     */
    getPointAttrBinding(): bindingObject | null;
    /**
     * 用于点击跳转
     */
    getNavigationLink(): navBindingValue | null;
    getPresentValueAttributeBindingPack(bv: bindingValue): bindingValue[];
    getAnimationStateByValue(stateList: string[], aniConf: animationConfig | undefined, type: any, value: string): string;
    updateBindingPointName(): void;
    getBindingNameFromReference(reference: string): Promise<null>;
    positionUpdateCallback: ((param: GBound, anchorCenter: GPoint, zoom: number) => void) | null;
    hasCustomBinding(): boolean;
    getCustomBinding(): {
        uqId: any;
        className: any;
        onUpdatePosition: (callback: (param: GBound, anchorCenter: GPoint, zoom: number) => void) => void;
        optionSetter: (key: string, value: any) => void;
        url: string;
        name: string;
        paramList: {
            key: string;
            value: any;
        }[];
    } | null;
    getPopupBinding(): popupBindingValue | null;
    getMulPopupBinding(): any | null;
}
export default Bindable;
type rangeSection = {
    min: string;
    includeMin: boolean;
    max: string;
    includeMax: boolean;
};
export declare function animationRuleParser(text: string, isDisCrete: boolean): (string | rangeSection)[];
