import { GPoint } from '../DrawingArea';
import { default as GItem } from '../shapes/GItem';
import { default as GCtrl } from './GCtrl';

declare class GMouseEvent {
    button: number | null;
    mouseButtons: boolean[];
    draggingElement: GCtrl | GItem | null;
    lastPoint: GPoint | null;
    currPoint: GPoint | null;
    lastCiPoint: GPoint | null;
    currCiPoint: GPoint | null;
    downPoint: GPoint | null;
    dx: number;
    dy: number;
    lastDAPoint: GPoint | null;
    currDAPoint: GPoint | null;
    downDAPoint: GPoint | null;
    DAdx: number;
    DAdy: number;
    deltaY: number | null;
    altKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    rawEvent: MouseEvent | undefined;
}
export default GMouseEvent;
export declare const enum GMouseEventType {
    mousemove = "mousemove",
    mouseover = "mouseover",
    mouseout = "mouseout",
    mousedown = "mousedown",
    mouseup = "mouseup",
    click = "click",
    dblclick = "dblclick",
    dragstart = "dragstart",
    drag = "drag",
    dragend = "dragend",
    mousewheel = "mousewheel",
    rightClick = "rightClick"
}
