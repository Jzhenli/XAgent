type __VLS_Props = {
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
};
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        'data-display'?(_: {
            data: {
                time: string;
                value: number | string;
            };
            minMax: (number | undefined)[];
        }): any;
    };
    refs: {};
    rootEl: HTMLDivElement;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<__VLS_Props, {
    closeExpandLine: () => void;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    editLine: (value?: number | undefined) => any;
    deleteLine: (value?: number | undefined) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onEditLine?: ((value?: number | undefined) => any) | undefined;
    onDeleteLine?: ((value?: number | undefined) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
