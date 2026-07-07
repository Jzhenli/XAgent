import { default as DataAccessManager } from '../components/dataBinder/DataAccessManager';
import { MulPopupBindingValue } from '../components/graphicMulPopup/GraphicMulManager';
declare const _default: import('vue').DefineComponent<{}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {
    graphicMul: import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
        canvasSize: {
            width: number;
            height: number;
        };
        manager?: DataAccessManager;
        transform?: {
            transformX: number;
            transformY: number;
        };
        componetRender: Map<string, any>;
        border?: {
            left: number;
            right: number;
            top: number;
            bottom: number;
            isAddBorder?: boolean;
        };
        withinRoot?: boolean;
        zIndex?: number;
        root?: HTMLElement;
    }> & Readonly<{
        onClose?: ((id: number) => any) | undefined;
        onItemClick?: ((value: any) => any) | undefined;
        onSetValue?: ((value: {
            value: number;
            bindingObject: any;
            priority: string;
            id?: number;
        }) => any) | undefined;
    }>, {
        openMulPopup: (item: MulPopupBindingValue, evt: {
            x: number;
            y: number;
        }, updateCallback: import('../components/graphicMulPopup/GraphicMulManager').MulCustomBinding) => Promise<void>;
        closePopup: (id: string | number) => void;
        closeAllPopup: (type?: string) => void;
        getPopRefById: (id: string | number) => any;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
        close: (id: number) => any;
        itemClick: (value: any) => any;
        setValue: (value: {
            value: number;
            bindingObject: any;
            priority: string;
            id?: number;
        }) => any;
    }, import('vue').PublicProps, {}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, any, import('vue').ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<{
        canvasSize: {
            width: number;
            height: number;
        };
        manager?: DataAccessManager;
        transform?: {
            transformX: number;
            transformY: number;
        };
        componetRender: Map<string, any>;
        border?: {
            left: number;
            right: number;
            top: number;
            bottom: number;
            isAddBorder?: boolean;
        };
        withinRoot?: boolean;
        zIndex?: number;
        root?: HTMLElement;
    }> & Readonly<{
        onClose?: ((id: number) => any) | undefined;
        onItemClick?: ((value: any) => any) | undefined;
        onSetValue?: ((value: {
            value: number;
            bindingObject: any;
            priority: string;
            id?: number;
        }) => any) | undefined;
    }>, {
        openMulPopup: (item: MulPopupBindingValue, evt: {
            x: number;
            y: number;
        }, updateCallback: import('../components/graphicMulPopup/GraphicMulManager').MulCustomBinding) => Promise<void>;
        closePopup: (id: string | number) => void;
        closeAllPopup: (type?: string) => void;
        getPopRefById: (id: string | number) => any;
    }, {}, {}, {}, {}> | null;
}, HTMLDivElement>;
export default _default;
