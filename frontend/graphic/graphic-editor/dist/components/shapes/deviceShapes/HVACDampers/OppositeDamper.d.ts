import { BaseDeviceProps } from '../BaseDevice';
import { default as BaseDamper } from './BaseDamper';
import { alignSystem } from '../../../common/Draggable';

export default class OppositeDamper extends BaseDamper {
    viewPosList: {
        name: string;
        size: number[];
        img: string[];
        thumb: string;
        lnk: (number | null)[];
    }[];
    shaderLayerIdxes: number[];
    animLayerImage: string[];
    shaderImgs: string[];
    constructor(opt?: BaseDeviceProps);
    displayName: string;
    animationRenderMeta: {
        propName: string;
        imgLayers: {
            order: number;
            stateMap: {
                close: string[];
                open25: string[];
                open50: string[];
                open75: string[];
                open100: string[];
            };
        }[];
    }[][];
    autoAlignable: boolean;
    autoAlignMeta: {
        name: string;
        type: alignSystem;
        position: number[];
    }[][];
}
