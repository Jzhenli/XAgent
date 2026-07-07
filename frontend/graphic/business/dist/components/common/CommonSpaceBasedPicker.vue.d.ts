import { treeNodeParam } from '@x-plateform-mono/common/dist/components/tree/BasicTree';
import { spaceItem } from '@x-plateform-mono/service/dist/spaceService';
type __VLS_Props = {
    width?: number;
    height?: number;
    title?: string;
    listBySpace: ((spaceId: string) => Promise<{
        reference: string;
        name: string;
    }[]>);
    selected?: string;
    getSpaceIdBySelected?: ((selected: string) => Promise<string>);
    spaceId?: string;
    editable?: boolean;
    clearBtn?: boolean;
    onClose: (...params: any) => void;
};
declare const spaceItem: import('vue').Ref<import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
    selectedNode?: string;
    isOpenTo?: boolean;
    filterText?: string;
    disableSelect?: boolean;
    nodeStyle?: "xd" | "x-theme-1";
}> & Readonly<{
    onOnNodeClick?: ((value: treeNodeParam) => any) | undefined;
    onOnNodeContextMenu?: ((evt: MouseEvent, data: treeNodeParam) => any) | undefined;
    onSelectedItemNotFound?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any) | undefined;
    onOnNodeLoaded?: ((value: HTMLDivElement, data: treeNodeParam) => any) | undefined;
    onReady?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any) | undefined;
}>, {
    updateTree: (callback?: () => void) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
    selectNode: (spaceId: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
    openToNode: (spaceId: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
    clearSelected: () => void;
    ancestors: import('vue').Ref<{
        spaceId: string;
        name: string;
        type: string;
        hasChild: boolean;
        spaceType?: string | undefined;
    }[], spaceItem[] | {
        spaceId: string;
        name: string;
        type: string;
        hasChild: boolean;
        spaceType?: string | undefined;
    }[]>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    onNodeClick: (value: treeNodeParam) => any;
    onNodeContextMenu: (evt: MouseEvent, data: treeNodeParam) => any;
    selectedItemNotFound: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any;
    onNodeLoaded: (value: HTMLDivElement, data: treeNodeParam) => any;
    ready: (value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any;
}, import('vue').PublicProps, {}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {
    simpleAsyncTree: ({
        $: import('vue').ComponentInternalInstance;
        $data: {};
        $props: {
            readonly selectedNode?: string | undefined;
            readonly isOpenTo?: boolean | undefined;
            readonly filterText?: string | undefined;
            readonly getChildren: (id?: string, item?: any) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataTypeSimple[]>;
            readonly getAncestors: (id: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataTypeSimple[]>;
            readonly disableSelect?: boolean | undefined;
            readonly nodeStyle?: "xd" | "x-theme-1" | undefined;
            readonly onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined | undefined;
            readonly onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined | undefined;
            readonly onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined | undefined;
            readonly onSelectedItemNotFound?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any) | undefined | undefined;
            readonly onReady?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any) | undefined | undefined;
        } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps;
        $attrs: import('vue').Attrs;
        $refs: {
            [x: string]: unknown;
        } & {
            simpleTree: ({
                $: import('vue').ComponentInternalInstance;
                $data: {};
                $props: {
                    readonly treeData: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[];
                    readonly getChildren?: ((item: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>) | undefined;
                    readonly levelShift?: number | undefined;
                    readonly filterText?: string | undefined;
                    readonly disableSelect?: boolean | undefined;
                    readonly nodeStyle?: "xd" | "x-theme-1" | undefined;
                    readonly treeBackground?: boolean | undefined;
                    readonly onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam, evt: MouseEvent) => any) | undefined;
                    readonly onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
                    readonly onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
                } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps;
                $attrs: import('vue').Attrs;
                $refs: {
                    [x: string]: unknown;
                } & {
                    simpleTreeContainer: HTMLDivElement;
                };
                $slots: Readonly<{
                    [name: string]: import('vue').Slot<any> | undefined;
                }>;
                $root: import('vue').ComponentPublicInstance | null;
                $parent: import('vue').ComponentPublicInstance | null;
                $host: Element | null;
                $emit: ((event: "onNodeClick", value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam, evt: MouseEvent) => void) & ((event: "onNodeContextMenu", evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => void) & ((event: "onNodeLoaded", value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => void);
                $el: HTMLDivElement;
                $options: import('vue').ComponentOptionsBase<Readonly<{
                    treeData: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[];
                    getChildren?: (item: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
                    levelShift?: number;
                    filterText?: string;
                    disableSelect?: boolean;
                    nodeStyle?: "xd" | "x-theme-1";
                    treeBackground?: boolean;
                }> & Readonly<{
                    onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam, evt: MouseEvent) => any) | undefined;
                    onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
                    onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
                }>, {
                    scrollToNode: (nodePath: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => Promise<void>;
                }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
                    onNodeClick: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam, evt: MouseEvent) => any;
                    onNodeContextMenu: (evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
                    onNodeLoaded: (value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
                }, string, {
                    levelShift: number;
                    nodeStyle: "xd" | "x-theme-1";
                    treeBackground: boolean;
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
                levelShift: number;
                nodeStyle: "xd" | "x-theme-1";
                treeBackground: boolean;
            }> & Omit<Readonly<{
                treeData: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[];
                getChildren?: (item: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
                levelShift?: number;
                filterText?: string;
                disableSelect?: boolean;
                nodeStyle?: "xd" | "x-theme-1";
                treeBackground?: boolean;
            }> & Readonly<{
                onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam, evt: MouseEvent) => any) | undefined;
                onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
                onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
            }>, "scrollToNode" | ("levelShift" | "nodeStyle" | "treeBackground")> & import('vue').ShallowUnwrapRef<{
                scrollToNode: (nodePath: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => Promise<void>;
            }> & {} & import('vue').ComponentCustomProperties & {} & {
                $slots: {
                    backgroud?(_: {}): any;
                    default?(_: {
                        item: any;
                        level: any;
                        action: {
                            expand: () => Promise<void>;
                            collapse: () => void;
                            loadChildren: () => Promise<void>;
                            loadAllData(expand?: boolean): Promise<void>;
                            execRecrusive: (action: (item: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => void) => void;
                        };
                        index: any;
                        ancestors: any;
                    }): any;
                };
            }) | null;
        };
        $slots: Readonly<{
            [name: string]: import('vue').Slot<any> | undefined;
        }>;
        $root: import('vue').ComponentPublicInstance | null;
        $parent: import('vue').ComponentPublicInstance | null;
        $host: Element | null;
        $emit: ((event: "onNodeClick", value: treeNodeParam) => void) & ((event: "onNodeContextMenu", evt: MouseEvent, data: treeNodeParam) => void) & ((event: "selectedItemNotFound", value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => void) & ((event: "onNodeLoaded", value: HTMLDivElement, data: treeNodeParam) => void) & ((event: "ready", value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => void);
        $el: HTMLDivElement;
        $options: import('vue').ComponentOptionsBase<Readonly<{
            selectedNode?: string;
            isOpenTo?: boolean;
            filterText?: string;
            getChildren: (id?: string, item?: any) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataTypeSimple[]>;
            getAncestors: (id: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataTypeSimple[]>;
            disableSelect?: boolean;
            nodeStyle?: "xd" | "x-theme-1";
        }> & Readonly<{
            onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
            onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
            onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
            onSelectedItemNotFound?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any) | undefined;
            onReady?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any) | undefined;
        }>, {
            updateTree: (callback?: (list: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => void) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
            selectNode: (id: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
            openToNode: (id: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
            clearSelected: () => void;
        }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
            onNodeClick: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
            onNodeContextMenu: (evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
            onNodeLoaded: (value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
            selectedItemNotFound: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any;
            ready: (value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any;
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
        selectedNode?: string;
        isOpenTo?: boolean;
        filterText?: string;
        getChildren: (id?: string, item?: any) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataTypeSimple[]>;
        getAncestors: (id: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataTypeSimple[]>;
        disableSelect?: boolean;
        nodeStyle?: "xd" | "x-theme-1";
    }> & Readonly<{
        onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
        onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
        onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
        onSelectedItemNotFound?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any) | undefined;
        onReady?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any) | undefined;
    }>, "updateTree" | "selectNode" | "openToNode" | "clearSelected"> & import('vue').ShallowUnwrapRef<{
        updateTree: (callback?: (list: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => void) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
        selectNode: (id: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
        openToNode: (id: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
        clearSelected: () => void;
    }> & {} & import('vue').ComponentCustomProperties & {} & {
        $slots: {
            default?(_: {
                item: any;
                level: any;
                action: {
                    expand: () => Promise<void>;
                    collapse: () => void;
                    loadChildren: () => Promise<void>;
                    loadAllData(expand?: boolean): Promise<void>;
                    execRecrusive: (action: (item: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => void) => void;
                };
                index: any;
                ancestors: any;
            }): any;
        };
    }) | null;
}, HTMLDivElement, import('vue').ComponentProvideOptions, {
    P: {};
    B: {};
    D: {};
    C: {};
    M: {};
    Defaults: {};
}, Readonly<{
    selectedNode?: string;
    isOpenTo?: boolean;
    filterText?: string;
    disableSelect?: boolean;
    nodeStyle?: "xd" | "x-theme-1";
}> & Readonly<{
    onOnNodeClick?: ((value: treeNodeParam) => any) | undefined;
    onOnNodeContextMenu?: ((evt: MouseEvent, data: treeNodeParam) => any) | undefined;
    onSelectedItemNotFound?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any) | undefined;
    onOnNodeLoaded?: ((value: HTMLDivElement, data: treeNodeParam) => any) | undefined;
    onReady?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any) | undefined;
}>, {
    updateTree: (callback?: () => void) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
    selectNode: (spaceId: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
    openToNode: (spaceId: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
    clearSelected: () => void;
    ancestors: import('vue').Ref<{
        spaceId: string;
        name: string;
        type: string;
        hasChild: boolean;
        spaceType?: string | undefined;
    }[], spaceItem[] | {
        spaceId: string;
        name: string;
        type: string;
        hasChild: boolean;
        spaceType?: string | undefined;
    }[]>;
}, {}, {}, {}, {}> | undefined, import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
    selectedNode?: string;
    isOpenTo?: boolean;
    filterText?: string;
    disableSelect?: boolean;
    nodeStyle?: "xd" | "x-theme-1";
}> & Readonly<{
    onOnNodeClick?: ((value: treeNodeParam) => any) | undefined;
    onOnNodeContextMenu?: ((evt: MouseEvent, data: treeNodeParam) => any) | undefined;
    onSelectedItemNotFound?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any) | undefined;
    onOnNodeLoaded?: ((value: HTMLDivElement, data: treeNodeParam) => any) | undefined;
    onReady?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any) | undefined;
}>, {
    updateTree: (callback?: () => void) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
    selectNode: (spaceId: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
    openToNode: (spaceId: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
    clearSelected: () => void;
    ancestors: import('vue').Ref<{
        spaceId: string;
        name: string;
        type: string;
        hasChild: boolean;
        spaceType?: string | undefined;
    }[], spaceItem[] | {
        spaceId: string;
        name: string;
        type: string;
        hasChild: boolean;
        spaceType?: string | undefined;
    }[]>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    onNodeClick: (value: treeNodeParam) => any;
    onNodeContextMenu: (evt: MouseEvent, data: treeNodeParam) => any;
    selectedItemNotFound: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any;
    onNodeLoaded: (value: HTMLDivElement, data: treeNodeParam) => any;
    ready: (value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any;
}, import('vue').PublicProps, {}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {
    simpleAsyncTree: ({
        $: import('vue').ComponentInternalInstance;
        $data: {};
        $props: {
            readonly selectedNode?: string | undefined;
            readonly isOpenTo?: boolean | undefined;
            readonly filterText?: string | undefined;
            readonly getChildren: (id?: string, item?: any) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataTypeSimple[]>;
            readonly getAncestors: (id: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataTypeSimple[]>;
            readonly disableSelect?: boolean | undefined;
            readonly nodeStyle?: "xd" | "x-theme-1" | undefined;
            readonly onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined | undefined;
            readonly onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined | undefined;
            readonly onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined | undefined;
            readonly onSelectedItemNotFound?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any) | undefined | undefined;
            readonly onReady?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any) | undefined | undefined;
        } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps;
        $attrs: import('vue').Attrs;
        $refs: {
            [x: string]: unknown;
        } & {
            simpleTree: ({
                $: import('vue').ComponentInternalInstance;
                $data: {};
                $props: {
                    readonly treeData: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[];
                    readonly getChildren?: ((item: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>) | undefined;
                    readonly levelShift?: number | undefined;
                    readonly filterText?: string | undefined;
                    readonly disableSelect?: boolean | undefined;
                    readonly nodeStyle?: "xd" | "x-theme-1" | undefined;
                    readonly treeBackground?: boolean | undefined;
                    readonly onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam, evt: MouseEvent) => any) | undefined;
                    readonly onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
                    readonly onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
                } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps;
                $attrs: import('vue').Attrs;
                $refs: {
                    [x: string]: unknown;
                } & {
                    simpleTreeContainer: HTMLDivElement;
                };
                $slots: Readonly<{
                    [name: string]: import('vue').Slot<any> | undefined;
                }>;
                $root: import('vue').ComponentPublicInstance | null;
                $parent: import('vue').ComponentPublicInstance | null;
                $host: Element | null;
                $emit: ((event: "onNodeClick", value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam, evt: MouseEvent) => void) & ((event: "onNodeContextMenu", evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => void) & ((event: "onNodeLoaded", value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => void);
                $el: HTMLDivElement;
                $options: import('vue').ComponentOptionsBase<Readonly<{
                    treeData: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[];
                    getChildren?: (item: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
                    levelShift?: number;
                    filterText?: string;
                    disableSelect?: boolean;
                    nodeStyle?: "xd" | "x-theme-1";
                    treeBackground?: boolean;
                }> & Readonly<{
                    onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam, evt: MouseEvent) => any) | undefined;
                    onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
                    onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
                }>, {
                    scrollToNode: (nodePath: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => Promise<void>;
                }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
                    onNodeClick: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam, evt: MouseEvent) => any;
                    onNodeContextMenu: (evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
                    onNodeLoaded: (value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
                }, string, {
                    levelShift: number;
                    nodeStyle: "xd" | "x-theme-1";
                    treeBackground: boolean;
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
                levelShift: number;
                nodeStyle: "xd" | "x-theme-1";
                treeBackground: boolean;
            }> & Omit<Readonly<{
                treeData: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[];
                getChildren?: (item: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
                levelShift?: number;
                filterText?: string;
                disableSelect?: boolean;
                nodeStyle?: "xd" | "x-theme-1";
                treeBackground?: boolean;
            }> & Readonly<{
                onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam, evt: MouseEvent) => any) | undefined;
                onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
                onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
            }>, "scrollToNode" | ("levelShift" | "nodeStyle" | "treeBackground")> & import('vue').ShallowUnwrapRef<{
                scrollToNode: (nodePath: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => Promise<void>;
            }> & {} & import('vue').ComponentCustomProperties & {} & {
                $slots: {
                    backgroud?(_: {}): any;
                    default?(_: {
                        item: any;
                        level: any;
                        action: {
                            expand: () => Promise<void>;
                            collapse: () => void;
                            loadChildren: () => Promise<void>;
                            loadAllData(expand?: boolean): Promise<void>;
                            execRecrusive: (action: (item: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => void) => void;
                        };
                        index: any;
                        ancestors: any;
                    }): any;
                };
            }) | null;
        };
        $slots: Readonly<{
            [name: string]: import('vue').Slot<any> | undefined;
        }>;
        $root: import('vue').ComponentPublicInstance | null;
        $parent: import('vue').ComponentPublicInstance | null;
        $host: Element | null;
        $emit: ((event: "onNodeClick", value: treeNodeParam) => void) & ((event: "onNodeContextMenu", evt: MouseEvent, data: treeNodeParam) => void) & ((event: "selectedItemNotFound", value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => void) & ((event: "onNodeLoaded", value: HTMLDivElement, data: treeNodeParam) => void) & ((event: "ready", value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => void);
        $el: HTMLDivElement;
        $options: import('vue').ComponentOptionsBase<Readonly<{
            selectedNode?: string;
            isOpenTo?: boolean;
            filterText?: string;
            getChildren: (id?: string, item?: any) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataTypeSimple[]>;
            getAncestors: (id: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataTypeSimple[]>;
            disableSelect?: boolean;
            nodeStyle?: "xd" | "x-theme-1";
        }> & Readonly<{
            onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
            onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
            onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
            onSelectedItemNotFound?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any) | undefined;
            onReady?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any) | undefined;
        }>, {
            updateTree: (callback?: (list: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => void) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
            selectNode: (id: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
            openToNode: (id: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
            clearSelected: () => void;
        }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
            onNodeClick: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
            onNodeContextMenu: (evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
            onNodeLoaded: (value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
            selectedItemNotFound: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any;
            ready: (value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any;
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
        selectedNode?: string;
        isOpenTo?: boolean;
        filterText?: string;
        getChildren: (id?: string, item?: any) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataTypeSimple[]>;
        getAncestors: (id: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataTypeSimple[]>;
        disableSelect?: boolean;
        nodeStyle?: "xd" | "x-theme-1";
    }> & Readonly<{
        onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
        onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
        onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
        onSelectedItemNotFound?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any) | undefined;
        onReady?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any) | undefined;
    }>, "updateTree" | "selectNode" | "openToNode" | "clearSelected"> & import('vue').ShallowUnwrapRef<{
        updateTree: (callback?: (list: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => void) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
        selectNode: (id: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
        openToNode: (id: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
        clearSelected: () => void;
    }> & {} & import('vue').ComponentCustomProperties & {} & {
        $slots: {
            default?(_: {
                item: any;
                level: any;
                action: {
                    expand: () => Promise<void>;
                    collapse: () => void;
                    loadChildren: () => Promise<void>;
                    loadAllData(expand?: boolean): Promise<void>;
                    execRecrusive: (action: (item: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => void) => void;
                };
                index: any;
                ancestors: any;
            }): any;
        };
    }) | null;
}, HTMLDivElement, import('vue').ComponentProvideOptions, {
    P: {};
    B: {};
    D: {};
    C: {};
    M: {};
    Defaults: {};
}, Readonly<{
    selectedNode?: string;
    isOpenTo?: boolean;
    filterText?: string;
    disableSelect?: boolean;
    nodeStyle?: "xd" | "x-theme-1";
}> & Readonly<{
    onOnNodeClick?: ((value: treeNodeParam) => any) | undefined;
    onOnNodeContextMenu?: ((evt: MouseEvent, data: treeNodeParam) => any) | undefined;
    onSelectedItemNotFound?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any) | undefined;
    onOnNodeLoaded?: ((value: HTMLDivElement, data: treeNodeParam) => any) | undefined;
    onReady?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any) | undefined;
}>, {
    updateTree: (callback?: () => void) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
    selectNode: (spaceId: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
    openToNode: (spaceId: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
    clearSelected: () => void;
    ancestors: import('vue').Ref<{
        spaceId: string;
        name: string;
        type: string;
        hasChild: boolean;
        spaceType?: string | undefined;
    }[], spaceItem[] | {
        spaceId: string;
        name: string;
        type: string;
        hasChild: boolean;
        spaceType?: string | undefined;
    }[]>;
}, {}, {}, {}, {}> | undefined>;
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    clearBtn: boolean;
    width: number;
    height: number;
    title: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    spaceItem: import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
        selectedNode?: string;
        isOpenTo?: boolean;
        filterText?: string;
        disableSelect?: boolean;
        nodeStyle?: "xd" | "x-theme-1";
    }> & Readonly<{
        onOnNodeClick?: ((value: treeNodeParam) => any) | undefined;
        onOnNodeContextMenu?: ((evt: MouseEvent, data: treeNodeParam) => any) | undefined;
        onSelectedItemNotFound?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any) | undefined;
        onOnNodeLoaded?: ((value: HTMLDivElement, data: treeNodeParam) => any) | undefined;
        onReady?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any) | undefined;
    }>, {
        updateTree: (callback?: () => void) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
        selectNode: (spaceId: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
        openToNode: (spaceId: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
        clearSelected: () => void;
        ancestors: import('vue').Ref<{
            spaceId: string;
            name: string;
            type: string;
            hasChild: boolean;
            spaceType?: string | undefined;
        }[], spaceItem[] | {
            spaceId: string;
            name: string;
            type: string;
            hasChild: boolean;
            spaceType?: string | undefined;
        }[]>;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
        onNodeClick: (value: treeNodeParam) => any;
        onNodeContextMenu: (evt: MouseEvent, data: treeNodeParam) => any;
        selectedItemNotFound: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any;
        onNodeLoaded: (value: HTMLDivElement, data: treeNodeParam) => any;
        ready: (value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any;
    }, import('vue').PublicProps, {}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {
        simpleAsyncTree: ({
            $: import('vue').ComponentInternalInstance;
            $data: {};
            $props: {
                readonly selectedNode?: string | undefined;
                readonly isOpenTo?: boolean | undefined;
                readonly filterText?: string | undefined;
                readonly getChildren: (id?: string, item?: any) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataTypeSimple[]>;
                readonly getAncestors: (id: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataTypeSimple[]>;
                readonly disableSelect?: boolean | undefined;
                readonly nodeStyle?: "xd" | "x-theme-1" | undefined;
                readonly onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined | undefined;
                readonly onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined | undefined;
                readonly onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined | undefined;
                readonly onSelectedItemNotFound?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any) | undefined | undefined;
                readonly onReady?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any) | undefined | undefined;
            } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps;
            $attrs: import('vue').Attrs;
            $refs: {
                [x: string]: unknown;
            } & {
                simpleTree: ({
                    $: import('vue').ComponentInternalInstance;
                    $data: {};
                    $props: {
                        readonly treeData: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[];
                        readonly getChildren?: ((item: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>) | undefined;
                        readonly levelShift?: number | undefined;
                        readonly filterText?: string | undefined;
                        readonly disableSelect?: boolean | undefined;
                        readonly nodeStyle?: "xd" | "x-theme-1" | undefined;
                        readonly treeBackground?: boolean | undefined;
                        readonly onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam, evt: MouseEvent) => any) | undefined;
                        readonly onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
                        readonly onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
                    } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps;
                    $attrs: import('vue').Attrs;
                    $refs: {
                        [x: string]: unknown;
                    } & {
                        simpleTreeContainer: HTMLDivElement;
                    };
                    $slots: Readonly<{
                        [name: string]: import('vue').Slot<any> | undefined;
                    }>;
                    $root: import('vue').ComponentPublicInstance | null;
                    $parent: import('vue').ComponentPublicInstance | null;
                    $host: Element | null;
                    $emit: ((event: "onNodeClick", value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam, evt: MouseEvent) => void) & ((event: "onNodeContextMenu", evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => void) & ((event: "onNodeLoaded", value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => void);
                    $el: HTMLDivElement;
                    $options: import('vue').ComponentOptionsBase<Readonly<{
                        treeData: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[];
                        getChildren?: (item: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
                        levelShift?: number;
                        filterText?: string;
                        disableSelect?: boolean;
                        nodeStyle?: "xd" | "x-theme-1";
                        treeBackground?: boolean;
                    }> & Readonly<{
                        onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam, evt: MouseEvent) => any) | undefined;
                        onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
                        onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
                    }>, {
                        scrollToNode: (nodePath: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => Promise<void>;
                    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
                        onNodeClick: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam, evt: MouseEvent) => any;
                        onNodeContextMenu: (evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
                        onNodeLoaded: (value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
                    }, string, {
                        levelShift: number;
                        nodeStyle: "xd" | "x-theme-1";
                        treeBackground: boolean;
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
                    levelShift: number;
                    nodeStyle: "xd" | "x-theme-1";
                    treeBackground: boolean;
                }> & Omit<Readonly<{
                    treeData: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[];
                    getChildren?: (item: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
                    levelShift?: number;
                    filterText?: string;
                    disableSelect?: boolean;
                    nodeStyle?: "xd" | "x-theme-1";
                    treeBackground?: boolean;
                }> & Readonly<{
                    onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam, evt: MouseEvent) => any) | undefined;
                    onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
                    onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
                }>, "scrollToNode" | ("levelShift" | "nodeStyle" | "treeBackground")> & import('vue').ShallowUnwrapRef<{
                    scrollToNode: (nodePath: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => Promise<void>;
                }> & {} & import('vue').ComponentCustomProperties & {} & {
                    $slots: {
                        backgroud?(_: {}): any;
                        default?(_: {
                            item: any;
                            level: any;
                            action: {
                                expand: () => Promise<void>;
                                collapse: () => void;
                                loadChildren: () => Promise<void>;
                                loadAllData(expand?: boolean): Promise<void>;
                                execRecrusive: (action: (item: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => void) => void;
                            };
                            index: any;
                            ancestors: any;
                        }): any;
                    };
                }) | null;
            };
            $slots: Readonly<{
                [name: string]: import('vue').Slot<any> | undefined;
            }>;
            $root: import('vue').ComponentPublicInstance | null;
            $parent: import('vue').ComponentPublicInstance | null;
            $host: Element | null;
            $emit: ((event: "onNodeClick", value: treeNodeParam) => void) & ((event: "onNodeContextMenu", evt: MouseEvent, data: treeNodeParam) => void) & ((event: "selectedItemNotFound", value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => void) & ((event: "onNodeLoaded", value: HTMLDivElement, data: treeNodeParam) => void) & ((event: "ready", value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => void);
            $el: HTMLDivElement;
            $options: import('vue').ComponentOptionsBase<Readonly<{
                selectedNode?: string;
                isOpenTo?: boolean;
                filterText?: string;
                getChildren: (id?: string, item?: any) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataTypeSimple[]>;
                getAncestors: (id: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataTypeSimple[]>;
                disableSelect?: boolean;
                nodeStyle?: "xd" | "x-theme-1";
            }> & Readonly<{
                onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
                onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
                onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
                onSelectedItemNotFound?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any) | undefined;
                onReady?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any) | undefined;
            }>, {
                updateTree: (callback?: (list: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => void) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
                selectNode: (id: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
                openToNode: (id: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
                clearSelected: () => void;
            }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
                onNodeClick: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
                onNodeContextMenu: (evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
                onNodeLoaded: (value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
                selectedItemNotFound: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any;
                ready: (value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any;
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
            selectedNode?: string;
            isOpenTo?: boolean;
            filterText?: string;
            getChildren: (id?: string, item?: any) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataTypeSimple[]>;
            getAncestors: (id: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataTypeSimple[]>;
            disableSelect?: boolean;
            nodeStyle?: "xd" | "x-theme-1";
        }> & Readonly<{
            onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
            onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
            onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
            onSelectedItemNotFound?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any) | undefined;
            onReady?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any) | undefined;
        }>, "updateTree" | "selectNode" | "openToNode" | "clearSelected"> & import('vue').ShallowUnwrapRef<{
            updateTree: (callback?: (list: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => void) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
            selectNode: (id: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
            openToNode: (id: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
            clearSelected: () => void;
        }> & {} & import('vue').ComponentCustomProperties & {} & {
            $slots: {
                default?(_: {
                    item: any;
                    level: any;
                    action: {
                        expand: () => Promise<void>;
                        collapse: () => void;
                        loadChildren: () => Promise<void>;
                        loadAllData(expand?: boolean): Promise<void>;
                        execRecrusive: (action: (item: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => void) => void;
                    };
                    index: any;
                    ancestors: any;
                }): any;
            };
        }) | null;
    }, HTMLDivElement, import('vue').ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<{
        selectedNode?: string;
        isOpenTo?: boolean;
        filterText?: string;
        disableSelect?: boolean;
        nodeStyle?: "xd" | "x-theme-1";
    }> & Readonly<{
        onOnNodeClick?: ((value: treeNodeParam) => any) | undefined;
        onOnNodeContextMenu?: ((evt: MouseEvent, data: treeNodeParam) => any) | undefined;
        onSelectedItemNotFound?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any) | undefined;
        onOnNodeLoaded?: ((value: HTMLDivElement, data: treeNodeParam) => any) | undefined;
        onReady?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any) | undefined;
    }>, {
        updateTree: (callback?: () => void) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
        selectNode: (spaceId: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
        openToNode: (spaceId: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
        clearSelected: () => void;
        ancestors: import('vue').Ref<{
            spaceId: string;
            name: string;
            type: string;
            hasChild: boolean;
            spaceType?: string | undefined;
        }[], spaceItem[] | {
            spaceId: string;
            name: string;
            type: string;
            hasChild: boolean;
            spaceType?: string | undefined;
        }[]>;
    }, {}, {}, {}, {}> | null;
}, HTMLDivElement>;
export default _default;
