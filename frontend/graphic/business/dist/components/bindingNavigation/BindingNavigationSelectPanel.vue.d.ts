import { navBindingValue } from './BindingNavigationType';
type __VLS_Props = {
    selectedItem?: navBindingValue | null;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    onCancel: () => any;
    onConfirm: (value: navBindingValue) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onOnCancel?: (() => any) | undefined;
    onOnConfirm?: ((value: navBindingValue) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
