import { MulPopupBindingValue } from './GraphicMulManager';
import { default as DataBindingManager } from '../dataBinder/DataBindingManager';
type __VLS_Props = {
    id: any;
    value: MulPopupBindingValue;
    dataBindingManager: DataBindingManager;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    changeValue: (value: MulPopupBindingValue | null) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChangeValue?: ((value: MulPopupBindingValue | null) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
