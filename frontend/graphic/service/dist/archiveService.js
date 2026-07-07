import { useArchiveRequest } from "./archiveRequest";
import { t } from "./languages";
import request from "./request";
import spaceService from "./spaceService";
import systemService, { ServiceTypes, allServices } from "./systemService";
export class ArchiveService {
    async listArchives() {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.archive),
            url: 'Xct/GetArchives',
        }).then((response) => {
            return response.data.map(item => ({
                id: item.archiveName,
                name: item.viewName
            }));
        });
    }
    async backupList(archiveId) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.archive),
            url: 'Xct/GetAllBackups',
        }).then((response) => {
            let respList = [];
            if (archiveId !== '') {
                respList = response?.data?.filter((i) => i.archiveName === archiveId);
            }
            respList = respList?.map(item => ({
                id: item.id,
                name: item.archiveName,
                backupLocation: item.backupLocation,
                date: new Date(item.backupDate).toLocaleString(),
                note: item.backupNote,
                isLocked: item.isLocked,
                size: item.backupSize,
                isHaveFile: item.isHaveFile,
            }));
            return this.dataResort(respList);
        })
            .catch((error) => {
            return Promise.reject(error);
        });
    }
    dataResort(arr) {
        var newArr = [];
        arr.forEach(function (oldData, i) {
            var index = -1;
            var alreadyExists = newArr.some(function (newData, j) {
                if (oldData.date.split(' ')?.[0] === newData.date.split(' ')?.[0]) {
                    index = j;
                    return true;
                }
            });
            if (!alreadyExists) {
                var res = [];
                res.push(oldData);
                newArr.push({
                    date: oldData.date.split(' ')?.[0],
                    list: res
                });
            }
            else {
                newArr[index].list.push(oldData);
            }
        });
        return newArr;
    }
    async deleteBackup(archiveName, backupId) {
        return useArchiveRequest('post', { archiveName }, 'Xct/DeleteBackup?backupId=' + backupId)
            .then((respose) => {
            return respose;
        })
            .catch((error) => { return Promise.reject(error); });
    }
    async downloadBackup(id) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.archive),
            method: 'get',
            url: 'Xct/DownloadBackup',
            params: { backupId: id },
            responseType: 'blob',
        })
            .then((res) => {
            console.log(res);
            let blob = new Blob([res], { type: "application/x-zip-compressed;" }); // 为blob设置文件类型 
            let url = window.URL.createObjectURL(blob); // 创建一个临时的url指向blob对象
            let a = document.createElement("a");
            a.href = url;
            a.download = 'backup' + new Date().getTime();
            a.click();
            // 释放这个临时的对象url
            window.URL.revokeObjectURL(url);
        })
            .catch((error) => {
            return Promise.reject({ code: 1, message: "操作失败" });
        });
    }
    async importBackup(archiveName, data) {
        return useArchiveRequest('post', {
            archiveName,
            'Content-Type': 'multipart/form-data'
        }, 'Xct/ImportBackup', data)
            .then((respose) => {
            if (respose?.successed) {
                return respose.data;
            }
            return Promise.reject({ code: 1, message: respose?.errorMessage });
        })
            .catch((error) => {
            return Promise.reject({ code: 1, message: t('操作失败') });
        });
    }
    async restoreBackup(archiveName) {
        return useArchiveRequest('post', { archiveName }, 'Xct/RestoreBackup')
            .then((respose) => { return respose; })
            .catch((error) => { return Promise.reject(error); });
    }
    async operList(archiveName, data) {
        // let pdata : any = {
        //     //"operResult": formParam.actionResults,
        //     "operEndTime": formParam.actionEndDate1,
        //     "operStartTime": formParam.actionStartDate1,
        //     "operContext": formParam.actionValue
        // }
        // if(formParam.actionResults.length > 1){
        //     pdata.operResult = ''; 
        // }else{
        //     pdata.operResult = formParam.actionResults[0];
        // }
        return useArchiveRequest('post', { archiveName }, 'Xct/GetArchiveOperRecord', data)
            .then((respose) => {
            return respose;
        })
            .catch((error) => {
            return Promise.reject(error);
        });
    }
    async operDelete(data) {
        return useArchiveRequest('post', undefined, 'Xct/DeleteArchiveOperRecord', data)
            .then((respose) => {
            return respose;
        })
            .catch((error) => {
            return Promise.reject(error);
        });
    }
    async renameArchive(archiveName, newName) {
        return useArchiveRequest('post', { archiveName }, 'Xct/RenameArchive?newName=' + newName, null)
            .then((respose) => {
            // systemService.setArchive(archiveName)
            return respose;
        })
            .catch((error) => { return Promise.reject(error); });
    }
    async downloadArchive(archiveName) {
        return useArchiveRequest('post', { archiveName }, 'Xct/DownloadTo', null)
            .then((respose) => { return respose; })
            .catch((error) => { return Promise.reject(error); });
    }
    async waitDownUploadFinish() {
        return useArchiveRequest('get', undefined, 'Xct/IsDownUploadEnd', null)
            .then((respose) => { return respose; })
            .catch((error) => { return Promise.reject(error); });
    }
    async refreshCache(archiveName) {
        return useArchiveRequest('post', { archiveName }, 'Xct/RefreshCache', null)
            .then((respose) => { return respose; })
            .catch((error) => { return Promise.reject(error); });
    }
    async deleteArchive(archiveName) {
        return useArchiveRequest('post', { archiveName }, 'Xct/DeleteArchive', null)
            .then((respose) => {
            return respose;
        })
            .catch((error) => {
            return Promise.reject(error);
        });
    }
    async uploadArchive(archiveName) {
        spaceService.getChildrenCache.clear();
        return useArchiveRequest('post', { archiveName }, 'Xct/UploadFrom', null)
            .then((respose) => { return respose; })
            .catch((error) => { return Promise.reject(error); });
    }
    async addArchive(archiveName) {
        return useArchiveRequest('post', { archiveName }, 'Xct/CreateArchive')
            .then((respose) => {
            return respose;
        })
            .catch((error) => {
            return Promise.reject(error);
        });
    }
    // 废弃
    async initializeArchive(archiveName) {
        return useArchiveRequest('post', { archiveName }, 'Graphic/InitArchive')
            .then((respose) => { return respose; })
            .catch((error) => { return Promise.reject(error); });
    }
    async createBackup(archiveName, backupNote) {
        return useArchiveRequest('post', { archiveName }, 'Xct/CreateBackup?backupNote=' + backupNote)
            .then((respose) => {
            return respose;
        })
            .catch((error) => {
            return Promise.reject(error);
        });
    }
    async waitBackupFinish() {
        return useArchiveRequest('get', undefined, 'Xct/IsBackupEnd', null)
            .then((respose) => { return respose; })
            .catch((error) => { return Promise.reject(error); });
    }
}
let archiveService = allServices.get(ServiceTypes.archive);
if (!archiveService) {
    archiveService = new ArchiveService();
    allServices.set(ServiceTypes.archive, archiveService);
}
export default archiveService;
//# sourceMappingURL=archiveService.js.map