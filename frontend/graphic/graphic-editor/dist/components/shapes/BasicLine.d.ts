import { GBound, GPoint, GTransform } from '../DrawingArea';
import { default as GItem } from './GItem';
import { default as GCtrlPoint } from '../mouseHandler/GCtrlPoint';
import { shapePropertyGroupDef } from '../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { popupBindingValue, mulPopupBindingValue } from '../common/Bindable';

export type BasicLineProps = {
    start?: GPoint;
    end?: GPoint;
    backgroundColor?: string;
    lineWidth?: number;
};
declare class BasicLine extends GItem {
    constructor(opt?: BasicLineProps);
    displayName: string;
    isLock: boolean;
    isView: boolean;
    icon: string;
    options: {
        className: string;
        start: {
            x: number;
            y: number;
        };
        end: {
            x: number;
            y: number;
        };
        backgroundColor: string;
        lineWidth: number;
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
    };
    propertyMeta: shapePropertyGroupDef[];
    startCtrl: GCtrlPoint;
    endCtrl: GCtrlPoint;
    draw(context: CanvasRenderingContext2D): void;
    contains(x: number, y: number): boolean;
    withinBound(bound: GBound): boolean;
    getRectangle(angle: number): GBound;
    implementTransform(transform: GTransform, scale: number, r: number): void;
    getControlPoints(): GCtrlPoint[];
    private updateControlPoints;
    set(key: string, value: any): void;
    drift(dx: number, dy: number): void;
    setOptions(options: any): void;
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
}
export default BasicLine;
