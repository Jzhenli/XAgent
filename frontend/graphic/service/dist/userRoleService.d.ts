export declare class UserRoleService {
    getUserDetail(username: string): Promise<any>;
    getUserList(): Promise<any>;
    deleteUser(userName: string): Promise<unknown>;
    createUser(data: any): Promise<unknown>;
    getRoleList(): Promise<any>;
    duplicateUser(data: any): Promise<unknown>;
    updateUserInfo(data: any): Promise<any>;
    saveUserPassword(data: any): Promise<any>;
    saveUserAccess(userName: string, data: any): Promise<any>;
    saveUserPermission(userName: string, data: any): Promise<any>;
    saveRoleInfo(roleName: string, data: any): Promise<any>;
    saveRoleUser(roleName: string, data: any): Promise<any>;
    getRoleDetail(roleName: string): Promise<any>;
    saveRolePermission(roleName: string, data: any): Promise<any>;
    createRole(data: any): Promise<any>;
    duplicateRole(data: any): Promise<any>;
    deleteRole(roleName: string): Promise<any>;
    activateLicense(data: string): Promise<any>;
}
declare const _default: UserRoleService;
export default _default;
