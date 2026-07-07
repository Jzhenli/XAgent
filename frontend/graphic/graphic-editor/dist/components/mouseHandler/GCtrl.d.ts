import { default as Draggable } from '../common/Draggable';
import { EditorCursorType } from '../DrawingArea';
import { GMouseEventType } from './GMouseEvent';

declare abstract class GCtrl extends Draggable {
    constructor();
    cursor: string;
    mouseoverStyle: EditorCursorType;
    ctrlName: string | null;
    abstract draw(context: CanvasRenderingContext2D): void;
    abstract contains(x: number, y: number): boolean;
    abstract setPosition(position: any): void;
    eventPenerate(eventName: string | GMouseEventType, event: any): boolean;
}
export default GCtrl;
