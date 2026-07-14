import { popupBindingValue } from '../../common/Bindable';
import { brushTypes, shapePropertyGroupDef } from '../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as BaseAnimation } from '../BaseAnimation';

export declare const basicShapeAnimationStates: () => {
    name: string;
    label: string;
}[];
export default abstract class BasicShapeAnimation extends BaseAnimation {
    propertyMetaForBindings: shapePropertyGroupDef[];
    relatedChildrenProperties: string[];
    brushTypes: brushTypes[];
    getPointAttrValueRegistrators(): [any, (value: string, type?: any) => void][];
    renderHidden: boolean;
    renderStrokeStyle: string;
    renderFillStyle: string;
    currentStatusIdx: number;
    updateStyleByState(state: string, stateList?: string[], cb?: any): void;
    set(key: string, value: any): void;
    isRenderPointer(): boolean;
    getNavigationLink(): any;
    getPopupBinding(): popupBindingValue | null;
    getMulPopupBinding(): any | null;
    hasCustomBinding(): boolean;
}
