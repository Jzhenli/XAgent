import { shapePropertyGroupDef } from '../../common/PropertyMetaTypes';
import { default as BaseWidget } from '../BaseWidget';
import { BindedPoint } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';

export default class ValueWiget extends BaseWidget {
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
        showPointName: boolean;
        showUnit: boolean;
        fontColor: string;
        fontWeight: boolean;
        fontSize: number;
        unitSize: number;
        allowSetValue: boolean;
        bgColor: string;
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
        precision: number;
    };
    component: any;
    renderComponent: any;
    propertyMeta: shapePropertyGroupDef[];
    getPointAttrValueRegistrators(dataAccessManager?: any): [BindedPoint, any][];
}
