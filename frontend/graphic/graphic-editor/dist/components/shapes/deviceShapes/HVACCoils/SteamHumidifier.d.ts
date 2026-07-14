import { shapePropertyGroupDef } from '../../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { BaseDeviceProps } from '../BaseDevice';
import { default as BaseDeviceSingleViewPos } from '../BaseDeviceSingleViewPos';
import { alignSystem } from '../../../common/Draggable';

export default class SteamHumidifier extends BaseDeviceSingleViewPos {
    viewPosList: {
        name: string;
        size: number[];
        img: string[];
        thumb: string;
        lnk: (number | null)[];
    }[];
    animLayerImage: string[];
    shaderImgs: string[];
    brushTypes: never[];
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
                on25: string[];
                on50: string[];
                on75: string[];
                on100: string[];
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
