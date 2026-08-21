export declare enum propertyGroupRenderType {
    normal = "normal",
    binding = "binding",
    listBinding = "listBinding",
    alignItems = "alignItems",
    orderItems = "orderItems",
    bindingDashboard = "bindingDashboard",
    propertyGroupBackground = "propertyGroupBackground",
    propertyGroupText = "propertyGroupText",
    propertyGroupPositionSize = "propertyGroupPositionSize",
    propertyGroupViewPosition = "propertyGroupViewPosition",
    animationConfigGroup = "animationConfigGroup",
    iconPropertyConfig = "iconPropertyConfig",
    GlowEffectConfig = "GlowEffectConfig",
    popupConfigGroup = "popupConfigGroup"
}
export declare enum brushTypes {
    backgroundStyle = "backgroundStyle",
    textStyle = "textStyle",
    shadingColor = "shadingColor",
    iconStyle = "iconStyle"
}
export declare const brushPropertiesMap: Map<brushTypes, string[]>;
export declare enum shapePropertyRenderType {
    position = "position",
    color = "color",
    number = "number",
    boolean = "boolean",
    viewPosition = "viewPosition",
    angle = "angle",
    selection = "selection",
    bindingValue = "bindingValue",
    bindingNavigation = "bindingNavigation",
    imageFile = "imageFile",
    text = "text",
    listBinding = "listBinding",
    customBinding = "customBinding",
    bindingPopup = "bindingPopup",
    bindingMultiplePopup = "bindingMultiplePopup",
    bindingExpression = "bindingExpression",
    popupConfig = "popupConfig"
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
