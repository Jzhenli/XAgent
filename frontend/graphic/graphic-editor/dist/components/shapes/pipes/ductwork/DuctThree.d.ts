import { default as BaseDeviceNoBindingMultiViewPos } from '../../deviceShapes/BaseDeviceNoBindingMultiViewPos';
import { BaseDeviceProps } from '../../deviceShapes/BaseDevice';
import { alignSystem } from '../../../common/Draggable';

export default class DuctThree extends BaseDeviceNoBindingMultiViewPos {
    viewPosList: {
        name: string;
        size: number[];
        img: string[];
        thumb: string;
        lnk: (number | null)[];
    }[];
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
