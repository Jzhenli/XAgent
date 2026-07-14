import { BaseDeviceProps } from '../BaseDevice';
import { default as BasePump } from './BasePump';
import { alignSystem } from '../../../common/Draggable';

export default class RightHorizontalPump extends BasePump {
    viewPosList: {
        name: string;
        size: number[];
        img: string[];
        thumb: string;
        lnk: (number | null)[];
    }[];
    constructor(opt?: BaseDeviceProps);
    displayName: string;
    shaderLayerIdxes: number[];
    animLayerImage: string[];
    shaderImgs: string[];
    animationRenderMetaBase: [number, string[]][][];
    animationRenderMeta: {
        propName: string;
        imgLayers: {
            order: number;
            stateMap: any;
        }[];
    }[][];
    autoAlignable: boolean;
    autoAlignMeta: {
        name: string;
        type: alignSystem;
        position: number[];
    }[][];
}
