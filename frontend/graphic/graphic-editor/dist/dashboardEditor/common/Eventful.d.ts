export type EventHandler = (e: any) => void;
declare class Eventful {
    _eventCallback: Map<String, EventHandler[]>;
    on(eventName: string, callback: EventHandler): void;
    off(eventName: string, callback?: EventHandler): void;
    dispatch(eventName: string, event: any): void;
    eventPenerate(eventName: string, event: any): boolean;
}
export default Eventful;
