import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';
import { default as Eventful } from '../common/Eventful';
import { default as GLayer } from '../common/GLayer';
import { default as GMouseEvent, GMouseEventType } from '../mouseHandler/GMouseEvent';
import { default as RenderDrawingArea } from './RenderDrawingArea';
import { BindedPoint } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';
import { default as DataAccessSimulateManager } from '@x-plateform-mono/business/dist/components/dataBinder/DataAccessSimulateManager';
import { default as DataAccessManager } from '@x-plateform-mono/business/dist/components/dataBinder/DataAccessManager';

declare class GraphicRenderManager extends Eventful {
    layers: GLayer[];
    renderDrawingArea: RenderDrawingArea | null;
    findTopItem(eventName: GMouseEventType, event: GMouseEvent): import('../shapes/GItem').default | null;
    getPointAttrValueRegistrators(dataAccessManager?: DataAccessSimulateManager | DataAccessManager): [BindedPoint, (value: string, type?: PointAttrValueType, translatedText?: string) => void][];
    getCustomBinding(): {
        uqId: any;
        className: any;
        onUpdatePosition: (callback: () => void) => void;
        optionSetter: (key: string, value: any) => void;
        id: string;
        name: string;
        type: string;
        layerIdx: number;
        shapeId: string;
    }[];
    triggerItemPositionUpdateCallbacks(): void;
    loadData(data: any): void;
    renderingLayerIdxList: number[];
    getLayerNames(): {
        name: string;
        show: boolean;
    }[];
    setRenderingLayerIdxList(list: number[]): void;
}
export default GraphicRenderManager;
