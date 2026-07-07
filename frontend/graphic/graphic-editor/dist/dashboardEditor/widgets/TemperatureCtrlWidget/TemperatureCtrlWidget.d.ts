import { default as BaseWidget } from '../BaseWidget';
import { shapePropertyGroupDef } from '../../common/PropertyMetaTypes';
import { BindedPoint } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';

export default class TemperatureCtrlWidget extends BaseWidget {
    displayName: string;
    thumbnail: string;
    defaultSize: number[];
    widgetMeta: any;
    options: any;
    component: any;
    renderComponent: any;
    propertyMeta: shapePropertyGroupDef[];
    set(key: string, value: any): void;
    setOptions(options: any): void;
    getPointAttrValueRegistrators(): [BindedPoint, any][];
    removeBindPointFromEquipmentModel(cpntId: number): void;
}
