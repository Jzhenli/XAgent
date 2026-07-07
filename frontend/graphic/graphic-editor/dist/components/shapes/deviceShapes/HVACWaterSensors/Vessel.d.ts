import { BaseDeviceProps } from '../BaseDevice';
import { default as BaseDeviceSingleViewPos } from '../BaseDeviceSingleViewPos';
import { shapePropertyGroupDef } from '../../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { alignSystem } from '../../../common/Draggable';

export default class Vessel extends BaseDeviceSingleViewPos {
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
