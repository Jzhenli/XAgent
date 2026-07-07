import Eventful from "./Eventful";
export default class NavigationController extends Eventful {
    navigateTo(id: string, params?: any): void;
    changeParams(params: any, isReplace?: boolean): void;
    currentQuery: Record<string, any>;
    useRouterQueryChange(callback: (query: any) => void): void;
    useEvent(eventName: string, callback: (...args: any[]) => void): void;
}
