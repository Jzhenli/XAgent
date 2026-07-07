import { networkItem } from '@x-plateform-mono/service/dist/networkService';
type __VLS_Props = {
    item: networkItem;
    onClose: (success: boolean) => void;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    inputRef: import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
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
    }> | null;
}, HTMLDivElement>;
export default _default;
