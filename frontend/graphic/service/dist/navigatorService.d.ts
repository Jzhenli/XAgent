interface MainRouter {
    currentRoute: {
        path: string;
        fullPath?: string;
        query?: any;
        value: Route;
    };
    push: (route: Route) => {};
}
interface Route {
    path: string;
    fullPath?: string;
    query?: any;
}
export declare class NavigatorService {
    router: MainRouter | null;
    currentRoute: {
        path: string;
        fullPath?: string;
        query?: any;
        value: Route;
    } | null;
    spaceId: string;
    constructor();
    setSpaceId(id: string): void;
    setRouter(router: MainRouter): void;
    getRouteQuery(): any;
    go(query: any, path?: string): void;
    jump(path: string, query?: any): void;
}
declare let navigatorService: any;
export default navigatorService;
