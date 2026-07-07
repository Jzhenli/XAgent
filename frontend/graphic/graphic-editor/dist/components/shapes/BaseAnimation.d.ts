import { default as GMouseEvent } from '../mouseHandler/GMouseEvent';
import { default as GItem } from './GItem';
import { GPoint } from '../DrawingArea';

export type MultiFrameAnimationConfig = {
    series: MultiFrameAnimationConfigItem[];
    type: "once" | "loop";
    focus: boolean;
}[];
export type MultiFrameAnimationConfigItem = {
    duration: number;
    offsetPosition: {
        x: number;
        y: number;
    };
    offsetRotation: number;
    opacity: number;
    color?: string;
    borderColor?: string;
    backgroundColor?: string;
    lightColor?: string;
    enableLightEffect?: boolean;
    openRate?: number;
    img?: {
        name: string;
        src: string;
        srcCustomCacheIdx?: number;
        isGifParsed?: boolean;
        passedTime?: number;
    };
    focus: boolean;
};
export type MultiStateConfig = MultiStateConfigItem[];
export type MultiStateConfigItem = {
    opacity: number;
    color?: string;
    borderColor?: string;
    backgroundColor?: string;
    enableLightEffect?: boolean;
    lightColor?: string;
    openRate?: number;
    focus: boolean;
};
/**
 * 专用属性 enableAnimationConfig = false，使用下方1配置；true，使用下方2配置
 *
 * 1. 专用属性 multiStateConfig 用来设置自定义状态
 * 2. 专用属性 multiFrameAnimationConfig 用来设置动画效果
 */
export default abstract class BaseAnimation extends GItem {
    constructor();
    editorAnimationCtrl: {
        start: boolean;
        frameStartTmsp: number;
        currentMiddleFrame: MultiFrameAnimationConfigItem | undefined;
        seriesGroupIdx: number;
        keyFrameIdx: number;
        focusedFrame: MultiFrameAnimationConfigItem | undefined;
        focusedFrameDragging: boolean;
        focusedFrameStartPosition: number[];
        focusedFrameDownPosition: number[];
    };
    /**
     *  根据配置和当前编辑器中选中的对象计算当前显示的动态帧
     *  在draw函数中调用
     */
    calculateEditorAnimationTransform(): MultiFrameAnimationConfigItem | undefined;
    renderAnimationCtrl: {
        series: MultiFrameAnimationConfigItem[] | undefined;
        type: "once" | "loop";
        frameStartTmsp: number;
        state: MultiStateConfigItem | undefined;
    };
    switchState(idx: number): void;
    getCurrentRenderingFrame(): MultiFrameAnimationConfigItem | undefined;
    processDrawContext(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, optProxy: any, frame?: MultiFrameAnimationConfigItem): void;
    buildFrame(series: MultiFrameAnimationConfigItem[], passedTime: number, type: 'loop' | 'once'): MultiFrameAnimationConfigItem | undefined;
    /**
     * 通过两帧之间的相对时间，线性插值得到中间帧
     * @returns
     */
    interpolation(prevFrame: MultiFrameAnimationConfigItem, prevAccDuration: number, nextFrame: MultiFrameAnimationConfigItem, nextAccDuration: number, time: number): MultiFrameAnimationConfigItem;
    dragStartHandler(e: GMouseEvent): void;
    draggingHandler(e: GMouseEvent): void;
    dragEndHandler(e: GMouseEvent): void;
    /**
     * @returns false: 没有触发动画设置代理, 需要执行正常逻辑；true: 已经触发了动画设置
     */
    handleBoundaryBoxProxy(center: GPoint, width: number, height: number, rotate?: number, trigger?: {
        type: "point" | "line" | "rotate";
        name?: string;
    }): boolean;
    set(key: string, value: any): void;
}
