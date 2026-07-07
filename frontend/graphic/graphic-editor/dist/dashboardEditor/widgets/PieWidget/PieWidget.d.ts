import { shapePropertyGroupDef } from '../../common/PropertyMetaTypes';
import { default as BaseWidget } from '../BaseWidget';
import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';
import { BindedPoint } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';

export default class PieWidget extends BaseWidget {
    displayName: string;
    thumbnail: string;
    defaultSize: number[];
    options: {
        className: string;
        top: number;
        left: number;
        width: number;
        height: number;
        title: string;
        dynamicBindings: {
            label: string;
            value: number;
            opt?: any;
            binding: {
                isEditable?: boolean | undefined;
                cpntId: number;
                bindingType: "point";
                innerName?: string | undefined;
                pointRef: string;
                pointName: string;
                pointType: PointAttrValueType;
                valueType: import('@x-plateform-mono/service/dist/equipmentService').BasicValueTypes;
                range: {
                    states?: [number, string][] | undefined;
                    min?: number | undefined;
                    max?: number | undefined;
                    unit?: string | undefined;
                };
                relatedTrend?: {
                    trendRef: string;
                    trendName: string;
                } | undefined;
            } | {
                isEditable?: boolean | undefined;
                cpntId: number;
                bindingType: "equipment";
                innerName?: string | undefined;
                innerRef: number;
                propType: "point" | "attribute";
                key: string;
            } | {
                cpntId: number;
                bindingType: "customApi";
                innerName?: string | undefined;
                programBody: string;
            };
        }[];
        showPercent: boolean;
        defaultValue: number;
        precision: number;
        dynamicValues: any[];
        dynamicTexts: any[];
        chartColors: string[];
    };
    component: any;
    renderComponent: any;
    propertyMeta: shapePropertyGroupDef[];
    getPointAttrValueRegistrators(dataAccessManager?: any): [BindedPoint, any][];
    removeBindPointFromEquipmentModel(cpntId: number): void;
}
