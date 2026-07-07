export declare enum SessionKey {
    'GraphicEditorItem' = "GraphicEditorItem",
    'DashboardEditorItem' = "DashboardEditorItem",
    'SpaceId' = "SpaceId"
}
export declare class SessionStorageService {
    getItem(key: string): string;
    setItem(key: string, val: any): void;
}
declare const sessionStorageService: SessionStorageService;
export default sessionStorageService;
