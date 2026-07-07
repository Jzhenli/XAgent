export declare class AlarmService {
    getUnAcknowledgeAlarmsCount(): Promise<number>;
    getLatestAlarm(): Promise<any>;
    acknowledgeAlarms(refList: string[], message: string): Promise<any>;
    discardAlarm(refList: string[], message: string): Promise<any>;
    getPriortyCategory(): Promise<any>;
    getAlarms(pdata: any): Promise<any>;
    getHistroy(pointRef: string): Promise<any>;
    getAlarmAnnotation(alarmId: string): Promise<any>;
    annotationAlarm(pdata: any): Promise<any>;
    getAlarmTypeData(): any[];
    getAlarmTypeName(type: any): string;
    getAlarmSourceData(): any[];
    getAlarmSourceName(type: any): string;
    setPriortyCategory(pdata: any): Promise<unknown>;
}
declare const _default: AlarmService;
export default _default;
