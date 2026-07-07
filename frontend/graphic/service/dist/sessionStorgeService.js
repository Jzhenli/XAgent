export var SessionKey;
(function (SessionKey) {
    SessionKey["GraphicEditorItem"] = "GraphicEditorItem";
    SessionKey["DashboardEditorItem"] = "DashboardEditorItem";
    SessionKey["SpaceId"] = "SpaceId";
})(SessionKey || (SessionKey = {}));
export class SessionStorageService {
    getItem(key) {
        return sessionStorage.getItem(key);
    }
    setItem(key, val) {
        sessionStorage.setItem(key, val);
    }
}
const sessionStorageService = new SessionStorageService();
export default sessionStorageService;
//# sourceMappingURL=sessionStorgeService.js.map