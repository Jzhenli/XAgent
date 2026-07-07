import { shapePropertyGroupDef } from '../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as BaseDevice, BaseDeviceProps } from './BaseDevice';

export default class BaseDeviceMultiViewPos extends BaseDevice {
    constructor(opt?: BaseDeviceProps);
    propertyMetaBase: shapePropertyGroupDef[];
    propertyMeta: shapePropertyGroupDef[];
    relatedChildrenProperties: string[];
    animationRenderMeta: any;
}
