import { treeDataType } from '@x-plateform-mono/common/dist/components/tree/BasicTree';
import { networkItem } from '@x-plateform-mono/service/dist/networkService';
type __VLS_Props = {
    disableSelCallback: (t: networkItem) => boolean;
    existingPoints: string[];
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    onNodeClick: (value: treeDataType) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onOnNodeClick?: ((value: treeDataType) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
