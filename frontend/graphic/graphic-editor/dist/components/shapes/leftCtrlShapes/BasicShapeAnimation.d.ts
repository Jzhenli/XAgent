import { popupBindingValue, mulPopupBindingValue } from '../../common/Bindable';
import { brushTypes, shapePropertyGroupDef } from '../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';
import { default as BaseAnimation } from '../BaseAnimation';
import { BindedPoint } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';

export declare const basicShapeAnimationStates: () => {
    name: string;
    label: string;
}[];
export default abstract class BasicShapeAnimation extends BaseAnimation {
    propertyMetaForBindings: shapePropertyGroupDef[];
    relatedChildrenProperties: string[];
    brushTypes: brushTypes[];
    getPointAttrValueRegistrators(): [BindedPoint, (value: string, type?: PointAttrValueType) => void][];
    renderHidden: boolean;
    renderStrokeStyle: string;
    renderFillStyle: string;
    currentStatusIdx: number;
    updateStyleByState(state: string, stateList?: string[], cb?: any): void;
    set(key: string, value: any): void;
    isRenderPointer(): boolean;
    getNavigationLink(): any;
    getPopupBinding(): popupBindingValue | null;
    getMulPopupBinding(): mulPopupBindingValue | null;
    hasCustomBinding(): boolean;
}
