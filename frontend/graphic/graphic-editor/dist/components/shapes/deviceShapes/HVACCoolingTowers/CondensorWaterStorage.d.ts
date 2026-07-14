import { default as BaseDevice, BaseDeviceProps } from '../BaseDevice';
import { shapePropertyGroupDef } from '../../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { alignSystem } from '../../../common/Draggable';

export default class CondensorWaterStorage extends BaseDevice {
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
    constructor(opt?: BaseDeviceProps);
    displayName: string;
    relatedChildrenProperties: string[];
    animationRenderMeta: {
        propName: string;
        imgLayers: {
            order: number;
            stateMap: {
                empty: string[];
                level25: string[];
                level50: string[];
                level75: string[];
                level100: string[];
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
