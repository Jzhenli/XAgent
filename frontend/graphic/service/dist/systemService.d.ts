import Eventful from './Eventful';
export declare enum ServiceTypes {
    apiRoot = "apiRoot",
    system = "system",
    userRole = "userRole",
    space = "space",
    network = "network",
    graphic = "graphic",
    pointData = "pointData",
    dataValueHub = "dataValueHub",
    command = "command",
    object = "object",
    trend = "trend",
    schedule = "schedule",
    alarm = "alarm",
    alarmAnnotationHub = "alarmAnnotationHub",
    archive = "archive",
    video = "video",
    nodeRed = "nodeRed",
    videoApiProxy = "videoApiProxy",
    serverConfig = "serverConfig",
    pointDataSimulator = "pointDataSimulator",
    systemAlarm = "systemalarm",
    systemLogic = "systemlogic",
    alarmLogic = "alarmLogic",
    logicClient = "logicClient",
    equipment = "equipment",
    layout = "layout",
    trendStudy = "trend-study",
    systemLog = "systemLog",
    digitalTag = "digitalTag",
    statisticData = "statisticData",
    dataGateway = "dataGateway",
    knx = "knx",
    modbus = "modbus",
    opcua = "opcua",
    navigatorService = "navigatorService",
    customPageService = "customPageService"
}
export type Authorization = {
    name: string;
    value: string;
    isAllow?: boolean;
    children?: Authorization[];
    type?: string;
};
export declare class SystemService extends Eventful {
    inited: boolean;
    currentUser: any;
    authorization: any[];
    baseUrls: Map<ServiceTypes, string>;
    userPermissions: Authorization[];
    permission: any;
    language: string;
    getBaseUrl(type: ServiceTypes): string;
    setPermissions(authData: Authorization[]): void;
    licenseInfo: Record<string, boolean>;
    /**
     *
     */
    init(baseUrls: Map<ServiceTypes, string>): Promise<boolean>;
    login(userName: string, password: string): Promise<{
        success: boolean;
        msg?: string;
        needChangePassword?: boolean;
    }>;
    logout(keepPath?: boolean): Promise<void>;
    refreshToken(): Promise<void>;
    updateUserPermission(): Promise<void>;
    getPermission(): "" | Authorization[];
    /**
     * 先判断按value完全匹配的规则查找权限树中的节点，更新isAllow
     * 再递归更新父节点的isAllow
     *
     * 如果后台没有对应的权限控制，则isAllow始终为True
     *
     * //TODO findTreeNode函数和updateIsAllow函数只在此处使用，考虑移入此函数内
     * //TODO findTreeNode函数不需要返回值，考虑换个名字，如updateNodeByPermissionId
     */
    dealPermission(data: any, authData: Authorization[]): Authorization[];
    updateIsAllow(node: any): any;
    findTreeNode(tree: Authorization[], id: any): any;
    getAuthById(id: string): boolean;
    getLanguage(): string;
    getAccessToken(): any;
    currentArchive: string;
    setArchive(archive: string): void;
    getArchive(): string;
    changePassword(userName: string, password: string, newPassword: string): Promise<{
        success: boolean;
    } | {
        success: boolean;
    }>;
    lastActionTime: number;
    monitorStarted: boolean;
    _updateActionCallback: () => void;
    _startMonitorUserInteraction(): void;
    _stopMonitorUserInteraction(): void;
    authExpirationMonitorInterval: number | null;
    _startMonitorAuthExpiration(): void;
    _stopMonitorAuthExpiration(): void;
    sysConfigMap: Map<string, string>;
    getSystemConfig(key: string, forceUpdate?: boolean): Promise<string>;
    getSystemConfigForce(): Promise<void>;
    removeSystemConfig(key: string): Promise<void>;
    saveSystemConfig(key: string, value: string): Promise<void>;
    saveSystemConfigPending: boolean;
    saveSystemConfigPromise: Promise<void>;
    doSaveSystemConfig(): Promise<void>;
    serverTimeOffsetInitialized: boolean;
    serverTimeOffsetPromise: Promise<number>;
    getServerTimeOffset(): Promise<number>;
    arbitraryInternalRequest(query: {
        url: string;
        method?: 'get' | 'post';
        data?: any;
    }): Promise<unknown>;
    arbitraryExternalRequest(query: {
        url: string;
        method?: 'get' | 'post';
        data?: any;
    }): Promise<any>;
}
export declare const allServices: Map<ServiceTypes, any>;
declare const _default: SystemService;
export default _default;
