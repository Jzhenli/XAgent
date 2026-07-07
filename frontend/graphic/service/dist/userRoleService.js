/**
 * user, role, 增删改查
 */
import { t } from "./languages";
import request from "./request";
import systemService, { ServiceTypes, allServices } from "./systemService";
export class UserRoleService {
    async getUserDetail(username) {
        username = encodeURIComponent(username);
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.userRole),
            url: `user/${username}/userinfo`
        }).then((result) => {
            return result || 0;
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t("操作失败") });
        });
    }
    async getUserList() {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.userRole),
            url: `user/getallusers`
        }).then((result) => {
            return result || 0;
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t("操作失败") });
        });
    }
    async deleteUser(userName) {
        userName = encodeURIComponent(userName);
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.userRole),
            url: `user/delete?username=` + userName,
            method: 'delete'
        });
    }
    async createUser(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.userRole),
            url: `user/add`,
            method: 'post',
            data
        });
    }
    async getRoleList() {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.userRole),
            url: `role/list`
        }).then((result) => {
            return result?.map((e) => {
                return {
                    label: e.name,
                    value: e.name,
                    description: e.description,
                    id: e.id,
                    totalUsers: e.totalUsers,
                    userDefined: e.userDefined,
                    name: e.name,
                    userNames: e.userNames
                };
            });
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t("操作失败") });
        });
    }
    async duplicateUser(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.userRole),
            url: `user/duplicate`,
            method: 'post',
            data
        });
    }
    async updateUserInfo(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.userRole),
            url: `user/updateprofile`,
            method: 'post',
            data
        }).then((result) => {
            return result;
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t("操作失败") });
        });
    }
    async saveUserPassword(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.userRole),
            url: `user/changepwd`,
            method: 'put',
            data: data
        }).then((result) => {
            return result;
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t("操作失败") });
        });
    }
    async saveUserAccess(userName, data) {
        userName = encodeURIComponent(userName);
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.userRole),
            url: `user/${userName}/save/accessinfo`,
            method: 'put',
            data
        }).then((result) => {
            return result;
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t("操作失败") });
        });
    }
    async saveUserPermission(userName, data) {
        userName = encodeURIComponent(userName);
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.userRole),
            url: `user/${userName}/save/permission`,
            method: 'put',
            data
        }).then((result) => {
            return result;
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t("操作失败") });
        });
    }
    async saveRoleInfo(roleName, data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.userRole),
            url: `role/save/basicinfo`,
            method: 'put',
            data: { ...data, roleName },
        }).then((result) => {
            return result;
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t("操作失败") });
        });
    }
    async saveRoleUser(roleName, data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.userRole),
            url: `role/save/users`,
            method: 'put',
            data: { ...data, roleName },
        }).then((result) => {
            return result;
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t("操作失败") });
        });
    }
    async getRoleDetail(roleName) {
        roleName = encodeURIComponent(roleName);
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.userRole),
            url: `role/${roleName}/detail`
        }).then((result) => {
            return result;
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t("操作失败") });
        });
    }
    async saveRolePermission(roleName, data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.userRole),
            url: `role/save/permission`,
            method: "put",
            data: { ...data, roleName },
        }).then((result) => {
            return result;
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t("操作失败") });
        });
    }
    async createRole(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.userRole),
            url: `role/add`,
            method: "post",
            data
        }).then((result) => {
            return result;
        }).catch((error) => {
            if (error.code == 409) {
                return Promise.reject({ code: 409, message: t("已存在该角色") });
            }
            return Promise.reject({ code: 1, message: t("操作失败") });
        });
    }
    async duplicateRole(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.userRole),
            url: `role/copy`,
            method: "post",
            data
        }).then((result) => {
            return result;
        }).catch((error) => {
            if (error.code == 409) {
                return Promise.reject({ code: 409, message: t("已存在该角色") });
            }
            return Promise.reject({ code: 1, message: t("操作失败") });
        });
    }
    async deleteRole(roleName) {
        roleName = encodeURIComponent(roleName);
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.userRole),
            url: `/role/delete?roleName=` + roleName,
            method: "delete"
        }).then((result) => {
            return result;
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t("操作失败") });
        });
    }
    async activateLicense(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.userRole),
            url: `/license/register`,
            method: "post",
            data
        }).then((result) => {
            return result;
        }).catch((error) => {
            return Promise.reject({ code: 1, message: t("操作失败"), error });
        });
    }
}
let userRoleService = allServices.get(ServiceTypes.userRole);
if (!userRoleService) {
    userRoleService = new UserRoleService();
    allServices.set(ServiceTypes.userRole, userRoleService);
}
export default userRoleService;
//# sourceMappingURL=userRoleService.js.map