import * as signalR from "@microsoft/signalr";
export declare class AlarmAnnotationHub {
    connection: signalR.HubConnection | undefined;
    alarmUpdateCallback: ((value: any) => void)[];
    initService(url?: string): void;
    connectionStateChangePromise: Promise<void> | undefined;
    startConnection(): Promise<void>;
    start(callback: (value: any) => void): Promise<void>;
    subscribe(callback: (value: any) => void): void;
    unsubscribe(callback: (value: any) => void): void;
    stop(): Promise<void>;
}
declare const _default: AlarmAnnotationHub;
export default _default;
