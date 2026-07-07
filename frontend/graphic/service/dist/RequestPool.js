export default class RequestPool {
    instance;
    maxConcurrent;
    activeCount;
    pendingQueue;
    /**
     * 创建并发请求池
     */
    constructor(inst, maxConcurrent = 50) {
        // 创建内部axios实例
        this.instance = inst;
        // 请求池配置
        this.maxConcurrent = maxConcurrent;
        this.activeCount = 0;
        this.pendingQueue = [];
        // 绑定实例方法
        this.request = this.request.bind(this);
        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
        this.put = this.put.bind(this);
        this.delete = this.delete.bind(this);
        this.patch = this.patch.bind(this);
    }
    /**
     * 核心请求方法
     * @param {Object} config - Axios请求配置
     * @returns {Promise} Axios响应Promise
     */
    request(config) {
        return new Promise((resolve, reject) => {
            // 创建请求任务
            const requestTask = {
                config,
                resolve,
                reject,
                completed: false,
            };
            // 处理取消令牌
            if (config.cancelToken) {
                config.cancelToken.promise.then((cancel) => {
                    if (!requestTask.completed) {
                        // 从队列中移除未完成的请求
                        const index = this.pendingQueue.indexOf(requestTask);
                        if (index !== -1) {
                            this.pendingQueue.splice(index, 1);
                        }
                        reject(cancel);
                    }
                });
            }
            // 将请求加入队列
            this.pendingQueue.push(requestTask);
            // 尝试处理队列
            this._processQueue();
        });
    }
    /**
     * 处理队列中的请求
     */
    _processQueue() {
        // 当活动请求数未达到最大并发数且队列中有请求时
        while (this.activeCount < this.maxConcurrent && this.pendingQueue.length > 0) {
            this.activeCount++;
            // 取出队列中的第一个请求
            const task = this.pendingQueue.shift();
            // 发送请求
            this.instance
                .request(task.config)
                .then((response) => {
                task.resolve(response);
            })
                .catch((error) => {
                task.reject(error);
            })
                .finally(() => {
                this.activeCount--;
                task.completed = true;
                // 继续处理队列
                this._processQueue();
            });
        }
    }
    /**
     * 设置最大并发数
     * @param {number} max - 新的最大并发数
     */
    setMaxConcurrent(max) {
        if (max > 0) {
            this.maxConcurrent = max;
            // 更新后立即尝试处理队列
            this._processQueue();
        }
    }
    /**
     * GET请求方法
     * @param {string} url - 请求URL
     * @param {Object} config - Axios配置
     * @returns {Promise} Axios响应Promise
     */
    get(url, config = {}) {
        return this.request({
            ...config,
            method: "get",
            url,
        });
    }
    /**
     * POST请求方法
     * @param {string} url - 请求URL
     * @param {any} data - 请求数据
     * @param {Object} config - Axios配置
     * @returns {Promise} Axios响应Promise
     */
    post(url, data, config = {}) {
        return this.request({
            ...config,
            method: "post",
            url,
            data,
        });
    }
    /**
     * PUT请求方法
     * @param {string} url - 请求URL
     * @param {any} data - 请求数据
     * @param {Object} config - Axios配置
     * @returns {Promise} Axios响应Promise
     */
    put(url, data, config = {}) {
        return this.request({
            ...config,
            method: "put",
            url,
            data,
        });
    }
    /**
     * DELETE请求方法
     * @param {string} url - 请求URL
     * @param {Object} config - Axios配置
     * @returns {Promise} Axios响应Promise
     */
    delete(url, config = {}) {
        return this.request({
            ...config,
            method: "delete",
            url,
        });
    }
    /**
     * PATCH请求方法
     * @param {string} url - 请求URL
     * @param {any} data - 请求数据
     * @param {Object} config - Axios配置
     * @returns {Promise} Axios响应Promise
     */
    patch(url, data, config = {}) {
        return this.request({
            ...config,
            method: "patch",
            url,
            data,
        });
    }
}
//# sourceMappingURL=RequestPool.js.map