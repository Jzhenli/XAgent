import { nextTick } from 'vue';
import { scheduleItem } from '@x-plateform-mono/service/dist/scheduleService';
type __VLS_Props = {
    scheduleDisplayItem: scheduleItem;
    editable?: boolean;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    scheduleDetailContainerItem: ({
        $: import('vue').ComponentInternalInstance;
        $data: {};
        $props: {
            readonly lines: {
                title: string;
                showIdx?: boolean;
                canEdit?: boolean;
                value?: string;
                priority?: string;
                isWeek?: boolean;
                valueType?: number;
                dataList: {
                    time: string;
                    value: number | string;
                }[];
            }[];
            readonly min?: number | undefined;
            readonly max?: number | undefined;
            readonly onEditLine?: ((value?: number | undefined) => any) | undefined;
            readonly onDeleteLine?: ((value?: number | undefined) => any) | undefined;
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
        $emit: ((event: "editLine", value?: number | undefined) => void) & ((event: "deleteLine", value?: number | undefined) => void);
        $el: HTMLDivElement;
        $options: import('vue').ComponentOptionsBase<Readonly<{
            lines: {
                title: string;
                showIdx?: boolean;
                canEdit?: boolean;
                value?: string;
                priority?: string;
                isWeek?: boolean;
                valueType?: number;
                dataList: {
                    time: string;
                    value: number | string;
                }[];
            }[];
            min?: number;
            max?: number;
        }> & Readonly<{
            onEditLine?: ((value?: number | undefined) => any) | undefined;
            onDeleteLine?: ((value?: number | undefined) => any) | undefined;
        }>, {
            closeExpandLine: () => void;
        }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
            editLine: (value?: number | undefined) => any;
            deleteLine: (value?: number | undefined) => any;
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
        $nextTick: typeof nextTick;
        $watch<T extends string | ((...args: any) => any)>(source: T, cb: T extends (...args: any) => infer R ? (...args: [R, R, import('@vue/reactivity').OnCleanup]) => any : (...args: [any, any, import('@vue/reactivity').OnCleanup]) => any, options?: import('vue').WatchOptions): import('vue').WatchStopHandle;
    } & Readonly<{}> & Omit<Readonly<{
        lines: {
            title: string;
            showIdx?: boolean;
            canEdit?: boolean;
            value?: string;
            priority?: string;
            isWeek?: boolean;
            valueType?: number;
            dataList: {
                time: string;
                value: number | string;
            }[];
        }[];
        min?: number;
        max?: number;
    }> & Readonly<{
        onEditLine?: ((value?: number | undefined) => any) | undefined;
        onDeleteLine?: ((value?: number | undefined) => any) | undefined;
    }>, "closeExpandLine"> & import('vue').ShallowUnwrapRef<{
        closeExpandLine: () => void;
    }> & {} & import('vue').ComponentCustomProperties & {} & {
        $slots: {
            'data-display'?(_: {
                data: {
                    time: string;
                    value: number | string;
                };
                minMax: (number | undefined)[];
            }): any;
        };
    }) | null;
}, HTMLDivElement>;
export default _default;
