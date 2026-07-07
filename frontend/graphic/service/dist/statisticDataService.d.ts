export type StatDataCdt = {
    spaceRef: string[];
    startDate?: string;
    endDate?: string;
    filterByTags?: number[];
    groupByTags?: number[];
};
export type StatDataResultItem = {
    spaceRef?: string;
    groupByTags: number;
    value: number;
    carbonValue: number;
    detailData: {
        time: string;
        value: number;
        carbonValue: number;
    }[] | null;
};
export type StatTrendCdt = StatDataCdt & {
    jMode?: number;
    dMode?: number;
};
export type StatTrendResultItem = {
    spaceRef?: string;
    groupByTags: number;
    carbonValue: number;
    data: {
        time: string;
        value: number;
        carbonValue: number;
    }[];
};
export type MeItem = {
    meterReference: number | string;
    meterName: string;
    location?: string;
    meterType?: number;
    allocationType?: '0' | '1' | '2';
};
export type BuItem = {
    id?: number | string;
    name: string;
    location?: string;
    contact?: string;
    contactInfo?: string;
    area?: string;
    basicCharge?: number;
};
export type BuRelated = BuItem & {
    allocationRatio?: any;
    timingPoint?: any;
    unbandDateTime?: any;
    mappingInfo?: any;
};
export type MeRelated = MeItem & {
    allocationRatio?: any;
    timingPoint?: any;
    unbandDateTime?: any;
    mappingInfo?: any;
};
export type BuDetail = BuItem & {
    meterList?: MeRelated[];
};
export type MeDetail = MeItem & {
    businessList?: BuRelated[];
};
export declare class StatisticDataService {
    queryData(cdt: StatTrendCdt): Promise<StatDataResultItem[]>;
    queryTrend(cdt: StatTrendCdt): Promise<StatTrendResultItem[]>;
    addBusiness(businessInfo: BuItem): Promise<BuItem>;
    editBusiness(businessInfo: BuItem): Promise<BuItem>;
    delBusiness(businessId: string | number): Promise<void>;
    getBusinessData(): Promise<BuItem[]>;
    getBusinessDetail(businessId: string | number): Promise<BuDetail>;
    addBuMeter(businessId: string | number, item: MeRelated): Promise<BuItem[]>;
    editBuMeter(businessId: string | number, item: MeRelated): Promise<BuItem[]>;
    delBuMeter(businessId: string | number, item: MeRelated): Promise<BuItem[]>;
    getBusinessSummary(data: any): Promise<any>;
    getMeterList(spaceId: string): Promise<MeItem[]>;
    getMeterDetail(meterRef: string): Promise<MeDetail>;
    toFixedNum(num: number, pre?: number): string;
}
declare const _default: StatisticDataService;
export default _default;
