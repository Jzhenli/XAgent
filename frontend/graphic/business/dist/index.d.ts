import { openPresentValueSetter as openPresentValueSetter_0, setPresentValue as setPresentValue_0 } from './components/presentValueSetter/PresentValueSetter';
import { default as DataBindingManager_0 } from './components/dataBinder/DataBindingManager';
import { default as DataAccessManager_0 } from './components/dataBinder/DataAccessManager';
import { default as DataAccessSimulateManager_0 } from './components/dataBinder/DataAccessSimulateManager';
import { default as TagRenderManager_0 } from './components/tagPicker/TagRenderManager';
import { default as GraphicMulManager_0 } from './components/graphicMulPopup/GraphicMulManager';
export declare const openPresentValueSetter: typeof openPresentValueSetter_0;
export declare const setPresentValue: typeof setPresentValue_0;
export declare const i18nReady: import('vue').Ref<boolean, boolean>;
export declare const SpaceTree: import('vue').DefineComponent<{
    selectedNode?: string;
    isOpenTo?: boolean;
    filterText?: string;
    disableSelect?: boolean;
    nodeStyle?: "xd" | "x-theme-1";
}, {
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
    }[], import('@x-plateform-mono/service/dist/spaceService').spaceItem[] | {
        spaceId: string;
        name: string;
        type: string;
        hasChild: boolean;
        spaceType?: string | undefined;
    }[]>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    onNodeClick: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
    onNodeContextMenu: (evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
    selectedItemNotFound: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any;
    onNodeLoaded: (value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
    ready: (value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any;
}, string, import('vue').PublicProps, Readonly<{
    selectedNode?: string;
    isOpenTo?: boolean;
    filterText?: string;
    disableSelect?: boolean;
    nodeStyle?: "xd" | "x-theme-1";
}> & Readonly<{
    onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
    onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
    onSelectedItemNotFound?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any) | undefined;
    onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
    onReady?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
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
        $emit: ((event: "onNodeClick", value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => void) & ((event: "onNodeContextMenu", evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => void) & ((event: "selectedItemNotFound", value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => void) & ((event: "onNodeLoaded", value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => void) & ((event: "ready", value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => void);
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
}, HTMLDivElement>;
export declare const NetworkTree: import('vue').DefineComponent<{
    selectedNode?: string;
    isOpenTo?: boolean;
    filterText?: string;
    disableSelect?: boolean;
    disableSelCallback?: (param: any) => boolean;
    nodeStyle?: "xd" | "x-theme-1";
    getChildren?: (item?: import('@x-plateform-mono/service/dist/networkService').networkItem) => Promise<import('@x-plateform-mono/service/dist/networkService').networkItem[]>;
}, {
    updateTree: (callback?: () => void) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
    selectNode: (ref: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
    openToNode: (ref: string) => never[] | Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
    clearSelected: () => void;
    ancestors: import('vue').Ref<import('@x-plateform-mono/service/dist/networkService').networkItem[] | undefined, import('@x-plateform-mono/service/dist/networkService').networkItem[] | undefined>;
    getancestors: (ref?: string) => Promise<import('@x-plateform-mono/service/dist/networkService').networkItem[] | undefined>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    onNodeClick: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
    onNodeContextMenu: (evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
    selectedItemNotFound: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any;
    onNodeLoaded: (value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
    ready: (value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any;
}, string, import('vue').PublicProps, Readonly<{
    selectedNode?: string;
    isOpenTo?: boolean;
    filterText?: string;
    disableSelect?: boolean;
    disableSelCallback?: (param: any) => boolean;
    nodeStyle?: "xd" | "x-theme-1";
    getChildren?: (item?: import('@x-plateform-mono/service/dist/networkService').networkItem) => Promise<import('@x-plateform-mono/service/dist/networkService').networkItem[]>;
}> & Readonly<{
    onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
    onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
    onSelectedItemNotFound?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any) | undefined;
    onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
    onReady?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
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
        $emit: ((event: "onNodeClick", value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => void) & ((event: "onNodeContextMenu", evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => void) & ((event: "selectedItemNotFound", value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => void) & ((event: "onNodeLoaded", value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => void) & ((event: "ready", value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => void);
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
}, HTMLDivElement>;
export declare const NetworkTreeWithContextMenu: import('vue').DefineComponent<{
    networkRef?: string;
    onRenameClose?: (param?: any) => void;
    onDeleteClose?: (param?: any) => void;
    onAddClose?: (param?: any) => void;
    onScanClose?: (param?: any) => void;
}, {
    updateTree: (callback?: () => void) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
    selectNode: (ref: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
    openToNode: (ref: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
    clearSelected: () => void;
    getancestors: (ref?: string) => Promise<import('@x-plateform-mono/service/dist/networkService').networkItem[] | undefined> | undefined;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    onNodeClick: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
    selectedItemNotFound: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any;
    onNodeLoaded: (value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
    ready: (value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any;
}, string, import('vue').PublicProps, Readonly<{
    networkRef?: string;
    onRenameClose?: (param?: any) => void;
    onDeleteClose?: (param?: any) => void;
    onAddClose?: (param?: any) => void;
    onScanClose?: (param?: any) => void;
}> & Readonly<{
    onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
    onSelectedItemNotFound?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any) | undefined;
    onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
    onReady?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    networkTree: import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
        selectedNode?: string;
        isOpenTo?: boolean;
        filterText?: string;
        disableSelect?: boolean;
        disableSelCallback?: (param: any) => boolean;
        nodeStyle?: "xd" | "x-theme-1";
        getChildren?: (item?: import('@x-plateform-mono/service/dist/networkService').networkItem) => Promise<import('@x-plateform-mono/service/dist/networkService').networkItem[]>;
    }> & Readonly<{
        onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
        onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
        onSelectedItemNotFound?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any) | undefined;
        onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
        onReady?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any) | undefined;
    }>, {
        updateTree: (callback?: () => void) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
        selectNode: (ref: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
        openToNode: (ref: string) => never[] | Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
        clearSelected: () => void;
        ancestors: import('vue').Ref<import('@x-plateform-mono/service/dist/networkService').networkItem[] | undefined, import('@x-plateform-mono/service/dist/networkService').networkItem[] | undefined>;
        getancestors: (ref?: string) => Promise<import('@x-plateform-mono/service/dist/networkService').networkItem[] | undefined>;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
        onNodeClick: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
        onNodeContextMenu: (evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
        selectedItemNotFound: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any;
        onNodeLoaded: (value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
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
            $emit: ((event: "onNodeClick", value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => void) & ((event: "onNodeContextMenu", evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => void) & ((event: "selectedItemNotFound", value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => void) & ((event: "onNodeLoaded", value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => void) & ((event: "ready", value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => void);
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
        disableSelCallback?: (param: any) => boolean;
        nodeStyle?: "xd" | "x-theme-1";
        getChildren?: (item?: import('@x-plateform-mono/service/dist/networkService').networkItem) => Promise<import('@x-plateform-mono/service/dist/networkService').networkItem[]>;
    }> & Readonly<{
        onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
        onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
        onSelectedItemNotFound?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any) | undefined;
        onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
        onReady?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => any) | undefined;
    }>, {
        updateTree: (callback?: () => void) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
        selectNode: (ref: string) => Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
        openToNode: (ref: string) => never[] | Promise<import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]>;
        clearSelected: () => void;
        ancestors: import('vue').Ref<import('@x-plateform-mono/service/dist/networkService').networkItem[] | undefined, import('@x-plateform-mono/service/dist/networkService').networkItem[] | undefined>;
        getancestors: (ref?: string) => Promise<import('@x-plateform-mono/service/dist/networkService').networkItem[] | undefined>;
    }, {}, {}, {}, {}> | null;
}, any>;
export declare const EquipmentTemplateTree: import('vue').DefineComponent<{
    selectedNode?: string;
    isOpenTo?: boolean;
    filterText?: string;
    disableSelect?: boolean;
    nodeStyle?: "xd" | "x-theme-1";
}, {
    updateTree: (callback?: () => void) => void;
    selectNode: (spaceId: string) => void;
    openToNode: (spaceId: string) => void;
    clearSelected: () => void;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    onNodeClick: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
    onNodeContextMenu: (evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
    selectedItemNotFound: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any;
    onNodeLoaded: (value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any;
}, string, import('vue').PublicProps, Readonly<{
    selectedNode?: string;
    isOpenTo?: boolean;
    filterText?: string;
    disableSelect?: boolean;
    nodeStyle?: "xd" | "x-theme-1";
}> & Readonly<{
    onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
    onOnNodeContextMenu?: ((evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
    onSelectedItemNotFound?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any) | undefined;
    onOnNodeLoaded?: ((value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
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
        $emit: ((event: "onNodeClick", value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => void) & ((event: "onNodeContextMenu", evt: MouseEvent, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => void) & ((event: "selectedItemNotFound", value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => void) & ((event: "onNodeLoaded", value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeNodeParam) => void) & ((event: "ready", value: HTMLDivElement, data: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType[]) => void);
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
}, HTMLDivElement>;
export declare const EquipmentTemplatePicker: import('vue').DefineComponent<{
    selected?: string;
    editable?: boolean;
    title?: string;
    onClose: (data?: import('@x-plateform-mono/service/dist/equipmentService').EquipmentTemplate) => void;
}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{
    selected?: string;
    editable?: boolean;
    title?: string;
    onClose: (data?: import('@x-plateform-mono/service/dist/equipmentService').EquipmentTemplate) => void;
}> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    equipmentTemplateDetailItem: import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
        editable?: boolean;
    }> & Readonly<{
        onConfirm?: ((data: import('@x-plateform-mono/service/dist/equipmentService').EquipmentTemplate) => any) | undefined;
    }>, {
        showDetail: (itemRef: string) => void;
        closeDetail: () => void;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
        confirm: (data: import('@x-plateform-mono/service/dist/equipmentService').EquipmentTemplate) => any;
    }, import('vue').PublicProps, {}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {
        detailContainer: HTMLDivElement;
        tagRenderItem: (import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
            tagRenderManager?: TagRenderManager_0;
            pickerTitle?: string;
            hideLeaf?: Boolean;
            singleEnergyCheck?: Boolean;
            maxNum?: number;
            minNum?: number;
            editable?: boolean;
            tags: number[];
        }> & Readonly<{
            onChange?: ((value: number[]) => any) | undefined;
        }>, {
            edit: () => void;
        }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
            change: (value: number[]) => any;
        }, import('vue').PublicProps, {}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, HTMLDivElement, import('vue').ComponentProvideOptions, {
            P: {};
            B: {};
            D: {};
            C: {};
            M: {};
            Defaults: {};
        }, Readonly<{
            tagRenderManager?: TagRenderManager_0;
            pickerTitle?: string;
            hideLeaf?: Boolean;
            singleEnergyCheck?: Boolean;
            maxNum?: number;
            minNum?: number;
            editable?: boolean;
            tags: number[];
        }> & Readonly<{
            onChange?: ((value: number[]) => any) | undefined;
        }>, {
            edit: () => void;
        }, {}, {}, {}, {}> | null)[];
    }, HTMLDivElement, import('vue').ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<{
        editable?: boolean;
    }> & Readonly<{
        onConfirm?: ((data: import('@x-plateform-mono/service/dist/equipmentService').EquipmentTemplate) => any) | undefined;
    }>, {
        showDetail: (itemRef: string) => void;
        closeDetail: () => void;
    }, {}, {}, {}, {}> | null;
}, HTMLDivElement>;
export declare const EquipmentPicker: import('vue').DefineComponent<{
    selected?: string;
    spaceId?: string;
    templateRef?: string;
    editable?: boolean;
    clearBtn?: boolean;
    onClose: (...params: any) => void;
    isFilter?: boolean;
}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{
    selected?: string;
    spaceId?: string;
    templateRef?: string;
    editable?: boolean;
    clearBtn?: boolean;
    onClose: (...params: any) => void;
    isFilter?: boolean;
}> & Readonly<{}>, {
    clearBtn: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export declare const LogicRulePicker: import('vue').DefineComponent<{
    selected?: string;
    spaceId?: string;
    editable?: boolean;
    clearBtn?: boolean;
    onClose: (...params: any) => void;
}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{
    selected?: string;
    spaceId?: string;
    editable?: boolean;
    clearBtn?: boolean;
    onClose: (...params: any) => void;
}> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export declare const Schedule: import('vue').DefineComponent<{
    spaceId: string;
    scheduleReference?: string;
    mode?: string;
}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    onScheduleChanged: (value?: string | undefined) => any;
}, string, import('vue').PublicProps, Readonly<{
    spaceId: string;
    scheduleReference?: string;
    mode?: string;
}> & Readonly<{
    onOnScheduleChanged?: ((value?: string | undefined) => any) | undefined;
}>, {
    mode: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
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
export declare const ScheduleModal: import('vue').DefineComponent<{
    visible: boolean;
    data: {
        cron: string;
        editingNumber: string;
        selectedValue: string;
    };
    valueType: number;
    panelTitle?: string;
    onClose: () => void;
    confirm: (data: any) => void;
}, {
    getExpressionCorn: () => {
        cron: string;
        priority: string;
        value: string;
    };
    modalValid: () => boolean;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    cancel: () => any;
    close: () => any;
}, string, import('vue').PublicProps, Readonly<{
    visible: boolean;
    data: {
        cron: string;
        editingNumber: string;
        selectedValue: string;
    };
    valueType: number;
    panelTitle?: string;
    onClose: () => void;
    confirm: (data: any) => void;
}> & Readonly<{
    onCancel?: (() => any) | undefined;
    onClose?: (() => any) | undefined;
}>, {
    visible: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export declare const ScheduleRender: import('vue').DefineComponent<{
    scheduleSelected?: string;
    scheduleRefs: {
        system: string[];
        device: string[];
    };
    translationMap?: Map<number, string>;
    isScheduleItem?: boolean;
    editable?: boolean;
    inScaleablePanel?: boolean;
}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    systemScheduleLoaded: (value: string) => any;
}, string, import('vue').PublicProps, Readonly<{
    scheduleSelected?: string;
    scheduleRefs: {
        system: string[];
        device: string[];
    };
    translationMap?: Map<number, string>;
    isScheduleItem?: boolean;
    editable?: boolean;
    inScaleablePanel?: boolean;
}> & Readonly<{
    onSystemScheduleLoaded?: ((value: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export declare const CalendarRender: import('vue').DefineComponent<{
    calendarData: [import('@x-plateform-mono/service/dist/scheduleService').BACnetDate, import('@x-plateform-mono/service/dist/scheduleService').BACnetDate][];
}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{
    calendarData: [import('@x-plateform-mono/service/dist/scheduleService').BACnetDate, import('@x-plateform-mono/service/dist/scheduleService').BACnetDate][];
}> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export declare const KnxTypeTool: import('vue').DefineComponent<{
    item: any;
    mainTypeDisabled?: boolean;
    onClose: (success: boolean) => void;
    onSubmit: (value: string) => {};
}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{
    item: any;
    mainTypeDisabled?: boolean;
    onClose: (success: boolean) => void;
    onSubmit: (value: string) => {};
}> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export declare const WriteKNXTool: import('vue').DefineComponent<{
    item: any;
    onClose: (success: boolean, reference?: string) => void;
    onSubmit: (value: any) => void;
}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{
    item: any;
    onClose: (success: boolean, reference?: string) => void;
    onSubmit: (value: any) => void;
}> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    formContainer: ({
        $: import('vue').ComponentInternalInstance;
        $data: {};
        $props: Partial<{}> & Omit<{} & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps, never>;
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
        $emit: (event: string, ...args: any[]) => void;
        $el: HTMLDivElement;
        $options: import('vue').ComponentOptionsBase<Readonly<{}>, {
            isValidate: () => boolean;
        }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, {}, {}, string, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & {
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
    } & Readonly<{}> & Omit<Readonly<{}>, "isValidate"> & import('vue').ShallowUnwrapRef<{
        isValidate: () => boolean;
    }> & {} & import('vue').ComponentCustomProperties & {} & {
        $slots: {
            default?(_: {}): any;
        };
    }) | null;
}, HTMLDivElement>;
export declare const WriteModbusTool: import('vue').DefineComponent<{
    item: any;
    onClose: (success: boolean, reference?: string) => void;
    onSubmit: (value: any) => void;
}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{
    item: any;
    onClose: (success: boolean, reference?: string) => void;
    onSubmit: (value: any) => void;
}> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    formContainer: ({
        $: import('vue').ComponentInternalInstance;
        $data: {};
        $props: Partial<{}> & Omit<{} & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps, never>;
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
        $emit: (event: string, ...args: any[]) => void;
        $el: HTMLDivElement;
        $options: import('vue').ComponentOptionsBase<Readonly<{}>, {
            isValidate: () => boolean;
        }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, {}, {}, string, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & {
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
    } & Readonly<{}> & Omit<Readonly<{}>, "isValidate"> & import('vue').ShallowUnwrapRef<{
        isValidate: () => boolean;
    }> & {} & import('vue').ComponentCustomProperties & {} & {
        $slots: {
            default?(_: {}): any;
        };
    }) | null;
}, HTMLDivElement>;
export declare const WriteOpcuaTool: import('vue').DefineComponent<{
    item: any;
    onClose: (success: boolean, reference?: string) => void;
    onSubmit: (value: any) => void;
}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{
    item: any;
    onClose: (success: boolean, reference?: string) => void;
    onSubmit: (value: any) => void;
}> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    formContainer: ({
        $: import('vue').ComponentInternalInstance;
        $data: {};
        $props: Partial<{}> & Omit<{} & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps, never>;
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
        $emit: (event: string, ...args: any[]) => void;
        $el: HTMLDivElement;
        $options: import('vue').ComponentOptionsBase<Readonly<{}>, {
            isValidate: () => boolean;
        }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, {}, {}, string, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & {
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
    } & Readonly<{}> & Omit<Readonly<{}>, "isValidate"> & import('vue').ShallowUnwrapRef<{
        isValidate: () => boolean;
    }> & {} & import('vue').ComponentCustomProperties & {} & {
        $slots: {
            default?(_: {}): any;
        };
    }) | null;
}, HTMLDivElement>;
export declare const PointSelectPanel: import('vue').DefineComponent<{
    disableSelCallback: (t: import('@x-plateform-mono/service/dist/networkService').networkItem) => boolean;
    existingPoints: string[];
}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    onNodeClick: (value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any;
}, string, import('vue').PublicProps, Readonly<{
    disableSelCallback: (t: import('@x-plateform-mono/service/dist/networkService').networkItem) => boolean;
    existingPoints: string[];
}> & Readonly<{
    onOnNodeClick?: ((value: import('@x-plateform-mono/common/dist/components/tree/BasicTree').treeDataType) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export declare const KNXAttribute: {
    '5.001': {
        range: number[];
        int: boolean;
    };
    '5.003': {
        range: number[];
        int: boolean;
    };
    '5.004': {
        range: number[];
        int: boolean;
    };
    '5.005': {
        range: number[];
        int: boolean;
    };
    '5.006': {
        range: number[];
        int: boolean;
    };
    '5.010': {
        range: number[];
        int: boolean;
    };
    '5.100': {
        range: number[];
        int: boolean;
    };
    '7.001': {
        range: number[];
        int: boolean;
    };
    '7.002': {
        range: number[];
        int: boolean;
    };
    '7.003': {
        range: number[];
        int: boolean;
    };
    '7.004': {
        range: number[];
        int: boolean;
    };
    '7.005': {
        range: number[];
        int: boolean;
    };
    '7.006': {
        range: number[];
        int: boolean;
    };
    '7.007': {
        range: number[];
        int: boolean;
    };
    '7.010': {
        range: number[];
        int: boolean;
    };
    '7.011': {
        range: number[];
        int: boolean;
    };
    '7.012': {
        range: number[];
        int: boolean;
    };
    '7.013': {
        range: number[];
        int: boolean;
    };
    '7.600': {
        range: number[];
        int: boolean;
    };
    '8.001': {
        range: number[];
    };
    '8.002': {
        range: number[];
    };
    '8.003': {
        range: number[];
    };
    '8.004': {
        range: number[];
    };
    '8.005': {
        range: number[];
    };
    '8.006': {
        range: number[];
    };
    '8.007': {
        range: number[];
    };
    '8.010': {
        range: number[];
    };
    '8.011': {
        range: number[];
    };
    '8.012': {
        range: number[];
    };
    '9.001': {
        range: number[];
    };
    '9.002': {
        range: number[];
    };
    '9.003': {
        range: number[];
    };
    '9.004': {
        range: number[];
    };
    '9.005': {
        range: number[];
    };
    '9.006': {
        range: number[];
    };
    '9.007': {
        range: number[];
    };
    '9.008': {
        range: number[];
    };
    '9.009': {
        range: number[];
    };
    '9.010': {
        range: number[];
    };
    '9.011': {
        range: number[];
    };
    '9.020': {
        range: number[];
    };
    '9.021': {
        range: number[];
    };
    '9.022': {
        range: number[];
    };
    '9.023': {
        range: number[];
    };
    '9.024': {
        range: number[];
    };
    '9.025': {
        range: number[];
    };
    '9.026': {
        range: number[];
    };
    '9.027': {
        range: number[];
    };
    '9.028': {
        range: number[];
    };
    '9.029': {
        range: number[];
    };
    '9.030': {
        range: number[];
    };
    '9.031': {
        range: number[];
    };
    '17.001': {
        range: number[];
        int: boolean;
    };
    '18.001': {
        range: number[];
        int: boolean;
    };
    '6': {
        range: number[];
        int: boolean;
    };
    '13': {
        range: number[];
    };
};
export declare const DomUtils: {
    openModalDialog: (cpnt: any, props: any) => void;
    editAsModalDialog: (ele: HTMLElement) => (() => void) | undefined;
};
export declare const FileUtils: {
    exportMute: (content: string | Blob | ArrayBuffer, fileName: string, fileProcessOption?: import('./components/utils/FileUtils').FileProcessOption) => Promise<void>;
    importMute: (importOption?: import('@x-plateform-mono/common/dist/components/utils/FileTools').ImportFileOption, fileProcessOption?: import('./components/utils/FileUtils').FileProcessOption) => Promise<[content: any, fileName: string]>;
    exportPopup: (content: string | Blob | ArrayBuffer, fileProcessOption?: import('./components/utils/FileUtils').FileProcessOption) => void;
    importPopup: (importOption?: import('@x-plateform-mono/common/dist/components/utils/FileTools').ImportFileOption, fileProcessOption?: import('./components/utils/FileUtils').FileProcessOption) => Promise<[content: any, name: string]>;
    downloadAsXlsx: (json: Array<any>, fileName: string) => void;
    xlsxRead: typeof import('xlsx').read;
    xlsxUtils: import('xlsx').XLSX$Utils;
};
export declare const DateUtils: {
    getTimezoneOffset: () => Promise<number>;
    getServerNowTime: () => Promise<Date>;
};
export declare const DataBindingPanel: {
    new (...args: any[]): import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
        value: import('./components/dataBinder/DataBindingTypes').DataBindingObject;
        option: import('./components/dataBinder/DataBindingTypes').MultiPointBindingConfig;
        modelConfig?: import('./components/dataBinder/DataBindingTypes').DataModelBindingConfig;
        showModelList?: boolean;
        dynamicHeight?: boolean;
    }> & Readonly<{
        onChange?: ((config: import('./components/dataBinder/DataBindingTypes').DataBindingObject) => any) | undefined;
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
                    valueType: import("@x-plateform-mono/service/dist/equipmentService").BasicValueTypes.binary | import("@x-plateform-mono/service/dist/equipmentService").BasicValueTypes.state | import("@x-plateform-mono/service/dist/equipmentService").BasicValueTypes.analog;
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
                pointType: import('@x-plateform-mono/service/dist/constants').PointAttrValueType;
                valueType: import('@x-plateform-mono/service/dist/equipmentService').BasicValueTypes;
            }[];
            dataModels: never[];
            modelBindings: never[];
        } | undefined>;
        getSingleBindingReference(dbo: import('./components/dataBinder/DataBindingTypes').DataBindingObject): string | undefined;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
        change: (config: import('./components/dataBinder/DataBindingTypes').DataBindingObject) => any;
    }, import('vue').PublicProps, {}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, any, import('vue').ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<{
        value: import('./components/dataBinder/DataBindingTypes').DataBindingObject;
        option: import('./components/dataBinder/DataBindingTypes').MultiPointBindingConfig;
        modelConfig?: import('./components/dataBinder/DataBindingTypes').DataModelBindingConfig;
        showModelList?: boolean;
        dynamicHeight?: boolean;
    }> & Readonly<{
        onChange?: ((config: import('./components/dataBinder/DataBindingTypes').DataBindingObject) => any) | undefined;
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
                    valueType: import("@x-plateform-mono/service/dist/equipmentService").BasicValueTypes.binary | import("@x-plateform-mono/service/dist/equipmentService").BasicValueTypes.state | import("@x-plateform-mono/service/dist/equipmentService").BasicValueTypes.analog;
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
                pointType: import('@x-plateform-mono/service/dist/constants').PointAttrValueType;
                valueType: import('@x-plateform-mono/service/dist/equipmentService').BasicValueTypes;
            }[];
            dataModels: never[];
            modelBindings: never[];
        } | undefined>;
        getSingleBindingReference(dbo: import('./components/dataBinder/DataBindingTypes').DataBindingObject): string | undefined;
    }, {}, {}, {}, {}>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import('vue').ComponentOptionsBase<Readonly<{
    value: import('./components/dataBinder/DataBindingTypes').DataBindingObject;
    option: import('./components/dataBinder/DataBindingTypes').MultiPointBindingConfig;
    modelConfig?: import('./components/dataBinder/DataBindingTypes').DataModelBindingConfig;
    showModelList?: boolean;
    dynamicHeight?: boolean;
}> & Readonly<{
    onChange?: ((config: import('./components/dataBinder/DataBindingTypes').DataBindingObject) => any) | undefined;
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
                valueType: import("@x-plateform-mono/service/dist/equipmentService").BasicValueTypes.binary | import("@x-plateform-mono/service/dist/equipmentService").BasicValueTypes.state | import("@x-plateform-mono/service/dist/equipmentService").BasicValueTypes.analog;
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
            pointType: import('@x-plateform-mono/service/dist/constants').PointAttrValueType;
            valueType: import('@x-plateform-mono/service/dist/equipmentService').BasicValueTypes;
        }[];
        dataModels: never[];
        modelBindings: never[];
    } | undefined>;
    getSingleBindingReference(dbo: import('./components/dataBinder/DataBindingTypes').DataBindingObject): string | undefined;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    change: (config: import('./components/dataBinder/DataBindingTypes').DataBindingObject) => any;
}, string, {}, {}, string, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {
            cpntId: number;
            pointBinding: import('./components/dataBinder/DataBindingTypes').BindedPoint | {
                cpntId: number;
                innerName?: string;
                bindingType: undefined;
            } | undefined;
            config: import('./components/dataBinder/DataBindingTypes').SinglePointBindingConfig & {
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
        default?(_: {
            cpntId: number;
            pointBinding: import('./components/dataBinder/DataBindingTypes').BindedPoint | {
                cpntId: number;
                innerName?: string;
                bindingType: undefined;
            } | undefined;
            config: import('./components/dataBinder/DataBindingTypes').SinglePointBindingConfig & {
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
});
export declare const DataBindingManager: typeof DataBindingManager_0;
export declare const ModelList: import('vue').DefineComponent<{
    bindingManager: DataBindingManager_0;
}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{
    bindingManager: DataBindingManager_0;
}> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    equipmentListItemRefs: (import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
        id?: number;
        cpntId?: number;
        model: import('./components/dataBinder/DataBindingTypes').DataModelVirtual;
        active?: boolean;
        bindingManager: DataBindingManager_0;
    }> & Readonly<{
        onClick?: (() => any) | undefined;
        onDelete?: (() => any) | undefined;
    }>, {
        bindingState: () => void;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
        click: () => any;
        delete: () => any;
    }, import('vue').PublicProps, {}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, any, import('vue').ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<{
        id?: number;
        cpntId?: number;
        model: import('./components/dataBinder/DataBindingTypes').DataModelVirtual;
        active?: boolean;
        bindingManager: DataBindingManager_0;
    }> & Readonly<{
        onClick?: (() => any) | undefined;
        onDelete?: (() => any) | undefined;
    }>, {
        bindingState: () => void;
    }, {}, {}, {}, {}> | null)[];
}, any>;
export declare const PointBindingPanel: {
    new (...args: any[]): import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
        id?: number;
        bindingManager: DataBindingManager_0;
        config: import('./components/dataBinder/DataBindingTypes').MultiPointBindingConfig;
        modelConfig: import('./components/dataBinder/DataBindingTypes').DataModelBindingConfig;
        pointBindings?: (import('./components/dataBinder/DataBindingTypes').BindedPoint | {
            cpntId: number;
            innerName?: string;
            bindingType?: undefined;
        })[];
        hideAddButton?: boolean;
        valueTypes?: import('@x-plateform-mono/service/dist/equipmentService').BasicValueTypes[];
    }> & Readonly<{
        onChange?: ((pointBindings: (import('./components/dataBinder/DataBindingTypes').BindedPoint | {
            cpntId: number;
            innerName?: string;
            bindingType?: undefined;
        })[]) => any) | undefined;
        onChangeNeedUndoRedo?: ((pointBindings: (import('./components/dataBinder/DataBindingTypes').BindedPoint | {
            cpntId: number;
            innerName?: string;
            bindingType?: undefined;
        })[], noNeedUndoRedo?: boolean | undefined) => any) | undefined;
    }>, {
        addPoint: () => Promise<void>;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
        change: (pointBindings: (import('./components/dataBinder/DataBindingTypes').BindedPoint | {
            cpntId: number;
            innerName?: string;
            bindingType?: undefined;
        })[]) => any;
        changeNeedUndoRedo: (pointBindings: (import('./components/dataBinder/DataBindingTypes').BindedPoint | {
            cpntId: number;
            innerName?: string;
            bindingType?: undefined;
        })[], noNeedUndoRedo?: boolean | undefined) => any;
    }, import('vue').PublicProps, {}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, any, import('vue').ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<{
        id?: number;
        bindingManager: DataBindingManager_0;
        config: import('./components/dataBinder/DataBindingTypes').MultiPointBindingConfig;
        modelConfig: import('./components/dataBinder/DataBindingTypes').DataModelBindingConfig;
        pointBindings?: (import('./components/dataBinder/DataBindingTypes').BindedPoint | {
            cpntId: number;
            innerName?: string;
            bindingType?: undefined;
        })[];
        hideAddButton?: boolean;
        valueTypes?: import('@x-plateform-mono/service/dist/equipmentService').BasicValueTypes[];
    }> & Readonly<{
        onChange?: ((pointBindings: (import('./components/dataBinder/DataBindingTypes').BindedPoint | {
            cpntId: number;
            innerName?: string;
            bindingType?: undefined;
        })[]) => any) | undefined;
        onChangeNeedUndoRedo?: ((pointBindings: (import('./components/dataBinder/DataBindingTypes').BindedPoint | {
            cpntId: number;
            innerName?: string;
            bindingType?: undefined;
        })[], noNeedUndoRedo?: boolean | undefined) => any) | undefined;
    }>, {
        addPoint: () => Promise<void>;
    }, {}, {}, {}, {}>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import('vue').ComponentOptionsBase<Readonly<{
    id?: number;
    bindingManager: DataBindingManager_0;
    config: import('./components/dataBinder/DataBindingTypes').MultiPointBindingConfig;
    modelConfig: import('./components/dataBinder/DataBindingTypes').DataModelBindingConfig;
    pointBindings?: (import('./components/dataBinder/DataBindingTypes').BindedPoint | {
        cpntId: number;
        innerName?: string;
        bindingType?: undefined;
    })[];
    hideAddButton?: boolean;
    valueTypes?: import('@x-plateform-mono/service/dist/equipmentService').BasicValueTypes[];
}> & Readonly<{
    onChange?: ((pointBindings: (import('./components/dataBinder/DataBindingTypes').BindedPoint | {
        cpntId: number;
        innerName?: string;
        bindingType?: undefined;
    })[]) => any) | undefined;
    onChangeNeedUndoRedo?: ((pointBindings: (import('./components/dataBinder/DataBindingTypes').BindedPoint | {
        cpntId: number;
        innerName?: string;
        bindingType?: undefined;
    })[], noNeedUndoRedo?: boolean | undefined) => any) | undefined;
}>, {
    addPoint: () => Promise<void>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    change: (pointBindings: (import('./components/dataBinder/DataBindingTypes').BindedPoint | {
        cpntId: number;
        innerName?: string;
        bindingType?: undefined;
    })[]) => any;
    changeNeedUndoRedo: (pointBindings: (import('./components/dataBinder/DataBindingTypes').BindedPoint | {
        cpntId: number;
        innerName?: string;
        bindingType?: undefined;
    })[], noNeedUndoRedo?: boolean | undefined) => any;
}, string, {}, {}, string, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {
            cpntId: number;
            pointBinding: import('./components/dataBinder/DataBindingTypes').BindedPoint | {
                cpntId: number;
                innerName?: string;
                bindingType: undefined;
            } | undefined;
            config: import('./components/dataBinder/DataBindingTypes').SinglePointBindingConfig & {
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
});
export declare const DataAccessManager: typeof DataAccessManager_0;
export declare const DataAccessSimulateManager: typeof DataAccessSimulateManager_0;
export declare const DataModelConfigPanel: import('vue').DefineComponent<{
    spaceId?: string;
    models: import('./components/dataBinder/DataBindingTypes').DataModelVirtual[];
    binding: import('./components/dataBinder/DataBindingTypes').DataModelBinding[];
    onClose: (...params: any) => void;
}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{
    spaceId?: string;
    models: import('./components/dataBinder/DataBindingTypes').DataModelVirtual[];
    binding: import('./components/dataBinder/DataBindingTypes').DataModelBinding[];
    onClose: (...params: any) => void;
}> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export declare const TagRender: import('vue').DefineComponent<{
    tagRenderManager?: TagRenderManager_0;
    pickerTitle?: string;
    hideLeaf?: Boolean;
    singleEnergyCheck?: Boolean;
    maxNum?: number;
    minNum?: number;
    editable?: boolean;
    tags: number[];
}, {
    edit: () => void;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    change: (value: number[]) => any;
}, string, import('vue').PublicProps, Readonly<{
    tagRenderManager?: TagRenderManager_0;
    pickerTitle?: string;
    hideLeaf?: Boolean;
    singleEnergyCheck?: Boolean;
    maxNum?: number;
    minNum?: number;
    editable?: boolean;
    tags: number[];
}> & Readonly<{
    onChange?: ((value: number[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export declare const TagPickerPanel: import('vue').DefineComponent<{
    title?: string;
    tags: import('@x-plateform-mono/service/dist/digitalTagService').TagType[];
    tagRenderManager: TagRenderManager_0;
    hideLeaf?: Boolean;
    singleEnergyCheck?: Boolean;
    maxNum?: number;
    minNum?: number;
    onClose: (...args: any) => void;
}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{
    title?: string;
    tags: import('@x-plateform-mono/service/dist/digitalTagService').TagType[];
    tagRenderManager: TagRenderManager_0;
    hideLeaf?: Boolean;
    singleEnergyCheck?: Boolean;
    maxNum?: number;
    minNum?: number;
    onClose: (...args: any) => void;
}> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export declare const TagRenderManager: typeof TagRenderManager_0;
export declare const BindingMulPopupRender: import('vue').DefineComponent<{
    label?: string;
    showLabel?: boolean;
    id: any;
    value: import('./components/graphicMulPopup/GraphicMulManager').MulPopupBindingValue | undefined | null;
    dataBindingManager: DataBindingManager_0;
    customConfig?: import('./components/graphicMulPopup/GraphicMulManager').MulCustomConfig;
    isShowDashboard?: boolean;
    isShowChart?: boolean;
    isShowPoints?: boolean;
}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    changeValue: (value: import('./components/graphicMulPopup/GraphicMulManager').MulPopupBindingValue | null) => any;
    initValue: (value: import('./components/graphicMulPopup/GraphicMulManager').MulPopupBindingValue | null) => any;
}, string, import('vue').PublicProps, Readonly<{
    label?: string;
    showLabel?: boolean;
    id: any;
    value: import('./components/graphicMulPopup/GraphicMulManager').MulPopupBindingValue | undefined | null;
    dataBindingManager: DataBindingManager_0;
    customConfig?: import('./components/graphicMulPopup/GraphicMulManager').MulCustomConfig;
    isShowDashboard?: boolean;
    isShowChart?: boolean;
    isShowPoints?: boolean;
}> & Readonly<{
    onChangeValue?: ((value: import('./components/graphicMulPopup/GraphicMulManager').MulPopupBindingValue | null) => any) | undefined;
    onInitValue?: ((value: import('./components/graphicMulPopup/GraphicMulManager').MulPopupBindingValue | null) => any) | undefined;
}>, {
    showLabel: boolean;
    isShowDashboard: boolean;
    isShowChart: boolean;
    isShowPoints: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export declare const GraphicMulPopup: import('vue').DefineComponent<{
    canvasSize: {
        width: number;
        height: number;
    };
    manager?: DataAccessManager_0;
    transform?: {
        transformX: number;
        transformY: number;
    };
    componetRender: Map<string, any>;
    border?: {
        left: number;
        right: number;
        top: number;
        bottom: number;
        isAddBorder?: boolean;
    };
    withinRoot?: boolean;
    zIndex?: number;
    root?: HTMLElement;
}, {
    openMulPopup: (item: import('./components/graphicMulPopup/GraphicMulManager').MulPopupBindingValue, evt: {
        x: number;
        y: number;
    }, updateCallback: import('./components/graphicMulPopup/GraphicMulManager').MulCustomBinding) => Promise<void>;
    closePopup: (id: string | number) => void;
    closeAllPopup: (type?: string) => void;
    getPopRefById: (id: string | number) => any;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    close: (id: number) => any;
    itemClick: (value: any) => any;
    setValue: (value: {
        value: number;
        bindingObject: any;
        priority: string;
        id?: number;
    }) => any;
}, string, import('vue').PublicProps, Readonly<{
    canvasSize: {
        width: number;
        height: number;
    };
    manager?: DataAccessManager_0;
    transform?: {
        transformX: number;
        transformY: number;
    };
    componetRender: Map<string, any>;
    border?: {
        left: number;
        right: number;
        top: number;
        bottom: number;
        isAddBorder?: boolean;
    };
    withinRoot?: boolean;
    zIndex?: number;
    root?: HTMLElement;
}> & Readonly<{
    onClose?: ((id: number) => any) | undefined;
    onItemClick?: ((value: any) => any) | undefined;
    onSetValue?: ((value: {
        value: number;
        bindingObject: any;
        priority: string;
        id?: number;
    }) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export declare const GraphicMulManager: typeof GraphicMulManager_0;
export declare const BindingNavigationPropertyRender: import('vue').DefineComponent<{
    label: string;
    value?: import('./components/bindingNavigation/BindingNavigationType').navBindingValue | null;
}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    changeValue: (value: import('./components/bindingNavigation/BindingNavigationType').navBindingValue | null) => any;
}, string, import('vue').PublicProps, Readonly<{
    label: string;
    value?: import('./components/bindingNavigation/BindingNavigationType').navBindingValue | null;
}> & Readonly<{
    onChangeValue?: ((value: import('./components/bindingNavigation/BindingNavigationType').navBindingValue | null) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
