import { GBound, GTransform } from '../DrawingArea';
import { default as BoundrayBoxRotate } from '../common/BoundrayBoxRotate';
import { default as GCtrlPoint } from '../mouseHandler/GCtrlPoint';
import { default as GCtrlLine } from '../mouseHandler/GCtrlLine';
import { default as GCtrlRotation } from '../mouseHandler/GCtrlRotation';
import { brushTypes, shapePropertyGroupDef } from '../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { popupBindingValue, mulPopupBindingValue } from '../common/Bindable';
import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';
import { default as GMouseEvent } from '../mouseHandler/GMouseEvent';
import { default as BasicShapeAnimation } from './leftCtrlShapes/BasicShapeAnimation';
import { BindedPoint } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';

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
    getPointAttrValueRegistrators(): [BindedPoint, (value: string, type?: PointAttrValueType) => void][];
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
    getMulPopupBinding(): mulPopupBindingValue | null;
    hasCustomBinding(): boolean;
    getOptions(): any;
}
export default BasicImage;
