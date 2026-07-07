import systemService, { allServices, ServiceTypes } from "./systemService";
import request from "./request";
import { format, subDays } from 'date-fns';
import { t } from './languages';
export const tagLabelName = [t("能源"), t("电力"), t("照明"), t("一般照明"), t("公共区域照明"), t("景观照明"), t("专用插座"), t("暖通空调用电"), t("冷机"), t("锅炉"), t("冷却塔"), t("水泵"), t("空气处理机组"), t("送排风机"), t("风机盘管"), t("变频器"), t("工业用电"), t("机器设备"), t("生产线"), t("电动机"), t("照明系统"), t("辅助设施"), t("特殊用电"), t("用水"), t("燃气"), t("煤"), t("环境"), t("温度"), t("湿度"), t("压力"), t("一氧化碳浓度"), t("PM2.5"), t("PM10")];
export class DigitalTagService {
    async listTags() {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.digitalTag),
            url: 'label/list',
            method: 'get',
        }).then((res) => {
            let tagsList = res.map((item) => ({
                id: item.Id,
                value: item.LabelValue, // energy#electricity
                name: item.IsSystemReserved ? t(item.LabelName) || item.LabelName : item.LabelName,
                color: item.LabelColor,
                predifined: item.IsSystemReserved
            }));
            return tagsList;
        });
        // const listStr = localStorage.getItem('digitalTagList');
        // return JSON.parse(listStr || '[]');
    }
    async listTagsByParent(value, tagsList) {
        const list = tagsList ? tagsList : await this.listTags();
        return list.filter(item => item.value.startsWith(value) && item.value !== value);
    }
    async tagValueExists(value, tagsList) {
        const list = tagsList ? tagsList : await this.listTags();
        return list.find(item => item.value === value);
    }
    async getOrganizedTagTree(tagsList) {
        const list = tagsList ? tagsList : await this.listTags();
        const nodes = list.map((item) => {
            return {
                ...item,
                tagSegs: item.value.split('#'),
            };
        });
        nodes.sort((a, b) => {
            const minLen = Math.min(a.tagSegs.length, b.tagSegs.length);
            for (let i = 0; i < minLen; i++) {
                const valA = a.tagSegs[i];
                const valB = b.tagSegs[i];
                if (valA !== valB) {
                    return valA.localeCompare(valB);
                }
            }
            return a.tagSegs.length - b.tagSegs.length;
        });
        function organizeTreePart(l, level, start, end) {
            const partialResult = [];
            let lastDirectChild = null;
            let nextStart = start;
            let nextStop = start;
            for (let i = start; i < end; i++) {
                const item = l[i];
                if (item.tagSegs.length === level + 1) {
                    if (lastDirectChild && nextStart < nextStop) {
                        lastDirectChild.children = organizeTreePart(l, level + 1, nextStart, nextStop);
                        lastDirectChild.hasChildren = true;
                    }
                    lastDirectChild = item;
                    nextStart = nextStop = i + 1;
                    partialResult.push(item);
                }
                else {
                    nextStop = i + 1;
                }
            }
            if (lastDirectChild && nextStart < nextStop) {
                lastDirectChild.children = organizeTreePart(l, level + 1, nextStart, nextStop);
                lastDirectChild.hasChildren = true;
            }
            return partialResult;
        }
        return organizeTreePart(nodes, 0, 0, nodes.length);
    }
    /**
     * 当id存在时修改id对应的tag，否则添加tag
     * 保存完成后返回带id的list
     */
    async saveTags(list) {
        // localStorage.setItem('digitalTagList', JSON.stringify(tagList));
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.digitalTag),
            url: 'label/save',
            method: 'post',
            data: list.map(item => ({
                Id: item.id,
                LabelValue: item.value, // energy#electricity
                LabelName: item.name,
                LabelColor: item.color,
                IsSystemReserved: item.predifined,
            }))
        }).then((res) => res.data.map((item) => ({
            id: item.Id,
            value: item.LabelValue, // energy#electricity
            name: item.LabelName,
            color: item.LabelColor,
            predifined: item.IsSystemReserved,
        })));
    }
    async deleteTags(tagsList) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.digitalTag),
            url: 'label/delete',
            method: 'delete',
            data: tagsList.map(item => ({
                Id: item.id,
                LabelValue: item.value, // energy#electricity
                LabelName: item.name,
                LabelColor: item.color,
                IsSystemReserved: item.predifined,
            }))
        });
        // localStorage.setItem('digitalTagList', JSON.stringify(tagList));
    }
    setfactor(data) {
        data?.factors && data.factors.sort((a, b) => (a.startDate).split('-').join('') - b.startDate.split('-').join(''));
        data?.factors && data.factors.forEach((item, i) => {
            item.id = String(Number(i) + 1);
            item.startDate = item.startDate + ' 00:00:00';
            let list = data.factors || [];
            if (i < list.length - 1) {
                item.endDate = format(subDays(new Date(list[i + 1].startDate), 1), 'yyyy-MM-dd') + ' 23:59:59';
            }
            else {
                item.endDate = new Date(list[i].startDate).getFullYear() + '-12-31 23:59:59';
            }
        });
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.digitalTag),
            url: 'carbon/setfactor',
            method: 'post',
            data: data
        }).then((data) => {
            return data;
        });
    }
    getfactor(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.digitalTag),
            url: 'carbon/getfactor',
            method: 'get',
            params: data
        }).then((data) => {
            return data;
        });
    }
    recalc(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.digitalTag),
            url: 'carbon/recalc',
            method: 'post',
            data: data
        }).then((data) => {
            return data;
        });
    }
    debounceTimeout = 1000 * 60;
    lastUpdate = -this.debounceTimeout - 1;
    tagListPromiseDebounce = Promise.resolve([]);
    async listTagsDebounce() {
        const now = performance.now();
        if (now - this.lastUpdate > this.debounceTimeout) {
            this.tagListPromiseDebounce = this.listTags();
            this.lastUpdate = now;
        }
        return this.tagListPromiseDebounce;
    }
    async queryTagsWithChildren(tagsIdList) {
        let tagsTree = await this.getOrganizedTagTree(await this.listTagsDebounce());
        let retTags = [];
        let tags = [];
        for (let i = 0; i < tagsIdList.length; i++) {
            let tag = this.deepFind(tagsTree, tagsIdList[i]);
            tags.push(tag);
        }
        this.deepGet(tags, retTags);
        return retTags;
    }
    async queryTagsWithChildrenTree(tagsIdList) {
        let tagsTree = await this.getOrganizedTagTree(await this.listTagsDebounce());
        let tags = [];
        for (let i = 0; i < tagsIdList.length; i++) {
            let tag = this.deepFind(tagsTree, tagsIdList[i]);
            tags.push(tag);
        }
        return tags;
    }
    deepGet(tagsTree, ret) {
        for (let node of tagsTree) {
            ret.push(node);
            if (node.children && node.children.length > 0) {
                this.deepGet(node.children, ret);
            }
        }
    }
    deepFind(tagsTree, tagId) {
        for (let node of tagsTree) {
            if (node.id === tagId) {
                return node;
            }
            if (node.children && node.children.length > 0) {
                let ret = this.deepFind(node.children, tagId);
                if (ret) {
                    return ret;
                }
            }
        }
        return null;
    }
    async getOEE(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.digitalTag),
            url: 'oee/summary',
            params: data
        }).then((data) => {
            return data;
        });
    }
    async downloadReport(serialNo) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.digitalTag),
            url: 'oee/downloadreport',
            params: { serialNo },
            responseType: 'blob'
        }).then((data) => {
            const filename = `${serialNo}.xlsx`;
            // 创建下载链接
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = decodeURIComponent(filename); // 处理中文文件名
            document.body.appendChild(link);
            link.click();
            // 清理
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
        });
    }
}
let digitalTagService = allServices.get(ServiceTypes.digitalTag);
if (!digitalTagService) {
    digitalTagService = new DigitalTagService();
    allServices.set(ServiceTypes.digitalTag, digitalTagService);
}
export default digitalTagService;
//# sourceMappingURL=digitalTagService.js.map