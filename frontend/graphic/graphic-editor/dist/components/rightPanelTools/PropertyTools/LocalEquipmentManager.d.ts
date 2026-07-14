import { bindingObject } from '../../common/Bindable';
import { default as Eventful } from '../../common/Eventful';

export type GraphicEquipment = {
    equipmentType: string;
    equipmentName: string;
    equipmentRef?: string;
    brokenlinkFlag?: boolean;
    innerRef: string;
    shapeList: any[];
    pointList: {
        pointKey: string;
        pointName?: string;
        pointType?: string;
        shapeList: any[];
    }[];
};
export type GraphicEquipObject = {
    equipName: string;
    equipTemplate: any;
};
declare class LocalEquipmentManager extends Eventful {
    constructor();
    innerRefMap: Map<any, any>;
    graphicEquipmentList: GraphicEquipment[];
    equipmentCache: Map<any, any>;
    equIndex: number;
    add(equiptemp: GraphicEquipObject): void;
    getGraphicEquipmentList(): GraphicEquipment[];
    getAttribute(b?: bindingObject): void;
    setAttr(ref: string, attrName: string, attrVal: any): void;
    getOptions(item: GraphicEquipment): any;
    loadData(list: any[]): void;
    exportData(): never[];
    addBindingComponent(data: any, type?: 'add' | 'copy' | 'load'): void;
    removeBindingComponent(data: any): void;
    isExist(name: string): boolean;
    isBindingExist(b: bindingObject): void;
}
declare const localEquipmentManager: LocalEquipmentManager;
export default localEquipmentManager;
