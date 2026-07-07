export interface IHistoryManager {
    undo(): Promise<void>;
    redo(): Promise<void>;
    pushState(command: Command): void;
}
export interface Command {
    undo(): Promise<void>;
    redo(): Promise<void>;
    getDescription(): string;
}
