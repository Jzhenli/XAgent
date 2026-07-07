/**
 * @deprecated use layoutService instead
 */
export declare class GraphicService {
    constructor();
    lruDataCache: any;
    lruTimeCache: any;
    getGraphic(id: string): Promise<{
        id: string;
        name: string;
        content: any;
        lastUpdated: number;
    }>;
    saveGraphic(data: {
        id: string;
        name: string;
        content: any;
    }, preview: string): Promise<unknown>;
    /**
     * 获取space下所有的graphic列表
     */
    getGraphicListBySpaceId(spaceId: string): Promise<{
        id: string;
        name: string;
        preview: string;
        graphicTypes: string[];
        updateTime: any;
    }[]>;
    getDashboardListBySpaceId(spaceId: string): Promise<{
        id: string;
        name: string;
        preview: string;
        graphicTypes: string[];
        updateTime: any;
    }[]>;
    getPreviewImage(resourceId: string): Promise<string>;
    updateTimestampFromList(listPromise: Promise<any[]>, cacheName: string): Promise<{
        id: string;
        name: string;
        preview: string;
        graphicTypes: string[];
        updateTime: any;
    }[]>;
    cacheReadyPromise: Promise<void>;
    initCache(): void;
    setItemTmsp(key: string, content: any): Promise<void>;
    getItemTmsp(key: string): Promise<any[]>;
    getItemData(key: string): Promise<any>;
    setItemData(key: string, content: any): Promise<void>;
    clearXmsGraphicCache(): Promise<void>;
}
declare const _default: GraphicService;
export default _default;
