import { default as GLayer } from '../../common/GLayer';
import { default as GItem } from '../../shapes/GItem';
import { Ref } from 'vue';

declare function activateLayer(layer: GLayer): void;
declare function activateItem(evt: MouseEvent, layer: GLayer, item: GItem): void;
declare function activateGroupItem(evt: MouseEvent, layer: GLayer, groupItem: GItem, gItem: GItem): void;
declare function toggleLayerVisible(layer: GLayer): void;
declare const _default: {
    layer: {
        click: typeof activateLayer;
        toggleLayerVisible: typeof toggleLayerVisible;
    };
    item: {
        click: typeof activateItem;
    };
    groupItem: {
        click: typeof activateGroupItem;
    };
    setCurrentLayer(layer: Ref<GLayer | null>): void;
    setSelectedItemAnchor(item: GItem | null): void;
};
export default _default;
