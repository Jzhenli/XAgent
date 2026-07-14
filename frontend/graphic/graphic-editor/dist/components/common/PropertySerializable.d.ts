import { brushTypes, shapePropertyGroupDef } from '../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as Activation } from './Activation';

declare abstract class PropertySerializable extends Activation {
    options: any;
    propertyMeta: shapePropertyGroupDef[];
    findPropertyConfig(name: string): import('../rightPanelTools/PropertyTools/PropertyMetaTypes').shapePropertyDef | null;
    set(key: string, value: any): void;
    get(key: string): any;
    customDisplayName?: string;
    /**
     * 获取option的一个复制
     */
    getOptions(): any;
    abstract setOptions(options: any, customImgCache?: string[]): void;
    brushTypes: brushTypes[];
    propertiesCannotBrush: string[];
    brushProperties(type: brushTypes): void;
}
export default PropertySerializable;
