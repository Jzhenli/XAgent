export declare enum propertyGroupRenderType {
    normal = "normal",
    listBinding = "listBinding",
    bindingDashboard = "bindingDashboard",
    pieBinding = "pieBinding"
}
export declare enum shapePropertyRenderType {
    color = "color",
    number = "number",
    boolean = "boolean",
    angle = "angle",
    selection = "selection",
    bindingValue = "bindingValue",
    bindingNavigation = "bindingNavigation",
    imageFile = "imageFile",
    text = "text",
    listBinding = "listBinding",
    shapeCustomType = "shapeCustomType",
    trendValue = "trendValue",
    pieBinding = "pieBinding"
}
export type shapePropertyDef = {
    name: string;
    label: string;
    type: shapePropertyRenderType;
    opt?: any;
};
export type shapePropertyGroupDef = {
    group: string;
    type?: propertyGroupRenderType;
    items: shapePropertyDef[];
    opt?: any;
};
export declare const propertyGroupRenderDictionary: Map<propertyGroupRenderType, any>;
export declare const propertyRenderDictionary: Map<shapePropertyRenderType, any>;
