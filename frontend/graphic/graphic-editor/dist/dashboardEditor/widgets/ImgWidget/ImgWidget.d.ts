import { shapePropertyGroupDef } from '../../common/PropertyMetaTypes';
import { default as BaseWidget } from '../BaseWidget';

export default class ImgWidget extends BaseWidget {
    displayName: string;
    thumbnail: string;
    defaultSize: number[];
    options: {
        className: string;
        top: number;
        left: number;
        width: number;
        height: number;
        img: {
            src: string;
            name: string;
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
        } | null;
    };
    component: any;
    renderComponent: any;
    propertyMeta: shapePropertyGroupDef[];
}
