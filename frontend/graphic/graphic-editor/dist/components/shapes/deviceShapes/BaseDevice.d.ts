import { GPoint, GTransform } from '../../DrawingArea';
import { default as BasicRectangle } from '../BasicRectangle';
import { brushTypes, shapePropertyGroupDef } from '../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { animationConfig, popupBindingValue, mulPopupBindingValue } from '../../common/Bindable';
import { alignSystem } from '../../common/Draggable';
import { default as BoundrayBox } from '../../common/BoundrayBox';
import { BindedPoint } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';

import * as matrix from '../../contains/matrix';
export type BaseDeviceProps = {
    viewPosIdx: 0;
    center: GPoint;
    rate: number;
};
declare class BaseDevice extends BasicRectangle {
    viewPosList: {
        name: string;
        size: number[];
        img: string[];
        thumb: string;
        lnk: (number | null)[];
    }[];
    constructor(opt?: BaseDeviceProps);
    displayName: string;
    isLock: boolean;
    isView: boolean;
    icon: string;
    canRotate: boolean;
    options: any;
    animLayerImage: string[];
    brushTypes: brushTypes[];
    propertyMetaBase: shapePropertyGroupDef[];
    propertyMeta: shapePropertyGroupDef[];
    propertyMetaExtra: shapePropertyGroupDef[];
    postConstruct(): void;
    boundrayBoxRotate: BoundrayBox;
    shaderImgs: string[];
    draw(context: CanvasRenderingContext2D, zoom: number): void;
    drawShader(context: CanvasRenderingContext2D, zoom?: number): void;
    drawRender(context: CanvasRenderingContext2D, zoom?: number | undefined): void;
    currentRenderImageList: [number, string[]][];
    protected getCurrentRenderImage(time: number): (HTMLImageElement | HTMLCanvasElement | undefined)[];
    preloadedImgs: string[];
    preloadLayerImgs(layerImgs: string[], shader: string): void;
    shaderLayerIdxes: number[];
    getCurrentImage(): (HTMLImageElement | HTMLCanvasElement | undefined)[];
    getImg(url: string, shader?: string): HTMLImageElement | HTMLCanvasElement | undefined;
    getBaseSize(): number[];
    getDefaultImg(): string;
    getControlRotations(): never[];
    relatedChildrenProperties: string[];
    disableBaseAspectRatio: boolean;
    set(key: string, value: any): void;
    getShapeTopLeft(): {
        x: number;
        y: number;
    };
    implementTransform(transform: GTransform, scale: number, r: number): void;
    isRenderPointer(): boolean;
    getNavigationLink(): any;
    getPopupBinding(): popupBindingValue | null;
    getMulPopupBinding(): mulPopupBindingValue | null;
    hasCustomBinding(): boolean;
    animationRenderMeta: {
        propName: string;
        imgLayers: {
            order: number;
            stateMap: any;
        }[];
    }[][];
    animationRenderMetaBase: [number, string[]][][];
    getPointAttrValueRegistrators(): [BindedPoint, any][];
    createValueChangeCallback(propName: string, aniConf: animationConfig, imageLayer: {
        order: number;
        stateMap: any;
    }[]): any;
    autoAlignMeta: {
        name: string;
        type: alignSystem;
        position: number[];
    }[][];
    getSimpleMatrix(): matrix.MatrixArray;
    getAlignPoints(): {
        name: string;
        type: alignSystem;
        startPos: [number, number];
    }[];
    getAlignResult(type: alignSystem, iv: [number, number]): {
        isMatch: boolean;
        deltaVector?: [number, number];
        rate?: number;
    };
    isTypeMatch(type1: alignSystem, type2: alignSystem): boolean;
    storedRate: number;
    storeRate(): void;
    zoomToTargetPointName: string | null;
    zoomToTargetRate(name: string, rate: number): void;
    restoreRate(): void;
}
export default BaseDevice;
