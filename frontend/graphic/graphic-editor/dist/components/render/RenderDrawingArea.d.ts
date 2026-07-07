import { default as Eventful } from '../common/Eventful';
import { EditorCursorType, GPoint } from '../DrawingArea';
import { default as GraphicRenderManager } from './GraphicRenderManager';

declare class RenderDrawingArea extends Eventful {
    disposed: boolean;
    graphicRenderManager: GraphicRenderManager | null;
    canvasHeight: number | null;
    canvasWidth: number | null;
    context: CanvasRenderingContext2D | undefined;
    width: number;
    height: number;
    backgroundColor: string;
    zoom: number;
    x: number;
    y: number;
    renderAlign: {
        alignX: string;
        alignY: string;
    };
    transform: {
        transformX: number;
        transformY: number;
    };
    lightEffect: any;
    lightEffectMiddleCanvas: OffscreenCanvas | null;
    lightEffectMiddleCanvas2: OffscreenCanvas | null;
    lightEffectMiddleContext: OffscreenCanvasRenderingContext2D | null;
    lightEffectMiddleContext2: OffscreenCanvasRenderingContext2D | null;
    constructor();
    render(): void;
    drawDrawingArea(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
    private nextZoom;
    zoomIn(position?: GPoint): void;
    zoomOut(position?: GPoint): void;
    zoomFit(): void;
    zoomFull(): void;
    drawItems(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
    drawItemsShader(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
    drawLightEffect(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
    /**
     * 实际坐标 --> canvas坐标
     */
    translatePoint(point: GPoint): GPoint;
    /**
     * canvas坐标 --> 实际坐标
     */
    inverseTranslate(point: GPoint): GPoint;
    toFixed(num: number): number;
    /**
     * 如果图形的宽(高)小于画布的宽(高)，两侧留宽(高)相等
     * 如果图形的宽(高)大于画布的宽(高)，两侧不留宽(高)
     */
    private centerExtraPosition;
    private centerzoomFit;
    setCursorStyle(style: EditorCursorType): void;
}
export default RenderDrawingArea;
