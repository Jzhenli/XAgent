import { default as DataAccessManager } from '../dataBinder/DataAccessManager';
import { default as GraphicMulManager, MulPopupBindingValue } from './GraphicMulManager';
type __VLS_Props = {
    popComponet: any;
    options: {
        show: boolean;
        uqId: number | string | undefined;
        bindings: MulPopupBindingValue | undefined;
        popupSize: number[];
        popupPosition: number[];
        popRenderData: any;
        canvasSize: {
            width: number;
            height: number;
        };
        transform: {
            transformX: number;
            transformY: number;
        } | undefined;
        manager: DataAccessManager | undefined;
        dashboardWidth: number;
    };
    graphicMulManager: GraphicMulManager;
    withinRoot?: boolean;
    zIndex?: number;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
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
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    layerItem: HTMLDivElement;
    compRef: unknown;
}, any>;
export default _default;
