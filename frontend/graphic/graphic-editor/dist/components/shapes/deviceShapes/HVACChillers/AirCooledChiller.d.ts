import { shapePropertyGroupDef } from '../../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as BaseDevice, BaseDeviceProps } from '../BaseDevice';
import { alignSystem } from '../../../common/Draggable';

export default class AirCooledChiller extends BaseDevice {
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
    propertyMeta: shapePropertyGroupDef[];
    relatedChildrenProperties: string[];
    constructor(opt?: BaseDeviceProps);
    displayName: string;
    animationRenderMeta: {
        propName: string;
        imgLayers: {
            order: number;
            stateMap: {
                off: string[];
                on: string[];
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
