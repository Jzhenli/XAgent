import { shapePropertyGroupDef } from '../../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as BaseDevice, BaseDeviceProps } from '../BaseDevice';
import { alignSystem } from '../../../common/Draggable';

export default class PipeHeatTape extends BaseDevice {
    viewPosList: never[];
    shaderLayerIdxes: number[];
    animLayerImage: never[];
    propertyMeta: shapePropertyGroupDef[];
    relatedChildrenProperties: string[];
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
