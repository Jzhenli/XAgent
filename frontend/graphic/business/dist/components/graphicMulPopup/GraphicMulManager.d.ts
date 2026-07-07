import { default as Eventful } from '@x-plateform-mono/service/dist/Eventful';
import { default as DataAccessManager } from '../dataBinder/DataAccessManager';
import { DataModelBinding, DataModelVirtual, BindedPoint } from '../dataBinder/DataBindingTypes';
export type MulPopupBindingValue = {
    type: 'dashboard' | 'chart' | 'points';
    dashboardValue?: {
        name: string;
        reference: string;
    };
    dashboardAttr: {
        position: string;
    };
    chartValue?: {
        name: string;
        reference: string;
    };
    chartAttr: {
        width: number;
        height: number;
        offsetX: number;
        offsetY: number;
    };
    pointsItems?: {
        pointBindings: (BindedPoint | {
            cpntId: number;
            innerName?: string;
        })[];
        dataModels: DataModelVirtual[];
        modelBindings: DataModelBinding[];
    };
    pointsAttr: {
        width: number;
        height: number;
        offsetX: number;
        offsetY: number;
    };
    triggerType?: 'hover' | 'clickToggle' | 'clickActive' | 'always';
    customConfig?: MulCustomConfig;
};
export type MulCustomConfig = {
    allowEditShow?: boolean;
    editShow?: boolean;
};
export type MulCustomBinding = {
    uqId: string | number;
    onUpdatePosition?: (callback: (position: {
        t: number;
        b: number;
        l: number;
        r: number;
    }, anchorCenter: {
        x: number;
        y: number;
    }, zoom?: number) => void) => {};
    className?: string;
    optionSetter?: () => {};
};
declare class GraphicMulManager extends Eventful {
    options: any;
    popComponet: any;
    popRef: any;
    offUpdatePosition: () => void;
    init(options: {
        uqId: number | string | undefined;
        item: MulPopupBindingValue;
        componetRender: Map<string, any>;
        canvasSize: {
            width: number;
            height: number;
        };
        transform?: {
            transformX: number;
            transformY: number;
        };
        border?: {
            left: number;
            right: number;
            top: number;
            bottom: number;
            isAddBorder?: boolean;
        };
        manager?: DataAccessManager;
        evt: {
            x: number;
            y: number;
        };
    }): void;
    getPosition(x: number, y: number): any[];
    getDashboardPosition(item: MulPopupBindingValue): void;
    getDashboardData(item: MulPopupBindingValue): void;
    getChartData(item: MulPopupBindingValue): void;
    getPointsData(item: MulPopupBindingValue): void;
    getPopData(item: MulPopupBindingValue): void;
    updatePosition(updateCallback: MulCustomBinding): void;
    clearMulPopup(): void;
    setValue(name: string, value: any): void;
    dispose(): void;
}
export default GraphicMulManager;
