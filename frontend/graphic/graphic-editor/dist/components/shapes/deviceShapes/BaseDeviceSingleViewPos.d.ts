import { shapePropertyGroupDef } from '../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as BaseDevice } from './BaseDevice';

export default class BaseDeviceSingleViewPos extends BaseDevice {
    propertyMetaBase: shapePropertyGroupDef[];
    propertyMeta: shapePropertyGroupDef[];
    relatedChildrenProperties: string[];
    animationRenderMeta: any;
}
