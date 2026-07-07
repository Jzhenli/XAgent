import { shapePropertyGroupDef } from '../../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as BaseDevice, BaseDeviceProps } from '../BaseDevice';

export default class BaseDamper extends BaseDevice {
    constructor(opt?: BaseDeviceProps);
    brushTypes: never[];
    propertyMeta: shapePropertyGroupDef[];
    relatedChildrenProperties: string[];
}
