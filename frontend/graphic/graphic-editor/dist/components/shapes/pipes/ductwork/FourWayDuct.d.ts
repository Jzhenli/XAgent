import { alignSystem } from '../../../common/Draggable';
import { BaseDeviceProps } from '../../deviceShapes/BaseDevice';
import { default as BaseDeviceNoBindingSingleViewPos } from '../../deviceShapes/BaseDeviceNoBindingSingleViewPos';

export default class FourWayDuct extends BaseDeviceNoBindingSingleViewPos {
    viewPosList: {
        name: string;
        size: number[];
        img: never[];
        thumb: string;
        lnk: null[];
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
