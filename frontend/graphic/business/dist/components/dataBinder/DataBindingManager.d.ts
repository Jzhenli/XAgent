import { MultiPointBindingConfig, DataModelBinding, DataModelVirtual, DataModelPointBinding, SinglePointBindingConfig, DataModelBindingConfig, BindedPoint } from './DataBindingTypes';
import { BasicValueTypes, Equipment, EquipmentTemplate } from '@x-plateform-mono/service/dist/equipmentService';
import { default as DataBindingComponent } from './DataBindingComponent';
import { default as DBHistoryManger } from '../histroyManger/DBHistoryManger';
export default class DataBindingManager extends DBHistoryManger {
    modelBindings: DataModelBinding[];
    nextInnerRef: number;
    loadDataModels(list: DataModelVirtual[]): void;
    /**
     * @param option 绑定面板可选项
     * @param pointBindings
     * @param id 多个组件绑定一组模型时每个组件的id
     * @returns
     */
    getInitPoints(option: MultiPointBindingConfig, pointBindings: (BindedPoint | {
        cpntId: number;
        innerName?: string;
        bindingType?: undefined;
    })[], id?: number): Promise<[binding: BindedPoint | {
        cpntId: number;
        innerName?: string;
        bindingType?: undefined;
    }, config: SinglePointBindingConfig & {
        innerName?: string;
        locked?: boolean;
        required?: boolean;
        predifined: boolean;
    }, cpntId: number, pointValidation: "networkPointLost" | "equipmentReferenceLost" | "equipmentPointUnbind" | "equipmentPointBindingLost" | "equipmentTemplateLost" | undefined][]>;
    /**
     * 如果DataBindingComponent存在且实现了getNextCpntId，则调用，否则返回undefined
     */
    getNextCpntIdx(id?: number): number | undefined;
    addDataModelVirtual(item: EquipmentTemplate): number;
    findBindedModel(item: Equipment): DataModelVirtual[];
    addDataModelBinded(item: Equipment): Promise<[number, EquipmentTemplate]>;
    renameModel(innerRef: number, newName: string): void;
    setDefaultEquipmentForModel(innerRef: number, equipment?: Equipment): void;
    removeDataModelVirtual(innerRef: number): void;
    removeDataModelFromPointBindings(innderRef: number, pointBindings: BindedPoint[]): void;
    bindModel(item: {
        id?: number;
        cpntId: number;
        itemInnerName?: string;
    }, value: DataModelPointBinding): Promise<void>;
    removePointBindingItem(id: number | undefined, cpntId: number): void;
    changePointBindingItemInnerName(innerRef: number, key: string, id: number, cpntId: number, value: string): void;
    getEquipBindingRange(innderRef: number, key: string): {
        valueType: BasicValueTypes;
        states?: [number, string][];
        min?: number;
        max?: number;
        unit?: string;
    } | undefined;
    getEquipBindingName(innerRef: number, key: string): string;
    equipmentTemplateCache: Map<string, EquipmentTemplate>;
    getEquipmentTemplate(templateId: string): Promise<EquipmentTemplate>;
    getEquipmentTemplateByInnerRef(innerRef: number): Promise<EquipmentTemplate | undefined>;
    nextCpntId: number;
    componentMap: Map<number, DataBindingComponent>;
    loadBindingComponent(data: DataBindingComponent): void;
    addBindingComponent(data: DataBindingComponent): void;
    copyBindingComponent(data: DataBindingComponent): void;
    addPointBindingItem(id: number, binding: BindedPoint): void;
    removeCpnt(id: number): void;
    getComponentName(id?: number): string | undefined;
    getDefaultModelConfig(config?: DataModelBindingConfig): DataModelBindingConfig;
}
