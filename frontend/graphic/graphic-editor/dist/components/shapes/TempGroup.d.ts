import { GBound, GTransform } from '../DrawingArea';
import { default as GCtrlLine } from '../mouseHandler/GCtrlLine';
import { default as GCtrlPoint } from '../mouseHandler/GCtrlPoint';
import { default as GCtrlRotation } from '../mouseHandler/GCtrlRotation';
import { shapePropertyGroupDef } from '../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as GItem } from './GItem';

declare class TempGroup extends GItem {
    itemList: GItem[];
    constructor();
    activate(): void;
    addItems(items: GItem[]): void;
    containsItem(item: GItem): boolean;
    removeItem(item: GItem): void;
    options: any;
    propertyMeta: shapePropertyGroupDef[];
    propertyMetaBase: shapePropertyGroupDef[];
    getPropertyMeta(): shapePropertyGroupDef[];
    dispose(): void;
    draw(context: CanvasRenderingContext2D, zoom?: number): void;
    contains(x: number, y: number): boolean;
    getControlPoints(): GCtrlPoint[];
    getControlLines(): GCtrlLine[];
    getControlRotations(): GCtrlRotation[];
    withinBound(bound: GBound): boolean;
    getRectangle(angle: number): GBound;
    implementTransform(transform: GTransform): void;
    setOptions(options: any): void;
    drift(dx: number, dy: number): void;
    alignItems(type: string): void;
    spaceBetweenEffect(type: string): void;
    set(key: string, value: any): void;
    calcCommonProperty(data: any): void;
    setCommonOptions(style: any): void;
}
export default TempGroup;
