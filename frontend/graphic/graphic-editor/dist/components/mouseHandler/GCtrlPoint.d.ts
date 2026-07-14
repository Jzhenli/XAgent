import { default as GCtrl } from './GCtrl';
import { GPoint } from '../DrawingArea';

declare class GCtrlPoint extends GCtrl {
    constructor(name: string, x: number, y: number);
    x: number;
    y: number;
    ringColor: string | null;
    show: boolean;
    draw(context: CanvasRenderingContext2D): void;
    contains(x: number, y: number): boolean;
    setPosition(position: GPoint): void;
    drift(dx: number, dy: number): void;
}
export default GCtrlPoint;
