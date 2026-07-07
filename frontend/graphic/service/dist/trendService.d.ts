/**
 * time: 'yyyy-MM-dd HH:mm:ss',
 */
export type trendData = {
    trendRef: string;
    trendName?: string;
    data: {
        time: string;
        value: any;
    }[];
};
/**
 * startDate, endDate : 'yyyy-MM-dd HH:mm:ss'
 */
export type trendResult = {
    objPartialRef: string;
    jMode: number;
    dMode: number;
    minJMode: number;
    startDate?: string;
    endDate?: string;
    dataList: trendData[];
};
/**
 * jMode: 0-不聚合,1-小时,2-天,3-周,4-月,5-年
 * dMode: 0-平均值,1-最小值,2-最大值,3-中位数
 */
export type trendQueryParam = {
    jMode?: number;
    dMode?: number;
    startDate?: Date;
    endDate?: Date;
};
export type trendStudyItem = {
    contextType: string;
    trendStudyRef: string;
    trendStudyDes: string;
    trendStudyName: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    label: string;
    trendStudyPoints: {
        pointReference: string;
        pointName: string;
    }[];
};
export declare class TrendService {
    getTrendInfoListByPoint(reference: string): Promise<string[]>;
    getTrendLogsByTrendRefs(data: {
        jMode: number;
        dMode: number;
        startDate: Date;
        endDate: Date;
        trendLogRefs: string[];
    }): Promise<trendResult>;
    getTrendListByPoint(pointRef: string, options?: trendQueryParam): Promise<trendResult>;
    getTrendByRef(trendRef: string, options?: trendQueryParam): Promise<trendResult>;
    listTrendStudyBySpaceRef(spaceRef: string): Promise<trendStudyItem[]>;
    getTrendStudyById(id: string, options?: trendQueryParam): Promise<trendResult>;
    getTrendStudyDetail(trendStudyRef: string): Promise<any>;
    setJMode(bindingType: string, jMode: any): number;
    getJMode(bindingType: string, chartJMode: any): string;
    getTextTrendLogs(data: any): Promise<any>;
}
declare const _default: TrendService;
export default _default;
