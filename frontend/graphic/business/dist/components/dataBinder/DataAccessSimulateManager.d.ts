import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';
import { BindedPoint } from './DataBindingTypes';
import { default as DataAccessManager } from './DataAccessManager';
export default class DataAccessSimulateManager extends DataAccessManager {
    simPanelData: Map<string, {
        pointName: string;
        pointType: PointAttrValueType;
        isInValid: boolean;
        equipName?: string;
    }>;
    setPointBindings(list: ([
        BindedPoint | undefined,
        ((value: any, type?: PointAttrValueType, translatedText?: string) => void) | undefined
    ])[]): Promise<any[]>;
    unsubscribePoint(): void;
    triggerPoint(pointRef: string, value: any): void;
    getSimPanelData(): Map<string, {
        pointName: string;
        pointType: PointAttrValueType;
        isInValid: boolean;
        equipName?: string;
    }>;
    subAccessManagers: DataAccessSimulateManager[];
    createSubManager(): DataAccessManager;
}
