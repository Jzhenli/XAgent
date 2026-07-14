import { GPoint } from '../DrawingArea';
import { default as GCtrl } from './GCtrl';

declare class GCtrlRotation extends GCtrl {
    constructor(name: string, pos: GPoint, angle: number);
    pos: GPoint;
    angle: number;
    draw(context: CanvasRenderingContext2D): void;
    contains(x: number, y: number): boolean;
    setPosition(position: [GPoint, number]): void;
    drift(dx: number, dy: number): void;
}
export default GCtrlRotation;
