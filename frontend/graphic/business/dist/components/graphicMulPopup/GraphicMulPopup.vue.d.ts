import { MulPopupBindingValue, MulCustomBinding } from './GraphicMulManager';
import { default as DataAccessManager } from '../dataBinder/DataAccessManager';
type __VLS_Props = {
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
};
declare function openMulPopup(item: MulPopupBindingValue, evt: {
    x: number;
    y: number;
}, updateCallback: MulCustomBinding): Promise<void>;
declare function closeAllPopup(type?: string): void;
declare function closePopup(id: string | number): void;
declare function getPopRefById(id: string | number): any;
declare const _default: import('vue').DefineComponent<__VLS_Props, {
    openMulPopup: typeof openMulPopup;
    closePopup: typeof closePopup;
    closeAllPopup: typeof closeAllPopup;
    getPopRefById: typeof getPopRefById;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    close: (id: number) => any;
    itemClick: (value: any) => any;
    setValue: (value: {
        value: number;
        bindingObject: any;
        priority: string;
        id?: number;
    }) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onClose?: ((id: number) => any) | undefined;
    onItemClick?: ((value: any) => any) | undefined;
    onSetValue?: ((value: {
        value: number;
        bindingObject: any;
        priority: string;
        id?: number;
    }) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export default _default;
