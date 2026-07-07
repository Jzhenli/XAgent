import { default as GCtrlPoint } from '../../mouseHandler/GCtrlPoint';
import { default as BaseDevice } from '../deviceShapes/BaseDevice';
import { shapePropertyGroupDef } from '../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as PathProxy } from '../../contains/PathProxy';
import { MultiFrameAnimationConfigItem } from '../BaseAnimation';
import { BindedPoint } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';
import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';

export default class RoundedRectangleLight extends BaseDevice {
    constructor(opt: any);
    viewPosList: {
        name: string;
        size: number[];
        img: string[];
        thumb: string;
        lnk: (number | null)[];
    }[];
    options: {
        className: string;
        center: {
            x: number;
            y: number;
        };
        lightColor: string;
        type: string;
        rotation: number;
        width: number;
        height: number;
        keepAspectRatio: boolean;
        rate: number;
        cp1Pos: number;
        cp2Pos: number;
        radiusRate: number;
        enableLightEffect: boolean;
        lightEffectRadius: number;
        bindingValue: {
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
            enableLightEffect: boolean;
            lightColor: string;
            focus: boolean;
        }[];
    };
    propertyMeta: shapePropertyGroupDef[];
    displayName: string;
    cp1: GCtrlPoint;
    cp2: GCtrlPoint;
    icon: string;
    disableBaseAspectRatio: boolean;
    pathProxyDraw: PathProxy;
    getControlPoints(): GCtrlPoint[];
    updateControls(): void;
    updatePathProxyDraw(): void;
    updateShapeCtrls(): void;
    draw(ctx: CanvasRenderingContext2D, zoom?: number): void;
    drawRender(ctx: CanvasRenderingContext2D, zoom?: number | undefined): void;
    lightEffectShaderNeedsUpdate: boolean;
    lightShaderCanvasSrc: OffscreenCanvas | null;
    lightShaderContextSrc: OffscreenCanvasRenderingContext2D | null;
    lightShaderCanvasDst: OffscreenCanvas | null;
    drawLightEffectCommon(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, middleFrame: MultiFrameAnimationConfigItem | undefined): void;
    drawLightEffect(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, zoom: number): void;
    drawLightEffectRender(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, zoom: number): void;
    updateLightEffectShaderDebounce: number;
    updateLightEffectShader(lightColor: string): void;
    set(key: string, value: any): void;
    getPointAttrValueRegistrators(): [BindedPoint, (value: string, type?: PointAttrValueType) => void][];
}
