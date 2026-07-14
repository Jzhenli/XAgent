import { GMouseEventType } from '../mouseHandler/GMouseEvent';
import { default as Draggable } from './Draggable';

declare abstract class Acivation extends Draggable {
    constructor();
    _active: boolean;
    activeType: 'normal' | 'group' | null;
    isActive(): boolean;
    activate(): void;
    deactivate(): void;
    eventPenerate(eventName: string | GMouseEventType, event: any): boolean;
}
export default Acivation;
