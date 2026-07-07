import { BasicValueTypes } from '@x-plateform-mono/service/dist/equipmentService';
import { default as DataBindingManager } from './DataBindingManager';
type __VLS_Props = {
    data: {
        propType: 'attribute' | 'point';
        key: string;
        name: string;
        valueType: BasicValueTypes;
        stateMap?: Map<number, string>;
        unitText?: string;
        refs?: {
            id?: number;
            cpntId: number;
            innerName?: string;
        }[];
    };
    bindingManager: DataBindingManager;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    noRefs: () => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onNoRefs?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
