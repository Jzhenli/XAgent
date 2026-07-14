import { shapePropertyGroupDef } from '../../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as BaseDeviceSingleViewPos } from '../BaseDeviceSingleViewPos';
import { BaseDeviceProps } from '../BaseDevice';

export default class BaseAirSensor extends BaseDeviceSingleViewPos {
    constructor(opt?: BaseDeviceProps);
    propertyMeta: shapePropertyGroupDef[];
}
