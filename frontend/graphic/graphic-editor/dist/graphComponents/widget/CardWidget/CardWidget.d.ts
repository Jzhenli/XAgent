import { shapePropertyGroupDef } from '../../common/PropertyMetaTypes';
import { default as BaseWidget } from '../BaseWidget';

export default class ContrastWidget extends BaseWidget {
    displayName: string;
    thumbnail: string;
    thumbnailSize: number[];
    defaultSize: number[];
    options: {
        className: string;
        width: number;
        height: number;
        unit: string;
        title: string;
        defaultValue: number;
        showTime: string;
        showUnit: boolean;
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
            color: string;
        };
        attributeList: {
            color: string;
        }[];
        dataValue: {};
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
        showIcon: string;
        showRowCol: string;
        showName: boolean;
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
