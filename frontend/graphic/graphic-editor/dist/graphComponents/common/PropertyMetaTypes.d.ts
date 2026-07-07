export declare enum propertyGroupRenderType {
    normal = "normal",
    bindingDashboard = "bindingDashboard",
    bindingStyle = "bindingStyle",
    bindingApi = "bindingApi",
    conditionFilter = "conditionFilter"
}
export declare enum shapePropertyRenderType {
    color = "color",
    number = "number",
    boolean = "boolean",
    angle = "angle",
    selection = "selection",
    bindingValue = "bindingValue",
    bindingList = "bindingList",
    bindingNavigation = "bindingNavigation",
    imageFile = "imageFile",
    text = "text",
    listBinding = "listBinding",
    shapeCustomType = "shapeCustomType",
    trendValue = "trendValue",
    pieBinding = "pieBinding",
    sankeyBinding = "sankeyBinding"
}
export type shapePropertyDef = {
    name: string;
    label: string | any;
    type: shapePropertyRenderType;
    opt?: any;
    items?: shapePropertyDef[];
    isDisabled?: any;
};
export type shapePropertyGroupDef = {
    group: string;
    type?: propertyGroupRenderType;
    items: shapePropertyDef[];
    opt?: any;
    isDisabled?: any;
};
export declare const propertyGroupRenderDictionary: Map<propertyGroupRenderType, any>;
export declare const propertyRenderDictionary: Map<shapePropertyRenderType, any>;
