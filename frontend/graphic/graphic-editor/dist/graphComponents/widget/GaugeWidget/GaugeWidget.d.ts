import { shapePropertyGroupDef } from '../../common/PropertyMetaTypes';
import { default as BaseWidget } from '../BaseWidget';

export default class ContrastWidget extends BaseWidget {
    displayName: string;
    options: {
        className: string;
        width: number;
        height: number;
        unit: string;
        title: string;
        defaultValue: number;
        showUnit: boolean;
        showName: boolean;
        defaultAttribute: {
            itemColor: (cpntId: any) => any;
            img: string;
        };
        dataModels: {
            equipmentType: string;
            equipmentRef?: string | undefined;
            equipmentName: string;
            innerRef: number;
            bindingList: {
                propType: "point" | "attribute";
                key: string;
                name: string;
                valueType: import('../../common/Bindable').BasicValueTypes;
                stateMap?: (Map<number, string> & Omit<Map<number, string>, keyof Map<any, any>>) | undefined;
                unitText?: string | undefined;
                refs?: {
                    id?: number | undefined;
                    cpntId: number;
                    innerName?: string | undefined;
                }[] | undefined;
            }[];
        }[];
        showAnalogValue: boolean;
        dynamicBindings: ({
            point: {
                cpntId: number;
                bindingType: "point";
                innerName?: string | undefined;
                pointRef: string;
                pointName?: string | undefined;
                valueType?: import('../../common/Bindable').PointAttrValueType | undefined;
                stateMap?: (Map<number, string> & Omit<Map<number, string>, keyof Map<any, any>>) | undefined;
                unitText?: string | undefined;
                relatedTrend?: {
                    trendRef: string;
                    trendName: string;
                } | undefined;
            } | {
                cpntId: number;
                bindingType: "equipment";
                innerName?: string | undefined;
                innerRef: number;
                propType: "point" | "attribute";
                key: string;
            } | undefined;
            attribute?: any;
            analogValue: any;
            value: any;
        } | null)[];
        backgroundColor: string;
        attributeList: {
            itemColor: any;
            img: string;
        }[];
        minValue: number;
        maxValue: number;
        startAnchor: string;
        startOffset: string;
        startUnit: string;
        endAnchor: string;
        endOffset: string;
        endUnit: string;
        bindingType: "point" | "api";
        showPointBinding: boolean;
        showApiBinding: boolean;
        maxNum: number;
        precision: number;
        showCarbon: boolean;
    };
    component: any;
    renderComponent: any;
    propertyMeta: shapePropertyGroupDef[];
}
