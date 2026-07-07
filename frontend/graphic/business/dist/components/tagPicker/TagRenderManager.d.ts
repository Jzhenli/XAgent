import { TagType } from '@x-plateform-mono/service/dist/digitalTagService';
/**
 * 单次渲染时缓存所有的tags，用于翻译tag标签名称，计算tagTree中勾选的结果
 *
 * 手动创建并传入TagRender可以多个对象共用同一个TagRenderManager，减少重复查询
 */
type TagTypeExtra = TagType & {
    tagSegs?: string[];
};
export default class TagRenderManager {
    tags: TagType[];
    readyPromise: Promise<void>;
    readyResolve: () => void;
    constructor();
    getTagsById(idList: number[]): Promise<TagType[]>;
    changeState(selectedList: TagTypeExtra[], tag: TagTypeExtra): Promise<TagTypeExtra[]>;
}
export {};
