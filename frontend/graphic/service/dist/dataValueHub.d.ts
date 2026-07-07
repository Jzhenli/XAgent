import * as signalR from '@microsoft/signalr';
export declare class DataValueHub {
    connection: signalR.HubConnection | undefined;
    subscribedPointAttributes: Map<string, Map<number, (value: any) => void>>;
    initService(url?: string): void;
    startPromise: Promise<void> | undefined;
    startConnection(): Promise<void>;
    subscribe(pointRef: string, attrId: number, callback: (val: any) => void): Promise<void>;
    updateValue(pointRef: string, attrId: number): Promise<void>;
    unsubscribe(pointRef: string, attrId?: number): Promise<void>;
    resubscribeAll(): void;
}
declare const _default: DataValueHub;
export default _default;
