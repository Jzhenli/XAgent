import { default as MultiLineText } from '../leftCtrlShapes/MultiLineText';
import { brushTypes, shapePropertyGroupDef } from '../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as GMouseEvent } from '../../mouseHandler/GMouseEvent';
import { popupBindingValue } from '../../common/Bindable';

declare class MultiPointCalculateCpnt extends MultiLineText {
    constructor(opt: any);
    postConstruct(): void;
    displayName: string;
    options: {
        className: string;
        center: {
            x: number;
            y: number;
        };
        rotation: number;
        width: number;
        height: number;
        keepAspectRatio: boolean;
        borderRadius: number;
        enableBackground: boolean;
        backgroundColor: string;
        showBorder: boolean;
        borderColor: string;
        borderWidth: number;
        enableShadow: boolean;
        shadowColor: string;
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
        lineHeight: number;
        color: string;
        fontWeight: "bold" | "normal";
        fontStyle: "italic" | "normal";
        textDecoration: "underline" | "none";
        textAlign: "left" | "right" | "center";
        verticalAlign: "top" | "right" | "middle";
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
        bindingValue: {
            bindingList?: any[] | undefined;
            animationConfig?: {
                defaultState: string | undefined;
                continous: string[];
                discrete: string[];
            } | undefined;
        } | null;
        bindingExpression: {
            expression?: string | undefined;
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
        bindingMultiplePopup: any;
        enableAnimationConfig: boolean;
        multiFrameAnimationConfig: undefined;
        multiStateConfig: undefined;
    };
    brushTypes: brushTypes[];
    propertyMeta: shapePropertyGroupDef[];
    getDefaultImg(): string;
    avoidMergePropOnInit(): boolean;
    dblClickHandler(evt: GMouseEvent): void;
    relatedChildrenProperties: string[];
    drawRender(context: CanvasRenderingContext2D, zoom?: number | undefined): void;
    bindingPointList: string[];
    bindingPointValueList: number[];
    getPointAttrValueRegistrators(): [any, (value: string, type?: any) => void][];
    calResult: number;
    updateExpressionResult(type: any): void;
    renderHidden: boolean;
    renderStrokeStyle: string;
    renderFillStyle: string;
    renderColor: string;
    set(key: string, value: any): void;
    isRenderPointer(): boolean;
    getNavigationLink(): {
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
    getPopupBinding(): popupBindingValue | null;
    getMulPopupBinding(): any | null;
    hasCustomBinding(): boolean;
}
export default MultiPointCalculateCpnt;
