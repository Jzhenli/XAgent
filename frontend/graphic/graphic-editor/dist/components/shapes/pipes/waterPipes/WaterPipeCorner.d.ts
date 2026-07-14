import { default as BaseDevice, BaseDeviceProps } from '../../deviceShapes/BaseDevice';
import { brushTypes, shapePropertyGroupDef } from '../../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { alignSystem } from '../../../common/Draggable';

export default class WaterPipeCorner extends BaseDevice {
    viewPosList: {
        name: string;
        size: number[];
        img: string[];
        thumb: string;
        lnk: number[];
    }[];
    propertyMeta: shapePropertyGroupDef[];
    brushTypes: brushTypes[];
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
