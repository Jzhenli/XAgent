import { GBound, GPoint, GTransform } from '../DrawingArea';
import { default as GItem } from './GItem';
import { default as GCtrlPoint } from '../mouseHandler/GCtrlPoint';
import { shapePropertyGroupDef } from '../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { popupBindingValue } from '../common/Bindable';

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
        bindingMultiplePopup: any;
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
    getMulPopupBinding(): any | null;
    hasCustomBinding(): boolean;
}
export default BasicLine;
