export type archiveItem = {
    id: string;
    name: string;
};
export declare class ArchiveService {
    listArchives(): Promise<archiveItem[]>;
    backupList(archiveId: string): Promise<any[]>;
    dataResort(arr: any[]): any[];
    deleteBackup(archiveName: string, backupId: number): Promise<any>;
    downloadBackup(id: number): Promise<void>;
    importBackup(archiveName: string, data: any): Promise<any>;
    restoreBackup(archiveName: string): Promise<any>;
    operList(archiveName: string, data: {
        operContext?: string;
        operStartTime?: string;
        operEndTime?: string;
        operResult?: string;
    }): Promise<any>;
    operDelete(data: any): Promise<any>;
    renameArchive(archiveName: string, newName: string): Promise<any>;
    downloadArchive(archiveName: string): Promise<any>;
    waitDownUploadFinish(): Promise<any>;
    refreshCache(archiveName: string): Promise<any>;
    deleteArchive(archiveName: string): Promise<any>;
    uploadArchive(archiveName: string): Promise<any>;
    addArchive(archiveName: string): Promise<any>;
    initializeArchive(archiveName: string): Promise<any>;
    createBackup(archiveName: string, backupNote: string): Promise<any>;
    waitBackupFinish(): Promise<any>;
}
declare const _default: ArchiveService;
export default _default;
