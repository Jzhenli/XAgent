import { useArchiveRequest } from "./archiveRequest";
import request from "./request";
import { ServiceTypes, allServices } from "./systemService";
export class SpaceService {
    spaceIdSet = new Set();
    async listSpaceItems(spaceId) {
        if (!spaceId) {
            this.spaceIdSet.clear();
        }
        let res = await this.getChildren(spaceId);
        for (let item of res) {
            if (!this.spaceIdSet.has(item.spaceId)) {
                this.spaceIdSet.add(item.spaceId);
            }
            // 如果该空间项有子空间，递归调用
            if (item.hasChild) {
                await this.listSpaceItems(item.spaceId); // 确保递归完成后再继续
            }
        }
    }
    getSpaceStatus = false;
    async getAllSpace() {
        if (this.spaceIdSet.size === 0 || this.getSpaceStatus == true) {
            this.getSpaceStatus = true;
            await this.listSpaceItems();
            this.getSpaceStatus = false;
        }
        return Array.from(this.spaceIdSet);
    }
    getChildrenCache = new Map();
    async getChildren(spaceId) {
        if (this.getChildrenCache.has(spaceId)) {
            return this.getChildrenCache.get(spaceId);
        }
        else {
            let ret = request({
                url: 'Space/GetSpaceChild',
                params: { spaceId }
            }).then((data) => {
                return data.data;
            });
            this.getChildrenCache.set(spaceId, ret);
            return ret;
        }
    }
    async getAncestors(spaceId) {
        return request({
            url: 'Space/GetSpaceAncestors',
            params: { spaceId }
        }).then((data) => {
            return data.data;
        });
    }
    // 废弃
    async getSpaceItem(spaceId) {
        return request({
            url: 'Space/GetSpaceDetailFast',
            params: {
                spaceId
            }
        }).then((data) => {
            return data.data;
        });
    }
    async getObjectCategory(language) {
        return useArchiveRequest('get', undefined, 'Space/GetSpaceTypeItems?localCulture=' + language)
            .then((respose) => { return respose; })
            .catch((error) => { return Promise.reject(error); });
    }
    async getSpaceDetail(archiveName, spaceId) {
        return useArchiveRequest('get', { archiveName }, 'Space/GetSpaceDetail', null, { spaceId: spaceId })
            .then((respose) => { return respose; })
            .catch((error) => { return Promise.reject(error); });
    }
    async addSpace(archiveName, space) {
        this.getChildrenCache.clear();
        return useArchiveRequest('post', { archiveName }, 'Space/CreateSpace', space)
            .then((respose) => {
            this.listSpaceItems();
            return respose;
        })
            .catch((error) => { return Promise.reject(error); });
    }
    async deleteSpace(archiveName, spaceId) {
        this.getChildrenCache.clear();
        return useArchiveRequest('post', { archiveName }, 'Space/DeleteSpace?spaceId=' + spaceId)
            .then((respose) => {
            this.listSpaceItems();
            return respose;
        })
            .catch((error) => { return Promise.reject(error); });
    }
    async modifySpace(archiveName, space) {
        this.getChildrenCache.clear();
        return useArchiveRequest('post', { archiveName }, 'Space/ModifySpace', space)
            .then((respose) => {
            this.listSpaceItems();
            return respose;
        })
            .catch((error) => { return Promise.reject(error); });
    }
    async moveSpace(archiveName, ids) {
        this.getChildrenCache.clear();
        return useArchiveRequest('post', { archiveName }, 'Space/MoveSpace?ids=' + ids)
            .then((respose) => { return respose; })
            .catch((error) => { return Promise.reject(error); });
    }
}
let spaceService = allServices.get(ServiceTypes.space);
if (!spaceService) {
    spaceService = new SpaceService();
    allServices.set(ServiceTypes.space, spaceService);
}
export default spaceService;
//# sourceMappingURL=spaceService.js.map