import { shapePropertyGroupDef } from '../../common/PropertyMetaTypes';
import { default as BaseWidget } from '../BaseWidget';

export default class SemicircleWidget extends BaseWidget {
    displayName: string;
    options: {
        className: string;
        width: number;
        height: number;
        unit: string;
        title: string;
        showUnit: boolean;
        showTooltip: boolean;
        showSum: boolean;
        showLegend: boolean;
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
        defaultAttribute: {
            itemColor: (cpntId: any) => any;
        };
        attributeList: never[];
        showAnalogValue: boolean;
        defaultValue: number;
        dynamicBindings: {
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
        }[] | null;
        backgroundColor: string;
        startAnchor: string;
        startOffset: string;
        startUnit: string;
        endAnchor: string;
        endOffset: string;
        endUnit: string;
        bindingType: "point" | "api";
        showPointBinding: boolean;
        showApiBinding: boolean;
        precision: number;
        showCarbon: boolean;
    };
    component: any;
    renderComponent: any;
    propertyMeta: shapePropertyGroupDef[];
}
