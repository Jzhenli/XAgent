import { bindingObject } from '../../common/Bindable';
import { default as Eventful } from '../../common/Eventful';
import { default as PropertySerializable } from '../../common/PropertySerializable';
import { brushTypes, shapePropertyGroupDef } from './PropertyMetaTypes';

declare class PropertyPanelManager extends Eventful {
    lastBindingValue: bindingObject | undefined;
    lastSettings: any;
    inheritablePropNames: string[];
    updateGraphic(propName: string, value: any): void;
    gItem: PropertySerializable | null;
    rerender: () => void;
    setPanel(options: any, propertyMeta: shapePropertyGroupDef[], item: PropertySerializable): void;
    createPopupConfigGroup(): shapePropertyGroupDef;
    isUpdated: boolean;
    lastUpdateTime: number;
    debounceStep: number;
    optionSaved: any;
    finalUpdateTimeout: number;
    updatePanel(options: any): void;
    clear(): void;
    brushingTypes: brushTypes | null;
    startBrushing(type: brushTypes): void;
    cancelBrushing(): void;
}
declare const propertyPanelManager: PropertyPanelManager;
export default propertyPanelManager;
