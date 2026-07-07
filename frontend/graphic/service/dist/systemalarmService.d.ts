export type SystemAlarmFlowModel = {
    CreateDateTime?: string;
    Description: string;
    Id?: number;
    LastModifyDateTime?: string;
    Name: string;
    Rule: string;
    SpaceRef: string;
};
export type addAlarmRuleRequest = {
    ArchiveName: string;
    SystemAlarmFlowModel: SystemAlarmFlowModel;
};
export type SystemLogic = {
    id: number;
    name: string;
    type: 'system' | 'alarm';
    ruleId: string;
    spaceRef: string;
    description: string;
    rule: string;
    createDateTime: string;
    lastModifyDateTime: string;
};
export declare class SystemAlarmService {
    getFlowsByType(params: {
        type: string;
    }): Promise<unknown>;
    getFlowsBySpaceType(params: {
        spaceRef: string;
        type: string;
    }, filterType?: string): Promise<SystemLogic[]>;
    getFlowById(id: number): Promise<SystemLogic>;
    addFlow(data: any): Promise<unknown>;
    editFlow(data: any): Promise<unknown>;
    deleteFlow(id: number): Promise<unknown>;
    getUnAcknowledgeAlarmsCount(params: {
        archiveName: string;
        spaceRef: string;
    }): Promise<unknown>;
    addAlarmRule(data: addAlarmRuleRequest): Promise<unknown>;
    deleteAlarmRule(data: {
        ArchiveName: string;
        Id: number;
        SpaceRef: string;
    }): Promise<unknown>;
    editAlarmRule(data: addAlarmRuleRequest): Promise<unknown>;
}
declare const _default: SystemAlarmService;
export default _default;
