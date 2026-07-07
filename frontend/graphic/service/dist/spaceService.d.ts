export type spaceItem = {
    spaceId: string;
    name: string;
    type: string;
    hasChild: boolean;
    spaceType?: string;
};
export declare class SpaceService {
    spaceIdSet: Set<string>;
    listSpaceItems(spaceId?: string): Promise<void>;
    getSpaceStatus: boolean;
    getAllSpace(): Promise<string[]>;
    getChildrenCache: Map<any, any>;
    getChildren(spaceId?: string): Promise<spaceItem[]>;
    getAncestors(spaceId: string): Promise<spaceItem[]>;
    getSpaceItem(spaceId: string): Promise<spaceItem>;
    getObjectCategory(language: string): Promise<any>;
    getSpaceDetail(archiveName: string, spaceId: string): Promise<any>;
    addSpace(archiveName: string, space: any): Promise<any>;
    deleteSpace(archiveName: string, spaceId: string): Promise<any>;
    modifySpace(archiveName: string, space: any): Promise<any>;
    moveSpace(archiveName: string, ids: string): Promise<any>;
}
declare const _default: SpaceService;
export default _default;
