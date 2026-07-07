import { DataModelBinding, DataModelPointBinding, DataModelVirtual, PointBinding, BindedPoint } from './DataBindingTypes';
import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';
import { Equipment } from '@x-plateform-mono/service/dist/equipmentService';
import { trendData } from '@x-plateform-mono/service/dist/trendService';
import { default as DataBindingValidator } from './DataBindingValidator';
export default class DataAccessManager extends DataBindingValidator {
    currentSpaceRef: string;
    dataModels: DataModelVirtual[];
    modelBindings: DataModelBinding[];
    id: number | undefined;
    constructor(id?: number);
    setDataModels(list: DataModelVirtual[]): void;
    spaceEquipmentsPromise: Promise<Equipment[]>;
    setCurrentSpace(spaceRef?: string): void;
    getCurrentSpaceEquipmentByName(name: string, templateRef: string): Promise<Equipment | undefined>;
    setModelBindings(list: DataModelBinding[]): void;
    pointTrendCache: Map<string, Promise<string>>;
    getTrendRefByPointRef(pointRef: string): Promise<string>;
    getTrendRef(list: (PointBinding | DataModelPointBinding | undefined)[]): Promise<({
        cpntId: number;
        ref: string;
    } | undefined)[]>;
    getTrendResult(list: (BindedPoint | undefined)[], chartCondition: {
        jMode: number;
        dMode: number;
        startDate: Date;
        endDate: Date;
    }): Promise<({
        cpntId: number;
        ref?: string;
        data?: trendData;
    } | undefined)[]>;
    subscribedPointMap: Map<string, ((value: any, type?: PointAttrValueType, translatedText?: string) => void)[]>;
    cachedPointValue: Map<string, any>;
    setPointBindings(list: ([
        BindedPoint | undefined,
        ((value: any, type?: PointAttrValueType, translatedText?: string) => void) | undefined
    ])[]): Promise<any[]>;
    getEquipmentByDataModelBinding(binding: DataModelPointBinding): Promise<Equipment | undefined>;
    dispose(): void;
    subManagerMap: Map<number, {
        manager: DataAccessManager;
        dispose: () => void;
    }>;
    index: number;
    createSubManager(): DataAccessManager;
    findSubManager(id: number): DataAccessManager | undefined;
    disposeSubManager(id: number): void;
}
