import { default as Eventful } from './common/Eventful';

declare class GraphicUndoManager extends Eventful {
    hasSaved: boolean;
    undoList: any[];
    redoList: any[];
    clear(): void;
    undo(): void;
    redo(): void;
    updateEditState(data: any): void;
    maxUndoSize: number;
    currentState: any;
    pushPending: boolean;
    pushState(keepChangeSavedState?: boolean): void;
    doPush(): void;
}
declare const graphicUndoManager: GraphicUndoManager;
export default graphicUndoManager;
