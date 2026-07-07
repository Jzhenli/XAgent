import { shapePropertyGroupDef } from '../../common/PropertyMetaTypes';
import { default as BaseWidget } from '../BaseWidget';

export default class SankeyWidget extends BaseWidget {
    displayName: string;
    options: {
        className: string;
        width: number;
        height: number;
        title: string;
        unit: string;
        backgroundColor: string;
        defaultValue: number;
        showUnit: boolean;
        showTooltip: boolean;
        defaultAttribute: {
            itemColor: (cpntId: any) => any;
        };
        attributeList: never[];
        startAnchor: string;
        startOffset: string;
        startUnit: string;
        endAnchor: string;
        endOffset: string;
        endUnit: string;
        bindingType: "point" | "api";
        showPointBinding: boolean;
        showApiBinding: boolean;
        hideLeaf: boolean;
        showCarbon: boolean;
        chartHeight: number;
    };
    component: any;
    renderComponent: any;
    propertyMeta: shapePropertyGroupDef[];
}
