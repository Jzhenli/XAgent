import { GPoint } from '../../../DrawingArea';
import { brushTypes, shapePropertyGroupDef } from '../../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { alignSystem } from '../../../common/Draggable';
import { default as PipeStraightBase } from '../PipeStraightBase';
import { BindedPoint } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';

export default class WaterPipeStraight extends PipeStraightBase {
    viewPosList: {
        name: string;
        size: number[];
        img: string;
        thumb: string;
        lnk: (number | null)[];
    }[];
    displayName: string;
    options: {
        className: string;
        center: {
            x: number;
            y: number;
        };
        length: number;
        width: number;
        height: number;
        viewPosIdx: number;
        rate: number;
        colorShader: string;
        keepAspectRatio: boolean;
        backgroundColor: string;
        flowState: {
            bindingList?: any[] | undefined;
            animationConfig?: {
                defaultState: string | undefined;
                continous: string[];
                discrete: string[];
            } | undefined;
        } | null;
        enableAnimationConfig: boolean;
        multiFrameAnimationConfig: undefined;
        multiStateConfig: {
            opacity: number;
            backgroundColor: string;
            focus: boolean;
        }[];
    };
    relatedChildrenProperties: string[];
    propertyMeta: shapePropertyGroupDef[];
    brushTypes: brushTypes[];
    pipeDrawMeta: {
        direction: [number, number];
        endDistortion: number;
        pipeOuterWidth: number;
        gradientOuter: [number, string][];
        pipeInnerWidth: number;
        gradientInner: [number, string][];
        getWidthHeight: (length: number, rate: number) => [number, number];
        toCenterRate: (center: GPoint, width: number, height: number) => {
            center: GPoint;
            rate: number;
        };
    }[];
    shaderChanged: boolean;
    lastPosIdx: number;
    lastGradientOut: CanvasGradient | null;
    lastGradientInner: CanvasGradient | null;
    drawPipe(context: CanvasRenderingContext2D, zoom?: number | undefined): any;
    draw(context: CanvasRenderingContext2D, zoom?: number | undefined): void;
    drawRender(context: CanvasRenderingContext2D, zoom?: number): void;
    currentStatusIdx: number;
    updateStyleByState(state: string): void;
    updateCurrentRenderImageList(state: string): void;
    preloadedImgs: string[];
    preloadLayerImgs(layerImgs: string[], shader?: string): void;
    animationImgList: string[];
    currentRenderImageList: any[];
    getPointAttrValueRegistrators(): [BindedPoint, any][];
    getGradient(ctx: CanvasRenderingContext2D, width: number, colorStops: [number, string][]): CanvasGradient;
    contains(x: number, y: number): boolean;
    set(key: string, value: any): void;
    autoAlignable: boolean;
    getAlignPoints(): {
        name: string;
        type: alignSystem;
        startPos: [number, number];
    }[];
    getAlignResult(type: alignSystem, iv: [number, number]): {
        isMatch: boolean;
        deltaVector?: [number, number] | undefined;
        rate?: number | undefined;
    };
    storedRate: number;
    storeRate(): void;
    zoomToTargetPointName: string | null;
    zoomToTargetRate(name: string, rate: number): void;
    restoreRate(): void;
    getShapeTopLeft(): {
        x: number;
        y: number;
    };
}
