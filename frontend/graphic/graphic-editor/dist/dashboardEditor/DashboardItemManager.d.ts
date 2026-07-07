import { default as Eventful } from './common/Eventful';
import { default as BaseWidget } from './widgets/BaseWidget';

export default class DashboardItemManager extends Eventful {
    hasSaved: boolean;
    draggingWidgetType: any;
    draggingWidgetItem: BaseWidget | null;
    activeWidgetItem: BaseWidget | null;
    widgetList: import('vue').Reactive<BaseWidget[]>;
    dashboardType: string;
    gridFulfillState: any;
    constructor(props?: {
        type: string;
    });
    /**
     * 在row，col的位置创建一个新的Shape
     * 创建的widget覆盖单元格(row, col), 且使得widget对象尽量靠下靠右
     */
    widgetDrop(row: number, col: number): void;
    activateWidget(widgetItem: BaseWidget): void;
    mousedownWidget(widgetItem: BaseWidget): void;
    deactivateCurrentSelected(): void;
    startMoveWidget(widgetItem: BaseWidget): void;
    stopMoveWidget(): void;
    spaceAvailable(widget: BaseWidget, sizeName: string, value: number): boolean;
    updateFillstate(widgetExclude?: BaseWidget): void;
    deleteCurrentSelected(): void;
    processEquipList(data: any): any;
    loadData(data: any): Promise<void>;
    exportData(): any[];
    getAvailTopLeft(row: number, col: number, w: number, h: number): false | {
        top: number;
        left: number;
    };
    removeBindPointFromEquipmentModel(id: number, cpntId: number): void;
}
