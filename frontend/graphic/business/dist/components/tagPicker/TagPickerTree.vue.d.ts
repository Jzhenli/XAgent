import { TagType } from '@x-plateform-mono/service/dist/digitalTagService';
import { default as TagRenderManager } from './TagRenderManager';
type __VLS_Props = {
    filterStr?: string;
    tagRenderManager: TagRenderManager;
    tags: TagType[];
    hideLeaf?: Boolean;
    singleEnergyCheck?: Boolean;
    maxNum?: number;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    change: (tags: TagType[]) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((tags: TagType[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
