import { PointCustomApiBinding, SinglePointBindingConfig } from './DataBindingTypes';
type __VLS_Props = {
    cpntId: number;
    config: SinglePointBindingConfig;
    customApiBinding?: PointCustomApiBinding;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    change: (customApiBinding?: PointCustomApiBinding | undefined) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((customApiBinding?: PointCustomApiBinding | undefined) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
