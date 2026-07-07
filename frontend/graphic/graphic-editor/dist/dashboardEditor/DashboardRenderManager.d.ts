import { default as BaseWidget } from './widgets/BaseWidget';
import { default as Eventful } from './common/Eventful';
import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';
import { BindedPoint } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';
import { default as DataAccessSimulateManager } from '@x-plateform-mono/business/dist/components/dataBinder/DataAccessSimulateManager';
import { default as DataAccessManager } from '@x-plateform-mono/business/dist/components/dataBinder/DataAccessManager';

export default class DashboardRenderManager extends Eventful {
    offSetTop: import('vue').Ref<number, number>;
    totalHeight: import('vue').Ref<number, number>;
    widgetList: import('vue').Reactive<BaseWidget[]>;
    loadData(data: any): Promise<void>;
    updateSize(): void;
    getPointAttrValueRegistrators(dataAccessManager?: DataAccessSimulateManager | DataAccessManager): [BindedPoint, ((value: string, type?: PointAttrValueType) => void)][];
}
