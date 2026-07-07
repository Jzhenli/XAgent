import { DataBindingObject, DataModelBindingConfig, MultiPointBindingConfig, BindedPoint } from './DataBindingTypes';
import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';
import { BasicValueTypes } from '@x-plateform-mono/service/dist/equipmentService';
type __VLS_Props = {
    value: DataBindingObject;
    option: MultiPointBindingConfig;
    modelConfig?: DataModelBindingConfig;
    showModelList?: boolean;
    dynamicHeight?: boolean;
};
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {
            cpntId: number;
            pointBinding: BindedPoint | {
                cpntId: number;
                innerName?: string;
                bindingType: undefined;
            } | undefined;
            config: import('./DataBindingTypes').SinglePointBindingConfig & {
                innerName?: string;
                locked?: boolean;
                required?: boolean;
                rename?: boolean;
            };
            validStatus: "networkPointLost" | "equipmentReferenceLost" | "equipmentPointUnbind" | "equipmentPointBindingLost" | "equipmentTemplateLost" | undefined;
            range: {
                valueType: BasicValueTypes;
                states?: [number, string][];
                min?: number;
                max?: number;
                unit?: string;
            } | undefined;
        }): any;
        default?(_: {
            cpntId: number;
            pointBinding: BindedPoint | {
                cpntId: number;
                innerName?: string;
                bindingType: undefined;
            } | undefined;
            config: import('./DataBindingTypes').SinglePointBindingConfig & {
                innerName?: string;
                locked?: boolean;
                required?: boolean;
                rename?: boolean;
            };
            validStatus: "networkPointLost" | "equipmentReferenceLost" | "equipmentPointUnbind" | "equipmentPointBindingLost" | "equipmentTemplateLost" | undefined;
            range: {
                valueType: BasicValueTypes;
                states?: [number, string][];
                min?: number;
                max?: number;
                unit?: string;
            } | undefined;
        }): any;
    };
    refs: {};
    rootEl: any;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<__VLS_Props, {
    buildFromSingleBindingReference(reference: string): Promise<{
        pointBindings: {
            cpntId: number;
            bindingType: string;
            innerRef: number;
            propType: string;
            key: string;
        }[];
        dataModels: {
            equipmentType: string;
            equipmentRef: string;
            equipmentName: string;
            innerRef: number;
            bindingList: {
                propType: string;
                equipmentPointRef: string;
                key: string;
                name: string;
                valueType: BasicValueTypes.binary | BasicValueTypes.state | BasicValueTypes.analog;
                range: {};
                refs: {
                    cpntId: number;
                }[];
            }[];
        }[];
        modelBindings: never[];
    } | {
        pointBindings: {
            cpntId: number;
            bindingType: string;
            pointRef: string;
            pointName: string;
            pointType: PointAttrValueType;
            valueType: BasicValueTypes;
        }[];
        dataModels: never[];
        modelBindings: never[];
    } | undefined>;
    getSingleBindingReference(dbo: DataBindingObject): string | undefined;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    change: (config: DataBindingObject) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((config: DataBindingObject) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
