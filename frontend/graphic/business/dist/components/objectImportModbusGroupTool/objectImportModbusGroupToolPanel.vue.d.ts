import { networkItem } from '@x-plateform-mono/service/dist/networkService';
type __VLS_Props = {
    item: networkItem;
    onClose: (success: boolean, reference?: string) => void;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    fileMultipleInput: HTMLInputElement;
    fileInput: HTMLInputElement;
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
    nameRef: (import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
        modelValue: string;
        clearBtn?: boolean;
        readonly?: boolean;
        disabled?: boolean;
        placeholder?: string;
        width?: number;
        height?: number;
        password?: boolean;
        maxlength?: number;
        inputStyle?: any;
        stopDeletePropagation?: boolean;
        validator?: {
            validate: (value: string) => (string | void);
            updateTrigger?: boolean;
            rollback?: boolean;
            required?: boolean;
        };
    }> & Readonly<{
        onChange?: ((value?: string | undefined) => any) | undefined;
        "onKeyup.enter"?: (() => any) | undefined;
        "onUpdate:modelValue"?: ((value?: string | undefined) => any) | undefined;
        onOnblur?: (() => any) | undefined;
    }>, {
        focus: () => void;
        valid: () => boolean;
        doValidate: () => string | undefined;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        change: (value?: string | undefined) => any;
        "keyup.enter": () => any;
        "update:modelValue": (value?: string | undefined) => any;
        onblur: () => any;
    }, import('vue').PublicProps, {
        width: number;
        height: number;
        stopDeletePropagation: boolean;
    }, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {
        inputItem: HTMLInputElement;
    }, HTMLDivElement, import('vue').ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<{
        modelValue: string;
        clearBtn?: boolean;
        readonly?: boolean;
        disabled?: boolean;
        placeholder?: string;
        width?: number;
        height?: number;
        password?: boolean;
        maxlength?: number;
        inputStyle?: any;
        stopDeletePropagation?: boolean;
        validator?: {
            validate: (value: string) => (string | void);
            updateTrigger?: boolean;
            rollback?: boolean;
            required?: boolean;
        };
    }> & Readonly<{
        onChange?: ((value?: string | undefined) => any) | undefined;
        "onKeyup.enter"?: (() => any) | undefined;
        "onUpdate:modelValue"?: ((value?: string | undefined) => any) | undefined;
        onOnblur?: (() => any) | undefined;
    }>, {
        focus: () => void;
        valid: () => boolean;
        doValidate: () => string | undefined;
    }, {}, {}, {}, {
        width: number;
        height: number;
        stopDeletePropagation: boolean;
    }> | null)[];
    maxInput: (import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
        modelValue: string;
        clearBtn?: boolean;
        readonly?: boolean;
        disabled?: boolean;
        placeholder?: string;
        width?: number;
        height?: number;
        password?: boolean;
        maxlength?: number;
        inputStyle?: any;
        stopDeletePropagation?: boolean;
        validator?: {
            validate: (value: string) => (string | void);
            updateTrigger?: boolean;
            rollback?: boolean;
            required?: boolean;
        };
    }> & Readonly<{
        onChange?: ((value?: string | undefined) => any) | undefined;
        "onKeyup.enter"?: (() => any) | undefined;
        "onUpdate:modelValue"?: ((value?: string | undefined) => any) | undefined;
        onOnblur?: (() => any) | undefined;
    }>, {
        focus: () => void;
        valid: () => boolean;
        doValidate: () => string | undefined;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        change: (value?: string | undefined) => any;
        "keyup.enter": () => any;
        "update:modelValue": (value?: string | undefined) => any;
        onblur: () => any;
    }, import('vue').PublicProps, {
        width: number;
        height: number;
        stopDeletePropagation: boolean;
    }, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {
        inputItem: HTMLInputElement;
    }, HTMLDivElement, import('vue').ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<{
        modelValue: string;
        clearBtn?: boolean;
        readonly?: boolean;
        disabled?: boolean;
        placeholder?: string;
        width?: number;
        height?: number;
        password?: boolean;
        maxlength?: number;
        inputStyle?: any;
        stopDeletePropagation?: boolean;
        validator?: {
            validate: (value: string) => (string | void);
            updateTrigger?: boolean;
            rollback?: boolean;
            required?: boolean;
        };
    }> & Readonly<{
        onChange?: ((value?: string | undefined) => any) | undefined;
        "onKeyup.enter"?: (() => any) | undefined;
        "onUpdate:modelValue"?: ((value?: string | undefined) => any) | undefined;
        onOnblur?: (() => any) | undefined;
    }>, {
        focus: () => void;
        valid: () => boolean;
        doValidate: () => string | undefined;
    }, {}, {}, {}, {
        width: number;
        height: number;
        stopDeletePropagation: boolean;
    }> | null)[];
    minInput: (import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
        modelValue: string;
        clearBtn?: boolean;
        readonly?: boolean;
        disabled?: boolean;
        placeholder?: string;
        width?: number;
        height?: number;
        password?: boolean;
        maxlength?: number;
        inputStyle?: any;
        stopDeletePropagation?: boolean;
        validator?: {
            validate: (value: string) => (string | void);
            updateTrigger?: boolean;
            rollback?: boolean;
            required?: boolean;
        };
    }> & Readonly<{
        onChange?: ((value?: string | undefined) => any) | undefined;
        "onKeyup.enter"?: (() => any) | undefined;
        "onUpdate:modelValue"?: ((value?: string | undefined) => any) | undefined;
        onOnblur?: (() => any) | undefined;
    }>, {
        focus: () => void;
        valid: () => boolean;
        doValidate: () => string | undefined;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        change: (value?: string | undefined) => any;
        "keyup.enter": () => any;
        "update:modelValue": (value?: string | undefined) => any;
        onblur: () => any;
    }, import('vue').PublicProps, {
        width: number;
        height: number;
        stopDeletePropagation: boolean;
    }, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {
        inputItem: HTMLInputElement;
    }, HTMLDivElement, import('vue').ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<{
        modelValue: string;
        clearBtn?: boolean;
        readonly?: boolean;
        disabled?: boolean;
        placeholder?: string;
        width?: number;
        height?: number;
        password?: boolean;
        maxlength?: number;
        inputStyle?: any;
        stopDeletePropagation?: boolean;
        validator?: {
            validate: (value: string) => (string | void);
            updateTrigger?: boolean;
            rollback?: boolean;
            required?: boolean;
        };
    }> & Readonly<{
        onChange?: ((value?: string | undefined) => any) | undefined;
        "onKeyup.enter"?: (() => any) | undefined;
        "onUpdate:modelValue"?: ((value?: string | undefined) => any) | undefined;
        onOnblur?: (() => any) | undefined;
    }>, {
        focus: () => void;
        valid: () => boolean;
        doValidate: () => string | undefined;
    }, {}, {}, {}, {
        width: number;
        height: number;
        stopDeletePropagation: boolean;
    }> | null)[];
}, HTMLDivElement>;
export default _default;
