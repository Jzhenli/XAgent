import { alignSystem } from '../../../common/Draggable';
import { BaseDeviceProps } from '../BaseDevice';
import { default as BaseAirSensor } from './BaseAirSensor';

export default class DuctTemperatureAndHumidity extends BaseAirSensor {
    viewPosList: {
        name: string;
        size: number[];
        img: string[];
        thumb: string;
        lnk: null[];
    }[];
    shaderLayerIdxes: number[];
    shaderImgs: string[];
    animLayerImage: string[];
    constructor(opt?: BaseDeviceProps);
    displayName: string;
    autoAlignable: boolean;
    autoAlignMeta: {
        name: string;
        type: alignSystem;
        position: number[];
    }[][];
}
