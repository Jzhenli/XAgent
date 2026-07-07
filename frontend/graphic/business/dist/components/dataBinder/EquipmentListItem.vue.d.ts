import { DataModelVirtual } from './DataBindingTypes';
import { default as DataBindingManager } from './DataBindingManager';
type __VLS_Props = {
    id?: number;
    cpntId?: number;
    model: DataModelVirtual;
    active?: boolean;
    bindingManager: DataBindingManager;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {
    bindingState: () => void;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    click: () => any;
    delete: () => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onClick?: (() => any) | undefined;
    onDelete?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export default _default;
