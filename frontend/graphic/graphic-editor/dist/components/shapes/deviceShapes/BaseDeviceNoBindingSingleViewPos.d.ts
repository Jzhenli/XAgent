import { shapePropertyGroupDef, brushTypes } from '../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as BaseDevice } from './BaseDevice';

export default class BaseDeviceNoBindingSingleViewPos extends BaseDevice {
    propertyMetaBase: shapePropertyGroupDef[];
    propertyMeta: shapePropertyGroupDef[];
    brushTypes: brushTypes[];
}
