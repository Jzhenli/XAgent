import { TagType } from '@x-plateform-mono/service/dist/digitalTagService';
import { default as TagRenderManager } from './TagRenderManager';
type __VLS_Props = {
    title?: string;
    tags: TagType[];
    tagRenderManager: TagRenderManager;
    hideLeaf?: Boolean;
    singleEnergyCheck?: Boolean;
    maxNum?: number;
    minNum?: number;
    onClose: (...args: any) => void;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
