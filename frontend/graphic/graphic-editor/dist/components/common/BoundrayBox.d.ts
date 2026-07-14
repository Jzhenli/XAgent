import { EditorCursorType, GBound, GPoint } from '../DrawingArea';
import { default as GCtrlLine } from '../mouseHandler/GCtrlLine';
import { default as GCtrlPoint } from '../mouseHandler/GCtrlPoint';

import * as matrix from '../contains/matrix';
/**
 * 不能旋转的包围盒对象
 */
export default class BoundrayBox {
    pointsMeta: [string, number, number][];
    lineMeta: [string, [number, number], [number, number], [number, number]][];
    center: GPoint;
    width: number;
    height: number;
    rotation: number;
    aspectRatioLocked: boolean;
    lockAspectRatioStrategy: 'min' | 'max';
    updateCallback: ((center: GPoint, width: number, height: number, rotation?: number, trigger?: {
        type: 'point' | 'line' | 'rotate';
        name?: string;
    }) => void) | null;
    onStartMoveCallback: ((center: GPoint, width: number, height: number, rotation?: number, trigger?: {
        type: 'point' | 'line' | 'rotate';
        name?: string;
    }) => void) | null;
    onEndMoveCallback: ((center: GPoint, width: number, height: number, rotation?: number, trigger?: {
        type: 'point' | 'line' | 'rotate';
        name?: string;
    }) => void) | null;
    points: GCtrlPoint[];
    lines: GCtrlLine[];
    localMatrix: matrix.MatrixArray;
    localMatrixIvt: matrix.MatrixArray;
    pointDragDisabled: boolean;
    lineDragDisabled: boolean;
    constructor();
    updatePoint(p: GPoint, m: [string, number, number], shift?: boolean, triggerItem?: {
        type: 'point' | 'line' | 'rotate';
        name?: string;
    }): void;
    updateLine(p: GPoint, m: [string, [number, number], [number, number], [number, number]], shiftKey: boolean): void;
    calcPoint(xm: number, ym: number): {
        x: number;
        y: number;
    };
    updateLocalMatrix(): void;
    updateControls(): void;
    cursorDirs: EditorCursorType[];
    /**
     * 注册控制点、控制线拖拽后的回调函数
     */
    onControlsMove(callback: (center: GPoint, width: number, height: number, rotation?: number, trigger?: {
        type: 'point' | 'line' | 'rotate';
        name?: string;
    }) => void): void;
    /**
     * 开始拖拽
     */
    onControlsMoveStart(callback: (center: GPoint, width: number, height: number, rotation?: number, trigger?: {
        type: 'point' | 'line' | 'rotate';
        name?: string;
    }) => void): void;
    /**
     * 结束拖拽
     */
    onControlMoveEnd(callback: (center: GPoint, width: number, height: number, rotation?: number, trigger?: {
        type: 'point' | 'line' | 'rotate';
        name?: string;
    }) => void): void;
    setPosition(center: GPoint, width: number, height: number, rotation?: number): void;
    contains(x: number, y: number): boolean;
    withinBound(bound: GBound): boolean;
    getRectangle(angle: number): GBound;
}
