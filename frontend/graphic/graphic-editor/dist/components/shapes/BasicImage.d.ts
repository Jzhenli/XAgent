import { GBound, GTransform } from '../DrawingArea';
import { default as BoundrayBoxRotate } from '../common/BoundrayBoxRotate';
import { default as GCtrlPoint } from '../mouseHandler/GCtrlPoint';
import { default as GCtrlLine } from '../mouseHandler/GCtrlLine';
import { default as GCtrlRotation } from '../mouseHandler/GCtrlRotation';
import { brushTypes, shapePropertyGroupDef } from '../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { popupBindingValue } from '../common/Bindable';
import { default as GMouseEvent } from '../mouseHandler/GMouseEvent';
import { default as BasicShapeAnimation } from './leftCtrlShapes/BasicShapeAnimation';

import * as matrix from '../contains/matrix';
declare class BasicImage extends BasicShapeAnimation {
    initOpt: any;
    constructor(opt: any);
    dblClickHandler(evt: GMouseEvent): void;
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
        originAspectRatio: boolean;
        src: string;
        enableBackground: boolean;
        borderRadius: number;
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
    propertiesCannotBrush: string[];
    propertyMeta: shapePropertyGroupDef[];
    postConstruct(): void;
    drawCalculate(ctx: CanvasRenderingContext2D, width: number, height: number, isRender: boolean, zoom?: number | undefined): void;
    draw(ctx: CanvasRenderingContext2D, zoom?: number | undefined): void;
    isStateOn: boolean;
    drawRender(ctx: CanvasRenderingContext2D, zoom?: number): void;
    isGifParsed: boolean;
    parsedGifImages: string[];
    parsedGifImageDelays: number[];
    isOnceGifOver: boolean;
    getImage(src?: string, middleFrameImg?: {
        name: string;
        src: string;
        srcCustomCacheIdx?: number;
        isGifParsed?: boolean;
        passedTime?: number;
    }, isRender?: boolean): HTMLImageElement | HTMLCanvasElement | undefined;
    contains(x: number, y: number): boolean;
    withinBound(bound: GBound): boolean;
    getRectangle(angle: number): GBound;
    implementTransform(transform: GTransform, scale: number, r: number): void;
    setOptions(options: any, customImgCache?: string[]): void;
    drift(dx: number, dy: number): void;
    transMatrix: matrix.MatrixArray;
    updateControls(): void;
    updateTransform(): void;
    getControlPoints(): GCtrlPoint[];
    getControlLines(): GCtrlLine[];
    getControlRotations(): GCtrlRotation[];
    getShapeTopLeft(): {
        x: number;
        y: number;
    };
    setInitSize(width: number, height: number): void;
    set(key: string, value: any): void;
    getPointAttrValueRegistrators(): [any, (value: string, type?: any) => void][];
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
    getOptions(): any;
}
export default BasicImage;
