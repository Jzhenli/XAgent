export type LayoutItem = {
    reference: string;
    name: string;
    type: 'sideCols' | 'centerCols' | 'centerBig' | 'unity';
    graphicRef: string;
    dashboardLeftRef: string;
    dashboardRightRef: string;
    dashboardCenterRef: string;
    dashboardBigRef: string;
    options: {
        isLeftShow?: boolean;
        isRightShow?: boolean;
        isBackdropFilterBlur?: boolean;
    };
};
export type ResourseItem = {
    reference: string;
    useTemplate: boolean;
    lastUpdateTime?: number | string;
    previewImage?: string;
    templateRef?: string;
    manualEquipMatch?: string;
    name?: string;
    type?: string;
    options?: any;
    data?: string;
};
export declare enum LayoutServiceType {
    Layout = 0,
    GraphicTemplate = 1,
    DashboardTemplate = 2,
    Graphic = 3,
    Dashboard = 4,
    Chart = 5
}
export type GraphicTemplate = {
    reference: string;
    name: string;
    description: string;
    type: string;
    digitalTags: any[];
    lastUpdateTime: string;
    data: string | undefined;
    previewImage: string | undefined;
    options: object | null;
};
export type EnergyLayout = {
    reference?: string;
    name: string;
    description: string;
    type: string;
    digitalTags: any[];
    lastUpdateTime?: string;
    data?: string;
};
export declare class LayoutService {
    listLayoutBySpace(spaceRef: string): Promise<LayoutItem[]>;
    validateResource(refList: string[]): Promise<string[]>;
    createLayout(spaceRef: string, layout: Omit<LayoutItem, 'reference'>): Promise<string>;
    updateLayout(layout: LayoutItem): Promise<void>;
    deleteLayout(layoutRef: string): Promise<void>;
    saveLayoutOrder(spaceRef: string, layoutRefList: string[]): Promise<void>;
    listResource(reference?: string, resourceType?: number): Promise<ResourseItem[]>;
    createResource(parentRef: string, data: Omit<ResourseItem, 'reference'>): Promise<any>;
    deleteItem(reference: string, type: LayoutServiceType): Promise<any>;
    deleteItems(references: string[], isTemplate: boolean): Promise<any>;
    checkSpace(spaceRef: string): Promise<any>;
    getResourceDetail(reference: string): Promise<any>;
    updateResource(data: ResourseItem): Promise<any>;
    resourceSpaceInfo(reference: string, resourceType: number): Promise<any>;
    getResListByTemplate(templateRef: string): Promise<any>;
    GraphicFolderRoot: string;
    DashboardFolderRoot: string;
    createTemplate(reference: string, params: Omit<GraphicTemplate, 'reference'>): Promise<string>;
    getTemplateDetail(reference: string): Promise<any>;
    updateTemplate(params: any): Promise<unknown>;
    listTemplate(params: any): Promise<unknown>;
    deleteTemplate(templateRef: string): Promise<unknown>;
    listEnergyLayout(id: string): Promise<any>;
    deleteEnergyLayout(data: {
        reference: string;
        type: string;
    }): Promise<unknown>;
    createEnergyLayout(data: {
        parentRef: string;
        baseItemWithBlob: EnergyLayout;
    }): Promise<unknown>;
    editEnergyLayout(data: EnergyLayout): Promise<unknown>;
    getEnergyLayoutDetail(id: string): Promise<unknown>;
    modelDb: LocalForage;
    model3DpathCache: Map<string, {
        modelUrl: string;
        timestamp: number;
    }>;
    modelCacheInited: boolean;
    init3dModelPromise: Promise<void>;
    list3DModels(): Promise<{
        name: string;
        thumbnail: string;
    }[]>;
    load3DModel(name: string): Promise<ArrayBuffer>;
    set3DModels(params: {
        name: string;
        ModelFile: ArrayBuffer;
        PreviewFile: any;
    }): Promise<any>;
    del3DModels(name: string): Promise<any>;
}
declare const _default: LayoutService;
export default _default;
