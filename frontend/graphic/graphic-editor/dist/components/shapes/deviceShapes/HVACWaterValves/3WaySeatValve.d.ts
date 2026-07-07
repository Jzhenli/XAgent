import { alignSystem } from '../../../common/Draggable';
import { BaseDeviceProps } from '../BaseDevice';
import { default as BaseDeviceMultiViewPos } from '../BaseDeviceMultiViewPos';

export default class ThreeWaySeatValve extends BaseDeviceMultiViewPos {
    viewPosList: {
        name: string;
        size: number[];
        img: never[];
        thumb: string;
        lnk: (number | null)[];
    }[];
    shaderLayerIdxes: number[];
    animLayerImage: never[];
    constructor(opt?: BaseDeviceProps);
    displayName: string;
    autoAlignable: boolean;
    autoAlignMeta: {
        name: string;
        type: alignSystem;
        position: number[];
    }[][];
}
