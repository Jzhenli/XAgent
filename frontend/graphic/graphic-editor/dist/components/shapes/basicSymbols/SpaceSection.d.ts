import { default as BaseDevice } from '../deviceShapes/BaseDevice';
import { popupBindingValue, mulPopupBindingValue } from '../../common/Bindable';
import { shapePropertyGroupDef } from '../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as GCtrlPoint } from '../../mouseHandler/GCtrlPoint';
import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';
import { BindedPoint } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';

export default class SpaceSection extends BaseDevice {
    viewPosList: {
        name: string;
        size: number[];
        img: string[];
        thumb: string;
        lnk: (number | null)[];
    }[];
    constructor(opt: any);
    displayName: string;
    icon: string;
    cp1: GCtrlPoint;
    cp2: GCtrlPoint;
    cp3: GCtrlPoint;
    disableBaseAspectRatio: boolean;
    options: any;
    relatedChildrenProperties: string[];
    propertyMeta: shapePropertyGroupDef[];
    draw(ctx: CanvasRenderingContext2D, zoom: number): void;
    renderingColor: any;
    drawRender(ctx: CanvasRenderingContext2D, zoom?: number | undefined): void;
    getParallelogramPositionMeta(): [[number, number][], number];
    getControlPoints(): GCtrlPoint[];
    updateControls(): void;
    updateShapeCtrls(): void;
    hasCustomBinding(): boolean;
    isRenderPointer(): boolean;
    getNavigationLink(): any;
    getPopupBinding(): popupBindingValue | null;
    getMulPopupBinding(): mulPopupBindingValue | null;
    getShapeAnchorCenter(): {
        x: number;
        y: number;
    };
    getPointAttrValueRegistrators(): [BindedPoint, (value: string, type?: PointAttrValueType | undefined) => void][];
    updateStyleByState(state: string): void;
    setOptions(options: any): void;
}
