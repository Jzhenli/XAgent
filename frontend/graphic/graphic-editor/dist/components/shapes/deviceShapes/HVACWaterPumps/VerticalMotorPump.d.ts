import { BaseDeviceProps } from '../BaseDevice';
import { default as BasePump } from './BasePump';
import { alignSystem } from '../../../common/Draggable';

export default class VerticalMotorPump extends BasePump {
    viewPosList: {
        name: string;
        size: number[];
        img: never[];
        thumb: string;
        lnk: (number | null)[];
    }[];
    constructor(opt?: BaseDeviceProps);
    displayName: string;
    shaderLayerIdxes: number[];
    animLayerImage: never[];
    shaderImgs: never[];
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
