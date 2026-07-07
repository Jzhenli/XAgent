type __VLS_Props = {
    knxType: any;
    value?: {
        "control": boolean;
        "value": number;
    };
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    change: (value: {
        control: boolean;
        value: number;
    }, text: string) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((value: {
        control: boolean;
        value: number;
    }, text: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    sliderBox: HTMLDivElement;
    sliderLeft: HTMLDivElement;
}, HTMLDivElement>;
export default _default;
