import { default as Eventful } from './common/Eventful';
import { default as GItem } from './shapes/GItem';

declare class DrawingTools extends Eventful {
    constructor();
    drawText(type?: string): void;
    drawLine(): void;
    drawRectangle(type?: string): void;
    drawPen(): void;
    drawImage(): void;
    drawIcon(iconNames: string[]): void;
    drawCancelCallback: (() => void)[];
    drawCancel(): void;
    drawArrow(detail: string): void;
    setSelector(): void;
    setGrap(): void;
    mergeProps(item: GItem): void;
}
declare const _default: DrawingTools;
export default _default;
export declare const enum EditorDrawType {
    Line = 0,
    Pen = 1,
    Text = 2,
    Rectangle = 3,
    Arrow = 4,
    Image = 5,
    Icon = 6
}
