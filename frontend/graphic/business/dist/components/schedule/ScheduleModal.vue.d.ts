type __VLS_Props = {
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
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {
    getExpressionCorn: () => {
        cron: string;
        priority: string;
        value: string;
    };
    modalValid: () => boolean;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    cancel: () => any;
    close: () => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onCancel?: (() => any) | undefined;
    onClose?: (() => any) | undefined;
}>, {
    visible: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export default _default;
