import { default as PathProxy } from '../contains/PathProxy';
import { GBound, GPoint, GTransform } from '../DrawingArea';
import { default as GCtrlCurve } from '../mouseHandler/GCtrlCurve';
import { default as GCtrlLine } from '../mouseHandler/GCtrlLine';
import { default as GCtrlPoint } from '../mouseHandler/GCtrlPoint';
import { default as BoundrayBoxRotate } from '../common/BoundrayBoxRotate';
import { default as GCtrlRotation } from '../mouseHandler/GCtrlRotation';
import { default as GMouseEvent } from '../mouseHandler/GMouseEvent';
import { shapePropertyGroupDef } from '../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as BasicShapeAnimation } from './leftCtrlShapes/BasicShapeAnimation';

declare class BasicPath extends BasicShapeAnimation {
    initOpt: any;
    inRender: boolean;
    isDragStart: boolean;
    isShiftDown: boolean;
    isHalfCurve: boolean;
    constructor(opt: any, inRender?: boolean);
    displayName: string;
    icon: string;
    boundrayBoxRotate: BoundrayBoxRotate;
    editingPath: boolean;
    initialEditing: boolean;
    pathCtrlPoints: GCtrlPoint[];
    pathDirCtrlPoints: [GCtrlPoint | null, GCtrlPoint | null][];
    pathCtrlCurves: GCtrlCurve[];
    pathCtrlLines: [GCtrlLine | null, GCtrlLine | null][];
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
        closePath: boolean;
        pathData: {
            b?: [number, number] | undefined;
            p: [number, number];
            a?: [number, number] | undefined;
        }[];
        bindingValue: {
            bindingList?: any[] | undefined;
            animationConfig?: {
                defaultState: string | undefined;
                continous: string[];
                discrete: string[];
            } | undefined;
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
                    pointType: import('@x-plateform-mono/service/dist/constants').PointAttrValueType;
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
        isShow2: boolean;
        isShow3: boolean;
        isShow4: boolean;
        isShow5: boolean;
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
        enableLightEffect: boolean;
        lightEffectRadius: number;
    };
    propertyMeta: shapePropertyGroupDef[];
    pathProxy: PathProxy;
    pathProxyDraw: PathProxy;
    editEnd: any;
    beforeSave(): void;
    postConstruct(): void;
    dblClickHandler(evt: GMouseEvent): void;
    updateControls(): void;
    setUnclosedPathProperty(): void;
    draw(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, zoom?: number | undefined): void;
    drawRender(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, zoom?: number | undefined): void;
    lightEffectShaderNeedsUpdate: boolean;
    lightShaderCanvasSrc: OffscreenCanvas | null;
    lightShaderContextSrc: OffscreenCanvasRenderingContext2D | null;
    lightShaderCanvasDst: OffscreenCanvas | null;
    drawLightEffect(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, zoom: number): void;
    updateLightEffectShaderDebounce: number;
    updateLightEffectShader(): void;
    contains(x: number, y: number): boolean;
    withinBound(bound: GBound): boolean;
    getRectangle(angle: number): GBound;
    implementTransform(transform: GTransform, scale: number, r: number): void;
    setOptions(options: any): void;
    drift(dx: number, dy: number): void;
    getControlPoints(): GCtrlPoint[];
    getPathDirCtrlPoints(): GCtrlPoint[];
    getControlLines(): GCtrlLine[];
    getPathCtrlLines(): GCtrlLine[];
    getControlRotations(): GCtrlRotation[];
    set(key: string, value: any): void;
    updateEditingControls(): void;
    setPathPoint(p: GPoint, idx: number, needUpdatePathData?: boolean): void;
    addPathPoint(p: GPoint, idx?: number): void;
    updateCtrlCurve(idx: number): void;
    setCtrlPoint(p: GPoint | null, idx?: number, prev?: boolean, needUpdatePathData?: boolean): void;
    createPathPoint(p: GPoint): GCtrlPoint;
    createCtrlPoint(p: GPoint): GCtrlPoint;
    deleteDirPoint(): void;
    createCtrlLine(s: GPoint, e: GPoint): GCtrlLine;
    createCtrlCurve(s: GPoint, e: GPoint, cp1?: GPoint, cp2?: GPoint): GCtrlCurve;
    lineToCursorPoint: GCtrlCurve | null;
    updateLineToCursorPoint(p: GPoint | null, isShift?: boolean): void;
    shiftAuxiliaryLine: GCtrlCurve[];
    setShiftAuxiliaryLine(show: boolean): void;
    transMatrix: number[];
    transMatrixIvt: number[];
    confirmEdit(): void;
    /**
     * 先基于当前的matrix绘制一下变更后的Path，
     * 计算新的边界范围，基于新的边界范围中心点，宽高
     * 计算旧Matrix到新Matrix的变换矩阵
     * 基于变换矩阵反向变换PathData
     */
    normalizeShape(): void;
    applyTransformToPathData(m: number[]): void;
    updatePathProxy(): void;
    updatePathProxyDraw(): void;
    updateTransform(): void;
    removePathPoint(): void;
    getShapeTopLeft(): {
        x: number;
        y: number;
    };
    isValidPath(): boolean;
}
export default BasicPath;
