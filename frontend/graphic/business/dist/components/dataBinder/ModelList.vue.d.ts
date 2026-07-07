import { default as DataBindingManager } from './DataBindingManager';
import { DataModelVirtual } from './DataBindingTypes';
type __VLS_Props = {
    bindingManager: DataBindingManager;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    equipmentListItemRefs: (import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
        id?: number;
        cpntId?: number;
        model: DataModelVirtual;
        active?: boolean;
        bindingManager: DataBindingManager;
    }> & Readonly<{
        onClick?: (() => any) | undefined;
        onDelete?: (() => any) | undefined;
    }>, {
        bindingState: () => void;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
        click: () => any;
        delete: () => any;
    }, import('vue').PublicProps, {}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, any, import('vue').ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<{
        id?: number;
        cpntId?: number;
        model: DataModelVirtual;
        active?: boolean;
        bindingManager: DataBindingManager;
    }> & Readonly<{
        onClick?: (() => any) | undefined;
        onDelete?: (() => any) | undefined;
    }>, {
        bindingState: () => void;
    }, {}, {}, {}, {}> | null)[];
}, any>;
export default _default;
