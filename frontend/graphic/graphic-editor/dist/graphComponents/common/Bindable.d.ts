export type widgetPoint = {
    point: (PointBinding | DataModelPointBinding | undefined);
    attribute?: any;
    analogValue: any;
    value: any;
};
export type DataModelPointBinding = {
    cpntId: number;
    bindingType: 'equipment';
    innerName?: string;
    innerRef: number;
    propType: 'attribute' | 'point';
    key: string;
};
export declare enum PointAttrValueType {
    Analog = "Analog",
    State = "State",
    String = "String",
    Binary = "Binary"
}
export type PointBinding = {
    cpntId: number;
    bindingType: 'point';
    innerName?: string;
    pointRef: string;
    pointName?: string;
    valueType?: PointAttrValueType;
    stateMap?: Map<number, string>;
    unitText?: string;
    relatedTrend?: {
        trendRef: string;
        trendName: string;
    };
};
export declare enum BasicValueTypes {
    binary = "binary",
    state = "state",
    analog = "analog",
    text = "text",
    timestamp = "timestamp"
}
export type DataModelVirtual = {
    equipmentType: string;
    equipmentRef?: string;
    equipmentName: string;
    innerRef: number;
    bindingList: {
        propType: 'attribute' | 'point';
        key: string;
        name: string;
        valueType: BasicValueTypes;
        stateMap?: Map<number, string>;
        unitText?: string;
        refs?: {
            id?: number;
            cpntId: number;
            innerName?: string;
        }[];
    }[];
};
export declare enum bindingType {
    Network = "Network",
    Equipment = "Equipment"
}
type rangeSection = {
    min: string;
    includeMin: boolean;
    max: string;
    includeMax: boolean;
};
export declare function animationRuleParser(text: string, isDisCrete: boolean): (string | rangeSection)[];
export {};
