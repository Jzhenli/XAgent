import { default as BaseDevice } from '../deviceShapes/BaseDevice';
import { propertyGroupRenderType, shapePropertyRenderType } from '../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as GCtrlPoint } from '../../mouseHandler/GCtrlPoint';
import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';
import { BindedPoint } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';

export default class SpaceDoor extends BaseDevice {
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
        };
    } | {
        group: string;
        items: {
            name: string;
            label: string;
            type: shapePropertyRenderType;
            opt: {
                gradient: boolean;
                enableOpacity: boolean;
            };
        }[];
        type?: undefined;
        opt?: undefined;
    } | {
        group: string;
        type: propertyGroupRenderType;
        items: ({
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
        } | {
            name: string;
            label: string;
            type: shapePropertyRenderType;
            opt?: undefined;
        })[];
        opt?: undefined;
    })[];
    draw(ctx: CanvasRenderingContext2D, zoom: number): void;
    drawRender(context: CanvasRenderingContext2D, zoom?: number | undefined): void;
    getControlPoints(): GCtrlPoint[];
    updateControls(): void;
    updateShapeCtrls(): void;
    hasCustomBinding(): boolean;
    getShapeAnchorCenter(): {
        x: number;
        y: number;
    };
    set(key: string, value: any): void;
    getPointAttrValueRegistrators(): [BindedPoint, (value: string, type?: PointAttrValueType) => void][];
    updateStyleByState(state: string): void;
}
