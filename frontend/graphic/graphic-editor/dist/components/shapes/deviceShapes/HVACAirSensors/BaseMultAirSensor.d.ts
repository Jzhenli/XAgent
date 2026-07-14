import { shapePropertyGroupDef } from '../../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { BaseDeviceProps } from '../BaseDevice';
import { default as BaseDeviceSingleViewPos } from '../BaseDeviceSingleViewPos';

export default class BaseMultAirSensor extends BaseDeviceSingleViewPos {
    constructor(opt?: BaseDeviceProps);
    propertyMeta: shapePropertyGroupDef[];
}
