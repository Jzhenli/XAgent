import { alignSystem } from '../../../common/Draggable';
import { BaseDeviceProps } from '../../deviceShapes/BaseDevice';
import { default as BaseDeviceNoBindingSingleViewPos } from '../../deviceShapes/BaseDeviceNoBindingSingleViewPos';

export default class FixedHeightVerticalDuct extends BaseDeviceNoBindingSingleViewPos {
    viewPosList: {
        name: string;
        size: number[];
        img: string[];
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
    getAlignResult(type: alignSystem, iv: [number, number]): {
        isMatch: boolean;
        deltaVector?: [number, number] | undefined;
        rate?: number | undefined;
    };
}
