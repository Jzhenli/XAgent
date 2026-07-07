import { alignSystem } from '../../../common/Draggable';
import { BaseDeviceProps } from '../BaseDevice';
import { default as BaseDeviceMultiViewPos } from '../BaseDeviceMultiViewPos';

export default class FlowVenturi extends BaseDeviceMultiViewPos {
    viewPosList: never[];
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
