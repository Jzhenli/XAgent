import { shapePropertyGroupDef } from '../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as BaseDevice } from '../deviceShapes/BaseDevice';
import { default as PathProxy } from '../../contains/PathProxy';
import { MultiFrameAnimationConfigItem } from '../BaseAnimation';
import { BindedPoint } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';
import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';

export default class PointLight extends BaseDevice {
    viewPosList: {
        name: string;
        size: number[];
        img: string[];
        thumb: string;
        lnk: (number | null)[];
    }[];
    displayName: string;
    constructor(opt: any);
    disableBaseAspectRatio: boolean;
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
        viewPosIdx: number;
        blur: number;
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
    postConstruct(): void;
    pathProxyDraw: PathProxy;
    updatePathProxyDraw(): void;
    draw(ctx: CanvasRenderingContext2D, zoom?: number): void;
    drawRender(ctx: CanvasRenderingContext2D, zoom?: number): void;
    lightEffectShaderNeedsUpdate: boolean;
    lightShaderCanvasSrc: OffscreenCanvas | null;
    lightShaderContextSrc: OffscreenCanvasRenderingContext2D | null;
    lightShaderCanvasDst: OffscreenCanvas | null;
    drawLightEffect(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, zoom: number): void;
    drawLightEffectRender(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, zoom: number): void;
    drawLightEffectCommon(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, middleFrame: MultiFrameAnimationConfigItem | undefined): void;
    updateLightEffectShaderDebounce: number;
    updateLightEffectShader(lightColor: string): void;
    updateControlPoints(): {
        points: {
            x: number;
            y: number;
        }[];
    }[];
    updateControls(): void;
    set(key: string, value: any): void;
    getPointAttrValueRegistrators(): [BindedPoint, (value: string, type?: PointAttrValueType) => void][];
}
