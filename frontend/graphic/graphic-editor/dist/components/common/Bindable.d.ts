import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';
import { default as PropertySerializable } from './PropertySerializable';
import { GBound, GPoint } from '../DrawingArea';
import { BindedPoint } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';
import { default as DataBindingComponent } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingComponent';
import { MulPopupBindingValue } from '@x-plateform-mono/business/dist/components/graphicMulPopup/GraphicMulManager';

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
export type animationConfig = {
    defaultState: string | undefined;
    continous: string[];
    discrete: string[];
};
export type mulPopupBindingValue = MulPopupBindingValue;
declare abstract class Bindable extends PropertySerializable implements DataBindingComponent {
    bindingRenderValues: Map<number, {
        value: any;
        type?: PointAttrValueType;
        translatedText?: string;
    }>;
    registerMultiplePoint(bindingList: BindedPoint[], callback: (params: ({
        value: any;
        type?: PointAttrValueType;
        translatedText?: string;
    } | undefined)[]) => void): ([BindedPoint, ((value: any, type?: PointAttrValueType, translatedText?: string) => void)])[];
    id: number;
    lastCpntId: number;
    displayName: string;
    getName(): string;
    getNextCpntId(): number;
    relatedChildrenProperties: string[];
    getBindingList(): BindedPoint[];
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
    getPointAttrValueRegistrators(dataAccessManager?: any): [BindedPoint, (value: string, type?: PointAttrValueType, translatedText?: string) => void][];
    /**
     * 用于点击设置值
     */
    getPointAttrBinding(): bindingObject | null;
    /**
     * 用于点击跳转
     */
    getNavigationLink(): navBindingValue | null;
    getPresentValueAttributeBindingPack(bv: bindingValue): bindingValue[];
    getAnimationStateByValue(stateList: string[], aniConf: animationConfig | undefined, type: PointAttrValueType, value: string): string;
    updateBindingPointName(): void;
    getBindingNameFromReference(reference: string): Promise<string>;
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
    getMulPopupBinding(): mulPopupBindingValue | null;
}
export default Bindable;
type rangeSection = {
    min: string;
    includeMin: boolean;
    max: string;
    includeMax: boolean;
};
export declare function animationRuleParser(text: string, isDisCrete: boolean): (string | rangeSection)[];
