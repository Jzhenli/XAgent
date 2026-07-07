import { MulPopupBindingValue, MulCustomConfig } from './GraphicMulManager';
import { default as DataBindingManager } from '../dataBinder/DataBindingManager';
type __VLS_Props = {
    label?: string;
    showLabel?: boolean;
    id: any;
    value: MulPopupBindingValue | undefined | null;
    dataBindingManager: DataBindingManager;
    customConfig?: MulCustomConfig;
    isShowDashboard?: boolean;
    isShowChart?: boolean;
    isShowPoints?: boolean;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    changeValue: (value: MulPopupBindingValue | null) => any;
    initValue: (value: MulPopupBindingValue | null) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChangeValue?: ((value: MulPopupBindingValue | null) => any) | undefined;
    onInitValue?: ((value: MulPopupBindingValue | null) => any) | undefined;
}>, {
    showLabel: boolean;
    isShowDashboard: boolean;
    isShowChart: boolean;
    isShowPoints: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export default _default;
