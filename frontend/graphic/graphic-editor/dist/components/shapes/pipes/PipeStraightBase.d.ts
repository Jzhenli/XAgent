import { default as BoundrayBox } from '../../common/BoundrayBox';
import { default as GCtrlPoint } from '../../mouseHandler/GCtrlPoint';
import { GBound, GPoint, GTransform } from '../../DrawingArea';
import { default as GCtrlLine } from '../../mouseHandler/GCtrlLine';
import { default as BaseAnimation } from '../BaseAnimation';

import * as matrix from '../../contains/matrix';
export default abstract class PipeStraightBase extends BaseAnimation {
    initOpt: any;
    viewPosList: {
        name: string;
        size: number[];
        img: string;
        thumb: string;
        lnk: (number | null)[];
    }[];
    icon: string;
    canRotate: boolean;
    boundrayBox: BoundrayBox;
    ctrlStart: GCtrlPoint;
    ctrlEnd: GCtrlPoint;
    pipeDrawMeta: any[];
    constructor(opt?: any);
    postConstruct(): void;
    getDefaultImg(): string;
    updateControls(): void;
    lengthChangeDrag(type: string, p: GPoint): void;
    transMatrix: matrix.MatrixArray;
    updateTransform(): void;
    getWidthAndHeight(): any;
    withinBound(bound: GBound): boolean;
    getRectangle(angle: number): GBound;
    implementTransform(transform: GTransform, scale: number, r: number): void;
    setOptions(options: any): void;
    set(key: string, value: any): void;
    getControlPoints(): GCtrlPoint[];
    getControlLines(): GCtrlLine[];
    drift(dx: number, dy: number): void;
    getImage(url: string, shader?: string): HTMLImageElement | HTMLCanvasElement | undefined;
}
