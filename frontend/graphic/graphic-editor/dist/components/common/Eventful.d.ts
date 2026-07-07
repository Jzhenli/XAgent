import { GMouseEventType } from '../mouseHandler/GMouseEvent';

export type EventHandler = (e: any) => void;
declare class Eventful {
    _eventCallback: Map<String, EventHandler[]>;
    on(eventName: string, callback: EventHandler): () => void;
    off(eventName: string, callback?: EventHandler): void;
    dispatch(eventName: string | GMouseEventType, event: any): void;
    eventPenerate(eventName: string | GMouseEventType, event: any): boolean;
}
export default Eventful;
