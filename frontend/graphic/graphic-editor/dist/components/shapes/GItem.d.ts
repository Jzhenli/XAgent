import { default as Bindable } from '../common/Bindable';
import { GBound, GPoint, GTransform } from '../DrawingArea';
import { default as GCtrlLine } from '../mouseHandler/GCtrlLine';
import { default as GCtrlPoint } from '../mouseHandler/GCtrlPoint';
import { default as GCtrlRotation } from '../mouseHandler/GCtrlRotation';
import { default as GMouseEvent } from '../mouseHandler/GMouseEvent';

declare abstract class GItem extends Bindable {
    constructor();
    postConstruct(): void;
    beforeSave(): void;
    isEnableActivation: boolean;
    enableActivation(): void;
    disableActivation(): void;
    /**
     * layer面板中显示名称
     */
    displayName: string;
    isLock: boolean;
    isView: boolean;
    icon: string;
    isGroup: boolean;
    canRotate: boolean;
    insideGroup: boolean;
    /**
     * @param context
     * @param zoom 画布的缩放比例，高清图片绘制时会产生锯齿，需要根据缩放比例对图片进行预处理
     */
    abstract draw(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, zoom?: number): void;
    drawShader(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, zoom?: number): void;
    drawShaderRender(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, zoom?: number): void;
    drawRender(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, zoom?: number): void;
    drawLightEffect(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, zoom: number): void;
    drawLightEffectRender(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, zoom: number): void;
    isRenderPointer(): boolean;
    abstract contains(x: number, y: number): boolean;
    abstract withinBound(bound: GBound): boolean;
    abstract getRectangle(angle: number): GBound;
    abstract implementTransform(transform: GTransform, scale: number, r: number): void;
    getControlPoints(): GCtrlPoint[];
    getControlLines(): GCtrlLine[];
    getControlRotations(): GCtrlRotation[];
    updateControls(): void;
    implementPointTransform(p: GPoint, m: GTransform): {
        x: number;
        y: number;
    };
    applyContextTransform(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, m: number[]): void;
    createMatrixByRotateAndTranslate(translate: {
        x: number;
        y: number;
    }, rotate: number): number[];
    invertPointFromEvent(evt: GMouseEvent, m: number[]): number[];
    updateBindingPointName(): void;
    avoidMergePropOnInit(): boolean;
    dblClickHandler(evt: GMouseEvent): void;
    getShapeAnchorCenter(): {
        x: number;
        y: number;
    };
    dragStartHandler(e: GMouseEvent): void;
    draggingHandler(e: GMouseEvent): void;
    dragEndHandler(e: GMouseEvent): void;
    disposeCallback: (() => void)[];
    dispose(): void;
}
export default GItem;
