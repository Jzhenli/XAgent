import { default as TagRenderManager } from './TagRenderManager';
type __VLS_Props = {
    tagRenderManager?: TagRenderManager;
    pickerTitle?: string;
    hideLeaf?: Boolean;
    singleEnergyCheck?: Boolean;
    maxNum?: number;
    minNum?: number;
    editable?: boolean;
    tags: number[];
};
declare function openTagPicker(): void;
declare const _default: import('vue').DefineComponent<__VLS_Props, {
    edit: typeof openTagPicker;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    change: (value: number[]) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((value: number[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
