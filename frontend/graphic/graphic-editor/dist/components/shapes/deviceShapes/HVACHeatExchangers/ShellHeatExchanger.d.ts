import { default as BaseDevice, BaseDeviceProps } from '../BaseDevice';
import { shapePropertyGroupDef } from '../../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { alignSystem } from '../../../common/Draggable';
import { BindedPoint } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';

export default class ShellHeatExchanger extends BaseDevice {
    viewPosList: {
        name: string;
        size: number[];
        img: never[];
        thumb: string;
        lnk: (number | null)[];
    }[];
    shaderLayerIdxes: number[];
    animLayerImage: never[];
    shaderImgs: never[];
    propertyMeta: shapePropertyGroupDef[];
    constructor(opt?: BaseDeviceProps);
    displayName: string;
    relatedChildrenProperties: string[];
    inputPrimaryState: boolean;
    outputPrimaryState: boolean;
    getPointAttrValueRegistrators(): [BindedPoint, any][];
    autoAlignable: boolean;
    autoAlignMeta: {
        name: string;
        type: alignSystem;
        position: number[];
    }[][];
}
