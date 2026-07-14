import { default as BoundrayBoxRotate } from '../../common/BoundrayBoxRotate';
import { GBound, GPoint, GTransform } from '../../DrawingArea';
import { default as GCtrlPoint } from '../../mouseHandler/GCtrlPoint';
import { default as GCtrlLine } from '../../mouseHandler/GCtrlLine';
import { default as GCtrlRotation } from '../../mouseHandler/GCtrlRotation';
import { brushTypes, propertyGroupRenderType, shapePropertyRenderType } from '../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { popupBindingValue } from '../../common/Bindable';
import { default as BasicShapeAnimation } from '../leftCtrlShapes/BasicShapeAnimation';

import * as matrix from '../../contains/matrix';
/**
 *       /\
 *      /  \
 *     /    \
 *    /      \
 *   /________\  cp1
 *      |  |
 *      |  |
 *      |  |
 *      |__|cp2
 */
export default class StraightArrow extends BasicShapeAnimation {
    initOpt: any;
    constructor(opt: any);
    shapeKeeper: {
        isArrDirUp: boolean;
        p1: number;
    };
    keepShapeBeforeMove(): void;
    keepSHapeMoving(center: GPoint, width: number, height: number, rotate?: number): void;
    displayName: string;
    icon: string;
    boundrayBoxRotate: BoundrayBoxRotate;
    cp1: GCtrlPoint;
    cp2: GCtrlPoint;
    transMatrix: matrix.MatrixArray;
    brushTypes: brushTypes[];
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
        cp1Pos: number;
        cp2Pos: number;
        arrowDir: boolean;
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
    propertyMeta: ({
        group: string;
        type: propertyGroupRenderType;
        items: never[];
        opt: {
            disableBorderRadius: boolean;
            enableColor?: undefined;
            enableBorderColor?: undefined;
            enableBackgroundColor?: undefined;
            getInitStates?: undefined;
            onUpdateState0?: undefined;
        };
    } | {
        group: string;
        type: propertyGroupRenderType;
        items: ({
            name: string;
            label: string;
            type: shapePropertyRenderType;
            opt: {
                animationAvail: boolean;
                animationStates: {
                    name: string;
                    label: string;
                }[];
            };
        } | {
            name: string;
            label: string;
            type: shapePropertyRenderType;
            opt?: undefined;
        })[];
        opt?: undefined;
    } | {
        group: string;
        type: propertyGroupRenderType;
        items: never[];
        opt: {
            enableColor: boolean;
            enableBorderColor: boolean;
            enableBackgroundColor: boolean;
            getInitStates: () => {
                borderColor: string;
                backgroundColor: string;
            };
            onUpdateState0: () => void;
            disableBorderRadius?: undefined;
        };
    })[];
    postConstruct(): void;
    updateTransform(): void;
    updateControls(): void;
    updateShapeCtrls(): void;
    getShapePoints(): number[][];
    shapeNormalize(): void;
    draw(context: CanvasRenderingContext2D, zoom?: number | undefined): void;
    drawRender(context: CanvasRenderingContext2D, zoom?: number | undefined): void;
    contains(x: number, y: number): boolean;
    withinBound(bound: GBound): boolean;
    getRectangle(angle: number): GBound;
    implementTransform(transform: GTransform, scale: number, r: number): void;
    setOptions(options: any): void;
    drift(dx: number, dy: number): void;
    getControlPoints(): GCtrlPoint[];
    getControlLines(): GCtrlLine[];
    getControlRotations(): GCtrlRotation[];
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
