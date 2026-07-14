import { GBound, GTransform } from '../DrawingArea';
import { default as GCtrlLine } from '../mouseHandler/GCtrlLine';
import { default as GCtrlPoint } from '../mouseHandler/GCtrlPoint';
import { default as GCtrlRotation } from '../mouseHandler/GCtrlRotation';
import { brushTypes, shapePropertyGroupDef } from '../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as BoundrayBox } from '../common/BoundrayBox';
import { default as BasicShapeAnimation } from './leftCtrlShapes/BasicShapeAnimation';

import * as matrix from '../contains/matrix';
declare class BasicRectangle extends BasicShapeAnimation {
    initOpt: any;
    constructor(opt?: any);
    /**
     */
    postConstruct(): void;
    displayName: string;
    icon: string;
    boundrayBoxRotate: BoundrayBox;
    options: {
        className: string;
        center: {
            x: number;
            y: number;
        };
        rotation: number;
        width: number;
        height: number;
        keepAspectRatio: boolean;
        borderRadius: number;
        enableBackground: boolean;
        backgroundColor: string;
        showBorder: boolean;
        borderColor: string;
        borderWidth: number;
        enableShadow: boolean;
        shadowColor: string;
        shadowBlur: number;
        shadowOffset: {
            x: number;
            y: number;
        };
        enableInnerShadow: boolean;
        innerShadowColor: string;
        innerShadowBlur: number;
        pathData: {
            b?: [number, number] | undefined;
            p: [number, number];
            a?: [number, number] | undefined;
        }[];
        bindingValue: {
            bindingList?: any[] | undefined;
            animationConfig?: {
                defaultState: string | undefined;
                continous: string[];
                discrete: string[];
            } | undefined;
        } | null;
        bindingPopup: {
            id: string;
            name: string;
            graphicId: string;
            graphicName: string;
        } | null;
        bindingMultiplePopup: any;
        isShow2: boolean;
        isShow3: boolean;
        isShow4: boolean;
        isShow5: boolean;
        borderColor2: string;
        borderColor3: string;
        borderColor4: string;
        borderColor5: string;
        backgroundColor2: string;
        backgroundColor3: string;
        backgroundColor4: string;
        backgroundColor5: string;
        enableAnimationConfig: boolean;
        multiFrameAnimationConfig: undefined;
        multiStateConfig: undefined;
    };
    brushTypes: brushTypes[];
    propertyMeta: shapePropertyGroupDef[];
    transMatrix: matrix.MatrixArray;
    draw(context: CanvasRenderingContext2D, zoom: number): void;
    drawRender(context: CanvasRenderingContext2D, zoom?: number | undefined): void;
    contains(x: number, y: number): boolean;
    withinBound(bound: GBound): boolean;
    getRectangle(angle: number): GBound;
    implementTransform(transform: GTransform, scale: number, r: number): void;
    getControlPoints(): GCtrlPoint[];
    getControlLines(): GCtrlLine[];
    getControlRotations(): GCtrlRotation[];
    updateTransform(): void;
    updateControls(): void;
    set(key: string, value: any): void;
    drift(dx: number, dy: number): void;
    setOptions(options: any): void;
    getShapeTopLeft(): {
        x: number;
        y: number;
    };
}
export default BasicRectangle;
