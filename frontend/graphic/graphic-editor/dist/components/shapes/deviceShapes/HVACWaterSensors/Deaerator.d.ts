import { BaseDeviceProps } from '../BaseDevice';
import { default as BaseDeviceSingleViewPos } from '../BaseDeviceSingleViewPos';
import { alignSystem } from '../../../common/Draggable';

export default class Deaerator extends BaseDeviceSingleViewPos {
    viewPosList: never[];
    shaderLayerIdxes: number[];
    animLayerImage: never[];
    constructor(opt?: BaseDeviceProps);
    propertyMeta: import('../../../rightPanelTools/PropertyTools/PropertyMetaTypes').shapePropertyGroupDef[];
    displayName: string;
    autoAlignable: boolean;
    autoAlignMeta: {
        name: string;
        type: alignSystem;
        position: number[];
    }[][];
}
