import { shapePropertyGroupDef } from '../../common/PropertyMetaTypes';
import { default as BaseWidget } from '../BaseWidget';
import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';
import { BindedPoint } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';

export default class ListWidget extends BaseWidget {
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
        priority: string;
        dynamicBindings: {
            type?: "state" | "binary" | "analog" | undefined;
            label: string;
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
            opt?: any;
        }[];
        dynamicValues: {
            originVal?: any;
            preciseVal: any;
        }[];
        dynamicUnits: any[];
        dynamicTexts: any[];
        precision: number;
        showUnit: boolean;
    };
    removeBindPointFromEquipmentModel(cpntId: number): void;
    component: import('vue').DefineComponent<{}, {}, any, import('vue').ComputedOptions, import('vue').MethodOptions, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{}>>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
    renderComponent: import('vue').DefineComponent<{}, {}, any, import('vue').ComputedOptions, import('vue').MethodOptions, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{}>>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
    propertyMeta: shapePropertyGroupDef[];
    getPointAttrValueRegistrators(dataAccessManager?: any): [BindedPoint, any][];
    updateUnit(binding: any, dataAccessManager?: any): any;
}
