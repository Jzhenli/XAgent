import { default as BaseDevice } from '../deviceShapes/BaseDevice';
import { propertyGroupRenderType, shapePropertyRenderType } from '../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as GCtrlPoint } from '../../mouseHandler/GCtrlPoint';
import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';
import { BindedPoint } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';

export default class CurtainVer extends BaseDevice {
    viewPosList: {
        name: string;
        size: number[];
        img: string[];
        thumb: string;
        lnk: (number | null)[];
    }[];
    constructor(opt: any);
    displayName: string;
    icon: string;
    cp1: GCtrlPoint;
    disableBaseAspectRatio: boolean;
    options: any;
    relatedChildrenProperties: string[];
    propertyMeta: ({
        group: string;
        type: propertyGroupRenderType;
        items: never[];
        opt: {
            disableRotation: boolean;
            enableColor?: undefined;
            enableBorderColor?: undefined;
            enableBackgroundColor?: undefined;
            disableOpacity?: undefined;
            animationCount?: undefined;
            isCurtain?: undefined;
            disableMoveAndRotate?: undefined;
            getInitStates?: undefined;
            onUpdateState0?: undefined;
        };
    } | {
        group: string;
        items: ({
            name: string;
            label: string;
            type: shapePropertyRenderType;
            opt: {};
        } | {
            name: string;
            label: string;
            type: shapePropertyRenderType;
            opt?: undefined;
        })[];
        type?: undefined;
        opt?: undefined;
    } | {
        group: string;
        type: propertyGroupRenderType;
        items: {
            name: string;
            label: string;
            type: shapePropertyRenderType;
            opt: {
                animationAvail: boolean;
                animationStates: {
                    name: string;
                    label: string;
                }[];
            };
        }[];
        opt?: undefined;
    } | {
        group: string;
        type: propertyGroupRenderType;
        items: never[];
        opt: {
            enableColor: boolean;
            enableBorderColor: boolean;
            enableBackgroundColor: boolean;
            disableOpacity: boolean;
            animationCount: number;
            isCurtain: boolean;
            disableMoveAndRotate: boolean;
            getInitStates: () => {
                backgroundColor: any;
            };
            onUpdateState0: () => void;
            disableRotation?: undefined;
        };
    })[];
    drawBase(ctx: CanvasRenderingContext2D, isRender: boolean): void;
    draw(ctx: CanvasRenderingContext2D, zoom: number): void;
    drawRender(ctx: CanvasRenderingContext2D, zoom?: number | undefined): void;
    getControlPoints(): GCtrlPoint[];
    updateControls(): void;
    updateShapeCtrls(): void;
    hasCustomBinding(): boolean;
    getShapeAnchorCenter(): {
        x: number;
        y: number;
    };
    getPointAttrValueRegistrators(): [BindedPoint, (value: string, type?: PointAttrValueType) => void][];
}
