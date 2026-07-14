import { EditorCursorType, GPoint } from '../DrawingArea';
import { default as GCtrlLine } from './GCtrlLine';

declare class GCtrlCurve extends GCtrlLine {
    constructor(name: string, start: GPoint, end: GPoint, cp1?: GPoint, cp2?: GPoint);
    mouseoverStyle: EditorCursorType;
    start: GPoint;
    end: GPoint;
    cp1: GPoint | null;
    cp2: GPoint | null;
    lineWidth: number;
    lineColor: string;
    isLineDash: boolean;
    draw(context: CanvasRenderingContext2D): void;
    contains(x: number, y: number): boolean;
    setPosition(position: any): void;
    drift(dx: number, dy: number): void;
}
export default GCtrlCurve;
