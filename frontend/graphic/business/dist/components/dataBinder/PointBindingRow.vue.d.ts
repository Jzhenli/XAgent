import { DataModelBindingConfig, SinglePointBindingConfig, BindedPoint } from './DataBindingTypes';
import { default as DataBindingManager } from './DataBindingManager';
type __VLS_Props = {
    id?: number;
    cpntId: number;
    bindingManager: DataBindingManager;
    pointBinding?: BindedPoint | {
        cpntId: number;
        innerName?: string;
        bindingType: undefined;
    };
    validStatus?: 'networkPointLost' | 'equipmentReferenceLost' | 'equipmentPointUnbind' | 'equipmentPointBindingLost' | 'equipmentTemplateLost';
    config: SinglePointBindingConfig & {
        innerName?: string;
        locked?: boolean;
        required?: boolean;
        rename?: boolean;
    };
    modelConfig: DataModelBindingConfig;
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
            config: SinglePointBindingConfig & {
                innerName?: string;
                locked?: boolean;
                required?: boolean;
                rename?: boolean;
            };
            validStatus: "networkPointLost" | "equipmentReferenceLost" | "equipmentPointUnbind" | "equipmentPointBindingLost" | "equipmentTemplateLost" | undefined;
            range: {
                valueType: import('@x-plateform-mono/service/dist/equipmentService').BasicValueTypes;
                states?: [number, string][];
                min?: number;
                max?: number;
                unit?: string;
            } | undefined;
        }): any;
    };
    refs: {};
    rootEl: HTMLDivElement;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    change: (value: BindedPoint) => any;
    clear: () => any;
    delete: () => any;
    innerNameChange: (value: string) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((value: BindedPoint) => any) | undefined;
    onClear?: (() => any) | undefined;
    onDelete?: (() => any) | undefined;
    onInnerNameChange?: ((value: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
