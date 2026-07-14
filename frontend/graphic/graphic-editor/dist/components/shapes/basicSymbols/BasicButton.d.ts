import { shapePropertyGroupDef } from '../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { default as BasicText, BasicTextProps } from '../BasicText';

export default class BasicButton extends BasicText {
    constructor(opt: BasicTextProps);
    displayName: string;
    options: any;
    propertyMeta: shapePropertyGroupDef[];
    getDefaultImg(): string;
    avoidMergePropOnInit(): boolean;
    getMulPopupBinding(): any | null;
    hasCustomBinding(): boolean;
}
