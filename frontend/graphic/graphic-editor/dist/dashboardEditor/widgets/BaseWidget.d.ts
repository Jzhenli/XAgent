import { bindingValue } from '../common/Bindable';
import { default as Eventful } from '../common/Eventful';
import { shapePropertyGroupDef } from '../common/PropertyMetaTypes';
import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';
import { default as DataBindingComponent } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingComponent';
import { BindedPoint } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';

export declare const gridSize: {
    totalCols: number;
    totalRows: number;
    gridWidth: number;
    gridHeight: number;
    gridSpace: number;
};
export declare const gridSizex3: {
    totalCols: number;
    totalRows: number;
    gridWidth: number;
    gridHeight: number;
    gridSpace: number;
};
export default class BaseWidget extends Eventful implements DataBindingComponent {
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
    getName(): string;
    getNextCpntId(): number;
    getBindingList(): BindedPoint[];
    removeBindPointFromEquipmentModel(cpntId: number): void;
    displayName: string;
    icon: string;
    thumbnail: string;
    thumbnailSize: number[];
    defaultSize: number[];
    widgetMeta: any;
    options: any;
    editingParam: any;
    propertyMeta: shapePropertyGroupDef[];
    component: any;
    renderComponent: any;
    setSizePosition(sizePos: {
        width: number;
        height: number;
        top: number;
        left: number;
    }): void;
    set(key: string, value: any): void;
    get(key: string): any;
    getOptions(): any;
    setOptions(options: any): void;
    getPointAttrValueRegistrators(dataAccessManager?: any): [BindedPoint, ((value: string, type?: PointAttrValueType) => void)][];
    updateUnit(binding: any, dataAccessManager?: any): void;
    getPresentValueAttributeBindingPack(bv: bindingValue): bindingValue[];
    getDisplayValue(value: string): string;
}
