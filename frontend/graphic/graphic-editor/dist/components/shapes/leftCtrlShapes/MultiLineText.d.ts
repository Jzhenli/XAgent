import { GBound, GTransform } from '../../DrawingArea';
import { brushTypes, shapePropertyGroupDef } from '../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as BoundrayBoxRotate } from '../../common/BoundrayBoxRotate';
import { default as GCtrlPoint } from '../../mouseHandler/GCtrlPoint';
import { default as GCtrlLine } from '../../mouseHandler/GCtrlLine';
import { default as GCtrlRotation } from '../../mouseHandler/GCtrlRotation';
import { default as GMouseEvent } from '../../mouseHandler/GMouseEvent';
import { popupBindingValue } from '../../common/Bindable';
import { default as BasicShapeAnimation } from './BasicShapeAnimation';

import * as matrix from '../../contains/matrix';
export type TextEditorMLProps = {
    transMatrix: number[];
    content: string;
    fontStyles: string;
    paddingStyles: string;
    textAlign: string;
    verticalAligh: string;
    width: number;
    height: number;
    lineHeight: number;
};
export default class MultiLineText extends BasicShapeAnimation {
    initOpt: any;
    constructor(opt?: any);
    displayName: string;
    icon: string;
    boundrayBoxRotate: BoundrayBoxRotate;
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
        bindingMultiplePopup: any;
        enableAnimationConfig: boolean;
        multiFrameAnimationConfig: undefined;
        multiStateConfig: undefined;
    };
    brushTypes: brushTypes[];
    propertyMeta: shapePropertyGroupDef[];
    transMatrix: matrix.MatrixArray;
    postConstruct(): void;
    dblClickHandler(evt: GMouseEvent): void;
    getMatrixForEditor(): number[];
    updateTransform(): void;
    updateControls(): void;
    isEditingText: boolean;
    draw(context: CanvasRenderingContext2D, zoom?: number | undefined): void;
    drawRender(context: CanvasRenderingContext2D, zoom?: number | undefined): void;
    contains(x: number, y: number): boolean;
    withinBound(bound: GBound): boolean;
    getRectangle(angle: number): GBound;
    implementTransform(transform: GTransform, scale: number, r: number): void;
    getControlPoints(): GCtrlPoint[];
    getControlLines(): GCtrlLine[];
    getControlRotations(): GCtrlRotation[];
    setOptions(options: any): void;
    drift(dx: number, dy: number): void;
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
    getShapeTopLeft(): {
        x: number;
        y: number;
    };
}
