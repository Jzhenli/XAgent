import { GBound, GTransform } from '../DrawingArea';
import { default as GItem } from './GItem';
import { default as GCtrlLine } from '../mouseHandler/GCtrlLine';
import { default as GCtrlPoint } from '../mouseHandler/GCtrlPoint';
import { default as GCtrlRotation } from '../mouseHandler/GCtrlRotation';
import { default as BoundrayBox } from '../common/BoundrayBox';
import { shapePropertyGroupDef } from '../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as GMouseEvent } from '../mouseHandler/GMouseEvent';

import * as matrix from '../contains/matrix';
declare class GGroup extends GItem {
    constructor();
    boundrayBoxRotate: BoundrayBox;
    itemList: GItem[];
    displayName: string;
    icon: string;
    isGroup: boolean;
    isExpand: boolean;
    options: {
        className: string;
        groupName: string;
        uqId: number;
        center: {
            x: number;
            y: number;
        };
        height: number;
        width: number;
        keepAspectRatio: boolean;
        rotation: number;
    };
    propertyMeta: shapePropertyGroupDef[];
    baseCenter: {
        x: number;
        y: number;
    };
    baseWidth: number;
    baseHeight: number;
    baseRotation: number;
    transMatrix: matrix.MatrixArray;
    activate(): void;
    deactivate(): void;
    subitemTransform(): void;
    resetGroupOptions(): void;
    resetRotation(): void;
    resetCanRotate(): void;
    updateControls(): void;
    addItems(items: GItem[]): void;
    containsItem(item: GItem): boolean;
    draw(context: CanvasRenderingContext2D, zoom?: number): void;
    drawShader(context: CanvasRenderingContext2D, zoom?: number): void;
    private getDiffMatrix;
    contains(x: number, y: number): boolean;
    dblClickHandler(evt: GMouseEvent): void;
    withinBound(bound: GBound): boolean;
    getRectangle(angle: number): GBound;
    implementTransform(transform: GTransform): void;
    getOptions(): any;
    setOptions(data: {
        uqId: number;
        rotation: number;
        customDisplayName: string;
        items: any[];
    }, customImgCache?: string[]): void;
    drift(dx: number, dy: number): void;
    private mergeBounds;
    getControlPoints(): GCtrlPoint[];
    getControlLines(): GCtrlLine[];
    getControlRotations(): GCtrlRotation[];
    getChildrenBindingRelationship(): any[][];
    protected updateTransform(): void;
    protected getInnerCtrlPoints(x: 1 | 0 | -1, y: 1 | 0 | -1): {
        x: number;
        y: number;
    };
    set(key: string, value: any): void;
    dispose(): void;
}
export default GGroup;
