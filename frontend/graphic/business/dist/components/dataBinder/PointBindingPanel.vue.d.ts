import { default as DataBindingManager } from './DataBindingManager';
import { DataModelBindingConfig, MultiPointBindingConfig, SinglePointBindingConfig, BindedPoint } from './DataBindingTypes';
import { BasicValueTypes } from '@x-plateform-mono/service/dist/equipmentService';
type __VLS_Props = {
    id?: number;
    bindingManager: DataBindingManager;
    config: MultiPointBindingConfig;
    modelConfig: DataModelBindingConfig;
    pointBindings?: (BindedPoint | {
        cpntId: number;
        innerName?: string;
        bindingType?: undefined;
    })[];
    hideAddButton?: boolean;
    valueTypes?: BasicValueTypes[];
};
declare function addPoint(): Promise<void>;
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
    addPoint: typeof addPoint;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    change: (pointBindings: (BindedPoint | {
        cpntId: number;
        innerName?: string;
        bindingType?: undefined;
    })[]) => any;
    changeNeedUndoRedo: (pointBindings: (BindedPoint | {
        cpntId: number;
        innerName?: string;
        bindingType?: undefined;
    })[], noNeedUndoRedo?: boolean | undefined) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((pointBindings: (BindedPoint | {
        cpntId: number;
        innerName?: string;
        bindingType?: undefined;
    })[]) => any) | undefined;
    onChangeNeedUndoRedo?: ((pointBindings: (BindedPoint | {
        cpntId: number;
        innerName?: string;
        bindingType?: undefined;
    })[], noNeedUndoRedo?: boolean | undefined) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
