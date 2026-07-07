export type EventHandler = (e?: any, ...args: any[]) => void;
declare class Eventful {
    _eventCallback: Map<String, EventHandler[]>;
    on(eventName: string, callback: EventHandler): () => void;
    off(eventName: string, callback?: EventHandler): void;
    dispatch(eventName: string, event?: any, ...args: any[]): void;
}
export default Eventful;
