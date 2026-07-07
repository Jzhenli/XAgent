import { alignSystem } from '../../../common/Draggable';
import { BaseDeviceProps } from '../BaseDevice';
import { default as BaseAirSensor } from './BaseAirSensor';

export default class DuctGas extends BaseAirSensor {
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
