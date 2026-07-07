type __VLS_Props = {
    label: string;
    value: string;
    opt?: {
        value: string;
        label: string;
        default?: boolean;
    }[] | {
        disabled: boolean;
        options: {
            value: string;
            label: string;
            default?: boolean;
        }[];
    };
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    changeValue: (value: string | number) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChangeValue?: ((value: string | number) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    selectSingleItem: import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
        opts: {
            label: string;
            value: string;
        }[];
        value?: string;
        enableFilter?: boolean;
        width?: number;
        height?: number;
        disabled?: boolean;
        appendToRoot?: boolean;
        placeholder?: string;
        iconLeft?: {
            icon: string;
            show?: boolean;
            action?: () => void;
            rotate?: number;
        };
        validator?: {
            validate: (value: string) => (string | void);
            updateTrigger?: boolean;
            rollback?: boolean;
            required?: boolean;
        };
    }> & Readonly<{
        onChange?: ((value: string) => any) | undefined;
    }>, {
        doValidate: () => string | undefined;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        change: (value: string) => any;
    }, import('vue').PublicProps, {}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {
        popoverItem: ({
            $: import('vue').ComponentInternalInstance;
            $data: {};
            $props: {
                readonly trigger?: "click" | "hover" | undefined;
                readonly placement?: "auto" | "vertical" | "vertical-left" | "vertical-right" | "horizontal" | "horizontal-top" | "horizontal-bottom" | "bottom-center" | "bottom-left" | "bottom-right" | "bottom" | "top-center" | "top-left" | "top-right" | "top" | "right-top" | "right-bottom" | "right" | "left-top" | "left-bottom" | "left" | undefined;
                readonly width?: number | undefined;
                readonly height?: number | undefined;
                readonly eleWidth?: number | undefined;
                readonly eleHeight?: number | undefined;
                readonly appendToRoot?: boolean | undefined;
                readonly clickClose?: boolean | undefined;
                readonly clickOutClose?: boolean | undefined;
                readonly disabled?: boolean | undefined;
                readonly delay?: number | undefined;
                readonly forceReload?: boolean | undefined;
                readonly clickNoShow?: (() => boolean) | undefined;
                readonly onToggle?: ((open: boolean, event?: MouseEvent | undefined) => any) | undefined;
            } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps;
            $attrs: import('vue').Attrs;
            $refs: {
                [x: string]: unknown;
            } & {
                popoverElementContainer: HTMLDivElement;
                popoverPanelContainer: HTMLDivElement;
            };
            $slots: Readonly<{
                [name: string]: import('vue').Slot<any> | undefined;
            }>;
            $root: import('vue').ComponentPublicInstance | null;
            $parent: import('vue').ComponentPublicInstance | null;
            $host: Element | null;
            $emit: (event: "toggle", open: boolean, event?: MouseEvent | undefined) => void;
            $el: HTMLDivElement;
            $options: import('vue').ComponentOptionsBase<Readonly<{
                trigger?: "click" | "hover";
                placement?: "auto" | "vertical" | "vertical-left" | "vertical-right" | "horizontal" | "horizontal-top" | "horizontal-bottom" | "bottom-center" | "bottom-left" | "bottom-right" | "bottom" | "top-center" | "top-left" | "top-right" | "top" | "right-top" | "right-bottom" | "right" | "left-top" | "left-bottom" | "left";
                width?: number;
                height?: number;
                eleWidth?: number;
                eleHeight?: number;
                appendToRoot?: boolean;
                clickClose?: boolean;
                clickOutClose?: boolean;
                disabled?: boolean;
                delay?: number;
                forceReload?: boolean;
                clickNoShow?: () => boolean;
            }> & Readonly<{
                onToggle?: ((open: boolean, event?: MouseEvent | undefined) => any) | undefined;
            }>, {
                close: () => void;
            }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
                toggle: (open: boolean, event?: MouseEvent | undefined) => any;
            }, string, {
                trigger: "click" | "hover";
                placement: "auto" | "vertical" | "vertical-left" | "vertical-right" | "horizontal" | "horizontal-top" | "horizontal-bottom" | "bottom-center" | "bottom-left" | "bottom-right" | "bottom" | "top-center" | "top-left" | "top-right" | "top" | "right-top" | "right-bottom" | "right" | "left-top" | "left-bottom" | "left";
                appendToRoot: boolean;
                clickClose: boolean;
                clickOutClose: boolean;
                delay: number;
                forceReload: boolean;
                clickNoShow: () => boolean;
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
            trigger: "click" | "hover";
            placement: "auto" | "vertical" | "vertical-left" | "vertical-right" | "horizontal" | "horizontal-top" | "horizontal-bottom" | "bottom-center" | "bottom-left" | "bottom-right" | "bottom" | "top-center" | "top-left" | "top-right" | "top" | "right-top" | "right-bottom" | "right" | "left-top" | "left-bottom" | "left";
            appendToRoot: boolean;
            clickClose: boolean;
            clickOutClose: boolean;
            delay: number;
            forceReload: boolean;
            clickNoShow: () => boolean;
        }> & Omit<Readonly<{
            trigger?: "click" | "hover";
            placement?: "auto" | "vertical" | "vertical-left" | "vertical-right" | "horizontal" | "horizontal-top" | "horizontal-bottom" | "bottom-center" | "bottom-left" | "bottom-right" | "bottom" | "top-center" | "top-left" | "top-right" | "top" | "right-top" | "right-bottom" | "right" | "left-top" | "left-bottom" | "left";
            width?: number;
            height?: number;
            eleWidth?: number;
            eleHeight?: number;
            appendToRoot?: boolean;
            clickClose?: boolean;
            clickOutClose?: boolean;
            disabled?: boolean;
            delay?: number;
            forceReload?: boolean;
            clickNoShow?: () => boolean;
        }> & Readonly<{
            onToggle?: ((open: boolean, event?: MouseEvent | undefined) => any) | undefined;
        }>, "close" | ("trigger" | "placement" | "appendToRoot" | "clickClose" | "clickOutClose" | "delay" | "forceReload" | "clickNoShow")> & import('vue').ShallowUnwrapRef<{
            close: () => void;
        }> & {} & import('vue').ComponentCustomProperties & {} & {
            $slots: {
                default?(_: {}): any;
                "panel-content"?(_: {}): any;
            };
        }) | null;
        menuPanelWrapper: HTMLDivElement;
        menuPanelItem: import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
            menuList: import('@x-plateform-mono/common/dist/components/panel/MenuType').MenuItem[];
            itemHeight?: number;
        }> & Readonly<{
            onClick?: ((value: {
                name: string;
                icon?: string;
                active?: boolean;
                action?: (e: Event) => void;
            }) => any) | undefined;
        }>, {
            calcFirstActiveTop(): number;
        }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
            click: (value: {
                name: string;
                icon?: string;
                active?: boolean;
                action?: (e: Event) => void;
            }) => any;
        }, import('vue').PublicProps, {
            itemHeight: number;
        }, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {
            menuPanelContainer: HTMLDivElement;
        }, HTMLDivElement, import('vue').ComponentProvideOptions, {
            P: {};
            B: {};
            D: {};
            C: {};
            M: {};
            Defaults: {};
        }, Readonly<{
            menuList: import('@x-plateform-mono/common/dist/components/panel/MenuType').MenuItem[];
            itemHeight?: number;
        }> & Readonly<{
            onClick?: ((value: {
                name: string;
                icon?: string;
                active?: boolean;
                action?: (e: Event) => void;
            }) => any) | undefined;
        }>, {
            calcFirstActiveTop(): number;
        }, {}, {}, {}, {
            itemHeight: number;
        }> | null;
    }, HTMLDivElement, import('vue').ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<{
        opts: {
            label: string;
            value: string;
        }[];
        value?: string;
        enableFilter?: boolean;
        width?: number;
        height?: number;
        disabled?: boolean;
        appendToRoot?: boolean;
        placeholder?: string;
        iconLeft?: {
            icon: string;
            show?: boolean;
            action?: () => void;
            rotate?: number;
        };
        validator?: {
            validate: (value: string) => (string | void);
            updateTrigger?: boolean;
            rollback?: boolean;
            required?: boolean;
        };
    }> & Readonly<{
        onChange?: ((value: string) => any) | undefined;
    }>, {
        doValidate: () => string | undefined;
    }, {}, {}, {}, {}> | null;
}, HTMLDivElement>;
export default _default;
