import { default as DataBindingManager } from './DataBindingManager';
import { DataModelBindingConfig, DataModelPointBinding, SinglePointBindingConfig } from './DataBindingTypes';
type __VLS_Props = {
    id?: number;
    cpntId: number;
    config: SinglePointBindingConfig;
    dataModelPoint?: DataModelPointBinding;
    bindingManager: DataBindingManager;
    modelConfig: DataModelBindingConfig;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    change: (value?: DataModelPointBinding | undefined) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((value?: DataModelPointBinding | undefined) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export default _default;
