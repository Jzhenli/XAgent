import { default as BoundrayBox } from '../../common/BoundrayBox';
import { GBound, GTransform } from '../../DrawingArea';
import { default as BasicShapeAnimation } from './BasicShapeAnimation';
import { brushTypes, shapePropertyGroupDef } from '../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as GCtrlPoint } from '../../mouseHandler/GCtrlPoint';
import { default as GCtrlLine } from '../../mouseHandler/GCtrlLine';
import { default as GCtrlRotation } from '../../mouseHandler/GCtrlRotation';

export default class BasicEllipse extends BasicShapeAnimation {
    initOpt: any;
    constructor(opt?: any);
    postConstruct(): void;
    displayName: string;
    icon: string;
    boundrayBoxRotate: BoundrayBox;
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
    };
    brushTypes: brushTypes[];
    propertyMeta: shapePropertyGroupDef[];
    transMatrix: number[];
    transMatrixIvt: number[];
    updateTransform(): void;
    updateControls(): void;
    draw(context: CanvasRenderingContext2D, zoom?: number): void;
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
    getShapeTopLeft(): {
        x: number;
        y: number;
    };
}
