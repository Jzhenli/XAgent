import { TagType } from '@x-plateform-mono/service/dist/digitalTagService';
type __VLS_Props = {
    tag: TagType;
    editable?: boolean;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    removeTag: () => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onRemoveTag?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
