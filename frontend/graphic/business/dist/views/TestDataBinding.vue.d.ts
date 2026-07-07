import { DataBindingObject, MultiPointBindingConfig } from '../components/dataBinder/DataBindingTypes';
import { BasicValueTypes } from '@x-plateform-mono/service/dist/equipmentService';
import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';
declare const _default: import('vue').DefineComponent<{}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {
    dataBindingPanelItem: ({
        $: import('vue').ComponentInternalInstance;
        $data: {};
        $props: {
            readonly value: DataBindingObject;
            readonly option: MultiPointBindingConfig;
            readonly modelConfig?: import('../components/dataBinder/DataBindingTypes').DataModelBindingConfig | undefined;
            readonly showModelList?: boolean | undefined;
            readonly dynamicHeight?: boolean | undefined;
            readonly onChange?: ((config: DataBindingObject) => any) | undefined;
        } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps;
        $attrs: import('vue').Attrs;
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            [name: string]: import('vue').Slot<any> | undefined;
        }>;
        $root: import('vue').ComponentPublicInstance | null;
        $parent: import('vue').ComponentPublicInstance | null;
        $host: Element | null;
        $emit: (event: "change", config: DataBindingObject) => void;
        $el: any;
        $options: import('vue').ComponentOptionsBase<Readonly<{
            value: DataBindingObject;
            option: MultiPointBindingConfig;
            modelConfig?: import('../components/dataBinder/DataBindingTypes').DataModelBindingConfig;
            showModelList?: boolean;
            dynamicHeight?: boolean;
        }> & Readonly<{
            onChange?: ((config: DataBindingObject) => any) | undefined;
        }>, {
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
        }, string, {}, {}, string, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & {
            beforeCreate?: (() => void) | (() => void)[];
            created?: (() => void) | (() => void)[];
            beforeMount?: (() => void) | (() => void)[];
            mounted?: (() => void) | (() => void)[];
            beforeUpdate?: (() => void) | (() => void)[];
            updated?: (() => void) | (() => void)[];
            activated?: (() => void) | (() => void)[];
            deactivated?: (() => void) | (() => void)[];
            beforeDestroy?: (() => void) | (() => void)[];
            beforeUnmount?: (() => void) | (() => void)[];
            destroyed?: (() => void) | (() => void)[];
            unmounted?: (() => void) | (() => void)[];
            renderTracked?: ((e: import('vue').DebuggerEvent) => void) | ((e: import('vue').DebuggerEvent) => void)[];
            renderTriggered?: ((e: import('vue').DebuggerEvent) => void) | ((e: import('vue').DebuggerEvent) => void)[];
            errorCaptured?: ((err: unknown, instance: import('vue').ComponentPublicInstance | null, info: string) => boolean | void) | ((err: unknown, instance: import('vue').ComponentPublicInstance | null, info: string) => boolean | void)[];
        };
        $forceUpdate: () => void;
        $nextTick: typeof import('vue').nextTick;
        $watch<T extends string | ((...args: any) => any)>(source: T, cb: T extends (...args: any) => infer R ? (...args: [R, R, import('@vue/reactivity').OnCleanup]) => any : (...args: [any, any, import('@vue/reactivity').OnCleanup]) => any, options?: import('vue').WatchOptions): import('vue').WatchStopHandle;
    } & Readonly<{}> & Omit<Readonly<{
        value: DataBindingObject;
        option: MultiPointBindingConfig;
        modelConfig?: import('../components/dataBinder/DataBindingTypes').DataModelBindingConfig;
        showModelList?: boolean;
        dynamicHeight?: boolean;
    }> & Readonly<{
        onChange?: ((config: DataBindingObject) => any) | undefined;
    }>, "buildFromSingleBindingReference" | "getSingleBindingReference"> & import('vue').ShallowUnwrapRef<{
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
    }> & {} & import('vue').ComponentCustomProperties & {} & {
        $slots: {
            default?(_: {
                cpntId: number;
                pointBinding: import('../components/dataBinder/DataBindingTypes').BindedPoint | {
                    cpntId: number;
                    innerName?: string;
                    bindingType: undefined;
                } | undefined;
                config: import('../components/dataBinder/DataBindingTypes').SinglePointBindingConfig & {
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
                pointBinding: import('../components/dataBinder/DataBindingTypes').BindedPoint | {
                    cpntId: number;
                    innerName?: string;
                    bindingType: undefined;
                } | undefined;
                config: import('../components/dataBinder/DataBindingTypes').SinglePointBindingConfig & {
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
    }) | null;
}, HTMLDivElement>;
export default _default;
