export declare const get: (url: string, params?: object) => Promise<import('axios').AxiosResponse<any, any, {}>>;
export declare const post: (url: string, data?: object | string, headersType?: string) => Promise<import('axios').AxiosResponse<any, any, {}>>;
export declare const del: (url: string, params?: object) => Promise<import('axios').AxiosResponse<any, any, {}>>;
export declare const getDeviceList: () => Promise<import('axios').AxiosResponse<any, any, {}>>;
export declare const readPoints: (deviceId: any) => Promise<import('axios').AxiosResponse<any, any, {}>>;
export declare const readPointValue: (deviceId: any) => Promise<import('axios').AxiosResponse<any, any, {}>>;
