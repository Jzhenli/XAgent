import { EquipmentTemplate } from '@x-plateform-mono/service/dist/equipmentService';
type __VLS_Props = {
    selected?: string;
    editable?: boolean;
    title?: string;
    onClose: (data?: EquipmentTemplate) => void;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    equipmentTemplateDetailItem: import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
        editable?: boolean;
    }> & Readonly<{
        onConfirm?: ((data: EquipmentTemplate) => any) | undefined;
    }>, {
        showDetail: (itemRef: string) => void;
        closeDetail: () => void;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
        confirm: (data: EquipmentTemplate) => any;
    }, import('vue').PublicProps, {}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {
        detailContainer: HTMLDivElement;
        tagRenderItem: (import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
            tagRenderManager?: import('../tagPicker/TagRenderManager').default;
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
            tagRenderManager?: import('../tagPicker/TagRenderManager').default;
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
        onConfirm?: ((data: EquipmentTemplate) => any) | undefined;
    }>, {
        showDetail: (itemRef: string) => void;
        closeDetail: () => void;
    }, {}, {}, {}, {}> | null;
}, HTMLDivElement>;
export default _default;
