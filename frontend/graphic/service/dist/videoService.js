import request from "./request";
import systemService, { ServiceTypes, allServices } from "./systemService";
export class VideoService {
    //------------- 视频播放相关 --------------
    async listAllVideoServers() {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.nodeRed),
            url: 'hikservers/list'
        }).then((result) => {
            return result.data;
        });
    }
    async listCamerasByVideoServer(server) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.videoApiProxy),
            url: 'multiServer/camera/list',
            method: 'post',
            data: { server }
        }).then((result) => {
            const list = result.data.list;
            const ret = list.map((item) => ({
                cameraRef: item.indexCode,
                cameraName: item.name,
                cameraIP: server
            }));
            return ret;
        });
    }
    async getCameraPreviewAddress(server, cameraRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.videoApiProxy),
            url: 'multiServer/preview',
            method: 'post',
            data: {
                server,
                protocol: 'wss',
                cameraIndexCode: cameraRef
            }
        }).then((result) => {
            return result.data.url;
        });
    }
    //-------------- 视频墙相关 ---------------
    /**
     * 查询指定Space下的camera wall列表
     */
    async getCameraWallsDetailBySpaceRef(spaceRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.video),
            url: 'CameraWall/GetCameraWallsDetailBySpaceRef',
            method: 'post',
            params: { spaceRef }
        }).then((result) => {
            return result.data;
        });
    }
    /**
     * 新增
     */
    async createCameraWallWithSpace(cameraWall) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.video),
            url: 'CameraWall/CreateCameraWallWithSpace',
            method: 'post',
            data: cameraWall
        }).then((result) => {
            return result.data;
        });
    }
    /**
     * 删除
     */
    async UnbindCameraWall(spaceRef, cameraWallRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.video),
            url: 'Camera/UnbindCameraWall',
            method: 'post',
            data: {
                spaceRef,
                cameraWallRefs: [cameraWallRef]
            }
        });
    }
    /**
     * 修改
     */
    async writeCameraWall(cameraWall) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.video),
            url: 'CameraWall/WriteCameraWall',
            method: 'post',
            data: cameraWall
        });
    }
}
let videoService = allServices.get(ServiceTypes.video);
if (!videoService) {
    videoService = new VideoService();
    allServices.set(ServiceTypes.video, videoService);
}
export default videoService;
//# sourceMappingURL=videoService.js.map