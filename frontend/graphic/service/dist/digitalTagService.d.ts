/**
 * value 允许英文大小写+数值，父子分隔符使用"#"
 */
export type TagType = {
    id: number;
    value: string;
    name?: string;
    color?: string;
    predifined?: boolean;
};
export type TagTreeNode = TagType & {
    tagSegs: string[];
    hasChildren?: boolean;
    children?: TagTreeNode[];
};
export type Carbon = {
    year: string;
    label: string;
    factors?: Factor[];
};
export type Factor = {
    startDate: string | Date;
    endDate: string | Date;
    name: string;
    color: string;
    id?: string;
    value: string;
};
export declare const tagLabelName: string[];
export declare class DigitalTagService {
    listTags(): Promise<TagType[]>;
    listTagsByParent(value: string, tagsList?: TagType[]): Promise<TagType[]>;
    tagValueExists(value: string, tagsList?: TagType[]): Promise<TagType | undefined>;
    getOrganizedTagTree(tagsList?: TagType[]): Promise<TagTreeNode[]>;
    /**
     * 当id存在时修改id对应的tag，否则添加tag
     * 保存完成后返回带id的list
     */
    saveTags(list: (Omit<TagType, 'id'> & {
        id?: number;
    })[]): Promise<TagType[]>;
    deleteTags(tagsList: TagType[]): Promise<unknown>;
    setfactor(data: Carbon): any;
    getfactor(data: Carbon): any;
    recalc(data: any): any;
    debounceTimeout: number;
    lastUpdate: number;
    tagListPromiseDebounce: Promise<TagType[]>;
    listTagsDebounce(): Promise<TagType[]>;
    queryTagsWithChildren(tagsIdList: number[]): Promise<TagType[]>;
    queryTagsWithChildrenTree(tagsIdList: number[]): Promise<any[]>;
    deepGet(tagsTree: TagTreeNode[], ret: any[]): void;
    deepFind(tagsTree: TagTreeNode[], tagId: any): any;
    getOEE(data: {
        startDate: string;
        endDate: string;
    }): Promise<any>;
    downloadReport(serialNo: string): Promise<void>;
}
declare const _default: DigitalTagService;
export default _default;
