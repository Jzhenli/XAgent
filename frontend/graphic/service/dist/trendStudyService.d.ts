export declare class TrendStudyService {
    getTrendListBySpace(spaceId: string): Promise<any>;
    modifyTrendStudy(data: any): Promise<any>;
    createTrendStudyWithSpace(data: any): Promise<any>;
    deleteTrendStudy(trendId: string): Promise<any>;
}
declare const _default: TrendStudyService;
export default _default;
