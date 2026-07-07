export type CameraWallCamera = {
    cameraRef: string;
    cameraName: string;
    cameraLayoutIndex?: string;
    cameraIP: string;
};
export type CameraWall = {
    spaceRef?: string;
    cameraWallRef?: string;
    cameraWallName: string;
    cameraWallLayout: string;
    cameraWallCameraInfos: CameraWallCamera[];
};
export declare class VideoService {
    listAllVideoServers(): Promise<any>;
    listCamerasByVideoServer(server: string): Promise<CameraWallCamera[]>;
    getCameraPreviewAddress(server: string, cameraRef: string): Promise<string>;
    /**
     * 查询指定Space下的camera wall列表
     */
    getCameraWallsDetailBySpaceRef(spaceRef: string): Promise<CameraWall[]>;
    /**
     * 新增
     */
    createCameraWallWithSpace(cameraWall: CameraWall): Promise<string>;
    /**
     * 删除
     */
    UnbindCameraWall(spaceRef: string, cameraWallRef: string): Promise<unknown>;
    /**
     * 修改
     */
    writeCameraWall(cameraWall: CameraWall): Promise<unknown>;
}
declare const _default: VideoService;
export default _default;
