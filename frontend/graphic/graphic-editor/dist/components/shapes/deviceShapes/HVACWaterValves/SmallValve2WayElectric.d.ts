import { alignSystem } from '../../../common/Draggable';
import { BaseDeviceProps } from '../BaseDevice';
import { default as BaseDeviceMultiViewPos } from '../BaseDeviceMultiViewPos';

export default class SmallValve2WayElectric extends BaseDeviceMultiViewPos {
    viewPosList: {
        name: string;
        size: number[];
        img: string[];
        thumb: string;
        lnk: (number | null)[];
    }[];
    shaderLayerIdxes: number[];
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
