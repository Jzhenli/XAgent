import { shapePropertyGroupDef } from '../../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as BaseDevice, BaseDeviceProps } from '../BaseDevice';

export default class BasePump extends BaseDevice {
    constructor(opt?: BaseDeviceProps);
    propertyMeta: shapePropertyGroupDef[];
    relatedChildrenProperties: string[];
}
