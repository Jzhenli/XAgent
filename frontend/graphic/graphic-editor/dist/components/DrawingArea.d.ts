import { default as Eventful } from './common/Eventful';
import { default as GMouseEvent } from './mouseHandler/GMouseEvent';
import { default as BasicPath } from './shapes/BasicPath';
import { default as GItem } from './shapes/GItem';

export declare const enum EditorCursorType {
    default = "default",
    grab = "grab",
    crosshair = "crosshair",
    move = "move",
    pointer = "pointer",
    eResize = "e-resize",
    seResize = "se-resize",
    sResize = "s-resize",
    swResize = "sw-Resize",
    wResize = "w-resize",
    nwResize = "nw-Resize",
    nResize = "n-resize",
    neResize = "ne-Resize",
    /**
     * const str=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="48" height="48"><defs><style>.cls-1,.cls-2,.cls-3{fill:none;}.cls-1{stroke:#666;}.cls-1,.cls-2{stroke-linecap:round;stroke-linejoin:round;stroke-width:8px;}.cls-2{stroke:#39f;}</style></defs><g id="s_d"><path class="cls-1" d="M78.66,60.66,101.28,38a8,8,0,0,0,0-11.31h0a8,8,0,0,0-11.31,0L67.34,49.34,50.37,38l-8.48,8.48,39.6,39.6L90,77.63Z"/></g><g id="s_c"><polyline class="cls-2" points="31.99 56.41 24.92 63.48 33.4 71.97"/><polyline class="cls-2" points="71.59 96.01 64.52 103.08 44.72 83.28"/></g><g id="border"><rect class="cls-3" width="128" height="128"/></g></svg>`;
     * const imgStr = window.btoa(unescape(encodeURIComponent(str)));
     * const cursor = 'url(data:image/svg+xml;base64,' + imgStr + ') 24 24,auto';
     */
    brush = "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4IiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiPjxkZWZzPjxzdHlsZT4uY2xzLTEsLmNscy0yLC5jbHMtM3tmaWxsOm5vbmU7fS5jbHMtMXtzdHJva2U6IzY2Njt9LmNscy0xLC5jbHMtMntzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjhweDt9LmNscy0ye3N0cm9rZTojMzlmO308L3N0eWxlPjwvZGVmcz48ZyBpZD0ic19kIj48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik03OC42Niw2MC42NiwxMDEuMjgsMzhhOCw4LDAsMCwwLDAtMTEuMzFoMGE4LDgsMCwwLDAtMTEuMzEsMEw2Ny4zNCw0OS4zNCw1MC4zNywzOGwtOC40OCw4LjQ4LDM5LjYsMzkuNkw5MCw3Ny42M1oiLz48L2c+PGcgaWQ9InNfYyI+PHBvbHlsaW5lIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIzMS45OSA1Ni40MSAyNC45MiA2My40OCAzMy40IDcxLjk3Ii8+PHBvbHlsaW5lIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSI3MS41OSA5Ni4wMSA2NC41MiAxMDMuMDggNDQuNzIgODMuMjgiLz48L2c+PGcgaWQ9ImJvcmRlciI+PHJlY3QgY2xhc3M9ImNscy0zIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIvPjwvZz48L3N2Zz4=) 24 24,auto"
}
export type GPoint = {
    x: number;
    y: number;
};
export type GBound = {
    t: number;
    b: number;
    l: number;
    r: number;
};
export type GTransform = [number, number, number, number, number, number];
export declare class DrawingArea extends Eventful {
    canvasHeight: number | null;
    canvasWidth: number | null;
    context: CanvasRenderingContext2D | undefined;
    width: number;
    height: number;
    backgroundColor: string;
    deviceInitRate: number;
    zoom: number;
    x: number;
    y: number;
    selectingRectangle: GBound;
    isBoundSelecting: boolean;
    renderAlign: {
        alignX: string;
        alignY: string;
    };
    lightEffect: {
        enabled: boolean;
        darken: number;
        compositeType: string;
    };
    lightEffectMiddleCanvas: OffscreenCanvas | null;
    lightEffectMiddleCanvas2: OffscreenCanvas | null;
    lightEffectMiddleContext: OffscreenCanvasRenderingContext2D | null;
    lightEffectMiddleContext2: OffscreenCanvasRenderingContext2D | null;
    constructor();
    render(): void;
    drawLightEffect(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
    clearCtx(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
    drawItemsShader(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
    debugPoints: number[][];
    drawDebugPoints(ctx: CanvasRenderingContext2D): void;
    debug(points: number[][]): void;
    drawBackground(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
    drawDrawingArea(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
    drawItems(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
    drawCtrls(ctx: CanvasRenderingContext2D): void;
    drawSelectBound(ctx: CanvasRenderingContext2D): void;
    nextZoom(isleft: boolean): number;
    zoomIn(position?: GPoint): void;
    zoomOut(position?: GPoint): void;
    zoomFit(): void;
    setZoom(val: number, position?: GPoint): void;
    /**
     * 如果图形的宽(高)小于画布的宽(高)，两侧留宽(高)相等
     * 如果图形的宽(高)大于画布的宽(高)，两侧不留宽(高)
     */
    centerExtraPosition(): void;
    /**
     * 实际坐标 --> canvas坐标
     */
    translatePoint(point: GPoint): GPoint;
    /**
     * canvas坐标 --> 实际坐标
     */
    inverseTranslate(point: GPoint): GPoint;
    cursorStyleDefault: EditorCursorType;
    cursorStyleItem: EditorCursorType | false;
    cursorStyleCtrl: EditorCursorType | false;
    isDraggingObject: boolean;
    /**
     * 切换鼠标样式：defaut默认样式，object:
     * @param cursor
     */
    setCursorStyle(cursor: {
        default?: EditorCursorType;
        item?: EditorCursorType | false;
        ctrl?: EditorCursorType | false;
    }): void;
    setDraggingObject(isDraggingObject: boolean): void;
    updateCursorStyle(): void;
    /**
     * 进入绘制模式后返回true（点击绘制、拖拽绘制、钢笔绘制）
     *  点击绘制，单击 -> 结束
     *  拖拽绘制，按下鼠标 -> 拖拽鼠标 -> 释放鼠标按键 -> 结束
     *  钢笔绘制, (按下鼠标 [-> 拖拽鼠标] -> 释放鼠标按键){n} -> 鼠标右键 -> 结束
     */
    isCreatingState(): boolean;
    cancelDrawing(): void;
    createClick: ((event: GMouseEvent) => GItem | GItem[]) | null;
    isClickCreate: boolean;
    drawByClick(createClick: (event: GMouseEvent) => GItem | GItem[]): void;
    createDragStart: ((event: GMouseEvent) => GItem) | null;
    createDrag: ((event: GMouseEvent) => void) | null;
    isDragCreate: boolean;
    creatingObject: GItem | null;
    /**
     * 拖拽绘图, 开始拖动时使用createDragStart创建对象
     * 拖动过程中，使用createDrag调整对象形状
     * 结束后将该对象加入当前layer
     * 取消事件触发时清空绘图状态
     */
    drawByDrag(createDragStart: (event: GMouseEvent) => GItem, createDrag: (event: GMouseEvent) => void): void;
    isPenCreate: boolean;
    isOnPenStartPoint: boolean;
    penCreatingObject: BasicPath | null;
    createPenFirstDown: ((event: GMouseEvent) => BasicPath) | null;
    createPenDown: ((event: GMouseEvent) => void) | null;
    createPenDragStart: ((event: GMouseEvent) => void) | null;
    createPenDrag: ((event: GMouseEvent) => void) | null;
    createPenUp: ((event: GMouseEvent) => void) | null;
    createPenMove: ((event: GMouseEvent) => void) | null;
    createPenEnd: ((event: GMouseEvent) => void) | null;
    creatPenAuxiliaryLine: ((isShow: boolean) => void) | null;
    drawByPen(firstDown: (event: GMouseEvent) => BasicPath, penDown: (event: GMouseEvent) => void, penDragStart: (event: GMouseEvent) => void, penDrag: (event: GMouseEvent) => void, penMouseUp: (event: GMouseEvent) => void, penMove: (event: GMouseEvent) => void, penEnd: (event: GMouseEvent) => void, penAuxiliaryLine: (isShow: boolean) => void): void;
    currShapeClass: any | null;
    setDraggingShape(shapeClass: any): void;
    createPreviewImg(): string;
}
declare const drawingArea: DrawingArea;
export default drawingArea;
