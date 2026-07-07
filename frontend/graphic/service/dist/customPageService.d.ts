export type CustomPageConfig = {
    id?: string;
    entryName: string;
    entryType: number;
    openType: number;
    contentType: number;
    contentUrl?: string;
    contentData?: File;
    entryPath?: string;
    entryIcon?: string;
};
export declare class CustomPageService {
    listConfig(): Promise<CustomPageConfig[]>;
    saveConfig(config: CustomPageConfig): Promise<any>;
    getFormData(config: CustomPageConfig): FormData;
    deleteConfig(config: CustomPageConfig): Promise<boolean>;
    downloadContent(id: string): Promise<Blob | null>;
}
declare const _default: CustomPageService;
export default _default;
