import { default as Eventful } from './common/Eventful';
import { default as GLayer } from './common/GLayer';
import { GBound } from './DrawingArea';
import { default as GCtrl } from './mouseHandler/GCtrl';
import { default as GItem } from './shapes/GItem';
import { default as TempGroup } from './shapes/TempGroup';

declare class GraphicItemManager extends Eventful {
    layers: GLayer[];
    currLayer: GLayer | null;
    activeItem: GItem | null;
    controlItems: GCtrl[];
    tempGroup: TempGroup | null;
    customImageCache: string[];
    constructor();
    getLayers(isVisible?: boolean): GLayer[];
    addLayer(layer: GLayer): void;
    removeLayer(layer: GLayer): void;
    mergeAllLayers(): void;
    deactivateLayer(): void;
    activateLayer(layer: GLayer, force?: boolean): void;
    getCtrls(): GCtrl[];
    getCurrentLayerItems(): GItem[];
    exists(item: GItem | GCtrl): boolean;
    deactivateCurrentSelected(): void;
    addItem(item: GItem): GItem;
    removeItem(item: GItem): void;
    selectAll(): void;
    boundSelect(bound: GBound): void;
    selectMultiple(itemList: GItem[]): void;
    private updateTempGroupCtrls;
    activateItem(item: GItem, option?: {
        keepCursor?: boolean;
        isCtrl?: boolean;
    }): void;
    updateActiveItemCtrls(): void;
    deactivateItem(item: GItem): void;
    moveItem(fL: GLayer, fI: GItem, tL: GLayer, tI?: GItem, before?: boolean): void;
    changeCurrentItemOrder(type: string): void;
    moveLayer(fl: GLayer, tl: GLayer, before: boolean): void;
    loadData(data: any, fromUndo?: boolean): Promise<void>;
    addLayerFromData(layerData: any, imgCache: string[]): void;
    getIndexFromCache(imgData: string): number;
    exportData(): {
        meta: {
            width: number;
            height: number;
            backgroundColor: string;
            enableAutoAlign: boolean;
            sensitivity: number;
            deviceInitRate: number;
            renderAlign: {
                alignX: string;
                alignY: string;
            };
            lightEffect: {
                enabled: boolean;
                darken: number;
                compositeType: string;
            };
        };
        customImageCache: string[];
        layers: any[];
        equipList: import('@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes').DataModelVirtual[];
    };
    updateBindingPointName(): void;
    /** 老数据结构 转为 新数据结构
        老 --->{
            "uqId": 2,
            "items": [
                {
                    "equipmentType": "XPlateform:System/$SystemEquipmentTemplates:EQUIPMENT-1327",
                    "equipmentName": "新建模板1212",
                    "equipmentRef": "XPlateform:XPlateform/$FacilityEquipments:EQUIPMENT-1784",
                    "innerRef": "equip_0",
                    "shapeList": [],
                    "pointList": [
                        {
                            "pointKey": "21",
                            "pointName": "211",
                            "pointType": "2032",
                            "shapeList": []
                        }
                    ]
                },
            ]
        }
        新 --->{
            "equipmentName": "新建模板1212",
            "equipmentRef": "XPlateform:XPlateform/$FacilityEquipments:EQUIPMENT-1784",
            "equipmentType": "XPlateform:System/$SystemEquipmentTemplates:EQUIPMENT-1327",
            "innerRef": 1,
            "bindingList": []
        }
        注意！这里将bindingList先初始化为空数组，在后面组件初始化时将其绑定关系写入。
    */
    processEquipList(data: any): any;
    removeBindPointFromEquipmentModel(id: number, cpntId: number): void;
    showBindingComponent(id: number): void;
    switchLanguage(lang: string): void;
}
declare const graphicItemManager: GraphicItemManager;
export default graphicItemManager;
