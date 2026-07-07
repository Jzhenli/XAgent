import { default as DataAccessSimulateManager } from '../dataBinder/DataAccessSimulateManager';
import { default as DataAccessManager } from '../dataBinder/DataAccessManager';
type __VLS_Props = {
    dashboardData?: any;
    isBackdropFilterBlur?: boolean;
    manager?: DataAccessSimulateManager | DataAccessManager;
};
declare function loadData(): Promise<void>;
declare function removeCbs(): void;
declare const _default: import('vue').DefineComponent<__VLS_Props, {
    loadData: typeof loadData;
    removeCbs: typeof removeCbs;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
