import { default as Eventful } from '../components/common/Eventful';
import { Equipment, EquipmentTemplate } from '@x-plateform-mono/service/dist/equipmentService';
import { bindingObject } from './common/Bindable';
import { DataModelVirtual } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';
import { default as DataBindingComponent } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingComponent';

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
    equipTemplate: EquipmentTemplate | Equipment;
};
declare class LocalEquipmentManager extends Eventful {
    dataBindingManager: import('@x-plateform-mono/business/dist/components/dataBinder/DataBindingManager').default;
    constructor();
    innerRefMap: Map<any, any>;
    graphicEquipmentList: GraphicEquipment[];
    equipmentCache: Map<any, any>;
    equIndex: number;
    add(equiptemp: GraphicEquipObject): void;
    getGraphicEquipmentList(): GraphicEquipment[];
    getAttribute(b?: bindingObject): {
        equipName: string;
        pointName: string;
    } | undefined;
    setAttr(ref: string, attrName: string, attrVal: any): void;
    getOptions(item: GraphicEquipment): any;
    loadData(list: DataModelVirtual[]): void;
    exportData(): DataModelVirtual[];
    addBindingComponent(data: DataBindingComponent, type?: 'add' | 'copy' | 'load'): void;
    removeBindingComponent(data: DataBindingComponent): void;
    isExist(name: string): boolean;
    isBindingExist(b: bindingObject): boolean | undefined;
    getEquipmentDetail(equipmentRef: string): Promise<any>;
}
declare const localEquipmentManager: LocalEquipmentManager;
export default localEquipmentManager;
