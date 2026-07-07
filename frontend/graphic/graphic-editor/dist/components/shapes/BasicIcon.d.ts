import { default as GMouseEvent } from '../mouseHandler/GMouseEvent';
import { brushTypes, shapePropertyGroupDef } from '../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as BasicImage } from './BasicImage';

declare class BasicIcon extends BasicImage {
    constructor(opt: any);
    options: any;
    icon: string;
    displayName: string;
    propertyMeta: shapePropertyGroupDef[];
    brushTypes: brushTypes[];
    postConstruct(): void;
    dblClickHandler(evt: GMouseEvent): void;
    drawImg(ctx: CanvasRenderingContext2D, src: any, w: number, h: number): void;
    draw(ctx: CanvasRenderingContext2D): void;
    drawRender(ctx: CanvasRenderingContext2D): void;
    setSrc(index: number, color: any): void;
    set(key: string, value: any): void;
}
export default BasicIcon;
