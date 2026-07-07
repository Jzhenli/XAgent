import { alignSystem } from '../../../common/Draggable';
import { BaseDeviceProps } from '../BaseDevice';
import { default as BaseAirSensor } from './BaseAirSensor';

export default class AirVelocitySensor extends BaseAirSensor {
    viewPosList: {
        name: string;
        size: number[];
        img: never[];
        thumb: string;
        lnk: null[];
    }[];
    animLayerImage: never[];
    shaderImgs: never[];
    shaderLayerIdxes: number[];
    constructor(opt?: BaseDeviceProps);
    displayName: string;
    autoAlignable: boolean;
    autoAlignMeta: {
        name: string;
        type: alignSystem;
        position: number[];
    }[][];
}
