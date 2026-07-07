import { EditorCursorType, GPoint } from '../DrawingArea';
import { default as GCtrlRotation } from '../mouseHandler/GCtrlRotation';
import { default as BoundrayBox } from './BoundrayBox';

/**
 * 可旋转的包围盒
 */
export default class BoundrayBoxRotate extends BoundrayBox {
    rotation: number;
    rotationCtrl: GCtrlRotation;
    rotationDragDisabled: boolean;
    constructor();
    setPosition(center: GPoint, width: number, height: number, rotation?: number): void;
    updatePoint(p: GPoint, m: [string, number, number], shift?: boolean, triggerItem?: {
        type: 'point' | 'line' | 'rotate';
        name?: string;
    }): void;
    updateRotation(p: GPoint, shiftKeyDown?: boolean): void;
    calcWidthHeightByAngle(x: number, y: number): number[];
    calcPoint(xm: number, ym: number): {
        x: number;
        y: number;
    };
    updateLocalMatrix(): void;
    updateControls(): void;
    getCursorStyle(name: string): EditorCursorType;
}
