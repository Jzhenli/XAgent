import { shapePropertyGroupDef } from '../../common/PropertyMetaTypes';
import { default as BaseWidget } from '../BaseWidget';
import { BindedPoint } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';

export default class GaugeWidget extends BaseWidget {
    displayName: string;
    thumbnail: string;
    defaultSize: number[];
    options: {
        className: string;
        top: number;
        left: number;
        width: number;
        height: number;
        title: string;
        titleFontSize: number;
        titlePosition: string;
        fontSize: number;
        fontColor: string;
        fillColor: string;
        maxValue: number;
        minValue: number;
        showRange: boolean;
        showState: boolean;
        showUnit: boolean;
        showPointName: boolean;
        bindingValue: {
            bindingList?: any[] | undefined;
            animationConfig?: {
                defaultState: string | undefined;
                continous: string[];
                discrete: string[];
            } | undefined;
        } | null;
        bindingNavigation: {
            id: string;
            name: string;
            type?: string | undefined;
            graphicId?: string | undefined;
            graphicName?: string | undefined;
            dashboardId?: string | undefined;
            dashboardName?: string | undefined;
            videoBoardId?: string | undefined;
            videoBoardName?: string | undefined;
            layoutRef?: string | undefined;
            layoutName?: string | undefined;
            customLink?: string | undefined;
        } | null;
        value: string | number;
        unit: string;
        state: string;
        precision: number;
    };
    component: any;
    renderComponent: any;
    propertyMeta: shapePropertyGroupDef[];
    set(key: string, value: any): void;
    getPointAttrValueRegistrators(dataAccessManager?: any): [BindedPoint, any][];
}
