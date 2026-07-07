import { default as BaseDevice, BaseDeviceProps } from '../BaseDevice';
import { shapePropertyGroupDef } from '../../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';
import { alignSystem } from '../../../common/Draggable';
import { BindedPoint } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';

export default class LargePlateHeatExchanger extends BaseDevice {
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
    inputPrimaryState: boolean;
    outputPrimaryState: boolean;
    getPointAttrValueRegistrators(): [BindedPoint, (value: string, type?: PointAttrValueType) => void][];
    autoAlignable: boolean;
    autoAlignMeta: {
        name: string;
        type: alignSystem;
        position: number[];
    }[][];
}
