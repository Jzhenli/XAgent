import { ImportFileOption } from '@x-plateform-mono/common/dist/components/utils/FileTools';
import { read as xlsxRead } from 'xlsx';
export type FileProcessOption = {
    title?: string;
    suffix?: string;
    editorPlaceholder?: string;
    initName?: string;
    nameMaxLength?: number;
    rename?: boolean;
    type?: 'string' | 'image' | 'binary';
    deflate?: boolean;
    encrypt?: boolean;
    encryptKey?: string;
    validate?: Function;
};
declare function exportMute(content: string | Blob | ArrayBuffer, fileName: string, fileProcessOption?: FileProcessOption): Promise<void>;
declare function exportPopup(content: string | Blob | ArrayBuffer, fileProcessOption?: FileProcessOption): void;
/**
 * importOption中multiple必须为false，只选一个对象
 * @param importOption
 * @param fileProcessOption
 */
declare function importMute(importOption?: ImportFileOption, fileProcessOption?: FileProcessOption): Promise<[content: any, fileName: string]>;
declare function importPopup(importOption?: ImportFileOption, fileProcessOption?: FileProcessOption): Promise<[content: any, name: string]>;
declare function downloadAsXlsx(json: Array<any>, fileName: string): void;
declare const _default: {
    exportMute: typeof exportMute;
    importMute: typeof importMute;
    exportPopup: typeof exportPopup;
    importPopup: typeof importPopup;
    downloadAsXlsx: typeof downloadAsXlsx;
    xlsxRead: typeof xlsxRead;
    xlsxUtils: import('xlsx').XLSX$Utils;
};
export default _default;
