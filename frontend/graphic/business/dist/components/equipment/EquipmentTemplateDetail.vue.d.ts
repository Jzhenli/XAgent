import { EquipmentTemplate } from '@x-plateform-mono/service/dist/equipmentService';
import { default as TagRenderManager } from '../tagPicker/TagRenderManager';
type __VLS_Props = {
    editable?: boolean;
};
declare function showDetail(itemRef: string): void;
declare function closeDetail(): void;
declare const _default: import('vue').DefineComponent<__VLS_Props, {
    showDetail: typeof showDetail;
    closeDetail: typeof closeDetail;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    confirm: (data: EquipmentTemplate) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onConfirm?: ((data: EquipmentTemplate) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    detailContainer: HTMLDivElement;
    tagRenderItem: (import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
        tagRenderManager?: TagRenderManager;
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
        tagRenderManager?: TagRenderManager;
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
}, HTMLDivElement>;
export default _default;
