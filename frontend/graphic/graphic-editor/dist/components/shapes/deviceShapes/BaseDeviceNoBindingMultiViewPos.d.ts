import { shapePropertyGroupDef, brushTypes } from '../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as BaseDevice } from './BaseDevice';

export default class BaseDeviceNoBindingMultiViewPos extends BaseDevice {
    propertyMetaBase: shapePropertyGroupDef[];
    propertyMeta: shapePropertyGroupDef[];
    brushTypes: brushTypes[];
}
