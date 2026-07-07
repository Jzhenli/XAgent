/**
 * login, logout, authentication, authorization, profile
 */
import Cookies from 'js-cookie';
import request, { setBaseUrl } from './request';
import Eventful from './Eventful';
import { setArchiveRequestBaseUrl } from './archiveRequest';
import { t } from './languages';
import axios from 'axios';
export var ServiceTypes;
(function (ServiceTypes) {
    ServiceTypes["apiRoot"] = "apiRoot";
    ServiceTypes["system"] = "system";
    ServiceTypes["userRole"] = "userRole";
    ServiceTypes["space"] = "space";
    ServiceTypes["network"] = "network";
    ServiceTypes["graphic"] = "graphic";
    ServiceTypes["pointData"] = "pointData";
    ServiceTypes["dataValueHub"] = "dataValueHub";
    ServiceTypes["command"] = "command";
    ServiceTypes["object"] = "object";
    ServiceTypes["trend"] = "trend";
    ServiceTypes["schedule"] = "schedule";
    ServiceTypes["alarm"] = "alarm";
    ServiceTypes["alarmAnnotationHub"] = "alarmAnnotationHub";
    ServiceTypes["archive"] = "archive";
    ServiceTypes["video"] = "video";
    ServiceTypes["nodeRed"] = "nodeRed";
    ServiceTypes["videoApiProxy"] = "videoApiProxy";
    ServiceTypes["serverConfig"] = "serverConfig";
    ServiceTypes["pointDataSimulator"] = "pointDataSimulator";
    ServiceTypes["systemAlarm"] = "systemalarm";
    ServiceTypes["systemLogic"] = "systemlogic";
    ServiceTypes["alarmLogic"] = "alarmLogic";
    ServiceTypes["logicClient"] = "logicClient";
    ServiceTypes["equipment"] = "equipment";
    ServiceTypes["layout"] = "layout";
    ServiceTypes["trendStudy"] = "trend-study";
    ServiceTypes["systemLog"] = "systemLog";
    ServiceTypes["digitalTag"] = "digitalTag";
    ServiceTypes["statisticData"] = "statisticData";
    ServiceTypes["dataGateway"] = "dataGateway";
    ServiceTypes["knx"] = "knx";
    ServiceTypes["modbus"] = "modbus";
    ServiceTypes["opcua"] = "opcua";
    ServiceTypes["navigatorService"] = "navigatorService";
    ServiceTypes["customPageService"] = "customPageService";
})(ServiceTypes || (ServiceTypes = {}));
const dynamicBase = window.__dynamicBase__;
export class SystemService extends Eventful {
    inited = false;
    currentUser = null;
    authorization = [];
    baseUrls = new Map();
    userPermissions = []; //权限树
    permission = []; //后台权限列表
    language = 'zh';
    getBaseUrl(type) {
        return this.baseUrls.get(type);
    }
    setPermissions(authData) {
        this.userPermissions = authData;
    }
    licenseInfo = {};
    /**
     *
     */
    async init(baseUrls) {
        if (!this.inited) {
            this.baseUrls = baseUrls;
            const baseUrl = this.baseUrls.get(ServiceTypes.system);
            if (!baseUrl) {
                throw t('系统API根路径地址未设置');
            }
            else {
                setBaseUrl(baseUrl);
                setArchiveRequestBaseUrl(baseUrl);
            }
            const lastUser = localStorage.getItem('UserInfo' + dynamicBase);
            if (lastUser) {
                this.currentUser = JSON.parse(lastUser);
            }
            this.inited = true;
            this.licenseInfo = JSON.parse(localStorage.getItem('licenseInfo' + dynamicBase) || '{}');
            await this.refreshToken();
            await this.updateUserPermission();
            this._startMonitorUserInteraction();
            this._startMonitorAuthExpiration();
            this.dispatch('login');
            return true;
        }
        return true;
    }
    async login(userName, password) {
        return request({
            baseURL: this.baseUrls.get(ServiceTypes.userRole),
            url: 'user/login',
            method: 'post',
            data: {
                userName,
                password
            }
        })
            .then(async (result) => {
            if (result.isNeedChangePassword) {
                return { success: true, needChangePassword: true };
            }
            Cookies.set('AccessToken' + dynamicBase, result.token.accessToken, { expires: result.token.expiresIn / 3600 / 24 });
            this.currentUser = result.userInfo;
            localStorage.setItem('authencatedAt' + dynamicBase, new Date().getTime().toString());
            localStorage.setItem('expirePeriod' + dynamicBase, result.userInfo.sessionExpireSeconds.toString());
            localStorage.setItem('UserInfo' + dynamicBase, JSON.stringify(result.userInfo));
            localStorage.setItem('licenseInfo' + dynamicBase, JSON.stringify(result.licenseInfo));
            this.licenseInfo = result.licenseInfo;
            await this.updateUserPermission();
            this._startMonitorUserInteraction();
            this._startMonitorAuthExpiration();
            this.dispatch('login');
            return { success: true };
        })
            .catch((err) => {
            if (err.code === 400) {
                if (err.data?.code === -1) {
                    return { success: false, msg: t('用户名或密码错误') };
                }
                else if (err.data?.code === -2) {
                    return { success: false, msg: t('当前账户已被禁用') };
                }
                else if (err.data?.code === -3) {
                    return { success: false, msg: t('密码错误超过3次，当前账户已被锁定，请15min后再尝试') };
                }
            }
            return { success: false, msg: t('服务器异常，请稍后再试') };
        });
    }
    async logout(keepPath) {
        Cookies.remove('AccessToken' + dynamicBase);
        localStorage.removeItem('UserInfo' + dynamicBase);
        this.currentUser = null;
        this._stopMonitorUserInteraction();
        this._stopMonitorAuthExpiration();
        this.dispatch('logout', { keepPath });
    }
    async refreshToken() {
        return request({
            baseURL: this.baseUrls.get(ServiceTypes.userRole),
            url: 'user/refreshtoken'
        }).then((result) => {
            Cookies.set('AccessToken' + dynamicBase, result.token.accessToken, { expires: result.token.expiresIn / 3600 / 24 });
            this.currentUser = result.userInfo;
            localStorage.setItem('authencatedAt' + dynamicBase, new Date().getTime().toString());
            localStorage.setItem('expirePeriod' + dynamicBase, result.userInfo.sessionExpireSeconds.toString());
            localStorage.setItem('UserInfo' + dynamicBase, JSON.stringify(result.userInfo));
        });
    }
    //--------------------权限处理----------------
    async updateUserPermission() {
        if (!this.currentUser) {
            return;
        }
        return request({
            baseURL: this.baseUrls.get(ServiceTypes.userRole),
            url: `user/${this.currentUser.userName}/userinfo`
        }).then((result) => {
            this.permission = result.permissions.userPermissions;
            this.language = result.profile.language;
            this.userPermissions = this.dealPermission(result.permissions.userPermissions, this.userPermissions);
            const _userProfile = {
                ...result.profile,
                ...result.permissions.accountPolicies,
                ...result.permissions.systemPolicies,
                ...result.permissions.userStatus
            };
            localStorage.setItem('UserProfile' + dynamicBase, JSON.stringify(_userProfile));
        }).catch(res => {
            console.log(res);
        });
    }
    getPermission() {
        return this.userPermissions || '';
    }
    /**
     * 先判断按value完全匹配的规则查找权限树中的节点，更新isAllow
     * 再递归更新父节点的isAllow
     *
     * 如果后台没有对应的权限控制，则isAllow始终为True
     *
     * //TODO findTreeNode函数和updateIsAllow函数只在此处使用，考虑移入此函数内
     * //TODO findTreeNode函数不需要返回值，考虑换个名字，如updateNodeByPermissionId
     */
    dealPermission(data, authData) {
        for (let key in data) {
            this.findTreeNode(authData, key);
        }
        authData.forEach((e) => this.updateIsAllow(e));
        return authData;
    }
    updateIsAllow(node) {
        if (!node.children || node.children.length === 0) {
            // 叶子节点，不处理
            return node.isAllow ?? false;
        }
        // 递归处理所有子节点
        const childrenIsAllow = node.children.map((e) => this.updateIsAllow(e));
        // 设置当前节点的 isAllow，任一子节点为 true 即为 true
        node.isAllow = childrenIsAllow.some((val) => val === true);
        return node.isAllow;
    }
    findTreeNode(tree, id) {
        for (let node of tree) {
            if (node.value == id) {
                node.isAllow = this.permission[id].slice(0, 1) == '1' ? true : false;
                return node;
            }
            if (node.children && node.children.length > 0) {
                let fondNode = this.findTreeNode(node.children, id);
                if (fondNode) {
                    return fondNode;
                }
            }
        }
        return null;
    }
    //根据后台权限列表id，获取当前权限
    getAuthById(id) {
        for (let key in this.permission) {
            if (key === id) {
                if (this.permission[key].slice(0, 1) == '1') {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        return null;
    }
    //-----------获取当前语言--------------
    getLanguage() {
        return this.language;
    }
    getAccessToken() {
        const storageUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storageUser.userId && this.currentUser?.userId && storageUser.userId != this.currentUser.userId) {
            location.reload();
        }
        return Cookies.get('AccessToken' + dynamicBase) || '';
    }
    currentArchive = sessionStorage.getItem('CurrentArchive') || 'xms';
    setArchive(archive) {
        this.currentArchive = archive;
        sessionStorage.setItem('CurrentArchive', archive);
    }
    getArchive() {
        return this.currentArchive;
    }
    async changePassword(userName, password, newPassword) {
        return request({
            baseURL: this.baseUrls.get(ServiceTypes.userRole),
            url: 'user/resetpassword',
            method: 'post',
            data: { userName, oldPassword: password, newPassword, confirmPassword: newPassword }
        })
            .then(() => {
            return { success: true };
        })
            .catch(err => {
            console.log(err);
            return { success: false };
        });
    }
    //--------------------用户Session管理（ 超时不操作自动登出，自动刷新Token ）----------------
    lastActionTime = new Date().getTime();
    monitorStarted = false;
    _updateActionCallback = () => {
        this.lastActionTime = new Date().getTime();
    };
    _startMonitorUserInteraction() {
        this._updateActionCallback();
        if (!this.monitorStarted) {
            document.body.addEventListener('mouseup', this._updateActionCallback);
            document.body.addEventListener('keyup', this._updateActionCallback);
            this.monitorStarted = true;
        }
    }
    _stopMonitorUserInteraction() {
        if (this.monitorStarted) {
            document.body.removeEventListener('mouseup', this._updateActionCallback);
            document.body.removeEventListener('keyup', this._updateActionCallback);
            this.monitorStarted = false;
        }
    }
    authExpirationMonitorInterval = null;
    _startMonitorAuthExpiration() {
        if (!this.authExpirationMonitorInterval) {
            const isExpired = () => {
                if (this.currentUser.isNeverExpireSession) {
                    return false;
                }
                const expirePeriod = parseInt(localStorage.getItem('expirePeriod' + dynamicBase) || '0');
                const authencatedAt = parseInt(localStorage.getItem('authencatedAt' + dynamicBase) || '0');
                if (this.lastActionTime < authencatedAt) {
                    this.lastActionTime = authencatedAt;
                }
                const ret = this.lastActionTime + expirePeriod * 1000 < new Date().getTime();
                // 如果后台超时时间过了一半，期间有鼠标或键盘事件，则触发一次后台的token更新
                const halfExpire = authencatedAt + (expirePeriod * 1000 / 2);
                if (halfExpire < new Date().getTime() && halfExpire < this.lastActionTime) {
                    this.refreshToken();
                }
                return ret;
            };
            this.authExpirationMonitorInterval = window.setInterval(() => {
                const authencatedAt = parseInt(localStorage.getItem('authencatedAt' + dynamicBase) || '0');
                if (isExpired()) {
                    this.logout();
                }
                else {
                    // 如果永不超时，每隔55分钟更新一次session超时时间
                    if (authencatedAt + 1000 * 60 * 55 < new Date().getTime() && this.currentUser.isNeverExpireSession) {
                        this.refreshToken();
                    }
                }
            }, 5000);
        }
    }
    _stopMonitorAuthExpiration() {
        if (this.authExpirationMonitorInterval) {
            window.clearInterval(this.authExpirationMonitorInterval);
            this.authExpirationMonitorInterval = null;
        }
    }
    sysConfigMap = new Map();
    async getSystemConfig(key, forceUpdate) {
        const exists = this.sysConfigMap.has(key);
        if (!exists || forceUpdate) {
            return this.getSystemConfigForce().then(() => {
                return this.sysConfigMap.get(key);
            });
        }
        else {
            return this.sysConfigMap.get(key);
        }
    }
    async getSystemConfigForce() {
        return request({
            url: 'ClientConfiguration/GetSystemConfig'
        }).then((result) => {
            const data = result.data;
            data?.forEach(item => {
                if (item.configValue) {
                    this.sysConfigMap.set(item.configKey, item.configValue);
                }
            });
        });
    }
    async removeSystemConfig(key) {
        this.sysConfigMap.delete(key);
        await Promise.resolve();
        return this.doSaveSystemConfig();
    }
    async saveSystemConfig(key, value) {
        this.sysConfigMap.set(key, value);
        await Promise.resolve();
        return this.doSaveSystemConfig();
    }
    saveSystemConfigPending = false;
    saveSystemConfigPromise = Promise.resolve();
    async doSaveSystemConfig() {
        if (!this.saveSystemConfigPending) {
            const data = [];
            this.sysConfigMap.forEach((value, key) => {
                data.push({
                    configKey: key,
                    configValue: value
                });
            });
            this.saveSystemConfigPromise = request({
                url: 'ClientConfiguration/SaveSystemConfig',
                method: 'post',
                data
            }).then(() => {
                this.saveSystemConfigPending = false;
            });
            this.saveSystemConfigPending = true;
        }
        return this.saveSystemConfigPromise;
    }
    serverTimeOffsetInitialized = false;
    serverTimeOffsetPromise = Promise.resolve(0);
    async getServerTimeOffset() {
        if (this.serverTimeOffsetInitialized) {
            return this.serverTimeOffsetPromise;
        }
        this.serverTimeOffsetPromise = request({
            url: 'ClientConfiguration/GetTimeOffset',
            method: 'get'
        }).then((result) => result.data);
        this.serverTimeOffsetInitialized = true;
        return this.serverTimeOffsetPromise;
    }
    async arbitraryInternalRequest(query) {
        return request({
            baseURL: this.getBaseUrl(ServiceTypes.apiRoot),
            method: 'get',
            ...query
        });
    }
    async arbitraryExternalRequest(query) {
        return axios({
            ...query
        }).then(result => {
            return result.data;
        }).catch(err => {
            return err.message;
        });
    }
}
let _allServices = window.allServices;
if (!_allServices) {
    _allServices = new Map();
    window.allServices = _allServices;
}
export const allServices = _allServices;
let systemService = _allServices.get(ServiceTypes.system);
if (!systemService) {
    systemService = new SystemService();
    allServices.set(ServiceTypes.system, systemService);
}
export default systemService;
//# sourceMappingURL=systemService.js.map