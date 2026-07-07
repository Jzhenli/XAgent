import request from './request';
import systemService, { ServiceTypes, allServices } from './systemService';
import { extendPrototypeResult as localforage } from 'localforage-indexes';
import lruDriver from 'localforage-lru-driver';
/**
 * @deprecated use layoutService instead
 */
export class GraphicService {
    constructor() {
        this.initCache();
    }
    lruDataCache;
    lruTimeCache;
    async getGraphic(id) {
        const cachedItemTmsp = new Date().getTime();
        const cachedItemData = await this.getItemData(id);
        if (cachedItemTmsp && cachedItemData) {
            return {
                id,
                name: cachedItemData.userName,
                content: cachedItemData.contents,
                lastUpdated: cachedItemTmsp
            };
        }
        else {
            return getGraphicAsync(id).then(data => {
                const tmsp = new Date().getTime();
                this.setItemData(id, data);
                return {
                    id,
                    name: data.userName,
                    content: data.contents,
                    lastUpdated: tmsp
                };
            });
        }
        function getGraphicAsync(id) {
            return request({
                url: 'Graphic/GetGraphicLiteModel',
                method: 'get',
                params: {
                    resourceId: id
                }
            }).then((result) => {
                return result.data;
            });
        }
    }
    async saveGraphic(data, preview) {
        this.setItemData(data.id, null);
        return request({
            url: 'Graphic/UpdateGraphicLite',
            method: 'post',
            data: {
                resourceId: data.id,
                contents: data.content,
                metadata: {
                    preview
                },
                userName: data.name
            }
        });
    }
    /**
     * 获取space下所有的graphic列表
     */
    async getGraphicListBySpaceId(spaceId) {
        const newGraphicListPromise = request({
            url: 'Graphic/GetGraphicsForContext',
            params: {
                contextId: spaceId,
                resourceContextType: 'space',
                isFromGraphicViewer: 'false',
            }
        }).then((data) => {
            return data.data.exceptionGraphics;
        });
        return this.updateTimestampFromList(newGraphicListPromise, spaceId + '_graphic');
    }
    async getDashboardListBySpaceId(spaceId) {
        const newDashboardListPromise = request({
            url: 'Graphic/GetGraphicsForContext',
            params: {
                contextId: spaceId,
                resourceContextType: 'space',
                isFromGraphicViewer: 'false',
                graphicSourceType: 'Dashboard',
            }
        }).then((data) => {
            return data.data.exceptionGraphics;
        });
        return this.updateTimestampFromList(newDashboardListPromise, spaceId + '_dashboard');
    }
    async getPreviewImage(resourceId) {
        return request({
            url: 'Graphic/GetGraphicMetadata',
            params: { resourceId }
        }).then((result) => {
            return result.data?.metadata?.preview || '';
        });
    }
    async updateTimestampFromList(listPromise, cacheName) {
        const lastListPromise = this.getItemTmsp(cacheName);
        Promise.all([listPromise, lastListPromise]).then(([newList, lastList]) => {
            if (!lastList) {
                newList.map(item => {
                    this.setItemData(item.graphicId, null);
                });
            }
            else {
                newList.map(item => {
                    const lastItem = lastList.find(li => li.graphicId == item.graphicId);
                    if (!lastItem) {
                        this.setItemData(item.graphicId, null);
                    }
                    else {
                        const lastTmsp = new Date(lastItem.updateTime).getTime();
                        const newTmsp = new Date(item.updateTime).getTime();
                        if (lastTmsp < newTmsp) {
                            this.setItemData(item.graphicId, null);
                        }
                    }
                });
            }
            this.setItemTmsp(cacheName, newList);
        });
        return listPromise.then(newList => {
            return newList.map(item => ({
                id: item.graphicId,
                name: item.userName,
                preview: '',
                graphicTypes: item.graphicTypes.split(','),
                updateTime: item.updateTime,
            }));
        });
    }
    cacheReadyPromise = Promise.resolve();
    initCache() {
        console.log('initializating localforage...');
        this.cacheReadyPromise = localforage.defineDriver(lruDriver).then(() => {
            const dataCache = localforage.createInstance({
                name: 'dataCache',
                driver: 'lruStorage',
                cacheSize: 300,
            });
            this.lruDataCache = dataCache;
            const timeCache = localforage.createInstance({
                name: 'timeCache',
                driver: 'lruStorage',
                cacheSize: 300,
            });
            this.lruTimeCache = timeCache;
            return Promise.all([dataCache.ready(), timeCache.ready()]);
        }).then(() => {
            console.log('localforage is ready.');
        }).catch((err) => {
            console.log(err);
        });
    }
    async setItemTmsp(key, content) {
        const archive = systemService.getArchive();
        try {
            await this.cacheReadyPromise;
            this.cacheReadyPromise = this.lruTimeCache.setItem(archive + '_' + key, content);
        }
        catch (err) {
            console.log(err);
        }
    }
    async getItemTmsp(key) {
        const archive = systemService.getArchive();
        try {
            await this.cacheReadyPromise;
            return await this.lruTimeCache.getItem(archive + '_' + key);
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
    async getItemData(key) {
        const archive = systemService.getArchive();
        try {
            await this.cacheReadyPromise;
            return await this.lruDataCache.getItem(archive + '_' + key);
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }
    async setItemData(key, content) {
        const archive = systemService.getArchive();
        try {
            await this.cacheReadyPromise;
            this.cacheReadyPromise = this.lruDataCache.setItem(archive + '_' + key, content);
        }
        catch (err) {
            console.log(err);
        }
    }
    async clearXmsGraphicCache() {
        await this.cacheReadyPromise;
        const ct = this.lruTimeCache.keys().then((result) => {
            const clearTimeCache = result.map(key => {
                if (/^xms|^XMS/.test(key)) {
                    return this.lruTimeCache.removeItem(key);
                }
                else {
                    return Promise.resolve();
                }
            });
            return Promise.all(clearTimeCache);
        });
        const cd = this.lruDataCache.keys().then((result) => {
            const clearDataCache = result.map(key => {
                if (/^xms|^XMS/.test(key)) {
                    return this.lruDataCache.removeItem(key);
                }
                else {
                    return Promise.resolve();
                }
            });
            return Promise.all(clearDataCache);
        });
        return Promise.all([ct, cd]).then(() => {
            console.log('xms 相关的缓存已全部清除');
        });
    }
}
let graphicService = allServices.get(ServiceTypes.graphic);
if (!graphicService) {
    graphicService = new GraphicService();
    allServices.set(ServiceTypes.graphic, graphicService);
}
export default graphicService;
//# sourceMappingURL=graphicService.js.map