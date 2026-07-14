import { GPoint } from '../DrawingArea';
import { default as GCtrl } from './GCtrl';

declare class GCtrlLine extends GCtrl {
    constructor(name: string, start: GPoint, end: GPoint);
    start: GPoint;
    end: GPoint;
    lineWidth: number;
    lineColor: string;
    draw(context: CanvasRenderingContext2D): void;
    contains(x: number, y: number): boolean;
    setPosition(position: [GPoint, GPoint]): void;
    drift(dx: number, dy: number): void;
}
export default GCtrlLine;
