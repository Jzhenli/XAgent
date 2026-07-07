type __VLS_Props = {
    onClose: () => void;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    listPanelItem: ({
        $: import('vue').ComponentInternalInstance;
        $data: {};
        $props: {
            readonly dataList: any[];
            readonly title?: string | undefined;
            readonly getName?: ((item: any) => string) | undefined;
            readonly addButton?: string | undefined;
            readonly getTags?: ((item: any) => string[]) | undefined;
            readonly filterOptions?: {
                label: string;
                value: string;
            }[] | undefined;
            readonly filterCallback?: ((item: any, selectedOpts: string[]) => boolean) | undefined;
            readonly sortable?: boolean | undefined;
            readonly renameAndDelete?: boolean | undefined;
            readonly renameAndDeletePermission?: boolean[] | undefined;
            readonly extraMenu?: any[] | ((item: any) => any) | undefined;
            readonly placeholder?: string | undefined;
            readonly inputMaxlength?: number | undefined;
            readonly inputPlaceholder?: string | undefined;
            readonly loading?: boolean | undefined;
            readonly onSelect?: ((item: any) => any) | undefined | undefined;
            readonly onDelete?: ((item: any) => any) | undefined | undefined;
            readonly onDblclick?: ((item: any) => any) | undefined | undefined;
            readonly onRename?: ((item: any, name: string) => any) | undefined | undefined;
            readonly onAddNew?: (() => any) | undefined | undefined;
            readonly onFilterChanged?: ((list: any[]) => any) | undefined | undefined;
            readonly onReorder?: ((list: any[]) => any) | undefined | undefined;
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
        $emit: ((event: "dblclick", item: any) => void) & ((event: "select", item: any) => void) & ((event: "delete", item: any) => void) & ((event: "rename", item: any, name: string) => void) & ((event: "addNew") => void) & ((event: "filterChanged", list: any[]) => void) & ((event: "reorder", list: any[]) => void);
        $el: HTMLDivElement;
        $options: import('vue').ComponentOptionsBase<Readonly<{
            dataList: any[];
            title?: string;
            getName?: (item: any) => string;
            addButton?: string;
            getTags?: (item: any) => string[];
            filterOptions?: {
                label: string;
                value: string;
            }[];
            filterCallback?: (item: any, selectedOpts: string[]) => boolean;
            sortable?: boolean;
            renameAndDelete?: boolean;
            renameAndDeletePermission?: boolean[];
            extraMenu?: any[] | ((item: any) => any);
            placeholder?: string;
            inputMaxlength?: number;
            inputPlaceholder?: string;
            loading?: boolean;
        }> & Readonly<{
            onSelect?: ((item: any) => any) | undefined;
            onDelete?: ((item: any) => any) | undefined;
            onDblclick?: ((item: any) => any) | undefined;
            onRename?: ((item: any, name: string) => any) | undefined;
            onAddNew?: (() => any) | undefined;
            onFilterChanged?: ((list: any[]) => any) | undefined;
            onReorder?: ((list: any[]) => any) | undefined;
        }>, {
            cancelSelect(): void;
            selectItem(item: any): void;
        }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
            select: (item: any) => any;
            delete: (item: any) => any;
            dblclick: (item: any) => any;
            rename: (item: any, name: string) => any;
            addNew: () => any;
            filterChanged: (list: any[]) => any;
            reorder: (list: any[]) => any;
        }, string, {
            title: string;
        }, {}, string, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & {
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
    } & Readonly<{
        title: string;
    }> & Omit<Readonly<{
        dataList: any[];
        title?: string;
        getName?: (item: any) => string;
        addButton?: string;
        getTags?: (item: any) => string[];
        filterOptions?: {
            label: string;
            value: string;
        }[];
        filterCallback?: (item: any, selectedOpts: string[]) => boolean;
        sortable?: boolean;
        renameAndDelete?: boolean;
        renameAndDeletePermission?: boolean[];
        extraMenu?: any[] | ((item: any) => any);
        placeholder?: string;
        inputMaxlength?: number;
        inputPlaceholder?: string;
        loading?: boolean;
    }> & Readonly<{
        onSelect?: ((item: any) => any) | undefined;
        onDelete?: ((item: any) => any) | undefined;
        onDblclick?: ((item: any) => any) | undefined;
        onRename?: ((item: any, name: string) => any) | undefined;
        onAddNew?: (() => any) | undefined;
        onFilterChanged?: ((list: any[]) => any) | undefined;
        onReorder?: ((list: any[]) => any) | undefined;
    }>, "title" | "cancelSelect" | "selectItem"> & import('vue').ShallowUnwrapRef<{
        cancelSelect(): void;
        selectItem(item: any): void;
    }> & {} & import('vue').ComponentCustomProperties & {} & {
        $slots: Partial<Record<"header", (_: {}) => any>> & {
            icon?(_: {}): any;
            default?(_: {
                item: any;
                index: number;
            }): any;
        };
    }) | null;
}, HTMLDivElement>;
export default _default;
