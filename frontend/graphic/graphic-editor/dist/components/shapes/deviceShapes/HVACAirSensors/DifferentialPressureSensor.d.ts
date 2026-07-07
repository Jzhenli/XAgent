import { BaseDeviceProps } from '../BaseDevice';
import { alignSystem } from '../../../common/Draggable';
import { default as BaseMultAirSensor } from './BaseMultAirSensor';

export default class DifferentialPressureSensorAir extends BaseMultAirSensor {
    viewPosList: {
        name: string;
        size: number[];
        img: never[];
        thumb: string;
        lnk: null[];
    }[];
    shaderLayerIdxes: number[];
    animLayerImage: never[];
    shaderImgs: never[];
    constructor(opt?: BaseDeviceProps);
    displayName: string;
    autoAlignable: boolean;
    autoAlignMeta: {
        name: string;
        type: alignSystem;
        position: number[];
    }[][];
}
