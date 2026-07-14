import { shapePropertyGroupDef } from '../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as BasicValueBox } from './basicSymbols/BasicValueBox';

export type BasicShapeBindingValueProp = {
    parentUqId?: number;
    propName?: string;
    propLabel?: string;
};
declare class BasicShapeBindingValue extends BasicValueBox {
    constructor(opt?: BasicShapeBindingValueProp);
    setInitProps(): void;
    postConstruct(): void;
    displayName: string;
    icon: string;
    options: any;
    propertyMeta: shapePropertyGroupDef[];
    set(key: string, value: any): void;
    setOptions(options: any): void;
    updateTextInEditor(): void;
    renderHidden: boolean;
    updateTextByValue(): void;
}
export default BasicShapeBindingValue;
