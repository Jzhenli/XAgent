export type bindingValue = {
    pointReference: string;
    pointName: string;
    pointClassId: number;
    attributeId: number;
    attributeLabel: string;
};
export declare enum bindingType {
    Network = "Network",
    Equipment = "Equipment"
}
export type equipBindingValue = {
    innerRef: string;
    equipName?: string;
    key: string;
    pointType?: number;
    pointName?: string;
};
export type bindingObject = {
    [T in bindingType]: {
        type: T;
        bindingValue: {
            [bindingType.Network]: bindingValue;
            [bindingType.Equipment]: equipBindingValue;
        }[T];
    };
}[bindingType];
export type navBindingValue = {
    id: string;
    name: string;
    type?: string;
    graphicId?: string;
    graphicName?: string;
    dashboardId?: string;
    dashboardName?: string;
    videoBoardId?: string;
    videoBoardName?: string;
    layoutRef?: string;
    layoutName?: string;
    customLink?: string;
};
export type animationConfig = {
    defaultState: string | undefined;
    continous: string[];
    discrete: string[];
};
type rangeSection = {
    min: string;
    includeMin: boolean;
    max: string;
    includeMax: boolean;
};
export declare function animationRuleParser(text: string, isDisCrete: boolean): (string | rangeSection)[];
export {};
