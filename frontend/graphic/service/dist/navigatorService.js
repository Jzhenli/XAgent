import { allServices, ServiceTypes } from "./systemService";
export class NavigatorService {
    router = null;
    currentRoute = null;
    spaceId = '';
    constructor() {
    }
    setSpaceId(id) {
        this.spaceId = id;
    }
    setRouter(router) {
        this.router = router;
        this.currentRoute = router.currentRoute;
    }
    getRouteQuery() {
        return this.router?.currentRoute.value.query;
    }
    go(query, path) {
        this.router && this.router.push({
            path: path || this.currentRoute?.path || '',
            query: {
                ...this.getRouteQuery(),
                ...query
            }
        });
    }
    jump(path, query = {}) {
        this.router && this.router.push({
            path: path,
            query: {
                ...query
            }
        });
    }
}
let navigatorService = allServices.get(ServiceTypes.navigatorService);
if (!navigatorService) {
    navigatorService = new NavigatorService();
    allServices.set(ServiceTypes.navigatorService, navigatorService);
}
export default navigatorService;
//# sourceMappingURL=navigatorService.js.map