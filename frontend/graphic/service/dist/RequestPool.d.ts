import { AxiosInstance, AxiosRequestConfig } from "axios";
export default class RequestPool {
    instance: AxiosInstance;
    maxConcurrent: any;
    activeCount: any;
    pendingQueue: {
        config: AxiosRequestConfig;
        resolve: Function;
        reject: Function;
        completed: boolean;
    }[];
    /**
     * 创建并发请求池
     */
    constructor(inst: AxiosInstance, maxConcurrent?: number);
    /**
     * 核心请求方法
     * @param {Object} config - Axios请求配置
     * @returns {Promise} Axios响应Promise
     */
    request(config: AxiosRequestConfig): Promise<unknown>;
    /**
     * 处理队列中的请求
     */
    _processQueue(): void;
    /**
     * 设置最大并发数
     * @param {number} max - 新的最大并发数
     */
    setMaxConcurrent(max: number): void;
    /**
     * GET请求方法
     * @param {string} url - 请求URL
     * @param {Object} config - Axios配置
     * @returns {Promise} Axios响应Promise
     */
    get(url: string, config?: {}): Promise<unknown>;
    /**
     * POST请求方法
     * @param {string} url - 请求URL
     * @param {any} data - 请求数据
     * @param {Object} config - Axios配置
     * @returns {Promise} Axios响应Promise
     */
    post(url: string, data: any, config?: {}): Promise<unknown>;
    /**
     * PUT请求方法
     * @param {string} url - 请求URL
     * @param {any} data - 请求数据
     * @param {Object} config - Axios配置
     * @returns {Promise} Axios响应Promise
     */
    put(url: string, data: any, config?: {}): Promise<unknown>;
    /**
     * DELETE请求方法
     * @param {string} url - 请求URL
     * @param {Object} config - Axios配置
     * @returns {Promise} Axios响应Promise
     */
    delete(url: string, config?: {}): Promise<unknown>;
    /**
     * PATCH请求方法
     * @param {string} url - 请求URL
     * @param {any} data - 请求数据
     * @param {Object} config - Axios配置
     * @returns {Promise} Axios响应Promise
     */
    patch(url: string, data: any, config?: {}): Promise<unknown>;
}
