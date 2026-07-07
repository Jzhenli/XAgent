import { GPoint } from '../../DrawingArea';
import { default as BasicText } from '../BasicText';
import { default as GMouseEvent } from '../../mouseHandler/GMouseEvent';
import { shapePropertyGroupDef } from '../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { navBindingValue, mulPopupBindingValue } from '../../common/Bindable';
import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';
import { BindedPoint } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';

export type BasicValueBoxProp = {
    center?: GPoint;
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    fontWeight?: boolean;
    fontItalic?: boolean;
    underline?: boolean;
    textAlign: 'center';
    background?: string;
    borderColor?: string;
    borderWidth?: number;
    showValue?: boolean;
    showUnit?: boolean;
    showState?: boolean;
};
declare class BasicValueBox extends BasicText {
    constructor(opt?: BasicValueBoxProp);
    setInitProps(): void;
    postConstruct(): void;
    displayName: string;
    isLock: boolean;
    isView: boolean;
    icon: string;
    options: {
        className: string;
        center: {
            x: number;
            y: number;
        };
        width: number;
        height: number;
        rotation: number;
        borderRadius: number;
        enableBackground: boolean;
        backgroundColor: string;
        showBorder: boolean;
        borderColor: string;
        borderWidth: number;
        enableShadow: boolean;
        shadowColor: string;
        enableBorderShadow: boolean;
        borderShadowColor: string;
        shadowBlur: number;
        shadowOffset: {
            x: number;
            y: number;
        };
        enableInnerShadow: boolean;
        innerShadowColor: string;
        innerShadowBlur: number;
        text: string;
        fontFamily: string;
        fontSize: number;
        color: string;
        fontWeight: "bold" | "normal";
        fontStyle: "italic" | "normal";
        textDecoration: "underline" | "none";
        textAlign: "left" | "right" | "center";
        paddingTop: number;
        paddingRight: number;
        paddingBottom: number;
        paddingLeft: number;
        enableTextShadow: boolean;
        textShadowOffset: {
            x: number;
            y: number;
        };
        textShadowBlur: number;
        showValue: boolean;
        showUnit: boolean;
        showState: boolean;
        precision: number;
        disableSetValue: boolean;
        bindingValue: {
            bindingList?: any[] | undefined;
            animationConfig?: {
                defaultState: string | undefined;
                continous: string[];
                discrete: string[];
            } | undefined;
        } | null;
        bindingNavigation: {
            id: string;
            name: string;
            type?: string | undefined;
            graphicId?: string | undefined;
            graphicName?: string | undefined;
            dashboardId?: string | undefined;
            dashboardName?: string | undefined;
            videoBoardId?: string | undefined;
            videoBoardName?: string | undefined;
            layoutRef?: string | undefined;
            layoutName?: string | undefined;
        } | null;
        bindingPopup: {
            id: string;
            name: string;
            graphicId: string;
            graphicName: string;
        } | null;
        bindingMultiplePopup: {
            type: "dashboard" | "chart" | "points";
            dashboardValue?: {
                name: string;
                reference: string;
            } | undefined;
            dashboardAttr: {
                position: string;
            };
            chartValue?: {
                name: string;
                reference: string;
            } | undefined;
            chartAttr: {
                width: number;
                height: number;
                offsetX: number;
                offsetY: number;
            };
            pointsItems?: {
                pointBindings: ({
                    isEditable?: boolean | undefined;
                    cpntId: number;
                    bindingType: "point";
                    innerName?: string | undefined;
                    pointRef: string;
                    pointName: string;
                    pointType: PointAttrValueType;
                    valueType: import('@x-plateform-mono/service/dist/equipmentService').BasicValueTypes;
                    range: {
                        states?: [number, string][] | undefined;
                        min?: number | undefined;
                        max?: number | undefined;
                        unit?: string | undefined;
                    };
                    relatedTrend?: {
                        trendRef: string;
                        trendName: string;
                    } | undefined;
                } | {
                    isEditable?: boolean | undefined;
                    cpntId: number;
                    bindingType: "equipment";
                    innerName?: string | undefined;
                    innerRef: number;
                    propType: "point" | "attribute";
                    key: string;
                } | {
                    cpntId: number;
                    bindingType: "customApi";
                    innerName?: string | undefined;
                    programBody: string;
                } | {
                    cpntId: number;
                    innerName?: string | undefined;
                })[];
                dataModels: {
                    equipmentType: string;
                    equipmentRef?: string | undefined;
                    equipmentName: string;
                    innerRef: number;
                    bindingList: {
                        propType: "point" | "attribute";
                        equipmentPointRef?: string | undefined;
                        key: string;
                        name: string;
                        valueType: import('@x-plateform-mono/service/dist/equipmentService').BasicValueTypes;
                        range: {
                            states?: [number, string][] | undefined;
                            min?: number | undefined;
                            max?: number | undefined;
                            unit?: string | undefined;
                        };
                        refs?: {
                            id?: number | undefined;
                            cpntId: number;
                            innerName?: string | undefined;
                        }[] | undefined;
                    }[];
                }[];
                modelBindings: {
                    equipmentName: string;
                    dataModelRef: string;
                    dataModelName: string;
                }[];
            } | undefined;
            pointsAttr: {
                width: number;
                height: number;
                offsetX: number;
                offsetY: number;
            };
            triggerType?: "hover" | "clickToggle" | "clickActive" | "always" | undefined;
            customConfig?: {
                allowEditShow?: boolean | undefined;
                editShow?: boolean | undefined;
            } | undefined;
        };
        lastTextWidth: number;
        isShow2: boolean;
        isShow3: boolean;
        isShow4: boolean;
        isShow5: boolean;
        color2: string;
        color3: string;
        color4: string;
        color5: string;
        borderColor2: string;
        borderColor3: string;
        borderColor4: string;
        borderColor5: string;
        backgroundColor2: string;
        backgroundColor3: string;
        backgroundColor4: string;
        backgroundColor5: string;
        enableAnimationConfig: boolean;
        multiFrameAnimationConfig: undefined;
        multiStateConfig: undefined;
    };
    propertyMeta: shapePropertyGroupDef[];
    lastTextWidth: number;
    drawRender(context: CanvasRenderingContext2D, zoom?: number | undefined): void;
    getDefaultImg(): string;
    rawValue: string;
    valueReg: string;
    valueType: PointAttrValueType;
    unitReg: string;
    stateReg: string;
    updateTextByValue(): void;
    getPointAttrValueRegistrators(dataAccessManager?: any): [BindedPoint, any][];
    updateUnit(dataModels?: any, bv?: any): void;
    getPointAttrBinding(): any;
    getNavigationLink(): navBindingValue | null;
    getMulPopupBinding(): mulPopupBindingValue | null;
    isRenderPointer(): boolean;
    dblClickHandler(evt: GMouseEvent): void;
    hasCustomBinding(): boolean;
    renderHidden: boolean;
    renderStrokeStyle: string;
    renderFillStyle: string;
    renderColor: string;
}
export default BasicValueBox;
