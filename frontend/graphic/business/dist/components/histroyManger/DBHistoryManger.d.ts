import { DataModelVirtual } from '../dataBinder/DataBindingTypes';
import { default as DataBindingValidator } from '../dataBinder/DataBindingValidator';
import { Command, IHistoryManager } from './IHistoryManager';
export default class DBHistoryManger extends DataBindingValidator implements IHistoryManager {
    dataModels: DataModelVirtual[];
    undoList: Command[][];
    redoList: Command[][];
    nextCommandGroup: Command[];
    pushPending: boolean;
    pushPendingPromise: Promise<void>;
    undo(): Promise<void>;
    redo(): Promise<void>;
    pushState(command: Command): void;
}
export declare class AddDataModelCommand implements Command {
    addProps: DataModelVirtual;
    historyManger: DBHistoryManger;
    constructor(props: DataModelVirtual, manager: DBHistoryManger);
    undo(): Promise<void>;
    redo(): Promise<void>;
    getDescription(): string;
}
export declare class DeleteDataModelCommand implements Command {
    deleteProps: {
        model: DataModelVirtual;
        idx: number;
    };
    historyManger: DBHistoryManger;
    constructor(props: {
        model: DataModelVirtual;
        idx: number;
    }, manager: DBHistoryManger);
    undo(): Promise<void>;
    redo(): Promise<void>;
    getDescription(): string;
}
export declare class ChangeDataModelNameCommand implements Command {
    changeNameProps: {
        prevState: string;
        nextState: string;
        innerRef: number;
    };
    historyManger: DBHistoryManger;
    constructor(props: {
        prevState: string;
        nextState: string;
        innerRef: number;
    }, manager: DBHistoryManger);
    undo(): Promise<void>;
    redo(): Promise<void>;
    getDescription(): string;
}
export declare class RemoveBindingCommand implements Command {
    removeProps: {
        id: number;
        cpntId: number;
        innerName?: string;
    };
    historyManger: DBHistoryManger;
    idxs: number[][];
    constructor(props: {
        cpntId: number;
        id: number;
        innerName?: string;
    }, manager: DBHistoryManger);
    undo(): Promise<void>;
    redo(): Promise<void>;
    getDescription(): string;
    getPointBindingItemIdxs(id: number, cpntId: number): number[][];
}
