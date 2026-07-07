import { BACnetClassId } from './bacnetClassId';
export declare enum BasicValueTypes {
    binary = "binary",
    state = "state",
    analog = "analog",
    text = "text",
    timestamp = "timestamp"
}
export declare enum MeterTemplateRef {
    elec = "XPlateform:System/$SystemEquipmentTemplates:CONTAINER_CLASS-SystemPreset:EQUIPMENT-Consumption-Elec",
    water = "XPlateform:System/$SystemEquipmentTemplates:CONTAINER_CLASS-SystemPreset:EQUIPMENT-Consumption-Water",
    gas = "XPlateform:System/$SystemEquipmentTemplates:CONTAINER_CLASS-SystemPreset:EQUIPMENT-Consumption-Gas"
}
export declare const MeterTemplateFolderRef = "XPlateform:System/$SystemEquipmentTemplates:CONTAINER_CLASS-SystemPreset";
export type DigitalTags = number;
export type EquipmentTemplateAttribute = {
    key: string;
    name: string;
    defaultValue: string;
    valueType: BasicValueTypes;
    valueUnit: string;
    options: any;
};
export type EquipmentAttribute = EquipmentTemplateAttribute;
export type EquipmentTemplatePoint = {
    key: string;
    reference?: string;
    name: string;
    pointTypeId: BACnetClassId;
    digitalTags: DigitalTags[];
};
export type EquipmentPoint = EquipmentTemplatePoint & {
    bindingPointRef?: string;
    presentValue?: string;
    unit?: string;
    activeText?: string;
    inactiveText?: string;
    mvStateText?: string;
};
export type EquipmentTemplate = {
    reference: string;
    name: string;
    description: string;
    type: string;
    location: string;
    status: string;
    runLogic: string;
    controlLogic: string;
    digitalTags: DigitalTags[];
    uniqueAttributes: EquipmentTemplateAttribute[];
    points: EquipmentTemplatePoint[];
};
export type Equipment = Omit<EquipmentTemplate, 'uniqueAttributes' | 'points'> & {
    templateReference: string;
    uniqueAttributes: EquipmentAttribute[];
    points: EquipmentPoint[];
};
export type EquipmentTemplateFolder = {
    reference: string;
    name: string;
    classId: BACnetClassId;
    hasChild: boolean;
};
export type EquipmentTemplateBrief = {
    reference: string;
    name: string;
    classId: BACnetClassId;
};
export declare class EquipmentService {
    getFolderContent(reference?: string): Promise<(EquipmentTemplateFolder | EquipmentTemplateBrief)[]>;
    getChildrenFolder(reference?: string): Promise<EquipmentTemplateFolder[]>;
    createFolder(name: string, reference?: string): Promise<unknown>;
    updateFolder(reference: string, name: string): Promise<unknown>;
    deleteFolder(reference: string): Promise<unknown>;
    /**
     * 根据文件夹或模板的reference获取其所有祖先节点
     */
    getAncestors(reference: string): Promise<(EquipmentTemplateFolder | EquipmentTemplateBrief)[]>;
    listTemplatePointTypes(): Promise<{
        typeName: string;
        typeId: number;
    }[]>;
    listTemplate(reference: string): Promise<EquipmentTemplateBrief[]>;
    createTemplate(reference: string, params: Omit<EquipmentTemplate, 'reference'>): Promise<any>;
    getTemplateDetail(reference: any): Promise<EquipmentTemplate | EquipmentTemplate[]>;
    updateTemplate(params: EquipmentTemplate): Promise<unknown>;
    deleteTemplate(templateRef: string): Promise<unknown>;
    listEquipmentBySpace(spaceRef: string): Promise<Equipment[]>;
    getEquipmentDetail(reference: string): Promise<Equipment>;
    createEquipment(spaceRef: string, equipmentTemplate: EquipmentTemplate): Promise<string>;
    updateEquipment(equipment: Equipment): Promise<unknown>;
    deleteEquipment(reference: string): Promise<unknown>;
    updateEquipmentBindings(equipReference: string, pointsBindingMap: {
        equipPointReference: string;
        bindingPointReference: string;
    }[]): Promise<unknown>;
    getSpaceByEquipment(equipRef: string): Promise<string>;
    updatepointlabel(data: any): Promise<unknown>;
}
declare const _default: EquipmentService;
export default _default;
