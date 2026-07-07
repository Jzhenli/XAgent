import { BaseDeviceProps } from '../BaseDevice';
import { default as BaseDamper } from './BaseDamper';
import { alignSystem } from '../../../common/Draggable';

export default class RoundDamper extends BaseDamper {
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
    animationRenderMeta: {
        propName: string;
        imgLayers: {
            order: number;
            stateMap: {};
        }[];
    }[][];
    autoAlignable: boolean;
    autoAlignMeta: {
        name: string;
        type: alignSystem;
        position: number[];
    }[][];
}
