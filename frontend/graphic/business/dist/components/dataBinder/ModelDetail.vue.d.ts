import { DataModelVirtual } from './DataBindingTypes';
import { default as DataBindingManager } from './DataBindingManager';
type __VLS_Props = {
    data: DataModelVirtual;
    bindingManager: DataBindingManager;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    noRefs: () => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onNoRefs?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
