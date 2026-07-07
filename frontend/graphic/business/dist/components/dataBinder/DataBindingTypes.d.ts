import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';
import { BasicValueTypes } from '@x-plateform-mono/service/dist/equipmentService';
/**
 * 图形工具/图表工具 + 数据点位绑定 = 渲染后的结果
 */
export type PointCustomApiBinding = {
    cpntId: number;
    bindingType: 'customApi';
    innerName?: string;
    programBody: string;
};
export type PointBinding = {
    isEditable?: boolean;
    cpntId: number;
    bindingType: 'point';
    innerName?: string;
    pointRef: string;
    pointName: string;
    pointType: PointAttrValueType;
    valueType: BasicValueTypes;
    range: {
        states?: [number, string][];
        min?: number;
        max?: number;
        unit?: string;
    };
    relatedTrend?: {
        trendRef: string;
        trendName: string;
    };
};
export type SinglePointBindingConfig = {
    innerName?: string;
    valueType?: BasicValueTypes[];
    valueEditable?: boolean;
    hideInnerName?: boolean;
    pickRelatedTrend?: boolean;
    maxNameLength?: number;
};
/**
 * innerName变更逻辑说明
 * 1. 预定义的点innerName不能修改，使用配置信息中的innerName作为绑定点的innerName
 * 2. 如果是动态创建的绑定点，如果customPointConfig中没有配置innerName，
 *    绑定点的innerName初始为空，每次重新选择绑定点时，innerName会被重置为绑定对象的描述
 * 3. 如果customPointConfig中配置了innerName，绑定点的innerName初始为配置的名称，
 *    每次重新选择绑定点时，innerName不会被重置
 * 4. 如果配置了innerName，且为模板形式，会根据当前面板（PointBindingPanel）中所有绑定点的名称生成下一个名称
 * 5. 如果没有配置innerName且手动修改了绑定点的innerName，修改绑定时innerName会被重置为绑定对象的描述
 * 6. 如果配置了innerName且手动修改了绑定点的innerName，修改绑定时innerName不会被重置
 */
export type MultiPointBindingConfig = {
    preDefinedList?: (SinglePointBindingConfig & {
        required?: boolean;
        locked?: boolean;
        rename?: boolean;
    })[];
    editable?: boolean;
    customName?: boolean;
    maxCount?: number;
    customPointConfig?: SinglePointBindingConfig;
};
/**
 * 图形工具/图表工具 + { 数据模型内部的点位绑定 } = 模版
 * 模版 + 数据模型 = 渲染后的结果
 */
export type DataModelVirtual = {
    equipmentType: string;
    equipmentRef?: string;
    equipmentName: string;
    innerRef: number;
    bindingList: {
        propType: 'attribute' | 'point';
        equipmentPointRef?: string;
        key: string;
        name: string;
        valueType: BasicValueTypes;
        range: {
            states?: [number, string][];
            min?: number;
            max?: number;
            unit?: string;
        };
        refs?: {
            id?: number;
            cpntId: number;
            innerName?: string;
        }[];
    }[];
};
export type DataModelPointBinding = {
    isEditable?: boolean;
    cpntId: number;
    bindingType: 'equipment';
    innerName?: string;
    innerRef: number;
    propType: 'attribute' | 'point';
    key: string;
};
export type DataModelBindingConfig = {
    enableModelBinding?: boolean;
    enableAttributeBinding?: boolean;
    enablePointBinding?: boolean;
    multiModelBinding?: boolean;
    disableModelTemplateBinding?: boolean;
    enableVirtualModelBinding?: boolean;
    enableCustomApiBinding?: boolean;
    disableClickBinding?: boolean;
};
/**
 * 图形工具/图表工具 + 数据模型内部的点位绑定 = 模版
 * 模版 + { 数据模型 } = 渲染后的结果
 */
export type DataModelBinding = {
    equipmentName: string;
    dataModelRef: string;
    dataModelName: string;
};
export type BindedPoint = PointBinding | DataModelPointBinding | PointCustomApiBinding;
export type DataBindingObject = {
    pointBindings: (BindedPoint | {
        cpntId: number;
        innerName?: string;
    })[];
    dataModels: DataModelVirtual[];
    modelBindings: DataModelBinding[];
};
export type DataBindingSubObject = Pick<DataBindingObject, 'pointBindings'>;
