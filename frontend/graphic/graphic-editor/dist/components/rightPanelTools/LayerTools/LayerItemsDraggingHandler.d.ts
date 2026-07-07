import { Ref } from 'vue';
import { default as GLayer } from '../../common/GLayer';
import { default as GItem } from '../../shapes/GItem';

declare function layerDragStart(layer: GLayer): void;
declare function layerDrop(evt: MouseEvent, layer: GLayer): void;
declare function layerDragend(evt: MouseEvent): void;
declare function dragoverLayer(evt: MouseEvent, idx: number): void;
declare function dragleaveLayer(evt: MouseEvent): void;
declare function dragstart(layer: GLayer, item: GItem): void;
declare function dragover(evt: MouseEvent, layer: GLayer, item: GItem): void;
declare function dragleave(evt: MouseEvent): void;
declare function drop(evt: MouseEvent, layer: GLayer, item: GItem): void;
declare function dragend(evt: MouseEvent): void;
declare function groupItemDragStart(layer: GLayer, group: GItem, item: GItem): void;
declare function groupItemDragOver(evt: MouseEvent): void;
declare function groupItemDragLeave(evt: MouseEvent): void;
declare function groupItemDrop(evt: MouseEvent, layer: GLayer, group: GItem, item: GItem): void;
declare function groupItemDragend(evt: MouseEvent): void;
declare function containerDragover(evt: MouseEvent): void;
declare const _default: {
    container: {
        dragOver: typeof containerDragover;
    };
    layer: {
        dragstart: typeof layerDragStart;
        dragover: typeof dragoverLayer;
        dragend: typeof layerDragend;
        dragleave: typeof dragleaveLayer;
        drop: typeof layerDrop;
    };
    item: {
        dragstart: typeof dragstart;
        dragover: typeof dragover;
        dragend: typeof dragend;
        dragleave: typeof dragleave;
        drop: typeof drop;
    };
    groupItem: {
        dragstart: typeof groupItemDragStart;
        dragover: typeof groupItemDragOver;
        dragend: typeof groupItemDragend;
        dragleave: typeof groupItemDragLeave;
        drop: typeof groupItemDrop;
    };
    setLayerExpandCollapse(value: Ref<{
        isOpen: boolean;
    }[]>): void;
};
export default _default;
