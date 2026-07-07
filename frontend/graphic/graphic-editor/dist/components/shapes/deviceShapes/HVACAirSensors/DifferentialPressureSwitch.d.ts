import { alignSystem } from '../../../common/Draggable';
import { BaseDeviceProps } from '../BaseDevice';
import { default as BaseMultAirSensor } from './BaseMultAirSensor';
import { propertyGroupRenderType, shapePropertyRenderType } from '../../../rightPanelTools/PropertyTools/PropertyMetaTypes';

export default class DifferentialPressureSwitch extends BaseMultAirSensor {
    viewPosList: {
        name: string;
        size: number[];
        img: string[];
        thumb: string;
        lnk: null[];
    }[];
    shaderLayerIdxes: number[];
    animLayerImage: string[];
    shaderImgs: string[];
    brushTypes: never[];
    constructor(opt?: BaseDeviceProps);
    propertyMeta: ({
        group: string;
        type: propertyGroupRenderType;
        items: {
            name: string;
            label: string;
            type: shapePropertyRenderType;
            opt: () => {
                name: string;
                size: number[];
                img: string[];
                thumb: string;
                lnk: null[];
            }[];
        }[];
        opt?: undefined;
    } | {
        group: string;
        type: propertyGroupRenderType;
        items: never[];
        opt: {
            enableShapeRate: boolean;
            disableRotation: boolean;
            disableLockRatio: boolean;
            enableColor?: undefined;
            enableBorderColor?: undefined;
            enableBackgroundColor?: undefined;
            animationCount?: undefined;
            animationStateList?: undefined;
            disableMoveAndRotate?: undefined;
            getInitStates?: undefined;
            onUpdateState0?: undefined;
        };
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
    } | {
        group: string;
        type: propertyGroupRenderType;
        items: never[];
        opt: {
            enableColor: boolean;
            enableBorderColor: boolean;
            enableBackgroundColor: boolean;
            animationCount: number;
            animationStateList: string[];
            disableMoveAndRotate: boolean;
            getInitStates: () => {
                backgroundColor: any;
            };
            onUpdateState0: () => void;
            enableShapeRate?: undefined;
            disableRotation?: undefined;
            disableLockRatio?: undefined;
        };
    })[];
    displayName: string;
    autoAlignable: boolean;
    autoAlignMeta: {
        name: string;
        type: alignSystem;
        position: number[];
    }[][];
}
