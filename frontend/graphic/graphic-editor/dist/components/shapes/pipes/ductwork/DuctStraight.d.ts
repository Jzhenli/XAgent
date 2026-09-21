import { GPoint } from '../../../DrawingArea';
import { brushTypes, shapePropertyGroupDef } from '../../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as PipeStraightBase } from '../PipeStraightBase';
import { alignSystem } from '../../../common/Draggable';

export default class DuctStraight extends PipeStraightBase {
    viewPosList: {
        name: string;
        size: never[];
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
        viewPosIdx: number;
        rate: number;
        width: number;
        height: number;
        keepAspectRatio: boolean;
        colorShader: string;
        popupConfig: {
            enablePopup: boolean;
            popupTitle: string;
            popupWidth: number;
            popupHeight: number;
            popupPointBindings: {
                id: string;
                displayName: string;
                pointInfo: {
                    deviceId: string;
                    deviceName: string;
                    pointId: string;
                    pointName: string;
                    unit: string;
                    description: string;
                };
                triggerConfig?: {
                    mode: "switch";
                    onLabel: string;
                    offLabel: string;
                } | {
                    mode: "number";
                    label: string;
                } | undefined;
            }[];
        };
    };
    brushTypes: brushTypes[];
    pipeDrawMeta: {
        direction: number[];
        imgs: string[];
        endWidth: number;
        endWidthDraw: number;
        ductWidth: number;
        alignDistStart: number[];
        alignDistEnd: number[];
        getWidthHeight: (length: number, rate: number) => number[];
        toCenterRate: (center: GPoint, width: number, height: number) => {
            center: GPoint;
            rate: number;
        };
    }[];
    propertyMeta: shapePropertyGroupDef[];
    updateControls(): void;
    lengthChangeDrag(type: string, p: GPoint): void;
    draw(context: CanvasRenderingContext2D, zoom?: number | undefined): void;
    contains(x: number, y: number): boolean;
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
}
