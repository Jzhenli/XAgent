import { default as Eventful } from '@x-plateform-mono/service/dist/Eventful';
import { DataModelVirtual, BindedPoint } from './DataBindingTypes';
import { Equipment, EquipmentPoint, EquipmentTemplate } from '@x-plateform-mono/service/dist/equipmentService';
import { BACnetClassId } from '@x-plateform-mono/service/dist/bacnetClassId';
import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';
export default class DataBindingValidator extends Eventful {
    dataModels: DataModelVirtual[];
    pointValidateCache: Map<string, Promise<boolean>>;
    modelValidateCache: Map<string, Promise<Equipment | undefined>>;
    templateValidateCache: Map<string, Promise<EquipmentTemplate | undefined>>;
    validateBinding(binding?: (BindedPoint | {
        cpntId: number;
        innerName?: string;
        bindingType?: undefined;
    })): Promise<undefined | 'networkPointLost' | 'equipmentReferenceLost' | 'equipmentPointUnbind' | 'equipmentPointBindingLost' | 'equipmentTemplateLost'>;
    validatePoint(pointRef: string): Promise<boolean>;
    getEquipmentByRef(modelRef: string): Promise<Equipment | undefined>;
    getTemplateByRef(templateRef: string): Promise<EquipmentTemplate | undefined>;
    updateBindingList(model: DataModelVirtual, points: EquipmentPoint[]): Promise<void>;
    getPointInfo(reference: string, typeId?: BACnetClassId, type?: PointAttrValueType): Promise<{
        states: [number, string][];
        unit?: undefined;
        min?: undefined;
        max?: undefined;
    } | {
        unit: any;
        min: any;
        max: any;
        states?: undefined;
    } | undefined>;
}
