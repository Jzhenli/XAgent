declare const baseService: import("axios").AxiosInstance;
export default baseService;
export declare function setArchiveRequestBaseUrl(url: string): void;
export declare function useArchiveRequest(method?: string, headers?: Record<string, string>, url?: string, data?: any, pparams?: any | null): Promise<any>;
