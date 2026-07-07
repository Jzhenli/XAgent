type __VLS_Props = {
    label: string;
    value?: number;
    disabled?: boolean;
    opt?: {
        fraction?: number;
        min?: number;
        max?: number;
        needValueFixed?: boolean;
    };
    optionValues?: any;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    changeValue: (value?: number | undefined) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChangeValue?: ((value?: number | undefined) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
