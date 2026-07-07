import { BasicValueTypes, EquipmentTemplate, EquipmentTemplateAttribute, EquipmentTemplatePoint } from '@x-plateform-mono/service/dist/equipmentService';
import { DataModelPointBinding } from './DataBindingTypes';
type __VLS_Props = {
    innerRef: number;
    reqType?: BasicValueTypes[];
    dataModelPoint?: DataModelPointBinding;
    selectedEquipmentTemplate?: EquipmentTemplate;
    enableAttributeBinding: boolean;
    enablePointBinding: boolean;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    selectPoint: (point: EquipmentTemplatePoint) => any;
    selectAttr: (attr: EquipmentTemplateAttribute) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSelectPoint?: ((point: EquipmentTemplatePoint) => any) | undefined;
    onSelectAttr?: ((attr: EquipmentTemplateAttribute) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export default _default;
